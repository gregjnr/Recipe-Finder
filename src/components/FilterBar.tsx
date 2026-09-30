import React from 'react';
import { Globe2, X, SlidersHorizontal } from 'lucide-react';
import { Category } from '../types/meal.ts';

interface FilterBarProps {
  categories: Category[];
  areas: string[];
  selectedCategory: string;
  selectedArea: string;
  onSelectCategory: (category: string) => void;
  onSelectArea: (area: string) => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  areas,
  selectedCategory,
  selectedArea,
  onSelectCategory,
  onSelectArea,
  onResetFilters,
}) => {
  const hasActiveFilters = Boolean(selectedCategory || selectedArea);

  // Take the most popular categories for quick-switch tabs
  const topCategories = categories.slice(0, 10);

  return (
    <div className="space-y-4">
      {/* Category Buttons Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none w-full md:w-auto">
          <button
            type="button"
            onClick={() => onSelectCategory('')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              !selectedCategory
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            All Categories
          </button>

          {topCategories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.strCategory.toLowerCase();
            return (
              <button
                key={cat.idCategory}
                type="button"
                onClick={() => onSelectCategory(cat.strCategory)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {cat.strCategory}
              </button>
            );
          })}
        </div>

        {/* Cuisine Area Dropdown and Reset button */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="relative inline-flex items-center">
            <Globe2 className="w-3.5 h-3.5 absolute left-3 text-stone-500 pointer-events-none" />
            <select
              value={selectedArea}
              onChange={(e) => onSelectArea(e.target.value)}
              className="pl-8 pr-7 py-1.5 text-xs font-medium bg-white text-stone-700 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              aria-label="Filter by Cuisine / Region"
            >
              <option value="">All Cuisines / World</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area} Cuisine
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
