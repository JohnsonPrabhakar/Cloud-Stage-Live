'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import type { User, Role } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Mock session loading
    try {
      const storedUser = sessionStorage.getItem('user');
      const storedRole = sessionStorage.getItem('role') as Role;
      if (storedUser && storedRole) {
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
      }
    } catch (error) {
        console.error("Failed to parse session storage item.")
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, pass: string) => {
    setIsLoading(true);
    let loggedInUser: User | null = null;
    let loggedInRole: Role = null;

    if (email === 'admin@cloudstage.live' && pass === 'admin123') {
      loggedInUser = { id: 'admin', name: 'Admin', email };
      loggedInRole = 'admin';
      router.push('/admin');
    } else if (email.endsWith('@artist.com')) {
      loggedInUser = { id: 'artist-mock', name: 'Verified Artist', email };
      loggedInRole = 'artist';
      router.push('/artist/dashboard');
    } else {
      loggedInUser = { id: 'user-mock', name: 'Sample User', email };
      loggedInRole = 'user';
      router.push('/');
    }

    setUser(loggedInUser);
    setRole(loggedInRole);
    sessionStorage.setItem('user', JSON.stringify(loggedInUser));
    sessionStorage.setItem('role', loggedInRole);
    setIsLoading(false);
  };

  const artistRegister = (details: Omit<User, 'id'>) => {
     // In a real app, this would hit a backend endpoint.
     // For now, we'll just log them in as a pending artist.
    const newArtist: User = { ...details, id: `artist-${Date.now()}` };
    setUser(newArtist);
    setRole('artist'); // Initially pending, but for UI we give artist role
    sessionStorage.setItem('user', JSON.stringify(newArtist));
    sessionStorage.setItem('role', 'artist');
    router.push('/artist/dashboard?status=pending');
  };

  const logout = () => {
    setIsLoading(true);
    setUser(null);
    setRole(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    router.push('/');
    setIsLoading(false);
  };

  const value = {
    user,
    role,
    isLoading,
    login,
    artistRegister,
    logout,
  };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};
