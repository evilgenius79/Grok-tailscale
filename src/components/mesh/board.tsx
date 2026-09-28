import { useMemo } from "react";
import { Download } from "lucide-react";
import { Sparkline } from "./spark";
import { Button, Chip, OsIcon } from "./ui";
import { advertisesExit, advertisesSubnet, bestLatency, exitEnabled, subnetEnabled } from "@/lib/mesh/device";
import { formatAgo, formatRate, ipv4, shortUser, tagLabel } from "@/lib/mesh/format";
import type { Finding, FleetFilter, FleetSort, MeshDevice } from "@/lib/mesh/types";
import { useMesh } from "@/lib/mesh/store";
import { scoreFindings } from "@/lib/mesh/watchdog";

const FILTERS: { id: FleetFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "up", label: "Up" },
  { id: "down", label: "Down" },
  { id: "routers", label: "Routers" },
  { id: "attention", label: "Attention" },
];

function rankOf(device: MeshDevice, findings: Finding[]): number {
  const mine = findings.filter((finding) => finding.deviceId === device.id);
  if (mine.some((finding) => finding.severity === "critical")) return 3;
  if (mine.some((finding) => finding.severity === "watch")) return 2;
  if (mine.some((finding) => finding.severity === "info")) return 1;
  return 0;
}

function toneFor(score: number): string {
  if (score >= 80) return "text-primary";
  if (score >= 60) return "text-accent";
  return "text-danger";
}

function Ring({ score }: { score: number }) {
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - score / 100);
  return (
    <svg viewBox="0 0 96 96" className={`size-24 ${toneFor(score)}`} aria-hidden>
      <circle cx="48" cy="48" r={radius} fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="6" />
      <circle
        cx="48"
        cy="48"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 48 48)"
      />
    </svg>
  );
}

export function Board() {
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
  const attention = useMemo(() => new Set(findings.map((finding) => finding.deviceId).filter(Boolean)), [findings]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = devices.filter((device) => {
      if (filter === "up" && !device.connectedToControl) return false;
      if (filter === "down" && device.connectedToControl) return false;
      if (filter === "routers" && !advertisesExit(device) && !advertisesSubnet(device)) return false;
      if (filter === "attention" && !attention.has(device.id)) return false;
      if (!q) return true;
      const hay = [device.hostname, device.name, device.user, device.os, device.clientVersion, ...device.addresses, ...device.tags]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
    const latencyOf = (device: MeshDevice) => bestLatency(device) ?? 1e9;
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
  }, [attention, devices, filter, findings, query, sort]);

  if (mode === "live" && linkGeneration === 0 && devices.length === 0) {
    return (
      <section className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6">
        <h2 className="text-xl font-semibold text-balance">No tailnet linked</h2>
        <p className="max-w-xl text-sm text-pretty text-muted">
          Paste a Tailscale credential on the Link tab. Until then this board stays empty on purpose, so a rehearsal
          network is never mistaken for yours.
        </p>
        {lastError ? (
          <p role="alert" className="text-sm text-danger">
            {lastError}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button tone="solid" onClick={() => setView("link")}>
            Link a tailnet
          </Button>
          <Button onClick={enterLab}>Return to the lab</Button>
        </div>
      </section>
    );
  }

  const up = devices.filter((device) => device.connectedToControl).length;
  const exits = devices.filter(advertisesExit);
  const subnets = devices.filter(advertisesSubnet);
  const telem = devices.flatMap((device) => (device.telemetry ? [device.telemetry] : []));
  const avgCpu = telem.length ? Math.round(telem.reduce((sum, item) => sum + item.cpu, 0) / telem.length) : null;
  const rx = telem.reduce((sum, item) => sum + item.rxBps, 0);
  const tx = telem.reduce((sum, item) => sum + item.txBps, 0);
  const latest = history[history.length - 1];

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-xl border border-line border-l-4 border-l-accent bg-surface px-4 py-3 text-sm text-pretty">
        {mode === "lab" ? (
          <>
            <span className="font-medium">Lab rehearsal. </span>
            <span className="text-muted">
              Fictional Hearthline tailnet. Addresses are documentation ranges. CPU, memory, disk, and bandwidth are
              simulated — Tailscale does not publish host counters. Link a credential to watch a real tailnet.
            </span>
          </>
        ) : (
          <>
            <span className="font-medium">Live tailnet. </span>
            <span className="text-muted">
              The credential stays in this tab’s memory. Control actions are {allowActions ? "armed" : "off"}. Host CPU
              and bandwidth stay blank on purpose.
            </span>
          </>
        )}
      </section>

      {lastError ? (
        <p role="alert" className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm">
          {lastError}
        </p>
      ) : null}

      <section className="flex flex-col gap-4 lg:flex-row">
        <div className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4 lg:w-72 lg:shrink-0">
          <div className="relative size-24 shrink-0">
            <Ring score={score} />
            <div className="absolute inset-0 grid place-items-center font-mono text-2xl font-medium tabular-nums">
              <span className="sr-only">Health score </span>
              {score}
            </div>
          </div>
          <div className="min-w-0">
            <p className="font-mono text-xs text-muted">Board score</p>
            <p className="text-sm text-pretty text-muted">
              {findings.filter((finding) => finding.severity === "critical").length} critical,{" "}
              {findings.filter((finding) => finding.severity === "watch").length} watches. Weighted, not a vibe.
            </p>
          </div>
        </div>
        <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-line bg-surface p-4">
            <p className="font-mono text-xs text-muted">Machines on control</p>
            <p className="font-mono text-lg tabular-nums">
              {up}
              <span className="text-muted">/{devices.length}</span>
            </p>
            <Sparkline values={history.map((point) => point.onlineCount)} label="Machines connected to control over this watch" />
          </article>
          <article className="rounded-xl border border-line bg-surface p-4">
            <p className="font-mono text-xs text-muted">{mode === "lab" ? "Lab traffic, simulated" : "Median relay latency"}</p>
            <p className="font-mono text-lg tabular-nums">
              {mode === "lab"
                ? formatRate((latest?.rxBps ?? 0) + (latest?.txBps ?? 0))
                : latest?.medianLatency != null
                  ? `${Math.round(latest.medianLatency)} ms`
                  : "—"}
            </p>
            <Sparkline
              tone={mode === "lab" ? "accent" : "primary"}
              values={history.map((point) => (mode === "lab" ? point.rxBps + point.txBps : (point.medianLatency ?? 0)))}
              label={mode === "lab" ? "Simulated aggregate traffic" : "Median DERP latency"}
            />
          </article>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Stat label="Up" value={`${up}`} detail={`${devices.length - up} down`} />
        <Stat label="Exit nodes" value={`${exits.filter((device) => device.connectedToControl).length}/${exits.length}`} detail="advertising default route" />
        <Stat label="Subnet routers" value={`${subnets.filter((device) => device.connectedToControl).length}/${subnets.length}`} detail="advertising a private CIDR" />
        <Stat label="Findings" value={`${findings.length}`} detail="open on this board" />
        <Stat label="Updates" value={`${devices.filter((device) => device.updateAvailable).length}`} detail="client reported" />
        <Stat
          label={mode === "lab" ? "Avg CPU" : "Samples"}
          value={mode === "lab" && avgCpu != null ? `${avgCpu}%` : `${history.length}`}
          detail={mode === "lab" ? "simulated, online hosts" : "syncs kept this tab"}
        />
      </section>

      {mode === "lab" && avgCpu != null ? (
        <p className="font-mono text-xs text-muted">
          Simulated host load · CPU {avgCpu}% avg · {formatRate(rx)} in · {formatRate(tx)} out
        </p>
      ) : null}

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search devices</span>
            <input
              id="fleet-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Hosts, IPs, tags, owners"
              className="min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-muted">
            <span className="sr-only">Sort</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as FleetSort)}
              className="min-h-11 rounded-lg border border-line bg-surface px-3 text-fg"
            >
              <option value="attention">Sort by attention</option>
              <option value="name">Sort by name</option>
              <option value="latency">Sort by relay latency</option>
              <option value="seen">Sort by last seen</option>
            </select>
          </label>
          <Button
            className="shrink-0"
            onClick={() => {
              const payload = {
                source: mode,
                note:
                  mode === "lab"
                    ? "Simulated Hearthline lab. Not a real tailnet."
                    : "Tailscale fields retained by Meshwarden. Machine keys are not included.",
                exportedAt: new Date().toISOString(),
                devices,
              };
              const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const anchor = document.createElement("a");
              anchor.href = url;
              anchor.download = mode === "lab" ? "meshwarden-lab.json" : "meshwarden-inventory.json";
              anchor.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="size-4" aria-hidden />
            Export
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={`min-h-11 rounded-lg px-3 text-sm ${filter === item.id ? "bg-primary text-bg" : "bg-surface text-muted"}`}
            >
              {item.label}
            </button>
          ))}
          <span className="self-center font-mono text-xs text-muted">
            {visible.length} shown{syncing ? " · syncing" : ""}
          </span>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-xl border border-line bg-surface px-4 py-8 text-sm text-muted">
          Nothing matches. Clear the search or switch the filter.
        </p>
      ) : (
        <ul className="overflow-hidden rounded-xl border border-line bg-surface">
          {visible.map((device) => {
            const latency = bestLatency(device);
            const rank = rankOf(device, findings);
            return (
              <li key={device.id} className="border-b border-line last:border-b-0">
                <button
                  type="button"
                  onClick={() => select(device.id)}
                  aria-current={selectedId === device.id ? "true" : undefined}
                  className={`flex w-full items-start gap-3 px-3 py-3 text-left hover:bg-surface-2 ${selectedId === device.id ? "bg-surface-2" : ""}`}
                >
                  <span
                    className={`mt-1.5 size-2 shrink-0 rounded-full ${device.connectedToControl ? "bg-primary" : "bg-muted"}`}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <OsIcon os={device.os} />
                      <span className="truncate font-medium">{device.hostname}</span>
                      {exitEnabled(device) ? <Chip tone="warn">Exit</Chip> : null}
                      {subnetEnabled(device) ? <Chip>Subnet</Chip> : null}
                      {!device.authorized ? <Chip tone="bad">Unauthorized</Chip> : null}
                      {device.isEphemeral ? <Chip>Ephemeral</Chip> : null}
                      {rank === 3 ? <Chip tone="bad">Critical</Chip> : rank === 2 ? <Chip tone="warn">Watch</Chip> : null}
                    </span>
                    <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted">
                      <span>{ipv4(device.addresses)}</span>
                      <span>{device.os}</span>
                      <span>{device.tags[0] ? tagLabel(device.tags[0]) : shortUser(device.user)}</span>
                      <span>{device.connectedToControl ? device.derp.toUpperCase() || "relay ?" : formatAgo(device.lastSeen, clock)}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-right font-mono text-xs">
                    <span className={device.connectedToControl ? "text-primary" : "text-muted"}>
                      {device.connectedToControl ? "Up" : "Down"}
                    </span>
                    <span className="mt-1 block tabular-nums text-muted">
                      {device.connectedToControl && latency != null ? `${latency} ms` : "—"}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="rounded-xl border border-line bg-surface px-3 py-3">
      <p className="font-mono text-xs text-muted">{label}</p>
      <p className="font-mono text-xl font-medium tabular-nums">{value}</p>
      <p className="text-xs text-muted">{detail}</p>
    </article>
  );
}
