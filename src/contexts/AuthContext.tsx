import type {User, Role, ArtistApplication} from '@/lib/types';
import {createContext} from 'react';

interface AuthContextType {
  user: User | null;
  role: Role;
  isLoading: boolean;
  registeredUsers: User[];
  artistApplications: ArtistApplication[];
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string) => boolean;
  artistRegister: (application: ArtistApplication) => void;
  logout: () => void;
  updateApplicationStatus: (
    applicationId: string,
    status: 'Approved' | 'Rejected'
  ) => void;
  updateUserProfile: (updatedUser: Partial<User>) => void;
  subscribeUser: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
