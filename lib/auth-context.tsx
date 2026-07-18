"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from './api';

type UserRole = 'admin' | 'employer' | 'job-seeker' | 'freelancer' | 'trainer' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, refreshToken: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        
        // Fetch fresh profile
        api.get('/auth/me')
        .then(res => res.data)
        .then(freshUser => {
          // Normalize role for frontend if needed, or just merge
          const normalizedRole = freshUser.role.toLowerCase() === 'candidate' ? 'job-seeker' : freshUser.role.toLowerCase().replace('_', '-');
          const updated = { ...JSON.parse(storedUser), ...freshUser, role: normalizedRole };
          setUser(updated);
          localStorage.setItem('user', JSON.stringify(updated));
        })
        .catch(err => {
          console.error("Failed to fetch fresh user data", err);
        });

      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string, refreshToken: string, userData: User) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    // Set cookies for middleware
    document.cookie = `access_token=${token}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `user_role=${userData.role}; path=/; max-age=86400; SameSite=Lax`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    document.cookie = `access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    setUser(null);
    router.push('/sign-in');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
