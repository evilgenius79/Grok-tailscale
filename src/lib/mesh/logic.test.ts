import assert from "node:assert/strict";
import test from "node:test";
import { buildLab } from "./demo.ts";
import { LAB_ORIGIN, DEFAULT_RULES } from "./types.ts";
import { evaluate, scoreFindings } from "./watchdog.ts";

test("lab board carries the rehearsed findings", () => {
  const devices = buildLab(1, LAB_ORIGIN);
  assert.equal(devices.length, 15);
  const findings = evaluate(devices, DEFAULT_RULES, LAB_ORIGIN);
  const codes = new Set(findings.map((finding) => finding.code));
  assert.ok(codes.has("unauthorized"));
  assert.ok(codes.has("subnet-down"));
  assert.ok(codes.has("stale-client"));
  assert.ok(codes.has("relay-only"));
  assert.ok(codes.has("key-expiry"));
  assert.ok(codes.has("high-latency"));
  assert.equal(
    findings.some((finding) => finding.deviceId === "exit-ewr" && finding.code === "expiry-disabled"),
    false,
  );
  const score = scoreFindings(findings);
  assert.ok(score > 40 && score < 90, `score ${score}`);
});
