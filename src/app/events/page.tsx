
'use client';

import { EventCard } from '@/components/EventCard';
import { FilterControls } from '@/components/FilterControls';
import { mockEvents } from '@/lib/mock-data';
import type { Event } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function EventsGrid() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';
  const language = searchParams.get('language') || 'all';

  // In a real app, this would be fetched from an API
  const allEvents: Event[] = mockEvents.map(e => ({...e, date: new Date(e.date)}));

  const filteredEvents = allEvents.filter((event: Event) => {
    return (
      (event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.artist.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (category === 'all' || event.category === category) &&
      (language === 'all' || event.language === language) &&
      event.approvalStatus === 'Approved'
    );
  });

  const categories = ['all', ...Array.from(new Set(allEvents.map(e => e.category)))];
  const languages = ['all', ...Array.from(new Set(allEvents.map(e => e.language)))];

  return (
    <>
      <FilterControls
        searchPlaceholder="Search by title or artist..."
        categories={categories}
        languages={languages}
        initialSearch={searchTerm}
        initialCategory={category}
        initialLanguage={language}
      />

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} item={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-headline">No Events Found</h2>
          <p className="text-muted-foreground mt-2">
            There are no events available at the moment. Please check back later.
          </p>
        </div>
      )}
    </>
  );
}

// Wrapper component to use Suspense
export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
          Discover Events
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Find your next live experience.
        </p>
      </div>
      <Suspense fallback={<div>Loading filters...</div>}>
        <EventsGrid />
      </Suspense>
    </div>
  );
}
