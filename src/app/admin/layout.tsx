
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Music, UserCheck, BarChart, Users, UserSquare, Film, AlignJustify } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

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
      router.push('/user-login');
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
    { href: '/admin/artist-management', label: 'Artist Management', icon: UserSquare },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/movies', label: 'Movies', icon: Film },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };
  
  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    menuItems.map(item => (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
            "flex items-center gap-2 transition-colors hover:text-foreground",
            isActive(item.href) ? "text-foreground" : "text-muted-foreground",
            mobile ? "text-lg font-medium" : "text-sm"
        )}
      >
        <item.icon className="h-4 w-4" />
        <span>{item.label}</span>
        {item.notificationCount && item.notificationCount > 0 ? (
          <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
            {item.notificationCount}
          </Badge>
        ) : null}
      </Link>
    ))
  );

  return (
    <div className="flex min-h-screen w-full flex-col">
       <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-40">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 lg:gap-6">
          <NavLinks />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <AlignJustify className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="py-4">
              <Logo />
            </div>
            <nav className="grid gap-6 text-lg font-medium">
              <NavLinks mobile />
            </nav>
          </SheetContent>
        </Sheet>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
