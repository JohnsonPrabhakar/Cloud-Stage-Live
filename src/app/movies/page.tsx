
'use client';

import { MovieCard } from '@/components/MovieCard';
import { FilterControls } from '@/components/FilterControls';
import type { Movie } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

export default function MoviesPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { movies: allMovies } = useAuth();
  const searchTerm = typeof searchParams?.search === 'string' ? searchParams.search : '';
  const category = typeof searchParams?.category === 'string' ? searchParams.category : 'all';
  const language = typeof searchParams?.language === 'string' ? searchParams.language : 'all';

  const filteredMovies = allMovies.filter((movie: Movie) => {
    return (
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === 'all' || movie.category.toLowerCase() === category.toLowerCase()) &&
      (language === 'all' || movie.language.toLowerCase() === language.toLowerCase())
    );
  });

  const categories = allMovies.length > 0 ? ['all', ...Array.from(new Set(allMovies.map(m => m.category)))] : ['all'];
  const languages = allMovies.length > 0 ? ['all', ...Array.from(new Set(allMovies.map(m => m.language)))] : ['all'];

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

      <FilterControls
        searchPlaceholder="Search by title..."
        categories={categories}
        languages={languages}
        initialSearch={searchTerm}
        initialCategory={category}
        initialLanguage={language}
      />

      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} item={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-headline">No Movies Found</h2>
          <p className="text-muted-foreground mt-2">
            No movies match your criteria. Please try different filters or check back later.
          </p>
        </div>
      )}
    </div>
  );
}
