import { useEffect, useRef, useState } from "react";
import { feature } from "topojson-client";
import {
  geoArea,
  geoBounds,
  geoCentroid,
  geoContains,
  geoEquirectangular,
  geoPath,
} from "d3-geo";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { GlobeInstance } from "globe.gl";
import type { MeshPhongMaterial } from "three";
import { isoFromAtlas } from "@/data/iso";
import { flagUrl, getCountry } from "@/data/catalog";
import { countryName } from "@/i18n/country-name";
import { useI18n } from "@/i18n/use-i18n";
import { gradePacing, samplePacing } from "@/lib/world-view/capability";
import type { WorldViewApi } from "@/lib/world-view/types";
import { WorldLoader } from "./world-loader";

type Atlas = Topology<{ countries: GeometryCollection }>;

type CountryPoly = {
  iso: string;
  name: string;
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon;
  lat: number;
  lng: number;
  bounds: [[number, number], [number, number]];
  cap: string;
  hover: string;
  side: string;
};

type Props = {
  selectedIso: string | null;
  onSelect: (iso: string, lat: number, lng: number) => void;
  onReady?: (api: WorldViewApi) => void;
  /** The live frame probe says this device cannot keep the globe fluid. */
  onSlow?: () => void;
};

/** One texture for every country: the whole reason this globe is cheap. */
const TEXTURE_W = 2048;
const TEXTURE_H = 1024;

const globeBundle = typeof window === "undefined" ? null : import("globe.gl");
const topoBundle =
  typeof window === "undefined"
    ? null
    : fetch("/geo/countries-110m.json").then((res) => res.json() as Promise<Atlas>);

function hexAlpha(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function landAnchor(geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon): [number, number] {
  if (geometry.type === "Polygon") {
    const [lng, lat] = geoCentroid(geometry);
    return [lng, lat];
  }
  let best = geometry.coordinates[0];
  let bestArea = -1;
  for (const coordinates of geometry.coordinates) {
    const polygon: GeoJSON.Polygon = { type: "Polygon", coordinates };
    const area = geoArea(polygon);
    if (area > bestArea) {
      bestArea = area;
      best = coordinates;
    }
  }
  const [lng, lat] = geoCentroid({ type: "Polygon", coordinates: best! });
  return [lng, lat];
}

function angularDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = Math.PI / 180;
  const p1 = lat1 * toRad;
  const p2 = lat2 * toRad;
  const dLat = (lat2 - lat1) * toRad;
  const dLng = (lng2 - lng1) * toRad;
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dLng / 2) ** 2;
  return (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 180) / Math.PI;
}

function facingLabel(country: CountryPoly, label: string) {
  const el = document.createElement("div");
  el.className = "globe-flag";
  const src = flagUrl(country.iso, 40);
  if (src) {
    const img = document.createElement("img");
    img.alt = "";
    img.width = 22;
    img.height = 22;
    img.src = src;
    el.appendChild(img);
  }
  const name = document.createElement("span");
  name.textContent = label;
  el.appendChild(name);
  return el;
}

/**
 * Paints every country into one equirectangular canvas over the ocean texture.
 * 177 filled paths once, instead of 177 extruded meshes every frame.
 */
async function paintCountries(polys: CountryPoly[]): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = TEXTURE_W;
  canvas.height = TEXTURE_H;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return canvas;

  ctx.fillStyle = "#1f8fd6";
  ctx.fillRect(0, 0, TEXTURE_W, TEXTURE_H);
  try {
    const ocean = new Image();
    ocean.src = "/textures/ocean.jpg";
    await ocean.decode();
    ctx.drawImage(ocean, 0, 0, TEXTURE_W, TEXTURE_H);
  } catch {
    /* a flat blue ocean is an acceptable fallback */
  }

  const projection = geoEquirectangular()
    .translate([TEXTURE_W / 2, TEXTURE_H / 2])
    .scale(TEXTURE_W / (2 * Math.PI));
  const path = geoPath(projection, ctx);
  ctx.lineJoin = "round";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#2b1b4e";
  for (const country of polys) {
    ctx.globalAlpha = 0.86;
    ctx.fillStyle = country.cap;
    ctx.beginPath();
    path(country.geometry);
    ctx.fill();
    ctx.globalAlpha = 0.92;
    ctx.beginPath();
    path(country.geometry);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  return canvas;
}

export function GlobeCanvas({ selectedIso, onSelect, onReady, onSlow }: Props) {
  const { locale } = useI18n();
  const hostRef = useRef<HTMLDivElement>(null);
  const nameOfRef = useRef<(iso: string, fallback: string) => string>((_, fallback) => fallback);
  const refreshLabelRef = useRef<(() => void) | null>(null);
  nameOfRef.current = (iso, fallback) => countryName(iso, locale, fallback);
  const selectedRef = useRef(selectedIso);
  const hoverRef = useRef<string | null>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const overlayRef = useRef<(() => void) | null>(null);
  const [ready, setReady] = useState(false);
  const polysRef = useRef<CountryPoly[]>([]);
  const onSelectRef = useRef(onSelect);
  const onReadyRef = useRef(onReady);
  const onSlowRef = useRef(onSlow);

  selectedRef.current = selectedIso;
  onSelectRef.current = onSelect;
  onReadyRef.current = onReady;
  onSlowRef.current = onSlow;

  useEffect(() => {
    const el = hostRef.current;
    if (!el || !globeBundle || !topoBundle) return;
    let disposed = false;
    let resizeObs: ResizeObserver | null = null;
    let onVis: (() => void) | null = null;
    let onControls: (() => void) | null = null;
    let texture: { dispose: () => void } | null = null;
    const teardown: (() => void)[] = [];
    const front = { iso: null as string | null };

    const safety = window.setTimeout(() => {
      if (!disposed) setReady(true);
    }, 12000);

    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    void (async () => {
      const [globeModule, THREE, topo] = await Promise.all([
        globeBundle,
        import("three"),
        topoBundle,
      ]);
      if (disposed) return;
      const Globe = globeModule.default;

      const fc = feature(topo, topo.objects.countries) as GeoJSON.FeatureCollection;
      const polys: CountryPoly[] = [];
      for (const feat of fc.features) {
        const name = String((feat.properties as { name?: string } | null)?.name ?? "");
        const iso = isoFromAtlas(feat.id, name);
        if (!iso || !feat.geometry) continue;
        if (feat.geometry.type !== "Polygon" && feat.geometry.type !== "MultiPolygon") continue;
        const [lng, lat] = landAnchor(feat.geometry);
        const country = getCountry(iso, name);
        polys.push({
          iso,
          name: country.name,
          geometry: feat.geometry,
          lat,
          lng,
          bounds: geoBounds(feat.geometry) as [[number, number], [number, number]],
          cap: country.palette[0],
          hover: hexAlpha(country.palette[0], 0.95),
          side: hexAlpha(country.palette[2], 0.65),
        });
      }
      polysRef.current = polys;
      const byIso = new Map(polys.map((country) => [country.iso, country]));

      const painted = await paintCountries(polys);
      if (disposed) return;

      const globe = new Globe(el, {
        rendererConfig: {
          alpha: true,
          antialias: el.clientWidth >= 600,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        },
        animateIn: false,
      });
      globeRef.current = globe;
      if (import.meta.env.DEV) {
        (window as unknown as { __globe?: GlobeInstance }).__globe = globe;
      }

      const renderer = globe.renderer();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      globe.width(el.clientWidth);
      globe.height(el.clientHeight);

      const canvasTexture = new THREE.CanvasTexture(painted);
      canvasTexture.colorSpace = THREE.SRGBColorSpace;
      canvasTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      texture = canvasTexture;
      const material = globe.globeMaterial() as MeshPhongMaterial;
      material.map = canvasTexture;
      material.color.set(0xffffff);
      material.needsUpdate = true;

      globe
        .backgroundColor("rgba(0,0,0,0)")
        .showAtmosphere(true)
        .atmosphereColor("#9ad8ff")
        .atmosphereAltitude(0.22)
        .polygonsData([])
        .polygonGeoJsonGeometry("geometry")
        .polygonSideColor((d) => (d as CountryPoly).side)
        .polygonStrokeColor(() => "#231640")
        .polygonLabel(() => "")
        .polygonsTransitionDuration(0);

      let overlayKey = "";
      const syncOverlay = () => {
        if (disposed || globeRef.current !== globe) return;
        const selected = selectedRef.current;
        const hover = hoverRef.current;
        const key = `${selected ?? ""}|${hover ?? ""}`;
        if (key === overlayKey) return;
        overlayKey = key;
        const items: CountryPoly[] = [];
        const selectedCountry = selected ? byIso.get(selected) : undefined;
        if (selectedCountry) items.push(selectedCountry);
        const hovered = hover && hover !== selected ? byIso.get(hover) : undefined;
        if (hovered) items.push(hovered);
        try {
          globe.polygonsData(items);
        } catch {
          /* the globe can be mid-teardown during HMR */
        }
      };
      overlayRef.current = syncOverlay;

      globe.polygonCapColor((d) => {
        const country = d as CountryPoly;
        return country.iso === selectedRef.current ? "#ffd93d" : country.hover;
      });
      globe.polygonAltitude((d) => {
        const country = d as CountryPoly;
        return country.iso === selectedRef.current ? 0.055 : 0.012;
      });

      const radius = globe.getGlobeRadius();
      const sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), radius);
      const raycaster = new THREE.Raycaster();
      const ndc = new THREE.Vector2();
      const hitPoint = new THREE.Vector3();

      const findCountry = (lat: number, lng: number) => {
        for (const country of polys) {
          const [[minLng, minLat], [maxLng, maxLat]] = country.bounds;
          if (lat < minLat || lat > maxLat) continue;
          if (minLng <= maxLng && (lng < minLng || lng > maxLng)) continue;
          if (geoContains(country.geometry, [lng, lat])) return country;
        }
        return null;
      };

      const countryAt = (clientX: number, clientY: number) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return null;
        ndc.set(
          ((clientX - rect.left) / rect.width) * 2 - 1,
          -((clientY - rect.top) / rect.height) * 2 + 1,
        );
        raycaster.setFromCamera(ndc, globe.camera());
        const point = raycaster.ray.intersectSphere(sphere, hitPoint);
        if (!point) return null;
        const lat = 90 - (Math.acos(Math.min(1, Math.max(-1, point.y / radius))) * 180) / Math.PI;
        const lng = 90 - (Math.atan2(point.z, point.x) * 180) / Math.PI;
        const wrapped = ((lng + 540) % 360) - 180;
        return findCountry(lat, wrapped);
      };

      let pressed: { x: number; y: number; moved: boolean } | null = null;
      let hoverFrame = 0;
      let pendingMove: { x: number; y: number } | null = null;

      const onPointerMove = (event: PointerEvent) => {
        if (pressed) {
          if (
            Math.abs(event.clientX - pressed.x) + Math.abs(event.clientY - pressed.y) > 6
          ) {
            pressed.moved = true;
          }
          return;
        }
        pendingMove = { x: event.clientX, y: event.clientY };
        if (hoverFrame) return;
        hoverFrame = requestAnimationFrame(() => {
          hoverFrame = 0;
          const point = pendingMove;
          pendingMove = null;
          if (!point || disposed) return;
          const next = countryAt(point.x, point.y)?.iso ?? null;
          if (next === hoverRef.current) return;
          hoverRef.current = next;
          el.style.cursor = next ? "pointer" : "grab";
          syncOverlay();
        });
      };
      const onPointerDown = (event: PointerEvent) => {
        pressed = { x: event.clientX, y: event.clientY, moved: false };
      };
      const onPointerUp = (event: PointerEvent) => {
        const start = pressed;
        pressed = null;
        if (!start || start.moved || disposed) return;
        const hit = countryAt(event.clientX, event.clientY);
        if (hit) onSelectRef.current(hit.iso, hit.lat, hit.lng);
      };
      const onPointerLeave = () => {
        pendingMove = null;
        if (!hoverRef.current) return;
        hoverRef.current = null;
        el.style.cursor = "grab";
        syncOverlay();
      };
      el.style.cursor = "grab";
      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerdown", onPointerDown);
      el.addEventListener("pointerup", onPointerUp);
      el.addEventListener("pointerleave", onPointerLeave);
      teardown.push(() => {
        el.removeEventListener("pointermove", onPointerMove);
        el.removeEventListener("pointerdown", onPointerDown);
        el.removeEventListener("pointerup", onPointerUp);
        el.removeEventListener("pointerleave", onPointerLeave);
        window.cancelAnimationFrame(hoverFrame);
      });

      const FRONT_KEEP = 20;
      const FRONT_TAKE = 16;
      const syncFront = () => {
        if (disposed || globeRef.current !== globe) return;
        const pov = globe.pointOfView();
        let best: CountryPoly | null = null;
        let bestD = 180;
        for (const country of polysRef.current) {
          const distance = angularDistance(pov.lat, pov.lng, country.lat, country.lng);
          if (distance < bestD) {
            best = country;
            bestD = distance;
          }
        }
        let next: CountryPoly | null = null;
        if (front.iso) {
          const current = polysRef.current.find((country) => country.iso === front.iso);
          if (current) {
            const currentD = angularDistance(pov.lat, pov.lng, current.lat, current.lng);
            if (currentD < FRONT_KEEP && (!best || currentD < bestD + 4)) next = current;
          }
        }
        if (!next && best && bestD < FRONT_TAKE) next = best;
        const nextIso = next?.iso ?? null;
        if (nextIso === front.iso) return;
        front.iso = nextIso;
        globe.htmlElementsData(next ? [next] : []);
      };

      globe
        .htmlLat((d) => (d as CountryPoly).lat)
        .htmlLng((d) => (d as CountryPoly).lng)
        .htmlAltitude(0)
        .htmlTransitionDuration(0)
        .htmlElement((d) => {
          const country = d as CountryPoly;
          return facingLabel(country, nameOfRef.current(country.iso, country.name));
        })
        .htmlElementsData([]);
      refreshLabelRef.current = () => {
        if (!front.iso) return;
        const current = polysRef.current.find((country) => country.iso === front.iso);
        globe.htmlElementsData([]);
        if (current) globe.htmlElementsData([current]);
      };
      onControls = syncFront;
      globe.controls().addEventListener("change", onControls);
      teardown.push(() => {
        try {
          globe.controls().removeEventListener("change", onControls!);
        } catch {
          /* already gone */
        }
      });

      const controls = globe.controls();
      controls.autoRotate = !reducedMotion;
      controls.autoRotateSpeed = 0.45;
      controls.enableDamping = true;
      controls.rotateSpeed = 0.7;

      // Globe.gl's own tween moves the camera but leaves OrbitControls'
      // orientation stale, which renders an off-centre view. Interpolating in
      // spherical coordinates and applying each frame keeps position and
      // orientation in sync.
      let flyFrame = 0;
      const flyTo = (lat: number, lng: number, altitude: number) => {
        controls.autoRotate = false;
        window.cancelAnimationFrame(flyFrame);
        const from = globe.pointOfView();
        let dLng = lng - from.lng;
        if (dLng > 180) dLng -= 360;
        if (dLng < -180) dLng += 360;
        if (reducedMotion) {
          globe.pointOfView({ lat, lng, altitude }, 0);
          controls.update();
          return;
        }
        const startedAt = performance.now();
        const duration = 900;
        const step = (now: number) => {
          const progress = Math.min(1, (now - startedAt) / duration);
          const eased = progress < 0.5 ? 2 * progress * progress : 1 - (-2 * progress + 2) ** 2 / 2;
          globe.pointOfView(
            {
              lat: from.lat + (lat - from.lat) * eased,
              lng: from.lng + dLng * eased,
              altitude: from.altitude + (altitude - from.altitude) * eased,
            },
            0,
          );
          // pointOfView moves the camera but does not re-aim it.
          controls.update();
          if (progress < 1) flyFrame = requestAnimationFrame(step);
        };
        flyFrame = requestAnimationFrame(step);
      };

      try {
        const stopRotate = () => {
          controls.autoRotate = false;
          window.cancelAnimationFrame(flyFrame);
        };
        controls.addEventListener("start", stopRotate);
        teardown.push(() => controls.removeEventListener("start", stopRotate));
      } catch {
        /* older OrbitControls */
      }
      teardown.push(() => window.cancelAnimationFrame(flyFrame));

      globe.pointOfView({ lat: 12, lng: 8, altitude: 2.35 });

      const api: WorldViewApi = {
        flyTo: (lat, lng, altitude = 1.55) => {
          if (disposed) return;
          flyTo(lat, lng, altitude);
        },
        flyToIso: (iso) => {
          if (disposed) return;
          const target = byIso.get(iso);
          if (!target) return;
          flyTo(target.lat, target.lng, 1.55);
        },
      };
      onReadyRef.current?.(api);
      syncFront();
      syncOverlay();

      let probing = false;
      const probe = async () => {
        if (disposed || probing) return;
        probing = true;
        const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
        await wait(600);
        if (disposed) return;
        if (document.visibilityState !== "visible") {
          probing = false;
          window.setTimeout(() => void probe(), 800);
          return;
        }
        let pacing = await samplePacing(1200);
        if (disposed) return;
        if (gradePacing(pacing) !== "good" && renderer.getPixelRatio() > 1) {
          renderer.setPixelRatio(1);
          await wait(250);
          pacing = await samplePacing(900);
        }
        if (disposed) return;
        el.dataset.worldFps = String(pacing.fps);
        if (gradePacing(pacing) !== "good") onSlowRef.current?.();
      };

      let revealed = false;
      const reveal = () => {
        if (disposed || revealed || globeRef.current !== globe) return;
        revealed = true;
        setReady(true);
        window.clearTimeout(safety);
        void probe();
      };
      globe.onGlobeReady(reveal);
      requestAnimationFrame(() => requestAnimationFrame(reveal));

      const onContextLost = (event: Event) => {
        event.preventDefault();
        onSlowRef.current?.();
      };
      renderer.domElement.addEventListener("webglcontextlost", onContextLost);
      teardown.push(() =>
        renderer.domElement.removeEventListener("webglcontextlost", onContextLost),
      );

      onVis = () => {
        if (document.hidden) globe.pauseAnimation();
        else globe.resumeAnimation();
      };
      document.addEventListener("visibilitychange", onVis);

      resizeObs = new ResizeObserver(() => {
        if (!hostRef.current) return;
        globe.width(hostRef.current.clientWidth);
        globe.height(hostRef.current.clientHeight);
      });
      resizeObs.observe(el);
    })().catch(() => {
      if (!disposed) setReady(true);
    });

    return () => {
      disposed = true;
      window.clearTimeout(safety);
      for (const off of teardown) {
        try {
          off();
        } catch {
          /* ignore teardown races */
        }
      }
      if (onVis) document.removeEventListener("visibilitychange", onVis);
      resizeObs?.disconnect();
      texture?.dispose();
      globeRef.current?._destructor();
      globeRef.current = null;
      overlayRef.current = null;
      el.replaceChildren();
    };
  }, []);

  useEffect(() => {
    refreshLabelRef.current?.();
  }, [locale]);

  useEffect(() => {
    selectedRef.current = selectedIso;
    overlayRef.current?.();
  }, [selectedIso]);

  return (
    <>
      <div ref={hostRef} className="absolute inset-0 touch-none" />
      {!ready ? <WorldLoader /> : null}
    </>
  );
}
