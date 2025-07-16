'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { mockEvents, mockTickets } from '@/lib/mock-data';
import { EventCard } from '@/components/EventCard';
import { Ticket } from 'lucide-react';

export default function MyTicketsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/user-login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <p className="p-8 text-center">Loading your tickets...</p>;
  }

  const userTickets = mockTickets.filter(ticket => ticket.userId === 'user1'); // Mock for user1
  const purchasedEvents = mockEvents.filter(event => userTickets.some(ticket => ticket.eventId === event.id));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        </div>
      )}
    </div>
  );
}
