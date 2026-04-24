import type { House, Place, Route, TravelMode } from '../types';
import { STATUS_COLORS, STATUS_SHORT } from '../lib/statusColors';
import { fmtPrice, fmtPerSqm, fmtSqm } from '../lib/format';
import placesData from '../data/places.json';
import routesData from '../data/routes.json';

const places = placesData as Place[];
const routes = routesData as Route[];

function formatDuration(seconds: number): string {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h${rem}` : `${h}h`;
}

const ENERGY_COLORS: Record<string, string> = {
  A: '#4a6b52',
  B: '#4a6b52',
  C: '#6a7d52',
  D: '#b8894a',
  E: '#b8894a',
  F: '#a05a3a',
  G: '#a05a3a',
  H: '#7a3528',
};

interface HouseCardProps {
  house: House;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  routeMode: TravelMode;
  isComparing: boolean;
  onToggleCompare: () => void;
}

export default function HouseCard({
  house,
  index,
  isSelected,
  onClick,
  routeMode,
  isComparing,
  onToggleCompare,
}: HouseCardProps) {
  const photo = house.photos?.[0];
  const modeRoute = places
    .map((place) => {
      const r = routes.find(
        (rt) =>
          rt.houseId === house.id &&
          rt.placeId === place.id &&
          rt.mode === routeMode,
      );
      return r ? { place, route: r } : null;
    })
    .filter((x): x is { place: Place; route: Route } => x !== null);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative grid gap-3 lg:gap-[18px] px-4 lg:px-8 py-[14px] lg:py-[18px] border-b border-[#e3d7ab] cursor-pointer focus:outline-none ${
        isSelected ? 'bg-[#e6dcab]' : 'hover:bg-[#ebe4bf]'
      }`}
      style={{ gridTemplateColumns: '76px minmax(0, 1fr) auto' }}
    >
      <div className="absolute left-[6px] lg:left-[10px] top-[14px] lg:top-[18px] font-pixel text-[8px] text-[#a89970] tracking-[0.5px]">
        {String(index + 1).padStart(2, '0')}
      </div>

      {photo ? (
        <img
          src={photo}
          alt=""
          className="w-[76px] h-[76px] lg:w-[88px] lg:h-[88px] object-cover bg-[#ddd0a8]"
        />
      ) : (
        <div className="w-[76px] h-[76px] lg:w-[88px] lg:h-[88px] bg-[#ddd0a8]" />
      )}

      <div className="flex flex-col justify-between min-w-0">
        <div className="min-w-0">
          <div
            className="font-[500] leading-[1.1] mb-[2px] truncate text-[17px] lg:text-[20px]"
            style={{ letterSpacing: '-0.4px' }}
          >
            {house.nickname}
          </div>
          <div className="text-[11px] lg:text-[12px] text-[#7a6d52] truncate mb-[8px] lg:mb-[10px]">
            {house.address}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[11.5px] font-[500] text-[#5a4f3a] tabular-nums">
          <span>{house.rooms} rm</span>
          <span className="text-[#c9b995]">·</span>
          <span>{fmtSqm(house.sqm)}</span>
          <span className="text-[#c9b995]">·</span>
          <span>{house.yearBuilt}</span>
          {house.energyClass && (
            <>
              <span className="text-[#c9b995]">·</span>
              <span
                style={{ color: ENERGY_COLORS[house.energyClass] ?? '#5a4f3a' }}
                className="font-[600]"
              >
                {house.energyClass}
              </span>
            </>
          )}
          {modeRoute.length > 0 && (
            <>
              <span className="text-[#c9b995]">·</span>
              <span className="flex items-center gap-1.5">
                {modeRoute.map(({ place, route }) => (
                  <span
                    key={place.id}
                    className="inline-flex items-center gap-0.5"
                    title={`${place.name} · ${route.duration_s}s`}
                  >
                    <span
                      className="inline-block w-[6px] h-[6px]"
                      style={{ background: place.color }}
                    />
                    {formatDuration(route.duration_s)}
                  </span>
                ))}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <div>
          <div
            className="font-[600] text-right tabular-nums text-[18px] lg:text-[22px]"
            style={{ letterSpacing: '-0.6px', lineHeight: 1 }}
          >
            {fmtPrice(house.price)}
          </div>
          <div className="font-pixel text-[9px] text-[#8a7858] tracking-[1px] mt-[6px] text-right">
            {fmtPerSqm(house.pricePerSqm)}
          </div>
        </div>
        <div className="flex items-center gap-[10px]">
          <div
            className="inline-flex items-center gap-[5px] font-pixel text-[8px] uppercase tracking-[1.3px] px-[7px] py-[3px] bg-white/30 text-[#3d3528]"
            style={{ border: '1px solid #c9b995' }}
          >
            <span
              className="inline-block w-[6px] h-[6px]"
              style={{ background: STATUS_COLORS[house.status] }}
            />
            {STATUS_SHORT[house.status]}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare();
            }}
            aria-pressed={isComparing}
            className={`w-[20px] h-[20px] flex items-center justify-center text-[12px] font-bold ${
              isComparing
                ? 'bg-[#2a261c] text-[#f2ecd9] border-0'
                : 'bg-transparent text-[#8a7858] border border-[#8a7858]'
            }`}
          >
            {isComparing ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  );
}
