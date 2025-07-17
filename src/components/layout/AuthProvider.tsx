
'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import type { User, Role, ArtistApplication, Event, Movie, Ticket } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getEventStatus } from '@/lib/utils';
import { auth, db } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  collection,
  query,
  where,
  updateDoc,
  addDoc,
  serverTimestamp,
  deleteDoc,
  Timestamp
} from "firebase/firestore";

// Helper to convert Firestore timestamps to Dates in nested objects
const convertTimestamps = (data: any) => {
    if (!data) return data;
    const new_data = { ...data };
    for (const key of Object.keys(new_data)) {
        if (new_data[key] instanceof Timestamp) {
            new_data[key] = new_data[key].toDate();
        } else if (typeof new_data[key] === 'object' && new_data[key] !== null && !Array.isArray(new_data[key])) {
            new_data[key] = convertTimestamps(new_data[key]);
        }
    }
    return new_data;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [artistApplications, setArtistApplications] = useState<ArtistApplication[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const router = useRouter();

  // Listen for public data always
  useEffect(() => {
    const unsubscribeEvents = onSnapshot(collection(db, "events"), (snapshot) => {
        const eventsData = snapshot.docs.map(doc => {
            const data = convertTimestamps(doc.data());
            return {
                id: doc.id,
                ...data,
                status: getEventStatus(data.date, data.duration || 90),
            } as Event;
        });
        setEvents(eventsData);
    });

    const unsubscribeMovies = onSnapshot(collection(db, "movies"), (snapshot) => {
        setMovies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie)));
    });
    
    return () => {
        unsubscribeEvents();
        unsubscribeMovies();
    };
  }, []);

  // Set up protected data listeners when user logs in
  useEffect(() => {
    let unsubscribers: (() => void)[] = [];

    if (user && role) {
      // Listener for the current user's tickets
      const myTicketsQuery = query(collection(db, "tickets"), where("userId", "==", user.id));
      const unsubscribeMyTickets = onSnapshot(myTicketsQuery, (snapshot) => {
          const userTickets = snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Ticket));
          setMyTickets(userTickets);
      });
      unsubscribers.push(unsubscribeMyTickets);
    
      if (role === 'admin') {
          // Listeners for admin-only data
          const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
              setRegisteredUsers(snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as User)));
          });
          const unsubscribeApplications = onSnapshot(collection(db, "artistApplications"), (snapshot) => {
              setArtistApplications(snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as ArtistApplication)));
          });
          const unsubscribeAllTickets = onSnapshot(collection(db, "tickets"), (snapshot) => {
              const allTicketsData = snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Ticket));
              setAllTickets(allTicketsData);
          });
          unsubscribers.push(unsubscribeUsers, unsubscribeApplications, unsubscribeAllTickets);
      }
    }

    return () => {
        unsubscribers.forEach(unsub => unsub());
    };
  }, [user, role]);

  // Firebase Auth state listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        const unsubscribeUserDoc = onSnapshot(userDocRef, (userDocSnap) => {
            if (userDocSnap.exists()) {
                const userData = convertTimestamps(userDocSnap.data()) as User;
                setUser(userData);
                setRole(userData.role);
            } else {
                // This case can happen if a user is in Auth but not in Firestore.
                // Log them out to prevent inconsistent state.
                signOut(auth);
                setUser(null);
                setRole(null);
            }
            setIsLoading(false);
        }, (error) => {
            console.error("Error listening to user document:", error);
            setUser(null);
            setRole(null);
            setIsLoading(false);
        });
        
        return () => unsubscribeUserDoc();
      } else {
        setUser(null);
        setRole(null);
        setMyTickets([]);
        setRegisteredUsers([]);
        setArtistApplications([]);
        setAllTickets([]);
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (!userDoc.exists()) {
            toast({ title: 'Login Failed', description: "No user record found.", variant: 'destructive' });
            await signOut(auth);
            return false;
        }
        
        const userData = userDoc.data() as User;
        
        toast({ title: 'Login Successful', description: `Welcome back!` });
        
        if (userData.role === 'admin') router.push('/admin');
        else if (userData.role === 'artist') {
             if(userData.applicationStatus === 'approved'){
                 router.push('/artist/dashboard');
             } else {
                 const status = userData.applicationStatus === 'pending' ? 'is still pending review' : 'was rejected';
                 toast({ title: 'Login Failed', description: `Your artist application ${status}.`, variant: 'destructive' });
                 await signOut(auth);
                 return false;
             }
        }
        else router.push('/user-dashboard');
        return true;
    } catch (error: any) {
        toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
        return false;
    } finally {
        setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string, phoneNumber: string): Promise<boolean> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const firebaseUser = userCredential.user;
        
        // Assign role based on email
        const userRole: Role = email === 'admin@cloudstage.live' ? 'admin' : 'user';

        const newUser: User = { 
            id: firebaseUser.uid, 
            name, 
            email, 
            phoneNumber, 
            role: userRole,
            applicationStatus: 'none',
            profilePictureUrl: `https://api.dicebear.com/8.x/lorelei/svg?seed=${email}`
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        toast({ title: 'Registration Successful', description: 'Welcome! Please log in.' });
        await signOut(auth); // Log out user so they can log in themselves
        return true;
    } catch (error: any) {
        toast({ title: 'Registration Failed', description: error.message, variant: 'destructive' });
        return false;
    }
  };

  const artistRegister = async (applicationData: Omit<ArtistApplication, 'id' | 'status'>) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, applicationData.email, applicationData.password!);
        const firebaseUser = userCredential.user;

        const newArtistUser: User = { 
            id: firebaseUser.uid,
            name: applicationData.name,
            email: applicationData.email,
            role: 'artist',
            applicationStatus: 'pending',
            profilePictureUrl: applicationData.artistImageUrl || `https://api.dicebear.com/8.x/lorelei/svg?seed=${applicationData.email}`,
            phoneNumber: applicationData.contactNumber,
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), newArtistUser);

        const newApplication: Omit<ArtistApplication, 'id'> = {
            ...applicationData,
            status: 'Pending',
            userId: firebaseUser.uid
        };
        delete newApplication.password; 
        await addDoc(collection(db, 'artistApplications'), newApplication);

        toast({ title: 'Application Submitted!', description: 'Your application is pending review.' });
        await signOut(auth);
        router.push('/user-login');
    } catch (error: any) {
        toast({ title: 'Application Failed', description: error.message, variant: 'destructive' });
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: 'Approved' | 'Rejected', reason?: string) => {
      const appDocRef = doc(db, 'artistApplications', applicationId);
      const appDoc = await getDoc(appDocRef);

      if (appDoc.exists()) {
        const appData = appDoc.data() as ArtistApplication;
        if (!appData.userId) {
            toast({ title: 'Error', description: 'Application is missing a user ID.', variant: 'destructive' });
            return;
        }
        const userDocRef = doc(db, 'users', appData.userId);
        
        const updatedAppData: any = { status };
        if (status === 'Rejected' && reason) {
            updatedAppData.rejectionReason = reason;
        }
        await updateDoc(appDocRef, updatedAppData);

        const newStatus = status === 'Approved' ? 'approved' : 'rejected';
        await updateDoc(userDocRef, { applicationStatus: newStatus });
        toast({ title: `Application ${status}`});
      }
  };

  const updateUserProfile = async (updatedData: Partial<User>) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.id);
    await updateDoc(userDocRef, updatedData);
    toast({ title: "Profile Updated", description: "Your changes have been saved." });
  };
  
  const subscribeUser = async () => {
    if (!user) {
        toast({ title: "Login Required", description: "You must be logged in to subscribe.", variant: "destructive"});
        router.push('/user-login');
        return;
    }
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const subscriptionData = {
        plan: 'Premium',
        expiryDate: Timestamp.fromDate(expiryDate),
        eventCount: 20
    };

    await updateDoc(doc(db, 'users', user.id), { subscription: subscriptionData });
    toast({ title: "Subscription Successful!", description: "Welcome to CloudStage Live Premium." });
  }

  const createEvent = async (eventData: Omit<Event, 'id' | 'artist' | 'artistId' | 'status' | 'approvalStatus'>) => {
    if (!user || user.role !== 'artist') {
      toast({ title: "Unauthorized", description: "You must be an artist to create an event.", variant: "destructive" });
      return;
    }

    const newEvent: Omit<Event, 'id' | 'status'> = {
      ...eventData,
      artist: user.name,
      artistId: user.id,
      approvalStatus: 'Pending',
      date: Timestamp.fromDate(eventData.date as Date)
    };
    
    await addDoc(collection(db, 'events'), newEvent);
    toast({ title: 'Event Submitted!', description: 'Your event has been submitted for approval.' });
    router.push('/artist/dashboard');
  };
  
  const createMovie = async (movieData: Omit<Movie, 'id'>) => {
     if (!user || user.role !== 'admin') {
      toast({ title: "Unauthorized", description: "You must be an admin to add a movie.", variant: "destructive" });
      return;
    }
    await addDoc(collection(db, 'movies'), movieData);
    toast({ title: 'Movie Added!', description: 'The new movie has been successfully added.' });
  };
  
  const deleteMovie = async (movieId: string) => {
    await deleteDoc(doc(db, "movies", movieId));
    toast({ title: 'Movie Deleted', description: 'The movie has been successfully removed.', variant: 'destructive'});
  };

  const updateEventApproval = async (eventId: string, status: 'Approved' | 'Rejected') => {
    const eventDocRef = doc(db, 'events', eventId);
    await updateDoc(eventDocRef, { approvalStatus: status });
    toast({ title: `Event ${status}`, description: `The event has been successfully ${status.toLowerCase()}.`});
  };

  const purchaseTicket = async (eventId: string) => {
    if (!user) {
        toast({ title: "Login Required", description: "You must be logged in to purchase a ticket.", variant: "destructive"});
        router.push('/user-login');
        return;
    }

    if (myTickets.some(t => t.eventId === eventId)) {
      toast({ title: "Already Owned", description: "You already have a ticket for this event.", variant: "destructive" });
      return;
    }
    
    let usedSubscriptionCredit = false;
    if (user.subscription && user.subscription.eventCount > 0) {
      const event = events.find(e => e.id === eventId);
      if (event && event.price > 0) {
        await updateDoc(doc(db, 'users', user.id), {
          'subscription.eventCount': user.subscription.eventCount - 1
        });
        usedSubscriptionCredit = true;
      }
    }

    const newTicket = {
        userId: user.id,
        eventId,
        purchaseDate: serverTimestamp(),
        usedSubscriptionCredit,
    };
    await addDoc(collection(db, 'tickets'), newTicket);

    toast({ title: "Purchase Successful!", description: "Your ticket has been added to 'My Tickets'."});
  }

  const logout = async () => {
    setIsLoading(true);
    await signOut(auth);
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

    