import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { MealSummary } from '../types/meal.ts';
import { useFavorites } from '../context/FavoritesContext.tsx';

interface MealCardProps {
  meal: MealSummary;
}

export const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(meal.idMeal);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(meal);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      {/* Thumbnail and Favorite button */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Favorite Button Overlay */}
        <button
          onClick={handleFavoriteClick}
          aria-label={favorited ? `Remove ${meal.strMeal} from favorites` : `Add ${meal.strMeal} to favorites`}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 cursor-pointer ${
            favorited
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-white/85 text-stone-600 hover:text-rose-500 hover:bg-white shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Unboxed metadata line with typographic separator (no pills) */}
        {(meal.strCategory || meal.strArea) && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-800/90 mb-1.5">
            {meal.strCategory && <span>{meal.strCategory}</span>}
            {meal.strCategory && meal.strArea && <span aria-hidden="true">·</span>}
            {meal.strArea && <span>{meal.strArea} Cuisine</span>}
          </div>
        )}

        {/* Recipe Title */}
        <h3 className="font-editorial text-lg font-bold text-stone-900 leading-snug line-clamp-2 group-hover:text-amber-800 transition-colors mb-3 flex-1">
          {meal.strMeal}
        </h3>

        {/* View Recipe Action */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-600 group-hover:text-amber-700">
          <span>View Ingredients & Steps</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>

      {/* Full Card Link */}
      <Link
        to={`/recipe/${meal.idMeal}`}
        className="absolute inset-0 z-10"
        aria-label={`View recipe for ${meal.strMeal}`}
      >
        <span className="sr-only">View recipe for {meal.strMeal}</span>
      </Link>
    </div>
  );
};
