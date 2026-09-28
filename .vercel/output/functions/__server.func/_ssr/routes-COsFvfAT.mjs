import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as __exportAll, i as getServerFnById, n as createServerFn, r as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { a as tryParseHuJSON, n as clampNum, r as errMessage, t as asRecord } from "./normalize-CwtmATvQ.mjs";
import { _ as Ban, a as Shield, c as ScrollText, d as Network, f as Monitor, g as Copy, h as Download, i as Smartphone, l as RefreshCw, m as KeyRound, o as ShieldCheck, p as Laptop, r as Trash2, s as Server, t as X, u as Radio, v as Activity } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-COsFvfAT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatDuration(sec) {
	const s = Math.max(0, Math.round(sec));
	const d = Math.floor(s / 86400);
	const h = Math.floor(s % 86400 / 3600);
	const m = Math.floor(s % 3600 / 60);
	if (d > 0) return `${d}d ${h}h`;
	if (h > 0) return `${h}h ${m}m`;
	if (m > 0) return `${m}m`;
	return `${s}s`;
}
function formatAgo(iso, now) {
	const delta = now - Date.parse(iso);
	if (!Number.isFinite(delta)) return "unknown";
	const sec = Math.round(delta / 1e3);
	if (Math.abs(sec) < 15) return sec >= 0 ? "just now" : "soon";
	if (sec < 0) return `in ${formatDuration(-sec)}`;
	return `${formatDuration(sec)} ago`;
}
function formatAgoMs(at, now) {
	return formatAgo(new Date(at).toISOString(), now);
}
function formatAbsolute(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	];
	const hh = String(d.getUTCHours()).padStart(2, "0");
	const mi = String(d.getUTCMinutes()).padStart(2, "0");
	return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${hh}:${mi} UTC`;
}
function formatRate(bps) {
	const n = Math.max(0, bps);
	if (n < 1e3) return `${Math.round(n)} b/s`;
	if (n < 1e6) return `${(n / 1e3).toFixed(1)} kb/s`;
	if (n < 1e9) return `${(n / 1e6).toFixed(1)} Mb/s`;
	return `${(n / 1e9).toFixed(2)} Gb/s`;
}
function formatClock(ms) {
	const d = new Date(ms);
	return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}:${String(d.getUTCSeconds()).padStart(2, "0")}`;
}
function cmpVersion(a, b) {
	const pa = a.split(".").map((part) => parseInt(part, 10) || 0);
	const pb = b.split(".").map((part) => parseInt(part, 10) || 0);
	const n = Math.max(pa.length, pb.length);
	for (let i = 0; i < n; i++) {
		const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
		if (diff) return diff;
	}
	return 0;
}
function shortUser(user) {
	return user.split("@")[0] || user || "unknown";
}
function tagLabel(tag) {
	return tag.startsWith("tag:") ? tag.slice(4) : tag;
}
function ipv4(addresses) {
	return addresses.find((addr) => addr.includes(".")) ?? addresses[0] ?? "—";
}
function Sparkline({ values, label, tone = "primary" }) {
	const points = values.filter((value) => Number.isFinite(value));
	if (points.length < 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-12 text-xs text-muted",
		children: "Waiting for samples"
	});
	const min = Math.min(...points);
	const span = Math.max(...points) - min || 1;
	const width = 160;
	const height = 48;
	const coords = points.map((value, index) => {
		const x = index / (points.length - 1) * width;
		const y = 44 - (value - min) / span * 40;
		return `${x.toFixed(1)},${y.toFixed(1)}`;
	}).join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: `0 0 ${width} ${height}`,
		role: "img",
		"aria-label": label,
		className: tone === "accent" ? "h-12 w-full text-accent" : "h-12 w-full text-primary",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			points: coords
		})
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Button({ tone = "ghost", className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50", tone === "solid" && "bg-primary text-bg hover:bg-primary/90", tone === "ghost" && "border border-line bg-surface text-fg hover:bg-surface-2", tone === "quiet" && "text-muted hover:bg-surface-2 hover:text-fg", tone === "danger" && "bg-danger text-bg hover:bg-danger/90", className),
		...props
	});
}
function Chip({ children, tone = "neutral" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs", tone === "neutral" && "bg-surface-2 text-muted", tone === "good" && "bg-primary/15 text-primary", tone === "warn" && "bg-accent/15 text-accent", tone === "bad" && "bg-danger/15 text-danger"),
		children
	});
}
function OsIcon({ os }) {
	const className = "size-4 shrink-0 text-muted";
	if (os === "iOS" || os === "android") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, {
		className,
		"aria-hidden": true
	});
	if (os === "macOS") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, {
		className,
		"aria-hidden": true
	});
	if (os === "windows") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, {
		className,
		"aria-hidden": true
	});
	if (os === "linux" || os === "freebsd") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, {
		className,
		"aria-hidden": true
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, {
		className,
		"aria-hidden": true
	});
}
async function copyText(value) {
	try {
		await navigator.clipboard.writeText(value);
		toast.success("Copied");
	} catch {
		toast.error("Clipboard is blocked in this browser");
	}
}
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1.5 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: label
			}),
			children,
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted",
				children: hint
			}) : null
		]
	});
}
var inputClass = "min-h-11 w-full rounded-lg border border-line bg-bg px-3 font-mono text-sm text-fg placeholder:text-muted";
function ConfirmDialog({ title, body, confirmLabel, danger, challenge, onConfirm, onClose }) {
	const ref = (0, import_react.useRef)(null);
	const onCloseRef = (0, import_react.useRef)(onClose);
	onCloseRef.current = onClose;
	const [typed, setTyped] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		el.showModal();
		const onCancel = (event) => {
			event.preventDefault();
			onCloseRef.current();
		};
		el.addEventListener("cancel", onCancel);
		return () => {
			el.removeEventListener("cancel", onCancel);
			if (el.open) el.close();
		};
	}, []);
	const locked = challenge != null && typed !== challenge;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dialog", {
		ref,
		className: "mesh-dialog",
		"aria-labelledby": "confirm-title",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "flex flex-col gap-4 p-5",
			onSubmit: (event) => {
				event.preventDefault();
				if (!locked) onConfirm();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "confirm-title",
						className: "text-lg font-semibold text-balance",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-pretty text-muted",
						children: body
					})]
				}),
				challenge ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex flex-col gap-1.5 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Type ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-fg",
							children: challenge
						}),
						" to confirm"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputClass,
						value: typed,
						onChange: (event) => setTyped(event.target.value),
						autoComplete: "off",
						spellCheck: false,
						autoFocus: true
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						tone: "quiet",
						onClick: onClose,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						tone: danger ? "danger" : "solid",
						disabled: locked,
						children: confirmLabel
					})]
				})
			]
		})
	});
}
var EXIT = /* @__PURE__ */ new Set(["0.0.0.0/0", "::/0"]);
function isExitRoute(route) {
	return EXIT.has(route);
}
function advertisesExit(device) {
	return [...device.advertisedRoutes, ...device.enabledRoutes].some(isExitRoute);
}
function exitEnabled(device) {
	return device.enabledRoutes.some(isExitRoute);
}
function advertisesSubnet(device) {
	return [...device.advertisedRoutes, ...device.enabledRoutes].some((route) => !isExitRoute(route));
}
function subnetEnabled(device) {
	return device.enabledRoutes.some((route) => !isExitRoute(route));
}
function bestLatency(device) {
	if (!device.latency.length) return null;
	return Math.min(...device.latency.map((point) => point.ms));
}
function median(values) {
	if (!values.length) return null;
	const sorted = [...values].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	if (sorted.length % 2) return sorted[mid] ?? null;
	const left = sorted[mid - 1];
	const right = sorted[mid];
	if (left == null || right == null) return null;
	return (left + right) / 2;
}
function summarize(devices, t) {
	const online = devices.filter((device) => device.connectedToControl);
	const latencies = online.map(bestLatency).filter((value) => value != null);
	const byId = {};
	let rxBps = 0;
	let txBps = 0;
	for (const device of devices) {
		const latency = bestLatency(device);
		const cpu = device.telemetry?.cpu ?? 0;
		const rx = device.telemetry?.rxBps ?? 0;
		const tx = device.telemetry?.txBps ?? 0;
		rxBps += rx;
		txBps += tx;
		byId[device.id] = {
			cpu,
			rx,
			tx,
			latency
		};
	}
	return {
		t,
		onlineCount: online.length,
		medianLatency: median(latencies),
		rxBps,
		txBps,
		present: devices.map((device) => device.id),
		online: online.map((device) => device.id),
		byId
	};
}
function applyLabEdits(devices, edits, now) {
	const next = [];
	for (const device of devices) {
		const edit = edits[device.id];
		if (edit?.deleted) continue;
		if (!edit) {
			next.push(device);
			continue;
		}
		let patched = device;
		if (edit.authorized != null) patched = {
			...patched,
			authorized: edit.authorized
		};
		if (edit.enabledRoutes) patched = {
			...patched,
			enabledRoutes: edit.enabledRoutes
		};
		if (edit.expired) patched = {
			...patched,
			expires: new Date(now).toISOString(),
			keyExpiryDisabled: false,
			connectedToControl: false,
			lastSeen: (/* @__PURE__ */ new Date(now - 9e4)).toISOString(),
			telemetry: null
		};
		next.push(patched);
	}
	return next;
}
function watchUptime(history, id) {
	let seen = 0;
	let up = 0;
	for (const point of history) {
		if (!point.present.includes(id)) continue;
		seen += 1;
		if (point.online.includes(id)) up += 1;
	}
	return {
		seen,
		up
	};
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
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
}).handler(createSsrRpc("157f8df08eb367ce2aed658f6e41e2df82a0544ae7778109b72ef9d7df46ddcf"));
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
}).handler(createSsrRpc("23562acab4017d553147c60ec557015312bc653285c5aefc994289118c71c9f8"));
var OPS = /* @__PURE__ */ new Set([
	"authorize",
	"expire",
	"delete",
	"routes"
]);
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
}).handler(createSsrRpc("e4f198573cf2bd2ae10b83f13fa65a599feeb66f52dd7fa193aef88d36860716"));
var DEFAULT_RULES = {
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
	flagSubnetDown: true
};
var EMPTY_EXTRAS = {
	nameservers: [],
	magicDNS: null,
	searchPaths: [],
	acl: null,
	aclText: null,
	notes: []
};
var LAB_ORIGIN = Date.parse("2026-09-28T05:00:00.000Z");
var LAB_TAILNET = "hearthline.ts.net";
var FULL = {
	udp: true,
	ipv6: true,
	hairPinning: true,
	pcp: false,
	pmp: true,
	upnp: false
};
var SPECS = [
	{
		id: "exit-ewr",
		host: "exit-ewr",
		user: "ada@hearthline.dev",
		os: "linux",
		ver: "1.84.2",
		tags: ["tag:exit"],
		v4: "100.99.12.1",
		v6: "fd7a:115c:a1e0::1",
		advertised: ["0.0.0.0/0", "::/0"],
		enabled: ["0.0.0.0/0", "::/0"],
		expiryDisabled: true,
		expiresInSec: 0,
		derp: "ewr",
		latency: [
			["ewr", 11],
			["ord", 28],
			["lhr", 72],
			["syd", 210]
		],
		endpoint: "203.0.113.10:41641",
		createdAgoSec: 3456e4,
		cpu: 9,
		mem: 31,
		disk: 22,
		rx: 42e6,
		tx: 39e6,
		uptimeSec: 3456e3
	},
	{
		id: "edge-hq",
		host: "edge-hq",
		user: "ada@hearthline.dev",
		os: "linux",
		ver: "1.84.2",
		tags: ["tag:edge"],
		v4: "100.99.12.2",
		v6: "fd7a:115c:a1e0::2",
		advertised: ["10.40.0.0/16", "192.168.10.0/24"],
		enabled: ["10.40.0.0/16", "192.168.10.0/24"],
		expiryDisabled: true,
		expiresInSec: 0,
		derp: "ord",
		latency: [
			["ord", 16],
			["ewr", 24],
			["dfw", 38],
			["sea", 61]
		],
		endpoint: "203.0.113.11:41641",
		createdAgoSec: 32832e3,
		cpu: 14,
		mem: 38,
		disk: 27,
		rx: 18e6,
		tx: 165e5,
		uptimeSec: 1555200
	},
	{
		id: "nas-01",
		host: "nas-01",
		user: "ada@hearthline.dev",
		os: "linux",
		ver: "1.82.0",
		tags: ["tag:storage"],
		v4: "100.99.12.3",
		v6: "fd7a:115c:a1e0::3",
		advertised: [],
		enabled: [],
		expiryDisabled: true,
		expiresInSec: 0,
		derp: "ord",
		latency: [
			["ord", 14],
			["ewr", 27],
			["dfw", 41]
		],
		endpoint: "203.0.113.12:41641",
		createdAgoSec: 432e5,
		cpu: 22,
		mem: 71,
		disk: 64,
		rx: 82e5,
		tx: 24e5,
		uptimeSec: 5356800
	},
	{
		id: "build-03",
		host: "build-03",
		user: "nico@hearthline.dev",
		os: "linux",
		ver: "1.84.0",
		tags: ["tag:ci"],
		v4: "100.99.12.4",
		v6: "fd7a:115c:a1e0::4",
		advertised: [],
		enabled: [],
		expiryDisabled: true,
		expiresInSec: 0,
		derp: "ewr",
		latency: [
			["ewr", 19],
			["ord", 33],
			["lhr", 80]
		],
		endpoint: "203.0.113.20:41641",
		createdAgoSec: 10368e3,
		cpu: 61,
		mem: 74,
		disk: 48,
		rx: 65e5,
		tx: 91e5,
		uptimeSec: 777600
	},
	{
		id: "runner-19",
		host: "runner-19",
		user: "nico@hearthline.dev",
		os: "linux",
		ver: "1.84.2",
		tags: ["tag:ci"],
		v4: "100.99.12.14",
		v6: "fd7a:115c:a1e0::14",
		advertised: [],
		enabled: [],
		ephemeral: true,
		expiryDisabled: true,
		expiresInSec: 0,
		blip: true,
		derp: "ewr",
		latency: [["ewr", 22], ["ord", 36]],
		endpoint: "203.0.113.21:41641",
		createdAgoSec: 7200,
		cpu: 44,
		mem: 52,
		disk: 18,
		rx: 32e5,
		tx: 48e5,
		uptimeSec: 7200
	},
	{
		id: "k3s-a",
		host: "k3s-a",
		user: "nico@hearthline.dev",
		os: "linux",
		ver: "1.84.1",
		tags: ["tag:k8s"],
		v4: "100.99.12.5",
		v6: "fd7a:115c:a1e0::5",
		advertised: [],
		enabled: [],
		expiryDisabled: true,
		expiresInSec: 0,
		derp: "ewr",
		latency: [
			["ewr", 13],
			["ord", 29],
			["dfw", 44]
		],
		endpoint: "203.0.113.30:41641",
		createdAgoSec: 7776e3,
		cpu: 48,
		mem: 66,
		disk: 41,
		rx: 11e6,
		tx: 124e5,
		uptimeSec: 1814400
	},
	{
		id: "k3s-b",
		host: "k3s-b",
		user: "nico@hearthline.dev",
		os: "linux",
		ver: "1.84.1",
		tags: ["tag:k8s"],
		v4: "100.99.12.6",
		v6: "fd7a:115c:a1e0::6",
		advertised: [],
		enabled: [],
		expiryDisabled: true,
		expiresInSec: 0,
		derp: "ewr",
		latency: [
			["ewr", 15],
			["ord", 31],
			["dfw", 46]
		],
		endpoint: "203.0.113.31:41641",
		createdAgoSec: 7776e3,
		cpu: 51,
		mem: 69,
		disk: 44,
		rx: 102e5,
		tx: 118e5,
		uptimeSec: 1814400
	},
	{
		id: "studio-mac",
		host: "studio-mac",
		user: "jo@hearthline.dev",
		os: "macOS",
		ver: "1.80.3",
		update: true,
		tags: [],
		v4: "100.99.12.7",
		v6: "fd7a:115c:a1e0::7",
		advertised: [],
		enabled: [],
		expiresInSec: 6912e3,
		derp: "ord",
		latency: [
			["ord", 18],
			["ewr", 32],
			["sea", 58]
		],
		endpoint: "198.51.100.40:41641",
		createdAgoSec: 20736e3,
		cpu: 19,
		mem: 58,
		disk: 71,
		rx: 14e5,
		tx: 62e4,
		uptimeSec: 518400
	},
	{
		id: "desk-win",
		host: "desk-win",
		user: "jo@hearthline.dev",
		os: "windows",
		ver: "1.84.0",
		tags: [],
		v4: "100.99.12.8",
		v6: "fd7a:115c:a1e0::8",
		advertised: [],
		enabled: [],
		expiresInSec: 6048e3,
		derp: "ord",
		latency: [
			["ord", 21],
			["ewr", 34],
			["dfw", 40]
		],
		endpoint: "198.51.100.41:41641",
		createdAgoSec: 1728e4,
		cpu: 27,
		mem: 63,
		disk: 55,
		rx: 21e5,
		tx: 88e4,
		uptimeSec: 259200
	},
	{
		id: "field-iphone",
		host: "field-iphone",
		user: "jo@hearthline.dev",
		os: "iOS",
		ver: "1.84.0",
		tags: [],
		v4: "100.99.12.9",
		v6: "fd7a:115c:a1e0::9",
		advertised: [],
		enabled: [],
		expiresInSec: 345600,
		derp: "ewr",
		latency: [
			["ewr", 34],
			["ord", 48],
			["lhr", 90]
		],
		endpoint: "198.51.100.50:41641",
		createdAgoSec: 2592e3,
		cpu: 6,
		mem: 41,
		disk: 62,
		rx: 42e4,
		tx: 18e4,
		uptimeSec: 64800,
		blocks: true
	},
	{
		id: "field-pixel",
		host: "field-pixel",
		user: "jo@hearthline.dev",
		os: "android",
		ver: "1.84.0",
		tags: [],
		v4: "100.99.12.10",
		v6: "fd7a:115c:a1e0::a",
		advertised: [],
		enabled: [],
		expiresInSec: 5184e3,
		derp: "syd",
		latency: [
			["syd", 210],
			["sea", 240],
			["ewr", 280]
		],
		endpoint: "198.51.100.51:41641",
		createdAgoSec: 3456e3,
		cpu: 8,
		mem: 47,
		disk: 58,
		rx: 51e4,
		tx: 24e4,
		uptimeSec: 32400,
		blocks: true
	},
	{
		id: "travel-ipad",
		host: "travel-ipad",
		user: "jo@hearthline.dev",
		os: "iOS",
		ver: "1.82.5",
		tags: [],
		v4: "100.99.12.11",
		v6: "fd7a:115c:a1e0::b",
		advertised: [],
		enabled: [],
		expiresInSec: 432e4,
		offlineForSec: 1320,
		derp: "lhr",
		latency: [["lhr", 42], ["ewr", 78]],
		endpoint: "198.51.100.52:41641",
		createdAgoSec: 864e4,
		cpu: 4,
		mem: 36,
		disk: 49,
		rx: 0,
		tx: 0,
		uptimeSec: 172800,
		blocks: true
	},
	{
		id: "porch-cam",
		host: "porch-cam",
		user: "ada@hearthline.dev",
		os: "linux",
		ver: "1.66.4",
		tags: ["tag:camera"],
		v4: "100.99.12.12",
		v6: "fd7a:115c:a1e0::c",
		advertised: [],
		enabled: [],
		expiryDisabled: true,
		expiresInSec: 0,
		derp: "dfw",
		latency: [
			["dfw", 70],
			["ord", 88],
			["ewr", 102]
		],
		udp: false,
		endpoint: null,
		createdAgoSec: 6048e4,
		cpu: 4,
		mem: 22,
		disk: 15,
		rx: 18e5,
		tx: 22e4,
		uptimeSec: 9504e3
	},
	{
		id: "cabin-backup",
		host: "cabin-backup",
		user: "ada@hearthline.dev",
		os: "linux",
		ver: "1.78.1",
		tags: ["tag:backup"],
		v4: "100.99.12.13",
		v6: "fd7a:115c:a1e0::d",
		advertised: ["10.8.0.0/24"],
		enabled: ["10.8.0.0/24"],
		expiryDisabled: true,
		expiresInSec: 0,
		offlineForSec: 129600,
		derp: "sea",
		latency: [["sea", 40], ["ord", 68]],
		endpoint: "203.0.113.80:41641",
		createdAgoSec: 36288e3,
		cpu: 7,
		mem: 29,
		disk: 81,
		rx: 0,
		tx: 0,
		uptimeSec: 1296e3
	},
	{
		id: "guest-mbp",
		host: "guest-mbp",
		user: "guest@hearthline.dev",
		os: "macOS",
		ver: "1.84.2",
		tags: [],
		v4: "100.99.12.15",
		v6: "fd7a:115c:a1e0::f",
		advertised: [],
		enabled: [],
		authorized: false,
		expiresInSec: 6912e3,
		derp: "ewr",
		latency: [["ewr", 26], ["ord", 41]],
		endpoint: "198.51.100.90:41641",
		createdAgoSec: 1200,
		cpu: 11,
		mem: 44,
		disk: 33,
		rx: 24e4,
		tx: 9e4,
		uptimeSec: 10800
	}
];
function salt(id) {
	let hash = 0;
	for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i) * (i + 1)) % 1e3;
	return hash / 80;
}
function wave(tick, id) {
	return Math.sin(tick / 2.2 + salt(id));
}
function jitterMs(base, tick, id, region) {
	const factor = 1 + .07 * Math.sin(tick / 2 + salt(id + region));
	return Math.max(1, Math.round(base * factor));
}
function buildLab(tick, now) {
	return SPECS.map((spec) => {
		let connected = spec.offlineForSec == null;
		let lastSeenAgo = spec.offlineForSec ?? 6;
		if (spec.blip && tick % 11 === 5) {
			connected = false;
			lastSeenAgo = 4;
		}
		const sway = wave(tick, spec.id);
		const telemetry = connected ? {
			cpu: Math.round(Math.min(97, Math.max(1, spec.cpu * (1 + .08 * sway)))),
			mem: Math.round(Math.min(96, Math.max(4, spec.mem + sway * 1.5))),
			disk: spec.disk,
			rxBps: Math.max(0, Math.round(spec.rx * (1 + .12 * sway))),
			txBps: Math.max(0, Math.round(spec.tx * (1 + .1 * Math.sin(tick / 2.5 + salt(spec.id))))),
			uptimeSec: spec.uptimeSec + Math.max(0, tick) * 2
		} : null;
		const supports = {
			...FULL,
			udp: spec.udp !== false
		};
		return {
			id: spec.id,
			nodeId: `n${spec.id}`,
			name: `${spec.host}.hearthline.ts.net`,
			hostname: spec.host,
			user: spec.user,
			os: spec.os,
			clientVersion: spec.ver,
			updateAvailable: spec.update === true,
			created: (/* @__PURE__ */ new Date(now - spec.createdAgoSec * 1e3)).toISOString(),
			lastSeen: (/* @__PURE__ */ new Date(now - lastSeenAgo * 1e3)).toISOString(),
			expires: spec.expiryDisabled ? null : new Date(now + spec.expiresInSec * 1e3).toISOString(),
			keyExpiryDisabled: spec.expiryDisabled === true,
			authorized: spec.authorized !== false,
			isExternal: spec.external === true,
			isEphemeral: spec.ephemeral === true,
			blocksIncomingConnections: spec.blocks === true,
			addresses: [spec.v4, spec.v6],
			tags: spec.tags,
			enabledRoutes: spec.enabled,
			advertisedRoutes: spec.advertised,
			connectedToControl: connected,
			derp: spec.derp,
			latency: spec.latency.map(([region, ms]) => ({
				region,
				ms: jitterMs(ms, tick, spec.id, region)
			})),
			endpoints: spec.endpoint ? [spec.endpoint] : [],
			supports,
			supportsKnown: true,
			tailnetLockError: "",
			telemetry
		};
	});
}
function seedHistory(now, endTick, edits) {
	const points = [];
	for (let i = 36; i >= 0; i--) {
		const tick = endTick - i;
		const t = now - i * 2e3;
		points.push(summarize(applyLabEdits(buildLab(tick, t), edits, t), t));
	}
	return points;
}
var WEIGHT = {
	critical: 9,
	watch: 3,
	info: 1
};
function push(findings, device, severity, code, title, detail) {
	const deviceId = device?.id ?? null;
	findings.push({
		id: `${deviceId ?? "fleet"}:${code}`,
		deviceId,
		severity,
		code,
		title,
		detail
	});
}
function evaluate(devices, rules, now) {
	const findings = [];
	for (const device of devices) {
		const name = device.hostname || device.name;
		if (rules.flagUnauthorized && !device.authorized) push(findings, device, "critical", "unauthorized", `${name} is not authorized`, "Device authorization is on, and this machine has not been approved.");
		if (device.tailnetLockError) push(findings, device, "critical", "lock-error", `${name} failed tailnet lock`, device.tailnetLockError);
		if (!device.connectedToControl && !device.isEphemeral) {
			const downSec = Math.max(0, (now - Date.parse(device.lastSeen)) / 1e3);
			if (downSec >= rules.offlineMinutes * 60) {
				if (rules.flagExitNodeDown && advertisesExit(device)) push(findings, device, "critical", "exit-down", `Exit node ${name} is down`, `No control connection for ${Math.round(downSec / 60)} minutes. Traffic sent at its exit route has nowhere to go.`);
				else if (rules.flagSubnetDown && advertisesSubnet(device)) push(findings, device, "critical", "subnet-down", `Subnet router ${name} is down`, `Approved routes ${device.enabledRoutes.join(", ") || device.advertisedRoutes.join(", ")} have no live machine behind them.`);
				else push(findings, device, "watch", "offline", `${name} left the control plane`, `Last seen ${Math.round(downSec / 60)} minutes ago. Ephemeral nodes are ignored.`);
			}
		}
		if (!device.keyExpiryDisabled && device.expires) {
			const leftMs = Date.parse(device.expires) - now;
			const days = rules.keyExpiryDays * 864e5;
			if (Number.isFinite(leftMs) && leftMs < days) {
				const critical = leftMs < 2592e5;
				push(findings, device, critical ? "critical" : "watch", "key-expiry", critical ? `${name} key expires within 3 days` : `${name} key expires soon`, "Node keys that expire will drop the machine until someone signs it in again.");
			}
		}
		if (rules.flagKeyExpiryDisabled && device.keyExpiryDisabled && !device.isEphemeral && (device.tags.length === 0 || device.tags.some((tag) => tag === "tag:camera" || tag === "tag:iot"))) push(findings, device, "watch", "expiry-disabled", `${name} will not rotate its node key`, device.tags.length ? "Tagged IoT with expiry disabled stays trusted until someone removes it." : "Personal machines usually keep key expiry on.");
		if (rules.minClientVersion.trim() && device.clientVersion && cmpVersion(device.clientVersion, rules.minClientVersion.trim()) < 0) push(findings, device, "watch", "stale-client", `${name} is below ${rules.minClientVersion}`, `Running ${device.clientVersion}. Old clients miss security fixes and newer NAT behavior.`);
		if (rules.flagRelayOnly && device.connectedToControl && device.supportsKnown && !device.supports.udp) push(findings, device, "watch", "relay-only", `${name} cannot use direct UDP`, "Paths will hairpin through DERP relays. Fine for a camera, poor for anything latency-sensitive.");
		const latency = bestLatency(device);
		if (device.connectedToControl && latency != null && latency > rules.maxDerpMs) push(findings, device, "watch", "high-latency", `${name} is ${latency} ms from its nearest relay`, `Threshold is ${rules.maxDerpMs} ms. This is control-plane delay, not a ping between your machines.`);
		if (rules.flagUpdateAvailable && device.updateAvailable) push(findings, device, "info", "update", `${name} has a client update`, `Installed ${device.clientVersion || "unknown"}.`);
		if (rules.flagExternal && device.isExternal) push(findings, device, "info", "external", `${name} is shared in from another tailnet`, "External nodes follow the other tailnet's key and posture rules.");
	}
	const rank = {
		critical: 0,
		watch: 1,
		info: 2
	};
	return findings.sort((a, b) => rank[a.severity] - rank[b.severity] || a.title.localeCompare(b.title));
}
function scoreFindings(findings) {
	const penalty = findings.reduce((sum, finding) => sum + WEIGHT[finding.severity], 0);
	return Math.max(0, Math.min(100, 100 - penalty));
}
function diffIncidents(previous, next, known, now) {
	const knownSet = new Set(known);
	const nextIds = new Set(next.map((finding) => finding.id));
	const incidents = [];
	for (const finding of next) {
		if (knownSet.has(finding.id)) continue;
		incidents.push({
			incidentId: `${finding.id}:open:${now}`,
			kind: "opened",
			at: now,
			severity: finding.severity,
			title: finding.title,
			detail: finding.detail,
			deviceId: finding.deviceId
		});
	}
	for (const finding of previous) {
		if (nextIds.has(finding.id)) continue;
		incidents.push({
			incidentId: `${finding.id}:clear:${now}`,
			kind: "cleared",
			at: now,
			severity: finding.severity,
			title: finding.title,
			detail: "Cleared.",
			deviceId: finding.deviceId
		});
	}
	return {
		incidents,
		known: [...nextIds]
	};
}
var PREFS_KEY = "meshwarden.prefs.v1";
var bootDevices = applyLabEdits(buildLab(0, LAB_ORIGIN), {}, LAB_ORIGIN);
var bootFindings = evaluate(bootDevices, DEFAULT_RULES, LAB_ORIGIN);
function bootNote(at) {
	return {
		incidentId: "boot",
		kind: "note",
		at,
		severity: "info",
		title: "Lab board opened",
		detail: "Hearthline is a fictional tailnet. Nothing here is your network.",
		deviceId: null
	};
}
function sanitizeRules(value) {
	const record = asRecord(value) ?? {};
	const base = DEFAULT_RULES;
	return {
		offlineMinutes: clampNum(record.offlineMinutes, 1, 1440, base.offlineMinutes),
		keyExpiryDays: clampNum(record.keyExpiryDays, 1, 365, base.keyExpiryDays),
		maxDerpMs: clampNum(record.maxDerpMs, 20, 2e3, base.maxDerpMs),
		minClientVersion: typeof record.minClientVersion === "string" ? record.minClientVersion.slice(0, 32) : base.minClientVersion,
		flagKeyExpiryDisabled: typeof record.flagKeyExpiryDisabled === "boolean" ? record.flagKeyExpiryDisabled : base.flagKeyExpiryDisabled,
		flagUnauthorized: typeof record.flagUnauthorized === "boolean" ? record.flagUnauthorized : base.flagUnauthorized,
		flagUpdateAvailable: typeof record.flagUpdateAvailable === "boolean" ? record.flagUpdateAvailable : base.flagUpdateAvailable,
		flagRelayOnly: typeof record.flagRelayOnly === "boolean" ? record.flagRelayOnly : base.flagRelayOnly,
		flagExternal: typeof record.flagExternal === "boolean" ? record.flagExternal : base.flagExternal,
		flagExitNodeDown: typeof record.flagExitNodeDown === "boolean" ? record.flagExitNodeDown : base.flagExitNodeDown,
		flagSubnetDown: typeof record.flagSubnetDown === "boolean" ? record.flagSubnetDown : base.flagSubnetDown
	};
}
function persistPrefs(rules, pollSec, tailnet, authKind) {
	if (typeof window === "undefined") return;
	const payload = {
		rules,
		pollSec,
		tailnet,
		authKind
	};
	localStorage.setItem(PREFS_KEY, JSON.stringify(payload));
}
function recompute(devices, rules, now, previous, known, incidents) {
	const findings = evaluate(devices, rules, now);
	const diff = diffIncidents(previous, findings, known, now);
	return {
		devices,
		findings,
		knownFindingIds: diff.known,
		incidents: [...diff.incidents, ...incidents].slice(0, 80)
	};
}
function labSnapshot(tick, now, edits, rules, previous, known, incidents) {
	const devices = applyLabEdits(buildLab(tick, now), edits, now);
	return {
		...recompute(devices, rules, now, previous, known, incidents),
		historyPoint: summarize(devices, now)
	};
}
var useMesh = create((set, get) => ({
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
		const rules = sanitizeRules({
			...state.rules,
			...patch
		});
		const now = state.uiNow ?? state.clock;
		set({
			rules,
			...recompute(state.devices, rules, now, state.findings, state.knownFindingIds, state.incidents)
		});
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
			incidents: [bootNote(now)]
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
			allowActions: false
		});
	},
	markLinked: () => set((state) => ({
		linkGeneration: state.linkGeneration + 1,
		lastError: null
	})),
	disconnect: () => set({
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
		syncing: false
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
			incidents: [bootNote(now)]
		});
	},
	alignClock: () => {
		const now = Date.now();
		const state = get();
		if (state.mode !== "lab") {
			set({
				clock: now,
				uiNow: now,
				clockAligned: true
			});
			return;
		}
		const devices = applyLabEdits(buildLab(state.tick, now), state.labEdits, now);
		set({
			clock: now,
			uiNow: now,
			clockAligned: true,
			devices,
			findings: evaluate(devices, state.rules, now),
			history: seedHistory(now, state.tick, state.labEdits),
			incidents: state.incidents.map((incident) => incident.at === LAB_ORIGIN ? {
				...incident,
				at: now
			} : incident)
		});
	},
	loadPrefs: () => {
		if (typeof window === "undefined") return;
		try {
			const raw = localStorage.getItem(PREFS_KEY);
			if (!raw) return;
			const parsed = asRecord(JSON.parse(raw));
			if (!parsed) return;
			const state = get();
			const rules = parsed.rules ? sanitizeRules(parsed.rules) : state.rules;
			const pollSec = parsed.pollSec === 15 || parsed.pollSec === 30 || parsed.pollSec === 60 ? parsed.pollSec : state.pollSec;
			const tailnet = typeof parsed.tailnet === "string" ? parsed.tailnet.slice(0, 253) : state.tailnet;
			const authKind = parsed.authKind === "oauth" ? "oauth" : "token";
			const now = state.uiNow ?? state.clock;
			const findings = evaluate(state.devices, rules, now);
			set({
				rules,
				pollSec,
				tailnet,
				authKind,
				findings,
				knownFindingIds: findings.map((finding) => finding.id)
			});
		} catch {}
	},
	tickLab: () => {
		const state = get();
		if (state.mode !== "lab") return;
		if (typeof document !== "undefined" && document.hidden) return;
		const tick = state.tick + 1;
		const now = state.clockAligned ? Date.now() : state.clock + 2e3;
		const snap = labSnapshot(tick, now, state.labEdits, state.rules, state.findings, state.knownFindingIds, state.incidents);
		set({
			tick,
			clock: now,
			uiNow: now,
			devices: snap.devices,
			findings: snap.findings,
			knownFindingIds: snap.knownFindingIds,
			incidents: snap.incidents,
			history: [...state.history, snap.historyPoint].slice(-48)
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
				if (!token || !state.tokenExpiresAt || state.tokenExpiresAt < Date.now() + 6e4) {
					if (!state.clientId || !state.clientSecret) throw new Error("OAuth client id and secret are required.");
					const exchanged = await exchangeOauth({ data: {
						clientId: state.clientId,
						clientSecret: state.clientSecret
					} });
					token = exchanged.accessToken;
					set({
						token,
						tokenExpiresAt: Date.now() + exchanged.expiresIn * 1e3
					});
				}
			}
			if (!token) throw new Error("Paste a credential before watching.");
			const pulled = await pullTailnet({ data: {
				token,
				tailnet: get().tailnet || "-"
			} });
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
					notes: pulled.notes
				},
				history: [...current.history, summarize(devices, now)].slice(-48),
				clock: now,
				uiNow: now,
				lastSync: now,
				lastError: null,
				syncing: false,
				selectedId: next.devices.some((device) => device.id === current.selectedId) ? current.selectedId : null
			});
		} catch (error) {
			const message = errMessage(error);
			const rejected = /rejected|refused|expired|mistyped|required/i.test(message);
			set({
				syncing: false,
				lastError: message,
				token: rejected && get().authKind === "token" ? "" : get().token,
				linkGeneration: rejected ? 0 : get().linkGeneration
			});
		}
	},
	authorize: async (id, authorized) => {
		const state = get();
		if (state.mode === "lab") {
			const labEdits = {
				...state.labEdits,
				[id]: {
					...state.labEdits[id],
					authorized
				}
			};
			const now = state.uiNow ?? state.clock;
			const snap = labSnapshot(state.tick, now, labEdits, state.rules, state.findings, state.knownFindingIds, state.incidents);
			set({
				labEdits,
				devices: snap.devices,
				findings: snap.findings,
				knownFindingIds: snap.knownFindingIds,
				incidents: snap.incidents
			});
			return "lab";
		}
		if (!state.token) throw new Error("Link a credential first.");
		await mutateDevice({ data: {
			token: state.token,
			op: "authorize",
			deviceId: id,
			authorized,
			routes: []
		} });
		await get().sync();
		return "live";
	},
	expire: async (id) => {
		const state = get();
		if (state.mode === "lab") {
			const labEdits = {
				...state.labEdits,
				[id]: {
					...state.labEdits[id],
					expired: true
				}
			};
			const now = state.uiNow ?? state.clock;
			const snap = labSnapshot(state.tick, now, labEdits, state.rules, state.findings, state.knownFindingIds, state.incidents);
			set({
				labEdits,
				devices: snap.devices,
				findings: snap.findings,
				knownFindingIds: snap.knownFindingIds,
				incidents: snap.incidents
			});
			return "lab";
		}
		if (!state.token) throw new Error("Link a credential first.");
		await mutateDevice({ data: {
			token: state.token,
			op: "expire",
			deviceId: id,
			authorized: false,
			routes: []
		} });
		await get().sync();
		return "live";
	},
	remove: async (id) => {
		const state = get();
		if (state.mode === "lab") {
			const labEdits = {
				...state.labEdits,
				[id]: {
					...state.labEdits[id],
					deleted: true
				}
			};
			const now = state.uiNow ?? state.clock;
			const snap = labSnapshot(state.tick, now, labEdits, state.rules, state.findings, state.knownFindingIds, state.incidents);
			set({
				labEdits,
				devices: snap.devices,
				findings: snap.findings,
				knownFindingIds: snap.knownFindingIds,
				incidents: snap.incidents,
				selectedId: state.selectedId === id ? null : state.selectedId
			});
			return "lab";
		}
		if (!state.token) throw new Error("Link a credential first.");
		await mutateDevice({ data: {
			token: state.token,
			op: "delete",
			deviceId: id,
			authorized: false,
			routes: []
		} });
		await get().sync();
		return "live";
	},
	setRoutes: async (id, routes) => {
		const state = get();
		if (state.mode === "lab") {
			const labEdits = {
				...state.labEdits,
				[id]: {
					...state.labEdits[id],
					enabledRoutes: routes
				}
			};
			const now = state.uiNow ?? state.clock;
			const snap = labSnapshot(state.tick, now, labEdits, state.rules, state.findings, state.knownFindingIds, state.incidents);
			set({
				labEdits,
				devices: snap.devices,
				findings: snap.findings,
				knownFindingIds: snap.knownFindingIds,
				incidents: snap.incidents
			});
			return "lab";
		}
		if (!state.token) throw new Error("Link a credential first.");
		await mutateDevice({ data: {
			token: state.token,
			op: "routes",
			deviceId: id,
			authorized: false,
			routes
		} });
		await get().sync();
		return "live";
	}
}));
var FILTERS = [
	{
		id: "all",
		label: "All"
	},
	{
		id: "up",
		label: "Up"
	},
	{
		id: "down",
		label: "Down"
	},
	{
		id: "routers",
		label: "Routers"
	},
	{
		id: "attention",
		label: "Attention"
	}
];
function rankOf(device, findings) {
	const mine = findings.filter((finding) => finding.deviceId === device.id);
	if (mine.some((finding) => finding.severity === "critical")) return 3;
	if (mine.some((finding) => finding.severity === "watch")) return 2;
	if (mine.some((finding) => finding.severity === "info")) return 1;
	return 0;
}
function toneFor(score) {
	if (score >= 80) return "text-primary";
	if (score >= 60) return "text-accent";
	return "text-danger";
}
function Ring({ score }) {
	const radius = 36;
	const circ = 2 * Math.PI * radius;
	const offset = circ * (1 - score / 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 96 96",
		className: `size-24 ${toneFor(score)}`,
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "48",
			cy: "48",
			r: radius,
			fill: "none",
			stroke: "currentColor",
			strokeOpacity: "0.18",
			strokeWidth: "6"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "48",
			cy: "48",
			r: radius,
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "6",
			strokeLinecap: "round",
			strokeDasharray: circ,
			strokeDashoffset: offset,
			transform: "rotate(-90 48 48)"
		})]
	});
}
function Board() {
	const mode = useMesh((state) => state.mode);
	const devices = useMesh((state) => state.devices);
	const findings = useMesh((state) => state.findings);
	const history = useMesh((state) => state.history);
	const query = useMesh((state) => state.query);
	const filter = useMesh((state) => state.filter);
	const sort = useMesh((state) => state.sort);
	const selectedId = useMesh((state) => state.selectedId);
	const setQuery = useMesh((state) => state.setQuery);
	const setFilter = useMesh((state) => state.setFilter);
	const setSort = useMesh((state) => state.setSort);
	const select = useMesh((state) => state.select);
	const setView = useMesh((state) => state.setView);
	const enterLab = useMesh((state) => state.enterLab);
	const linkGeneration = useMesh((state) => state.linkGeneration);
	const syncing = useMesh((state) => state.syncing);
	const lastError = useMesh((state) => state.lastError);
	const clock = useMesh((state) => state.uiNow ?? state.clock);
	const allowActions = useMesh((state) => state.allowActions);
	const score = scoreFindings(findings);
	const attention = (0, import_react.useMemo)(() => new Set(findings.map((finding) => finding.deviceId).filter(Boolean)), [findings]);
	const visible = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		const list = devices.filter((device) => {
			if (filter === "up" && !device.connectedToControl) return false;
			if (filter === "down" && device.connectedToControl) return false;
			if (filter === "routers" && !advertisesExit(device) && !advertisesSubnet(device)) return false;
			if (filter === "attention" && !attention.has(device.id)) return false;
			if (!q) return true;
			return [
				device.hostname,
				device.name,
				device.user,
				device.os,
				device.clientVersion,
				...device.addresses,
				...device.tags
			].join(" ").toLowerCase().includes(q);
		});
		const latencyOf = (device) => bestLatency(device) ?? 1e9;
		list.sort((a, b) => {
			if (sort === "name") return a.hostname.localeCompare(b.hostname);
			if (sort === "latency") return latencyOf(a) - latencyOf(b);
			if (sort === "seen") return Date.parse(b.lastSeen) - Date.parse(a.lastSeen);
			const rank = rankOf(b, findings) - rankOf(a, findings);
			if (rank) return rank;
			if (a.connectedToControl !== b.connectedToControl) return a.connectedToControl ? 1 : -1;
			return a.hostname.localeCompare(b.hostname);
		});
		return list;
	}, [
		attention,
		devices,
		filter,
		findings,
		query,
		sort
	]);
	if (mode === "live" && linkGeneration === 0 && devices.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-4 rounded-xl border border-line bg-surface p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-semibold text-balance",
				children: "No tailnet linked"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-xl text-sm text-pretty text-muted",
				children: "Paste a Tailscale credential on the Link tab. Until then this board stays empty on purpose, so a rehearsal network is never mistaken for yours."
			}),
			lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-sm text-danger",
				children: lastError
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					tone: "solid",
					onClick: () => setView("link"),
					children: "Link a tailnet"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: enterLab,
					children: "Return to the lab"
				})]
			})
		]
	});
	const up = devices.filter((device) => device.connectedToControl).length;
	const exits = devices.filter(advertisesExit);
	const subnets = devices.filter(advertisesSubnet);
	const telem = devices.flatMap((device) => device.telemetry ? [device.telemetry] : []);
	const avgCpu = telem.length ? Math.round(telem.reduce((sum, item) => sum + item.cpu, 0) / telem.length) : null;
	const rx = telem.reduce((sum, item) => sum + item.rxBps, 0);
	const tx = telem.reduce((sum, item) => sum + item.txBps, 0);
	const latest = history[history.length - 1];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "rounded-xl border border-line border-l-4 border-l-accent bg-surface px-4 py-3 text-sm text-pretty",
				children: mode === "lab" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: "Lab rehearsal. "
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted",
					children: "Fictional Hearthline tailnet. Addresses are documentation ranges. CPU, memory, disk, and bandwidth are simulated — Tailscale does not publish host counters. Link a credential to watch a real tailnet."
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: "Live tailnet. "
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted",
					children: [
						"The credential stays in this tab’s memory. Control actions are ",
						allowActions ? "armed" : "off",
						". Host CPU and bandwidth stay blank on purpose."
					]
				})] })
			}),
			lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm",
				children: lastError
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-4 lg:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4 rounded-xl border border-line bg-surface p-4 lg:w-72 lg:shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative size-24 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ring, { score }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-0 grid place-items-center font-mono text-2xl font-medium tabular-nums",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sr-only",
								children: "Health score "
							}), score]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-muted",
							children: "Board score"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-pretty text-muted",
							children: [
								findings.filter((finding) => finding.severity === "critical").length,
								" critical,",
								" ",
								findings.filter((finding) => finding.severity === "watch").length,
								" watches. Weighted, not a vibe."
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid min-w-0 flex-1 gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-xl border border-line bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-muted",
								children: "Machines on control"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-lg tabular-nums",
								children: [up, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: ["/", devices.length]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
								values: history.map((point) => point.onlineCount),
								label: "Machines connected to control over this watch"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-xl border border-line bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-muted",
								children: mode === "lab" ? "Lab traffic, simulated" : "Median relay latency"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-lg tabular-nums",
								children: mode === "lab" ? formatRate((latest?.rxBps ?? 0) + (latest?.txBps ?? 0)) : latest?.medianLatency != null ? `${Math.round(latest.medianLatency)} ms` : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
								tone: mode === "lab" ? "accent" : "primary",
								values: history.map((point) => mode === "lab" ? point.rxBps + point.txBps : point.medianLatency ?? 0),
								label: mode === "lab" ? "Simulated aggregate traffic" : "Median DERP latency"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
						label: "Up",
						value: `${up}`,
						detail: `${devices.length - up} down`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
						label: "Exit nodes",
						value: `${exits.filter((device) => device.connectedToControl).length}/${exits.length}`,
						detail: "advertising default route"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
						label: "Subnet routers",
						value: `${subnets.filter((device) => device.connectedToControl).length}/${subnets.length}`,
						detail: "advertising a private CIDR"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
						label: "Findings",
						value: `${findings.length}`,
						detail: "open on this board"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
						label: "Updates",
						value: `${devices.filter((device) => device.updateAvailable).length}`,
						detail: "client reported"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
						label: mode === "lab" ? "Avg CPU" : "Samples",
						value: mode === "lab" && avgCpu != null ? `${avgCpu}%` : `${history.length}`,
						detail: mode === "lab" ? "simulated, online hosts" : "syncs kept this tab"
					})
				]
			}),
			mode === "lab" && avgCpu != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-xs text-muted",
				children: [
					"Simulated host load · CPU ",
					avgCpu,
					"% avg · ",
					formatRate(rx),
					" in · ",
					formatRate(tx),
					" out"
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 sm:flex-row sm:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "relative min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sr-only",
								children: "Search devices"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "fleet-search",
								value: query,
								onChange: (event) => setQuery(event.target.value),
								placeholder: "Hosts, IPs, tags, owners",
								className: "min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sr-only",
								children: "Sort"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: sort,
								onChange: (event) => setSort(event.target.value),
								className: "min-h-11 rounded-lg border border-line bg-surface px-3 text-fg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "attention",
										children: "Sort by attention"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "name",
										children: "Sort by name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "latency",
										children: "Sort by relay latency"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "seen",
										children: "Sort by last seen"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "shrink-0",
							onClick: () => {
								const payload = {
									source: mode,
									note: mode === "lab" ? "Simulated Hearthline lab. Not a real tailnet." : "Tailscale fields retained by Meshwarden. Machine keys are not included.",
									exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
									devices
								};
								const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
								const url = URL.createObjectURL(blob);
								const anchor = document.createElement("a");
								anchor.href = url;
								anchor.download = mode === "lab" ? "meshwarden-lab.json" : "meshwarden-inventory.json";
								anchor.click();
								URL.revokeObjectURL(url);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
								className: "size-4",
								"aria-hidden": true
							}), "Export"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [FILTERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": filter === item.id,
						onClick: () => setFilter(item.id),
						className: `min-h-11 rounded-lg px-3 text-sm ${filter === item.id ? "bg-primary text-bg" : "bg-surface text-muted"}`,
						children: item.label
					}, item.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "self-center font-mono text-xs text-muted",
						children: [
							visible.length,
							" shown",
							syncing ? " · syncing" : ""
						]
					})]
				})]
			}),
			visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl border border-line bg-surface px-4 py-8 text-sm text-muted",
				children: "Nothing matches. Clear the search or switch the filter."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "overflow-hidden rounded-xl border border-line bg-surface",
				children: visible.map((device) => {
					const latency = bestLatency(device);
					const rank = rankOf(device, findings);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "border-b border-line last:border-b-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => select(device.id),
							"aria-current": selectedId === device.id ? "true" : void 0,
							className: `flex w-full items-start gap-3 px-3 py-3 text-left hover:bg-surface-2 ${selectedId === device.id ? "bg-surface-2" : ""}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `mt-1.5 size-2 shrink-0 rounded-full ${device.connectedToControl ? "bg-primary" : "bg-muted"}`,
									"aria-hidden": true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex flex-wrap items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OsIcon, { os: device.os }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate font-medium",
												children: device.hostname
											}),
											exitEnabled(device) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
												tone: "warn",
												children: "Exit"
											}) : null,
											subnetEnabled(device) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { children: "Subnet" }) : null,
											!device.authorized ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
												tone: "bad",
												children: "Unauthorized"
											}) : null,
											device.isEphemeral ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { children: "Ephemeral" }) : null,
											rank === 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
												tone: "bad",
												children: "Critical"
											}) : rank === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
												tone: "warn",
												children: "Watch"
											}) : null
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-1 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ipv4(device.addresses) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: device.os }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: device.tags[0] ? tagLabel(device.tags[0]) : shortUser(device.user) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: device.connectedToControl ? device.derp.toUpperCase() || "relay ?" : formatAgo(device.lastSeen, clock) })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "shrink-0 text-right font-mono text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: device.connectedToControl ? "text-primary" : "text-muted",
										children: device.connectedToControl ? "Up" : "Down"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block tabular-nums text-muted",
										children: device.connectedToControl && latency != null ? `${latency} ms` : "—"
									})]
								})
							]
						})
					}, device.id);
				})
			})
		]
	});
}
function Stat$1({ label, value, detail }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl border border-line bg-surface px-3 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xl font-medium tabular-nums",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: detail
			})
		]
	});
}
function ConnectView() {
	const mode = useMesh((state) => state.mode);
	const authKind = useMesh((state) => state.authKind);
	const tailnet = useMesh((state) => state.tailnet);
	const token = useMesh((state) => state.token);
	const clientId = useMesh((state) => state.clientId);
	const clientSecret = useMesh((state) => state.clientSecret);
	const pollSec = useMesh((state) => state.pollSec);
	const allowActions = useMesh((state) => state.allowActions);
	const linkGeneration = useMesh((state) => state.linkGeneration);
	const syncing = useMesh((state) => state.syncing);
	const lastError = useMesh((state) => state.lastError);
	const lastSync = useMesh((state) => state.lastSync);
	const setDraft = useMesh((state) => state.setDraft);
	const setPollSec = useMesh((state) => state.setPollSec);
	const setAllowActions = useMesh((state) => state.setAllowActions);
	const enterLab = useMesh((state) => state.enterLab);
	const enterLive = useMesh((state) => state.enterLive);
	const markLinked = useMesh((state) => state.markLinked);
	const disconnect = useMesh((state) => state.disconnect);
	const resetLab = useMesh((state) => state.resetLab);
	const setView = useMesh((state) => state.setView);
	const [reveal, setReveal] = (0, import_react.useState)(false);
	const [armAsk, setArmAsk] = (0, import_react.useState)(false);
	const linked = mode === "live" && linkGeneration > 0 && (authKind === "oauth" ? clientSecret.length > 0 : token.length > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-semibold text-balance",
						children: "Link"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-pretty text-muted",
						children: "Watch the fictional lab, or hand Meshwarden a credential for a real tailnet. The credential is not written to disk, a database, or browser storage."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": mode === "lab",
							className: `min-h-11 rounded-lg px-3 text-sm ${mode === "lab" ? "bg-primary text-bg" : "bg-surface text-muted"}`,
							onClick: () => {
								if (mode !== "lab") enterLab();
							},
							children: "Lab rehearsal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": mode === "live",
							className: `min-h-11 rounded-lg px-3 text-sm ${mode === "live" ? "bg-primary text-bg" : "bg-surface text-muted"}`,
							onClick: () => {
								if (mode !== "live") enterLive();
							},
							children: "Live tailnet"
						})]
					}),
					mode === "lab" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "flex flex-col gap-3 rounded-xl border border-line bg-surface p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-pretty text-muted",
							children: "Hearthline is invented. You can authorize the guest laptop, expire a key, or delete a machine to see the watchdog move. Reset restores the original fifteen hosts."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => setView("board"),
								children: "Back to the board"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => {
									resetLab();
									toast.success("Lab restored");
								},
								children: "Reset lab"
							})]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex flex-col gap-4 rounded-xl border border-line bg-surface p-4",
						onSubmit: (event) => {
							event.preventDefault();
							if (authKind === "token" && token.trim().length < 8) {
								toast.error("Paste an access token first");
								return;
							}
							if (authKind === "oauth" && (clientId.trim().length < 8 || clientSecret.trim().length < 8)) {
								toast.error("Client id and secret are both required");
								return;
							}
							markLinked();
							setView("board");
							toast.success("Watching. The credential stays in this tab.");
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": authKind === "token",
									className: `min-h-11 rounded-lg px-3 text-sm ${authKind === "token" ? "bg-surface-2 text-fg" : "text-muted"}`,
									onClick: () => setDraft({ authKind: "token" }),
									children: "Access token"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": authKind === "oauth",
									className: `min-h-11 rounded-lg px-3 text-sm ${authKind === "oauth" ? "bg-surface-2 text-fg" : "text-muted"}`,
									onClick: () => setDraft({ authKind: "oauth" }),
									children: "OAuth client"
								})]
							}),
							authKind === "token" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "API access token",
								hint: "From Tailscale admin, Settings, Keys. Prefer the shortest expiry you can tolerate.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: inputClass,
										type: reveal ? "text" : "password",
										name: "meshwarden-credential",
										autoComplete: "off",
										spellCheck: false,
										autoCapitalize: "off",
										value: token,
										onChange: (event) => setDraft({ token: event.target.value })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										onClick: () => setReveal((open) => !open),
										children: reveal ? "Hide" : "Show"
									})]
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Client id",
								hint: "Not a secret. Saved only in this tab’s memory, same as the secret.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									name: "meshwarden-client-id",
									autoComplete: "off",
									spellCheck: false,
									value: clientId,
									onChange: (event) => setDraft({ clientId: event.target.value })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Client secret",
								hint: "Exchanged for a short-lived access token. The secret is not stored.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									type: reveal ? "text" : "password",
									name: "meshwarden-client-secret",
									autoComplete: "off",
									spellCheck: false,
									value: clientSecret,
									onChange: (event) => setDraft({ clientSecret: event.target.value })
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Tailnet",
								hint: "Use - to mean whichever tailnet the credential belongs to.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: tailnet,
									spellCheck: false,
									autoCapitalize: "off",
									onChange: (event) => setDraft({ tailnet: event.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
								className: "flex flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
									className: "text-sm font-medium",
									children: "Sync every"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-2",
									children: [
										15,
										30,
										60
									].map((seconds) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"aria-pressed": pollSec === seconds,
										className: `min-h-11 flex-1 rounded-lg text-sm ${pollSec === seconds ? "bg-primary text-bg" : "bg-bg text-muted"}`,
										onClick: () => setPollSec(seconds),
										children: [seconds, "s"]
									}, seconds))
								})]
							}),
							lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								role: "alert",
								className: "text-sm text-danger",
								children: lastError
							}) : null,
							linked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									syncing ? "Syncing…" : lastSync ? "Credential is in memory and a sync has landed." : "Credential is in memory.",
									" ",
									"Reloading this page drops it."
								]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									tone: "solid",
									children: "Watch this tailnet"
								}), linked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									onClick: () => {
										disconnect();
										toast.success("Credential dropped from this tab");
									},
									children: "Disconnect"
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": allowActions,
								disabled: !linked,
								className: `min-h-11 rounded-lg border px-3 text-left text-sm disabled:opacity-50 ${allowActions ? "border-accent text-accent" : "border-line text-muted"}`,
								onClick: () => {
									if (allowActions) setAllowActions(false);
									else setArmAsk(true);
								},
								children: allowActions ? "Control actions armed — click to disarm" : "Control actions off — click to arm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-pretty text-muted",
								children: "Arming resets when you reload. That is deliberate. Authorize, expire, delete, and route approval stay hidden until then, and each one still asks you to confirm."
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "flex flex-col gap-4 rounded-xl border border-line bg-surface p-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-medium",
						children: "What this tab will and will not do"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "flex flex-col gap-3 text-pretty text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Calls only api.tailscale.com, and only devices, DNS, the policy file, authorize, expire, delete, and routes." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Strips machine keys and node keys before they reach the page." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Does not log the credential. Errors are scrubbed if a token ever appears in them." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Saves the tailnet name, the poll interval, and watchdog thresholds in this browser. Never the credential." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The arm switch stops misclicks. It is not a vault. Anyone holding the credential can call Tailscale themselves." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Prefer an OAuth client over a full access token. Read scopes are enough until you arm actions." })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium text-fg",
								children: "Scopes worth asking for"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "flex flex-col gap-1 font-mono text-xs text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "devices:core:read or devices:core — the machine list" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "devices:routes:read — subnet and exit routes" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "dns:read — MagicDNS and resolvers" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "devices:core and devices:routes — only if you will arm actions" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted",
								children: "Policy-file read is separate. If it is missing, the rest of the board still syncs and the policy tab says so."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted",
						children: [
							"Docs:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "text-primary underline decoration-line underline-offset-2",
								href: "https://tailscale.com/docs/reference/tailscale-api",
								target: "_blank",
								rel: "noreferrer",
								children: "Tailscale API"
							}),
							" · ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "text-primary underline decoration-line underline-offset-2",
								href: "https://tailscale.com/docs/features/oauth-clients",
								target: "_blank",
								rel: "noreferrer",
								children: "OAuth clients"
							})
						]
					})
				]
			}),
			armAsk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				title: "Arm control actions?",
				body: "This tab will be allowed to expire keys, delete machines, change authorization, and push route approval. Each action still asks you to confirm. Reload disarms. Do this only with a credential you meant to grant those scopes.",
				confirmLabel: "Arm",
				danger: true,
				onClose: () => setArmAsk(false),
				onConfirm: () => {
					setAllowActions(true);
					setArmAsk(false);
				}
			}) : null
		]
	});
}
function Inspector({ onClose }) {
	const devices = useMesh((state) => state.devices);
	const selectedId = useMesh((state) => state.selectedId);
	const allFindings = useMesh((state) => state.findings);
	const device = (0, import_react.useMemo)(() => devices.find((item) => item.id === selectedId) ?? null, [devices, selectedId]);
	const findings = (0, import_react.useMemo)(() => allFindings.filter((finding) => finding.deviceId === selectedId), [allFindings, selectedId]);
	const mode = useMesh((state) => state.mode);
	const allowActions = useMesh((state) => state.allowActions);
	const history = useMesh((state) => state.history);
	const clock = useMesh((state) => state.uiNow ?? state.clock);
	const authorize = useMesh((state) => state.authorize);
	const expire = useMesh((state) => state.expire);
	const remove = useMesh((state) => state.remove);
	const setRoutes = useMesh((state) => state.setRoutes);
	const setView = useMesh((state) => state.setView);
	const [Chart, setChart] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const routeKey = device?.enabledRoutes.join("|") ?? "";
	const [draft, setDraft] = (0, import_react.useState)(device?.enabledRoutes ?? []);
	(0, import_react.useEffect)(() => {
		let live = true;
		import("./telemetry-chart-D9AKZ3ih.mjs").then((mod) => {
			if (live) setChart(() => mod.TelemetryChart);
		});
		return () => {
			live = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		setDraft(device?.enabledRoutes ?? []);
	}, [device?.id, routeKey]);
	const rows = (0, import_react.useMemo)(() => {
		if (!device) return [];
		return history.map((point) => {
			const sample = point.byId[device.id];
			return {
				t: point.t,
				cpu: sample ? sample.cpu : null,
				rx: sample ? Math.round(sample.rx / 1e6 * 10) / 10 : null,
				tx: sample ? Math.round(sample.tx / 1e6 * 10) / 10 : null,
				latency: sample?.latency ?? null
			};
		});
	}, [device, history]);
	if (!device) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex h-full flex-col gap-3 border-line bg-surface p-5 xl:border-l",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-semibold",
			children: "No machine selected"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Choose one from the board or the map."
		})]
	});
	const latency = bestLatency(device);
	const uptime = watchUptime(history, device.id);
	const canAct = mode === "lab" || allowActions;
	const routes = [.../* @__PURE__ */ new Set([
		...device.advertisedRoutes,
		...device.enabledRoutes,
		...draft
	])];
	const dirty = draft.slice().sort().join("|") !== device.enabledRoutes.slice().sort().join("|");
	async function run(action, success) {
		setBusy(true);
		try {
			const where = await action();
			toast.success(where === "lab" ? `${success} in the lab only` : success);
		} catch (error) {
			toast.error(errMessage(error));
		} finally {
			setBusy(false);
			setPending(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex h-full min-h-0 flex-col bg-surface xl:border-l xl:border-line",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3 border-b border-line p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OsIcon, { os: device.os }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "truncate text-lg font-semibold",
							children: device.hostname
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-mono text-xs text-muted",
							children: device.name
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						tone: "quiet",
						onClick: onClose,
						"aria-label": "Close machine details",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								tone: device.connectedToControl ? "good" : "neutral",
								children: device.connectedToControl ? "On control" : "Off control"
							}),
							exitEnabled(device) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								tone: "warn",
								children: "Exit"
							}) : null,
							subnetEnabled(device) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { children: "Subnet" }) : null,
							!device.authorized ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								tone: "bad",
								children: "Unauthorized"
							}) : null,
							device.updateAvailable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								tone: "warn",
								children: "Update"
							}) : null,
							device.keyExpiryDisabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { children: "Expiry off" }) : null,
							device.isEphemeral ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { children: "Ephemeral" }) : null
						]
					}),
					findings.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "flex flex-col gap-2",
						children: findings.map((finding) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-lg border border-line px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: finding.severity === "critical" ? "text-danger" : finding.severity === "watch" ? "text-accent" : "text-muted",
								children: finding.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted",
								children: finding.detail
							})]
						}, finding.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "No open findings on this machine."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-medium",
							children: "Addresses"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "flex flex-col gap-1",
							children: [device.addresses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-sm text-muted",
								children: "None reported"
							}) : null, device.addresses.map((address) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate font-mono text-sm",
									children: address
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									tone: "quiet",
									"aria-label": `Copy ${address}`,
									onClick: () => void copyText(address),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
								})]
							}, address))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid grid-cols-2 gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
								label: "Owner",
								value: device.user
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
								label: "OS",
								value: device.os
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
								label: "Client",
								value: device.clientVersion || "unknown"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
								label: "Relay",
								value: device.derp ? device.derp.toUpperCase() : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
								label: "Nearest relay",
								value: latency != null ? `${latency} ms` : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
								label: "Last seen",
								value: formatAgo(device.lastSeen, clock)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
								label: "Created",
								value: formatAbsolute(device.created)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
								label: "Key expires",
								value: device.keyExpiryDisabled ? "Disabled" : device.expires ? formatAgo(device.expires, clock) : "—"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-medium",
							children: "This watch"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								"Up in ",
								uptime.up,
								" of ",
								uptime.seen,
								" samples since this tab opened.",
								device.telemetry ? ` Simulated host uptime ${formatDuration(device.telemetry.uptimeSec)}.` : " Host uptime is not in the Tailscale API."
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-medium",
								children: "Control path"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "DERP relay delay reported by the client. Not a ping between machines."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "flex flex-col gap-2",
								children: [device.latency.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "text-sm text-muted",
									children: "No latency map."
								}) : null, device.latency.map((point) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "grid grid-cols-[3rem_1fr_3rem] items-center gap-2 font-mono text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: point.region.toUpperCase() }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "h-1.5 overflow-hidden rounded-full bg-surface-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block h-full bg-primary",
												style: { width: `${Math.max(6, Math.min(100, 100 - point.ms / 4))}%` }
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-right tabular-nums text-muted",
											children: point.ms
										})
									]
								}, point.region))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									"UDP ",
									device.supportsKnown ? device.supports.udp ? "yes" : "no" : "unknown",
									" · IPv6",
									" ",
									device.supportsKnown ? device.supports.ipv6 ? "yes" : "no" : "unknown",
									" · endpoints",
									" ",
									device.endpoints.length ? device.endpoints.join(", ") : "none",
									device.blocksIncomingConnections ? " · incoming blocked by client" : ""
								]
							})
						]
					}),
					device.tags.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "flex flex-wrap gap-2",
						children: device.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { children: tagLabel(tag) }, tag))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-medium",
									children: mode === "lab" ? "Host counters" : "Control latency"
								}), mode === "lab" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									tone: "warn",
									children: "Simulated"
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-pretty text-muted",
								children: mode === "lab" ? "CPU and bandwidth move so you can see the board. A live tailnet will not invent these." : "Round trip to the nearest DERP, sampled on each sync while this tab stays open."
							}),
							device.telemetry ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "grid grid-cols-2 gap-2 font-mono text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
										k: "CPU",
										v: `${device.telemetry.cpu}%`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
										k: "Memory",
										v: `${device.telemetry.mem}%`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
										k: "Disk",
										v: `${device.telemetry.disk}%`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
										k: "In",
										v: formatRate(device.telemetry.rxBps)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
										k: "Out",
										v: formatRate(device.telemetry.txBps)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
										k: "Uptime",
										v: formatDuration(device.telemetry.uptimeSec)
									})
								]
							}) : mode === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "No host counters. Tailscale’s device API does not include them."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "No host counters while this machine is off the control plane."
							}),
							Chart ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chart, {
								rows,
								kind: mode === "lab" && device.telemetry ? "host" : "latency"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Drawing the series…"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-medium",
								children: "Routes"
							}),
							routes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "No subnet or exit routes."
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "flex flex-col gap-2",
								children: routes.map((route) => {
									const on = draft.includes(route);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex min-h-11 items-center gap-3 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											className: "size-4 accent-primary",
											checked: on,
											onChange: () => setDraft((current) => current.includes(route) ? current.filter((item) => item !== route) : [...current, route])
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono",
											children: route
										})]
									}) }, route);
								})
							}),
							routes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: !dirty || busy || !canAct,
								onClick: () => void run(() => setRoutes(device.id, draft), "Routes updated"),
								children: mode === "lab" ? "Apply in the lab" : "Push route approval"
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "flex flex-col gap-2 border-t border-line pt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-medium",
								children: "Control"
							}),
							mode === "lab" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-pretty text-muted",
								children: "Lab rehearsal. These buttons change the sample board only. They do not call Tailscale."
							}) : !allowActions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-pretty text-muted",
								children: "Control actions are disarmed. Arm them on the Link tab. The switch is a misclick lock, not a second factor — anyone with the credential can call Tailscale without this page."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-pretty text-muted",
								children: "Each action still asks you to confirm, then calls Tailscale."
							}),
							!canAct ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => setView("link"),
								children: "Open Link"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										disabled: busy,
										onClick: () => setPending(device.authorized ? "revoke" : "authorize"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }), device.authorized ? "Revoke authorization" : "Authorize"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										disabled: busy,
										onClick: () => setPending("expire"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "size-4" }), "Expire node key"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										tone: "danger",
										disabled: busy,
										onClick: () => setPending("delete"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Delete device"]
									})
								]
							})
						]
					})
				]
			}),
			pending === "authorize" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				title: `Authorize ${device.hostname}?`,
				body: mode === "lab" ? "Marks the lab machine authorized. No Tailscale call." : "Tailscale will mark this device authorized.",
				confirmLabel: "Authorize",
				onClose: () => setPending(null),
				onConfirm: () => void run(() => authorize(device.id, true), "Authorized")
			}) : null,
			pending === "revoke" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				title: `Revoke ${device.hostname}?`,
				body: mode === "lab" ? "Drops authorization on the lab machine only." : "The device stays enrolled but loses authorization.",
				confirmLabel: "Revoke",
				danger: true,
				onClose: () => setPending(null),
				onConfirm: () => void run(() => authorize(device.id, false), "Authorization revoked")
			}) : null,
			pending === "expire" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				title: `Expire the key for ${device.hostname}?`,
				body: mode === "lab" ? "The lab machine drops off the control plane until you reset the lab." : "The node key expires now. The machine must sign in again before it can rejoin.",
				confirmLabel: "Expire key",
				danger: true,
				onClose: () => setPending(null),
				onConfirm: () => void run(() => expire(device.id), "Key expired")
			}) : null,
			pending === "delete" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				title: `Delete ${device.hostname}?`,
				body: mode === "lab" ? "Removes it from the rehearsal board. Reset the lab to bring the original set back." : "Removes the device from the tailnet. It will need a fresh auth key or login to return.",
				confirmLabel: "Delete",
				danger: true,
				challenge: device.hostname,
				onClose: () => setPending(null),
				onConfirm: () => void run(() => remove(device.id), "Device deleted")
			}) : null
		]
	});
}
function Fact({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "truncate text-sm",
			children: value
		})]
	});
}
function Metric({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-bg px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "tabular-nums",
			children: v
		})]
	});
}
function PolicyView() {
	const devices = useMesh((state) => state.devices);
	const extras = useMesh((state) => state.extras);
	const mode = useMesh((state) => state.mode);
	const findings = useMesh((state) => state.findings);
	const [showAcl, setShowAcl] = (0, import_react.useState)(false);
	const owners = new Set(devices.map((device) => device.user));
	const tagged = devices.filter((device) => device.tags.length > 0).length;
	const expiryOffPersonal = devices.filter((device) => device.keyExpiryDisabled && device.tags.length === 0 && !device.isEphemeral).length;
	const unauthorized = devices.filter((device) => !device.authorized).length;
	const lockErrors = devices.filter((device) => device.tailnetLockError).length;
	const acl = summarizeAcl(extras.acl);
	const aclBody = extras.acl ? JSON.stringify(extras.acl, null, 2) : extras.aclText;
	const checks = [
		{
			ok: unauthorized === 0,
			label: "Every device is authorized",
			detail: unauthorized ? `${unauthorized} waiting` : "None pending"
		},
		{
			ok: expiryOffPersonal === 0,
			label: "Personal machines rotate node keys",
			detail: expiryOffPersonal ? `${expiryOffPersonal} with expiry disabled` : "Expiry still on"
		},
		{
			ok: lockErrors === 0,
			label: "No tailnet-lock errors",
			detail: lockErrors ? `${lockErrors} reporting an error` : "Clean"
		},
		{
			ok: mode === "lab" ? true : extras.magicDNS !== false,
			label: "MagicDNS",
			detail: extras.magicDNS == null ? mode === "lab" ? "Not queried in the lab" : "Not visible with this credential" : extras.magicDNS ? "On" : "Off"
		},
		{
			ok: findings.every((finding) => finding.severity !== "critical"),
			label: "No critical watchdog findings",
			detail: findings.some((finding) => finding.severity === "critical") ? "See the watchdog" : "Clear"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-semibold text-balance",
				children: "Policy"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-2xl text-sm text-pretty text-muted",
				children: "A posture reading of the machines already on the board, plus DNS and the policy file when the credential is allowed to see them. This is not an ACL editor."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Machines",
						value: `${devices.length}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Owners",
						value: `${owners.size}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Tagged",
						value: `${tagged}`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-2",
				children: checks.map((check) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: check.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: check.detail
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: check.ok ? "font-mono text-xs text-primary" : "font-mono text-xs text-accent",
						children: check.ok ? "OK" : "Check"
					})]
				}, check.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-2 rounded-xl border border-line bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-medium",
						children: "DNS"
					}),
					mode === "lab" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "The lab does not invent MagicDNS or resolvers. Link a live credential with dns:read."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm",
							children: ["MagicDNS: ", extras.magicDNS == null ? "unknown" : extras.magicDNS ? "on" : "off"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-sm text-muted",
							children: extras.nameservers.length ? extras.nameservers.join(" · ") : "No resolvers returned"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-sm text-muted",
							children: extras.searchPaths.length ? `Search ${extras.searchPaths.join(", ")}` : "No search paths returned"
						})
					] }),
					extras.notes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "flex flex-col gap-1 text-sm text-muted",
						children: extras.notes.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: note }, note))
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-3 rounded-xl border border-line bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-medium",
						children: "Policy file"
					}),
					mode === "lab" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "No fictional ACL is shown. A live read needs a credential that can read the policy file."
					}) : acl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "grid grid-cols-2 gap-2 text-sm sm:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Grants",
								value: acl.grants == null ? "—" : String(acl.grants)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "ACLs",
								value: acl.acls == null ? "—" : String(acl.acls)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Tag owners",
								value: acl.tagOwners == null ? "—" : String(acl.tagOwners)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "SSH rules",
								value: acl.ssh == null ? "—" : String(acl.ssh)
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "No parsed policy yet."
					}),
					aclBody ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 self-start rounded-lg px-3 text-sm text-primary",
						onClick: () => setShowAcl((open) => !open),
						"aria-expanded": showAcl,
						children: showAcl ? "Hide policy file" : "Show policy file"
					}), showAcl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "max-h-96 overflow-auto rounded-lg bg-bg p-3 font-mono text-xs text-muted",
						children: aclBody
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Hidden until you open it, so it is not sitting in view over a shoulder."
					})] }) : null
				]
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-mono text-xs text-muted",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-mono text-lg tabular-nums",
		children: value
	})] });
}
function summarizeAcl(acl) {
	const record = asRecord(acl);
	if (!record) return null;
	const tagOwners = asRecord(record.tagOwners);
	const sshRecord = asRecord(record.ssh);
	return {
		grants: Array.isArray(record.grants) ? record.grants.length : null,
		acls: Array.isArray(record.acls) ? record.acls.length : null,
		tagOwners: tagOwners ? Object.keys(tagOwners).length : null,
		ssh: Array.isArray(record.ssh) ? record.ssh.length : sshRecord ? Object.keys(sshRecord).length : null
	};
}
function layout(devices) {
	const groups = /* @__PURE__ */ new Map();
	for (const device of devices) {
		const key = device.tags[0] ?? device.user;
		const list = groups.get(key) ?? [];
		list.push(device);
		groups.set(key, list);
	}
	const keys = [...groups.keys()];
	const cx = 500;
	const cy = 360;
	const radius = 250;
	const nodes = [];
	keys.forEach((key, index) => {
		const angle = index / Math.max(keys.length, 1) * Math.PI * 2 - Math.PI / 2;
		const gx = cx + Math.cos(angle) * radius;
		const gy = cy + Math.sin(angle) * radius;
		const members = groups.get(key) ?? [];
		members.forEach((device, member) => {
			const spread = (member - (members.length - 1) / 2) * 36;
			const tx = Math.cos(angle + Math.PI / 2);
			const ty = Math.sin(angle + Math.PI / 2);
			nodes.push({
				device,
				x: Math.max(70, Math.min(930, gx + tx * spread)),
				y: Math.max(48, Math.min(660, gy + ty * spread))
			});
		});
	});
	return nodes;
}
function Topology() {
	const devices = useMesh((state) => state.devices);
	const findings = useMesh((state) => state.findings);
	const selectedId = useMesh((state) => state.selectedId);
	const select = useMesh((state) => state.select);
	const nodes = layout(devices);
	if (!devices.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Nothing to map until a tailnet is loaded."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-semibold text-balance",
				children: "Map"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-2xl text-sm text-pretty text-muted",
				children: "Grouped by tag, or by owner when a machine is untagged. The hub is coordination, not a picture of traffic. Lines do not mean those machines can reach each other — the policy file decides that."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl border border-line bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 1000 720",
					className: "h-auto w-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "500",
							cy: "360",
							r: "28",
							fill: "var(--color-surface-2)",
							stroke: "var(--color-line)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: "500",
							y: "364",
							textAnchor: "middle",
							fill: "var(--color-muted)",
							fontSize: "11",
							fontFamily: "IBM Plex Mono, monospace",
							children: "control"
						}),
						nodes.map((node) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "500",
							y1: "360",
							x2: node.x,
							y2: node.y,
							stroke: "var(--color-line)",
							strokeWidth: node.device.connectedToControl ? 1.4 : 1,
							strokeDasharray: node.device.connectedToControl ? void 0 : "4 4"
						}, `line-${node.device.id}`)),
						nodes.map((node) => {
							const critical = findings.some((finding) => finding.deviceId === node.device.id && finding.severity === "critical");
							const watch = findings.some((finding) => finding.deviceId === node.device.id && finding.severity === "watch");
							const fill = !node.device.connectedToControl ? "var(--color-muted)" : critical ? "var(--color-danger)" : watch ? "var(--color-accent)" : "var(--color-primary)";
							const latency = bestLatency(node.device);
							const selected = selectedId === node.device.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								role: "button",
								tabIndex: 0,
								"aria-label": `${node.device.hostname}, ${node.device.connectedToControl ? "up" : "down"}`,
								onClick: () => select(node.device.id),
								onKeyDown: (event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										select(node.device.id);
									}
								},
								className: "cursor-pointer",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: node.x,
										cy: node.y,
										r: "22",
										fill: "transparent"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: node.x,
										cy: node.y,
										r: "14",
										fill,
										stroke: selected ? "var(--color-fg)" : "transparent",
										strokeWidth: "2"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
										x: node.x,
										y: node.y + 32,
										textAnchor: "middle",
										fill: "var(--color-fg)",
										fontSize: "12",
										fontFamily: "IBM Plex Sans, sans-serif",
										children: node.device.hostname
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
										x: node.x,
										y: node.y + 46,
										textAnchor: "middle",
										fill: "var(--color-muted)",
										fontSize: "11",
										fontFamily: "IBM Plex Mono, monospace",
										children: node.device.connectedToControl && latency != null ? `${latency} ms` : node.device.connectedToControl ? "up" : "down"
									})
								]
							}, node.device.id);
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "Green is quiet and up. Amber is a watch. Red is critical or the accent only when a finding says so. Muted is off the control plane."
			})
		]
	});
}
function WatchView() {
	const rules = useMesh((state) => state.rules);
	const updateRules = useMesh((state) => state.updateRules);
	const findings = useMesh((state) => state.findings);
	const incidents = useMesh((state) => state.incidents);
	const select = useMesh((state) => state.select);
	const setView = useMesh((state) => state.setView);
	const devices = useMesh((state) => state.devices);
	const now = useMesh((state) => state.uiNow ?? state.clock);
	const aligned = useMesh((state) => state.clockAligned);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-semibold text-balance",
				children: "Watchdog"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-2xl text-sm text-pretty text-muted",
				children: "Rules run on every sample. They look at control connection, key lifetime, client version, relay delay, and route advertisements. They cannot see a crashed process or a full disk unless you are in the lab, where those counters are simulated."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 rounded-xl border border-line bg-surface p-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Offline after (minutes)",
						value: rules.offlineMinutes,
						min: 1,
						max: 1440,
						onChange: (offlineMinutes) => updateRules({ offlineMinutes })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Key warning (days)",
						value: rules.keyExpiryDays,
						min: 1,
						max: 365,
						onChange: (keyExpiryDays) => updateRules({ keyExpiryDays })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Relay latency ceiling (ms)",
						value: rules.maxDerpMs,
						min: 20,
						max: 2e3,
						onChange: (maxDerpMs) => updateRules({ maxDerpMs })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1.5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Minimum client"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: rules.minClientVersion,
								onChange: (event) => updateRules({ minClientVersion: event.target.value }),
								spellCheck: false,
								placeholder: "1.74.0"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "Empty disables the version check."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
						label: "Unauthorized devices",
						checked: rules.flagUnauthorized,
						onChange: (flagUnauthorized) => updateRules({ flagUnauthorized })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
						label: "Exit node down",
						checked: rules.flagExitNodeDown,
						onChange: (flagExitNodeDown) => updateRules({ flagExitNodeDown })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
						label: "Subnet router down",
						checked: rules.flagSubnetDown,
						onChange: (flagSubnetDown) => updateRules({ flagSubnetDown })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
						label: "Relay-only clients",
						checked: rules.flagRelayOnly,
						onChange: (flagRelayOnly) => updateRules({ flagRelayOnly })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
						label: "Key expiry disabled on personal or IoT",
						checked: rules.flagKeyExpiryDisabled,
						onChange: (flagKeyExpiryDisabled) => updateRules({ flagKeyExpiryDisabled })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
						label: "Update available",
						checked: rules.flagUpdateAvailable,
						onChange: (flagUpdateAvailable) => updateRules({ flagUpdateAvailable })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
						label: "External devices",
						checked: rules.flagExternal,
						onChange: (flagExternal) => updateRules({ flagExternal })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-sm font-medium",
						children: ["Open now · ", findings.length]
					}),
					findings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Nothing open at these thresholds."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "flex flex-col gap-2",
						children: findings.map((finding) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex w-full flex-col gap-1 rounded-xl border border-line bg-surface px-4 py-3 text-left hover:bg-surface-2",
							onClick: () => {
								if (finding.deviceId && devices.some((device) => device.id === finding.deviceId)) {
									select(finding.deviceId);
									setView("board");
								}
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: finding.severity === "critical" ? "text-danger" : finding.severity === "watch" ? "text-accent" : "text-muted",
								children: [
									finding.severity,
									" · ",
									finding.title
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted",
								children: finding.detail
							})]
						}) }, finding.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-medium",
					children: "Log"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-2",
					children: incidents.map((incident) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg border border-line px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-muted",
								children: aligned ? formatAgoMs(incident.at, now) : "This session"
							}),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: incident.kind
							}),
							" · ",
							incident.title
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: incident.detail
						})]
					}, incident.incidentId))
				})]
			})
		]
	});
}
function Num({ label, value, min, max, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1.5 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: inputClass,
			type: "number",
			min,
			max,
			value,
			onChange: (event) => onChange(Number(event.target.value))
		})]
	});
}
function Flag({ label, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex min-h-11 items-center gap-3 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "checkbox",
			className: "size-4 accent-primary",
			checked,
			onChange: (event) => onChange(event.target.checked)
		}), label]
	});
}
var NAV = [
	{
		id: "board",
		label: "Board",
		icon: Activity
	},
	{
		id: "map",
		label: "Map",
		icon: Network
	},
	{
		id: "watch",
		label: "Watchdog",
		icon: Shield
	},
	{
		id: "policy",
		label: "Policy",
		icon: ScrollText
	},
	{
		id: "link",
		label: "Link",
		icon: KeyRound
	}
];
function MeshApp() {
	const view = useMesh((state) => state.view);
	const mode = useMesh((state) => state.mode);
	const setView = useMesh((state) => state.setView);
	const select = useMesh((state) => state.select);
	const selectedId = useMesh((state) => state.selectedId);
	const syncing = useMesh((state) => state.syncing);
	const allowActions = useMesh((state) => state.allowActions);
	const tailnet = useMesh((state) => state.tailnet);
	const linkGeneration = useMesh((state) => state.linkGeneration);
	const pollSec = useMesh((state) => state.pollSec);
	const findings = useMesh((state) => state.findings);
	(0, import_react.useEffect)(() => {
		const mesh = useMesh.getState();
		mesh.alignClock();
		mesh.loadPrefs();
		const clock = window.setInterval(() => useMesh.getState().touchClock(), 5e3);
		return () => window.clearInterval(clock);
	}, []);
	(0, import_react.useEffect)(() => {
		if (mode !== "lab") return;
		const id = window.setInterval(() => useMesh.getState().tickLab(), 2e3);
		return () => window.clearInterval(id);
	}, [mode]);
	(0, import_react.useEffect)(() => {
		if (mode !== "live" || linkGeneration === 0) return;
		let stop = false;
		const beat = () => {
			if (!stop) useMesh.getState().sync();
		};
		beat();
		const id = window.setInterval(beat, pollSec * 1e3);
		return () => {
			stop = true;
			window.clearInterval(id);
		};
	}, [
		mode,
		linkGeneration,
		pollSec
	]);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			const tag = event.target?.tagName;
			if (event.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
				event.preventDefault();
				setView("board");
				document.getElementById("fleet-search")?.focus();
			}
			if (event.key === "Escape") {
				if (document.querySelector("dialog[open]")) return;
				select(null);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [select, setView]);
	const tailnetLabel = mode === "lab" ? LAB_TAILNET : tailnet === "-" ? "credential tailnet" : tailnet;
	const critical = findings.filter((finding) => finding.severity === "critical").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "top-center",
				toastOptions: { style: {
					background: "var(--color-surface)",
					color: "var(--color-fg)",
					border: "1px solid var(--color-line)"
				} }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-bg/90 px-3 py-2 backdrop-blur sm:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-bg",
						"aria-hidden": true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-semibold tracking-tight",
							children: "Meshwarden"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-mono text-xs text-muted",
							children: tailnetLabel
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-2",
					children: [
						critical > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden font-mono text-xs text-danger sm:inline",
							children: [critical, " critical"]
						}) : null,
						mode === "live" && allowActions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md bg-accent/15 px-2 py-1 font-mono text-xs text-accent",
							children: "Armed"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md bg-surface px-2 py-1 font-mono text-xs text-muted",
							children: mode === "lab" ? "Lab" : "Live"
						}),
						mode === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-11 place-items-center rounded-lg text-muted hover:bg-surface hover:text-fg",
							"aria-label": "Sync now",
							onClick: () => void useMesh.getState().sync(),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: syncing ? "size-4 motion-safe:animate-spin" : "size-4" })
						}) : null
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						"aria-label": "Sections",
						className: "sticky top-16 hidden max-h-dvh w-56 shrink-0 flex-col gap-1 self-start overflow-y-auto border-r border-line p-3 lg:flex",
						children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavButton, {
							item,
							current: view === item.id,
							onClick: () => setView(item.id)
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
						id: "content",
						className: "min-w-0 flex-1 px-3 py-4 pb-24 sm:px-5 lg:pb-6",
						children: [
							view === "board" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Board, {}) : null,
							view === "map" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Topology, {}) : null,
							view === "watch" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WatchView, {}) : null,
							view === "policy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolicyView, {}) : null,
							view === "link" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConnectView, {}) : null
						]
					}),
					selectedId && view !== "link" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sticky top-16 hidden max-h-dvh w-96 shrink-0 self-start overflow-y-auto xl:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inspector, { onClose: () => select(null) })
					}) : null
				]
			}),
			selectedId && view !== "link" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-30 overflow-y-auto bg-bg xl:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inspector, { onClose: () => select(null) })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "Sections",
				className: "fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-line bg-bg/95 backdrop-blur lg:hidden",
				children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"aria-current": view === item.id ? "page" : void 0,
					className: `flex min-h-14 flex-col items-center justify-center gap-1 text-xs ${view === item.id ? "text-primary" : "text-muted"}`,
					onClick: () => setView(item.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
						className: "size-4",
						"aria-hidden": true
					}), item.label]
				}, item.id))
			})
		]
	});
}
function NavButton({ item, current, onClick }) {
	const Icon = item.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-current": current ? "page" : void 0,
		onClick,
		className: `flex min-h-11 items-center gap-3 rounded-lg px-3 text-left text-sm ${current ? "bg-surface text-fg" : "text-muted hover:bg-surface hover:text-fg"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "size-4",
			"aria-hidden": true
		}), item.label]
	});
}
function Mark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: "size-5",
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 16 L8 9 M16 16 L24 10 M16 16 L23 23",
				stroke: "currentColor",
				strokeWidth: "1.6",
				fill: "none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "2.4",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "8",
				cy: "9",
				r: "1.7",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "24",
				cy: "10",
				r: "1.7",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "23",
				cy: "23",
				r: "1.7",
				fill: "currentColor"
			})
		]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => SplitComponent });
var SplitComponent = MeshApp;
//#endregion
export { formatClock as n, routes_exports as t };
