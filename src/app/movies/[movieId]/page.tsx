'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Languages, Clapperboard, ArrowLeft } from 'lucide-react';
import type { Movie } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = params.movieId as string;
  // In a real app, you would fetch this movie from an API
  const movie: Movie | undefined = undefined;

  if (!movie) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-headline">Movie not found.</h1>
        <Button asChild variant="outline">
            <Link href="/movies">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Movies
            </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
            <Button asChild variant="outline">
                <Link href="/movies">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to All Movies
                </Link>
            </Button>
      </div>
      <div className="aspect-video w-full mb-8 rounded-lg overflow-hidden bg-black">
        <iframe
          className="w-full h-full"
          src={movie.videoUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">{movie.title}</h1>
          <p className="text-lg text-foreground">{movie.description}</p>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <Clapperboard className="h-5 w-5 mt-1 text-primary"/>
                <div>
                  <h3 className="font-semibold">Category</h3>
                  <p className="text-muted-foreground">{movie.category}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Languages className="h-5 w-5 mt-1 text-primary"/>
                <div>
                  <h3 className="font-semibold">Language</h3>
                  <p className="text-muted-foreground">{movie.language}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
