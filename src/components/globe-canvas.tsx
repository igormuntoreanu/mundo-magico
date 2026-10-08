import { useEffect, useRef, useState } from "react";
import { feature } from "topojson-client";
import { geoArea, geoCentroid } from "d3-geo";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { GlobeInstance } from "globe.gl";
import { isoFromAtlas } from "@/data/iso";
import { flagUrl, getCountry } from "@/data/catalog";

export type GlobeApi = {
  flyTo: (lat: number, lng: number, altitude?: number) => void;
  flyToIso: (iso: string) => void;
};

type Atlas = Topology<{ countries: GeometryCollection }>;

type CountryPoly = {
  iso: string;
  name: string;
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon;
  lat: number;
  lng: number;
  cap: string;
  hover: string;
  side: string;
};

type Props = {
  selectedIso: string | null;
  onSelect: (iso: string, lat: number, lng: number) => void;
  onReady?: (api: GlobeApi) => void;
};

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

function facingLabel(country: CountryPoly) {
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
  name.textContent = country.name;
  el.appendChild(name);
  return el;
}

export function GlobeCanvas({ selectedIso, onSelect, onReady }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef(selectedIso);
  const hoverRef = useRef<string | null>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const [ready, setReady] = useState(false);
  const polysRef = useRef<CountryPoly[]>([]);
  const onSelectRef = useRef(onSelect);
  const onReadyRef = useRef(onReady);

  selectedRef.current = selectedIso;
  onSelectRef.current = onSelect;
  onReadyRef.current = onReady;

  useEffect(() => {
    const el = hostRef.current;
    if (!el || !globeBundle || !topoBundle) return;
    let disposed = false;
    let resizeObs: ResizeObserver | null = null;
    let onVis: (() => void) | null = null;
    let pumpFrame = 0;
    let onControls: (() => void) | null = null;
    const front = { iso: null as string | null };

    function paint(globe: GlobeInstance) {
      const selected = selectedRef.current;
      const hover = hoverRef.current;
      globe.polygonCapColor((d) => {
        const p = d as CountryPoly;
        if (p.iso === selected) return "#ffd93d";
        if (p.iso === hover) return p.hover;
        return p.cap;
      });
      globe.polygonAltitude((d) => ((d as CountryPoly).iso === selected ? 0.06 : 0.01));
    }

    const safety = window.setTimeout(() => {
      if (!disposed) setReady(true);
    }, 12000);

    void (async () => {
      const [{ default: Globe }, topo] = await Promise.all([globeBundle, topoBundle]);
      if (disposed) return;
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
          cap: hexAlpha(country.palette[0], 0.82),
          hover: hexAlpha(country.palette[0], 0.95),
          side: hexAlpha(country.palette[2], 0.65),
        });
      }
      polysRef.current = polys;
      if (disposed) return;

      const globe = new Globe(el, {
        rendererConfig: {
          alpha: true,
          antialias: el.clientWidth >= 800,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        },
        animateIn: false,
      });

      let surfaceReady = false;
      let countriesReady = false;
      const reveal = () => {
        if (disposed || globeRef.current !== globe) return;
        if (surfaceReady && countriesReady) setReady(true);
      };
      globe.onGlobeReady(() => {
        surfaceReady = true;
        reveal();
      });

      globe
        .backgroundColor("rgba(0,0,0,0)")
        .globeImageUrl("/textures/ocean.jpg")
        .showAtmosphere(true)
        .atmosphereColor("#9ad8ff")
        .atmosphereAltitude(0.22)
        .polygonsData([])
        .polygonGeoJsonGeometry("geometry")
        .polygonSideColor((d) => (d as CountryPoly).side)
        .polygonStrokeColor(() => "#2b1b4e")
        .polygonLabel((d) => {
          const country = d as CountryPoly;
          if (country.iso === front.iso) return "";
          return `<div class="globe-tip">${country.name}</div>`;
        })
        .polygonsTransitionDuration(0)
        .onPolygonHover((poly) => {
          const next = poly ? (poly as CountryPoly).iso : null;
          if (next === hoverRef.current) return;
          hoverRef.current = next;
          el.style.cursor = next ? "pointer" : "grab";
          paint(globe);
        })
        .onPolygonClick((poly) => {
          const p = poly as CountryPoly;
          onSelectRef.current(p.iso, p.lat, p.lng);
        });

      paint(globe);

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
        .htmlElement((d) => facingLabel(d as CountryPoly))
        .htmlElementsData([]);
      onControls = syncFront;
      globe.controls().addEventListener("change", onControls);

      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.45;
      globe.controls().enableDamping = true;
      globe.controls().rotateSpeed = 0.7;
      try {
        globe.controls().addEventListener("start", () => {
          globe.controls().autoRotate = false;
        });
      } catch {
        /* older OrbitControls */
      }
      globe.renderer().setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      globe.renderer().setClearColor(0x000000, 0);
      globe.width(el.clientWidth);
      globe.height(el.clientHeight);
      globe.pointOfView({ lat: 12, lng: 8, altitude: 2.35 });

      const api: GlobeApi = {
        flyTo: (lat, lng, altitude = 1.55) => {
          globe.controls().autoRotate = false;
          globe.pointOfView({ lat, lng, altitude }, 900);
        },
        flyToIso: (iso) => {
          const hit = polysRef.current.find((p) => p.iso === iso);
          if (!hit) return;
          globe.controls().autoRotate = false;
          globe.pointOfView({ lat: hit.lat, lng: hit.lng, altitude: 1.55 }, 900);
        },
      };
      globeRef.current = globe;
      onReadyRef.current?.(api);
      syncFront();

      let shown = 0;
      const pump = () => {
        if (disposed || globeRef.current !== globe) return;
        try {
          shown = Math.min(polys.length, shown + 12);
          globe.polygonsData(polys.slice(0, shown));
        } catch {
          shown = polys.length;
        }
        if (shown < polys.length) {
          pumpFrame = window.setTimeout(pump, 16);
          return;
        }
        countriesReady = true;
        reveal();
      };
      if (polys.length === 0) {
        countriesReady = true;
        reveal();
      } else {
        pumpFrame = window.setTimeout(pump, 16);
      }

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
      window.clearTimeout(pumpFrame);
      if (onVis) document.removeEventListener("visibilitychange", onVis);
      if (onControls) {
        try {
          globeRef.current?.controls().removeEventListener("change", onControls);
        } catch {
          /* globe already torn down */
        }
      }
      resizeObs?.disconnect();
      globeRef.current?._destructor();
      globeRef.current = null;
      el.replaceChildren();
    };
  }, []);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    const selected = selectedRef.current;
    const hover = hoverRef.current;
    globe.polygonCapColor((d) => {
      const p = d as CountryPoly;
      if (p.iso === selected) return "#ffd93d";
      if (p.iso === hover) return p.hover;
      return p.cap;
    });
    globe.polygonAltitude((d) => ((d as CountryPoly).iso === selected ? 0.06 : 0.01));
  }, [selectedIso]);

  return (
    <>
      <div ref={hostRef} className="absolute inset-0 touch-none" />
      {!ready ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-40 w-40">
              <img
                src="/textures/volcano-base.png"
                alt=""
                width={160}
                height={160}
                className="h-40 w-40 border-0 bg-transparent object-contain"
                style={{ imageRendering: "pixelated" }}
              />
              {[
                ["#fffdf6", "0s", 0],
                ["#ff8a3d", "0.28s", 8],
                ["#fffdf6", "0.55s", -7],
                ["#ff5a1f", "0.82s", 5],
                ["#fffdf6", "1.1s", -4],
                ["#ff8a3d", "1.35s", -9],
              ].map(([color, delay, shift], i) => (
                <span
                  key={i}
                  className="absolute top-[38%] size-3.5 rounded-full"
                  style={{
                    left: `calc(50% + ${shift}px)`,
                    background: color,
                    boxShadow: "0 0 0 2px rgba(43,27,78,0.35)",
                    animation: "volcano-rise 1.7s linear infinite",
                    animationDelay: delay as string,
                  }}
                />
              ))}
            </div>
            <p className="rounded-full border-3 border-stroke bg-cream px-4 py-1.5 font-display text-sm font-bold text-ink shadow-[3px_3px_0_#2b1b4e]">
              A carregar...
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
