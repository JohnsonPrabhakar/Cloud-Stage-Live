
'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import type { User, Role, ArtistApplication, Event, Movie, Ticket } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getEventStatus } from '@/lib/utils';
import { auth, db, storage } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { 
  collection, 
  onSnapshot, 
  doc,
  query,
  where,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Helper to convert Firestore timestamps to Dates in nested objects
const convertTimestamps = (data: any): any => {
    if (!data) return data;
    if (data instanceof Timestamp) {
        return data.toDate();
    }
    if (Array.isArray(data)) {
        return data.map(item => convertTimestamps(item));
    }
    if (typeof data === 'object' && data !== null) {
        const new_data: {[key: string]: any} = {};
        for (const key of Object.keys(data)) {
            new_data[key] = convertTimestamps(data[key]);
        }
        return new_data;
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
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      // This function will be assigned to the unsubscribe function for the user doc listener
      let unsubscribeUserDoc: (() => void) | null = null;
      
      if (firebaseUser) {
        setIsLoading(true);
        const userDocRef = doc(db, 'users', firebaseUser.uid);

        unsubscribeUserDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = convertTimestamps(docSnap.data()) as User;
            setUser(userData);
            const newRole = userData.role;
            setRole(newRole);
          } else {
            // User deleted from Firestore but still has an auth session, sign them out.
            signOut(auth);
          }
          setIsLoading(false);
        }, (error) => {
          console.error("Error in user snapshot listener:", error);
          signOut(auth);
          setIsLoading(false);
        });

      } else {
        // User is logged out, clear all user-specific state
        setUser(null);
        setRole(null);
        setMyTickets([]);
        setRegisteredUsers([]);
        setArtistApplications([]);
        setAllTickets([]);
        setIsLoading(false);
      }
    
      return () => {
        // Cleanup the user document listener when auth state changes or on unmount
        if (unsubscribeUserDoc) {
          unsubscribeUserDoc();
        }
      };
    });
  
    // Main cleanup on component unmount
    return () => unsubscribeAuth();
  }, []);

  // Listener for user-specific data (tickets, role-specific data)
  useEffect(() => {
    let listeners: (() => void)[] = [];

    if (user && user.id) {
        // --- My Tickets Listener (for ALL logged-in users) ---
        const myTicketsQuery = query(collection(db, 'tickets'), where('userId', '==', user.id));
        const unsubscribeMyTickets = onSnapshot(myTicketsQuery, (snapshot) => {
            const userTickets = snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Ticket));
            setMyTickets(userTickets);
        }, (error) => {
            console.error("Error fetching user tickets: ", error);
        });
        listeners.push(unsubscribeMyTickets);

        // --- Role-Specific Listeners ---
        if (role === 'admin') {
            const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => setRegisteredUsers(snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as User))));
            const unsubApps = onSnapshot(collection(db, "artistApplications"), (snapshot) => setArtistApplications(snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as ArtistApplication))));
            const unsubAllTickets = onSnapshot(collection(db, "tickets"), (snapshot) => setAllTickets(snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Ticket))));
            listeners.push(unsubUsers, unsubApps, unsubAllTickets);
        } else if (role === 'artist') {
            const q = query(collection(db, "tickets"), where("artistId", "==", user.id));
            const unsubAllTickets = onSnapshot(q, (snapshot) => {
                setAllTickets(snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) } as Ticket)));
            });
            listeners.push(unsubAllTickets);
        }
    }
  
    // Cleanup function for this effect
    return () => {
        listeners.forEach(unsub => unsub());
    };
  }, [user, role]); // Rerun this effect if the user or role changes


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
    
    let usedSubscriptionCredit = false;
    // Check if user has an active subscription with credits
    if (user.subscription && user.subscription.eventCount > 0) {
      const event = events.find(e => e.id === eventId);
      if (event && event.price > 0) { // Only use credit for paid events
        await updateDoc(doc(db, 'users', user.id), {
          'subscription.eventCount': user.subscription.eventCount - 1
        });
        usedSubscriptionCredit = true;
      }
    }
    
    const eventDetails = events.find(e => e.id === eventId);
    
    const newTicket = {
        userId: user.id,
        eventId,
        artistId: eventDetails?.artistId || null,
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
