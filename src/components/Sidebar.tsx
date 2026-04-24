import type { Filters, House, TravelMode } from '../types';
import FilterBar from './FilterBar';
import HouseList from './HouseList';

interface SidebarProps {
  houses: House[];
  totalCount: number;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onHouseClick: (id: string) => void;
  selectedId: string | null;
  routeMode: TravelMode;
  compareSet: Set<string>;
  onToggleCompare: (id: string) => void;
}

export default function Sidebar({
  houses,
  totalCount,
  filters,
  onFiltersChange,
  onHouseClick,
  selectedId,
  routeMode,
  compareSet,
  onToggleCompare,
}: SidebarProps) {
  return (
    <aside className="flex flex-col bg-[#f2ecd9] overflow-hidden lg:w-[520px] lg:h-full lg:border-r lg:border-[#d6c99e] flex-shrink-0">
      <header className="px-4 lg:px-8 pt-4 lg:pt-7 pb-3 lg:pb-[18px] border-b border-[#d6c99e]">
        <div className="flex items-baseline justify-between mb-3 lg:mb-5 gap-2">
          <div
            className="font-[600] leading-none"
            style={{ letterSpacing: '-0.8px' }}
          >
            <span className="text-[19px] lg:text-[24px]">House Hunter</span>
            <span
              className="font-pixel text-[10px] lg:text-[12px] text-[#b8894a] ml-2 tracking-[1px]"
              style={{ verticalAlign: 2 }}
            >
              BETA
            </span>
          </div>
          <div className="font-pixel text-[8px] lg:text-[9px] text-[#8a7858] tracking-[1.3px] lg:tracking-[1.5px] whitespace-nowrap">
            {String(houses.length).padStart(2, '0')}/
            {String(totalCount).padStart(2, '0')} · TALLINN
          </div>
        </div>
        <div className="flex gap-4 lg:gap-6 overflow-x-auto no-scrollbar">
          {[
            { label: 'Listings', active: true },
            { label: 'Compare', active: false },
            { label: 'Notes', active: false },
            { label: 'Calendar', active: false },
          ].map((tab) => (
            <div
              key={tab.label}
              className={`text-[12px] lg:text-[13px] py-[3px] cursor-pointer whitespace-nowrap ${
                tab.active
                  ? 'font-[600] text-[#2a261c] border-b-2 border-[#2a261c]'
                  : 'font-[500] text-[#8a7858] border-b-2 border-transparent'
              }`}
              style={{ letterSpacing: '-0.1px' }}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </header>

      <FilterBar filters={filters} onChange={onFiltersChange} />

      <HouseList
        houses={houses}
        selectedId={selectedId}
        onHouseClick={onHouseClick}
        routeMode={routeMode}
        compareSet={compareSet}
        onToggleCompare={onToggleCompare}
        className="hidden lg:block lg:flex-1 lg:overflow-y-auto"
      />
    </aside>
  );
}
