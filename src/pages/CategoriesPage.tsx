import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Loader2 } from 'lucide-react';
import { Category } from '../types/meal.ts';
import { getCategories } from '../services/api.ts';
import { ErrorMessage } from '../components/ErrorMessage.tsx';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load categories';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-2xl space-y-2">
        <div className="flex items-center gap-2 text-amber-700">
          <Layers className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Explore by Dish Style
          </span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900">
          Meal Categories
        </h1>
        <p className="text-sm text-stone-600">
          Browse dishes curated by main protein, dietary style, or meal course.
        </p>
      </div>

      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          <p className="text-xs text-stone-500 font-medium">Loading recipe categories...</p>
        </div>
      ) : errorMessage ? (
        <ErrorMessage message={errorMessage} onRetry={fetchCategories} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.idCategory}
              to={`/?category=${encodeURIComponent(cat.strCategory)}`}
              className="group flex flex-col bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-200 p-5"
            >
              <div className="flex items-center gap-4">
                <img
                  src={cat.strCategoryThumb}
                  alt={cat.strCategory}
                  className="w-20 h-20 object-contain shrink-0 group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
                <div className="space-y-1">
                  <h3 className="font-editorial text-xl font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                    {cat.strCategory}
                  </h3>
                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                    <span>Explore Recipes</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-stone-500 leading-relaxed line-clamp-3">
                {cat.strCategoryDescription}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
