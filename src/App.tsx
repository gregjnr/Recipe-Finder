/**
 * Recipe Finder Web Application
 * Tech Stack: React (Vite), React Router, Axios, Tailwind CSS
 * API: TheMealDB Public Free API (Test Key: '1')
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { RecipeDetailPage } from './pages/RecipeDetailPage.tsx';
import { FavoritesPage } from './pages/FavoritesPage.tsx';
import { CategoriesPage } from './pages/CategoriesPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';

export default function App() {
  return (
    <FavoritesProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipe/:id" element={<RecipeDetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </FavoritesProvider>
  );
}
