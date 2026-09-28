export type Severity = "info" | "watch" | "critical";

export type ViewId = "board" | "map" | "watch" | "policy" | "link";

export type FleetFilter = "all" | "up" | "down" | "routers" | "attention";

export type FleetSort = "attention" | "name" | "latency" | "seen";

export type AuthKind = "token" | "oauth";

export type AppMode = "lab" | "live";

export type Supports = {
  udp: boolean;
  ipv6: boolean;
  hairPinning: boolean;
  pcp: boolean;
  pmp: boolean;
  upnp: boolean;
};

export type Telemetry = {
  cpu: number;
  mem: number;
  disk: number;
  rxBps: number;
  txBps: number;
  uptimeSec: number;
};

export type MeshDevice = {
  id: string;
  nodeId: string;
  name: string;
  hostname: string;
  user: string;
  os: string;
  clientVersion: string;
  updateAvailable: boolean;
  created: string;
  lastSeen: string;
  expires: string | null;
  keyExpiryDisabled: boolean;
  authorized: boolean;
  isExternal: boolean;
  isEphemeral: boolean;
  blocksIncomingConnections: boolean;
  addresses: string[];
  tags: string[];
  enabledRoutes: string[];
  advertisedRoutes: string[];
  connectedToControl: boolean;
  derp: string;
  latency: { region: string; ms: number }[];
  endpoints: string[];
  supports: Supports;
  supportsKnown: boolean;
  tailnetLockError: string;
  telemetry: Telemetry | null;
};

export type HistorySample = {
  cpu: number;
  rx: number;
  tx: number;
  latency: number | null;
};

export type HistoryPoint = {
  t: number;
  onlineCount: number;
  medianLatency: number | null;
  rxBps: number;
  txBps: number;
  present: string[];
  online: string[];
  byId: Record<string, HistorySample>;
};

export type Finding = {
  id: string;
  deviceId: string | null;
  severity: Severity;
  code: string;
  title: string;
  detail: string;
};

export type Incident = {
  incidentId: string;
  kind: "opened" | "cleared" | "note";
  at: number;
  severity: Severity;
  title: string;
  detail: string;
  deviceId: string | null;
};

export type WatchRules = {
  offlineMinutes: number;
  keyExpiryDays: number;
  maxDerpMs: number;
  minClientVersion: string;
  flagKeyExpiryDisabled: boolean;
  flagUnauthorized: boolean;
  flagUpdateAvailable: boolean;
  flagRelayOnly: boolean;
  flagExternal: boolean;
  flagExitNodeDown: boolean;
  flagSubnetDown: boolean;
};

export const DEFAULT_RULES: WatchRules = {
  offlineMinutes: 10,
  keyExpiryDays: 14,
  maxDerpMs: 180,
  minClientVersion: "1.74.0",
  flagKeyExpiryDisabled: true,
  flagUnauthorized: true,
  flagUpdateAvailable: true,
  flagRelayOnly: true,
  flagExternal: true,
  flagExitNodeDown: true,
  flagSubnetDown: true,
};

export type LabEdit = {
  deleted?: boolean;
  authorized?: boolean;
  enabledRoutes?: string[];
  expired?: boolean;
};

export type TailnetExtras = {
  nameservers: string[];
  magicDNS: boolean | null;
  searchPaths: string[];
  acl: unknown | null;
  aclText: string | null;
  notes: string[];
};

export const EMPTY_EXTRAS: TailnetExtras = {
  nameservers: [],
  magicDNS: null,
  searchPaths: [],
  acl: null,
  aclText: null,
  notes: [],
};

export const LAB_ORIGIN = Date.parse("2026-09-28T05:00:00.000Z");
export const LAB_TAILNET = "hearthline.ts.net";
