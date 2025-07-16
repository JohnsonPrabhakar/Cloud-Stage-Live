'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/user-login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <p className="p-8 text-center">Loading settings...</p>;
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <h1 className="text-4xl font-headline font-bold mb-8 text-center">Account Settings</h1>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage how you receive notifications from us.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                <span>Email Notifications</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Receive updates about events and recommendations.
                </span>
              </Label>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                <span>Push Notifications</span>
                 <span className="font-normal leading-snug text-muted-foreground">
                  Get notified on your device when events go live.
                </span>
              </Label>
              <Switch id="push-notifications" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your experience on CloudStage Live.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                    <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                </Select>
             </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
            <Button>Save Preferences</Button>
        </div>
      </div>
    </div>
  );
}
