import type {User, Role, ArtistApplication, Event, Movie, Ticket} from '@/lib/types';
import {createContext} from 'react';

interface AuthContextType {
  user: User | null;
  role: Role;
  isLoading: boolean;
  registeredUsers: User[];
  artistApplications: ArtistApplication[];
  events: Event[];
  movies: Movie[];
  myTickets: Ticket[];
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string, phoneNumber: string) => boolean;
  artistRegister: (application: Omit<ArtistApplication, 'id' | 'status'>) => void;
  logout: () => void;
  updateApplicationStatus: (
    applicationId: string,
    status: 'Approved' | 'Rejected',
    reason?: string
  ) => void;
  updateUserProfile: (updatedUser: Partial<User>) => void;
  subscribeUser: () => void;
  createEvent: (eventData: Omit<Event, 'id' | 'artist' | 'artistId' | 'status' | 'approvalStatus'>) => void;
  updateEventApproval: (eventId: string, status: 'Approved' | 'Rejected') => void;
  createMovie: (movieData: Omit<Movie, 'id'>) => void;
  deleteMovie: (movieId: string) => void;
  purchaseTicket: (eventId: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

    
