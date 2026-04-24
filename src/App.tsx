import { useMemo, useState } from 'react';
import type { Filters, House, TravelMode } from './types';
import { ALL_STATUSES } from './lib/statusColors';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import HouseList from './components/HouseList';
import housesData from './data/houses.json';

const houses = housesData as House[];
const MAX_COMPARE = 3;

export default function App() {
  const [filters, setFilters] = useState<Filters>({
    statuses: new Set(ALL_STATUSES),
    minPrice: null,
    maxPrice: null,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [routeMode, setRouteMode] = useState<TravelMode>('cycling-regular');
  const [compareSet, setCompareSet] = useState<Set<string>>(new Set());

  const visibleHouses = useMemo(() => {
    return houses.filter((h) => {
      if (!filters.statuses.has(h.status)) return false;
      if (filters.minPrice !== null && h.price < filters.minPrice) return false;
      if (filters.maxPrice !== null && h.price > filters.maxPrice) return false;
      return true;
    });
  }, [filters]);

  const toggleCompare = (id: string) => {
    setCompareSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < MAX_COMPARE) next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-[#f2ecd9] overflow-hidden">
      <Sidebar
        houses={visibleHouses}
        totalCount={houses.length}
        filters={filters}
        onFiltersChange={setFilters}
        onHouseClick={setSelectedId}
        selectedId={selectedId}
        routeMode={routeMode}
        compareSet={compareSet}
        onToggleCompare={toggleCompare}
      />

      <div className="h-[280px] sm:h-[340px] lg:h-full lg:flex-1 relative flex-shrink-0">
        <Map
          houses={visibleHouses}
          selectedId={selectedId}
          onSelect={setSelectedId}
          routeMode={routeMode}
          onRouteModeChange={setRouteMode}
        />
      </div>

      <HouseList
        houses={visibleHouses}
        selectedId={selectedId}
        onHouseClick={setSelectedId}
        routeMode={routeMode}
        compareSet={compareSet}
        onToggleCompare={toggleCompare}
        className="flex-1 overflow-y-auto lg:hidden bg-[#f2ecd9]"
      />
    </div>
  );
}
