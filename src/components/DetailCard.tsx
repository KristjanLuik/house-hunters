import { useCallback, useRef, useState } from 'react';
import type { House, Place, Route, TravelMode } from '../types';
import { STATUS_SHORT } from '../lib/statusColors';
import { fmtPrice, fmtPerSqm, fmtSqm } from '../lib/format';
import PhotoCarousel from './PhotoCarousel';

interface DetailCardProps {
  house: House;
  routeMode: TravelMode;
  places: Place[];
  routes: Route[];
  onClose: () => void;
}

const MODE_LABEL: Record<TravelMode, string> = {
  'driving-car': 'driving',
  'cycling-regular': 'biking',
  'foot-walking': 'walking',
};

const DEFAULT_SHEET_HEIGHT_VH = 55;
const MIN_SHEET_HEIGHT_PX = 180;

function formatDuration(seconds: number): string {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h ${rem}min` : `${h}h`;
}

export default function DetailCard({
  house,
  routeMode,
  places,
  routes,
  onClose,
}: DetailCardProps) {
  const photos = house.photos ?? [];
  const commuteRoutes = places
    .map((place) => {
      const r = routes.find(
        (rt) =>
          rt.houseId === house.id &&
          rt.placeId === place.id &&
          rt.mode === routeMode,
      );
      return r ? { place, route: r } : null;
    })
    .filter((x): x is { place: Place; route: Route } => x !== null)
    .slice(0, 3);

  const [sheetHeight, setSheetHeight] = useState<number | null>(null);
  const dragState = useRef<{ startY: number; startH: number } | null>(null);

  const onHandlePointerDown = useCallback((e: React.PointerEvent) => {
    const viewportH = window.innerHeight;
    const startH =
      sheetHeight ?? Math.round((viewportH * DEFAULT_SHEET_HEIGHT_VH) / 100);
    dragState.current = { startY: e.clientY, startH };
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {
      // Pointer capture isn't available on all pointer sources — safe to skip.
    }
  }, [sheetHeight]);

  const onHandlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragState.current) return;
    const delta = dragState.current.startY - e.clientY;
    const maxH = Math.round(window.innerHeight * 0.92);
    const nextH = Math.min(
      maxH,
      Math.max(MIN_SHEET_HEIGHT_PX, dragState.current.startH + delta),
    );
    setSheetHeight(nextH);
  }, []);

  const onHandlePointerUp = useCallback((e: React.PointerEvent) => {
    dragState.current = null;
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {
      // Capture may already be lost — safe to ignore.
    }
  }, []);

  const sheetHeightVar = sheetHeight != null
    ? `${sheetHeight}px`
    : `${DEFAULT_SHEET_HEIGHT_VH}vh`;

  return (
    <div
      className="fixed left-0 right-0 bottom-0 h-[var(--sheet-h)] flex flex-col overflow-hidden bg-[#f2ecd9] border-t border-[#2a261c] text-[#2a261c] shadow-[0_-8px_24px_rgba(42,38,28,0.15)]
        lg:absolute lg:left-1/2 lg:right-auto lg:bottom-5 lg:top-auto lg:-translate-x-1/2 lg:w-[calc(100%-40px)] lg:max-w-[960px] lg:h-auto lg:border lg:shadow-[6px_6px_0_rgba(42,38,28,0.15)]"
      style={{
        ['--sheet-h' as string]: sheetHeightVar,
        zIndex: 1000,
      }}
    >
      {/* Drag handle — mobile only. Grabs pointer to resize sheet. */}
      <div
        className="lg:hidden flex items-center justify-center py-2 cursor-row-resize shrink-0"
        style={{ touchAction: 'none' }}
        onPointerDown={onHandlePointerDown}
        onPointerMove={onHandlePointerMove}
        onPointerUp={onHandlePointerUp}
        onPointerCancel={onHandlePointerUp}
        aria-label="Resize detail sheet"
      >
        <div className="w-10 h-1 bg-[#c9b995]" />
      </div>

      {/* Mobile top bar: status badge + close */}
      <div className="lg:hidden flex justify-between items-center gap-3 px-4 pb-2 shrink-0">
        <div className="inline-block bg-[#2a261c] text-[#f2ecd9] font-pixel text-[9px] tracking-[1px] px-2 py-[3px]">
          {STATUS_SHORT[house.status]}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center border border-[#8a7858] text-[#5a4f3a] font-pixel text-[11px]"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div
        className="flex-1 overflow-y-auto lg:overflow-visible lg:flex-none lg:grid"
        style={{
          // Desktop: 3-column grid for thumb / content / price.
          // Mobile: single flowing column.
        }}
      >
        <div className="lg:grid lg:gap-6 lg:p-6" style={{ gridTemplateColumns: 'minmax(220px, 320px) minmax(0, 1fr) minmax(170px, auto)' }}>
          {/* Photo area: reel on mobile, carousel on desktop. */}
          {photos.length > 0 && (
            <>
              <div className="lg:hidden flex gap-1.5 overflow-x-auto px-4 pb-3 no-scrollbar shrink-0">
                {photos.map((src, i) => (
                  <img
                    key={`${src}-${i}`}
                    src={src}
                    alt=""
                    loading="lazy"
                    className="h-[180px] w-[260px] object-cover flex-shrink-0 bg-[#ddd0a8]"
                  />
                ))}
              </div>
              <div className="hidden lg:block">
                <PhotoCarousel
                  photos={photos}
                  alt={house.nickname}
                  className="w-full h-[180px]"
                />
              </div>
            </>
          )}

          {/* Content column */}
          <div className="min-w-0 px-4 lg:px-0 pb-3 lg:pb-0">
            <div className="hidden lg:inline-block bg-[#2a261c] text-[#f2ecd9] font-pixel text-[9px] tracking-[1px] px-2 py-[3px] mb-2">
              {STATUS_SHORT[house.status]}
            </div>
            <div
              className="font-[600] leading-[1.05] mb-1 text-[26px] lg:text-[32px]"
              style={{ letterSpacing: '-1px' }}
            >
              {house.nickname}
            </div>
            <div className="text-[12px] text-[#7a6d52] mb-[14px] truncate">
              {house.address}
            </div>

            {/* Mobile price + primary commute block */}
            <div className="lg:hidden flex items-baseline justify-between gap-2 py-2 border-t border-b border-[#d6c99e] mb-3">
              <div>
                <div
                  className="font-[600] leading-none tabular-nums text-[24px]"
                  style={{ letterSpacing: '-0.8px' }}
                >
                  {fmtPrice(house.price)}
                </div>
                <div className="font-pixel text-[8px] text-[#8a7858] tracking-[1px] mt-1">
                  {fmtPerSqm(house.pricePerSqm)}
                </div>
              </div>
              {commuteRoutes[0] && (
                <div className="text-right">
                  <div className="font-pixel text-[8px] text-[#8a7858] tracking-[1.2px]">
                    {MODE_LABEL[routeMode].toUpperCase()}
                  </div>
                  <div className="text-[15px] font-[600] tabular-nums">
                    {formatDuration(commuteRoutes[0].route.duration_s)} ·{' '}
                    {commuteRoutes[0].place.name}
                  </div>
                </div>
              )}
            </div>

            {house.notes && (
              <div
                className="text-[13px] leading-[1.55] text-[#3d3528] pl-3 italic"
                style={{
                  borderLeft: '3px solid #b8894a',
                  maxWidth: 460,
                }}
              >
                "{house.notes}"
              </div>
            )}

            {/* Mobile: full commute list if we have >1 destination */}
            {commuteRoutes.length > 1 && (
              <div className="lg:hidden mt-3">
                <div className="font-pixel text-[8px] text-[#8a7858] tracking-[1.2px] mb-1">
                  {MODE_LABEL[routeMode].toUpperCase()}
                </div>
                <div className="flex flex-col gap-0.5 text-[12px] font-[500] tabular-nums">
                  {commuteRoutes.map(({ place, route }) => (
                    <div key={place.id} className="flex items-center gap-1.5">
                      <span
                        className="inline-block w-[8px] h-[8px] shrink-0"
                        style={{ background: place.color }}
                      />
                      <span>{formatDuration(route.duration_s)}</span>
                      <span className="text-[#8a7858] text-[11px]">
                        {place.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile actions */}
            <div className="lg:hidden flex gap-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 font-pixel text-[10px] tracking-[1.3px] uppercase border border-[#2a261c] px-3 py-3 bg-transparent cursor-pointer"
              >
                Close
              </button>
              <a
                href={house.listingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 font-pixel text-[10px] tracking-[1.3px] uppercase bg-[#2a261c] text-[#f2ecd9] px-3 py-3 cursor-pointer no-underline text-center"
              >
                Open ↗
              </a>
            </div>
          </div>

          {/* Desktop price + actions column */}
          <div className="hidden lg:flex flex-col items-end justify-between">
            <div>
              <div
                className="font-[600] text-right leading-none tabular-nums"
                style={{ fontSize: 36, letterSpacing: '-1px' }}
              >
                {fmtPrice(house.price)}
              </div>
              <div className="font-pixel text-[10px] text-[#8a7858] tracking-[1px] mt-2 text-right">
                {fmtPerSqm(house.pricePerSqm)}
              </div>
              <div className="font-pixel text-[9px] text-[#8a7858] tracking-[1px] mt-3 text-right whitespace-nowrap">
                {house.sqm && `${fmtSqm(house.sqm)} · `}
                {house.rooms} RM · FL {house.floor}/{house.totalFloors}
              </div>
              {commuteRoutes.length > 0 && (
                <div className="mt-3 text-right">
                  <div className="font-pixel text-[8px] text-[#8a7858] tracking-[1.2px] mb-1">
                    {MODE_LABEL[routeMode].toUpperCase()}
                  </div>
                  <div className="flex flex-col gap-0.5 items-end text-[13px] font-[500] tabular-nums">
                    {commuteRoutes.map(({ place, route }) => (
                      <div key={place.id} className="flex items-center gap-1.5">
                        <span
                          className="inline-block w-[8px] h-[8px]"
                          style={{ background: place.color }}
                        />
                        <span>{formatDuration(route.duration_s)}</span>
                        <span className="text-[#8a7858] text-[11px]">
                          {place.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="font-pixel text-[9px] tracking-[1.2px] uppercase border border-[#2a261c] px-3 py-2 bg-transparent cursor-pointer hover:bg-[#ebe4bf]"
              >
                Close
              </button>
              <a
                href={house.listingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-pixel text-[9px] tracking-[1.2px] uppercase bg-[#2a261c] text-[#f2ecd9] px-3 py-2 cursor-pointer no-underline"
              >
                Open ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
