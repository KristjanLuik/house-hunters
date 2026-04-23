import type { Filters, HouseStatus } from '../types';
import { ALL_STATUSES, STATUS_COLORS, STATUS_LABELS } from '../lib/statusColors';

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const toggleStatus = (status: HouseStatus) => {
    const next = new Set(filters.statuses);
    if (next.has(status)) {
      next.delete(status);
    } else {
      next.add(status);
    }
    onChange({ ...filters, statuses: next });
  };

  const setPrice = (key: 'minPrice' | 'maxPrice', value: string) => {
    const parsed = value === '' ? null : Number(value);
    onChange({ ...filters, [key]: Number.isNaN(parsed) ? null : parsed });
  };

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {ALL_STATUSES.map((status) => {
          const checked = filters.statuses.has(status);
          return (
            <label
              key={status}
              className={`cursor-pointer inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded border transition ${
                checked
                  ? 'bg-white border-gray-300'
                  : 'bg-gray-100 border-gray-200 text-gray-400'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleStatus(status)}
                className="sr-only"
              />
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: checked ? STATUS_COLORS[status] : '#d1d5db',
                }}
              />
              {STATUS_LABELS[status]}
            </label>
          );
        })}
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-600">Price €</span>
        <input
          type="number"
          inputMode="numeric"
          placeholder="min"
          value={filters.minPrice ?? ''}
          onChange={(e) => setPrice('minPrice', e.target.value)}
          className="w-24 px-2 py-1 border border-gray-300 rounded"
        />
        <span className="text-gray-400">–</span>
        <input
          type="number"
          inputMode="numeric"
          placeholder="max"
          value={filters.maxPrice ?? ''}
          onChange={(e) => setPrice('maxPrice', e.target.value)}
          className="w-24 px-2 py-1 border border-gray-300 rounded"
        />
      </div>
    </div>
  );
}
