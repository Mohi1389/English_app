import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  fullName: string;
  email: string;
  level?: string | null;
  learningGoal?: string | null;
  ageRange?: string | null;
  xp?: number;
  streakDays?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: Record<string, unknown>) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Restore session
  useEffect(() => {
    const saved = localStorage.getItem('lwm-token');
    if (!saved) return;
    setToken(saved);
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${saved}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.user && setUser(d.user))
      .catch(() => localStorage.removeItem('lwm-token'));
  }, []);

  async function post(url: string, body: unknown) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'خطایی رخ داد');
        return false;
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('lwm-token', data.token);
      return true;
    } catch {
      setError('اتصال برقرار نشد');
      return false;
    } finally {
      setLoading(false);
    }
  }

  const value: AuthState = {
    user,
    token,
    loading,
    error,
    login: (email, password) => post('/api/auth/login', { email, password }),
    signup: (data) => post('/api/auth/signup', data),
    logout: () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('lwm-token');
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
