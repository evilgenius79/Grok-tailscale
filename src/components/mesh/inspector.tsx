import { useEffect, useMemo, useState } from "react";
import { Ban, Copy, ShieldCheck, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import type { ChartRow } from "./telemetry-chart";
import { Button, Chip, ConfirmDialog, copyText, OsIcon } from "./ui";
import { bestLatency, exitEnabled, subnetEnabled, watchUptime } from "@/lib/mesh/device";
import { errMessage } from "@/lib/mesh/guard";
import { formatAbsolute, formatAgo, formatDuration, formatRate, tagLabel } from "@/lib/mesh/format";
import { useMesh } from "@/lib/mesh/store";

export function Inspector({ onClose }: { onClose: () => void }) {
  const devices = useMesh((state) => state.devices);
  const selectedId = useMesh((state) => state.selectedId);
  const allFindings = useMesh((state) => state.findings);
  const device = useMemo(
    () => devices.find((item) => item.id === selectedId) ?? null,
    [devices, selectedId],
  );
  const findings = useMemo(
    () => allFindings.filter((finding) => finding.deviceId === selectedId),
    [allFindings, selectedId],
  );
  const mode = useMesh((state) => state.mode);
  const allowActions = useMesh((state) => state.allowActions);
  const history = useMesh((state) => state.history);
  const clock = useMesh((state) => state.uiNow ?? state.clock);
  const authorize = useMesh((state) => state.authorize);
  const expire = useMesh((state) => state.expire);
  const remove = useMesh((state) => state.remove);
  const setRoutes = useMesh((state) => state.setRoutes);
  const setView = useMesh((state) => state.setView);

  const [Chart, setChart] = useState<null | typeof import("./telemetry-chart").TelemetryChart>(null);
  const [pending, setPending] = useState<"authorize" | "revoke" | "expire" | "delete" | null>(null);
  const [busy, setBusy] = useState(false);
  const routeKey = device?.enabledRoutes.join("|") ?? "";
  const [draft, setDraft] = useState<string[]>(device?.enabledRoutes ?? []);

  useEffect(() => {
    let live = true;
    void import("./telemetry-chart").then((mod) => {
      if (live) setChart(() => mod.TelemetryChart);
    });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    setDraft(device?.enabledRoutes ?? []);
  }, [device?.id, routeKey]);

  const rows = useMemo<ChartRow[]>(() => {
    if (!device) return [];
    return history.map((point) => {
      const sample = point.byId[device.id];
      return {
        t: point.t,
        cpu: sample ? sample.cpu : null,
        rx: sample ? Math.round((sample.rx / 1_000_000) * 10) / 10 : null,
        tx: sample ? Math.round((sample.tx / 1_000_000) * 10) / 10 : null,
        latency: sample?.latency ?? null,
      };
    });
  }, [device, history]);

  if (!device) {
    return (
      <aside className="flex h-full flex-col gap-3 border-line bg-surface p-5 xl:border-l">
        <h2 className="text-lg font-semibold">No machine selected</h2>
        <p className="text-sm text-muted">Choose one from the board or the map.</p>
      </aside>
    );
  }

  const latency = bestLatency(device);
  const uptime = watchUptime(history, device.id);
  const canAct = mode === "lab" || allowActions;
  const routes = [...new Set([...device.advertisedRoutes, ...device.enabledRoutes, ...draft])];
  const dirty = draft.slice().sort().join("|") !== device.enabledRoutes.slice().sort().join("|");

  async function run(action: () => Promise<"lab" | "live">, success: string) {
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

  return (
    <aside className="flex h-full min-h-0 flex-col bg-surface xl:border-l xl:border-line">
      <div className="flex items-start gap-3 border-b border-line p-4">
        <OsIcon os={device.os} />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold">{device.hostname}</h2>
          <p className="truncate font-mono text-xs text-muted">{device.name}</p>
        </div>
        <Button tone="quiet" onClick={onClose} aria-label="Close machine details">
          <X className="size-4" />
        </Button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4">
        <div className="flex flex-wrap gap-2">
          <Chip tone={device.connectedToControl ? "good" : "neutral"}>{device.connectedToControl ? "On control" : "Off control"}</Chip>
          {exitEnabled(device) ? <Chip tone="warn">Exit</Chip> : null}
          {subnetEnabled(device) ? <Chip>Subnet</Chip> : null}
          {!device.authorized ? <Chip tone="bad">Unauthorized</Chip> : null}
          {device.updateAvailable ? <Chip tone="warn">Update</Chip> : null}
          {device.keyExpiryDisabled ? <Chip>Expiry off</Chip> : null}
          {device.isEphemeral ? <Chip>Ephemeral</Chip> : null}
        </div>

        {findings.length ? (
          <ul className="flex flex-col gap-2">
            {findings.map((finding) => (
              <li key={finding.id} className="rounded-lg border border-line px-3 py-2 text-sm">
                <p className={finding.severity === "critical" ? "text-danger" : finding.severity === "watch" ? "text-accent" : "text-muted"}>
                  {finding.title}
                </p>
                <p className="text-muted">{finding.detail}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No open findings on this machine.</p>
        )}

        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Addresses</h3>
          <ul className="flex flex-col gap-1">
            {device.addresses.length === 0 ? <li className="text-sm text-muted">None reported</li> : null}
            {device.addresses.map((address) => (
              <li key={address} className="flex items-center justify-between gap-2">
                <span className="truncate font-mono text-sm">{address}</span>
                <Button tone="quiet" aria-label={`Copy ${address}`} onClick={() => void copyText(address)}>
                  <Copy className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid grid-cols-2 gap-3 text-sm">
          <Fact label="Owner" value={device.user} />
          <Fact label="OS" value={device.os} />
          <Fact label="Client" value={device.clientVersion || "unknown"} />
          <Fact label="Relay" value={device.derp ? device.derp.toUpperCase() : "—"} />
          <Fact label="Nearest relay" value={latency != null ? `${latency} ms` : "—"} />
          <Fact label="Last seen" value={formatAgo(device.lastSeen, clock)} />
          <Fact label="Created" value={formatAbsolute(device.created)} />
          <Fact
            label="Key expires"
            value={device.keyExpiryDisabled ? "Disabled" : device.expires ? formatAgo(device.expires, clock) : "—"}
          />
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">This watch</h3>
          <p className="text-sm text-muted">
            Up in {uptime.up} of {uptime.seen} samples since this tab opened.
            {device.telemetry ? ` Simulated host uptime ${formatDuration(device.telemetry.uptimeSec)}.` : " Host uptime is not in the Tailscale API."}
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Control path</h3>
          <p className="text-xs text-muted">DERP relay delay reported by the client. Not a ping between machines.</p>
          <ul className="flex flex-col gap-2">
            {device.latency.length === 0 ? <li className="text-sm text-muted">No latency map.</li> : null}
            {device.latency.map((point) => (
              <li key={point.region} className="grid grid-cols-[3rem_1fr_3rem] items-center gap-2 font-mono text-xs">
                <span>{point.region.toUpperCase()}</span>
                <span className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <span
                    className="block h-full bg-primary"
                    style={{ width: `${Math.max(6, Math.min(100, 100 - point.ms / 4))}%` }}
                  />
                </span>
                <span className="text-right tabular-nums text-muted">{point.ms}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted">
            UDP {device.supportsKnown ? (device.supports.udp ? "yes" : "no") : "unknown"} · IPv6{" "}
            {device.supportsKnown ? (device.supports.ipv6 ? "yes" : "no") : "unknown"} · endpoints{" "}
            {device.endpoints.length ? device.endpoints.join(", ") : "none"}
            {device.blocksIncomingConnections ? " · incoming blocked by client" : ""}
          </p>
        </section>

        {device.tags.length ? (
          <section className="flex flex-wrap gap-2">
            {device.tags.map((tag) => (
              <Chip key={tag}>{tagLabel(tag)}</Chip>
            ))}
          </section>
        ) : null}

        <section className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-sm font-medium">{mode === "lab" ? "Host counters" : "Control latency"}</h3>
            {mode === "lab" ? <Chip tone="warn">Simulated</Chip> : null}
          </div>
          <p className="text-xs text-pretty text-muted">
            {mode === "lab"
              ? "CPU and bandwidth move so you can see the board. A live tailnet will not invent these."
              : "Round trip to the nearest DERP, sampled on each sync while this tab stays open."}
          </p>
          {device.telemetry ? (
            <dl className="grid grid-cols-2 gap-2 font-mono text-sm">
              <Metric k="CPU" v={`${device.telemetry.cpu}%`} />
              <Metric k="Memory" v={`${device.telemetry.mem}%`} />
              <Metric k="Disk" v={`${device.telemetry.disk}%`} />
              <Metric k="In" v={formatRate(device.telemetry.rxBps)} />
              <Metric k="Out" v={formatRate(device.telemetry.txBps)} />
              <Metric k="Uptime" v={formatDuration(device.telemetry.uptimeSec)} />
            </dl>
          ) : mode === "live" ? (
            <p className="text-sm text-muted">No host counters. Tailscale’s device API does not include them.</p>
          ) : (
            <p className="text-sm text-muted">No host counters while this machine is off the control plane.</p>
          )}
          {Chart ? <Chart rows={rows} kind={mode === "lab" && device.telemetry ? "host" : "latency"} /> : (
            <p className="text-sm text-muted">Drawing the series…</p>
          )}
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Routes</h3>
          {routes.length === 0 ? <p className="text-sm text-muted">No subnet or exit routes.</p> : null}
          <ul className="flex flex-col gap-2">
            {routes.map((route) => {
              const on = draft.includes(route);
              return (
                <li key={route}>
                  <label className="flex min-h-11 items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      className="size-4 accent-primary"
                      checked={on}
                      onChange={() =>
                        setDraft((current) => (current.includes(route) ? current.filter((item) => item !== route) : [...current, route]))
                      }
                    />
                    <span className="font-mono">{route}</span>
                  </label>
                </li>
              );
            })}
          </ul>
          {routes.length ? (
            <Button
              disabled={!dirty || busy || !canAct}
              onClick={() => void run(() => setRoutes(device.id, draft), "Routes updated")}
            >
              {mode === "lab" ? "Apply in the lab" : "Push route approval"}
            </Button>
          ) : null}
        </section>

        <section className="flex flex-col gap-2 border-t border-line pt-4">
          <h3 className="text-sm font-medium">Control</h3>
          {mode === "lab" ? (
            <p className="text-xs text-pretty text-muted">
              Lab rehearsal. These buttons change the sample board only. They do not call Tailscale.
            </p>
          ) : !allowActions ? (
            <p className="text-xs text-pretty text-muted">
              Control actions are disarmed. Arm them on the Link tab. The switch is a misclick lock, not a second
              factor — anyone with the credential can call Tailscale without this page.
            </p>
          ) : (
            <p className="text-xs text-pretty text-muted">Each action still asks you to confirm, then calls Tailscale.</p>
          )}
          {!canAct ? (
            <Button onClick={() => setView("link")}>Open Link</Button>
          ) : (
            <div className="flex flex-col gap-2">
              <Button
                disabled={busy}
                onClick={() => setPending(device.authorized ? "revoke" : "authorize")}
              >
                <ShieldCheck className="size-4" />
                {device.authorized ? "Revoke authorization" : "Authorize"}
              </Button>
              <Button disabled={busy} onClick={() => setPending("expire")}>
                <Ban className="size-4" />
                Expire node key
              </Button>
              <Button tone="danger" disabled={busy} onClick={() => setPending("delete")}>
                <Trash2 className="size-4" />
                Delete device
              </Button>
            </div>
          )}
        </section>
      </div>

      {pending === "authorize" ? (
        <ConfirmDialog
          title={`Authorize ${device.hostname}?`}
          body={mode === "lab" ? "Marks the lab machine authorized. No Tailscale call." : "Tailscale will mark this device authorized."}
          confirmLabel="Authorize"
          onClose={() => setPending(null)}
          onConfirm={() => void run(() => authorize(device.id, true), "Authorized")}
        />
      ) : null}
      {pending === "revoke" ? (
        <ConfirmDialog
          title={`Revoke ${device.hostname}?`}
          body={mode === "lab" ? "Drops authorization on the lab machine only." : "The device stays enrolled but loses authorization."}
          confirmLabel="Revoke"
          danger
          onClose={() => setPending(null)}
          onConfirm={() => void run(() => authorize(device.id, false), "Authorization revoked")}
        />
      ) : null}
      {pending === "expire" ? (
        <ConfirmDialog
          title={`Expire the key for ${device.hostname}?`}
          body={
            mode === "lab"
              ? "The lab machine drops off the control plane until you reset the lab."
              : "The node key expires now. The machine must sign in again before it can rejoin."
          }
          confirmLabel="Expire key"
          danger
          onClose={() => setPending(null)}
          onConfirm={() => void run(() => expire(device.id), "Key expired")}
        />
      ) : null}
      {pending === "delete" ? (
        <ConfirmDialog
          title={`Delete ${device.hostname}?`}
          body={
            mode === "lab"
              ? "Removes it from the rehearsal board. Reset the lab to bring the original set back."
              : "Removes the device from the tailnet. It will need a fresh auth key or login to return."
          }
          confirmLabel="Delete"
          danger
          challenge={device.hostname}
          onClose={() => setPending(null)}
          onConfirm={() => void run(() => remove(device.id), "Device deleted")}
        />
      ) : null}
    </aside>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="font-mono text-xs text-muted">{label}</p>
      <p className="truncate text-sm">{value}</p>
    </div>
  );
}

function Metric({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg bg-bg px-3 py-2">
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="tabular-nums">{v}</dd>
    </div>
  );
}
