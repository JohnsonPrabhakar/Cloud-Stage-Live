'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [interests, setInterests] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/user-login');
    }
    if (user) {
        setName(user.name);
        setInterests(user.interests?.join(', ') || 'Music, Comedy, Technology');
    }
  }, [user, isLoading, router]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd call an API to update the user's profile
    toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully."
    });
  }

  if (isLoading || !user) {
    return <p className="p-8 text-center">Loading your profile...</p>;
  }

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="container mx-auto max-w-2xl py-12">
        <div className="mb-8">
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
        </div>
        <h1 className="text-4xl font-headline font-bold mb-8 text-center">My Profile</h1>
        <Card>
            <CardHeader>
                <div className="flex flex-col items-center gap-4">
                     <Avatar className="h-24 w-24">
                      <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.email}`} alt={user.name} />
                      <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-2xl font-headline text-center">{name}</CardTitle>
                        <CardDescription className="text-center">{user.email}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={user.email} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="interests">My Interests</Label>
                        <Input id="interests" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="e.g., Music, Comedy..." />
                         <p className="text-xs text-muted-foreground">Separate interests with commas.</p>
                    </div>
                    <Button type="submit" className="w-full">Save Changes</Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
