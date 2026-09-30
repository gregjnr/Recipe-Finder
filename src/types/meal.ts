/**
 * Type definitions for TheMealDB API responses and application state.
 */

export interface Meal {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  strImageSource: string | null;
  strCreativeCommonsConfirmed: string | null;
  dateModified: string | null;
  [key: string]: string | null | undefined;
}

export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  savedAt?: string;
}

export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface Area {
  strArea: string;
}

export interface IngredientItem {
  ingredient: string;
  measure: string;
  imageUrl?: string;
}

/**
 * Extracts and pairs ingredient1..20 and measure1..20 from TheMealDB's flat structure.
 */
export function extractIngredients(meal: Meal): IngredientItem[] {
  const ingredients: IngredientItem[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredientKey = `strIngredient${i}`;
    const measureKey = `strMeasure${i}`;

    const ingredient = meal[ingredientKey]?.trim();
    const measure = meal[measureKey]?.trim() || '';

    if (ingredient && ingredient.length > 0) {
      ingredients.push({
        ingredient,
        measure,
        imageUrl: `https://www.themealdb.com/images/ingredients/${encodeURIComponent(ingredient)}-Small.png`
      });
    }
  }

  return ingredients;
}
