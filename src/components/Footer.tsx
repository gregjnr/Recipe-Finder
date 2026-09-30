import React from 'react';
import { UtensilsCrossed, Heart, Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-stone-200 bg-stone-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="font-editorial text-lg font-bold text-stone-900">
                RecipeFinder
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed max-w-sm">
              Discover delicious recipes from around the world. Powered by React, Vite,
              React Router, Axios, and TheMealDB open public API.
            </p>
            <div className="pt-1 text-xs text-stone-500">
              Free public access with zero required account creation.
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-600">
              <li>
                <Link to="/" className="hover:text-amber-800 transition-colors">
                  Discover Recipes
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-amber-800 transition-colors">
                  Explore Categories
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-amber-800 transition-colors">
                  Saved Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Open APIs & Code
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-600">
              <li>
                <a
                  href="https://www.themealdb.com/api.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-amber-800 transition-colors"
                >
                  <span>TheMealDB API</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/praisegreg/recipe-movie-finder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-amber-800 transition-colors"
                >
                  <Github className="w-3 h-3" />
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} RecipeFinder · Built with React &amp; Tailwind</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-current" /> for food enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
};
