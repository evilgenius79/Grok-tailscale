import { advertisesExit, advertisesSubnet, bestLatency } from "./device";
import { cmpVersion } from "./format";
import type { Finding, Incident, MeshDevice, Severity, WatchRules } from "./types";

const WEIGHT: Record<Severity, number> = { critical: 9, watch: 3, info: 1 };

function push(
  findings: Finding[],
  device: MeshDevice | null,
  severity: Severity,
  code: string,
  title: string,
  detail: string,
) {
  const deviceId = device?.id ?? null;
  findings.push({
    id: `${deviceId ?? "fleet"}:${code}`,
    deviceId,
    severity,
    code,
    title,
    detail,
  });
}

export function evaluate(devices: MeshDevice[], rules: WatchRules, now: number): Finding[] {
  const findings: Finding[] = [];
  for (const device of devices) {
    const name = device.hostname || device.name;
    if (rules.flagUnauthorized && !device.authorized) {
      push(
        findings,
        device,
        "critical",
        "unauthorized",
        `${name} is not authorized`,
        "Device authorization is on, and this machine has not been approved.",
      );
    }
    if (device.tailnetLockError) {
      push(
        findings,
        device,
        "critical",
        "lock-error",
        `${name} failed tailnet lock`,
        device.tailnetLockError,
      );
    }
    if (!device.connectedToControl && !device.isEphemeral) {
      const downSec = Math.max(0, (now - Date.parse(device.lastSeen)) / 1000);
      if (downSec >= rules.offlineMinutes * 60) {
        if (rules.flagExitNodeDown && advertisesExit(device)) {
          push(
            findings,
            device,
            "critical",
            "exit-down",
            `Exit node ${name} is down`,
            `No control connection for ${Math.round(downSec / 60)} minutes. Traffic sent at its exit route has nowhere to go.`,
          );
        } else if (rules.flagSubnetDown && advertisesSubnet(device)) {
          push(
            findings,
            device,
            "critical",
            "subnet-down",
            `Subnet router ${name} is down`,
            `Approved routes ${device.enabledRoutes.join(", ") || device.advertisedRoutes.join(", ")} have no live machine behind them.`,
          );
        } else {
          push(
            findings,
            device,
            "watch",
            "offline",
            `${name} left the control plane`,
            `Last seen ${Math.round(downSec / 60)} minutes ago. Ephemeral nodes are ignored.`,
          );
        }
      }
    }
    if (!device.keyExpiryDisabled && device.expires) {
      const leftMs = Date.parse(device.expires) - now;
      const days = rules.keyExpiryDays * 86400000;
      if (Number.isFinite(leftMs) && leftMs < days) {
        const critical = leftMs < 3 * 86400000;
        push(
          findings,
          device,
          critical ? "critical" : "watch",
          "key-expiry",
          critical ? `${name} key expires within 3 days` : `${name} key expires soon`,
          "Node keys that expire will drop the machine until someone signs it in again.",
        );
      }
    }
    if (
      rules.flagKeyExpiryDisabled &&
      device.keyExpiryDisabled &&
      !device.isEphemeral &&
      (device.tags.length === 0 || device.tags.some((tag) => tag === "tag:camera" || tag === "tag:iot"))
    ) {
      push(
        findings,
        device,
        "watch",
        "expiry-disabled",
        `${name} will not rotate its node key`,
        device.tags.length
          ? "Tagged IoT with expiry disabled stays trusted until someone removes it."
          : "Personal machines usually keep key expiry on.",
      );
    }
    if (
      rules.minClientVersion.trim() &&
      device.clientVersion &&
      cmpVersion(device.clientVersion, rules.minClientVersion.trim()) < 0
    ) {
      push(
        findings,
        device,
        "watch",
        "stale-client",
        `${name} is below ${rules.minClientVersion}`,
        `Running ${device.clientVersion}. Old clients miss security fixes and newer NAT behavior.`,
      );
    }
    if (rules.flagRelayOnly && device.connectedToControl && device.supportsKnown && !device.supports.udp) {
      push(
        findings,
        device,
        "watch",
        "relay-only",
        `${name} cannot use direct UDP`,
        "Paths will hairpin through DERP relays. Fine for a camera, poor for anything latency-sensitive.",
      );
    }
    const latency = bestLatency(device);
    if (device.connectedToControl && latency != null && latency > rules.maxDerpMs) {
      push(
        findings,
        device,
        "watch",
        "high-latency",
        `${name} is ${latency} ms from its nearest relay`,
        `Threshold is ${rules.maxDerpMs} ms. This is control-plane delay, not a ping between your machines.`,
      );
    }
    if (rules.flagUpdateAvailable && device.updateAvailable) {
      push(
        findings,
        device,
        "info",
        "update",
        `${name} has a client update`,
        `Installed ${device.clientVersion || "unknown"}.`,
      );
    }
    if (rules.flagExternal && device.isExternal) {
      push(
        findings,
        device,
        "info",
        "external",
        `${name} is shared in from another tailnet`,
        "External nodes follow the other tailnet's key and posture rules.",
      );
    }
  }
  const rank: Record<Severity, number> = { critical: 0, watch: 1, info: 2 };
  return findings.sort((a, b) => rank[a.severity] - rank[b.severity] || a.title.localeCompare(b.title));
}

export function scoreFindings(findings: Finding[]): number {
  const penalty = findings.reduce((sum, finding) => sum + WEIGHT[finding.severity], 0);
  return Math.max(0, Math.min(100, 100 - penalty));
}

export function diffIncidents(
  previous: Finding[],
  next: Finding[],
  known: string[],
  now: number,
): { incidents: Incident[]; known: string[] } {
  const knownSet = new Set(known);
  const nextIds = new Set(next.map((finding) => finding.id));
  const incidents: Incident[] = [];
  for (const finding of next) {
    if (knownSet.has(finding.id)) continue;
    incidents.push({
      incidentId: `${finding.id}:open:${now}`,
      kind: "opened",
      at: now,
      severity: finding.severity,
      title: finding.title,
      detail: finding.detail,
      deviceId: finding.deviceId,
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
      deviceId: finding.deviceId,
    });
  }
  return { incidents, known: [...nextIds] };
}
