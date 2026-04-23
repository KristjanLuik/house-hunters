import type { Filters, House, TravelMode } from '../types';
import FilterBar from './FilterBar';
import HouseCard from './HouseCard';

interface SidebarProps {
  houses: House[];
  totalCount: number;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onHouseClick: (id: string) => void;
  focusedId: string | null;
  routeMode: TravelMode;
  onRouteModeChange: (mode: TravelMode) => void;
}

const MODE_OPTIONS: { mode: TravelMode; emoji: string; label: string }[] = [
  { mode: 'driving-car', emoji: '🚗', label: 'Drive' },
  { mode: 'cycling-regular', emoji: '🚲', label: 'Bike' },
  { mode: 'foot-walking', emoji: '🚶', label: 'Walk' },
];

export default function Sidebar({
  houses,
  totalCount,
  filters,
  onFiltersChange,
  onHouseClick,
  focusedId,
  routeMode,
  onRouteModeChange,
}: SidebarProps) {
  return (
    <aside className="w-[35%] h-full flex flex-col border-r border-gray-200 bg-gray-50">
      <header className="px-4 pt-4 pb-2 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg font-semibold">House Hunters</h1>
          <div className="inline-flex rounded border border-gray-300 overflow-hidden text-xs">
            {MODE_OPTIONS.map((opt) => (
              <button
                key={opt.mode}
                type="button"
                onClick={() => onRouteModeChange(opt.mode)}
                aria-pressed={routeMode === opt.mode}
                title={opt.label}
                className={`px-2 py-1 transition ${
                  routeMode === opt.mode
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {opt.emoji}
              </button>
            ))}
          </div>
        </div>
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
              routeMode={routeMode}
            />
          ))
        )}
      </div>
    </aside>
  );
}
