import { useState } from 'react';

interface PhotoCarouselProps {
  photos: string[];
  alt: string;
  heightClass?: string;
  roundedClass?: string;
  /**
   * When true, clicks inside the carousel (on arrow buttons) don't bubble
   * to a parent click handler. Needed when the carousel lives inside a
   * clickable card.
   */
  stopPropagation?: boolean;
}

export default function PhotoCarousel({
  photos,
  alt,
  heightClass = 'h-40',
  roundedClass = 'rounded',
  stopPropagation = false,
}: PhotoCarouselProps) {
  const [index, setIndex] = useState(0);
  if (!photos || photos.length === 0) return null;

  const current = photos[index];
  const count = photos.length;

  const go = (delta: number) => (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    e.preventDefault();
    setIndex((prev) => (prev + delta + count) % count);
  };

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${roundedClass} ${heightClass}`}>
      <img
        src={current}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={go(-1)}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/50 text-white text-sm leading-none flex items-center justify-center hover:bg-black/70 transition"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={go(1)}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/50 text-white text-sm leading-none flex items-center justify-center hover:bg-black/70 transition"
          >
            ›
          </button>
          <span className="absolute bottom-1 right-1 text-[10px] font-medium bg-black/60 text-white px-1.5 py-0.5 rounded tabular-nums">
            {index + 1}/{count}
          </span>
        </>
      )}
    </div>
  );
}
