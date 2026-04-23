import { useEffect, useMemo, useRef } from 'react';
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import type { Marker as LeafletMarker } from 'leaflet';
import type { House, Place, Route, TravelMode } from '../types';
import { getMarkerIcon, getPlaceIcon } from '../lib/markerIcon';
import PhotoCarousel from './PhotoCarousel';
import placesData from '../data/places.json';
import routesData from '../data/routes.json';

const places = placesData as Place[];
const routes = routesData as Route[];
const placesById: Record<string, Place> = Object.fromEntries(
  places.map((p) => [p.id, p]),
);

interface MapProps {
  houses: House[];
  focusedId: string | null;
  routeMode: TravelMode;
}

const INITIAL_CENTER: [number, number] = [59.447, 24.729];
const INITIAL_ZOOM = 14;

function MapController({
  focusedId,
  markerRefs,
  houses,
}: {
  focusedId: string | null;
  markerRefs: React.MutableRefObject<Record<string, LeafletMarker>>;
  houses: House[];
}) {
  const map = useMap();

  useEffect(() => {
    if (!focusedId) return;
    const house = houses.find((h) => h.id === focusedId);
    if (!house) return;
    map.flyTo([house.lat, house.lng], 16, { duration: 0.8 });
    const marker = markerRefs.current[focusedId];
    if (marker) {
      // Wait for the flyTo to mostly finish before opening the popup so it's
      // anchored correctly.
      setTimeout(() => marker.openPopup(), 400);
    }
  }, [focusedId, houses, map, markerRefs]);

  return null;
}

export default function Map({ houses, focusedId, routeMode }: MapProps) {
  const markerRefs = useRef<Record<string, LeafletMarker>>({});

  const focusedRoutes = useMemo(
    () =>
      focusedId
        ? routes.filter((r) => r.houseId === focusedId && r.mode === routeMode)
        : [],
    [focusedId, routeMode],
  );

  return (
    <MapContainer
      center={INITIAL_CENTER}
      zoom={INITIAL_ZOOM}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={getPlaceIcon(place)}
        >
          <Popup>
            <div className="text-sm">
              <span className="mr-1">{place.emoji}</span>
              <span className="font-semibold">{place.name}</span>
            </div>
          </Popup>
        </Marker>
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
            pathOptions={{ color: place.color, weight: 4, opacity: 0.85 }}
          />
        );
      })}
      {houses.map((house) => (
        <Marker
          key={house.id}
          position={[house.lat, house.lng]}
          icon={getMarkerIcon(house.status)}
          ref={(instance) => {
            if (instance) {
              markerRefs.current[house.id] = instance;
            } else {
              delete markerRefs.current[house.id];
            }
          }}
        >
          <Popup>
            <div className="min-w-[220px]">
              <div className="font-semibold text-sm">{house.nickname}</div>
              <div className="text-xs text-gray-500">{house.address}</div>
              <div className="flex items-baseline gap-2 mt-1">
                <div className="text-base font-bold">
                  €{house.price.toLocaleString()}
                </div>
                <div className="text-[11px] text-gray-500">
                  €{house.pricePerSqm.toLocaleString()}/m²
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                {house.rooms} rooms · {house.sqm} m² · floor {house.floor}/
                {house.totalFloors} · {house.yearBuilt}
                {house.energyClass && ` · energy ${house.energyClass}`}
              </div>
              {house.photos && house.photos.length > 0 && (
                <div className="mt-2">
                  <PhotoCarousel
                    photos={house.photos}
                    alt={house.nickname}
                    heightClass="h-40"
                  />
                </div>
              )}
              <a
                href={house.listingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-blue-600 underline text-xs"
              >
                View listing →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
      <MapController focusedId={focusedId} markerRefs={markerRefs} houses={houses} />
    </MapContainer>
  );
}
