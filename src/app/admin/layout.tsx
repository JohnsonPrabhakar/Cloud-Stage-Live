'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from '@/components/ui/sidebar';
import { LayoutDashboard, Music, User, BarChart, PlusCircle, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/Logo';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && role !== 'admin') {
      router.push('/admin-login');
    }
  }, [role, isLoading, router]);

  if (isLoading || role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading admin panel...</p>
      </div>
    );
  }
  
  const menuItems = [
    { href: '/admin', label: 'Event Management', icon: Music },
    { href: '/admin/artist-registrations', label: 'Artist Registrations', icon: UserCheck },
    { href: '/admin/add-movie', label: 'Add Movie', icon: PlusCircle },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart },
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
              <h1 className="text-xl font-semibold font-headline">Admin Panel</h1>
            </div>
        </header>
        <div className="p-4 md:p-8">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
