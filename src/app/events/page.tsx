'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EventCard } from '@/components/EventCard';
import type { Event } from '@/lib/types';

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [language, setLanguage] = useState('all');

  // In a real app, this would be fetched from an API
  const allEvents: Event[] = [];

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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
          Discover Events
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Find your next live experience.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 border rounded-lg bg-card">
        <Input
          placeholder="Search by title or artist..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <div className="flex gap-4">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
             {languages.map(lang => <SelectItem key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

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
    </div>
  );
}
