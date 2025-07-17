
'use client';

import React, { createContext, useState, useEffect, ReactNode, useRef } from 'react';
import type { User, Role, ArtistApplication, Event, Movie, Ticket } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot,
  query,
  where,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from "firebase/storage";
import { db, auth, storage } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { getEventStatus } from '@/lib/utils';
import { AuthContext } from '@/contexts/AuthContext';


// Helper to convert Firestore timestamps to Dates in nested objects
const convertTimestamps = (data: any): any => {
    if (!data) return data;
    if (data instanceof Timestamp) return data.toDate();
    if (Array.isArray(data)) return data.map(convertTimestamps);
    if (typeof data === 'object' && data !== null) {
        const newData: { [key: string]: any } = {};
        for (const key in data) {
            newData[key] = convertTimestamps(data[key]);
        }
        return newData;
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
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const router = useRouter();
  const myTicketsUnsubRef = useRef<(() => void) | null>(null);

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

  // Firebase Auth state listener
  useEffect(() => {
    let roleSpecificListeners: (() => void)[] = [];

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      // Clean up previous role-specific listeners when auth state changes
      roleSpecificListeners.forEach(unsub => unsub());
      roleSpecificListeners = [];

      if (firebaseUser) {
        // Clean up any existing myTickets listener before setting a new one
        if (myTicketsUnsubRef.current) {
          myTicketsUnsubRef.current();
          myTicketsUnsubRef.current = null;
        }

        // Re-initialize myTickets listener (works for ALL users)
        const myTicketsQuery = query(collection(db, 'tickets'), where('userId', '==', firebaseUser.uid));
        const unsubscribeMyTickets = onSnapshot(myTicketsQuery, (snapshot) => {
            const userTickets = snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Ticket));
            setMyTickets(userTickets);
        }, (error) => {
            console.error("Error fetching myTickets:", error);
        });
        myTicketsUnsubRef.current = unsubscribeMyTickets;
        
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeUserDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = convertTimestamps(docSnap.data()) as User;
            const newRole = userData.role;

            setUser(userData);
            setRole(newRole);

            // Clean up previous role-specific listeners before setting new ones
            roleSpecificListeners.forEach(unsub => unsub());
            roleSpecificListeners = [];

            if (newRole === 'admin') {
                const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => setRegisteredUsers(snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as User))));
                const unsubApps = onSnapshot(collection(db, "artistApplications"), (snapshot) => setArtistApplications(snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as ArtistApplication))));
                const unsubAllTickets = onSnapshot(collection(db, "tickets"), (snapshot) => setAllTickets(snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Ticket))));
                roleSpecificListeners.push(unsubUsers, unsubApps, unsubAllTickets);
            } else if (newRole === 'artist') {
                const q = query(collection(db, "tickets"), where("artistId", "==", firebaseUser.uid));
                const unsubAllTickets = onSnapshot(q, (snapshot) => {
                    setAllTickets(snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Ticket)));
                });
                roleSpecificListeners.push(unsubAllTickets);
            }
             setIsLoading(false);
          } else {
             // If user exists in Auth but not in Firestore, sign them out.
            console.error("User document not found for authenticated user:", firebaseUser.uid);
            signOut(auth); 
          }
        }, (error) => {
          console.error("Error in user snapshot listener:", error);
          signOut(auth);
          setIsLoading(false);
        });
        
        roleSpecificListeners.push(unsubscribeUserDoc);

      } else {
        // User is logged out, clear all state and call all active cleanup functions
        setUser(null);
        setRole(null);
        setMyTickets([]);
        setRegisteredUsers([]);
        setArtistApplications([]);
        setAllTickets([]);
        if (myTicketsUnsubRef.current) {
            myTicketsUnsubRef.current();
            myTicketsUnsubRef.current = null;
        }
        setIsLoading(false);
      }
    });
  
    // Main cleanup on component unmount
    return () => {
        unsubscribeAuth();
        roleSpecificListeners.forEach(unsub => unsub());
        if (myTicketsUnsubRef.current) {
            myTicketsUnsubRef.current();
            myTicketsUnsubRef.current = null;
        }
    };
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
        
        if (userData.role === 'artist') {
             if(userData.applicationStatus === 'approved'){
                 router.push('/artist/dashboard');
             } else {
                 const status = userData.applicationStatus === 'pending' ? 'is still pending review' : 'was rejected';
                 toast({ title: 'Login Failed', description: `Your artist application ${status}.`, variant: 'destructive' });
                 await signOut(auth);
                 return false;
             }
        } else if (userData.role === 'admin') {
            router.push('/admin');
        } else {
            router.push('/user-dashboard');
        }
        
        toast({ title: 'Login Successful', description: `Welcome back!` });
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
        
        const userRole: Role = email.toLowerCase() === 'admin@cloudstage.live' ? 'admin' : 'user';

        const newUser: User = { 
            id: firebaseUser.uid, 
            name, 
            email, 
            phoneNumber, 
            role: userRole,
            applicationStatus: userRole === 'admin' ? 'approved' : 'none',
            profilePictureUrl: `https://api.dicebear.com/8.x/lorelei/svg?seed=${email}`
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        toast({ title: 'Registration Successful', description: 'Welcome! Please log in.' });
        await signOut(auth);
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
      try {
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
            
            const newStatusForUserDoc = status === 'Approved' ? 'approved' : 'rejected';

            await updateDoc(userDocRef, { applicationStatus: newStatusForUserDoc });
            await updateDoc(appDocRef, updatedAppData);
            
            toast({ title: `Application ${status}`});
        }
      } catch (error: any) {
        toast({ title: 'Update Failed', description: error.message, variant: 'destructive' });
      }
  };

  const uploadImage = async (file: File, path: string): Promise<string | null> => {
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error: any)      {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
      return null;
    }
  };

  const updateUserProfile = async (updatedData: Partial<User>) => {
    if (!user) return;
    try {
        const userDocRef = doc(db, 'users', user.id);
        await updateDoc(userDocRef, updatedData);
        toast({ title: "Profile Updated", description: "Your changes have been saved." });
    } catch (error: any) {
        toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    }
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

    // Check against current `myTickets` state to prevent duplicates
    if (myTickets.some(t => t.eventId === eventId)) {
      toast({ title: "Already Owned", description: "You already have a ticket for this event.", variant: "destructive" });
      return;
    }

    const eventDetails = events.find(e => e.id === eventId);
    if (!eventDetails) {
        toast({ title: "Purchase Failed", description: "Event details could not be found.", variant: "destructive" });
        return;
    }

    const newTicket = {
      userId: user.id,
      eventId: eventId,
      artistId: eventDetails.artistId || null,
      purchaseDate: serverTimestamp(),
    };

    try {
        await addDoc(collection(db, 'tickets'), newTicket);
        
        // Simulate subscription credit usage if applicable
        if (user.subscription && user.subscription.eventCount > 0 && eventDetails.price > 0) {
            const updatedUser = {
            ...user,
            subscription: {
                ...user.subscription,
                eventCount: user.subscription.eventCount - 1,
            }
            };
            setUser(updatedUser); // Update local user state
            await updateDoc(doc(db, 'users', user.id), { subscription: updatedUser.subscription });
        }
        
        toast({ title: "Purchase Successful!", description: "Your ticket has been added to 'My Tickets'."});

    } catch (error: any) {
        toast({ title: "Purchase Failed", description: error.message, variant: "destructive" });
    }
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
    uploadImage,
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

    