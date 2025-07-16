
'use client';

import { MovieCard } from '@/components/MovieCard';
import { FilterControls } from '@/components/FilterControls';
import type { Movie } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { Suspense } from 'react';

function MoviesGrid() {
  const { movies: allMovies } = useAuth();
  
  const categories = allMovies.length > 0 ? ['all', ...Array.from(new Set(allMovies.map(m => m.category)))] : ['all'];
  const languages = allMovies.length > 0 ? ['all', ...Array.from(new Set(allMovies.map(m => m.language)))] : ['all'];

  return (
    <FilterControls
      items={allMovies}
      searchPlaceholder="Search by title..."
      categories={categories}
      languages={languages}
      searchKeys={['title']}
      categoryKey="category"
      languageKey="language"
      renderItem={(movie) => <MovieCard key={movie.id} item={movie} />}
      noResultsMessage="No movies match your criteria. Please try different filters or check back later."
    />
  );
}

export default function MoviesPageWrapper() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
          Stream Movies
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Your favorite films, available anytime.
        </p>
      </div>
      <Suspense fallback={<div>Loading filters...</div>}>
        <MoviesGrid />
      </Suspense>
    </div>
  )
}
