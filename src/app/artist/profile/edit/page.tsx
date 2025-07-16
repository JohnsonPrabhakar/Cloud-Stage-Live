
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect, useRef } from "react";
import type React from "react";
import { Upload } from "lucide-react";

export default function EditArtistProfilePage() {
    const { user, updateUserProfile } = useAuth();
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setImagePreview(user.profilePictureUrl || `https://api.dicebear.com/8.x/lorelei/svg?seed=${user.email}`);
        }
    }, [user]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUserProfile({
            name,
            profilePictureUrl: imagePreview ?? undefined,
        });
        toast({
            title: "Profile Updated",
            description: "Your changes have been saved successfully."
        });
    };

    const getInitials = (name: string) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '';

    if (!user) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Edit Artist Profile</CardTitle>
                <CardDescription>Keep your profile up-to-date to attract more fans.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                            {imagePreview && <AvatarImage src={imagePreview} />}
                            <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                             <Label>Profile Picture</Label>
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
                             <p className="text-xs text-muted-foreground">Upload a new profile picture.</p>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="name">Artist/Band Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="bio">Biography</Label>
                        <Textarea id="bio" placeholder="Tell your story..." className="min-h-[150px]" defaultValue="We are a band from..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="twitter">Twitter URL</Label>
                            <Input id="twitter" placeholder="https://twitter.com/yourhandle" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="instagram">Instagram URL</Label>
                            <Input id="instagram" placeholder="https://instagram.com/yourhandle" />
                        </div>
                    </div>

                     <div className="flex justify-end">
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
