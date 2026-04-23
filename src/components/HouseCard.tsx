import type { House, Place, Route, TravelMode } from '../types';
import { STATUS_COLORS, STATUS_LABELS } from '../lib/statusColors';
import PhotoCarousel from './PhotoCarousel';
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

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

interface HouseCardProps {
  house: House;
  isFocused: boolean;
  onClick: () => void;
  routeMode: TravelMode;
}

const ENERGY_COLORS: Record<string, string> = {
  A: '#16a34a',
  B: '#65a30d',
  C: '#84cc16',
  D: '#eab308',
  E: '#f97316',
  F: '#ef4444',
  G: '#b91c1c',
  H: '#7f1d1d',
};

export default function HouseCard({ house, isFocused, onClick, routeMode }: HouseCardProps) {
  const photos = house.photos ?? [];
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
      className={`w-full text-left bg-white rounded-lg border shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
        isFocused ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}
    >
      <div className="flex gap-3 p-3">
        {photos.length > 0 && (
          <div className="w-20 h-20 shrink-0">
            <PhotoCarousel
              photos={photos}
              alt={house.nickname}
              heightClass="h-20"
              stopPropagation
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="font-semibold text-sm leading-tight truncate">
                {house.nickname}
              </div>
              <div className="text-xs text-gray-500 leading-snug truncate">
                {house.address}
              </div>
            </div>
            <span
              className="shrink-0 inline-flex items-center gap-1 text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: STATUS_COLORS[house.status] + '22',
                color: STATUS_COLORS[house.status],
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[house.status] }}
              />
              {STATUS_LABELS[house.status]}
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <div className="text-base font-bold">€{house.price.toLocaleString()}</div>
            <div className="text-[11px] text-gray-500">
              €{house.pricePerSqm.toLocaleString()}/m²
            </div>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-gray-600">
            <span>{house.rooms} rooms</span>
            <span>·</span>
            <span>{house.sqm} m²</span>
            <span>·</span>
            <span>
              floor {house.floor}/{house.totalFloors}
            </span>
            <span>·</span>
            <span>{house.yearBuilt}</span>
            <span
              className="ml-auto inline-flex items-center justify-center w-5 h-5 rounded text-white text-[10px] font-bold"
              style={{
                backgroundColor: house.energyClass
                  ? ENERGY_COLORS[house.energyClass] || '#6b7280'
                  : '#9ca3af',
              }}
              title={
                house.energyClass
                  ? `Energy class ${house.energyClass}`
                  : 'Energy class unknown'
              }
            >
              {house.energyClass ?? '🤷'}
            </span>
          </div>
        </div>
      </div>
      {house.notes && (
        <div className="px-3 pb-2 text-xs text-gray-700 line-clamp-2">
          {house.notes}
        </div>
      )}
      <div className="px-3 pb-3 space-y-0.5">
        {places.map((place) => {
          const drive = routes.find(
            (r) => r.houseId === house.id && r.placeId === place.id && r.mode === 'driving-car',
          );
          const walk = routes.find(
            (r) => r.houseId === house.id && r.placeId === place.id && r.mode === 'foot-walking',
          );
          const bike = routes.find(
            (r) => r.houseId === house.id && r.placeId === place.id && r.mode === 'cycling-regular',
          );
          if (!drive && !walk && !bike) return null;
          return (
            <div
              key={place.id}
              className="flex items-center gap-1.5 text-[11px] whitespace-nowrap"
              title={drive ? formatDistance(drive.distance_m) : ''}
            >
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: place.color }}
              />
              <span className="shrink-0" aria-label={place.name}>
                {place.emoji}
              </span>
              <span className="text-gray-700 truncate flex-1 min-w-0">
                {place.name}
              </span>
              <span className="text-gray-600 tabular-nums shrink-0">
                {drive && (
                  <span
                    className={
                      routeMode === 'driving-car'
                        ? 'font-semibold text-gray-900'
                        : ''
                    }
                  >
                    🚗{formatDuration(drive.duration_s)}
                  </span>
                )}
                {bike && (
                  <span
                    className={`ml-1 ${
                      routeMode === 'cycling-regular'
                        ? 'font-semibold text-gray-900'
                        : ''
                    }`}
                  >
                    🚲{formatDuration(bike.duration_s)}
                  </span>
                )}
                {walk && (
                  <span
                    className={`ml-1 ${
                      routeMode === 'foot-walking'
                        ? 'font-semibold text-gray-900'
                        : ''
                    }`}
                  >
                    🚶{formatDuration(walk.duration_s)}
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
