import { asRecord } from "./guard";
import type { MeshDevice, Supports } from "./types";

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function strList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function bool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

const EMPTY_SUPPORTS: Supports = {
  udp: false,
  ipv6: false,
  hairPinning: false,
  pcp: false,
  pmp: false,
  upnp: false,
};

function readLatency(conn: Record<string, unknown> | null): { region: string; ms: number }[] {
  const raw = conn ? asRecord(conn.latency) : null;
  if (!raw) return [];
  const points: { region: string; ms: number }[] = [];
  for (const [region, value] of Object.entries(raw)) {
    if (typeof value === "number" && Number.isFinite(value)) {
      points.push({ region, ms: Math.round(value) });
      continue;
    }
    const record = asRecord(value);
    const ms =
      record && typeof record.latencyMs === "number"
        ? record.latencyMs
        : record && typeof record.ms === "number"
          ? record.ms
          : null;
    if (ms != null && Number.isFinite(ms)) points.push({ region, ms: Math.round(ms) });
  }
  return points.sort((a, b) => a.ms - b.ms);
}

export function tryParseHuJSON(input: string): unknown | null {
  try {
    return JSON.parse(input) as unknown;
  } catch {
    /* HuJSON allows comments and trailing commas. */
  }
  try {
    const stripped = input
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(^|\s)\/\/.*$/gm, "$1")
      .replace(/,\s*([\]}])/g, "$1");
    return JSON.parse(stripped) as unknown;
  } catch {
    return null;
  }
}

export function normalizeDevice(raw: unknown, now: number): MeshDevice | null {
  const record = asRecord(raw);
  if (!record) return null;
  const idValue = record.id ?? record.nodeId;
  const id = idValue == null ? "" : String(idValue);
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(id)) return null;
  const name = str(record.name, str(record.hostname, id));
  const hostname = str(record.hostname, name.split(".")[0] || name);
  const conn = asRecord(record.clientConnectivity);
  const supportsRaw = conn ? asRecord(conn.clientSupports) : null;
  const supportsKnown = supportsRaw != null;
  const supports: Supports = supportsRaw
    ? {
        udp: bool(supportsRaw.udp),
        ipv6: bool(supportsRaw.ipv6),
        hairPinning: bool(supportsRaw.hairPinning),
        pcp: bool(supportsRaw.pcp),
        pmp: bool(supportsRaw.pmp),
        upnp: bool(supportsRaw.upnp),
      }
    : EMPTY_SUPPORTS;
  const hasControl = typeof record.connectedToControl === "boolean";
  const lastSeen = str(record.lastSeen);
  const seenMs = Date.parse(lastSeen);
  const fresh = Number.isFinite(seenMs) && now - seenMs < 3 * 60 * 1000;
  const connected = hasControl ? record.connectedToControl === true : fresh;
  const expires = str(record.expires);
  const keyExpiryDisabled = bool(record.keyExpiryDisabled);
  return {
    id,
    nodeId: str(record.nodeId),
    name,
    hostname,
    user: str(record.user, "unknown"),
    os: str(record.os, "unknown"),
    clientVersion: str(record.clientVersion),
    updateAvailable: bool(record.updateAvailable),
    created: str(record.created, new Date(now).toISOString()),
    lastSeen: Number.isFinite(seenMs) ? lastSeen : new Date(now).toISOString(),
    expires: !keyExpiryDisabled && expires ? expires : null,
    keyExpiryDisabled,
    authorized: bool(record.authorized, true),
    isExternal: bool(record.isExternal),
    isEphemeral: bool(record.isEphemeral),
    blocksIncomingConnections: bool(record.blocksIncomingConnections),
    addresses: strList(record.addresses),
    tags: strList(record.tags),
    enabledRoutes: strList(record.enabledRoutes),
    advertisedRoutes: strList(record.advertisedRoutes),
    connectedToControl: connected,
    derp: conn ? str(conn.derp) : "",
    latency: readLatency(conn),
    endpoints: conn ? strList(conn.endpoints).slice(0, 8) : [],
    supports,
    supportsKnown,
    tailnetLockError: str(record.tailnetLockError),
    telemetry: null,
  };
}
