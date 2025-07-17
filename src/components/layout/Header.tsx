
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlignJustify, User, LogOut, LayoutDashboard, Ticket, Settings, Mic } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Logo } from '@/components/Logo';
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { Role } from '@/lib/types';

const navLinks = [
  { href: '/events', label: 'Events', auth: false },
  { href: '/movies', label: 'Movies', auth: false },
  { href: '/subscriptions', label: 'Subscriptions', auth: true, roles: ['user'] as Role[] },
];

export default function Header() {
  const { user, role, logout } = useAuth();

  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  
  const visibleNavLinks = navLinks.filter(link => {
    if (!link.auth) return true;
    if (!user) return false;
    if (link.roles && !link.roles.includes(role)) return false;
    return true;
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>
        
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <AlignJustify />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
               <div className="py-4">
                <SheetClose asChild>
                  <Logo />
                </SheetClose>
              </div>
              <nav className="flex flex-col gap-4">
                {visibleNavLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="md:hidden">
            <Logo />
          </div>
          <nav className="hidden md:flex md:items-center md:gap-6 text-sm">
            {visibleNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profilePictureUrl || `https://api.dicebear.com/8.x/lorelei/svg?seed=${user.email}`} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {role === 'user' && (
                    <>
                      <DropdownMenuItem asChild><Link href="/user-dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href="/my-tickets"><Ticket className="mr-2 h-4 w-4" />My Tickets</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href="/artist-register"><Mic className="mr-2 h-4 w-4" />Become an Artist</Link></DropdownMenuItem>
                    </>
                  )}
                  {role === 'artist' && (
                     <DropdownMenuItem asChild><Link href="/artist/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Artist Dashboard</Link></DropdownMenuItem>
                  )}
                  {role === 'admin' && (
                     <DropdownMenuItem asChild><Link href="/admin"><LayoutDashboard className="mr-2 h-4 w-4" />Admin Dashboard</Link></DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild><Link href="/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-x-2">
                <Button asChild variant="ghost"><Link href="/user-login">Login</Link></Button>
                <Button asChild><Link href="/artist-register">Become an Artist</Link></Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
