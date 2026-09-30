import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Heart, Sparkles, Compass, Layers, Menu, X, Loader2 } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext.tsx';
import { getRandomMeal } from '../services/api.ts';

export const Navbar: React.FC = () => {
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSurpriseLoading, setIsSurpriseLoading] = useState(false);

  // Quick action: Fetch a random recipe and navigate straight to its detail page
  const handleSurpriseMe = async () => {
    try {
      setIsSurpriseLoading(true);
      const meal = await getRandomMeal();
      if (meal?.idMeal) {
        setIsMobileMenuOpen(false);
        navigate(`/recipe/${meal.idMeal}`);
      }
    } catch (err) {
      console.error('Surprise recipe error:', err);
    } finally {
      setIsSurpriseLoading(false);
    }
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'text-amber-700 font-semibold border-b-2 border-amber-600'
        : 'text-stone-600 hover:text-stone-950 hover:border-b-2 hover:border-stone-300'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm group-hover:bg-amber-600 transition-colors">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="font-editorial text-xl font-bold tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors">
                RecipeFinder
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-xs text-stone-400 font-medium">
                TheMealDB
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/" end className={navLinkClasses}>
              <Compass className="w-4 h-4" />
              Discover
            </NavLink>
            <NavLink to="/categories" className={navLinkClasses}>
              <Layers className="w-4 h-4" />
              Categories
            </NavLink>
            <NavLink to="/favorites" className={navLinkClasses}>
              <Heart className="w-4 h-4" />
              Favorites
              {favorites.length > 0 && (
                <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-amber-600 rounded-full">
                  {favorites.length}
                </span>
              )}
            </NavLink>
          </nav>

          {/* Right Action: Surprise Me Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleSurpriseMe}
              disabled={isSurpriseLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              title="Get a random recipe inspiration"
            >
              {isSurpriseLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              )}
              <span>Surprise Recipe</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={handleSurpriseMe}
              disabled={isSurpriseLoading}
              className="p-2 text-amber-800 bg-amber-100 rounded-lg"
              aria-label="Surprise recipe"
            >
              {isSurpriseLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-base font-medium text-stone-700 hover:bg-stone-50 rounded-lg"
          >
            <Compass className="w-5 h-5 text-amber-600" />
            Discover
          </Link>
          <Link
            to="/categories"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-base font-medium text-stone-700 hover:bg-stone-50 rounded-lg"
          >
            <Layers className="w-5 h-5 text-amber-600" />
            Categories
          </Link>
          <Link
            to="/favorites"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 text-base font-medium text-stone-700 hover:bg-stone-50 rounded-lg"
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-amber-600" />
              <span>Favorites</span>
            </div>
            {favorites.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold text-white bg-amber-600 rounded-full">
                {favorites.length}
              </span>
            )}
          </Link>
        </div>
      )}
    </header>
  );
};
