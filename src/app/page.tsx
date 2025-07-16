'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { EventCard } from '@/components/EventCard';
import { MovieCard } from '@/components/MovieCard';
import type { Event, Movie } from '@/lib/types';
import Autoplay from "embla-carousel-autoplay"
import React from 'react';

export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  const liveEvents: Event[] = [];
  const upcomingEvents: Event[] = [];
  const pastEvents: Event[] = [];
  const movies: Movie[] = [];

  return (
    <div className="flex flex-col items-center">
      <section className="w-full bg-primary/10 py-12 md:py-20 lg:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary mb-4">
            CloudStage Live
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-8">
            Your stage, anywhere. Discover and stream exclusive live events from artists around the world.
          </p>
        </div>
      </section>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <SectionCarousel title="Live Events" items={liveEvents} CardComponent={EventCard} plugin={plugin} />
        <SectionCarousel title="Upcoming Events" items={upcomingEvents} CardComponent={EventCard} plugin={plugin} />
        <SectionCarousel title="Featured Movies" items={movies} CardComponent={MovieCard} plugin={plugin} />
        <SectionCarousel title="Past Events" items={pastEvents} CardComponent={EventCard} plugin={plugin} />
      </div>
    </div>
  );
}

interface SectionCarouselProps<T> {
  title: string;
  items: T[];
  CardComponent: React.FC<{ item: T }>;
  plugin: React.MutableRefObject<any>;
}

function SectionCarousel<T extends { id: string }>({ title, items, CardComponent, plugin }: SectionCarouselProps<T>) {
  if (items.length === 0) return (
    <section>
        <h2 className="text-3xl font-headline font-bold mb-6">{title}</h2>
        <div className="text-center py-8 text-muted-foreground">
            <p>No {title.toLowerCase()} available at the moment.</p>
        </div>
    </section>
  );

  return (
    <section>
      <h2 className="text-3xl font-headline font-bold mb-6">{title}</h2>
      <Carousel 
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {items.map((item, index) => (
            <CarouselItem key={item.id + index} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <CardComponent item={item} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
