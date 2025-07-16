'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Event } from '@/lib/types';
import { Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminEventManagementPage() {
    const { toast } = useToast();
    
    // In a real app, this state would be managed via API calls
    const [events, setEvents] = useState<Event[]>([]);

    const handleApproval = (eventId: string, status: 'Approved' | 'Rejected') => {
        // In a real app, you'd make an API call here.
        setEvents(prevEvents => prevEvents.map(e => e.id === eventId ? {...e, approvalStatus: status} : e));
        toast({
            title: `Event ${status}`,
            description: `The event has been successfully ${status.toLowerCase()}.`
        });
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
                    {showActions && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {events.map(event => (
                    <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{event.artist}</TableCell>
                        <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                        <TableCell>₹{event.price}</TableCell>
                        {showActions && (
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700" onClick={() => handleApproval(event.id, 'Approved')}>
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleApproval(event.id, 'Rejected')}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        )}
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
