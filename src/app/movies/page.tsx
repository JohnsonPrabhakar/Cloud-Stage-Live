import { MovieCard } from '@/components/MovieCard';
import { FilterControls } from '@/components/FilterControls';
import { mockMovies } from '@/lib/mock-data';
import type { Movie } from '@/lib/types';

export default function MoviesPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const searchTerm = typeof searchParams?.search === 'string' ? searchParams.search : '';
  const category = typeof searchParams?.category === 'string' ? searchParams.category : 'all';
  const language = typeof searchParams?.language === 'string' ? searchParams.language : 'all';

  // In a real app, this would be fetched from an API
  const allMovies: Movie[] = mockMovies;

  const filteredMovies = allMovies.filter((movie: Movie) => {
    return (
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === 'all' || movie.category === category) &&
      (language === 'all' || movie.language === language)
    );
  });

  const categories = ['all', ...Array.from(new Set(allMovies.map(m => m.category)))];
  const languages = ['all', ...Array.from(new Set(allMovies.map(m => m.language)))];

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
            There are no movies available at the moment. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
}
