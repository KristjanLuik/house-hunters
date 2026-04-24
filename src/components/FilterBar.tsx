import type { Filters, HouseStatus } from '../types';
import { ALL_STATUSES, STATUS_SHORT } from '../lib/statusColors';

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const allActive = filters.statuses.size === ALL_STATUSES.length;

  const toggleStatus = (status: HouseStatus) => {
    const next = new Set(filters.statuses);
    if (next.has(status)) next.delete(status);
    else next.add(status);
    onChange({ ...filters, statuses: next });
  };

  const setAll = () => {
    onChange({ ...filters, statuses: new Set(ALL_STATUSES) });
  };

  const setPrice = (key: 'minPrice' | 'maxPrice', value: string) => {
    const parsed = value === '' ? null : Number(value);
    onChange({ ...filters, [key]: Number.isNaN(parsed) ? null : parsed });
  };

  const chipClass = (active: boolean) =>
    `font-pixel text-[9px] uppercase tracking-[1.5px] px-[10px] py-[4px] border cursor-pointer transition-colors ${
      active
        ? 'bg-[#2a261c] text-[#f2ecd9] border-[#2a261c]'
        : 'bg-transparent text-[#5a4f3a] border-[#c9b995] hover:bg-[#ebe4bf]'
    }`;

  return (
    <div className="flex items-center gap-1.5 px-4 lg:px-8 py-3 bg-[#eae2c4] border-b border-[#d6c99e] overflow-x-auto no-scrollbar">
      <button type="button" className={chipClass(allActive)} onClick={setAll}>
        ALL
      </button>
      {ALL_STATUSES.map((status) => (
        <button
          key={status}
          type="button"
          className={chipClass(!allActive && filters.statuses.has(status))}
          onClick={() => toggleStatus(status)}
        >
          {STATUS_SHORT[status]}
        </button>
      ))}
      <div className="flex-1 min-w-[8px]" />
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="font-pixel text-[9px] text-[#8a7858] tracking-[1px]">€</span>
        <input
          type="number"
          inputMode="numeric"
          placeholder="MIN"
          value={filters.minPrice ?? ''}
          onChange={(e) => setPrice('minPrice', e.target.value)}
          className="w-16 lg:w-20 font-pixel text-[9px] tracking-[1px] px-2 py-[4px] bg-transparent border border-[#c9b995] text-[#2a261c] placeholder-[#a89970] uppercase focus:outline-none focus:border-[#2a261c]"
        />
        <span className="font-pixel text-[9px] text-[#8a7858]">–</span>
        <input
          type="number"
          inputMode="numeric"
          placeholder="MAX"
          value={filters.maxPrice ?? ''}
          onChange={(e) => setPrice('maxPrice', e.target.value)}
          className="w-16 lg:w-20 font-pixel text-[9px] tracking-[1px] px-2 py-[4px] bg-transparent border border-[#c9b995] text-[#2a261c] placeholder-[#a89970] uppercase focus:outline-none focus:border-[#2a261c]"
        />
      </div>
    </div>
  );
}
