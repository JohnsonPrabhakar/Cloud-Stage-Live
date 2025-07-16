'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function EditArtistProfilePage() {
    const { user } = useAuth();
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Profile Updated",
            description: "Your changes have been saved successfully."
        });
    };

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

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
                            <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.email}`} />
                            <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                             <Label htmlFor="picture">Profile Picture</Label>
                             <Input id="picture" type="file" />
                             <p className="text-xs text-muted-foreground">Upload a new profile picture.</p>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="name">Artist/Band Name</Label>
                        <Input id="name" defaultValue={user.name} />
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
