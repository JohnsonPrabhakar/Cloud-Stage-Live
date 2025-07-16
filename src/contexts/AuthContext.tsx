import React, { createContext } from 'react';
import type { User, Role } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  role: Role;
  isLoading: boolean;
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string) => boolean;
  artistRegister: (details: Omit<User, 'id'>) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
