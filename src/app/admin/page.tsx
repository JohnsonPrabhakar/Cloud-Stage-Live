
'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Event } from '@/lib/types';
import { Check, X, Eye, Calendar, DollarSign, Tag, Languages } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

const EventDetailsDialog = ({ event }: { event: Event }) => (
    <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
            <DialogTitle className="font-headline text-2xl">{event.title}</DialogTitle>
            <DialogDescription>By {event.artist}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
            <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                <Image
                    src={event.thumbnailUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                    unoptimized
                />
            </div>

            <div>
                <h3 className="font-semibold font-headline mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{event.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 mt-1 text-primary"/>
                    <div>
                        <h4 className="font-semibold">Date & Time</h4>
                        <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 mt-1 text-primary"/>
                    <div>
                        <h4 className="font-semibold">Price</h4>
                        <p className="text-sm text-muted-foreground">Rs. {event.price}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Tag className="h-5 w-5 mt-1 text-primary"/>
                    <div>
                        <h4 className="font-semibold">Category</h4>
                        <div className="text-sm text-muted-foreground"><Badge variant="secondary">{event.category}</Badge></div>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Languages className="h-5 w-5 mt-1 text-primary"/>
                    <div>
                        <h4 className="font-semibold">Language</h4>
                        <p className="text-sm text-muted-foreground">{event.language}</p>
                    </div>
                </div>
            </div>
        </div>
    </DialogContent>
);


export default function AdminEventManagementPage() {
    const { events, updateEventApproval } = useAuth();
    
    const handleApproval = (eventId: string, status: 'Approved' | 'Rejected') => {
        updateEventApproval(eventId, status);
    };

    const pendingEvents = events.filter(e => e.approvalStatus === 'Pending');
    const approvedEvents = events.filter(e => e.approvalStatus === 'Approved');
    const rejectedEvents = events.filter(e => e.approvalStatus === 'Rejected');

    const EventTable = ({ events, showActions }: { events: Event[], showActions: boolean }) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Artist</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {events.map(event => (
                    <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{event.artist}</TableCell>
                        <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                        <TableCell>Rs. {event.price}</TableCell>
                        <TableCell className="text-right space-x-1">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <EventDetailsDialog event={event} />
                            </Dialog>
                            {showActions && (
                                <>
                                    <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700" onClick={() => handleApproval(event.id, 'Approved')}>
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleApproval(event.id, 'Rejected')}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-6">Event Management</h1>
            <Tabs defaultValue="pending">
                <TabsList>
                    <TabsTrigger value="pending">Pending ({pendingEvents.length})</TabsTrigger>
                    <TabsTrigger value="approved">Approved ({approvedEvents.length})</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected ({rejectedEvents.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                    {pendingEvents.length > 0 ? <EventTable events={pendingEvents} showActions={true} /> : <p className="text-muted-foreground p-8 text-center">No pending events.</p>}
                </TabsContent>
                <TabsContent value="approved">
                     {approvedEvents.length > 0 ? <EventTable events={approvedEvents} showActions={false} /> : <p className="text-muted-foreground p-8 text-center">No approved events.</p>}
                </TabsContent>
                <TabsContent value="rejected">
                     {rejectedEvents.length > 0 ? <EventTable events={rejectedEvents} showActions={false} /> : <p className="text-muted-foreground p-8 text-center">No rejected events.</p>}
                </TabsContent>
            </Tabs>
        </div>
    );
}
