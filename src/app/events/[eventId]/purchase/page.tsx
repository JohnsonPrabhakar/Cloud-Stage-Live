
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, PartyPopper } from 'lucide-react';
import type { Event } from '@/lib/types';
import { mockEvents } from '@/lib/mock-data';


export default function PurchasePage({ params }: { params: { eventId: string } }) {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/user-login');
    }
  }, [user, isLoading, router]);
  
  useEffect(() => {
    const foundEvent = mockEvents.find(e => e.id === params.eventId);
    if (foundEvent) {
      setEvent(foundEvent);
    } else {
      router.push('/events');
    }
  }, [params.eventId, router]);

  const handlePurchase = () => {
    // In a real app, this would involve a payment gateway integration.
    // For now, we'll simulate a successful purchase.
    setIsPurchased(true);
    toast({
      title: 'Purchase Successful!',
      description: `You now have a ticket for ${event?.title}.`,
    });
  };

  if (isLoading || !user || !event) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (isPurchased) {
    return (
        <div className="container mx-auto flex flex-col items-center justify-center text-center py-20">
            <PartyPopper className="w-16 h-16 text-accent mb-4" />
            <h1 className="text-3xl font-headline font-bold mb-2">You're All Set!</h1>
            <p className="text-muted-foreground mb-6">Your ticket for "{event.title}" is confirmed.</p>
            <div className="flex gap-4">
                <Button asChild>
                    <Link href={`/events/${event.id}`}>Go to Event Page</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/my-tickets">View All My Tickets</Link>
                </Button>
            </div>
        </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href={`/events/${params.eventId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Event
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Confirm Your Ticket</CardTitle>
          <CardDescription>You're about to purchase a ticket for "{event.title}".</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Event</span>
              <span className="font-semibold">{event.title}</span>
            </div>
             <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Artist</span>
              <span className="font-semibold">{event.artist}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold text-primary pt-4 border-t">
              <span>Total</span>
              <span>{event.price > 0 ? `₹${event.price}` : 'Free'}</span>
            </div>

            <Button onClick={handlePurchase} className="w-full mt-6" size="lg">
                <CreditCard className="mr-2 h-4 w-4" />
                {event.price > 0 ? `Pay ₹${event.price}` : 'Get Free Ticket'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
