import { useEffect, useMemo, useRef } from 'react';
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from 'react-leaflet';
import type { Marker as LeafletMarker } from 'leaflet';
import type { House, Place, Route, TravelMode } from '../types';
import { getMarkerIcon, getPlaceIcon } from '../lib/markerIcon';
import DetailCard from './DetailCard';
import placesData from '../data/places.json';
import routesData from '../data/routes.json';

const places = placesData as Place[];
const routes = routesData as Route[];
const placesById: Record<string, Place> = Object.fromEntries(
  places.map((p) => [p.id, p]),
);

interface MapProps {
  houses: House[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  routeMode: TravelMode;
  onRouteModeChange: (mode: TravelMode) => void;
}

const INITIAL_CENTER: [number, number] = [59.447, 24.729];
const INITIAL_ZOOM = 14;

const MODE_OPTIONS: { mode: TravelMode; label: string }[] = [
  { mode: 'driving-car', label: 'DRIVE' },
  { mode: 'cycling-regular', label: 'BIKE' },
  { mode: 'foot-walking', label: 'WALK' },
];

function MapController({
  selectedId,
  houses,
}: {
  selectedId: string | null;
  houses: House[];
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedId) return;
    const house = houses.find((h) => h.id === selectedId);
    if (!house) return;
    map.flyTo([house.lat, house.lng], 16, { duration: 0.8 });
  }, [selectedId, houses, map]);

  return null;
}

export default function Map({
  houses,
  selectedId,
  onSelect,
  routeMode,
  onRouteModeChange,
}: MapProps) {
  const markerRefs = useRef<Record<string, LeafletMarker>>({});

  const focusedRoutes = useMemo(
    () =>
      selectedId
        ? routes.filter((r) => r.houseId === selectedId && r.mode === routeMode)
        : [],
    [selectedId, routeMode],
  );

  const selected = selectedId ? houses.find((h) => h.id === selectedId) : null;

  return (
    <div className="relative h-full w-full bg-[#f1ebdb]">
      <MapContainer
        center={INITIAL_CENTER}
        zoom={INITIAL_ZOOM}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={getPlaceIcon(place)}
          />
        ))}
        {focusedRoutes.map((route) => {
          const place = placesById[route.placeId];
          if (!place) return null;
          const positions: [number, number][] = route.geometry.coordinates.map(
            ([lng, lat]) => [lat, lng],
          );
          return (
            <Polyline
              key={`${route.houseId}-${route.placeId}-${route.mode}`}
              positions={positions}
              pathOptions={{
                color: place.color,
                weight: 4,
                opacity: 0.85,
                dashArray: '6 6',
              }}
            />
          );
        })}
        {houses.map((house) => (
          <Marker
            key={house.id}
            position={[house.lat, house.lng]}
            icon={getMarkerIcon(house.status)}
            eventHandlers={{
              click: () => onSelect(house.id),
            }}
            ref={(instance) => {
              if (instance) {
                markerRefs.current[house.id] = instance;
              } else {
                delete markerRefs.current[house.id];
              }
            }}
          />
        ))}
        <MapController selectedId={selectedId} houses={houses} />
      </MapContainer>

      <div
        className="absolute flex flex-col items-end gap-[6px]"
        style={{ top: 18, right: 18, zIndex: 1000 }}
      >
        <div className="flex">
          {MODE_OPTIONS.map((opt) => (
            <button
              key={opt.mode}
              type="button"
              onClick={() => onRouteModeChange(opt.mode)}
              aria-pressed={routeMode === opt.mode}
              className={`font-pixel text-[9px] tracking-[1.2px] uppercase px-3 py-[7px] border border-[#2a261c] -ml-px first:ml-0 cursor-pointer ${
                routeMode === opt.mode
                  ? 'bg-[#2a261c] text-[#f2ecd9]'
                  : 'bg-[#f2ecd9]/90 text-[#2a261c] hover:bg-[#ebe4bf]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <DetailCard
          house={selected}
          routeMode={routeMode}
          places={places}
          routes={routes}
          onClose={() => onSelect(null)}
        />
      )}
    </div>
  );
}
