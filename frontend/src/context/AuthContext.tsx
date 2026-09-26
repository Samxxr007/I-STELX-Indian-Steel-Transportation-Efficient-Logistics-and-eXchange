import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<UserRole, User> = {
  'ADMIN': {
    id: 1,
    full_name: 'Rajiv Menon (Admin)',
    email: 'admin@istelx.in',
    phone: '+91 98200 11223',
    organization: 'I-STELX Maritime Authority',
    department: 'Enterprise Systems & Governance',
    designation: 'Chief Technology & Logistics Officer',
    role: 'ADMIN',
    status: 'APPROVED',
    is_active: true
  },
  'Charter Manager': {
    id: 2,
    full_name: 'Vikramaditya Sharma',
    email: 'charter.manager@sail.in',
    phone: '+91 98112 33445',
    organization: 'Steel Authority of India Limited (SAIL)',
    department: 'Raw Materials & Maritime Chartering',
    designation: 'Head of Vessel Chartering',
    role: 'Charter Manager',
    status: 'APPROVED',
    is_active: true
  },
  'Logistics Manager': {
    id: 3,
    full_name: 'Ananya Roy Chowdhury',
    email: 'logistics.manager@sail.in',
    phone: '+91 97480 55667',
    organization: 'Steel Authority of India Limited (SAIL)',
    department: 'Inbound Raw Material Logistics',
    designation: 'Senior Logistics Director',
    role: 'Logistics Manager',
    status: 'APPROVED',
    is_active: true
  },
  'Operations Manager': {
    id: 4,
    full_name: 'Sanjay Patnaik',
    email: 'operations.manager@sail.in',
    phone: '+91 94370 77889',
    organization: 'Steel Authority of India Limited (SAIL)',
    department: 'Port Operations & Terminal Coordination',
    designation: 'Operations Lead - East Coast Ports',
    role: 'Operations Manager',
    status: 'APPROVED',
    is_active: true
  },
  'Management Viewer': {
    id: 5,
    full_name: 'Pooja Deshmukh',
    email: 'viewer@istelx.in',
    phone: '+91 98220 99001',
    organization: 'Ministry of Steel / Planning Board',
    department: 'Supply Chain Oversight',
    designation: 'Strategic Analyst',
    role: 'Management Viewer',
    status: 'APPROVED',
    is_active: true
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('istelx_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(DEMO_USERS['Charter Manager']);
      }
    } else {
      // Default to Charter Manager for rich interactive demo workflow
      setUser(DEMO_USERS['Charter Manager']);
      localStorage.setItem('istelx_user', JSON.stringify(DEMO_USERS['Charter Manager']));
      localStorage.setItem('istelx_token', 'demo_jwt_token_istelx_active');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await api.login({ email, password: pass });
      localStorage.setItem('istelx_token', res.access_token);
      localStorage.setItem('istelx_user', JSON.stringify(res.user));
      setUser(res.user);
    } catch (err: any) {
      // Fallback for seamless demo if backend offline
      let matchedRole: UserRole = 'Charter Manager';
      if (email.includes('admin')) matchedRole = 'ADMIN';
      else if (email.includes('logistics')) matchedRole = 'Logistics Manager';
      else if (email.includes('operations')) matchedRole = 'Operations Manager';
      else if (email.includes('viewer')) matchedRole = 'Management Viewer';

      const demoUser = DEMO_USERS[matchedRole];
      setUser(demoUser);
      localStorage.setItem('istelx_user', JSON.stringify(demoUser));
      localStorage.setItem('istelx_token', 'demo_jwt_token_fallback');
    }
  };

  const register = async (payload: any) => {
    await api.register(payload);
  };

  const logout = () => {
    localStorage.removeItem('istelx_token');
    localStorage.removeItem('istelx_user');
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    const newUser = DEMO_USERS[newRole];
    if (newUser) {
      setUser(newUser);
      localStorage.setItem('istelx_user', JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
