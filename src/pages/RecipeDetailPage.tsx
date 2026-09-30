import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Share2,
  Printer,
  Youtube,
  ExternalLink,
  CheckCircle2,
  Circle,
  Users,
  Utensils,
  Globe2,
  Tag,
  Loader2,
} from 'lucide-react';
import { Meal, MealSummary, extractIngredients } from '../types/meal.ts';
import { getMealById, filterByCategory } from '../services/api.ts';
import { useFavorites } from '../context/FavoritesContext.tsx';
import { MealCard } from '../components/MealCard.tsx';
import { ErrorMessage } from '../components/ErrorMessage.tsx';

export const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [meal, setMeal] = useState<Meal | null>(null);
  const [relatedMeals, setRelatedMeals] = useState<MealSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cooking interactive states
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [servingMultiplier, setServingMultiplier] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function loadRecipe() {
      if (!id) return;
      setIsLoading(true);
      setErrorMessage(null);
      setCheckedIngredients({});

      try {
        const recipeData = await getMealById(id);
        if (!isMounted) return;

        if (!recipeData) {
          setErrorMessage('Recipe not found. It may have been removed or the ID is invalid.');
          setMeal(null);
          return;
        }

        setMeal(recipeData);

        // Fetch related recipes from the same category
        if (recipeData.strCategory) {
          try {
            const related = await filterByCategory(recipeData.strCategory);
            if (isMounted) {
              // Filter out the current recipe and take up to 4
              const filteredRelated = related
                .filter((r) => r.idMeal !== recipeData.idMeal)
                .slice(0, 4);
              setRelatedMeals(filteredRelated);
            }
          } catch (e) {
            console.error('Failed to load related recipes:', e);
          }
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Failed to load recipe details.';
        setErrorMessage(msg);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRecipe();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
        <p className="text-sm font-medium text-stone-600">Gathering recipe ingredients and instructions...</p>
      </div>
    );
  }

  if (errorMessage || !meal) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to recipes</span>
        </button>
        <ErrorMessage
          message={errorMessage || 'Recipe could not be found.'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const ingredients = extractIngredients(meal);
  const favorited = isFavorite(meal.idMeal);

  // Format tags from comma-separated string
  const tagsList = meal.strTags
    ? meal.strTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  // Parse instructions into step paragraphs
  const instructionSteps = meal.strInstructions
    .split(/\r?\n+/)
    .map((step) => step.trim())
    .filter((step) => step.length > 5);

  // Extract YouTube embed URL if valid
  const getYoutubeEmbedUrl = (url: string | null) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
  };
  const embedUrl = getYoutubeEmbedUrl(meal.strYoutube);

  const toggleIngredientCheck = (ingredientName: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [ingredientName]: !prev[ingredientName],
    }));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Navigation & Action Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Print button */}
          <button
            onClick={handlePrint}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title="Print recipe"
            aria-label="Print recipe"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Share button */}
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
            title="Copy share link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>

          {/* Favorite button */}
          <button
            onClick={() =>
              toggleFavorite({
                idMeal: meal.idMeal,
                strMeal: meal.strMeal,
                strMealThumb: meal.strMealThumb,
                strCategory: meal.strCategory,
                strArea: meal.strArea,
              })
            }
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              favorited
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:border-rose-300 hover:text-rose-600'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`} />
            <span>{favorited ? 'Saved in Favorites' : 'Save to Favorites'}</span>
          </button>
        </div>
      </div>

      {/* Main Header & Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Recipe Photo */}
        <div className="md:col-span-6 rounded-2xl overflow-hidden shadow-sm border border-stone-200 bg-stone-100">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="w-full h-auto aspect-4/3 object-cover"
          />
        </div>

        {/* Recipe Info Header */}
        <div className="md:col-span-6 space-y-4">
          {/* Metadata line with typographic separators (anti-pill) */}
          <div className="flex items-center flex-wrap gap-2 text-xs font-medium text-amber-900">
            <span className="flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5 text-amber-700" />
              {meal.strCategory}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5 text-amber-700" />
              {meal.strArea} Cuisine
            </span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight">
            {meal.strMeal}
          </h1>

          {/* Tags */}
          {tagsList.length > 0 && (
            <div className="flex items-center flex-wrap gap-1.5 text-xs text-stone-500 pt-1">
              <Tag className="w-3.5 h-3.5 text-stone-400" />
              {tagsList.map((tag, i) => (
                <span key={tag}>
                  {tag}
                  {i < tagsList.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </div>
          )}

          {/* Quick Serving Adjuster */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between p-3.5 bg-stone-50/80 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-stone-700 font-medium">
              <Users className="w-4 h-4 text-stone-500" />
              <span>Servings Multiplier:</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 4].map((mult) => (
                <button
                  key={mult}
                  type="button"
                  onClick={() => setServingMultiplier(mult)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    servingMultiplier === mult
                      ? 'bg-amber-700 text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {mult}x
                </button>
              ))}
            </div>
          </div>

          {/* External Links */}
          <div className="flex items-center gap-3 pt-2 text-xs">
            {meal.strYoutube && (
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 font-medium hover:underline"
              >
                <Youtube className="w-4 h-4" />
                <span>Watch on YouTube</span>
              </a>
            )}
            {meal.strSource && (
              <a
                href={meal.strSource}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-900 font-medium hover:underline"
              >
                <span>Original Recipe Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Ingredients & Prep Checklists */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
        {/* Ingredients Column */}
        <section className="md:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <h2 className="font-editorial text-2xl font-bold text-stone-900">
              Ingredients
            </h2>
            <span className="text-xs text-stone-500 font-medium">
              {ingredients.length} items
            </span>
          </div>

          <p className="text-xs text-stone-500">
            Click items to check off as you prepare your dish:
          </p>

          <ul className="space-y-2">
            {ingredients.map(({ ingredient, measure, imageUrl }) => {
              const isChecked = !!checkedIngredients[ingredient];
              return (
                <li
                  key={ingredient}
                  onClick={() => toggleIngredientCheck(ingredient)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors cursor-pointer select-none ${
                    isChecked
                      ? 'bg-amber-50/60 border-amber-200 text-stone-400 line-through'
                      : 'bg-white border-stone-200/80 hover:bg-stone-50 text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-stone-300 shrink-0" />
                    )}
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={ingredient}
                        className="w-7 h-7 object-contain rounded shrink-0 bg-stone-50"
                        loading="lazy"
                        onError={(e) => {
                          // Hide image if 404
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    )}
                    <span className="text-xs sm:text-sm font-medium">
                      {ingredient}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-stone-600 shrink-0 ml-2">
                    {measure}
                    {servingMultiplier > 1 ? ` (${servingMultiplier}x)` : ''}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Step-by-Step Instructions Column */}
        <section className="md:col-span-7 space-y-4">
          <div className="pb-2 border-b border-stone-200">
            <h2 className="font-editorial text-2xl font-bold text-stone-900">
              Instructions
            </h2>
          </div>

          <div className="space-y-4 pt-1">
            {instructionSteps.length > 1 ? (
              instructionSteps.map((step, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-white rounded-xl border border-stone-200/80 shadow-2xs">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed pt-0.5">
                    {step}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-5 bg-white rounded-xl border border-stone-200 text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                {meal.strInstructions}
              </div>
            )}
          </div>

          {/* Embedded YouTube video if available */}
          {embedUrl && (
            <div className="pt-6 space-y-2">
              <h3 className="font-editorial text-xl font-bold text-stone-900 flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-600" />
                Video Tutorial
              </h3>
              <div className="aspect-16/9 w-full rounded-xl overflow-hidden border border-stone-200 shadow-sm bg-black">
                <iframe
                  src={embedUrl}
                  title={`${meal.strMeal} Cooking Video`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Related Recipes Section */}
      {relatedMeals.length > 0 && (
        <section className="pt-12 border-t border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-2xl font-bold text-stone-900">
                More {meal.strCategory} Recipes
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Explore similar dishes you might enjoy cooking
              </p>
            </div>
            <Link
              to={`/?category=${encodeURIComponent(meal.strCategory)}`}
              className="text-xs font-semibold text-amber-800 hover:underline"
            >
              View all in {meal.strCategory} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedMeals.map((relatedMeal) => (
              <MealCard key={relatedMeal.idMeal} meal={relatedMeal} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
