'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const isSuccess = login(email, password);

    if (isSuccess) {
        if(email === 'admin@cloudstage.live') {
            toast({ title: 'Admin Login Successful', description: 'Welcome, Admin!' });
        } else {
            toast({ title: 'Artist Login Successful', description: 'Welcome back!' });
        }
    } else {
        toast({
            title: 'Login Failed',
            description: 'Please check your credentials or await admin approval.',
            variant: 'destructive'
        });
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Artist & Admin Login</CardTitle>
            <CardDescription>
              Access your dashboard to manage your content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@cloudstage.live" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">Login</Button>
            <p className="text-center text-sm text-muted-foreground">
              Not an artist?{' '}
              <Link href="/user-login" className="font-semibold text-primary hover:underline">
                User Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
