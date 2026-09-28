import { useState } from "react";
import { asRecord } from "@/lib/mesh/guard";
import { useMesh } from "@/lib/mesh/store";

export function PolicyView() {
  const devices = useMesh((state) => state.devices);
  const extras = useMesh((state) => state.extras);
  const mode = useMesh((state) => state.mode);
  const findings = useMesh((state) => state.findings);
  const [showAcl, setShowAcl] = useState(false);
  const owners = new Set(devices.map((device) => device.user));
  const tagged = devices.filter((device) => device.tags.length > 0).length;
  const expiryOffPersonal = devices.filter(
    (device) => device.keyExpiryDisabled && device.tags.length === 0 && !device.isEphemeral,
  ).length;
  const unauthorized = devices.filter((device) => !device.authorized).length;
  const lockErrors = devices.filter((device) => device.tailnetLockError).length;
  const acl = summarizeAcl(extras.acl);
  const aclBody = extras.acl ? JSON.stringify(extras.acl, null, 2) : extras.aclText;

  const checks = [
    {
      ok: unauthorized === 0,
      label: "Every device is authorized",
      detail: unauthorized ? `${unauthorized} waiting` : "None pending",
    },
    {
      ok: expiryOffPersonal === 0,
      label: "Personal machines rotate node keys",
      detail: expiryOffPersonal ? `${expiryOffPersonal} with expiry disabled` : "Expiry still on",
    },
    {
      ok: lockErrors === 0,
      label: "No tailnet-lock errors",
      detail: lockErrors ? `${lockErrors} reporting an error` : "Clean",
    },
    {
      ok: mode === "lab" ? true : extras.magicDNS !== false,
      label: "MagicDNS",
      detail:
        extras.magicDNS == null
          ? mode === "lab"
            ? "Not queried in the lab"
            : "Not visible with this credential"
          : extras.magicDNS
            ? "On"
            : "Off",
    },
    {
      ok: findings.every((finding) => finding.severity !== "critical"),
      label: "No critical watchdog findings",
      detail: findings.some((finding) => finding.severity === "critical") ? "See the watchdog" : "Clear",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-semibold text-balance">Policy</h2>
        <p className="max-w-2xl text-sm text-pretty text-muted">
          A posture reading of the machines already on the board, plus DNS and the policy file when the credential is
          allowed to see them. This is not an ACL editor.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <Stat label="Machines" value={`${devices.length}`} />
        <Stat label="Owners" value={`${owners.size}`} />
        <Stat label="Tagged" value={`${tagged}`} />
      </section>

      <ul className="flex flex-col gap-2">
        {checks.map((check) => (
          <li key={check.label} className="flex items-start justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3">
            <div>
              <p className="text-sm font-medium">{check.label}</p>
              <p className="text-sm text-muted">{check.detail}</p>
            </div>
            <span className={check.ok ? "font-mono text-xs text-primary" : "font-mono text-xs text-accent"}>
              {check.ok ? "OK" : "Check"}
            </span>
          </li>
        ))}
      </ul>

      <section className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-4">
        <h3 className="text-sm font-medium">DNS</h3>
        {mode === "lab" ? (
          <p className="text-sm text-muted">The lab does not invent MagicDNS or resolvers. Link a live credential with dns:read.</p>
        ) : (
          <>
            <p className="text-sm">
              MagicDNS: {extras.magicDNS == null ? "unknown" : extras.magicDNS ? "on" : "off"}
            </p>
            <p className="font-mono text-sm text-muted">
              {extras.nameservers.length ? extras.nameservers.join(" · ") : "No resolvers returned"}
            </p>
            <p className="font-mono text-sm text-muted">
              {extras.searchPaths.length ? `Search ${extras.searchPaths.join(", ")}` : "No search paths returned"}
            </p>
          </>
        )}
        {extras.notes.length ? (
          <ul className="flex flex-col gap-1 text-sm text-muted">
            {extras.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4">
        <h3 className="text-sm font-medium">Policy file</h3>
        {mode === "lab" ? (
          <p className="text-sm text-muted">No fictional ACL is shown. A live read needs a credential that can read the policy file.</p>
        ) : acl ? (
          <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <Stat label="Grants" value={acl.grants == null ? "—" : String(acl.grants)} />
            <Stat label="ACLs" value={acl.acls == null ? "—" : String(acl.acls)} />
            <Stat label="Tag owners" value={acl.tagOwners == null ? "—" : String(acl.tagOwners)} />
            <Stat label="SSH rules" value={acl.ssh == null ? "—" : String(acl.ssh)} />
          </dl>
        ) : (
          <p className="text-sm text-muted">No parsed policy yet.</p>
        )}
        {aclBody ? (
          <>
            <button
              type="button"
              className="min-h-11 self-start rounded-lg px-3 text-sm text-primary"
              onClick={() => setShowAcl((open) => !open)}
              aria-expanded={showAcl}
            >
              {showAcl ? "Hide policy file" : "Show policy file"}
            </button>
            {showAcl ? (
              <pre className="max-h-96 overflow-auto rounded-lg bg-bg p-3 font-mono text-xs text-muted">{aclBody}</pre>
            ) : (
              <p className="text-xs text-muted">Hidden until you open it, so it is not sitting in view over a shoulder.</p>
            )}
          </>
        ) : null}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-xs text-muted">{label}</p>
      <p className="font-mono text-lg tabular-nums">{value}</p>
    </div>
  );
}

function summarizeAcl(acl: unknown): {
  grants: number | null;
  acls: number | null;
  tagOwners: number | null;
  ssh: number | null;
} | null {
  const record = asRecord(acl);
  if (!record) return null;
  const tagOwners = asRecord(record.tagOwners);
  const sshRecord = asRecord(record.ssh);
  return {
    grants: Array.isArray(record.grants) ? record.grants.length : null,
    acls: Array.isArray(record.acls) ? record.acls.length : null,
    tagOwners: tagOwners ? Object.keys(tagOwners).length : null,
    ssh: Array.isArray(record.ssh) ? record.ssh.length : sshRecord ? Object.keys(sshRecord).length : null,
  };
}
