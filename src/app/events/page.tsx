
'use client';

import { EventCard } from '@/components/EventCard';
import { FilterControls } from '@/components/FilterControls';
import type { Event } from '@/lib/types';
import { Suspense } from 'react';
import { useAuth } from '@/hooks/use-auth';

// This component now fetches data on the client side using the useAuth hook.
function EventsGrid() {
  const { events: allEvents } = useAuth();

  const filteredEvents = allEvents.filter((event: Event) => {
    return event.approvalStatus === 'Approved';
  });

  const categories = ['all', ...Array.from(new Set(allEvents.map(e => e.category)))];
  const languages = ['all', ...Array.from(new Set(allEvents.map(e => e.language)))];

  return (
    <FilterControls
      items={filteredEvents}
      searchPlaceholder="Search by title or artist..."
      categories={categories}
      languages={languages}
      searchKeys={['title', 'artist']}
      categoryKey="category"
      languageKey="language"
      renderItem={(event) => <EventCard key={event.id} item={event} />}
      noResultsMessage="There are no events available at the moment. Please check back later."
    />
  );
}

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
      <Suspense fallback={<div>Loading events...</div>}>
        <EventsGrid />
      </Suspense>
    </div>
  );
}
