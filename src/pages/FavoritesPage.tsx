import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Search, ArrowRight, UtensilsCrossed, AlertTriangle } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext.tsx';
import { MealCard } from '../components/MealCard.tsx';

export const FavoritesPage: React.FC = () => {
  const { favorites, clearFavorites } = useFavorites();
  const [searchTerm, setSearchTerm] = useState('');
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Filter saved favorites based on search keyword
  const filteredFavorites = favorites.filter((meal) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      meal.strMeal.toLowerCase().includes(term) ||
      (meal.strCategory && meal.strCategory.toLowerCase().includes(term)) ||
      (meal.strArea && meal.strArea.toLowerCase().includes(term))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-[70vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-rose-600 mb-1">
            <Heart className="w-5 h-5 fill-current" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Saved Recipes
            </span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900">
            My Recipe Book
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            You have saved {favorites.length} {favorites.length === 1 ? 'recipe' : 'recipes'} to your personal collection.
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsClearModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-600 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 hover:border-rose-200 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {favorites.length === 0 ? (
        /* Empty State */
        <div className="max-w-md mx-auto my-12 p-8 text-center bg-stone-50 border border-dashed border-stone-300 rounded-2xl space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
            <Heart className="w-7 h-7" />
          </div>
          <h2 className="font-editorial text-2xl font-bold text-stone-900">
            Your favorites list is empty
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Click the heart icon on any recipe to save it here for easy access anytime you want to cook.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Explore Recipes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        /* Favorites Grid with filter search */
        <div className="space-y-6">
          {/* Quick filter within favorites */}
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your saved recipes..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 rounded-lg text-xs placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {filteredFavorites.length === 0 ? (
            <div className="text-center py-12 text-sm text-stone-500">
              No saved recipes match &quot;{searchTerm}&quot;.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredFavorites.map((meal) => (
                <MealCard key={meal.idMeal} meal={meal} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for Clearing Favorites */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-stone-200">
            <div className="flex items-center gap-3 text-amber-700">
              <div className="p-2.5 bg-amber-100 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Clear All Favorites?
                </h3>
                <p className="text-xs text-stone-500">
                  This will remove all {favorites.length} saved recipes from your device.
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600">
              This action cannot be undone. Are you sure you want to proceed?
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsClearModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearFavorites();
                  setIsClearModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
