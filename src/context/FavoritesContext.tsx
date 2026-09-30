import React, { createContext, useContext, useState, useEffect } from 'react';
import { MealSummary } from '../types/meal.ts';

interface FavoritesContextType {
  favorites: MealSummary[];
  addFavorite: (meal: MealSummary) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (meal: MealSummary) => boolean; // returns true if now favorite, false if removed
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
}

const STORAGE_KEY = 'recipe_finder_favorites_v1';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<MealSummary[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load favorites from localStorage:', e);
    }
    return [];
  });

  // Sync favorites with local storage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage:', e);
    }
  }, [favorites]);

  const isFavorite = (id: string): boolean => {
    return favorites.some(item => item.idMeal === id);
  };

  const addFavorite = (meal: MealSummary) => {
    setFavorites(prev => {
      if (prev.some(item => item.idMeal === meal.idMeal)) return prev;
      return [
        {
          idMeal: meal.idMeal,
          strMeal: meal.strMeal,
          strMealThumb: meal.strMealThumb,
          strCategory: meal.strCategory,
          strArea: meal.strArea,
          savedAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(item => item.idMeal !== id));
  };

  const toggleFavorite = (meal: MealSummary): boolean => {
    const currentlyFav = isFavorite(meal.idMeal);
    if (currentlyFav) {
      removeFavorite(meal.idMeal);
      return false;
    } else {
      addFavorite(meal);
      return true;
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
