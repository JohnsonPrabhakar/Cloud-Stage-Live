
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PolicyContent = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle className="font-headline">{title}</DialogTitle>
        <DialogDescription>
          Last updated: {new Date().toLocaleDateString()}.
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="h-96 pr-6">
        <div className="prose prose-sm dark:prose-invert">
         {children}
        </div>
      </ScrollArea>
    </DialogContent>
)

export default function ArtistRegisterPage() {
  const { artistRegister } = useAuth();

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeRefund, setAgreeRefund] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [artistImage, setArtistImage] = useState<string | null>(null);
  
  const canSubmit = agreeTerms && agreeRefund && agreePrivacy;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setArtistImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const newApplication = {
        name: data.name as string,
        email: data.email as string,
        password: data.password as string,
        contactNumber: data.contactNumber as string,
        location: data.location as string,
        category: data.category as string,
        profileLink: data.profileLink as string,
        description: data.description as string,
        artistImageUrl: artistImage ?? undefined,
    };
    
    artistRegister(newApplication);
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Become an Artist</CardTitle>
            <CardDescription>
              Join CloudStage Live to host your events and connect with a global audience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Artist/Band Name</Label>
                <Input id="name" name="name" placeholder="Your performance name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="contact@yourband.com" required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input id="contactNumber" name="contactNumber" type="tel" placeholder="+1 234 567 890" required />
              </div>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" placeholder="e.g., New York, USA" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                     <Select name="category" required>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="music">Music</SelectItem>
                          <SelectItem value="stand-up">Stand-up</SelectItem>
                          <SelectItem value="yoga">Yoga</SelectItem>
                          <SelectItem value="talk-show">Talk Show</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                           <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="profileLink">YouTube / Instagram Link</Label>
                <Input id="profileLink" name="profileLink" placeholder="A link to your work for our reference" required />
            </div>

             <div className="space-y-2">
                <Label htmlFor="artistImage">Artist/Band Image</Label>
                <Input id="artistImage" name="artistImage" type="file" required onChange={handleImageChange} accept="image/*"/>
                <p className="text-xs text-muted-foreground">Upload a high-quality photo.</p>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="description">About You / Your Band</Label>
                <Textarea id="description" name="description" placeholder="Tell us about yourself..." className="min-h-[120px]" required />
            </div>

            <div className="space-y-4 pt-4">
              <div className="items-top flex space-x-2">
                <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(checked) => setAgreeTerms(Boolean(checked))} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I agree to the <Dialog><DialogTrigger asChild><Button variant="link" className="p-0 h-auto">Terms & Conditions</Button></DialogTrigger><PolicyContent title="Terms & Conditions"><p>This is a placeholder for the Terms & Conditions.</p></PolicyContent></Dialog>.
                  </label>
                </div>
              </div>
              <div className="items-top flex space-x-2">
                <Checkbox id="refund" checked={agreeRefund} onCheckedChange={(checked) => setAgreeRefund(Boolean(checked))}/>
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="refund" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I accept the <Dialog><DialogTrigger asChild><Button variant="link" className="p-0 h-auto">Refund Policy</Button></DialogTrigger><PolicyContent title="Refund Policy"><p>This is a placeholder for the Refund Policy.</p></PolicyContent></Dialog>.
                  </label>
                </div>
              </div>
              <div className="items-top flex space-x-2">
                <Checkbox id="privacy" checked={agreePrivacy} onCheckedChange={(checked) => setAgreePrivacy(Boolean(checked))}/>
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="privacy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I have read the <Dialog><DialogTrigger asChild><Button variant="link" className="p-0 h-auto">Privacy Policy</Button></DialogTrigger><PolicyContent title="Privacy Policy"><p>This is a placeholder for the Privacy Policy.</p></PolicyContent></Dialog>.
                  </label>
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={!canSubmit}>
              Submit Application
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an artist account?{' '}
              <Link href="/admin-login" className="font-semibold text-primary hover:underline">
                Login here
              </Link>
            </p>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
