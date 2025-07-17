
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
    if (data?.date instanceof Timestamp) {
        data.date = data.date.toDate();
    }
    if (data?.purchaseDate instanceof Timestamp) {
        data.purchaseDate = data.purchaseDate.toDate();
    }
    if (data?.subscription?.expiryDate instanceof Timestamp) {
        data.subscription.expiryDate = data.subscription.expiryDate.toDate();
    }
    return data;
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
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Firebase Auth state listener
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = convertTimestamps(userDocSnap.data() as User);
          setUser(userData);
          setRole(userData.role);
        } else {
            // This case might happen if a user is in auth but not in firestore. Log them out.
            await signOut(auth);
            setUser(null);
            setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setIsLoading(false);
    });

    // Firestore real-time listeners
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

    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
        setRegisteredUsers(snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as User)));
    });

    const unsubscribeApplications = onSnapshot(collection(db, "artistApplications"), (snapshot) => {
        setArtistApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ArtistApplication)));
    });
    
    const unsubscribeAllTickets = onSnapshot(collection(db, "tickets"), (snapshot) => {
        setAllTickets(snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Ticket)));
    });


    return () => {
      unsubscribeAuth();
      unsubscribeEvents();
      unsubscribeMovies();
      unsubscribeUsers();
      unsubscribeApplications();
      unsubscribeAllTickets();
    };
  }, []);
  
  // Update myTickets when the logged-in user or all tickets change
  useEffect(() => {
    if (user) {
      const userTickets = allTickets.filter(ticket => ticket.userId === user.id);
      setMyTickets(userTickets);
    } else {
      setMyTickets([]);
    }
  }, [user, allTickets]);


  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        // onAuthStateChanged will handle setting user and role
        toast({ title: 'Login Successful', description: `Welcome back!` });
        
        // Fetch user doc to decide redirection
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser!.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data() as User;
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
        }
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
        const newUser: User = { 
            id: firebaseUser.uid, 
            name, 
            email, 
            phoneNumber, 
            role: 'user', 
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
        const userDocRef = doc(db, 'users', appData.userId!);
        
        const updatedAppData: any = { status };
        if (status === 'Rejected' && reason) {
            updatedAppData.rejectionReason = reason;
        }
        await updateDoc(appDocRef, updatedAppData);

        const newStatus = status === 'Approved' ? 'approved' : 'rejected';
        await updateDoc(userDocRef, { applicationStatus: newStatus });
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
      date: Timestamp.fromDate(eventData.date)
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
      await updateDoc(doc(db, 'users', user.id), {
        'subscription.eventCount': user.subscription.eventCount - 1
      });
      usedSubscriptionCredit = true;
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
    // onAuthStateChanged will clear user and role
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
