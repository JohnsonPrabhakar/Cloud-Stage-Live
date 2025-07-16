'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeRefund, setAgreeRefund] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  
  const canSubmit = agreeTerms && agreeRefund && agreePrivacy;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      toast({
        title: 'Agreement Required',
        description: 'You must agree to all policies to register.',
        variant: 'destructive',
      });
      return;
    }
    artistRegister({ name, email });
    toast({
      title: 'Registration Submitted',
      description: 'Your application is pending approval. Welcome!',
    });
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Become an Artist</CardTitle>
            <CardDescription>
              Join CloudStage Live to host your events and connect with a global audience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Artist/Band Name</Label>
                <Input id="name" placeholder="Your performance name" required value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="contact@yourband.com" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>
            <div className="space-y-4">
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
