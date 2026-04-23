export type HouseStatus =
  | 'interested'
  | 'viewing-scheduled'
  | 'visited'
  | 'offer-made'
  | 'rejected';

export type EnergyClass = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';

export type TravelMode = 'driving-car' | 'foot-walking' | 'cycling-regular';

export interface Place {
  id: string;
  name: string;
  category: 'work' | 'kindergarten' | 'other';
  emoji: string;
  color: string;
  lat: number;
  lng: number;
}

export interface Route {
  houseId: string;
  placeId: string;
  mode: TravelMode;
  distance_m: number;
  duration_s: number;
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
  // Coordinate fingerprint written by scripts/fetch-routes.mjs. Used only by
  // that script to skip re-fetching when endpoints haven't moved.
  houseLat?: number;
  houseLng?: number;
  placeLat?: number;
  placeLng?: number;
}

export interface House {
  id: string;
  nickname: string;
  address: string;
  lat: number;
  lng: number;
  price: number;
  pricePerSqm: number;
  sqm: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  totalFloors: number;
  yearBuilt: number;
  energyClass: EnergyClass | null;
  status: HouseStatus;
  notes: string;
  listingUrl: string;
  photos?: string[];
}

export interface Filters {
  statuses: Set<HouseStatus>;
  minPrice: number | null;
  maxPrice: number | null;
}
