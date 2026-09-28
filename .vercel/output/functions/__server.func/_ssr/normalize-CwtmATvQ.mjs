//#region node_modules/.nitro/vite/services/ssr/assets/normalize-CwtmATvQ.js
function asRecord(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	return value;
}
function clampNum(value, min, max, fallback) {
	const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
	if (!Number.isFinite(n)) return fallback;
	return Math.min(max, Math.max(min, n));
}
function errMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	if (asRecord(error) && typeof asRecord(error)?.message === "string") return String(asRecord(error)?.message);
	return "Something went wrong.";
}
function str(value, fallback = "") {
	return typeof value === "string" ? value : fallback;
}
function strList(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((item) => typeof item === "string");
}
function bool(value, fallback = false) {
	return typeof value === "boolean" ? value : fallback;
}
var EMPTY_SUPPORTS = {
	udp: false,
	ipv6: false,
	hairPinning: false,
	pcp: false,
	pmp: false,
	upnp: false
};
function readLatency(conn) {
	const raw = conn ? asRecord(conn.latency) : null;
	if (!raw) return [];
	const points = [];
	for (const [region, value] of Object.entries(raw)) {
		if (typeof value === "number" && Number.isFinite(value)) {
			points.push({
				region,
				ms: Math.round(value)
			});
			continue;
		}
		const record = asRecord(value);
		const ms = record && typeof record.latencyMs === "number" ? record.latencyMs : record && typeof record.ms === "number" ? record.ms : null;
		if (ms != null && Number.isFinite(ms)) points.push({
			region,
			ms: Math.round(ms)
		});
	}
	return points.sort((a, b) => a.ms - b.ms);
}
function tryParseHuJSON(input) {
	try {
		return JSON.parse(input);
	} catch {}
	try {
		const stripped = input.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "$1").replace(/,\s*([\]}])/g, "$1");
		return JSON.parse(stripped);
	} catch {
		return null;
	}
}
function normalizeDevice(raw, now) {
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
	const supports = supportsRaw ? {
		udp: bool(supportsRaw.udp),
		ipv6: bool(supportsRaw.ipv6),
		hairPinning: bool(supportsRaw.hairPinning),
		pcp: bool(supportsRaw.pcp),
		pmp: bool(supportsRaw.pmp),
		upnp: bool(supportsRaw.upnp)
	} : EMPTY_SUPPORTS;
	const hasControl = typeof record.connectedToControl === "boolean";
	const lastSeen = str(record.lastSeen);
	const seenMs = Date.parse(lastSeen);
	const fresh = Number.isFinite(seenMs) && now - seenMs < 18e4;
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
		telemetry: null
	};
}
//#endregion
export { tryParseHuJSON as a, normalizeDevice as i, clampNum as n, errMessage as r, asRecord as t };
