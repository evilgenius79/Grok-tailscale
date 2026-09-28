import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as formatClock } from "./routes-COsFvfAT.mjs";
import { a as ResponsiveContainer, i as Area, n as YAxis, o as Tooltip, r as XAxis, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/telemetry-chart-D9AKZ3ih.js
var import_jsx_runtime = require_jsx_runtime();
var tooltipStyle = {
	background: "var(--color-surface)",
	border: "1px solid var(--color-line)",
	borderRadius: 8,
	color: "var(--color-fg)",
	fontSize: 12
};
function TelemetryChart({ rows, kind }) {
	if (rows.length < 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Not enough samples yet. Leave this tab open."
	});
	if (kind === "latency") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-40 w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data: rows,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "t",
						hide: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						hide: true,
						domain: ["auto", "auto"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						contentStyle: tooltipStyle,
						labelFormatter: (value) => formatClock(Number(value)),
						formatter: (value) => [`${value} ms`, "Nearest relay"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "latency",
						stroke: "var(--color-primary)",
						fill: "var(--color-primary)",
						fillOpacity: .16,
						strokeWidth: 2,
						connectNulls: true
					})
				]
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-36 w-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
					data: rows,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "t",
							hide: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							hide: true,
							domain: [0, 100]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							contentStyle: tooltipStyle,
							labelFormatter: (value) => formatClock(Number(value)),
							formatter: (value) => [`${value}%`, "CPU"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
							type: "monotone",
							dataKey: "cpu",
							stroke: "var(--color-primary)",
							fill: "var(--color-primary)",
							fillOpacity: .16,
							strokeWidth: 2,
							connectNulls: true
						})
					]
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-36 w-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
					data: rows,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "t",
							hide: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { hide: true }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							contentStyle: tooltipStyle,
							labelFormatter: (value) => formatClock(Number(value)),
							formatter: (value, name) => [`${value} Mb/s`, name === "rx" ? "Receive" : "Transmit"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
							type: "monotone",
							dataKey: "rx",
							stroke: "var(--color-primary)",
							fill: "var(--color-primary)",
							fillOpacity: .12,
							strokeWidth: 2
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
							type: "monotone",
							dataKey: "tx",
							stroke: "var(--color-accent)",
							fill: "var(--color-accent)",
							fillOpacity: .12,
							strokeWidth: 2
						})
					]
				})
			})
		})]
	});
}
//#endregion
export { TelemetryChart };
