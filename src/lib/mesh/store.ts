import { create } from "zustand";
import { exchangeOauth, mutateDevice, pullTailnet } from "./api";
import { applyLabEdits, summarize } from "./device";
import { buildLab, seedHistory } from "./demo";
import { asRecord, clampNum, errMessage } from "./guard";
import { tryParseHuJSON } from "./normalize";
import {
  DEFAULT_RULES,
  EMPTY_EXTRAS,
  LAB_ORIGIN,
  type AppMode,
  type AuthKind,
  type Finding,
  type FleetFilter,
  type FleetSort,
  type HistoryPoint,
  type Incident,
  type LabEdit,
  type MeshDevice,
  type TailnetExtras,
  type ViewId,
  type WatchRules,
} from "./types";
import { diffIncidents, evaluate } from "./watchdog";

const PREFS_KEY = "meshwarden.prefs.v1";

const bootDevices = applyLabEdits(buildLab(0, LAB_ORIGIN), {}, LAB_ORIGIN);
const bootFindings = evaluate(bootDevices, DEFAULT_RULES, LAB_ORIGIN);

function bootNote(at: number): Incident {
  return {
    incidentId: "boot",
    kind: "note",
    at,
    severity: "info",
    title: "Lab board opened",
    detail: "Hearthline is a fictional tailnet. Nothing here is your network.",
    deviceId: null,
  };
}

function sanitizeRules(value: unknown): WatchRules {
  const record = asRecord(value) ?? {};
  const base = DEFAULT_RULES;
  return {
    offlineMinutes: clampNum(record.offlineMinutes, 1, 1440, base.offlineMinutes),
    keyExpiryDays: clampNum(record.keyExpiryDays, 1, 365, base.keyExpiryDays),
    maxDerpMs: clampNum(record.maxDerpMs, 20, 2000, base.maxDerpMs),
    minClientVersion:
      typeof record.minClientVersion === "string" ? record.minClientVersion.slice(0, 32) : base.minClientVersion,
    flagKeyExpiryDisabled:
      typeof record.flagKeyExpiryDisabled === "boolean" ? record.flagKeyExpiryDisabled : base.flagKeyExpiryDisabled,
    flagUnauthorized: typeof record.flagUnauthorized === "boolean" ? record.flagUnauthorized : base.flagUnauthorized,
    flagUpdateAvailable:
      typeof record.flagUpdateAvailable === "boolean" ? record.flagUpdateAvailable : base.flagUpdateAvailable,
    flagRelayOnly: typeof record.flagRelayOnly === "boolean" ? record.flagRelayOnly : base.flagRelayOnly,
    flagExternal: typeof record.flagExternal === "boolean" ? record.flagExternal : base.flagExternal,
    flagExitNodeDown: typeof record.flagExitNodeDown === "boolean" ? record.flagExitNodeDown : base.flagExitNodeDown,
    flagSubnetDown: typeof record.flagSubnetDown === "boolean" ? record.flagSubnetDown : base.flagSubnetDown,
  };
}

function persistPrefs(rules: WatchRules, pollSec: number, tailnet: string, authKind: AuthKind) {
  if (typeof window === "undefined") return;
  const payload = { rules, pollSec, tailnet, authKind };
  localStorage.setItem(PREFS_KEY, JSON.stringify(payload));
}

type MeshState = {
  view: ViewId;
  mode: AppMode;
  query: string;
  filter: FleetFilter;
  sort: FleetSort;
  selectedId: string | null;
  devices: MeshDevice[];
  history: HistoryPoint[];
  findings: Finding[];
  knownFindingIds: string[];
  incidents: Incident[];
  rules: WatchRules;
  extras: TailnetExtras;
  tailnet: string;
  authKind: AuthKind;
  token: string;
  clientId: string;
  clientSecret: string;
  tokenExpiresAt: number | null;
  allowActions: boolean;
  pollSec: 15 | 30 | 60;
  linkGeneration: number;
  syncing: boolean;
  lastSync: number | null;
  lastError: string | null;
  tick: number;
  clock: number;
  clockAligned: boolean;
  uiNow: number | null;
  labEdits: Record<string, LabEdit>;
  setView: (view: ViewId) => void;
  setQuery: (query: string) => void;
  setFilter: (filter: FleetFilter) => void;
  setSort: (sort: FleetSort) => void;
  select: (id: string | null) => void;
  setDraft: (patch: Partial<Pick<MeshState, "tailnet" | "authKind" | "token" | "clientId" | "clientSecret">>) => void;
  setPollSec: (pollSec: 15 | 30 | 60) => void;
  setAllowActions: (armed: boolean) => void;
  updateRules: (patch: Partial<WatchRules>) => void;
  enterLab: () => void;
  enterLive: () => void;
  markLinked: () => void;
  disconnect: () => void;
  resetLab: () => void;
  alignClock: () => void;
  loadPrefs: () => void;
  tickLab: () => void;
  touchClock: () => void;
  sync: () => Promise<void>;
  authorize: (id: string, authorized: boolean) => Promise<"lab" | "live">;
  expire: (id: string) => Promise<"lab" | "live">;
  remove: (id: string) => Promise<"lab" | "live">;
  setRoutes: (id: string, routes: string[]) => Promise<"lab" | "live">;
};

function recompute(
  devices: MeshDevice[],
  rules: WatchRules,
  now: number,
  previous: Finding[],
  known: string[],
  incidents: Incident[],
) {
  const findings = evaluate(devices, rules, now);
  const diff = diffIncidents(previous, findings, known, now);
  return {
    devices,
    findings,
    knownFindingIds: diff.known,
    incidents: [...diff.incidents, ...incidents].slice(0, 80),
  };
}

function labSnapshot(tick: number, now: number, edits: Record<string, LabEdit>, rules: WatchRules, previous: Finding[], known: string[], incidents: Incident[]) {
  const devices = applyLabEdits(buildLab(tick, now), edits, now);
  return {
    ...recompute(devices, rules, now, previous, known, incidents),
    historyPoint: summarize(devices, now),
  };
}

export const useMesh = create<MeshState>((set, get) => ({
  view: "board",
  mode: "lab",
  query: "",
  filter: "all",
  sort: "attention",
  selectedId: null,
  devices: bootDevices,
  history: seedHistory(LAB_ORIGIN, 0, {}),
  findings: bootFindings,
  knownFindingIds: bootFindings.map((finding) => finding.id),
  incidents: [bootNote(LAB_ORIGIN)],
  rules: DEFAULT_RULES,
  extras: EMPTY_EXTRAS,
  tailnet: "-",
  authKind: "token",
  token: "",
  clientId: "",
  clientSecret: "",
  tokenExpiresAt: null,
  allowActions: false,
  pollSec: 30,
  linkGeneration: 0,
  syncing: false,
  lastSync: null,
  lastError: null,
  tick: 0,
  clock: LAB_ORIGIN,
  clockAligned: false,
  uiNow: null,
  labEdits: {},

  setView: (view) => set({ view }),
  setQuery: (query) => set({ query }),
  setFilter: (filter) => set({ filter }),
  setSort: (sort) => set({ sort }),
  select: (selectedId) => set({ selectedId }),
  setDraft: (patch) => set(patch),
  setPollSec: (pollSec) => {
    set({ pollSec });
    const state = get();
    persistPrefs(state.rules, pollSec, state.tailnet, state.authKind);
  },
  setAllowActions: (allowActions) => set({ allowActions }),
  updateRules: (patch) => {
    const state = get();
    const rules = sanitizeRules({ ...state.rules, ...patch });
    const now = state.uiNow ?? state.clock;
    set({ rules, ...recompute(state.devices, rules, now, state.findings, state.knownFindingIds, state.incidents) });
    persistPrefs(rules, state.pollSec, state.tailnet, state.authKind);
  },
  enterLab: () => {
    const state = get();
    const now = Date.now();
    const devices = applyLabEdits(buildLab(0, now), state.labEdits, now);
    const findings = evaluate(devices, state.rules, now);
    set({
      mode: "lab",
      tick: 0,
      clock: now,
      clockAligned: true,
      uiNow: now,
      allowActions: false,
      syncing: false,
      lastError: null,
      selectedId: null,
      extras: EMPTY_EXTRAS,
      devices,
      findings,
      knownFindingIds: findings.map((finding) => finding.id),
      history: seedHistory(now, 0, state.labEdits),
      incidents: [bootNote(now)],
    });
  },
  enterLive: () => {
    set({
      mode: "live",
      devices: [],
      history: [],
      findings: [],
      knownFindingIds: [],
      incidents: [],
      extras: EMPTY_EXTRAS,
      selectedId: null,
      lastError: null,
      lastSync: null,
      allowActions: false,
    });
  },
  markLinked: () => set((state) => ({ linkGeneration: state.linkGeneration + 1, lastError: null })),
  disconnect: () =>
    set({
      token: "",
      clientId: "",
      clientSecret: "",
      tokenExpiresAt: null,
      allowActions: false,
      linkGeneration: 0,
      devices: [],
      history: [],
      findings: [],
      knownFindingIds: [],
      incidents: [],
      extras: EMPTY_EXTRAS,
      selectedId: null,
      lastSync: null,
      lastError: null,
      syncing: false,
    }),
  resetLab: () => {
    const now = Date.now();
    const state = get();
    const devices = buildLab(0, now);
    const findings = evaluate(devices, state.rules, now);
    set({
      mode: "lab",
      tick: 0,
      clock: now,
      clockAligned: true,
      uiNow: now,
      labEdits: {},
      allowActions: false,
      selectedId: null,
      extras: EMPTY_EXTRAS,
      lastError: null,
      devices,
      findings,
      knownFindingIds: findings.map((finding) => finding.id),
      history: seedHistory(now, 0, {}),
      incidents: [bootNote(now)],
    });
  },
  alignClock: () => {
    const now = Date.now();
    const state = get();
    if (state.mode !== "lab") {
      set({ clock: now, uiNow: now, clockAligned: true });
      return;
    }
    const devices = applyLabEdits(buildLab(state.tick, now), state.labEdits, now);
    const findings = evaluate(devices, state.rules, now);
    set({
      clock: now,
      uiNow: now,
      clockAligned: true,
      devices,
      findings,
      history: seedHistory(now, state.tick, state.labEdits),
      incidents: state.incidents.map((incident) =>
        incident.at === LAB_ORIGIN ? { ...incident, at: now } : incident,
      ),
    });
  },
  loadPrefs: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (!raw) return;
      const parsed = asRecord(JSON.parse(raw) as unknown);
      if (!parsed) return;
      const state = get();
      const rules = parsed.rules ? sanitizeRules(parsed.rules) : state.rules;
      const pollSec = parsed.pollSec === 15 || parsed.pollSec === 30 || parsed.pollSec === 60 ? parsed.pollSec : state.pollSec;
      const tailnet = typeof parsed.tailnet === "string" ? parsed.tailnet.slice(0, 253) : state.tailnet;
      const authKind: AuthKind = parsed.authKind === "oauth" ? "oauth" : "token";
      const now = state.uiNow ?? state.clock;
      const findings = evaluate(state.devices, rules, now);
      set({
        rules,
        pollSec,
        tailnet,
        authKind,
        findings,
        knownFindingIds: findings.map((finding) => finding.id),
      });
    } catch {
      /* Ignore broken local prefs. They never contain a credential. */
    }
  },
  tickLab: () => {
    const state = get();
    if (state.mode !== "lab") return;
    if (typeof document !== "undefined" && document.hidden) return;
    const tick = state.tick + 1;
    const now = state.clockAligned ? Date.now() : state.clock + 2000;
    const snap = labSnapshot(tick, now, state.labEdits, state.rules, state.findings, state.knownFindingIds, state.incidents);
    set({
      tick,
      clock: now,
      uiNow: now,
      devices: snap.devices,
      findings: snap.findings,
      knownFindingIds: snap.knownFindingIds,
      incidents: snap.incidents,
      history: [...state.history, snap.historyPoint].slice(-48),
    });
  },
  touchClock: () => set({ uiNow: Date.now() }),
  sync: async () => {
    const state = get();
    if (state.mode !== "live" || state.syncing || state.linkGeneration === 0) return;
    set({ syncing: true });
    try {
      let token = state.token;
      if (state.authKind === "oauth") {
        const stale = !token || !state.tokenExpiresAt || state.tokenExpiresAt < Date.now() + 60_000;
        if (stale) {
          if (!state.clientId || !state.clientSecret) throw new Error("OAuth client id and secret are required.");
          const exchanged = await exchangeOauth({
            data: { clientId: state.clientId, clientSecret: state.clientSecret },
          });
          token = exchanged.accessToken;
          set({ token, tokenExpiresAt: Date.now() + exchanged.expiresIn * 1000 });
        }
      }
      if (!token) throw new Error("Paste a credential before watching.");
      const pulled = await pullTailnet({ data: { token, tailnet: get().tailnet || "-" } });
      const now = Date.now();
      const devices = pulled.devices;
      const current = get();
      const next = recompute(devices, current.rules, now, current.findings, current.knownFindingIds, current.incidents);
      set({
        ...next,
        extras: {
          nameservers: pulled.nameservers,
          magicDNS: pulled.magicDNS,
          searchPaths: pulled.searchPaths,
          acl: pulled.aclText ? tryParseHuJSON(pulled.aclText) : null,
          aclText: pulled.aclText,
          notes: pulled.notes,
        },
        history: [...current.history, summarize(devices, now)].slice(-48),
        clock: now,
        uiNow: now,
        lastSync: now,
        lastError: null,
        syncing: false,
        selectedId: next.devices.some((device) => device.id === current.selectedId) ? current.selectedId : null,
      });
    } catch (error) {
      const message = errMessage(error);
      const rejected = /rejected|refused|expired|mistyped|required/i.test(message);
      set({
        syncing: false,
        lastError: message,
        token: rejected && get().authKind === "token" ? "" : get().token,
        linkGeneration: rejected ? 0 : get().linkGeneration,
      });
    }
  },
  authorize: async (id, authorized) => {
    const state = get();
    if (state.mode === "lab") {
      const labEdits = { ...state.labEdits, [id]: { ...state.labEdits[id], authorized } };
      const now = state.uiNow ?? state.clock;
      const snap = labSnapshot(state.tick, now, labEdits, state.rules, state.findings, state.knownFindingIds, state.incidents);
      set({ labEdits, devices: snap.devices, findings: snap.findings, knownFindingIds: snap.knownFindingIds, incidents: snap.incidents });
      return "lab";
    }
    if (!state.token) throw new Error("Link a credential first.");
    await mutateDevice({ data: { token: state.token, op: "authorize", deviceId: id, authorized, routes: [] } });
    await get().sync();
    return "live";
  },
  expire: async (id) => {
    const state = get();
    if (state.mode === "lab") {
      const labEdits = { ...state.labEdits, [id]: { ...state.labEdits[id], expired: true } };
      const now = state.uiNow ?? state.clock;
      const snap = labSnapshot(state.tick, now, labEdits, state.rules, state.findings, state.knownFindingIds, state.incidents);
      set({ labEdits, devices: snap.devices, findings: snap.findings, knownFindingIds: snap.knownFindingIds, incidents: snap.incidents });
      return "lab";
    }
    if (!state.token) throw new Error("Link a credential first.");
    await mutateDevice({ data: { token: state.token, op: "expire", deviceId: id, authorized: false, routes: [] } });
    await get().sync();
    return "live";
  },
  remove: async (id) => {
    const state = get();
    if (state.mode === "lab") {
      const labEdits = { ...state.labEdits, [id]: { ...state.labEdits[id], deleted: true } };
      const now = state.uiNow ?? state.clock;
      const snap = labSnapshot(state.tick, now, labEdits, state.rules, state.findings, state.knownFindingIds, state.incidents);
      set({
        labEdits,
        devices: snap.devices,
        findings: snap.findings,
        knownFindingIds: snap.knownFindingIds,
        incidents: snap.incidents,
        selectedId: state.selectedId === id ? null : state.selectedId,
      });
      return "lab";
    }
    if (!state.token) throw new Error("Link a credential first.");
    await mutateDevice({ data: { token: state.token, op: "delete", deviceId: id, authorized: false, routes: [] } });
    await get().sync();
    return "live";
  },
  setRoutes: async (id, routes) => {
    const state = get();
    if (state.mode === "lab") {
      const labEdits = { ...state.labEdits, [id]: { ...state.labEdits[id], enabledRoutes: routes } };
      const now = state.uiNow ?? state.clock;
      const snap = labSnapshot(state.tick, now, labEdits, state.rules, state.findings, state.knownFindingIds, state.incidents);
      set({ labEdits, devices: snap.devices, findings: snap.findings, knownFindingIds: snap.knownFindingIds, incidents: snap.incidents });
      return "lab";
    }
    if (!state.token) throw new Error("Link a credential first.");
    await mutateDevice({ data: { token: state.token, op: "routes", deviceId: id, authorized: false, routes } });
    await get().sync();
    return "live";
  },
}));
