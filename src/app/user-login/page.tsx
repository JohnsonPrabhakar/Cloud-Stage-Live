
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import type { TabsProps } from '@radix-ui/react-tabs';

export default function UserLoginPage() {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(loginEmail, loginPassword);
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const success = register(registerName, registerEmail, registerPassword, registerPhone);
    if (success) {
        setActiveTab('login');
        setLoginEmail(registerEmail); // Pre-fill login form
        setLoginPassword('');
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setRegisterPhone('');
    }
  };

  const onTabChange: TabsProps['onValueChange'] = (value) => {
    if (value) setActiveTab(value);
  }

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <form onSubmit={handleLogin}>
              <CardHeader>
                <CardTitle className="font-headline">Login to Your Account</CardTitle>
                <CardDescription>
                  Enter your credentials to access your dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="you@example.com" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full">Login</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <form onSubmit={handleRegister}>
              <CardHeader>
                <CardTitle className="font-headline">Create an Account</CardTitle>
                <CardDescription>
                  Join our community of live event enthusiasts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input id="register-name" placeholder="Your Name" required value={registerName} onChange={(e) => setRegisterName(e.target.value)}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input id="register-email" type="email" placeholder="you@example.com" required value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="register-phone">Phone Number</Label>
                  <Input id="register-phone" type="tel" placeholder="Your phone number" required value={registerPhone} onChange={(e) => setRegisterPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input id="register-password" type="password" required value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full">Register</Button>
                <p className="text-center text-sm text-muted-foreground">
                  Want to host events?{' '}
                  <Link href="/artist-register" className="font-semibold text-primary hover:underline">
                    Become an artist
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
