import axios, { AxiosError } from 'axios';
import { Meal, Category, MealSummary } from '../types/meal.ts';

// Get API Key and Base URL from environment variables or use free test key "1"
const API_KEY = import.meta.env.VITE_THEMEALDB_API_KEY || '1';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.themealdb.com/api/json/v1';

// Create a configured Axios instance
const apiClient = axios.create({
  baseURL: `${BASE_URL}/${API_KEY}`,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Accept': 'application/json',
  },
});

/**
 * Custom error handler for beginner-friendly, readable error messages
 */
function handleApiError(error: unknown, fallbackMessage: string): Error {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError;
    if (axiosErr.code === 'ECONNABORTED') {
      return new Error('The request timed out. Please check your internet connection.');
    }
    if (!axiosErr.response) {
      return new Error('Network error: unable to reach the recipe server.');
    }
    return new Error(`Server responded with error: ${axiosErr.response.statusText || axiosErr.message}`);
  }
  return new Error(fallbackMessage);
}

/**
 * Search meals by name or keyword
 * Example: searchMeals("pasta")
 */
export async function searchMeals(query: string): Promise<Meal[]> {
  try {
    const trimmed = query.trim();
    if (!trimmed) return [];
    
    const response = await apiClient.get<{ meals: Meal[] | null }>('/search.php', {
      params: { s: trimmed }
    });

    return response.data.meals || [];
  } catch (error) {
    throw handleApiError(error, `Failed to search recipes for "${query}".`);
  }
}

/**
 * Fetch a single meal's full details by its unique ID
 * Example: getMealById("52772")
 */
export async function getMealById(id: string): Promise<Meal | null> {
  try {
    const response = await apiClient.get<{ meals: Meal[] | null }>('/lookup.php', {
      params: { i: id }
    });

    if (response.data.meals && response.data.meals.length > 0) {
      return response.data.meals[0];
    }
    return null;
  } catch (error) {
    throw handleApiError(error, `Failed to load recipe details for ID #${id}.`);
  }
}

/**
 * Fetch a single random meal (great for "Surprise Me" feature)
 */
export async function getRandomMeal(): Promise<Meal | null> {
  try {
    const response = await apiClient.get<{ meals: Meal[] | null }>('/random.php');
    if (response.data.meals && response.data.meals.length > 0) {
      return response.data.meals[0];
    }
    return null;
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch a random surprise recipe.');
  }
}

/**
 * Fetch all available recipe categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await apiClient.get<{ categories: Category[] }>('/categories.php');
    return response.data.categories || [];
  } catch (error) {
    throw handleApiError(error, 'Failed to load meal categories.');
  }
}

/**
 * Fetch all cuisine areas (Italian, Mexican, Japanese, Indian, etc.)
 */
export async function getAreas(): Promise<string[]> {
  try {
    const response = await apiClient.get<{ meals: { strArea: string }[] }>('/list.php', {
      params: { a: 'list' }
    });
    return (response.data.meals || []).map(item => item.strArea).filter(Boolean);
  } catch (error) {
    throw handleApiError(error, 'Failed to load cuisine regions.');
  }
}

/**
 * Filter meals by category (e.g. "Seafood", "Beef", "Vegetarian")
 */
export async function filterByCategory(category: string): Promise<MealSummary[]> {
  try {
    const response = await apiClient.get<{ meals: MealSummary[] | null }>('/filter.php', {
      params: { c: category }
    });
    return (response.data.meals || []).map(meal => ({
      ...meal,
      strCategory: category,
    }));
  } catch (error) {
    throw handleApiError(error, `Failed to filter recipes in category "${category}".`);
  }
}

/**
 * Filter meals by country / cuisine area (e.g. "Italian", "Mexican")
 */
export async function filterByArea(area: string): Promise<MealSummary[]> {
  try {
    const response = await apiClient.get<{ meals: MealSummary[] | null }>('/filter.php', {
      params: { a: area }
    });
    return (response.data.meals || []).map(meal => ({
      ...meal,
      strArea: area,
    }));
  } catch (error) {
    throw handleApiError(error, `Failed to filter recipes from cuisine "${area}".`);
  }
}

/**
 * Load initial curated featured recipes to showcase on the home page
 */
export async function getInitialFeaturedRecipes(): Promise<Meal[]> {
  // Query popular staple terms like "chicken", "pie", or "pasta" to populate an attractive initial state
  try {
    const response = await apiClient.get<{ meals: Meal[] | null }>('/search.php', {
      params: { s: 'pie' }
    });
    return response.data.meals || [];
  } catch (error) {
    console.error('Featured recipes load error:', error);
    return [];
  }
}
