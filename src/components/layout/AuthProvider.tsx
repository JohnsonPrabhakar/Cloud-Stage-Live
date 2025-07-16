
'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import type { User, Role } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';

// Let's create a list of approved artist emails for our mock scenario
const approvedArtistEmails = ['sarah.s@music.com', 'artist@example.com'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Mock session loading
    try {
      const storedUser = sessionStorage.getItem('user');
      const storedRole = sessionStorage.getItem('role') as Role;
      const storedRegisteredUsers = sessionStorage.getItem('registeredUsers');
      if (storedUser && storedRole) {
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
      }
      if (storedRegisteredUsers) {
        setRegisteredUsers(JSON.parse(storedRegisteredUsers));
      }
    } catch (error) {
        console.error("Failed to parse session storage item.")
    }
    setIsLoading(false);
  }, []);

  const persistUsers = (users: User[]) => {
    setRegisteredUsers(users);
    sessionStorage.setItem('registeredUsers', JSON.stringify(users));
  }

  const login = (email: string, pass: string): boolean => {
    setIsLoading(true);
    let loggedInUser: User | null = null;
    let loggedInRole: Role = null;

    if (email === 'admin@cloudstage.live' && pass === 'admin123') {
      loggedInUser = { id: 'admin', name: 'Admin', email };
      loggedInRole = 'admin';
      router.push('/admin');
    } else if (approvedArtistEmails.includes(email) && pass === 'password123') { // Artists use a standard password for mock
      loggedInUser = { id: `artist-${email}`, name: 'Verified Artist', email };
      loggedInRole = 'artist';
      router.push('/artist/dashboard');
    } else {
      const foundUser = registeredUsers.find(u => u.email === email && u.password === pass);
      if (foundUser) {
        loggedInUser = foundUser;
        loggedInRole = 'user';
        router.push('/');
      }
    }

    if (loggedInUser && loggedInRole) {
      setUser(loggedInUser);
      setRole(loggedInRole);
      sessionStorage.setItem('user', JSON.stringify(loggedInUser));
      sessionStorage.setItem('role', loggedInRole);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = (name: string, email: string, pass: string): boolean => {
    if (registeredUsers.some(u => u.email === email)) {
      return false; // User already exists
    }
    const newUser: User = { id: `user-${Date.now()}`, name, email, password: pass };
    persistUsers([...registeredUsers, newUser]);
    return login(email, pass);
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
    register,
    artistRegister,
    logout,
    registeredUsers,
  };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};
