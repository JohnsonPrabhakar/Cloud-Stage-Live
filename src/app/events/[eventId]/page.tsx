
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Languages, Ticket, User, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Event } from '@/lib/types';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function EventDetailPage({ params }: { params: { eventId: string } }) {
  const { events, myTickets } = useAuth();
  const eventId = params.eventId;
  const [event, setEvent] = useState<Event | null>(null);
  const { toast } = useToast();
  
  const hasTicket = myTickets.some(ticket => ticket.eventId === eventId);

  useEffect(() => {
    if (eventId) {
      const foundEvent = events.find(e => e.id === eventId);
      setEvent(foundEvent || null);
    }
  }, [eventId, events]);

  const handleWatchNowClick = () => {
    if (event?.status === 'Upcoming') {
      toast({
        title: 'Event Not Live',
        description: 'This event has not started yet. Please check back later.',
        variant: 'destructive',
      });
    }
  };

  if (!event) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-headline">Event not found.</h1>
         <Button asChild variant="outline">
            <Link href="/events">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Events
            </Link>
        </Button>
      </div>
    );
  }
  
  const canWatch = hasTicket && (event.status === 'Live' || event.status === 'Past');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
            <Button asChild variant="outline">
                <Link href="/events">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to All Events
                </Link>
            </Button>
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {canWatch ? (
            <div className="aspect-video w-full mb-8 rounded-lg overflow-hidden bg-black">
              <iframe
                className="w-full h-full"
                src={event.videoUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
                <Image
                  src={event.thumbnailUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                  data-ai-hint="event banner"
                  unoptimized
                />
            </div>
          )}

          <h1 className="text-3xl md:text-5xl font-headline font-bold text-primary mb-4">{event.title}</h1>
          <p className="text-base md:text-lg text-foreground mb-8">{event.description}</p>
          
        </div>
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <User className="h-5 w-5 mt-1 text-primary"/>
                <div>
                  <h3 className="font-semibold">Artist</h3>
                  <p className="text-muted-foreground">{event.artist}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="h-5 w-5 mt-1 text-primary"/>
                <div>
                  <h3 className="font-semibold">Date & Time</h3>
                  <p className="text-muted-foreground">{new Date(event.date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
                </div>
              </div>
               <div className="flex items-start gap-4">
                <Tag className="h-5 w-5 mt-1 text-primary"/>
                <div>
                    <h3 className="font-semibold">Category</h3>
                    <div className="text-sm text-muted-foreground">
                        <Badge variant="secondary">{event.category}</Badge>
                    </div>
                </div>
              </div>
               <div className="flex items-start gap-4">
                <Languages className="h-5 w-5 mt-1 text-primary"/>
                 <div>
                  <h3 className="font-semibold">Language</h3>
                  <p className="text-muted-foreground">{event.language}</p>
                </div>
              </div>
            </CardContent>
            <div className="p-4 md:p-6">
              {hasTicket ? (
                 <Button className="w-full" size="lg" onClick={handleWatchNowClick} disabled={!canWatch}>Watch Now</Button>
              ) : (
                 <Button asChild className="w-full" size="lg">
                    <Link href={`/events/${event.id}/purchase`}>
                        <Ticket className="mr-2 h-4 w-4"/>
                        Get Ticket {event.price > 0 ? `Rs. ${event.price}` : '(Free)'}
                    </Link>
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
