
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { LayoutDashboard, PlusCircle, User, BarChart, CheckCircle, AlignJustify } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

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
      router.push('/user-login');
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
            <div className='py-4'>
                <Logo />
            </div>
            <nav className="grid gap-6 text-lg font-medium">
              <NavLinks mobile/>
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
