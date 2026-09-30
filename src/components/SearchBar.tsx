import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  initialValue?: string;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const POPULAR_SUGGESTIONS = ['Pasta', 'Curry', 'Salmon', 'Chicken', 'Tacos', 'Pancakes', 'Chocolate'];

export const SearchBar: React.FC<SearchBarProps> = ({
  initialValue = '',
  onSearch,
  isLoading = false,
}) => {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center shadow-xs">
        <div className="absolute left-4 pointer-events-none text-stone-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by ingredient, dish name, or cuisine (e.g. 'Beef Wellington', 'Pasta', 'Curry')..."
          className="w-full pl-12 pr-28 py-3.5 bg-white border border-stone-300 rounded-xl text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow"
          aria-label="Search recipes"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-20 p-1 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 cursor-pointer"
            aria-label="Clear search query"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Popular Quick Suggestions */}
      <div className="mt-3 flex items-center flex-wrap gap-2 text-xs">
        <span className="text-stone-500 font-medium">Popular:</span>
        {POPULAR_SUGGESTIONS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => handleSuggestionClick(item)}
            className="text-stone-600 hover:text-amber-800 hover:underline cursor-pointer transition-colors"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};
