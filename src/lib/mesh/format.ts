export function formatDuration(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
}

export function formatAgo(iso: string, now: number): string {
  const delta = now - Date.parse(iso);
  if (!Number.isFinite(delta)) return "unknown";
  const sec = Math.round(delta / 1000);
  if (Math.abs(sec) < 15) return sec >= 0 ? "just now" : "soon";
  if (sec < 0) return `in ${formatDuration(-sec)}`;
  return `${formatDuration(sec)} ago`;
}

export function formatAgoMs(at: number, now: number): string {
  return formatAgo(new Date(at).toISOString(), now);
}

export function formatAbsolute(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mi = String(d.getUTCMinutes()).padStart(2, "0");
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${hh}:${mi} UTC`;
}

export function formatRate(bps: number): string {
  const n = Math.max(0, bps);
  if (n < 1000) return `${Math.round(n)} b/s`;
  if (n < 1_000_000) return `${(n / 1000).toFixed(1)} kb/s`;
  if (n < 1_000_000_000) return `${(n / 1_000_000).toFixed(1)} Mb/s`;
  return `${(n / 1_000_000_000).toFixed(2)} Gb/s`;
}

export function formatClock(ms: number): string {
  const d = new Date(ms);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mi = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${hh}:${mi}:${ss}`;
}

export function cmpVersion(a: string, b: string): number {
  const pa = a.split(".").map((part) => parseInt(part, 10) || 0);
  const pb = b.split(".").map((part) => parseInt(part, 10) || 0);
  const n = Math.max(pa.length, pb.length);
  for (let i = 0; i < n; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff) return diff;
  }
  return 0;
}

export function shortUser(user: string): string {
  const name = user.split("@")[0];
  return name || user || "unknown";
}

export function tagLabel(tag: string): string {
  return tag.startsWith("tag:") ? tag.slice(4) : tag;
}

export function ipv4(addresses: string[]): string {
  return addresses.find((addr) => addr.includes(".")) ?? addresses[0] ?? "—";
}
