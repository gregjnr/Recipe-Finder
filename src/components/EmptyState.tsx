import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  suggestions?: string[];
  onSelectSuggestion?: (item: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No recipes found',
  description = 'We couldn\'t find any recipes matching your criteria. Try adjusting your search or filters.',
  onReset,
  suggestions = ['Chicken', 'Pasta', 'Beef', 'Salad', 'Cake'],
  onSelectSuggestion,
}) => {
  return (
    <div className="max-w-md mx-auto my-12 p-8 text-center bg-stone-50 border border-dashed border-stone-300 rounded-2xl">
      <div className="w-14 h-14 mx-auto rounded-full bg-stone-200/70 flex items-center justify-center text-stone-500 mb-4">
        <SearchX className="w-7 h-7" />
      </div>
      <h3 className="font-editorial text-xl font-bold text-stone-900 mb-2">{title}</h3>
      <p className="text-sm text-stone-600 mb-6">{description}</p>

      {/* Suggested Search Terms */}
      {suggestions && suggestions.length > 0 && onSelectSuggestion && (
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
            Try searching for:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((item) => (
              <button
                key={item}
                onClick={() => onSelectSuggestion(item)}
                className="px-3 py-1 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );
};
