import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { feature } from "topojson-client";
import { geoCentroid, geoNaturalEarth1, geoPath } from "d3-geo";
import type { Topology, GeometryCollection } from "topojson-specification";
import { flagUrl, getCountry } from "@/data/catalog";
import { isoFromAtlas } from "@/data/iso";
import { countryName } from "@/i18n/country-name";
import { useI18n } from "@/i18n/use-i18n";
import type { WorldViewApi } from "@/lib/world-view/types";
import { WorldLoader } from "./world-loader";

type Atlas = Topology<{ countries: GeometryCollection }>;

type MapCountry = {
  iso: string;
  name: string;
  d: string;
  x: number;
  y: number;
  lat: number;
  lng: number;
  fill: string;
};

type View = { x: number; y: number; k: number };

const VIEW_W = 1000;
const VIEW_H = 500;
const MIN_ZOOM = 1;
const MAX_ZOOM = 7;

type Props = {
  selectedIso: string | null;
  onSelect: (iso: string, lat: number, lng: number) => void;
  onReady?: (api: WorldViewApi) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function clampView(view: View): View {
  const k = clamp(view.k, MIN_ZOOM, MAX_ZOOM);
  const minX = VIEW_W - VIEW_W * k;
  const minY = VIEW_H - VIEW_H * k;
  return { k, x: clamp(view.x, minX, 0), y: clamp(view.y, minY, 0) };
}

/**
 * The no-WebGL world view: one static SVG, pan/zoom done with a single group
 * transform. No per-frame JavaScript and no GPU requirement, so it is fluid on
 * exactly the devices where a 3D globe cannot be.
 */
export function WorldMap({ selectedIso, onSelect, onReady }: Props) {
  const { locale, t } = useI18n();
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef(new Map<string, SVGPathElement>());
  const viewRef = useRef<View>({ x: 0, y: 0, k: 1 });
  const animRef = useRef(0);
  const projectionRef = useRef<ReturnType<typeof geoNaturalEarth1> | null>(null);

  const [countries, setCountries] = useState<MapCountry[]>([]);
  const [sphere, setSphere] = useState<string>("");
  const [ready, setReady] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [moved, setMoved] = useState(false);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);

  const onSelectRef = useRef(onSelect);
  const onReadyRef = useRef(onReady);
  onSelectRef.current = onSelect;
  onReadyRef.current = onReady;

  const skipMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const apply = useCallback((view: View) => {
    viewRef.current = view;
    groupRef.current?.setAttribute(
      "transform",
      `translate(${view.x.toFixed(2)} ${view.y.toFixed(2)}) scale(${view.k.toFixed(4)})`,
    );
  }, []);

  const animateTo = useCallback(
    (target: View, duration = 520) => {
      window.cancelAnimationFrame(animRef.current);
      const to = clampView(target);
      const from = viewRef.current;
      if (skipMotion || duration <= 0) {
        apply(to);
        setMoved(to.k > 1.01 || to.x < -0.5 || to.y < -0.5);
        return;
      }
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        apply({
          x: from.x + (to.x - from.x) * eased,
          y: from.y + (to.y - from.y) * eased,
          k: from.k + (to.k - from.k) * eased,
        });
        if (progress < 1) {
          animRef.current = requestAnimationFrame(step);
        } else {
          setMoved(to.k > 1.01 || to.x < -0.5 || to.y < -0.5);
        }
      };
      animRef.current = requestAnimationFrame(step);
    },
    [apply, skipMotion],
  );

  const toViewBox = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const matrix = svg.getScreenCTM();
    if (!matrix) return { x: 0, y: 0 };
    const point = new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse());
    return { x: point.x, y: point.y };
  }, []);

  const focusIso = useCallback(
    (iso: string, duration = 520) => {
      const path = pathRefs.current.get(iso);
      if (!path) return;
      const box = path.getBBox();
      const k = clamp(
        Math.min(VIEW_W / Math.max(60, box.width), VIEW_H / Math.max(60, box.height)) * 0.5,
        1.4,
        MAX_ZOOM,
      );
      animateTo(
        {
          k,
          x: VIEW_W / 2 - (box.x + box.width / 2) * k,
          y: VIEW_H / 2 - (box.y + box.height / 2) * k,
        },
        duration,
      );
    },
    [animateTo],
  );

  // Build the map once. Paths are static; only the group transform changes later.
  useEffect(() => {
    let cancelled = false;
    fetch("/geo/countries-110m.json")
      .then((response) => response.json() as Promise<Atlas>)
      .then((topo) => {
        if (cancelled) return;
        const collection = feature(topo, topo.objects.countries) as GeoJSON.FeatureCollection;
        const projection = geoNaturalEarth1().fitExtent(
          [
            [8, 8],
            [VIEW_W - 8, VIEW_H - 8],
          ],
          { type: "Sphere" },
        );
        projectionRef.current = projection;
        const path = geoPath(projection);
        const next: MapCountry[] = [];
        for (const item of collection.features) {
          const name = String((item.properties as { name?: string } | null)?.name ?? "");
          const iso = isoFromAtlas(item.id, name);
          if (!iso || !item.geometry) continue;
          if (item.geometry.type !== "Polygon" && item.geometry.type !== "MultiPolygon") continue;
          const d = path(item);
          if (!d) continue;
          const [lng, lat] = geoCentroid(item.geometry);
          const point = projection([lng, lat]);
          next.push({
            iso,
            name,
            d,
            x: point?.[0] ?? 0,
            y: point?.[1] ?? 0,
            lat,
            lng,
            fill: getCountry(iso, name).palette[0],
          });
        }
        setCountries(next);
        setSphere(path({ type: "Sphere" }) ?? "");
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    apply({ x: 0, y: 0, k: 1 });
    const projection = projectionRef.current;
    const api: WorldViewApi = {
      flyTo: (lat, lng) => {
        const point = projection?.([lng, lat]);
        if (!point) return;
        animateTo({
          k: 2.2,
          x: VIEW_W / 2 - point[0] * 2.2,
          y: VIEW_H / 2 - point[1] * 2.2,
        });
      },
      flyToIso: (iso) => focusIso(iso),
    };
    onReadyRef.current?.(api);
  }, [ready, apply, animateTo, focusIso]);

  // Selecting from search, the panel or a click flies to that country.
  useEffect(() => {
    if (!ready || !selectedIso) return;
    focusIso(selectedIso);
  }, [ready, selectedIso, focusIso]);

  // Pan, pinch and tap. Selection and hover resolve from the element under the
  // pointer, so pointer capture can be used for touch without eating clicks.
  useEffect(() => {
    const host = hostRef.current;
    const svg = svgRef.current;
    if (!host || !svg) return;

    const pointers = new Map<number, { x: number; y: number }>();
    let start: { x: number; y: number; t: number; moved: boolean } | null = null;
    let startView: View | null = null;
    let pinch: { distance: number; view: View; anchor: { x: number; y: number } } | null = null;
    let hoverFrame = 0;
    let pending: { x: number; y: number } | null = null;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType === "mouse") return;
      // Controls inside the map (reset) must not start a pan or capture the pointer.
      if ((event.target as Element | null)?.closest("button, a, input, select")) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      window.cancelAnimationFrame(animRef.current);
      if (pointers.size === 1) {
        start = { x: event.clientX, y: event.clientY, t: performance.now(), moved: false };
        startView = viewRef.current;
        host.setPointerCapture(event.pointerId);
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinch = {
          distance: Math.hypot(a.x - b.x, a.y - b.y),
          view: viewRef.current,
          anchor: toViewBox((a.x + b.x) / 2, (a.y + b.y) / 2),
        };
        start = null;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (pointers.has(event.pointerId)) {
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      }

      if (pointers.size === 2 && pinch) {
        const [a, b] = [...pointers.values()];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch.distance > 0) {
          const k = clamp(
            pinch.view.k * (distance / pinch.distance),
            MIN_ZOOM,
            MAX_ZOOM,
          );
          const ratio = k / pinch.view.k;
          apply(
            clampView({
              k,
              x: pinch.anchor.x - (pinch.anchor.x - pinch.view.x) * ratio,
              y: pinch.anchor.y - (pinch.anchor.y - pinch.view.y) * ratio,
            }),
          );
        }
        return;
      }

      if (start && startView) {
        if (
          Math.abs(event.clientX - start.x) + Math.abs(event.clientY - start.y) > 5
        ) {
          start.moved = true;
        }
        if (start.moved) {
          const from = toViewBox(start.x, start.y);
          const now = toViewBox(event.clientX, event.clientY);
          apply(
            clampView({
              k: startView.k,
              x: startView.x + (now.x - from.x),
              y: startView.y + (now.y - from.y),
            }),
          );
        }
        return;
      }

      // Hover: read the path under the pointer from the event target.
      const iso = (event.target as Element | null)?.closest<SVGPathElement>("path[data-iso]")
        ?.dataset.iso;
      if (!iso) return;
      pending = { x: event.clientX, y: event.clientY };
      if (hoverFrame) return;
      hoverFrame = requestAnimationFrame(() => {
        hoverFrame = 0;
        const point = pending;
        pending = null;
        if (!point) return;
        lastPointerRef.current = point;
        if (!tooltipRef.current) return;
        const rect = host.getBoundingClientRect();
        tooltipRef.current.style.transform = `translate(${point.x - rect.left + 14}px, ${
          point.y - rect.top - 14
        }px)`;
      });
      setHovered((current) => (current === iso ? current : iso));
    };

    const finish = (event: PointerEvent) => {
      const wasTap =
        start &&
        !start.moved &&
        performance.now() - start.t < 700 &&
        pointers.size === 1;
      const id = event.pointerId;
      pointers.delete(id);
      if (pointers.size < 2) pinch = null;
      if (host.hasPointerCapture(id)) host.releasePointerCapture(id);
      if (wasTap) {
        const target = document
          .elementFromPoint(event.clientX, event.clientY)
          ?.closest<SVGPathElement>("path[data-iso]");
        const iso = target?.dataset.iso;
        if (iso) {
          const country = countries.find((item) => item.iso === iso);
          onSelectRef.current(
            iso,
            country?.lat ?? 0,
            country?.lng ?? 0,
          );
        }
      }
      start = null;
      startView = null;
      setMoved(
        viewRef.current.k > 1.01 ||
          viewRef.current.x < -0.5 ||
          viewRef.current.y < -0.5,
      );
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      window.cancelAnimationFrame(animRef.current);
      const anchor = toViewBox(event.clientX, event.clientY);
      const factor = Math.exp(-event.deltaY * 0.0015);
      const current = viewRef.current;
      const k = clamp(current.k * factor, MIN_ZOOM, MAX_ZOOM);
      const ratio = k / current.k;
      const next = clampView({
        k,
        x: anchor.x - (anchor.x - current.x) * ratio,
        y: anchor.y - (anchor.y - current.y) * ratio,
      });
      apply(next);
      setMoved(next.k > 1.01 || next.x < -0.5 || next.y < -0.5);
    };

    const onLeave = () => setHovered(null);

    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerup", finish);
    host.addEventListener("pointercancel", finish);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.cancelAnimationFrame(hoverFrame);
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerup", finish);
      host.removeEventListener("pointercancel", finish);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("wheel", onWheel);
    };
  }, [apply, toViewBox, countries]);

  const reset = () => {
    animateTo({ x: 0, y: 0, k: 1 });
    setHovered(null);
  };

  const hoveredCountry = hovered ? countries.find((item) => item.iso === hovered) : null;

  // The tooltip mounts after the first hover, so place it once it exists.
  useLayoutEffect(() => {
    const point = lastPointerRef.current;
    const host = hostRef.current;
    if (!hovered || !point || !host || !tooltipRef.current) return;
    const rect = host.getBoundingClientRect();
    tooltipRef.current.style.transform = `translate(${point.x - rect.left + 14}px, ${
      point.y - rect.top - 14
    }px)`;
  }, [hovered]);

  return (
    <div
      ref={hostRef}
      className="absolute inset-0 touch-none select-none overflow-hidden"
      style={{ cursor: moved ? "grab" : "default" }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-3">
        <div className="relative w-full max-w-[780px] overflow-hidden rounded-[1.75rem] border-4 border-stroke bg-panel-end shadow-[6px_6px_0_#2b1b4e]">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="xMidYMid meet"
            className="block h-auto w-full"
            role="group"
            aria-label={t.mapLabel}
          >
            <g ref={groupRef}>
              {sphere ? (
                <path
                  d={sphere}
                  fill="#bfe8ff"
                  stroke="#2b1b4e"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                />
              ) : null}
              {countries.map((country) => (
                <path
                  key={country.iso}
                  data-iso={country.iso}
                  ref={(node) => {
                    if (node) pathRefs.current.set(country.iso, node);
                    else pathRefs.current.delete(country.iso);
                  }}
                  d={country.d}
                  fill={country.iso === selectedIso ? "#ffd93d" : country.fill}
                  stroke="#2b1b4e"
                  strokeWidth={country.iso === selectedIso ? 2 : 1}
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  className="transition-[filter] duration-150 hover:brightness-110"
                  style={{ cursor: "pointer" }}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>

      {hoveredCountry ? (
        <div
          ref={tooltipRef}
          className="globe-flag pointer-events-none absolute top-0 left-0 z-10"
        >
          <img src={flagUrl(hoveredCountry.iso, 40) ?? ""} alt="" width={22} height={22} />
          <span>{countryName(hoveredCountry.iso, locale, hoveredCountry.name)}</span>
        </div>
      ) : null}

      {moved ? (
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={reset}
          className="absolute bottom-3 left-3 z-10 rounded-xl border-3 border-stroke bg-cream px-3 py-1.5 text-xs font-extrabold text-ink shadow-[3px_3px_0_#2b1b4e] hover:-translate-y-0.5 active:scale-[0.98]"
        >
          {t.resetView}
        </button>
      ) : null}

      {!ready ? <WorldLoader /> : null}
    </div>
  );
}
