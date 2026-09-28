import { n as createServerFn, r as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { i as normalizeDevice } from "./normalize-CwtmATvQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-D7Ycezp7.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var SECRET_KEYS = /* @__PURE__ */ new Set([
	"machineKey",
	"nodeKey",
	"tailnetLockKey"
]);
var hits = /* @__PURE__ */ new Map();
function bucket(token) {
	let hash = 2166136261;
	for (let i = 0; i < token.length; i++) {
		hash ^= token.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}
	return String(hash >>> 0);
}
function rateLimit(token) {
	const key = bucket(token);
	const now = Date.now();
	const recent = (hits.get(key) ?? []).filter((stamp) => now - stamp < 6e4);
	if (recent.length >= 60) throw new Error("Too many Tailscale calls from this tab. Wait a few seconds.");
	recent.push(now);
	hits.set(key, recent);
	if (hits.size > 200) {
		const oldest = hits.keys().next().value;
		if (oldest) hits.delete(oldest);
	}
}
function assertAsciiSecret(value, label) {
	if (value.length < 8 || value.length > 500 || !/^[\x21-\x7E]+$/.test(value)) throw new Error(`${label} looks wrong.`);
	if (/https?:\/\//i.test(value)) throw new Error(`${label} looks wrong.`);
}
function assertTailnet(tailnet) {
	if (tailnet === "-") return;
	if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,252}$/.test(tailnet)) throw new Error("Tailnet name looks wrong. Use a tailnet name or - for the credential's own tailnet.");
}
function assertDeviceId(id) {
	if (!/^[A-Za-z0-9]{1,64}$/.test(id)) throw new Error("Device id looks wrong.");
}
var CIDR = /^(?:(?:\d{1,3}\.){3}\d{1,3}\/(?:3[0-2]|[12]?\d)|[0-9a-fA-F:]+\/(?:12[0-8]|1[01]\d|\d{1,2}))$/;
function assertRoutes(routes) {
	if (routes.length > 64) throw new Error("Too many routes.");
	for (const route of routes) if (route.length > 64 || !CIDR.test(route)) throw new Error(`Route ${route} is not a CIDR.`);
}
function redact(text, secrets) {
	let out = text;
	for (const secret of secrets) if (secret.length > 6) out = out.split(secret).join("••••");
	return out;
}
async function noStore() {
	const { setResponseHeader } = await import("./ssr.mjs").then((n) => n.o).then((n) => n.t);
	setResponseHeader("Cache-Control", "no-store");
}
function explainStatus(status) {
	if (status === 401) return "Tailscale rejected this credential. It may be expired, revoked, or mistyped.";
	if (status === 403) return "This credential is missing a scope for that call.";
	if (status === 404) return "Tailscale could not find that tailnet or device.";
	if (status === 429) return "Tailscale is rate-limiting this credential.";
	return `Tailscale returned status ${status}.`;
}
async function readTailscale(path, token, init) {
	try {
		return await fetch(`https://api.tailscale.com${path}`, {
			...init,
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/json",
				...init?.headers ?? {}
			},
			signal: AbortSignal.timeout(15e3)
		});
	} catch (error) {
		if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) throw new Error("Tailscale took too long to answer.");
		throw new Error("Could not reach Tailscale.");
	}
}
async function mustOk(res, token) {
	if (res.ok) return;
	const body = redact(await res.text(), [token]).slice(0, 180);
	const reason = explainStatus(res.status);
	throw new Error(body && res.status >= 400 && res.status < 500 && res.status !== 401 ? `${reason} ${body}` : reason);
}
function stripSecrets(value) {
	if (Array.isArray(value)) return value.map(stripSecrets);
	if (!value || typeof value !== "object") return value;
	const out = {};
	for (const [key, child] of Object.entries(value)) {
		if (SECRET_KEYS.has(key)) continue;
		out[key] = stripSecrets(child);
	}
	return out;
}
function stringList(value, key) {
	if (!value || typeof value !== "object") return [];
	const raw = value[key];
	if (!Array.isArray(raw)) return [];
	return raw.filter((item) => typeof item === "string").slice(0, 64);
}
var pullTailnet_createServerFn_handler = createServerRpc({
	id: "157f8df08eb367ce2aed658f6e41e2df82a0544ae7778109b72ef9d7df46ddcf",
	name: "pullTailnet",
	filename: "src/lib/mesh/api.ts"
}, (opts) => pullTailnet.__executeServer(opts));
var pullTailnet = createServerFn({ method: "POST" }).validator((input) => {
	if (!input || typeof input !== "object") throw new Error("Bad request.");
	const record = input;
	const token = typeof record.token === "string" ? record.token.trim() : "";
	const tailnet = typeof record.tailnet === "string" && record.tailnet.trim() ? record.tailnet.trim() : "-";
	assertAsciiSecret(token, "Credential");
	assertTailnet(tailnet);
	return {
		token,
		tailnet
	};
}).handler(pullTailnet_createServerFn_handler, async ({ data }) => {
	await noStore();
	rateLimit(data.token);
	const tailnet = encodeURIComponent(data.tailnet);
	const devicesRes = await readTailscale(`/api/v2/tailnet/${tailnet}/devices?fields=all`, data.token);
	await mustOk(devicesRes, data.token);
	const devicesJson = await devicesRes.json();
	const list = Array.isArray(devicesJson) ? devicesJson : devicesJson && typeof devicesJson === "object" && Array.isArray(devicesJson.devices) ? devicesJson.devices : [];
	const notes = [];
	const capped = list.slice(0, 2e3);
	if (list.length > capped.length) notes.push("Showing the first 2000 devices.");
	async function optional(path, label) {
		const res = await readTailscale(path, data.token);
		if (res.status === 403 || res.status === 404) {
			notes.push(`${label}: ${explainStatus(res.status)}`);
			return null;
		}
		if (!res.ok) {
			notes.push(`${label}: ${explainStatus(res.status)}`);
			return null;
		}
		return await res.json();
	}
	const [nameserverBody, prefBody, searchBody, aclRes] = await Promise.all([
		optional(`/api/v2/tailnet/${tailnet}/dns/nameservers`, "DNS resolvers"),
		optional(`/api/v2/tailnet/${tailnet}/dns/preferences`, "MagicDNS"),
		optional(`/api/v2/tailnet/${tailnet}/dns/searchpaths`, "Search paths"),
		readTailscale(`/api/v2/tailnet/${tailnet}/acl`, data.token)
	]);
	let aclText = null;
	if (aclRes.status === 403 || aclRes.status === 404) notes.push(`Policy file: ${explainStatus(aclRes.status)}`);
	else if (!aclRes.ok) notes.push(`Policy file: ${explainStatus(aclRes.status)}`);
	else {
		const text = redact(await aclRes.text(), [data.token]);
		if (text.length > 2e5) notes.push("Policy file is too large to show here.");
		else aclText = text.slice(0, 8e4);
	}
	const now = Date.now();
	const devices = capped.map((device) => normalizeDevice(stripSecrets(device), now)).filter((device) => device != null);
	const magicRecord = prefBody && typeof prefBody === "object" ? prefBody : null;
	return {
		devices,
		nameservers: [...stringList(nameserverBody, "dns"), ...stringList(nameserverBody, "nameservers")].slice(0, 32),
		magicDNS: typeof magicRecord?.magicDNS === "boolean" ? magicRecord.magicDNS : null,
		searchPaths: stringList(searchBody, "searchPaths"),
		aclText,
		notes
	};
});
var exchangeOauth_createServerFn_handler = createServerRpc({
	id: "23562acab4017d553147c60ec557015312bc653285c5aefc994289118c71c9f8",
	name: "exchangeOauth",
	filename: "src/lib/mesh/api.ts"
}, (opts) => exchangeOauth.__executeServer(opts));
var exchangeOauth = createServerFn({ method: "POST" }).validator((input) => {
	if (!input || typeof input !== "object") throw new Error("Bad request.");
	const record = input;
	const clientId = typeof record.clientId === "string" ? record.clientId.trim() : "";
	const clientSecret = typeof record.clientSecret === "string" ? record.clientSecret.trim() : "";
	assertAsciiSecret(clientId, "Client id");
	assertAsciiSecret(clientSecret, "Client secret");
	return {
		clientId,
		clientSecret
	};
}).handler(exchangeOauth_createServerFn_handler, async ({ data }) => {
	await noStore();
	rateLimit(data.clientSecret);
	const body = new URLSearchParams({
		grant_type: "client_credentials",
		client_id: data.clientId,
		client_secret: data.clientSecret
	});
	let res;
	try {
		res = await fetch("https://api.tailscale.com/api/v2/oauth/token", {
			method: "POST",
			headers: {
				Authorization: `Basic ${btoa(`${data.clientId}:${data.clientSecret}`)}`,
				"Content-Type": "application/x-www-form-urlencoded",
				Accept: "application/json"
			},
			body,
			signal: AbortSignal.timeout(15e3)
		});
	} catch {
		throw new Error("Could not reach Tailscale to exchange that client.");
	}
	if (!res.ok) throw new Error(res.status === 401 || res.status === 403 ? "Tailscale refused that client id or secret." : explainStatus(res.status));
	const json = await res.json();
	if (typeof json.access_token !== "string" || json.access_token.length < 8) throw new Error("Tailscale did not return an access token.");
	const expiresIn = typeof json.expires_in === "number" && json.expires_in > 30 ? json.expires_in : 3600;
	return {
		accessToken: json.access_token,
		expiresIn
	};
});
var OPS = /* @__PURE__ */ new Set([
	"authorize",
	"expire",
	"delete",
	"routes"
]);
var mutateDevice_createServerFn_handler = createServerRpc({
	id: "e4f198573cf2bd2ae10b83f13fa65a599feeb66f52dd7fa193aef88d36860716",
	name: "mutateDevice",
	filename: "src/lib/mesh/api.ts"
}, (opts) => mutateDevice.__executeServer(opts));
var mutateDevice = createServerFn({ method: "POST" }).validator((input) => {
	if (!input || typeof input !== "object") throw new Error("Bad request.");
	const record = input;
	const token = typeof record.token === "string" ? record.token.trim() : "";
	const op = typeof record.op === "string" ? record.op : "";
	const deviceId = typeof record.deviceId === "string" ? record.deviceId : "";
	assertAsciiSecret(token, "Credential");
	if (!OPS.has(op)) throw new Error("Unknown action.");
	assertDeviceId(deviceId);
	const authorized = record.authorized === true;
	const routes = Array.isArray(record.routes) ? record.routes.filter((route) => typeof route === "string") : [];
	if (op === "routes") assertRoutes(routes);
	return {
		token,
		op,
		deviceId,
		authorized,
		routes
	};
}).handler(mutateDevice_createServerFn_handler, async ({ data }) => {
	await noStore();
	rateLimit(data.token);
	const path = `/api/v2/device/${data.deviceId}`;
	if (data.op === "delete") {
		await mustOk(await readTailscale(path, data.token, { method: "DELETE" }), data.token);
		return { ok: true };
	}
	if (data.op === "expire") {
		await mustOk(await readTailscale(`${path}/expire`, data.token, { method: "POST" }), data.token);
		return { ok: true };
	}
	if (data.op === "authorize") {
		await mustOk(await readTailscale(`${path}/authorized`, data.token, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ authorized: data.authorized })
		}), data.token);
		return { ok: true };
	}
	await mustOk(await readTailscale(`${path}/routes`, data.token, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ routes: data.routes })
	}), data.token);
	return { ok: true };
});
//#endregion
export { exchangeOauth_createServerFn_handler, mutateDevice_createServerFn_handler, pullTailnet_createServerFn_handler };
