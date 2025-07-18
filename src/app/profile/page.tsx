
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Upload } from 'lucide-react';
import type React from 'react';

export default function ProfilePage() {
  const { user, isLoading, updateUserProfile } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [interests, setInterests] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newImageSelected, setNewImageSelected] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/user-login');
    }
    if (user) {
        setName(user.name);
        setInterests(user.interests?.join(', ') || 'Music, Comedy, Technology');
        setImagePreview(user.profilePictureUrl || `https://api.dicebear.com/8.x/lorelei/svg?seed=${user.email}`);
    }
  }, [user, isLoading, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const tempUrl = URL.createObjectURL(file);
      setImagePreview(tempUrl);
      setNewImageSelected(true);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const profileUpdate: Partial<Omit<typeof user, 'id' | 'email'>> = {
        name,
        interests: interests.split(',').map(i => i.trim()),
    };
    
    if (newImageSelected) {
        // Simulate a new image upload by generating a new unique avatar URL
        profileUpdate.profilePictureUrl = `https://api.dicebear.com/8.x/lorelei/svg?seed=${user.email}-${Date.now()}`;
    }

    updateUserProfile(profileUpdate);
    setNewImageSelected(false);
  }

  if (isLoading || !user) {
    return <p className="p-8 text-center">Loading your profile...</p>;
  }

  const getInitials = (nameStr: string) => nameStr ? nameStr.split(' ').map(n => n[0]).join('').toUpperCase() : '';

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
                      {imagePreview && <AvatarImage src={imagePreview} alt={user.name} />}
                      <AvatarFallback className="text-3xl">{getInitials(name)}</AvatarFallback>
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
                         <Label>Profile Picture</Label>
                         <div className="flex items-center gap-4">
                            <Input 
                                id="picture" 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageChange} 
                                className="hidden"
                                ref={fileInputRef}
                                />
                             <Button type="button" variant="outline" onClick={handleUploadClick}>
                                 <Upload className="mr-2 h-4 w-4" />
                                 Change Image
                             </Button>
                             <p className="text-sm text-muted-foreground">Upload a new profile picture.</p>
                         </div>
                    </div>
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
