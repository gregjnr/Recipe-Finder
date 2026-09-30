import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto my-20 p-8 text-center bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
        <ChefHat className="w-8 h-8" />
      </div>
      <h1 className="font-editorial text-3xl font-bold text-stone-900">404 - Recipe Not Found</h1>
      <p className="text-sm text-stone-600">
        The page or recipe you are looking for doesn&apos;t seem to exist or has moved.
      </p>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};
