import { bestLatency } from "@/lib/mesh/device";
import type { MeshDevice } from "@/lib/mesh/types";
import { useMesh } from "@/lib/mesh/store";

type Node = { device: MeshDevice; x: number; y: number };

function layout(devices: MeshDevice[]): Node[] {
  const groups = new Map<string, MeshDevice[]>();
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
  const nodes: Node[] = [];
  keys.forEach((key, index) => {
    const angle = (index / Math.max(keys.length, 1)) * Math.PI * 2 - Math.PI / 2;
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
        y: Math.max(48, Math.min(660, gy + ty * spread)),
      });
    });
  });
  return nodes;
}

export function Topology() {
  const devices = useMesh((state) => state.devices);
  const findings = useMesh((state) => state.findings);
  const selectedId = useMesh((state) => state.selectedId);
  const select = useMesh((state) => state.select);
  const nodes = layout(devices);

  if (!devices.length) {
    return <p className="text-sm text-muted">Nothing to map until a tailnet is loaded.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-xl font-semibold text-balance">Map</h2>
        <p className="max-w-2xl text-sm text-pretty text-muted">
          Grouped by tag, or by owner when a machine is untagged. The hub is coordination, not a picture of traffic.
          Lines do not mean those machines can reach each other — the policy file decides that.
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <svg viewBox="0 0 1000 720" className="h-auto w-full">
          <circle cx="500" cy="360" r="28" fill="var(--color-surface-2)" stroke="var(--color-line)" />
          <text x="500" y="364" textAnchor="middle" fill="var(--color-muted)" fontSize="11" fontFamily="IBM Plex Mono, monospace">
            control
          </text>
          {nodes.map((node) => (
            <line
              key={`line-${node.device.id}`}
              x1="500"
              y1="360"
              x2={node.x}
              y2={node.y}
              stroke="var(--color-line)"
              strokeWidth={node.device.connectedToControl ? 1.4 : 1}
              strokeDasharray={node.device.connectedToControl ? undefined : "4 4"}
            />
          ))}
          {nodes.map((node) => {
            const critical = findings.some((finding) => finding.deviceId === node.device.id && finding.severity === "critical");
            const watch = findings.some((finding) => finding.deviceId === node.device.id && finding.severity === "watch");
            const fill = !node.device.connectedToControl
              ? "var(--color-muted)"
              : critical
                ? "var(--color-danger)"
                : watch
                  ? "var(--color-accent)"
                  : "var(--color-primary)";
            const latency = bestLatency(node.device);
            const selected = selectedId === node.device.id;
            return (
              <g
                key={node.device.id}
                role="button"
                tabIndex={0}
                aria-label={`${node.device.hostname}, ${node.device.connectedToControl ? "up" : "down"}`}
                onClick={() => select(node.device.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    select(node.device.id);
                  }
                }}
                className="cursor-pointer"
              >
                <circle cx={node.x} cy={node.y} r="22" fill="transparent" />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="14"
                  fill={fill}
                  stroke={selected ? "var(--color-fg)" : "transparent"}
                  strokeWidth="2"
                />
                <text
                  x={node.x}
                  y={node.y + 32}
                  textAnchor="middle"
                  fill="var(--color-fg)"
                  fontSize="12"
                  fontFamily="IBM Plex Sans, sans-serif"
                >
                  {node.device.hostname}
                </text>
                <text
                  x={node.x}
                  y={node.y + 46}
                  textAnchor="middle"
                  fill="var(--color-muted)"
                  fontSize="11"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {node.device.connectedToControl && latency != null ? `${latency} ms` : node.device.connectedToControl ? "up" : "down"}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="text-xs text-muted">Green is quiet and up. Amber is a watch. Red is critical or the accent only when a finding says so. Muted is off the control plane.</p>
    </div>
  );
}
