import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  decideInitialMode,
  gradePacing,
  summarizePacing,
  type Capability,
} from "./capability.ts";

const healthy: Capability = {
  webgl2: true,
  software: false,
  renderer: "ANGLE (Intel, Intel(R) UHD Graphics 620, D3D11)",
  cores: 8,
  memoryGb: 8,
  saveData: false,
  reducedMotion: false,
};

const frames = (dt: number, count = 70) => Array.from({ length: count }, () => dt);

describe("decideInitialMode", () => {
  it("sends devices without WebGL2 straight to the map", () => {
    assert.equal(decideInitialMode({ ...healthy, webgl2: false }), "map");
  });

  it("sends software rasterisers to the map even when WebGL2 exists", () => {
    assert.equal(
      decideInitialMode({ ...healthy, software: true, renderer: "SwiftShader" }),
      "map",
    );
  });

  it("respects data saver", () => {
    assert.equal(decideInitialMode({ ...healthy, saveData: true }), "map");
  });

  it("tries the globe on a hardware WebGL2 device", () => {
    assert.equal(decideInitialMode(healthy), "globe");
  });

  it("does not downgrade on reduced motion alone (rotation is disabled instead)", () => {
    assert.equal(decideInitialMode({ ...healthy, reducedMotion: true }), "globe");
  });
});

describe("summarizePacing", () => {
  it("ignores warm-up frames and summarises 60 fps", () => {
    const pacing = summarizePacing([200, 300, 400, ...frames(16.7)]);
    assert.equal(pacing.frames, 70);
    assert.ok(Math.abs(pacing.medianMs - 16.7) < 0.2);
    assert.ok(pacing.fps > 58);
    assert.equal(pacing.longFrames, 0);
  });

  it("reports long frames", () => {
    const pacing = summarizePacing([1, 1, 1, 16.7, 16.7, 90, 120]);
    assert.equal(pacing.longFrames, 2);
    assert.ok(pacing.p95Ms >= 90);
  });

  it("ignores absurd deltas from a background tab", () => {
    const pacing = summarizePacing([1, 1, 1, 5000, ...frames(16.7, 30)]);
    assert.equal(pacing.frames, 30);
    assert.equal(pacing.longFrames, 0);
  });

  it("returns an empty summary when there is nothing to measure", () => {
    assert.deepEqual(summarizePacing([0, 0, 0]), {
      frames: 0,
      medianMs: 0,
      p95Ms: 0,
      fps: 0,
      longFrames: 0,
    });
  });
});

describe("gradePacing", () => {
  it("accepts a stable 60 fps", () => {
    assert.equal(gradePacing(summarizePacing(frames(16.7))), "good");
  });

  it("rejects the measured 8.6 fps globe", () => {
    assert.equal(gradePacing(summarizePacing(frames(116))), "poor");
  });

  it("rejects a good median with a stalled tail", () => {
    const samples = [1, 1, 1, ...frames(16.7, 40), ...frames(80, 10)];
    assert.equal(gradePacing(summarizePacing(samples)), "poor");
  });

  it("does not trust a handful of samples", () => {
    assert.equal(gradePacing(summarizePacing(frames(16.7, 8))), "poor");
  });
});
