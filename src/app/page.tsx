
'use client';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { EventCard } from '@/components/EventCard';
import { MovieCard } from '@/components/MovieCard';
import type { Event, Movie } from '@/lib/types';
import Autoplay from "embla-carousel-autoplay"
import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { HomepageFilter } from '@/components/HomepageFilter';

const heroImages = [
  { src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8bXVzaWMlMjBjb25jZXJ0fGVufDB8fHx8MTc1MjY2MTIyOHww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Live music concert', hint: 'music concert' },
  { src: 'https://images.unsplash.com/photo-1534205959792-cccfa9f7f26e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBzaG93fGVufDB8fHx8MTc1MjY0NzA0M3ww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Comedy show', hint: 'comedy show' },
  { src: 'https://images.unsplash.com/photo-1661307987465-1db8d7a8796f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8eW9nYSUyMHNlc3Npb258ZW58MHx8fHwxNzUyNjYxMjI4fDA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Yoga session', hint: 'yoga session' },
  { src: 'https://images.unsplash.com/photo-1558301204-e3226482a77b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8b25saW5lJTIwd29ya3Nob3B8ZW58MHx8fHwxNzUyNjYxMjI4fDA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Online workshop', hint: 'online workshop' },
  { src: 'https://images.unsplash.com/photo-1526398977052-654221a252b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHx0YWxrJTIwc2hvd3xlbnwwfHx8fDE3NTI2NjEyMjh8MA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Talk show', hint: 'talk show' },
]

export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )
  const { events, movies, myTickets } = useAuth();
  const myTicketEventIds = new Set(myTickets.map(t => t.eventId));


  const approvedEvents = events.filter(e => e.approvalStatus === 'Approved');
  
  const liveEvents = approvedEvents.filter(e => e.status === 'Live');
  const upcomingEvents = approvedEvents.filter(e => e.status === 'Upcoming');
  const pastEvents = approvedEvents.filter(e => e.status === 'Past');
  const featuredMovies = movies.slice(0, 5);

  const eventCategories = ['all', ...Array.from(new Set(events.map(e => e.category)))];
  const eventLanguages = ['all', ...Array.from(new Set(events.map(e => e.language)))];

  return (
    <div className="flex flex-col items-center">
      <section className="w-full relative">
        <Carousel 
          plugins={[plugin.current]}
          className="w-full"
          opts={{ loop: true }}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {heroImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    data-ai-hint={image.hint}
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-black/50" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute inset-0 flex items-center justify-center text-center text-white p-4">
           <div className="container mx-auto">
             <h1 className="text-4xl md:text-6xl font-headline font-bold text-white mb-4 drop-shadow-lg">
                CloudStage Live
             </h1>
             <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8 drop-shadow-md">
                Your stage, anywhere. Discover and stream exclusive live events from artists around the world.
             </p>
              <Button size="lg" asChild>
                <Link href="/events">Explore Events</Link>
              </Button>
           </div>
        </div>
      </section>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <HomepageFilter categories={eventCategories} languages={eventLanguages} />
        <SectionCarousel title="Live Events" items={liveEvents} CardComponent={EventCard} ticketIds={myTicketEventIds} />
        <SectionCarousel title="Upcoming Events" items={upcomingEvents} CardComponent={EventCard} ticketIds={myTicketEventIds} />
        <SectionCarousel title="Past Events" items={pastEvents} CardComponent={EventCard} ticketIds={myTicketEventIds} />
        <SectionCarousel title="Featured Movies" items={featuredMovies} CardComponent={MovieCard} />
      </div>
    </div>
  );
}

interface SectionCarouselProps<T> {
  title: string;
  items: T[];
  CardComponent: React.FC<{ item: T, hasTicket?: boolean }>;
  ticketIds?: Set<string>;
}

function SectionCarousel<T extends { id: string }>({ title, items, CardComponent, ticketIds }: SectionCarouselProps<T>) {
  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="text-3xl font-headline font-bold mb-6">{title}</h2>
      <div className="relative">
        <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4">
          {items.map((item, index) => (
            <div key={item.id + index} className="flex-shrink-0 w-[calc(100%-2rem)] sm:w-80">
                <CardComponent item={item} hasTicket={ticketIds?.has(item.id)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
