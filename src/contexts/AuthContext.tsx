import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import apiClient from '@/lib/apiClient';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { toast } from 'sonner';

interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  rating: number;
  avgWPM: number;
  avatar?: string;
  totalTests: number;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
  });

  const setAuth = (user: AuthUser | null, token: string | null) => {
    setState({ user, token, isAuthenticated: !!user, loading: false });
    if (token) {
      localStorage.setItem('token', token);
      connectSocket(token);
    } else {
      localStorage.removeItem('token');
      disconnectSocket();
    }
  };

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setState({ user: null, token: null, isAuthenticated: false, loading: false });
      return;
    }
    try {
      const { data } = await apiClient.get('/auth/me');
      const u = data.data;
      setAuth({
        id: u._id || u.id,
        username: u.username,
        email: u.email,
        role: u.role,
        rating: u.rating,
        avgWPM: u.avgWPM,
        avatar: u.avatar,
        totalTests: u.totalTests,
      }, token);
    } catch {
      setAuth(null, null);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    const { token, user: u } = data.data;
    setAuth({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      rating: u.rating || 1000,
      avgWPM: u.avgWPM || 0,
      avatar: u.avatar,
      totalTests: u.totalTests || 0,
    }, token);
    toast.success('Welcome back!');
  };

  const register = async (username: string, email: string, password: string) => {
    const { data } = await apiClient.post('/auth/register', { username, email, password });
    const { token, user: u } = data.data;
    setAuth({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      rating: 1000,
      avgWPM: 0,
      avatar: '',
      totalTests: 0,
    }, token);
    toast.success('Account created!');
  };

  const logout = () => {
    setAuth(null, null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      refreshUser,
      isAdmin: state.user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
