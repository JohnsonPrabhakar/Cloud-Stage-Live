'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type ArtistApplication = {
  id: string;
  name: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

const mockApplications: ArtistApplication[] = [
  { id: 'app1', name: 'John Doe', email: 'john.d@example.com', status: 'Pending' },
  { id: 'app2', name: 'The Cool Cats', email: 'cats@band.com', status: 'Pending' },
  { id: 'app3', name: 'Sarah Smile', email: 'sarah.s@music.com', status: 'Approved' },
];

export default function ArtistRegistrationsPage() {
  const { toast } = useToast();
  const [applications, setApplications] = useState(mockApplications);

  const handleStatusChange = (id: string, status: 'Approved' | 'Rejected') => {
    setApplications(apps => apps.map(app => app.id === id ? { ...app, status } : app));
    toast({
      title: `Application ${status}`,
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
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingApps.map(app => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.name}</TableCell>
                <TableCell>{app.email}</TableCell>
                <TableCell>
                  <Badge variant={app.status === 'Pending' ? 'secondary' : app.status === 'Approved' ? 'default' : 'destructive'}>
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
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
