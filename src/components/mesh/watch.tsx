import { inputClass } from "./ui";
import { formatAgoMs } from "@/lib/mesh/format";
import { useMesh } from "@/lib/mesh/store";

export function WatchView() {
  const rules = useMesh((state) => state.rules);
  const updateRules = useMesh((state) => state.updateRules);
  const findings = useMesh((state) => state.findings);
  const incidents = useMesh((state) => state.incidents);
  const select = useMesh((state) => state.select);
  const setView = useMesh((state) => state.setView);
  const devices = useMesh((state) => state.devices);
  const now = useMesh((state) => state.uiNow ?? state.clock);
  const aligned = useMesh((state) => state.clockAligned);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-semibold text-balance">Watchdog</h2>
        <p className="max-w-2xl text-sm text-pretty text-muted">
          Rules run on every sample. They look at control connection, key lifetime, client version, relay delay, and
          route advertisements. They cannot see a crashed process or a full disk unless you are in the lab, where those
          counters are simulated.
        </p>
      </div>

      <section className="grid gap-4 rounded-xl border border-line bg-surface p-4 md:grid-cols-2">
        <Num
          label="Offline after (minutes)"
          value={rules.offlineMinutes}
          min={1}
          max={1440}
          onChange={(offlineMinutes) => updateRules({ offlineMinutes })}
        />
        <Num
          label="Key warning (days)"
          value={rules.keyExpiryDays}
          min={1}
          max={365}
          onChange={(keyExpiryDays) => updateRules({ keyExpiryDays })}
        />
        <Num
          label="Relay latency ceiling (ms)"
          value={rules.maxDerpMs}
          min={20}
          max={2000}
          onChange={(maxDerpMs) => updateRules({ maxDerpMs })}
        />
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Minimum client</span>
          <input
            className={inputClass}
            value={rules.minClientVersion}
            onChange={(event) => updateRules({ minClientVersion: event.target.value })}
            spellCheck={false}
            placeholder="1.74.0"
          />
          <span className="text-xs text-muted">Empty disables the version check.</span>
        </label>
        <Flag label="Unauthorized devices" checked={rules.flagUnauthorized} onChange={(flagUnauthorized) => updateRules({ flagUnauthorized })} />
        <Flag label="Exit node down" checked={rules.flagExitNodeDown} onChange={(flagExitNodeDown) => updateRules({ flagExitNodeDown })} />
        <Flag label="Subnet router down" checked={rules.flagSubnetDown} onChange={(flagSubnetDown) => updateRules({ flagSubnetDown })} />
        <Flag label="Relay-only clients" checked={rules.flagRelayOnly} onChange={(flagRelayOnly) => updateRules({ flagRelayOnly })} />
        <Flag label="Key expiry disabled on personal or IoT" checked={rules.flagKeyExpiryDisabled} onChange={(flagKeyExpiryDisabled) => updateRules({ flagKeyExpiryDisabled })} />
        <Flag label="Update available" checked={rules.flagUpdateAvailable} onChange={(flagUpdateAvailable) => updateRules({ flagUpdateAvailable })} />
        <Flag label="External devices" checked={rules.flagExternal} onChange={(flagExternal) => updateRules({ flagExternal })} />
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Open now · {findings.length}</h3>
        {findings.length === 0 ? <p className="text-sm text-muted">Nothing open at these thresholds.</p> : null}
        <ul className="flex flex-col gap-2">
          {findings.map((finding) => (
            <li key={finding.id}>
              <button
                type="button"
                className="flex w-full flex-col gap-1 rounded-xl border border-line bg-surface px-4 py-3 text-left hover:bg-surface-2"
                onClick={() => {
                  if (finding.deviceId && devices.some((device) => device.id === finding.deviceId)) {
                    select(finding.deviceId);
                    setView("board");
                  }
                }}
              >
                <span className={finding.severity === "critical" ? "text-danger" : finding.severity === "watch" ? "text-accent" : "text-muted"}>
                  {finding.severity} · {finding.title}
                </span>
                <span className="text-sm text-muted">{finding.detail}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Log</h3>
        <ul className="flex flex-col gap-2">
          {incidents.map((incident) => (
            <li key={incident.incidentId} className="rounded-lg border border-line px-3 py-2 text-sm">
              <p>
                <span className="font-mono text-xs text-muted">
                  {aligned ? formatAgoMs(incident.at, now) : "This session"}
                </span>{" "}
                <span className="text-muted">{incident.kind}</span> · {incident.title}
              </p>
              <p className="text-muted">{incident.detail}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Num({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <input
        className={inputClass}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function Flag({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex min-h-11 items-center gap-3 text-sm">
      <input type="checkbox" className="size-4 accent-primary" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

