import type { HistoryPoint, LabEdit, MeshDevice } from "./types";

const EXIT = new Set(["0.0.0.0/0", "::/0"]);

export function isExitRoute(route: string): boolean {
  return EXIT.has(route);
}

export function advertisesExit(device: MeshDevice): boolean {
  return [...device.advertisedRoutes, ...device.enabledRoutes].some(isExitRoute);
}

export function exitEnabled(device: MeshDevice): boolean {
  return device.enabledRoutes.some(isExitRoute);
}

export function advertisesSubnet(device: MeshDevice): boolean {
  return [...device.advertisedRoutes, ...device.enabledRoutes].some((route) => !isExitRoute(route));
}

export function subnetEnabled(device: MeshDevice): boolean {
  return device.enabledRoutes.some((route) => !isExitRoute(route));
}

export function bestLatency(device: MeshDevice): number | null {
  if (!device.latency.length) return null;
  return Math.min(...device.latency.map((point) => point.ms));
}

function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2) return sorted[mid] ?? null;
  const left = sorted[mid - 1];
  const right = sorted[mid];
  if (left == null || right == null) return null;
  return (left + right) / 2;
}

export function summarize(devices: MeshDevice[], t: number): HistoryPoint {
  const online = devices.filter((device) => device.connectedToControl);
  const latencies = online
    .map(bestLatency)
    .filter((value): value is number => value != null);
  const byId: HistoryPoint["byId"] = {};
  let rxBps = 0;
  let txBps = 0;
  for (const device of devices) {
    const latency = bestLatency(device);
    const cpu = device.telemetry?.cpu ?? 0;
    const rx = device.telemetry?.rxBps ?? 0;
    const tx = device.telemetry?.txBps ?? 0;
    rxBps += rx;
    txBps += tx;
    byId[device.id] = { cpu, rx, tx, latency };
  }
  return {
    t,
    onlineCount: online.length,
    medianLatency: median(latencies),
    rxBps,
    txBps,
    present: devices.map((device) => device.id),
    online: online.map((device) => device.id),
    byId,
  };
}

export function applyLabEdits(
  devices: MeshDevice[],
  edits: Record<string, LabEdit>,
  now: number,
): MeshDevice[] {
  const next: MeshDevice[] = [];
  for (const device of devices) {
    const edit = edits[device.id];
    if (edit?.deleted) continue;
    if (!edit) {
      next.push(device);
      continue;
    }
    let patched = device;
    if (edit.authorized != null) patched = { ...patched, authorized: edit.authorized };
    if (edit.enabledRoutes) patched = { ...patched, enabledRoutes: edit.enabledRoutes };
    if (edit.expired) {
      patched = {
        ...patched,
        expires: new Date(now).toISOString(),
        keyExpiryDisabled: false,
        connectedToControl: false,
        lastSeen: new Date(now - 90_000).toISOString(),
        telemetry: null,
      };
    }
    next.push(patched);
  }
  return next;
}

export function watchUptime(history: HistoryPoint[], id: string): { seen: number; up: number } {
  let seen = 0;
  let up = 0;
  for (const point of history) {
    if (!point.present.includes(id)) continue;
    seen += 1;
    if (point.online.includes(id)) up += 1;
  }
  return { seen, up };
}
