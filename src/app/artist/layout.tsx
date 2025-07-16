'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from '@/components/ui/sidebar';
import { LayoutDashboard, Music, User, BarChart, PlusCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';

export default function ArtistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && role !== 'artist') {
      router.push('/admin-login');
    }
  }, [role, isLoading, router]);

  if (isLoading || role !== 'artist') {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading artist dashboard...</p>
      </div>
    );
  }

  const menuItems = [
    { href: '/artist/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/artist/event/create', label: 'Create Event', icon: PlusCircle },
    { href: '/artist/profile/edit', label: 'Edit Profile', icon: User },
    { href: '/artist/analytics', label: 'Analytics', icon: BarChart },
    { href: '/artist/verify', label: 'Verification', icon: CheckCircle },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map(item => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                    <SidebarMenuButton isActive={pathname === item.href}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
            <div className='flex items-center gap-4'>
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-xl font-semibold font-headline">Artist Dashboard</h1>
            </div>
            <Button asChild><Link href="/artist/event/create"><PlusCircle className="mr-2 h-4 w-4" /> Create Event</Link></Button>
        </header>
        <div className="p-4 md:p-8">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
