// Deciding whether a device gets the 3D globe or the 2D map.
//
// Two different questions live here:
//  1. Can this device render the globe at all? (preflight: WebGL2, software
//     rasteriser, data saver)
//  2. Once it is running, is it actually fluid? (real frame times)
//
// Only (1) can be answered before rendering. (2) is measured after mount and
// is a remembered suggestion, never a silent override of the user's choice.

export type WorldViewMode = "globe" | "map";

export type Capability = {
  webgl2: boolean;
  software: boolean;
  renderer: string | null;
  cores: number;
  memoryGb: number | null;
  saveData: boolean;
  reducedMotion: boolean;
};

export type Pacing = {
  frames: number;
  medianMs: number;
  p95Ms: number;
  fps: number;
  longFrames: number;
};

export type PacingGrade = "good" | "poor";

/** A 60 Hz display gives ~16.7 ms; 22 ms still reads as smooth when rotating. */
export const MEDIAN_BUDGET_MS = 22;
/** Occasional long frames are tolerated, sustained ones are not. */
export const P95_BUDGET_MS = 45;
/** Below this many samples the grade is not trusted. */
export const MIN_FRAMES = 20;
export const STORAGE_KEY = "mundo-magico.world-view.v1";

const SOFTWARE_RENDERER =
  /swiftshader|llvmpipe|softpipe|software (rasterizer|renderer)|basic render|microsoft basic/i;

type WebGLDebugInfo = {
  UNMASKED_RENDERER_WEBGL: number;
  UNMASKED_VENDOR_WEBGL: number;
};

/**
 * Probes WebGL without keeping a context alive. `failIfMajorPerformanceCaveat`
 * is what catches software rasterisation on Windows and VMs; the unmasked
 * renderer string catches the cases that slip through.
 */
export function readCapability(): Capability {
  if (typeof document === "undefined" || typeof navigator === "undefined") {
    return {
      webgl2: false,
      software: true,
      renderer: null,
      cores: 1,
      memoryGb: null,
      saveData: false,
      reducedMotion: false,
    };
  }

  let webgl2 = false;
  let software = true;
  let renderer: string | null = null;

  try {
    const canvas = document.createElement("canvas");
    const strict = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    const loose = strict ?? canvas.getContext("webgl2");
    if (loose) {
      webgl2 = true;
      const info = loose.getExtension("WEBGL_debug_renderer_info") as WebGLDebugInfo | null;
      if (info) renderer = String(loose.getParameter(info.UNMASKED_RENDERER_WEBGL) ?? "") || null;
      software = !strict || (renderer ? SOFTWARE_RENDERER.test(renderer) : false);
      loose.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    webgl2 = false;
    software = true;
  }

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  return {
    webgl2,
    software,
    renderer,
    cores: nav.hardwareConcurrency ?? 1,
    memoryGb: nav.deviceMemory ?? null,
    saveData: Boolean(nav.connection?.saveData),
    reducedMotion:
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  };
}

/**
 * Preflight only. A `globe` verdict means "worth trying", not "will be
 * smooth" — the frame probe after mount is what settles that.
 */
export function decideInitialMode(capability: Capability): WorldViewMode {
  if (!capability.webgl2) return "map";
  if (capability.software) return "map";
  if (capability.saveData) return "map";
  return "globe";
}

/** Drops the warm-up frames and turns raw rAF deltas into a comparable summary. */
export function summarizePacing(samples: number[]): Pacing {
  const usable = samples.slice(3).filter((dt) => Number.isFinite(dt) && dt > 0 && dt < 2000);
  if (usable.length === 0) {
    return { frames: 0, medianMs: 0, p95Ms: 0, fps: 0, longFrames: 0 };
  }
  const sorted = [...usable].sort((a, b) => a - b);
  const at = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))];
  const medianMs = at(0.5);
  return {
    frames: usable.length,
    medianMs: Math.round(medianMs * 10) / 10,
    p95Ms: Math.round(at(0.95) * 10) / 10,
    fps: Math.round((1000 / Math.max(0.01, medianMs)) * 10) / 10,
    longFrames: usable.filter((dt) => dt > 34).length,
  };
}

export function gradePacing(pacing: Pacing): PacingGrade {
  if (pacing.frames < MIN_FRAMES) return "poor";
  return pacing.medianMs <= MEDIAN_BUDGET_MS && pacing.p95Ms <= P95_BUDGET_MS
    ? "good"
    : "poor";
}

/** Samples real frame deltas for `durationMs` (or until enough frames landed). */
export function samplePacing(durationMs = 1200, minFrames = MIN_FRAMES): Promise<Pacing> {
  return new Promise((resolve) => {
    const samples: number[] = [];
    const start = performance.now();
    let last = start;
    const tick = (now: number) => {
      samples.push(now - last);
      last = now;
      if (now - start < durationMs || samples.length < minFrames) {
        requestAnimationFrame(tick);
      } else {
        resolve(summarizePacing(samples));
      }
    };
    requestAnimationFrame(tick);
  });
}

export type ModeSource = "user" | "measured";

export type StoredMode = { mode: WorldViewMode; source: ModeSource };

/**
 * A mode the user picked must survive a slow-device measurement; a mode the
 * measurement picked may be re-measured on the next visit.
 */
export function readStoredMode(): StoredMode | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    // Older sessions stored the bare string.
    if (raw === "globe" || raw === "map") return { mode: raw, source: "measured" };
    const parsed = JSON.parse(raw) as Partial<StoredMode> | null;
    if (parsed?.mode !== "globe" && parsed?.mode !== "map") return null;
    return { mode: parsed.mode, source: parsed.source === "user" ? "user" : "measured" };
  } catch {
    return null;
  }
}

export function storeMode(mode: WorldViewMode, source: ModeSource): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode, source }));
  } catch {
    /* private mode / quota — the mode still applies for this session */
  }
}
