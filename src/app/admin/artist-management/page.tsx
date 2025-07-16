
'use client';

import { useAuth } from '@/hooks/use-auth';
import type { User } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ArtistManagementPage() {
    const { registeredUsers } = useAuth();
    const artists = registeredUsers.filter(u => u.role === 'artist' && u.applicationStatus === 'approved');

    const getArtistImageUrl = (artist: User) => {
        return artist.profilePictureUrl || `https://api.dicebear.com/8.x/lorelei/svg?seed=${artist.email}`;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Artist Management</CardTitle>
                <CardDescription>A list of all approved artists on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Artist</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {artists.map((artist: User) => (
                            <TableRow key={artist.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={getArtistImageUrl(artist)} />
                                            <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{artist.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{artist.email}</TableCell>
                                <TableCell>{artist.phoneNumber || 'N/A'}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{artist.applicationStatus}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
