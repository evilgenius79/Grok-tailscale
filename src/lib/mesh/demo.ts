import { applyLabEdits, summarize } from "./device";
import type { HistoryPoint, LabEdit, MeshDevice, Supports, Telemetry } from "./types";
import { LAB_ORIGIN } from "./types";

export { LAB_ORIGIN };

type Spec = {
  id: string;
  host: string;
  user: string;
  os: string;
  ver: string;
  update?: boolean;
  tags: string[];
  v4: string;
  v6: string;
  advertised: string[];
  enabled: string[];
  authorized?: boolean;
  ephemeral?: boolean;
  expiryDisabled?: boolean;
  expiresInSec: number;
  offlineForSec?: number;
  blip?: boolean;
  derp: string;
  latency: [string, number][];
  udp?: boolean;
  endpoint: string | null;
  createdAgoSec: number;
  cpu: number;
  mem: number;
  disk: number;
  rx: number;
  tx: number;
  uptimeSec: number;
  blocks?: boolean;
  external?: boolean;
};

const FULL: Supports = {
  udp: true,
  ipv6: true,
  hairPinning: true,
  pcp: false,
  pmp: true,
  upnp: false,
};

const SPECS: Spec[] = [
  {
    id: "exit-ewr",
    host: "exit-ewr",
    user: "ada@hearthline.dev",
    os: "linux",
    ver: "1.84.2",
    tags: ["tag:exit"],
    v4: "100.99.12.1",
    v6: "fd7a:115c:a1e0::1",
    advertised: ["0.0.0.0/0", "::/0"],
    enabled: ["0.0.0.0/0", "::/0"],
    expiryDisabled: true,
    expiresInSec: 0,
    derp: "ewr",
    latency: [
      ["ewr", 11],
      ["ord", 28],
      ["lhr", 72],
      ["syd", 210],
    ],
    endpoint: "203.0.113.10:41641",
    createdAgoSec: 400 * 86400,
    cpu: 9,
    mem: 31,
    disk: 22,
    rx: 42_000_000,
    tx: 39_000_000,
    uptimeSec: 40 * 86400,
  },
  {
    id: "edge-hq",
    host: "edge-hq",
    user: "ada@hearthline.dev",
    os: "linux",
    ver: "1.84.2",
    tags: ["tag:edge"],
    v4: "100.99.12.2",
    v6: "fd7a:115c:a1e0::2",
    advertised: ["10.40.0.0/16", "192.168.10.0/24"],
    enabled: ["10.40.0.0/16", "192.168.10.0/24"],
    expiryDisabled: true,
    expiresInSec: 0,
    derp: "ord",
    latency: [
      ["ord", 16],
      ["ewr", 24],
      ["dfw", 38],
      ["sea", 61],
    ],
    endpoint: "203.0.113.11:41641",
    createdAgoSec: 380 * 86400,
    cpu: 14,
    mem: 38,
    disk: 27,
    rx: 18_000_000,
    tx: 16_500_000,
    uptimeSec: 18 * 86400,
  },
  {
    id: "nas-01",
    host: "nas-01",
    user: "ada@hearthline.dev",
    os: "linux",
    ver: "1.82.0",
    tags: ["tag:storage"],
    v4: "100.99.12.3",
    v6: "fd7a:115c:a1e0::3",
    advertised: [],
    enabled: [],
    expiryDisabled: true,
    expiresInSec: 0,
    derp: "ord",
    latency: [
      ["ord", 14],
      ["ewr", 27],
      ["dfw", 41],
    ],
    endpoint: "203.0.113.12:41641",
    createdAgoSec: 500 * 86400,
    cpu: 22,
    mem: 71,
    disk: 64,
    rx: 8_200_000,
    tx: 2_400_000,
    uptimeSec: 62 * 86400,
  },
  {
    id: "build-03",
    host: "build-03",
    user: "nico@hearthline.dev",
    os: "linux",
    ver: "1.84.0",
    tags: ["tag:ci"],
    v4: "100.99.12.4",
    v6: "fd7a:115c:a1e0::4",
    advertised: [],
    enabled: [],
    expiryDisabled: true,
    expiresInSec: 0,
    derp: "ewr",
    latency: [
      ["ewr", 19],
      ["ord", 33],
      ["lhr", 80],
    ],
    endpoint: "203.0.113.20:41641",
    createdAgoSec: 120 * 86400,
    cpu: 61,
    mem: 74,
    disk: 48,
    rx: 6_500_000,
    tx: 9_100_000,
    uptimeSec: 9 * 86400,
  },
  {
    id: "runner-19",
    host: "runner-19",
    user: "nico@hearthline.dev",
    os: "linux",
    ver: "1.84.2",
    tags: ["tag:ci"],
    v4: "100.99.12.14",
    v6: "fd7a:115c:a1e0::14",
    advertised: [],
    enabled: [],
    ephemeral: true,
    expiryDisabled: true,
    expiresInSec: 0,
    blip: true,
    derp: "ewr",
    latency: [
      ["ewr", 22],
      ["ord", 36],
    ],
    endpoint: "203.0.113.21:41641",
    createdAgoSec: 2 * 3600,
    cpu: 44,
    mem: 52,
    disk: 18,
    rx: 3_200_000,
    tx: 4_800_000,
    uptimeSec: 2 * 3600,
  },
  {
    id: "k3s-a",
    host: "k3s-a",
    user: "nico@hearthline.dev",
    os: "linux",
    ver: "1.84.1",
    tags: ["tag:k8s"],
    v4: "100.99.12.5",
    v6: "fd7a:115c:a1e0::5",
    advertised: [],
    enabled: [],
    expiryDisabled: true,
    expiresInSec: 0,
    derp: "ewr",
    latency: [
      ["ewr", 13],
      ["ord", 29],
      ["dfw", 44],
    ],
    endpoint: "203.0.113.30:41641",
    createdAgoSec: 90 * 86400,
    cpu: 48,
    mem: 66,
    disk: 41,
    rx: 11_000_000,
    tx: 12_400_000,
    uptimeSec: 21 * 86400,
  },
  {
    id: "k3s-b",
    host: "k3s-b",
    user: "nico@hearthline.dev",
    os: "linux",
    ver: "1.84.1",
    tags: ["tag:k8s"],
    v4: "100.99.12.6",
    v6: "fd7a:115c:a1e0::6",
    advertised: [],
    enabled: [],
    expiryDisabled: true,
    expiresInSec: 0,
    derp: "ewr",
    latency: [
      ["ewr", 15],
      ["ord", 31],
      ["dfw", 46],
    ],
    endpoint: "203.0.113.31:41641",
    createdAgoSec: 90 * 86400,
    cpu: 51,
    mem: 69,
    disk: 44,
    rx: 10_200_000,
    tx: 11_800_000,
    uptimeSec: 21 * 86400,
  },
  {
    id: "studio-mac",
    host: "studio-mac",
    user: "jo@hearthline.dev",
    os: "macOS",
    ver: "1.80.3",
    update: true,
    tags: [],
    v4: "100.99.12.7",
    v6: "fd7a:115c:a1e0::7",
    advertised: [],
    enabled: [],
    expiresInSec: 80 * 86400,
    derp: "ord",
    latency: [
      ["ord", 18],
      ["ewr", 32],
      ["sea", 58],
    ],
    endpoint: "198.51.100.40:41641",
    createdAgoSec: 240 * 86400,
    cpu: 19,
    mem: 58,
    disk: 71,
    rx: 1_400_000,
    tx: 620_000,
    uptimeSec: 6 * 86400,
  },
  {
    id: "desk-win",
    host: "desk-win",
    user: "jo@hearthline.dev",
    os: "windows",
    ver: "1.84.0",
    tags: [],
    v4: "100.99.12.8",
    v6: "fd7a:115c:a1e0::8",
    advertised: [],
    enabled: [],
    expiresInSec: 70 * 86400,
    derp: "ord",
    latency: [
      ["ord", 21],
      ["ewr", 34],
      ["dfw", 40],
    ],
    endpoint: "198.51.100.41:41641",
    createdAgoSec: 200 * 86400,
    cpu: 27,
    mem: 63,
    disk: 55,
    rx: 2_100_000,
    tx: 880_000,
    uptimeSec: 3 * 86400,
  },
  {
    id: "field-iphone",
    host: "field-iphone",
    user: "jo@hearthline.dev",
    os: "iOS",
    ver: "1.84.0",
    tags: [],
    v4: "100.99.12.9",
    v6: "fd7a:115c:a1e0::9",
    advertised: [],
    enabled: [],
    expiresInSec: 4 * 86400,
    derp: "ewr",
    latency: [
      ["ewr", 34],
      ["ord", 48],
      ["lhr", 90],
    ],
    endpoint: "198.51.100.50:41641",
    createdAgoSec: 30 * 86400,
    cpu: 6,
    mem: 41,
    disk: 62,
    rx: 420_000,
    tx: 180_000,
    uptimeSec: 18 * 3600,
    blocks: true,
  },
  {
    id: "field-pixel",
    host: "field-pixel",
    user: "jo@hearthline.dev",
    os: "android",
    ver: "1.84.0",
    tags: [],
    v4: "100.99.12.10",
    v6: "fd7a:115c:a1e0::a",
    advertised: [],
    enabled: [],
    expiresInSec: 60 * 86400,
    derp: "syd",
    latency: [
      ["syd", 210],
      ["sea", 240],
      ["ewr", 280],
    ],
    endpoint: "198.51.100.51:41641",
    createdAgoSec: 40 * 86400,
    cpu: 8,
    mem: 47,
    disk: 58,
    rx: 510_000,
    tx: 240_000,
    uptimeSec: 9 * 3600,
    blocks: true,
  },
  {
    id: "travel-ipad",
    host: "travel-ipad",
    user: "jo@hearthline.dev",
    os: "iOS",
    ver: "1.82.5",
    tags: [],
    v4: "100.99.12.11",
    v6: "fd7a:115c:a1e0::b",
    advertised: [],
    enabled: [],
    expiresInSec: 50 * 86400,
    offlineForSec: 22 * 60,
    derp: "lhr",
    latency: [
      ["lhr", 42],
      ["ewr", 78],
    ],
    endpoint: "198.51.100.52:41641",
    createdAgoSec: 100 * 86400,
    cpu: 4,
    mem: 36,
    disk: 49,
    rx: 0,
    tx: 0,
    uptimeSec: 2 * 86400,
    blocks: true,
  },
  {
    id: "porch-cam",
    host: "porch-cam",
    user: "ada@hearthline.dev",
    os: "linux",
    ver: "1.66.4",
    tags: ["tag:camera"],
    v4: "100.99.12.12",
    v6: "fd7a:115c:a1e0::c",
    advertised: [],
    enabled: [],
    expiryDisabled: true,
    expiresInSec: 0,
    derp: "dfw",
    latency: [
      ["dfw", 70],
      ["ord", 88],
      ["ewr", 102],
    ],
    udp: false,
    endpoint: null,
    createdAgoSec: 700 * 86400,
    cpu: 4,
    mem: 22,
    disk: 15,
    rx: 1_800_000,
    tx: 220_000,
    uptimeSec: 110 * 86400,
  },
  {
    id: "cabin-backup",
    host: "cabin-backup",
    user: "ada@hearthline.dev",
    os: "linux",
    ver: "1.78.1",
    tags: ["tag:backup"],
    v4: "100.99.12.13",
    v6: "fd7a:115c:a1e0::d",
    advertised: ["10.8.0.0/24"],
    enabled: ["10.8.0.0/24"],
    expiryDisabled: true,
    expiresInSec: 0,
    offlineForSec: 36 * 3600,
    derp: "sea",
    latency: [
      ["sea", 40],
      ["ord", 68],
    ],
    endpoint: "203.0.113.80:41641",
    createdAgoSec: 420 * 86400,
    cpu: 7,
    mem: 29,
    disk: 81,
    rx: 0,
    tx: 0,
    uptimeSec: 15 * 86400,
  },
  {
    id: "guest-mbp",
    host: "guest-mbp",
    user: "guest@hearthline.dev",
    os: "macOS",
    ver: "1.84.2",
    tags: [],
    v4: "100.99.12.15",
    v6: "fd7a:115c:a1e0::f",
    advertised: [],
    enabled: [],
    authorized: false,
    expiresInSec: 80 * 86400,
    derp: "ewr",
    latency: [
      ["ewr", 26],
      ["ord", 41],
    ],
    endpoint: "198.51.100.90:41641",
    createdAgoSec: 20 * 60,
    cpu: 11,
    mem: 44,
    disk: 33,
    rx: 240_000,
    tx: 90_000,
    uptimeSec: 3 * 3600,
  },
];

function salt(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i) * (i + 1)) % 1000;
  return hash / 80;
}

function wave(tick: number, id: string): number {
  return Math.sin(tick / 2.2 + salt(id));
}

function jitterMs(base: number, tick: number, id: string, region: string): number {
  const factor = 1 + 0.07 * Math.sin(tick / 2 + salt(id + region));
  return Math.max(1, Math.round(base * factor));
}

export function buildLab(tick: number, now: number): MeshDevice[] {
  return SPECS.map((spec) => {
    let connected = spec.offlineForSec == null;
    let lastSeenAgo = spec.offlineForSec ?? 6;
    if (spec.blip && tick % 11 === 5) {
      connected = false;
      lastSeenAgo = 4;
    }
    const sway = wave(tick, spec.id);
    const telemetry: Telemetry | null = connected
      ? {
          cpu: Math.round(Math.min(97, Math.max(1, spec.cpu * (1 + 0.08 * sway)))),
          mem: Math.round(Math.min(96, Math.max(4, spec.mem + sway * 1.5))),
          disk: spec.disk,
          rxBps: Math.max(0, Math.round(spec.rx * (1 + 0.12 * sway))),
          txBps: Math.max(0, Math.round(spec.tx * (1 + 0.1 * Math.sin(tick / 2.5 + salt(spec.id))))),
          uptimeSec: spec.uptimeSec + Math.max(0, tick) * 2,
        }
      : null;
    const supports: Supports = { ...FULL, udp: spec.udp !== false };
    return {
      id: spec.id,
      nodeId: `n${spec.id}`,
      name: `${spec.host}.hearthline.ts.net`,
      hostname: spec.host,
      user: spec.user,
      os: spec.os,
      clientVersion: spec.ver,
      updateAvailable: spec.update === true,
      created: new Date(now - spec.createdAgoSec * 1000).toISOString(),
      lastSeen: new Date(now - lastSeenAgo * 1000).toISOString(),
      expires: spec.expiryDisabled ? null : new Date(now + spec.expiresInSec * 1000).toISOString(),
      keyExpiryDisabled: spec.expiryDisabled === true,
      authorized: spec.authorized !== false,
      isExternal: spec.external === true,
      isEphemeral: spec.ephemeral === true,
      blocksIncomingConnections: spec.blocks === true,
      addresses: [spec.v4, spec.v6],
      tags: spec.tags,
      enabledRoutes: spec.enabled,
      advertisedRoutes: spec.advertised,
      connectedToControl: connected,
      derp: spec.derp,
      latency: spec.latency.map(([region, ms]) => ({
        region,
        ms: jitterMs(ms, tick, spec.id, region),
      })),
      endpoints: spec.endpoint ? [spec.endpoint] : [],
      supports,
      supportsKnown: true,
      tailnetLockError: "",
      telemetry,
    };
  });
}

export function seedHistory(
  now: number,
  endTick: number,
  edits: Record<string, LabEdit>,
): HistoryPoint[] {
  const points: HistoryPoint[] = [];
  const span = 36;
  for (let i = span; i >= 0; i--) {
    const tick = endTick - i;
    const t = now - i * 2000;
    points.push(summarize(applyLabEdits(buildLab(tick, t), edits, t), t));
  }
  return points;
}
