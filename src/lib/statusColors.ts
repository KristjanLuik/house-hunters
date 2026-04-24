import type { HouseStatus } from '../types';

export const STATUS_COLORS: Record<HouseStatus, string> = {
  interested: '#7a7266',
  'viewing-scheduled': '#b8894a',
  visited: '#4a6b52',
  'offer-made': '#2a261c',
  rejected: '#a89970',
};

export const STATUS_LABELS: Record<HouseStatus, string> = {
  interested: 'Interested',
  'viewing-scheduled': 'Viewing scheduled',
  visited: 'Visited',
  'offer-made': 'Offer made',
  rejected: 'Rejected',
};

export const STATUS_SHORT: Record<HouseStatus, string> = {
  interested: 'TRACK',
  'viewing-scheduled': 'VISIT',
  visited: 'SEEN',
  'offer-made': 'OFFER',
  rejected: 'NOPE',
};

export const ALL_STATUSES: HouseStatus[] = [
  'interested',
  'viewing-scheduled',
  'visited',
  'offer-made',
  'rejected',
];
