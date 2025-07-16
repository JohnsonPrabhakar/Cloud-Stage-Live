'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EventCard } from '@/components/EventCard';
import { ArrowLeft, Ticket } from 'lucide-react';
import type { Event } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MyTicketsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [purchasedEvents, setPurchasedEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/user-login');
    }
    // In a real app, you would fetch the user's tickets and corresponding event data here
    // For now, we just set it to an empty array.
    setPurchasedEvents([]);
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <p className="p-8 text-center">Loading your tickets...</p>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
      </div>
      <div className="flex items-center gap-4 mb-8">
        <Ticket className="h-10 w-10 text-primary" />
        <div>
            <h1 className="text-4xl font-headline font-bold">My Tickets</h1>
            <p className="text-muted-foreground">All your purchased event tickets in one place.</p>
        </div>
      </div>

      {purchasedEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {purchasedEvents.map(event => (
            <EventCard key={event.id} item={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-headline">No Tickets Yet</h2>
          <p className="text-muted-foreground mt-2">
            You haven't purchased any tickets. Explore events to get started!
          </p>
          <Button asChild className="mt-4">
            <Link href="/events">Explore Events</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
