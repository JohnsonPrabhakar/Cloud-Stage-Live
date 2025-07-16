import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Movie } from '@/lib/types';
import { Film } from 'lucide-react';

export function MovieCard({ item }: { item: Movie }) {
  const { id, title, thumbnailUrl } = item;

  return (
    <Card className="w-full overflow-hidden flex flex-col h-full transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="relative">
        <Link href={`/movies/${id}`}>
          <Image
            src={thumbnailUrl}
            alt={title}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
            data-ai-hint="movie poster"
          />
        </Link>
      </div>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-xl mb-2 leading-tight">
          <Link href={`/movies/${id}`}>{title}</Link>
        </CardTitle>
      </CardContent>
      <CardFooter className="p-4 bg-muted/50">
        <Button asChild className="w-full">
          <Link href={`/movies/${id}`}>
            <Film className="mr-2 h-4 w-4" />
            Watch Movie
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
