import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-stone-200 overflow-hidden animate-pulse flex flex-col"
        >
          {/* Image placeholder */}
          <div className="aspect-4/3 w-full bg-stone-200" />

          {/* Text placeholders */}
          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-3 bg-stone-200 rounded w-1/3" />
              <div className="h-5 bg-stone-200 rounded w-4/5" />
              <div className="h-4 bg-stone-200 rounded w-2/3" />
            </div>
            <div className="pt-3 border-t border-stone-100 flex justify-between items-center">
              <div className="h-3 bg-stone-200 rounded w-1/4" />
              <div className="h-3 bg-stone-200 rounded w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
