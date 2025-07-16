
'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, Eye, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import type { ArtistApplication } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ApplicationDetails = ({ app }: { app: ArtistApplication }) => (
    <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
            <DialogTitle className="font-headline flex items-center gap-4">
                 <Avatar className="h-16 w-16">
                    <AvatarImage src={app.artistImageUrl || `https://api.dicebear.com/8.x/lorelei/svg?seed=${app.email}`} alt={app.name} />
                    <AvatarFallback>{app.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{app.name}</span>
            </DialogTitle>
            <DialogDescription>{app.email}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-semibold text-muted-foreground col-span-1">Location</span>
                <span className="col-span-3">{app.location}</span>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-semibold text-muted-foreground col-span-1">Category</span>
                <span className="col-span-3"><Badge variant="secondary">{app.category}</Badge></span>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-semibold text-muted-foreground col-span-1">Contact</span>
                <span className="col-span-3">{app.contactNumber}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-semibold text-muted-foreground col-span-1">Profile</span>
                <Link href={app.profileLink} target="_blank" className="col-span-3 text-primary hover:underline truncate">{app.profileLink}</Link>
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
                <span className="text-right font-semibold text-muted-foreground col-span-1 pt-1">Bio</span>
                <p className="col-span-3 text-sm">{app.description}</p>
            </div>
            {app.status === 'Rejected' && app.rejectionReason && (
                 <div className="grid grid-cols-4 items-start gap-4">
                    <span className="text-right font-semibold text-muted-foreground col-span-1 pt-1">Rejection Reason</span>
                    <p className="col-span-3 text-sm text-destructive">{app.rejectionReason}</p>
                </div>
            )}
        </div>
    </DialogContent>
);


const RejectionDialog = ({ app, onConfirm }: { app: ArtistApplication, onConfirm: (id: string, reason: string) => void }) => {
    const [reason, setReason] = useState('');
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Reject Application: {app.name}</DialogTitle>
                <DialogDescription>
                    Please provide a reason for rejecting this application. This will be visible to the applicant.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid w-full gap-1.5">
                    <Label htmlFor="reason">Rejection Reason</Label>
                    <Textarea placeholder="Type your message here." id="reason" value={reason} onChange={(e) => setReason(e.target.value)} />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button type="button" variant="destructive" onClick={() => onConfirm(app.id, reason)} disabled={!reason.trim()}>
                        Confirm Rejection
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}

export default function ArtistRegistrationsPage() {
  const { artistApplications, updateApplicationStatus } = useAuth();
  const [selectedApp, setSelectedApp] = useState<ArtistApplication | null>(null);

  const handleApprove = (id: string) => {
    updateApplicationStatus(id, 'Approved');
  };

  const handleRejectConfirm = (id: string, reason: string) => {
    updateApplicationStatus(id, 'Rejected', reason);
    setSelectedApp(null);
  }

  const pendingApps = artistApplications.filter(app => app.status.toLowerCase() === 'pending');

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Artist Registrations</h1>
      <p className="text-muted-foreground mb-4">Review and approve new artists joining the platform.</p>

      {pendingApps.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Artist Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingApps.map(app => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.name}</TableCell>
                <TableCell>{app.email}</TableCell>
                <TableCell><Badge variant="outline">{app.category}</Badge></TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                     <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <ApplicationDetails app={app} />
                     </Dialog>
                    <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700" onClick={() => handleApprove(app.id)}>
                        <Check className="h-4 w-4" />
                    </Button>
                    <Dialog onOpenChange={(open) => !open && setSelectedApp(null)}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => setSelectedApp(app)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        {selectedApp && selectedApp.id === app.id && <RejectionDialog app={selectedApp} onConfirm={handleRejectConfirm} />}
                     </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-muted-foreground p-8 text-center">No pending artist registrations.</p>
      )}
    </div>
  );
}
