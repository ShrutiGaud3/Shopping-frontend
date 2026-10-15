import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  count?: number;
  showCount?: boolean;
  size?: 'sm' | 'md';
}

export const Rating: React.FC<RatingProps> = ({ value, count, showCount = true, size = 'sm' }) => {
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className="inline-flex items-center gap-1 text-gray-700">
      <span className="font-semibold text-xs text-gray-900">{value.toFixed(1)}</span>
      <Star className={`${iconSize} fill-amber-400 text-amber-400`} />
      {showCount && count !== undefined && (
        <span className="text-[11px] text-gray-400 font-normal">({count})</span>
      )}
    </div>
  );
};
