'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { LayoutDashboard, Music, User, BarChart, PlusCircle, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Logo />
          {menuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                  "flex items-center gap-2 transition-colors hover:text-foreground",
                  pathname === item.href ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
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
