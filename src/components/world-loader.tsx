import { useI18n } from "@/i18n/use-i18n";

/** The volcano loader, shared by both world views and the mode resolution gap. */
export function WorldLoader() {
  const { t } = useI18n();
  return (
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
          {t.loading}
        </p>
      </div>
    </div>
  );
}
