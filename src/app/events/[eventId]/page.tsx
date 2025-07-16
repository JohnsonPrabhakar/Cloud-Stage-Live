
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Languages, MessageSquare, Ticket, User, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Event } from '@/lib/types';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function EventDetailPage() {
  const { events } = useAuth();
  const params = useParams();
  const eventId = params.eventId as string;
  const [event, setEvent] = useState<Event | null>(null);
  
  // This will need to be replaced with a real check based on the logged-in user
  const hasTicket = false;

  useEffect(() => {
    if (eventId) {
      const foundEvent = events.find(e => e.id === eventId);
      setEvent(foundEvent || null);
    }
  }, [eventId, events]);

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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          {hasTicket ? (
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
            <Image
              src={event.thumbnailUrl}
              alt={event.title}
              width={1280}
              height={720}
              className="w-full h-auto object-cover rounded-lg mb-8"
              data-ai-hint="event banner"
              unoptimized
            />
          )}

          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">{event.title}</h1>
          <p className="text-lg text-foreground mb-8">{event.description}</p>
          
           <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <MessageSquare /> Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">{hasTicket ? 'Chat is loading...' : 'Purchase a ticket to join the chat.'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
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
            <div className="p-6">
              {hasTicket ? (
                <Button disabled className="w-full"><Ticket className="mr-2 h-4 w-4"/> You have a ticket</Button>
              ) : (
                 <Button asChild className="w-full" size="lg">
                    <Link href={`/events/${event.id}/purchase`}>
                        <Ticket className="mr-2 h-4 w-4"/>
                        Get Ticket {event.price > 0 ? ` for Rs. ${event.price}` : '(Free)'}
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
