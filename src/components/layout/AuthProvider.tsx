
'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import type { User, Role, ArtistApplication, Event, Movie, Ticket } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { mockEvents, mockMovies, mockTickets as initialMockTickets, mockUsers as initialMockUsers, mockApplications } from '@/lib/mock-data';
import { getEventStatus } from '@/lib/utils';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [artistApplications, setArtistApplications] = useState<ArtistApplication[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedRole = localStorage.getItem('role') as Role;
      const storedRegisteredUsers = localStorage.getItem('registeredUsers');
      const storedArtistApplications = localStorage.getItem('artistApplications');
      const storedEvents = localStorage.getItem('events');
      const storedMovies = localStorage.getItem('movies');
      const storedTickets = localStorage.getItem('allTickets');
      
      if (storedUser && storedRole) {
        const parsedUser = JSON.parse(storedUser);
        if(parsedUser.subscription?.expiryDate) {
            parsedUser.subscription.expiryDate = new Date(parsedUser.subscription.expiryDate);
        }
        setUser(parsedUser);
        setRole(storedRole);
      }

      if (storedRegisteredUsers) {
        const parsedUsers: User[] = JSON.parse(storedRegisteredUsers);
        setRegisteredUsers(parsedUsers.map(u => ({...u, applicationStatus: u.applicationStatus || 'none'})));
      } else {
        const defaultUsers: User[] = [
            { id: 'admin', name: 'Admin', email: 'admin@cloudstage.live', password: 'admin', role: 'admin', applicationStatus: 'approved' },
            ...initialMockUsers,
        ];
        setRegisteredUsers(defaultUsers);
        localStorage.setItem('registeredUsers', JSON.stringify(defaultUsers));
      }

       if (storedArtistApplications) {
        setArtistApplications(JSON.parse(storedArtistApplications));
      } else {
        setArtistApplications(mockApplications);
        localStorage.setItem('artistApplications', JSON.stringify(mockApplications));
      }

      if (storedEvents) {
          const parsedEvents = JSON.parse(storedEvents).map((e: Omit<Event, 'status'> & {date: string}) => {
            const date = new Date(e.date);
            return {
              ...e,
              date,
              duration: e.duration || 90,
              status: getEventStatus(date, e.duration || 90),
            };
          });
          setEvents(parsedEvents);
      } else {
        const initialEvents = mockEvents.map(e => ({ ...e, date: new Date(e.date), status: getEventStatus(new Date(e.date), e.duration) }));
        setEvents(initialEvents);
        localStorage.setItem('events', JSON.stringify(initialEvents));
      }
       if (storedMovies) {
          setMovies(JSON.parse(storedMovies));
      } else {
        setMovies(mockMovies);
        localStorage.setItem('movies', JSON.stringify(mockMovies));
      }
       if (storedTickets) {
          const parsedTickets = JSON.parse(storedTickets).map((t: Ticket) => ({...t, purchaseDate: new Date(t.purchaseDate)}));
          setAllTickets(parsedTickets);
       } else {
          setAllTickets(initialMockTickets);
          localStorage.setItem('allTickets', JSON.stringify(initialMockTickets));
       }
      
    } catch (error) {
        console.error("Failed to parse local storage item.", error)
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prevEvents => 
        prevEvents.map(e => ({
          ...e,
          status: getEventStatus(e.date, e.duration)
        }))
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user && allTickets.length > 0) {
        const userTickets = allTickets.filter(t => t.userId === user.id);
        setMyTickets(userTickets);
    } else {
        setMyTickets([]);
    }
  }, [user, allTickets]);

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
  
  const persistTickets = (ticketsToSave: Ticket[]) => {
    setAllTickets(ticketsToSave);
    localStorage.setItem('allTickets', JSON.stringify(ticketsToSave));
  }

  const login = (email: string, pass: string): boolean => {
    setIsLoading(true);
    const foundUser = registeredUsers.find(u => u.email === email && u.password === pass);

    if (!foundUser) {
        toast({
            title: 'Login Failed',
            description: 'Please check your credentials.',
            variant: 'destructive'
        });
        setIsLoading(false);
        return false;
    }
    
    if (foundUser.role === 'artist' && foundUser.applicationStatus !== 'approved') {
        const status = foundUser.applicationStatus === 'pending' ? 'is still pending review' : 'was rejected';
        toast({
            title: 'Login Failed',
            description: `Your artist application ${status}.`,
            variant: 'destructive'
        });
        setIsLoading(false);
        return false;
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
    else router.push('/user-dashboard');

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
    const newUser: User = { 
      id: `user-${Date.now()}`, 
      name, 
      email, 
      password: pass, 
      phoneNumber, 
      role: 'user', 
      applicationStatus: 'none',
      profilePictureUrl: `https://api.dicebear.com/8.x/lorelei/svg?seed=${email}`
    };
    persistUsers([...registeredUsers, newUser]);
    
    toast({ title: 'Registration Successful', description: 'Welcome! Please log in.' });
    return true;
  };

  const artistRegister = (applicationData: Omit<ArtistApplication, 'id' | 'status'>) => {
     if (registeredUsers.some(u => u.email === applicationData.email)) {
       toast({
          title: 'Application Failed',
          description: 'An account with this email already exists.',
          variant: 'destructive'
        });
       return;
     }

     const existingApplication = artistApplications.find(app => app.email === applicationData.email);
     if (existingApplication && (existingApplication.status.toLowerCase() === 'pending' || existingApplication.status.toLowerCase() === 'approved')) {
       toast({
         title: 'Application Exists',
         description: 'An application with this email is already pending or has been approved.',
         variant: 'destructive',
       });
       return;
     }

     const newApplication: ArtistApplication = {
        ...applicationData,
        id: `app-${Date.now()}`,
        status: 'Pending',
     }
     
     const newArtistUser: User = { 
       id: `artist-${Date.now()}`,
       name: newApplication.name,
       email: newApplication.email,
       password: newApplication.password,
       role: 'artist',
       applicationStatus: 'pending',
       profilePictureUrl: newApplication.artistImageUrl || `https://api.dicebear.com/8.x/lorelei/svg?seed=${newApplication.email}`,
     };
     persistUsers([...registeredUsers, newArtistUser]);
     persistApplications([...artistApplications, newApplication]);
     
     toast({
      title: 'Application Submitted!',
      description: 'Your application is pending review. We will notify you upon approval.',
    });
    router.push('/user-login');
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

      const newStatus = status === 'Approved' ? 'approved' : 'rejected';
      const updatedUsers = registeredUsers.map(u => 
        u.email === appToUpdate.email ? { ...u, applicationStatus: newStatus as User['applicationStatus'] } : u
      );
      persistUsers(updatedUsers);
  };

  const updateUserProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    const updatedRegisteredUsers = registeredUsers.map(u => 
      u.id === user.id ? updatedUser : u
    );
    persistUsers(updatedRegisteredUsers);

    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully."
    });
  };

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
      status: getEventStatus(eventData.date, eventData.duration),
    };

    persistEvents([...events, newEvent]);
    toast({
      title: 'Event Submitted!',
      description: 'Your event has been submitted for approval.'
    });
    router.push('/artist/dashboard');
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
    toast({
        title: 'Movie Added!',
        description: 'The new movie has been successfully added to the platform.'
    });
  };
  
  const deleteMovie = (movieId: string) => {
    const updatedMovies = movies.filter(movie => movie.id !== movieId);
    persistMovies(updatedMovies);
    toast({
      title: 'Movie Deleted',
      description: 'The movie has been successfully removed.',
      variant: 'destructive'
    });
  };

  const updateEventApproval = (eventId: string, status: 'Approved' | 'Rejected') => {
    const updatedEvents = events.map(e => 
      e.id === eventId ? { ...e, approvalStatus: status } : e
    );
    persistEvents(updatedEvents);
    toast({
        title: `Event ${status}`,
        description: `The event has been successfully ${status.toLowerCase()}.`
    });
  };

  const purchaseTicket = (eventId: string) => {
    if (!user) {
        toast({ title: "Login Required", description: "You must be logged in to purchase a ticket.", variant: "destructive"});
        router.push('/user-login');
        return;
    }

    if (myTickets.some(t => t.eventId === eventId)) {
      toast({ title: "Already Owned", description: "You already have a ticket for this event.", variant: "destructive" });
      return;
    }

    if (user.subscription && user.subscription.eventCount > 0) {
      const updatedUser: User = {
        ...user,
        subscription: {
          ...user.subscription,
          eventCount: user.subscription.eventCount - 1
        }
      };
      updateUserProfile(updatedUser);
    } else {
       const event = events.find(e => e.id === eventId);
       if (!event || event.price > 0) {
          // Here you would integrate a payment gateway
       }
    }

    const newTicket: Ticket = {
        id: `tkt-${Date.now()}`,
        userId: user.id,
        eventId,
        purchaseDate: new Date()
    };
    persistTickets([...allTickets, newTicket]);

    toast({
        title: "Purchase Successful!",
        description: "Your ticket has been added to 'My Tickets'."
    });
  }

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
    myTickets,
    purchaseTicket,
    allTickets,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
