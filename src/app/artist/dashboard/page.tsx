'use client';

import { useAuth } from '@/hooks/use-auth';
import { EventCard } from '@/components/EventCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import type { Event } from '@/lib/types';

export default function ArtistDashboardPage() {
  const { user } = useAuth();

  // In a real app, you'd fetch events for this artistId
  const artistEvents: Event[] = []; 

  const upcomingEvents = artistEvents.filter(e => e.status === 'Upcoming');
  const liveEvents = artistEvents.filter(e => e.status === 'Live');
  const pastEvents = artistEvents.filter(e => e.status === 'Past');

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">Welcome, {user?.name}!</h1>
      <p className="text-muted-foreground mb-6">Here's a summary of your events.</p>
      
      <Alert className="mb-6">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Account Status: Pending Verification</AlertTitle>
        <AlertDescription>
          Your account is currently pending verification. You can create free events, but paid events are disabled until your account is approved by an admin.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
          <TabsTrigger value="live">Live ({liveEvents.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastEvents.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {upcomingEvents.map(event => <EventCard key={event.id} item={event} />)}
            </div>
          ) : <p className="text-muted-foreground text-center py-8">No upcoming events.</p>}
        </TabsContent>
        <TabsContent value="live">
          {liveEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {liveEvents.map(event => <EventCard key={event.id} item={event} />)}
            </div>
          ) : <p className="text-muted-foreground text-center py-8">No events are currently live.</p>}
        </TabsContent>
        <TabsContent value="past">
          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {pastEvents.map(event => <EventCard key={event.id} item={event} />)}
            </div>
          ) : <p className="text-muted-foreground text-center py-8">No past events found.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
