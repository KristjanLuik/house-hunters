import type { House, TravelMode } from '../types';
import HouseCard from './HouseCard';

interface HouseListProps {
  houses: House[];
  selectedId: string | null;
  onHouseClick: (id: string) => void;
  routeMode: TravelMode;
  compareSet: Set<string>;
  onToggleCompare: (id: string) => void;
  className?: string;
}

export default function HouseList({
  houses,
  selectedId,
  onHouseClick,
  routeMode,
  compareSet,
  onToggleCompare,
  className = '',
}: HouseListProps) {
  if (houses.length === 0) {
    return (
      <div className={`font-pixel text-[10px] text-[#8a7858] tracking-[1.5px] text-center mt-16 ${className}`}>
        NO LISTINGS · TRY ANOTHER FILTER
      </div>
    );
  }

  return (
    <div className={className}>
      {houses.map((house, idx) => (
        <HouseCard
          key={house.id}
          house={house}
          index={idx}
          isSelected={house.id === selectedId}
          onClick={() => onHouseClick(house.id)}
          routeMode={routeMode}
          isComparing={compareSet.has(house.id)}
          onToggleCompare={() => onToggleCompare(house.id)}
        />
      ))}
    </div>
  );
}
