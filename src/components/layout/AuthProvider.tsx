
'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import type { User, Role } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';
import { mockEvents } from '@/lib/mock-data'; // We can use this for mock artists too

// Let's create a list of approved artist emails for our mock scenario
const approvedArtistEmails = ['sarah.s@music.com'];
// John and Cool Cats are pending, so they should NOT be able to log in.
// We will also keep a generic artist login for testing purposes.
const genericArtistEmail = 'artist@example.com';
approvedArtistEmails.push(genericArtistEmail);


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
    let successfulLogin = false;

    if (email === 'admin@cloudstage.live' && pass === 'admin123') {
      loggedInUser = { id: 'admin', name: 'Admin', email };
      loggedInRole = 'admin';
      router.push('/admin');
      successfulLogin = true;
    } else if (approvedArtistEmails.includes(email)) {
      // Artist Login - ONLY if they are in the approved list
      loggedInUser = { id: 'artist-mock', name: 'Verified Artist', email };
      loggedInRole = 'artist';
      router.push('/artist/dashboard');
      successfulLogin = true;
    } else if (email.includes('@') && !email.endsWith('@artist.com') && !['john.d@example.com', 'cats@band.com'].includes(email)) {
      // General user login
      loggedInUser = { id: 'user-mock', name: 'Sample User', email };
      loggedInRole = 'user';
      router.push('/');
      successfulLogin = true;
    }

    if (successfulLogin && loggedInUser && loggedInRole) {
        setUser(loggedInUser);
        setRole(loggedInRole);
        sessionStorage.setItem('user', JSON.stringify(loggedInUser));
        sessionStorage.setItem('role', loggedInRole);
    } else {
        // Handle failed login
        // If they were trying to log in as an unapproved artist, they get a specific error.
        // We'll have to use a toast from the login page itself for this.
    }
    setIsLoading(false);
    return successfulLogin;
  };

  const artistRegister = (details: Omit<User, 'id'>) => {
     // In a real app, this would hit a backend endpoint to save the application.
     // The current flow redirects to login, so no state change is needed here.
     console.log("Artist application submitted:", details);
     // We don't log them in. We just show the application was submitted.
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
