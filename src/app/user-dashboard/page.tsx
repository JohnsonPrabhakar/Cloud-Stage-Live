
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Ticket, User, Settings, Clapperboard, Calendar, Star } from 'lucide-react';
import { EventCard } from '@/components/EventCard';

export default function UserDashboardPage() {
  const { user, isLoading, events, myTickets } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/user-login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const myTicketEventIds = new Set(myTickets.map(t => t.eventId));
  const upcomingEvents = events
    .filter(e => myTicketEventIds.has(e.id) && e.status === 'Upcoming')
    .slice(0, 3);
    
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Welcome, {user.name}!</h1>
        <p className="text-muted-foreground">Here's your personal dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">My Tickets</CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{myTickets.length}</div>
                <p className="text-xs text-muted-foreground">Total tickets purchased</p>
                <Button asChild size="sm" className="mt-4 w-full">
                    <Link href="/my-tickets">View All Tickets</Link>
                </Button>
            </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">My Profile</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                 <div className="text-2xl font-bold truncate">{user.email}</div>
                <p className="text-xs text-muted-foreground">Your personal information</p>
                <Button asChild size="sm" variant="outline" className="mt-4 w-full">
                    <Link href="/profile">Edit Profile</Link>
                </Button>
            </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">My Subscription</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                 <div className="text-2xl font-bold">{user.subscription ? 'Premium' : 'None'}</div>
                <p className="text-xs text-muted-foreground">
                    {user.subscription ? `${user.subscription.eventCount} credits left` : 'Unlock exclusive benefits'}
                </p>
                <Button asChild size="sm" className="mt-4 w-full">
                    <Link href="/subscriptions">{user.subscription ? 'Manage Subscription' : 'Upgrade to Premium'}</Link>
                </Button>
            </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-headline font-bold mb-4">Your Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map(event => (
                    <EventCard key={event.id} item={event} hasTicket={true} />
                ))}
            </div>
        ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h3 className="text-xl font-headline">No Upcoming Events</h3>
                <p className="text-muted-foreground mt-2">
                    You haven't purchased tickets for any upcoming events yet.
                </p>
                <Button asChild className="mt-4">
                    <Link href="/events">Explore Events</Link>
                </Button>
            </div>
        )}
      </div>

    </div>
  );
}
