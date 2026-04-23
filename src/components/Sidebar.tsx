import type { Filters, House } from '../types';
import FilterBar from './FilterBar';
import HouseCard from './HouseCard';

interface SidebarProps {
  houses: House[];
  totalCount: number;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onHouseClick: (id: string) => void;
  focusedId: string | null;
}

export default function Sidebar({
  houses,
  totalCount,
  filters,
  onFiltersChange,
  onHouseClick,
  focusedId,
}: SidebarProps) {
  return (
    <aside className="w-[35%] h-full flex flex-col border-r border-gray-200 bg-gray-50">
      <header className="px-4 pt-4 pb-2 border-b border-gray-200 bg-white">
        <h1 className="text-lg font-semibold">House Hunters</h1>
        <FilterBar filters={filters} onChange={onFiltersChange} />
        <div className="mt-2 text-xs text-gray-600">
          Showing {houses.length} of {totalCount} houses
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {houses.length === 0 ? (
          <div className="text-sm text-gray-500 text-center mt-8">
            No houses match the current filters.
          </div>
        ) : (
          houses.map((house) => (
            <HouseCard
              key={house.id}
              house={house}
              isFocused={house.id === focusedId}
              onClick={() => onHouseClick(house.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
