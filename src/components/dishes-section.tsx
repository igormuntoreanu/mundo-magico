import { UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { DishPhotoViewer } from "@/components/dish-photo-viewer";
import { dishesFor, type Dish } from "@/data/dishes";
import { fill } from "@/i18n/content";
import { useI18n } from "@/i18n/use-i18n";

type Props = {
  iso: string;
};

export function DishesSection({ iso }: Props) {
  const { locale, t } = useI18n();
  const [openDish, setOpenDish] = useState<Dish | null>(null);
  const dishes = dishesFor(iso);

  if (!dishes.length) return null;

  return (
    <section>
      <h3 className="mb-2 flex items-center gap-2 font-display text-lg font-bold text-ink">
        <span className="inline-flex size-8 items-center justify-center rounded-xl border-2 border-stroke bg-orange">
          <UtensilsCrossed className="size-4" aria-hidden />
        </span>
        {t.dishesTitle}
      </h3>
      <p className="mb-2 text-xs font-bold text-ink/60">{t.dishesHint}</p>

      <ol className="flex list-none flex-col gap-3 p-0">
        {dishes.map((dish, index) => {
          const photo = dish.photos[0];
          const name = dish.name[locale];
          return (
            <li
              key={dish.slug}
              className="overflow-hidden rounded-xl border-2 border-stroke bg-cream"
            >
              <div className="relative">
                {photo ? (
                  <button
                    type="button"
                    onClick={() => setOpenDish(dish)}
                    aria-label={fill(t.openDishPhoto, { dish: name })}
                    className="block w-full focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-candy"
                  >
                    <img
                      src={photo.src}
                      alt={fill(t.dishPhotoAlt, { dish: name })}
                      className="aspect-[4/3] w-full object-cover"
                      style={
                        photo.objectPosition ? { objectPosition: photo.objectPosition } : undefined
                      }
                      loading="lazy"
                    />
                  </button>
                ) : null}
                <span
                  className="absolute top-2 left-2 inline-flex size-8 items-center justify-center rounded-lg border-2 border-stroke bg-orange font-display text-base font-bold text-ink shadow-[2px_2px_0_#2b1b4e]"
                  aria-hidden
                >
                  {index + 1}
                </span>
              </div>

              <div className="px-3 py-2">
                <p className="font-display text-lg leading-tight font-bold text-ink">{name}</p>
                <p className="mt-1 text-xs leading-snug font-semibold text-ink/75">
                  {dish.note[locale]}
                </p>
                {photo ? (
                  <p className="mt-1.5 text-[10px] leading-snug font-semibold text-ink/55">
                    <a
                      href={photo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-ink/20 underline-offset-2 hover:text-ink/80"
                    >
                      {photo.credit}
                    </a>
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      {openDish?.photos[0] ? (
        <DishPhotoViewer
          title={openDish.name[locale]}
          photo={openDish.photos[0]}
          onClose={() => setOpenDish(null)}
        />
      ) : null}
    </section>
  );
}
