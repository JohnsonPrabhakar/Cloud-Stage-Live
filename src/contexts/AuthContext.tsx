import type {User, Role} from '@/lib/types';
import {createContext} from 'react';

interface AuthContextType {
  user: User | null;
  role: Role;
  isLoading: boolean;
  registeredUsers: User[];
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string) => boolean;
  artistRegister: (details: Omit<User, 'id'>) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
