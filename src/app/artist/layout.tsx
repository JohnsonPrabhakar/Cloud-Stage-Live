
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { LayoutDashboard, PlusCircle, User, BarChart, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

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
  
  const isActive = (href: string) => pathname === href;

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
                  isActive(item.href) ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
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
