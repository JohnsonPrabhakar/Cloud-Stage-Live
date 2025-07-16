
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Check, Eye, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

type ArtistApplication = {
  id: string;
  name: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  location: string;
  category: string;
  contactNumber: string;
  profileLink: string;
  description: string;
};

// In a real app, this would be fetched from an API
const initialApplications: ArtistApplication[] = [];

const ApplicationDetails = ({ app }: { app: ArtistApplication }) => (
    <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
            <DialogTitle className="font-headline flex items-center gap-4">
                 <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${app.email}`} />
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
        </div>
    </DialogContent>
);

export default function ArtistRegistrationsPage() {
  const { toast } = useToast();
  const [applications, setApplications] = useState(initialApplications);

  const handleStatusChange = (id: string, status: 'Approved' | 'Rejected') => {
    // In a real app, you would make an API call to update the status.
    setApplications(apps => apps.map(app => app.id === id ? { ...app, status } : app));
    toast({
      title: `Application ${status}`,
      description: `An email notification has been sent to the artist.`
    });
  };

  const pendingApps = applications.filter(app => app.status === 'Pending');

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
                    <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700" onClick={() => handleStatusChange(app.id, 'Approved')}>
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleStatusChange(app.id, 'Rejected')}>
                        <X className="h-4 w-4" />
                    </Button>
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
