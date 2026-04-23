import type { HouseStatus } from '../types';

export const STATUS_COLORS: Record<HouseStatus, string> = {
  interested: '#3b82f6',
  'viewing-scheduled': '#eab308',
  visited: '#22c55e',
  'offer-made': '#a855f7',
  rejected: '#6b7280',
};

export const STATUS_LABELS: Record<HouseStatus, string> = {
  interested: 'Interested',
  'viewing-scheduled': 'Viewing scheduled',
  visited: 'Visited',
  'offer-made': 'Offer made',
  rejected: 'Rejected',
};

export const ALL_STATUSES: HouseStatus[] = [
  'interested',
  'viewing-scheduled',
  'visited',
  'offer-made',
  'rejected',
];
