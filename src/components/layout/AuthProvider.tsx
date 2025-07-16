
'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import type { User, Role, ArtistApplication } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [artistApplications, setArtistApplications] = useState<ArtistApplication[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('user');
      const storedRole = sessionStorage.getItem('role') as Role;
      const storedRegisteredUsers = sessionStorage.getItem('registeredUsers');
      const storedArtistApplications = sessionStorage.getItem('artistApplications');
      
      if (storedUser && storedRole) {
        const parsedUser = JSON.parse(storedUser);
        if(parsedUser.subscription?.expiryDate) {
            parsedUser.subscription.expiryDate = new Date(parsedUser.subscription.expiryDate);
        }
        setUser(parsedUser);
        setRole(storedRole);
      }
      if (storedRegisteredUsers) {
        setRegisteredUsers(JSON.parse(storedRegisteredUsers));
      }
       if (storedArtistApplications) {
        setArtistApplications(JSON.parse(storedArtistApplications));
      } else {
        const adminUser: User = { id: 'admin', name: 'Admin', email: 'admin@cloudstage.live', password: 'admin123', role: 'admin' };
        setRegisteredUsers([adminUser]);
        sessionStorage.setItem('registeredUsers', JSON.stringify([adminUser]));
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

  const persistApplications = (applications: ArtistApplication[]) => {
    setArtistApplications(applications);
    sessionStorage.setItem('artistApplications', JSON.stringify(applications));
  }

  const login = (email: string, pass: string): boolean => {
    setIsLoading(true);
    const foundUser = registeredUsers.find(u => u.email === email && u.password === pass);

    if (!foundUser) {
        setIsLoading(false);
        return false;
    }

    if (foundUser.role === 'artist') {
      const application = artistApplications.find(app => app.email === email);
      if (application?.status !== 'Approved') {
          toast({
              title: 'Application Not Approved',
              description: 'Your artist application is still pending or has been rejected.',
              variant: 'destructive'
          });
          setIsLoading(false);
          return false;
      }
    }
    
    if(foundUser.subscription?.expiryDate) {
        foundUser.subscription.expiryDate = new Date(foundUser.subscription.expiryDate);
    }

    setUser(foundUser);
    setRole(foundUser.role);
    sessionStorage.setItem('user', JSON.stringify(foundUser));
    sessionStorage.setItem('role', foundUser.role);

    toast({
        title: 'Login Successful',
        description: `Welcome back, ${foundUser.name}!`
    });

    if (foundUser.role === 'admin') router.push('/admin');
    else if (foundUser.role === 'artist') router.push('/artist/dashboard');
    else router.push('/');

    setIsLoading(false);
    return true;
  };

  const register = (name: string, email: string, pass: string): boolean => {
    if (registeredUsers.some(u => u.email === email)) {
       toast({
        title: 'Registration Failed',
        description: 'An account with this email already exists.',
        variant: 'destructive'
      });
      return false; 
    }
    const newUser: User = { id: `user-${Date.now()}`, name, email, password: pass, role: 'user', applicationStatus: 'none' };
    persistUsers([...registeredUsers, newUser]);
    
    toast({ title: 'Registration Successful', description: 'Welcome! Please log in.' });
    return true;
  };

  const artistRegister = (application: ArtistApplication) => {
     if (registeredUsers.some(u => u.email === application.email)) {
       toast({
          title: 'Application Failed',
          description: 'An account with this email already exists. Please log in as a user to apply.',
          variant: 'destructive'
        });
       return;
     }

     const newArtistUser: User = { 
        id: `artist-${Date.now()}`,
        name: application.name,
        email: application.email,
        password: application.password,
        role: 'artist',
        applicationStatus: 'pending'
    };
    persistUsers([...registeredUsers, newArtistUser]);
     
     persistApplications([...artistApplications, {...application, status: 'Pending'}]);
     
     toast({
      title: 'Application Submitted!',
      description: 'Your application is pending review. We will notify you upon approval.',
    });
    router.push('/admin-login');
  };

  const updateApplicationStatus = (applicationId: string, status: 'Approved' | 'Rejected') => {
      const appToUpdate = artistApplications.find(app => app.id === applicationId);
      if (!appToUpdate) return;
      
      const updatedApplications = artistApplications.map(app => 
          app.id === applicationId ? { ...app, status } : app
      );
      persistApplications(updatedApplications);

      const updatedUsers = registeredUsers.map(u => 
        u.email === appToUpdate.email ? { ...u, applicationStatus: status.toLowerCase() as User['applicationStatus'] } : u
      );
      persistUsers(updatedUsers);
  };

  const updateUserProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    sessionStorage.setItem('user', JSON.stringify(updatedUser));

    const updatedUsers = registeredUsers.map(u => u.id === user.id ? updatedUser : u);
    persistUsers(updatedUsers);
  }

  const subscribeUser = () => {
    if (!user) {
        toast({ title: "Login Required", description: "You must be logged in to subscribe.", variant: "destructive"});
        router.push('/user-login');
        return;
    }
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const updatedUser: User = {
        ...user,
        subscription: {
            plan: 'Premium',
            expiryDate: expiryDate,
            eventCount: 20
        }
    };

    updateUserProfile(updatedUser);
    toast({
        title: "Subscription Successful!",
        description: "Welcome to CloudStage Live Premium."
    });
  }

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
    artistApplications,
    updateApplicationStatus,
    updateUserProfile,
    subscribeUser,
  };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};
