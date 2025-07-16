
'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import type { User, Role, ArtistApplication, Event, Movie } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { mockEvents, mockMovies } from '@/lib/mock-data';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [artistApplications, setArtistApplications] = useState<ArtistApplication[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedRole = localStorage.getItem('role') as Role;
      const storedRegisteredUsers = localStorage.getItem('registeredUsers');
      const storedArtistApplications = localStorage.getItem('artistApplications');
      const storedEvents = localStorage.getItem('events');
      const storedMovies = localStorage.getItem('movies');
      
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
        const parsedArtistApplications = JSON.parse(storedArtistApplications);
        setArtistApplications(parsedArtistApplications);
      }
      if (storedEvents) {
          const parsedEvents = JSON.parse(storedEvents).map((e: Event) => ({...e, date: new Date(e.date)}));
          setEvents(parsedEvents);
      } else {
        const initialEvents = mockEvents.map(e => ({ ...e, date: new Date(e.date) }));
        setEvents(initialEvents);
        localStorage.setItem('events', JSON.stringify(initialEvents));
      }
       if (storedMovies) {
          setMovies(JSON.parse(storedMovies));
      } else {
        setMovies(mockMovies);
        localStorage.setItem('movies', JSON.stringify(mockMovies));
      }
      
      if (!storedRegisteredUsers) {
        const adminUser: User = { id: 'admin', name: 'Admin', email: 'admin@cloudstage.live', password: 'admin123', role: 'admin' };
        setRegisteredUsers([adminUser]);
        localStorage.setItem('registeredUsers', JSON.stringify([adminUser]));
      }

    } catch (error) {
        console.error("Failed to parse local storage item.")
    }
    setIsLoading(false);
  }, []);

  const persistUsers = (users: User[]) => {
    setRegisteredUsers(users);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
  }

  const persistApplications = (applications: ArtistApplication[]) => {
    setArtistApplications(applications);
    localStorage.setItem('artistApplications', JSON.stringify(applications));
  }
  
  const persistEvents = (eventsToSave: Event[]) => {
    setEvents(eventsToSave);
    localStorage.setItem('events', JSON.stringify(eventsToSave));
  }

  const persistMovies = (moviesToSave: Movie[]) => {
    setMovies(moviesToSave);
    localStorage.setItem('movies', JSON.stringify(moviesToSave));
  };

  const login = (email: string, pass: string): boolean => {
    setIsLoading(true);
    const foundUser = registeredUsers.find(u => u.email === email && u.password === pass);

    if (!foundUser) {
        setIsLoading(false);
        return false;
    }
    
    if (foundUser.role === 'artist') {
        const application = artistApplications.find(app => app.email === email);
        if (application && application.status !== 'Approved') {
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
    localStorage.setItem('user', JSON.stringify(foundUser));
    localStorage.setItem('role', foundUser.role);

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

  const register = (name: string, email: string, pass: string, phoneNumber: string): boolean => {
    if (registeredUsers.some(u => u.email === email)) {
       toast({
        title: 'Registration Failed',
        description: 'An account with this email already exists.',
        variant: 'destructive'
      });
      return false; 
    }
    const newUser: User = { id: `user-${Date.now()}`, name, email, password: pass, phoneNumber, role: 'user', applicationStatus: 'none' };
    persistUsers([...registeredUsers, newUser]);
    
    toast({ title: 'Registration Successful', description: 'Welcome! Please log in.' });
    return true;
  };

  const artistRegister = (applicationData: Omit<ArtistApplication, 'id' | 'status'>) => {
     if (registeredUsers.some(u => u.email === applicationData.email && u.role === 'admin')) {
       toast({
          title: 'Application Failed',
          description: 'An admin account with this email already exists.',
          variant: 'destructive'
        });
       return;
     }

     const newApplication: ArtistApplication = {
        ...applicationData,
        id: `app-${Date.now()}`,
        status: 'Pending',
     }

     const existingUser = registeredUsers.find(u => u.email === newApplication.email);

     if (existingUser) {
        if (existingUser.applicationStatus === 'pending' || existingUser.applicationStatus === 'approved') {
            toast({
                title: 'Application Failed',
                description: 'An artist application for this email already exists or is approved.',
                variant: 'destructive'
            });
            return;
        }
       const updatedUsers = registeredUsers.map(u => u.id === existingUser.id ? { ...u, applicationStatus: 'pending' as const, role: 'artist' as const } : u);
       persistUsers(updatedUsers);
     } else {
        const newArtistUser: User = { 
          id: `artist-${Date.now()}`,
          name: newApplication.name,
          email: newApplication.email,
          password: newApplication.password,
          role: 'artist',
          applicationStatus: 'pending'
      };
      persistUsers([...registeredUsers, newArtistUser]);
     }
     
     persistApplications([...artistApplications, newApplication]);
     
     toast({
      title: 'Application Submitted!',
      description: 'Your application is pending review. We will notify you upon approval.',
    });
    router.push('/admin-login');
  };

  const updateApplicationStatus = (applicationId: string, status: 'Approved' | 'Rejected', reason?: string) => {
      const appToUpdate = artistApplications.find(app => app.id === applicationId);
      if (!appToUpdate) return;
      
      const updatedApplications = artistApplications.map(app => {
        if (app.id !== applicationId) return app;
        const updatedApp: ArtistApplication = { ...app, status };
        if (status === 'Rejected' && reason) {
            updatedApp.rejectionReason = reason;
        }
        return updatedApp;
      });
      persistApplications(updatedApplications);

      const updatedUsers = registeredUsers.map(u => {
        if (u.email !== appToUpdate.email) return u;
        
        if (status === 'Approved') {
           return { ...u, applicationStatus: 'approved' as const };
        } else {
           // If rejected, reset their role and application status to allow re-application
           return { ...u, role: 'user' as const, applicationStatus: 'none' as const };
        }
      });
      persistUsers(updatedUsers);
  };

  const updateUserProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

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

  const createEvent = (eventData: Omit<Event, 'id' | 'artist' | 'artistId' | 'status' | 'approvalStatus'>) => {
    if (!user || user.role !== 'artist') {
      toast({ title: "Unauthorized", description: "You must be an artist to create an event.", variant: "destructive" });
      return;
    }

    const newEvent: Event = {
      ...eventData,
      id: `evt-${Date.now()}`,
      artist: user.name,
      artistId: user.id,
      approvalStatus: 'Pending',
      status: new Date(eventData.date) > new Date() ? 'Upcoming' : 'Past', // Basic status logic
    };

    persistEvents([...events, newEvent]);
  };

  const createMovie = (movieData: Omit<Movie, 'id'>) => {
    if (!user || user.role !== 'admin') {
      toast({ title: "Unauthorized", description: "You must be an admin to add a movie.", variant: "destructive" });
      return;
    }

    const newMovie: Movie = {
      ...movieData,
      id: `mov-${Date.now()}`,
    };

    persistMovies([...movies, newMovie]);
  };
  
  const deleteMovie = (movieId: string) => {
    const updatedMovies = movies.filter(movie => movie.id !== movieId);
    persistMovies(updatedMovies);
  };

  const updateEventApproval = (eventId: string, status: 'Approved' | 'Rejected') => {
    const updatedEvents = events.map(e => 
      e.id === eventId ? { ...e, approvalStatus: status } : e
    );
    persistEvents(updatedEvents);
  };

  const logout = () => {
    setIsLoading(true);
    setUser(null);
    setRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('role');
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
    events,
    createEvent,
    updateEventApproval,
    movies,
    createMovie,
    deleteMovie,
  };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};
