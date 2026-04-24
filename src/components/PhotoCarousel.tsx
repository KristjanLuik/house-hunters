import { useState } from 'react';

interface PhotoCarouselProps {
  photos: string[];
  alt: string;
  className?: string;
}

export default function PhotoCarousel({
  photos,
  alt,
  className = '',
}: PhotoCarouselProps) {
  const [index, setIndex] = useState(0);
  if (!photos || photos.length === 0) return null;

  const current = photos[index];
  const count = photos.length;

  const go = (delta: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIndex((prev) => (prev + delta + count) % count);
  };

  return (
    <div className={`relative overflow-hidden bg-[#ddd0a8] ${className}`}>
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
            className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#f2ecd9]/90 border border-[#2a261c] text-[#2a261c] font-bold text-sm flex items-center justify-center hover:bg-[#ebe4bf]"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={go(1)}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#f2ecd9]/90 border border-[#2a261c] text-[#2a261c] font-bold text-sm flex items-center justify-center hover:bg-[#ebe4bf]"
          >
            ›
          </button>
          <span className="absolute bottom-1 right-1 font-pixel text-[8px] tracking-[1px] bg-[#2a261c] text-[#f2ecd9] px-1.5 py-0.5 tabular-nums">
            {String(index + 1).padStart(2, '0')}/{String(count).padStart(2, '0')}
          </span>
        </>
      )}
    </div>
  );
}
