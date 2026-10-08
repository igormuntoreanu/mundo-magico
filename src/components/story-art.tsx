import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  scene: string;
  className?: string;
  alt?: string;
};

/** Only the picture made for this page. A missing file must not reuse another page. */
function sources(scene: string): string[] {
  return [`/stories/pages/${scene}.jpg?v=4`];
}

export function StoryArt({ scene, className, alt = "" }: Props) {
  const [index, setIndex] = useState(0);
  const chain = sources(scene);
  const src = chain[Math.min(index, chain.length - 1)] ?? chain[0];
  const missing = index > 0;

  useEffect(() => {
    setIndex(0);
  }, [scene]);

  if (missing) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-sky px-6 text-center",
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <p className="max-w-xs font-display text-lg font-bold text-ink">
          Esta página ainda não tem a sua ilustração.
        </p>
      </div>
    );
  }

  return (
    <img
      key={`${scene}-${src}`}
      src={src}
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
      draggable={false}
      onError={() => setIndex(1)}
    />
  );
}