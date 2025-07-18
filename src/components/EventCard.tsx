
'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Event } from '@/lib/types';
import { Calendar, Ticket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EventCardProps {
    item: Event;
    hasTicket?: boolean;
    isArtistView?: boolean;
}

export function EventCard({ item, hasTicket = false, isArtistView = false }: EventCardProps) {
  const { id, title, artist, date, status, thumbnailUrl, price } = item;
  const { toast } = useToast();
  
  const getBadgeVariant = (status: Event['status']) => {
    switch (status) {
      case 'Live':
        return 'destructive';
      case 'Upcoming':
        return 'default';
      case 'Past':
        return 'secondary';
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (hasTicket && status === 'Upcoming') {
      e.preventDefault();
      toast({
        title: 'Event Not Live',
        description: 'This event has not started yet. Please check back later.',
        variant: 'destructive',
      });
    }
  };

  const renderButtonContent = () => {
    if (isArtistView) {
        return <>View Event</>;
    }
    if (hasTicket) {
        return <>Watch Now</>;
    }
    return <><Ticket className="mr-2 h-4 w-4"/>Get Ticket</>;
  };

  return (
    <Card className="w-full overflow-hidden flex flex-col h-full transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <Link href={`/events/${id}`} onClick={handleButtonClick}>
          <Image
            src={thumbnailUrl}
            alt={title}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
            data-ai-hint="event poster"
            unoptimized
          />
        </Link>
        <Badge variant={getBadgeVariant(status)} className="absolute top-2 right-2">
          {status}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-xl mb-2 leading-tight">
          <Link href={`/events/${id}`} onClick={handleButtonClick}>{title}</Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground font-medium">{artist}</p>
        <div className="flex items-center text-sm text-muted-foreground mt-2">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-muted/50">
        <div className="font-bold text-lg text-primary">
          {price > 0 ? `Rs. ${price}` : 'Free'}
        </div>
        <Button asChild>
          <Link href={`/events/${id}`} onClick={handleButtonClick}>
            {renderButtonContent()}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
