import { BookOpen, ChevronRight, Landmark, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Costume } from "@/components/costume";
import { CityImageViewer } from "@/components/city-image-viewer";
import { DishesSection } from "@/components/dishes-section";
import { flagUrl, portraitUrl } from "@/data/catalog";
import { cityPhotos, type CityPhoto } from "@/data/city-photos";
import { hasDishes } from "@/data/dishes";
import { hasStory } from "@/data/stories";
import type { CitySpot, CountryProfile } from "@/data/types";
import { fill } from "@/i18n/content";
import { useI18n } from "@/i18n/use-i18n";
import { cn } from "@/lib/cn";

type Props = {
  country: CountryProfile | null;
  onPick: (iso: string) => void;
  onClear: () => void;
  onTale: (index: number) => void;
  featured: { iso: string; name: string }[];
};

function NumberedTable({
  rows,
  accent,
  onRow,
  actionLabel = "",
  actionClass = "bg-sun",
  ariaVerb = "",
}: {
  rows: { title: string; detail?: string; openable?: boolean }[];
  accent: string;
  onRow?: (index: number) => void;
  actionLabel?: string;
  actionClass?: string;
  ariaVerb?: string;
}) {
  return (
    <table className="w-full border-separate border-spacing-y-1.5">
      <tbody>
        {rows.map((row, i) => {
          const openable = Boolean(row.openable && onRow);
          const inner = (
            <>
              <td
                className={cn(
                  "w-10 text-center font-display text-lg font-bold text-ink",
                  "rounded-l-xl border-2 border-r-0 border-stroke",
                )}
                style={{ background: accent }}
              >
                {i + 1}
              </td>
              <td
                className={cn(
                  "rounded-r-xl border-2 border-stroke bg-cream px-3 py-2 text-sm font-bold leading-snug text-ink",
                  openable && "pr-2",
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span>
                    <span>{row.title}</span>
                    {row.detail ? (
                      <span className="mt-0.5 block text-xs font-semibold text-ink/70">
                        {row.detail}
                      </span>
                    ) : null}
                  </span>
                  {openable ? (
                    <span
                      className={cn(
                        "inline-flex shrink-0 items-center gap-1 rounded-full border-2 border-stroke px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-ink uppercase",
                        actionClass,
                      )}
                    >
                      {actionLabel}
                      <ChevronRight className="size-3" aria-hidden />
                    </span>
                  ) : null}
                </span>
              </td>
            </>
          );

          if (openable) {
            return (
              <tr key={`${row.title}-${i}`}>
                <td colSpan={2} className="p-0">
                  <button
                    type="button"
                    onClick={() => onRow?.(i)}
                    className="flex w-full border-separate text-left transition-transform duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.99]"
                    aria-label={`${ariaVerb} ${row.title}`}
                  >
                    <table className="w-full border-separate border-spacing-0">
                      <tbody>
                        <tr>{inner}</tr>
                      </tbody>
                    </table>
                  </button>
                </td>
              </tr>
            );
          }

          return <tr key={`${row.title}-${i}`}>{inner}</tr>;
        })}
      </tbody>
    </table>
  );
}

function cityRows(cities: CitySpot[]) {
  return cities.map((c) => ({ title: c.city, detail: c.spots }));
}

function CityPhotoRow({
  index,
  city,
  spots,
  photos,
  onOpenPhoto,
}: {
  index: number;
  city: string;
  spots: string;
  photos: CityPhoto[];
  onOpenPhoto: (photo: CityPhoto) => void;
}) {
  const { t } = useI18n();

  return (
    <li className="rounded-xl border-2 border-stroke bg-cream">
      <div className="flex gap-0">
        <span
          className="flex w-10 shrink-0 items-center justify-center rounded-l-[0.65rem] border-r-2 border-stroke font-display text-lg font-bold text-ink"
          style={{ background: "#4ade80" }}
          aria-hidden
        >
          {index + 1}
        </span>
        <div className="min-w-0 flex-1 px-3 py-2">
          <p className="text-sm font-bold text-ink">{city}</p>
          {spots ? <p className="mt-0.5 text-xs font-semibold text-ink/70">{spots}</p> : null}
          {photos.length ? (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {photos.slice(0, 2).map((photo) => (
                <figure
                  key={photo.src}
                  className={cn("min-w-0", photos.length === 1 && "col-span-2")}
                >
                  <button
                    type="button"
                    onClick={() => onOpenPhoto(photo)}
                    aria-label={fill(t.openPhoto, { title: photo.caption })}
                    className="block w-full overflow-hidden rounded-lg border-2 border-stroke bg-night focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-candy"
                  >
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className="aspect-[4/3] w-full object-cover"
                      style={
                        photo.objectPosition ? { objectPosition: photo.objectPosition } : undefined
                      }
                      loading="lazy"
                    />
                  </button>
                  <figcaption className="mt-1 text-[10px] leading-snug font-semibold text-ink/55">
                    <a
                      href={photo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-ink/20 underline-offset-2 hover:text-ink/80"
                    >
                      {photo.credit}
                    </a>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function CitiesSection({
  iso,
  cities,
  onOpenPhoto,
}: {
  iso: string;
  cities: CitySpot[];
  onOpenPhoto: (photo: CityPhoto) => void;
}) {
  const withPhotos = cities.map((c) => ({
    ...c,
    photos: cityPhotos(iso, c.city),
  }));
  const anyPhotos = withPhotos.some((c) => c.photos.length >= 1);

  if (!anyPhotos) {
    return <NumberedTable accent="#4ade80" rows={cityRows(cities)} />;
  }

  return (
    <ol className="flex list-none flex-col gap-2 p-0">
      {withPhotos.map((c, i) =>
        c.photos.length ? (
          <CityPhotoRow
            key={c.city}
            index={i}
            city={c.city}
            spots={c.spots}
            photos={c.photos}
            onOpenPhoto={onOpenPhoto}
          />
        ) : (
          <CityPhotoRow
            key={c.city}
            index={i}
            city={c.city}
            spots={c.spots}
            photos={[]}
            onOpenPhoto={onOpenPhoto}
          />
        ),
      )}
    </ol>
  );
}

export function CountryPanel({ country, onPick, onClear, onTale, featured }: Props) {
  const { t } = useI18n();
  const [portraitFailed, setPortraitFailed] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<CityPhoto | null>(null);
  const closePhoto = useCallback(() => setSelectedPhoto(null), []);

  useEffect(() => {
    setPortraitFailed(false);
  }, [country?.iso]);

  if (!country) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-5 py-8 text-center">
        <img
          src="/characters/mascot.jpg"
          alt={t.mascotAlt}
          className="mb-3 size-32 rounded-full border-4 border-stroke object-cover shadow-[5px_5px_0_#2b1b4e]"
        />
        <h2 className="font-display text-2xl font-bold text-ink">{t.welcomeTitle}</h2>
        <p className="mt-2 max-w-sm text-sm font-semibold leading-relaxed text-ink/75">
          {t.welcomeBody}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {featured.map((f) => (
            <button
              key={f.iso}
              type="button"
              onClick={() => onPick(f.iso)}
              className="rounded-full border-2 border-stroke bg-cream px-3 py-2 text-xs font-extrabold text-ink shadow-[3px_3px_0_#2b1b4e] transition-transform duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.96]"
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const portrait = portraitUrl(country.iso);
  const flag = flagUrl(country.iso);

  return (
    <div className="flex flex-col gap-4 px-4 py-4 pb-8">
      <header className="chunky-lg grid grid-cols-[112px_1fr] gap-3 rounded-[1.75rem] bg-cream p-3">
        {flag ? (
          <img
            src={flag}
            alt={fill(t.flagAlt, { name: country.name })}
            className="aspect-[3/2] w-full rounded-xl border-3 border-stroke object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex aspect-[3/2] items-center justify-center rounded-xl border-3 border-stroke bg-sky font-display text-2xl font-bold">
            {country.iso.toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-bold leading-tight text-ink">{country.name}</h2>
          <p className="mt-1 text-sm font-bold text-ink/80">
            {t.guide}: <span className="text-candy">{country.who}</span>
          </p>
          <p className="mt-0.5 text-xs font-semibold leading-snug text-ink/70">
            {t.outfit}: {country.outfit}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border-2 border-stroke bg-sun px-2.5 py-0.5 text-xs font-extrabold text-ink">
              {country.hello}
            </span>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 rounded-full border-2 border-stroke bg-cream px-2.5 py-1 text-xs font-extrabold text-ink shadow-[2px_2px_0_#2b1b4e] transition-transform duration-150 ease-out active:scale-[0.96]"
            >
              <RotateCcw className="size-3" aria-hidden />
              {t.otherCountry}
            </button>
          </div>
        </div>
      </header>

      <div className="flex justify-center">
        {portrait && !portraitFailed ? (
          <img
            key={country.iso}
            src={portrait}
            alt={fill(t.friendAlt, { who: country.who, name: country.name })}
            className="h-52 w-auto rounded-[1.6rem] border-4 border-stroke object-cover object-top shadow-[6px_6px_0_#2b1b4e]"
            onError={() => setPortraitFailed(true)}
          />
        ) : (
          <div className="h-52 w-44 drop-shadow-[5px_8px_0_rgba(43,27,78,.2)]">
            <Costume palette={country.palette} hat={country.hat} name={country.who} />
          </div>
        )}
      </div>

      <section>
        <h3 className="mb-2 flex items-center gap-2 font-display text-lg font-bold text-ink">
          <span className="inline-flex size-8 items-center justify-center rounded-xl border-2 border-stroke bg-sun">
            <BookOpen className="size-4" aria-hidden />
          </span>
          {t.talesTitle}
        </h3>
        <p className="mb-2 text-xs font-bold text-ink/60">{t.talesHint}</p>
        <NumberedTable
          accent="#ffd93d"
          actionLabel={t.read}
          ariaVerb={t.openTale}
          onRow={onTale}
          rows={country.tales.map((title, i) => ({
            title,
            openable: hasStory(country.iso, i),
          }))}
        />
      </section>

      {hasDishes(country.iso) ? <DishesSection iso={country.iso} /> : null}

      <section>
        <h3 className="mb-2 flex items-center gap-2 font-display text-lg font-bold text-ink">
          <span className="inline-flex size-8 items-center justify-center rounded-xl border-2 border-stroke bg-mint">
            <Landmark className="size-4" aria-hidden />
          </span>
          {t.citiesTitle}
        </h3>
        <CitiesSection iso={country.iso} cities={country.cities} onOpenPhoto={setSelectedPhoto} />
      </section>
      {selectedPhoto ? <CityImageViewer photo={selectedPhoto} onClose={closePhoto} /> : null}
    </div>
  );
}
