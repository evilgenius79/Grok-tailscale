import { createServerFn } from "@tanstack/react-start";
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
  if (recent.length >= 60) {
    throw new Error("Too many Tailscale calls from this tab. Wait a few seconds.");
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 200) {
    const oldest = hits.keys().next().value;
    if (oldest) hits.delete(oldest);
  }
}

function assertAsciiSecret(value: string, label: string) {
  if (value.length < 8 || value.length > 500 || !/^[\x21-\x7E]+$/.test(value)) {
    throw new Error(`${label} looks wrong.`);
  }
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

async function noStore() {
  const { setResponseHeader } = await import("@tanstack/react-start/server");
  setResponseHeader("Cache-Control", "no-store");
}

function explainStatus(status: number): string {
  if (status === 401) return "Tailscale rejected this credential. It may be expired, revoked, or mistyped.";
  if (status === 403) return "This credential is missing a scope for that call.";
  if (status === 404) return "Tailscale could not find that tailnet or device.";
  if (status === 429) return "Tailscale is rate-limiting this credential.";
  return `Tailscale returned status ${status}.`;
}

async function readTailscale(path: string, token: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(`https://api.tailscale.com${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(init?.headers ?? {}),
      },
      signal: AbortSignal.timeout(15000),
    });
  } catch (error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      throw new Error("Tailscale took too long to answer.");
    }
    throw new Error("Could not reach Tailscale.");
  }
}

async function mustOk(res: Response, token: string) {
  if (res.ok) return;
  const body = redact(await res.text(), [token]).slice(0, 180);
  const reason = explainStatus(res.status);
  throw new Error(body && res.status >= 400 && res.status < 500 && res.status !== 401 ? `${reason} ${body}` : reason);
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

export const pullTailnet = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (!input || typeof input !== "object") throw new Error("Bad request.");
    const record = input as Record<string, unknown>;
    const token = typeof record.token === "string" ? record.token.trim() : "";
    const tailnet = typeof record.tailnet === "string" && record.tailnet.trim() ? record.tailnet.trim() : "-";
    assertAsciiSecret(token, "Credential");
    assertTailnet(tailnet);
    return { token, tailnet };
  })
  .handler(async ({ data }) => {
    await noStore();
    rateLimit(data.token);
    const tailnet = encodeURIComponent(data.tailnet);
    const devicesRes = await readTailscale(
      `/api/v2/tailnet/${tailnet}/devices?fields=all`,
      data.token,
    );
    await mustOk(devicesRes, data.token);
    const devicesJson = (await devicesRes.json()) as unknown;
    const list = Array.isArray(devicesJson)
      ? devicesJson
      : devicesJson &&
          typeof devicesJson === "object" &&
          Array.isArray((devicesJson as { devices?: unknown }).devices)
        ? (devicesJson as { devices: unknown[] }).devices
        : [];
    const notes: string[] = [];
    const capped = list.slice(0, 2000);
    if (list.length > capped.length) notes.push("Showing the first 2000 devices.");

    async function optional(path: string, label: string): Promise<unknown | null> {
      const res = await readTailscale(path, data.token);
      if (res.status === 403 || res.status === 404) {
        notes.push(`${label}: ${explainStatus(res.status)}`);
        return null;
      }
      if (!res.ok) {
        notes.push(`${label}: ${explainStatus(res.status)}`);
        return null;
      }
      return (await res.json()) as unknown;
    }

    const [nameserverBody, prefBody, searchBody, aclRes] = await Promise.all([
      optional(`/api/v2/tailnet/${tailnet}/dns/nameservers`, "DNS resolvers"),
      optional(`/api/v2/tailnet/${tailnet}/dns/preferences`, "MagicDNS"),
      optional(`/api/v2/tailnet/${tailnet}/dns/searchpaths`, "Search paths"),
      readTailscale(`/api/v2/tailnet/${tailnet}/acl`, data.token),
    ]);

    let aclText: string | null = null;
    if (aclRes.status === 403 || aclRes.status === 404) {
      notes.push(`Policy file: ${explainStatus(aclRes.status)}`);
    } else if (!aclRes.ok) {
      notes.push(`Policy file: ${explainStatus(aclRes.status)}`);
    } else {
      const text = redact(await aclRes.text(), [data.token]);
      if (text.length > 200_000) {
        notes.push("Policy file is too large to show here.");
      } else {
        aclText = text.slice(0, 80_000);
      }
    }

    const now = Date.now();
    const devices = capped
      .map((device) => normalizeDevice(stripSecrets(device), now))
      .filter((device): device is MeshDevice => device != null);
    const magicRecord = prefBody && typeof prefBody === "object" ? (prefBody as { magicDNS?: unknown }) : null;
    return {
      devices,
      nameservers: [
        ...stringList(nameserverBody, "dns"),
        ...stringList(nameserverBody, "nameservers"),
      ].slice(0, 32),
      magicDNS: typeof magicRecord?.magicDNS === "boolean" ? magicRecord.magicDNS : null,
      searchPaths: stringList(searchBody, "searchPaths"),
      aclText,
      notes,
    };
  });

export const exchangeOauth = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (!input || typeof input !== "object") throw new Error("Bad request.");
    const record = input as Record<string, unknown>;
    const clientId = typeof record.clientId === "string" ? record.clientId.trim() : "";
    const clientSecret = typeof record.clientSecret === "string" ? record.clientSecret.trim() : "";
    assertAsciiSecret(clientId, "Client id");
    assertAsciiSecret(clientSecret, "Client secret");
    return { clientId, clientSecret };
  })
  .handler(async ({ data }) => {
    await noStore();
    rateLimit(data.clientSecret);
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: data.clientId,
      client_secret: data.clientSecret,
    });
    let res: Response;
    try {
      res = await fetch("https://api.tailscale.com/api/v2/oauth/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`${data.clientId}:${data.clientSecret}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body,
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      throw new Error("Could not reach Tailscale to exchange that client.");
    }
    if (!res.ok) {
      throw new Error(
        res.status === 401 || res.status === 403
          ? "Tailscale refused that client id or secret."
          : explainStatus(res.status),
      );
    }
    const json = (await res.json()) as { access_token?: unknown; expires_in?: unknown };
    if (typeof json.access_token !== "string" || json.access_token.length < 8) {
      throw new Error("Tailscale did not return an access token.");
    }
    const expiresIn = typeof json.expires_in === "number" && json.expires_in > 30 ? json.expires_in : 3600;
    return { accessToken: json.access_token, expiresIn };
  });

const OPS = new Set(["authorize", "expire", "delete", "routes"]);

export const mutateDevice = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (!input || typeof input !== "object") throw new Error("Bad request.");
    const record = input as Record<string, unknown>;
    const token = typeof record.token === "string" ? record.token.trim() : "";
    const op = typeof record.op === "string" ? record.op : "";
    const deviceId = typeof record.deviceId === "string" ? record.deviceId : "";
    assertAsciiSecret(token, "Credential");
    if (!OPS.has(op)) throw new Error("Unknown action.");
    assertDeviceId(deviceId);
    const authorized = record.authorized === true;
    const routes = Array.isArray(record.routes)
      ? record.routes.filter((route): route is string => typeof route === "string")
      : [];
    if (op === "routes") assertRoutes(routes);
    return { token, op, deviceId, authorized, routes };
  })
  .handler(async ({ data }) => {
    await noStore();
    rateLimit(data.token);
    const path = `/api/v2/device/${data.deviceId}`;
    if (data.op === "delete") {
      const res = await readTailscale(path, data.token, { method: "DELETE" });
      await mustOk(res, data.token);
      return { ok: true as const };
    }
    if (data.op === "expire") {
      const res = await readTailscale(`${path}/expire`, data.token, { method: "POST" });
      await mustOk(res, data.token);
      return { ok: true as const };
    }
    if (data.op === "authorize") {
      const res = await readTailscale(`${path}/authorized`, data.token, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorized: data.authorized }),
      });
      await mustOk(res, data.token);
      return { ok: true as const };
    }
    const res = await readTailscale(`${path}/routes`, data.token, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ routes: data.routes }),
    });
    await mustOk(res, data.token);
    return { ok: true as const };
  });
