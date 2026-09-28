import { meshRequest } from "./bridge";
import { normalizeDevice } from "./normalize";
import type { MeshDevice } from "./types";

const SECRET_KEYS = new Set(["machineKey", "nodeKey", "tailnetLockKey"]);
const hits = new Map<string, number[]>();

function bucket(token: string): string {
  let hash = 2166136261;
  for (let i = 0; i < token.length; i++) {
    hash ^= token.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return String(hash >>> 0);
}

function rateLimit(token: string) {
  const key = bucket(token);
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((stamp) => now - stamp < 60_000);
  if (recent.length >= 60) throw new Error("Too many Tailscale calls from this phone. Wait a few seconds.");
  recent.push(now);
  hits.set(key, recent);
}

function assertAsciiSecret(value: string, label: string) {
  if (value.length < 8 || value.length > 500 || !/^[\x21-\x7E]+$/.test(value)) throw new Error(`${label} looks wrong.`);
  if (/https?:\/\//i.test(value)) throw new Error(`${label} looks wrong.`);
}

function assertTailnet(tailnet: string) {
  if (tailnet === "-") return;
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,252}$/.test(tailnet)) {
    throw new Error("Tailnet name looks wrong. Use a tailnet name or - for the credential's own tailnet.");
  }
}

function assertDeviceId(id: string) {
  if (!/^[A-Za-z0-9]{1,64}$/.test(id)) throw new Error("Device id looks wrong.");
}

const CIDR =
  /^(?:(?:\d{1,3}\.){3}\d{1,3}\/(?:3[0-2]|[12]?\d)|[0-9a-fA-F:]+\/(?:12[0-8]|1[01]\d|\d{1,2}))$/;

function assertRoutes(routes: string[]) {
  if (routes.length > 64) throw new Error("Too many routes.");
  for (const route of routes) {
    if (route.length > 64 || !CIDR.test(route)) throw new Error(`Route ${route} is not a CIDR.`);
  }
}

function redact(text: string, secrets: string[]) {
  let out = text;
  for (const secret of secrets) {
    if (secret.length > 6) out = out.split(secret).join("••••");
  }
  return out;
}

function explainStatus(status: number): string {
  if (status === 401) return "Tailscale rejected this credential. It may be expired, revoked, or mistyped.";
  if (status === 403) return "This credential is missing a scope for that call.";
  if (status === 404) return "Tailscale could not find that tailnet or device.";
  if (status === 429) return "Tailscale is rate-limiting this credential.";
  return `Tailscale returned status ${status}.`;
}

function stripSecrets(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripSecrets);
  if (!value || typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (SECRET_KEYS.has(key)) continue;
    out[key] = stripSecrets(child);
  }
  return out;
}

function stringList(value: unknown, key: string): string[] {
  if (!value || typeof value !== "object") return [];
  const raw = (value as Record<string, unknown>)[key];
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is string => typeof item === "string").slice(0, 64);
}

async function callTailscale(
  path: string,
  authorization: string,
  init?: { method?: string; body?: string; contentType?: string },
): Promise<{ status: number; body: string }> {
  try {
    return await meshRequest(init?.method ?? "GET", path, init?.body ?? "", authorization, init?.contentType ?? "");
  } catch (error) {
    if (error instanceof Error && error.message) throw error;
    throw new Error("Could not reach Tailscale.");
  }
}

function mustOk(status: number, body: string, secret: string) {
  if (status >= 200 && status < 300) return;
  const text = redact(body, [secret]).slice(0, 180);
  const reason = explainStatus(status);
  throw new Error(text && status >= 400 && status < 500 && status !== 401 ? `${reason} ${text}` : reason);
}

export async function pullTailnet(input: { data: { token: string; tailnet: string } }) {
  const token = input.data.token.trim();
  const tailnet = input.data.tailnet.trim() || "-";
  assertAsciiSecret(token, "Credential");
  assertTailnet(tailnet);
  rateLimit(token);
  const encoded = encodeURIComponent(tailnet);
  const auth = `Bearer ${token}`;
  const devicesRes = await callTailscale(`/api/v2/tailnet/${encoded}/devices?fields=all`, auth);
  mustOk(devicesRes.status, devicesRes.body, token);
  const devicesJson = JSON.parse(devicesRes.body) as unknown;
  const list = Array.isArray(devicesJson)
    ? devicesJson
    : devicesJson && typeof devicesJson === "object" && Array.isArray((devicesJson as { devices?: unknown }).devices)
      ? (devicesJson as { devices: unknown[] }).devices
      : [];
  const notes: string[] = [];
  const capped = list.slice(0, 2000);
  if (list.length > capped.length) notes.push("Showing the first 2000 devices.");

  async function optional(path: string, label: string): Promise<unknown | null> {
    const res = await callTailscale(path, auth);
    if (!res.status || res.status === 403 || res.status === 404 || res.status >= 400) {
      notes.push(`${label}: ${explainStatus(res.status)}`);
      return null;
    }
    return JSON.parse(res.body) as unknown;
  }

  const [nameserverBody, prefBody, searchBody, aclRes] = await Promise.all([
    optional(`/api/v2/tailnet/${encoded}/dns/nameservers`, "DNS resolvers"),
    optional(`/api/v2/tailnet/${encoded}/dns/preferences`, "MagicDNS"),
    optional(`/api/v2/tailnet/${encoded}/dns/searchpaths`, "Search paths"),
    callTailscale(`/api/v2/tailnet/${encoded}/acl`, auth),
  ]);

  let aclText: string | null = null;
  if (aclRes.status === 403 || aclRes.status === 404 || !aclRes.status || aclRes.status >= 400) {
    notes.push(`Policy file: ${explainStatus(aclRes.status)}`);
  } else if (aclRes.body.length > 200_000) {
    notes.push("Policy file is too large to show here.");
  } else {
    aclText = redact(aclRes.body, [token]).slice(0, 80_000);
  }

  const now = Date.now();
  const devices = capped
    .map((device) => normalizeDevice(stripSecrets(device), now))
    .filter((device): device is MeshDevice => device != null);
  const magicRecord = prefBody && typeof prefBody === "object" ? (prefBody as { magicDNS?: unknown }) : null;
  return {
    devices,
    nameservers: [...stringList(nameserverBody, "dns"), ...stringList(nameserverBody, "nameservers")].slice(0, 32),
    magicDNS: typeof magicRecord?.magicDNS === "boolean" ? magicRecord.magicDNS : null,
    searchPaths: stringList(searchBody, "searchPaths"),
    aclText,
    notes,
  };
}

export async function exchangeOauth(input: { data: { clientId: string; clientSecret: string } }) {
  const clientId = input.data.clientId.trim();
  const clientSecret = input.data.clientSecret.trim();
  assertAsciiSecret(clientId, "Client id");
  assertAsciiSecret(clientSecret, "Client secret");
  rateLimit(clientSecret);
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  }).toString();
  const res = await callTailscale("/api/v2/oauth/token", `Basic ${btoa(`${clientId}:${clientSecret}`)}`, {
    method: "POST",
    body,
    contentType: "application/x-www-form-urlencoded",
  });
  if (res.status === 401 || res.status === 403) throw new Error("Tailscale refused that client id or secret.");
  mustOk(res.status, res.body, clientSecret);
  const json = JSON.parse(res.body) as { access_token?: unknown; expires_in?: unknown };
  if (typeof json.access_token !== "string" || json.access_token.length < 8) {
    throw new Error("Tailscale did not return an access token.");
  }
  const expiresIn = typeof json.expires_in === "number" && json.expires_in > 30 ? json.expires_in : 3600;
  return { accessToken: json.access_token, expiresIn };
}

const OPS = new Set(["authorize", "expire", "delete", "routes"]);

export async function mutateDevice(input: {
  data: { token: string; op: string; deviceId: string; authorized: boolean; routes: string[] };
}) {
  const token = input.data.token.trim();
  const op = input.data.op;
  const deviceId = input.data.deviceId;
  assertAsciiSecret(token, "Credential");
  if (!OPS.has(op)) throw new Error("Unknown action.");
  assertDeviceId(deviceId);
  const routes = input.data.routes.filter((route) => typeof route === "string");
  if (op === "routes") assertRoutes(routes);
  rateLimit(token);
  const auth = `Bearer ${token}`;
  const path = `/api/v2/device/${deviceId}`;
  if (op === "delete") {
    const res = await callTailscale(path, auth, { method: "DELETE" });
    mustOk(res.status, res.body, token);
    return { ok: true as const };
  }
  if (op === "expire") {
    const res = await callTailscale(`${path}/expire`, auth, { method: "POST" });
    mustOk(res.status, res.body, token);
    return { ok: true as const };
  }
  if (op === "authorize") {
    const res = await callTailscale(`${path}/authorized`, auth, {
      method: "POST",
      body: JSON.stringify({ authorized: input.data.authorized }),
      contentType: "application/json",
    });
    mustOk(res.status, res.body, token);
    return { ok: true as const };
  }
  const res = await callTailscale(`${path}/routes`, auth, {
    method: "POST",
    body: JSON.stringify({ routes }),
    contentType: "application/json",
  });
  mustOk(res.status, res.body, token);
  return { ok: true as const };
}
