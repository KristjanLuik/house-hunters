import L from 'leaflet';
import { STATUS_COLORS } from './statusColors';
import type { HouseStatus, Place } from '../types';

const iconCache = new Map<HouseStatus, L.DivIcon>();

export function getMarkerIcon(status: HouseStatus): L.DivIcon {
  const cached = iconCache.get(status);
  if (cached) return cached;

  const color = STATUS_COLORS[status];
  const html = `<span style="
    display:block;
    width:20px;
    height:20px;
    border-radius:9999px;
    background:${color};
    border:2px solid white;
    box-shadow:0 1px 4px rgba(0,0,0,0.4);
  "></span>`;

  const icon = L.divIcon({
    html,
    className: 'house-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12],
  });
  iconCache.set(status, icon);
  return icon;
}

const placeIconCache = new Map<string, L.DivIcon>();

export function getPlaceIcon(place: Place): L.DivIcon {
  const cached = placeIconCache.get(place.id);
  if (cached) return cached;

  const html = `<span style="
    display:flex;
    align-items:center;
    justify-content:center;
    width:28px;
    height:28px;
    border-radius:9999px;
    background:${place.color};
    border:2px solid white;
    box-shadow:0 1px 4px rgba(0,0,0,0.4);
    font-size:14px;
    line-height:1;
  ">${place.emoji}</span>`;

  const icon = L.divIcon({
    html,
    className: 'place-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
  placeIconCache.set(place.id, icon);
  return icon;
}
