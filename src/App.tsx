import { useMemo, useState } from 'react';
import type { Filters, House } from './types';
import { ALL_STATUSES } from './lib/statusColors';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import housesData from './data/houses.json';

const houses = housesData as House[];

export default function App() {
  const [filters, setFilters] = useState<Filters>({
    statuses: new Set(ALL_STATUSES),
    minPrice: null,
    maxPrice: null,
  });
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const visibleHouses = useMemo(() => {
    return houses.filter((h) => {
      if (!filters.statuses.has(h.status)) return false;
      if (filters.minPrice !== null && h.price < filters.minPrice) return false;
      if (filters.maxPrice !== null && h.price > filters.maxPrice) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="flex h-full w-full">
      <Sidebar
        houses={visibleHouses}
        totalCount={houses.length}
        filters={filters}
        onFiltersChange={setFilters}
        onHouseClick={(id) => setFocusedId(id)}
        focusedId={focusedId}
      />
      <div className="w-[65%] h-full">
        <Map houses={visibleHouses} focusedId={focusedId} />
      </div>
    </div>
  );
}
