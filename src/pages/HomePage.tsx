import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, ChefHat } from 'lucide-react';
import { Meal, Category, MealSummary } from '../types/meal.ts';
import {
  searchMeals,
  filterByCategory,
  filterByArea,
  getCategories,
  getAreas,
  getInitialFeaturedRecipes,
} from '../services/api.ts';
import { SearchBar } from '../components/SearchBar.tsx';
import { FilterBar } from '../components/FilterBar.tsx';
import { MealCard } from '../components/MealCard.tsx';
import { LoadingSkeleton } from '../components/LoadingSkeleton.tsx';
import { ErrorMessage } from '../components/ErrorMessage.tsx';
import { EmptyState } from '../components/EmptyState.tsx';

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial query params from URL
  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedArea = searchParams.get('area') || '';

  // Data states
  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<string[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load categories and cuisine areas once on mount
  useEffect(() => {
    let isMounted = true;

    async function loadMetaFilters() {
      try {
        const [cats, regions] = await Promise.all([getCategories(), getAreas()]);
        if (isMounted) {
          setCategories(cats);
          setAreas(regions);
        }
      } catch (err) {
        console.error('Failed to load filter metadata:', err);
      }
    }

    loadMetaFilters();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch meals depending on the current search query or active filters
  const fetchRecipes = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (searchQuery.trim()) {
        // Priority 1: Keyword search query
        const results = await searchMeals(searchQuery.trim());
        setMeals(results);
      } else if (selectedCategory) {
        // Priority 2: Category filter
        const results = await filterByCategory(selectedCategory);
        setMeals(results);
      } else if (selectedArea) {
        // Priority 3: Cuisine area filter
        const results = await filterByArea(selectedArea);
        setMeals(results);
      } else {
        // Default: Curated featured meals
        const results = await getInitialFeaturedRecipes();
        setMeals(results);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve recipes.';
      setErrorMessage(message);
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedArea]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Handler for search form submission
  const handleSearch = (keyword: string) => {
    const params = new URLSearchParams(searchParams);
    if (keyword) {
      params.set('q', keyword);
      // Clear specific category/area filters when searching explicitly
      params.delete('category');
      params.delete('area');
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  // Handler for category filter
  const handleSelectCategory = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
      params.delete('q');
      params.delete('area');
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  // Handler for cuisine area filter
  const handleSelectArea = (area: string) => {
    const params = new URLSearchParams(searchParams);
    if (area) {
      params.set('area', area);
      params.delete('q');
      params.delete('category');
    } else {
      params.delete('area');
    }
    setSearchParams(params);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Calculate descriptive active heading
  const getResultsHeading = () => {
    if (searchQuery) return `Recipes matching "${searchQuery}"`;
    if (selectedCategory) return `${selectedCategory} Dishes`;
    if (selectedArea) return `${selectedArea} Cuisine Specialties`;
    return 'Featured & Trending Recipes';
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-10 bg-radial from-amber-50/70 via-stone-50/50 to-transparent border-b border-stone-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-semibold uppercase tracking-wider">
            <ChefHat className="w-3.5 h-3.5 text-amber-700" />
            <span>Over 300+ Tested Recipes</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-tight">
            Find Your Next Favorite Recipe
          </h1>

          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto">
            Explore authentic dishes from cuisines across the globe, look up ingredients, and step-by-step cooking instructions.
          </p>

          <div className="pt-2">
            <SearchBar
              initialValue={searchQuery}
              onSearch={handleSearch}
              isLoading={isLoading}
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Filter Controls Bar */}
        <FilterBar
          categories={categories}
          areas={areas}
          selectedCategory={selectedCategory}
          selectedArea={selectedArea}
          onSelectCategory={handleSelectCategory}
          onSelectArea={handleSelectArea}
          onResetFilters={handleResetFilters}
        />

        {/* Results Header */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-200/80">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-stone-900">
              {getResultsHeading()}
            </h2>
            {!isLoading && (
              <p className="text-xs text-stone-500 mt-0.5">
                Showing {meals.length} {meals.length === 1 ? 'recipe' : 'recipes'}
              </p>
            )}
          </div>

          {(searchQuery || selectedCategory || selectedArea) && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-medium text-amber-800 hover:underline cursor-pointer"
            >
              Clear search &amp; filters
            </button>
          )}
        </div>

        {/* Content States: Loading, Error, Empty, or Meal Grid */}
        {isLoading ? (
          <LoadingSkeleton count={8} />
        ) : errorMessage ? (
          <ErrorMessage message={errorMessage} onRetry={fetchRecipes} />
        ) : meals.length === 0 ? (
          <EmptyState
            title="No recipes found"
            description={
              searchQuery
                ? `No dishes found matching "${searchQuery}". Try a broader keyword or choose a category above.`
                : 'No recipes found for this filter selection.'
            }
            onReset={handleResetFilters}
            onSelectSuggestion={(sugg) => handleSearch(sugg)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {meals.map((meal) => (
              <MealCard key={meal.idMeal} meal={meal} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
