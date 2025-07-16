
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
        const parsedUsers: User[] = JSON.parse(storedRegisteredUsers);
        // Ensure user objects have all required fields after parsing
        const validatedUsers = parsedUsers.map(u => ({
          ...u,
          applicationStatus: u.applicationStatus || 'none'
        }));
        setRegisteredUsers(validatedUsers);
      } else {
        const adminUser: User = { id: 'admin', name: 'Admin', email: 'admin@cloudstage.live', password: 'admin123', role: 'admin', applicationStatus: 'approved' };
        setRegisteredUsers([adminUser]);
        localStorage.setItem('registeredUsers', JSON.stringify([adminUser]));
      }

       if (storedArtistApplications) {
        const parsedArtistApplications = JSON.parse(storedArtistApplications).map((app: ArtistApplication) => ({
            ...app,
            // Fallback for old data that might not have this URL
            artistImageUrl: app.artistImageUrl || `https://api.dicebear.com/8.x/lorelei/svg?seed=${app.email}`
        }));
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
      
    } catch (error) {
        console.error("Failed to parse local storage item.", error)
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
        artistImageUrl: applicationData.artistImageUrl || `https://api.dicebear.com/8.x/lorelei/svg?seed=${applicationData.email}`,
     }
     
     const newArtistUser: User = { 
       id: `artist-${Date.now()}`,
       name: newApplication.name,
       email: newApplication.email,
       password: newApplication.password,
       role: 'artist',
       applicationStatus: 'pending',
       profilePictureUrl: newApplication.artistImageUrl,
     };
     persistUsers([...registeredUsers, newArtistUser]);
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

      const newStatus = status === 'Approved' ? 'approved' : 'rejected';
      const updatedUsers = registeredUsers.map(u => 
        u.email === appToUpdate.email ? { ...u, applicationStatus: newStatus as User['applicationStatus'] } : u
      );
      persistUsers(updatedUsers);
  };

  const updateUserProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    
    // Create the updated user object by merging current user data with new data.
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);

    try {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        toast({
          title: "Profile Image Not Saved",
          description: "Your profile picture is too large to be saved in the browser. Please choose a smaller file. Other changes were saved.",
          variant: "destructive",
        });
        // Revert image change but keep other data
        const userWithoutImage = { ...updatedUser, profilePictureUrl: user.profilePictureUrl };
        localStorage.setItem('user', JSON.stringify(userWithoutImage));
        setUser(userWithoutImage);
      }
    }


    // Update the user in the main list of registered users as well.
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
      status: new Date(eventData.date) > new Date() ? 'Upcoming' : 'Past',
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
