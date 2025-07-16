
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Music, PlusCircle, UserCheck, BarChart, Users, UserSquare, Film } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isLoading, artistApplications, events } = useAuth();
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

  const pendingEventCount = events.filter(e => e.approvalStatus === 'Pending').length;
  const pendingArtistCount = artistApplications.filter(app => app.status === 'Pending').length;
  
  const menuItems = [
    { href: '/admin', label: 'Event Management', icon: Music, notificationCount: pendingEventCount },
    { href: '/admin/artist-registrations', label: 'Artist Registrations', icon: UserCheck, notificationCount: pendingArtistCount },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/artist-management', label: 'Artists', icon: UserSquare },
    { href: '/admin/movies', label: 'Movies', icon: Film },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          {menuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                  "flex items-center gap-2 transition-colors hover:text-foreground",
                  pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin') ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
              {item.notificationCount && item.notificationCount > 0 && (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {item.notificationCount}
                </Badge>
              )}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
