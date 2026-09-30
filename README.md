# 🍳 Recipe Finder

A responsive web application to discover, filter, and save delicious recipes from around the world. Built from scratch with **React (Vite)**, **React Router**, **Axios**, and **Tailwind CSS**, powered by the open **TheMealDB API**.

---

## 🌟 Key Features

- **🔍 Smart Recipe Search**: Instantly look up recipes by meal name, main ingredient, or keywords with quick-suggestion tags (*Pasta, Salmon, Curry, Tacos, etc.*).
- **🏷️ Category & Cuisine Filters**: Filter dishes across dietary categories (*Seafood, Beef, Vegetarian, Dessert, etc.*) and international cuisines (*Italian, Mexican, Japanese, Indian, French, etc.*).
- **📖 Comprehensive Recipe Detail View**:
  - High-resolution dish photography and cuisine origin.
  - Interactive **Ingredients Prep Checklist** (check off ingredients as you cook).
  - **Servings Scaler** (1x, 2x, 4x) to scale measurements dynamically.
  - Step-by-step instructions and embedded **YouTube Video Tutorials**.
  - Shareable recipe URLs with React Router parameters (`/recipe/:id`).
  - Print-friendly layout button.
- **❤️ Favorites & Personal Recipe Book**:
  - Save favorite recipes with a single click.
  - Saved recipes persist in browser `localStorage`.
  - Dedicated `/favorites` page with in-collection search and batch management.
- **🎲 "Surprise Recipe" Generator**: Get instant culinary inspiration with a single click.
- **⚡ Resilient UI**: Smooth skeleton loaders during API requests, accessible keyboard navigation, and friendly error boundaries with retry mechanisms.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Routing**: [React Router](https://reactrouter.com/) (v7)
- **Data Fetching**: [Axios](https://axios-http.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API**: [TheMealDB](https://www.themealdb.com/api.php) (Public Recipe Database)

---

## 🔑 API Key & Configuration

This project consumes **TheMealDB API**.

- **No Signup Required**: TheMealDB offers a free public developer test key (`1`) that works out of the box with full search, category lookup, random meals, and recipe details.
- **Optional Custom Key**: If you are a supporter on TheMealDB Patreon with a custom API key, you can configure it via the `.env` file.

### Setting up Environment Variables

1. Duplicate the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and verify the settings:
   ```env
   # Default free public key (no signup needed)
   VITE_THEMEALDB_API_KEY="1"
   VITE_API_BASE_URL="https://www.themealdb.com/api/json/v1"
   ```

---

## 🚀 Getting Started (Local Run Steps)

Follow these quick steps to run the project locally on your machine:

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `yarn` / `pnpm`

### 2. Clone the Repository
```bash
git clone https://github.com/praisegreg/recipe-movie-finder.git
cd recipe-movie-finder
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Create Local Environment Configuration
```bash
cp .env.example .env
```

### 5. Start the Development Server
```bash
npm run dev
```

Your app will be running at `http://localhost:3000` (or `http://localhost:5173`).

### 6. Build for Production
To create an optimized production build:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

## 📂 Project Architecture

```
├── .env.example              # Environment variables template
├── index.html                # HTML entry point with metadata and fonts
├── package.json              # Project dependencies and npm scripts
├── vite.config.ts            # Vite build and plugin configuration
├── src/
│   ├── main.tsx              # Application entry point
│   ├── App.tsx               # Root component with React Router setup
│   ├── index.css             # Tailwind CSS & global typography styles
│   ├── types/
│   │   └── meal.ts           # TypeScript interfaces for meals, categories & ingredients
│   ├── services/
│   │   └── api.ts            # Axios HTTP client and API endpoints
│   ├── context/
│   │   └── FavoritesContext.tsx # Context & localStorage persistence for saved recipes
│   ├── components/
│   │   ├── Navbar.tsx        # Navigation header with brand, tabs & surprise meal
│   │   ├── Footer.tsx        # Footer with navigation and links
│   │   ├── SearchBar.tsx     # Search input with clear button & quick suggestions
│   │   ├── FilterBar.tsx     # Category buttons & cuisine dropdown selector
│   │   ├── MealCard.tsx      # Recipe card with image, category, and favorite toggle
│   │   ├── LoadingSkeleton.tsx # Shimmer loading placeholder grid
│   │   ├── ErrorMessage.tsx  # User-friendly error alert with retry button
│   │   └── EmptyState.tsx    # Clean empty search state with query suggestions
│   └── pages/
│       ├── HomePage.tsx      # Main discovery page (search, filters, recipe grid)
│       ├── RecipeDetailPage.tsx # Detail view (ingredients checklist, instructions, video)
│       ├── FavoritesPage.tsx # Saved favorites list with in-page search
│       ├── CategoriesPage.tsx# All recipe categories overview
│       └── NotFoundPage.tsx  # 404 error page
```

---

## 🧪 Testing the User Flows End-to-End

You can verify the following complete flows:
1. **Search**: Enter "chicken" or click a suggestion like "Pasta" in the search bar to query the API.
2. **Filter**: Click category tabs (e.g. *Seafood*) or select a cuisine (e.g. *Italian*) to update results and URL query parameters.
3. **View Detail**: Click any recipe card to open its dedicated page with ingredients, measurements, instructions, and YouTube video.
4. **Interactive Cooking**: Scale servings from 1x to 2x or 4x, and click ingredient checkboxes to check them off as you prepare.
5. **Add to Favorites**: Click the heart button on any card or detail page.
6. **View Favorites**: Navigate to `/favorites` to see your saved recipes persisted across browser refreshes.

---

## 📄 License

This project is licensed under the MIT License.
Meal data provided courtesy of [TheMealDB](https://www.themealdb.com/).
