
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ArtistVerifyPage() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Verification Submitted",
            description: "Your request has been sent to the admin team for review."
        });
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Artist Verification</CardTitle>
                <CardDescription>
                    Submit your documents to get verified and unlock paid events, and a verified badge on your profile.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Legal Full Name</Label>
                        <Input id="fullName" placeholder="As it appears on your ID" required/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="idProof">Government-issued ID</Label>
                        <Input id="idProof" type="file" required />
                         <p className="text-xs text-muted-foreground">Please upload a clear image of your Passport, Driver's License, or National ID.</p>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="addressProof">Proof of Address</Label>
                        <Input id="addressProof" type="file" required />
                        <p className="text-xs text-muted-foreground">e.g., A recent utility bill or bank statement.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="videoLink">Performance Video Link</Label>
                        <Input id="videoLink" placeholder="e.g., https://youtube.com/watch?v=..." required />
                        <p className="text-xs text-muted-foreground">A link to a live performance video for verification.</p>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit">Submit for Verification</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
