import { bestLatency } from "@/lib/mesh/device";
import type { MeshDevice } from "@/lib/mesh/types";
import { useMesh } from "@/lib/mesh/store";

function groupKey(device: MeshDevice): string {
  return device.tags[0] || device.user || "untagged";
}

function groupsOf(devices: MeshDevice[]): [string, MeshDevice[]][] {
  const groups = new Map<string, MeshDevice[]>();
  for (const device of devices) {
    const key = groupKey(device);
    const list = groups.get(key) ?? [];
    list.push(device);
    groups.set(key, list);
  }
  for (const list of groups.values()) {
    list.sort((a, b) => (a.hostname || a.name).localeCompare(b.hostname || b.name));
  }
  return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

function toneFor(device: MeshDevice, critical: boolean, watch: boolean): string {
  if (!device.connectedToControl) return "var(--color-muted)";
  if (critical) return "var(--color-danger)";
  if (watch) return "var(--color-accent)";
  return "var(--color-primary)";
}

export function Topology() {
  const devices = useMesh((state) => state.devices);
  const findings = useMesh((state) => state.findings);
  const selectedId = useMesh((state) => state.selectedId);
  const select = useMesh((state) => state.select);
  const groups = groupsOf(devices);

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
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface-2 font-mono text-xs text-muted">
            hub
          </span>
          <div className="min-w-0">
            <p className="font-medium">control</p>
            <p className="font-mono text-xs text-muted">
              {devices.length} {devices.length === 1 ? "machine" : "machines"}
            </p>
          </div>
        </div>
        {groups.map(([name, members]) => (
          <section key={name} className="border-b border-line last:border-b-0">
            {groups.length > 1 ? (
              <h3 className="px-4 pt-3 font-mono text-xs text-muted">
                {name} · {members.length}
              </h3>
            ) : null}
            <ul>
              {members.map((device) => {
                const critical = findings.some(
                  (finding) => finding.deviceId === device.id && finding.severity === "critical",
                );
                const watch = findings.some(
                  (finding) => finding.deviceId === device.id && finding.severity === "watch",
                );
                const latency = bestLatency(device);
                const status = !device.connectedToControl
                  ? "down"
                  : latency != null
                    ? `${latency} ms`
                    : "up";
                const label = device.hostname || device.name;
                const selected = selectedId === device.id;
                return (
                  <li key={device.id} className="border-t border-line first:border-t-0">
                    <button
                      type="button"
                      aria-pressed={selected}
                      aria-label={`${label}, ${device.connectedToControl ? "up" : "down"}`}
                      onClick={() => select(device.id)}
                      className={`flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left ${selected ? "bg-surface-2" : ""}`}
                    >
                      <span className="flex w-8 shrink-0 justify-center" aria-hidden>
                        <span
                          className="size-3.5 rounded-full"
                          style={{ background: toneFor(device, critical, watch) }}
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{label}</span>
                        <span className="font-mono text-xs text-muted">{status}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      <p className="text-xs text-muted">
        The filled mark is up. Amber is a watch. Red is critical. Gray is off the control plane. Tap a machine to open it.
      </p>
    </div>
  );
}
