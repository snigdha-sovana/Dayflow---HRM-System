
import { User, UserRole } from '../types';

// Mock data storage in LocalStorage
const STORAGE_KEY = 'hrm_auth_user';

export const authService = {
  login: async (loginId: string, password: string): Promise<User> => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));

    // Admin Mock
    if (loginId === 'admin' || loginId === 'EMP0001') {
      const user: User = {
        id: '1',
        login_id: 'EMP0001',
        name: 'Alex Johnson',
        email: 'admin@hrmaster.com',
        mobile: '+1 (555) 123-4567',
        department: 'Operations',
        job_title: 'HR Director',
        role: UserRole.ADMIN,
        created_at: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
    }

    // Employee Mock
    if (loginId === 'emp' || loginId === 'EMP0002') {
      const user: User = {
        id: '2',
        login_id: 'EMP0002',
        name: 'Sarah Williams',
        email: 'sarah.w@hrmaster.com',
        mobile: '+1 (555) 987-6543',
        department: 'Engineering',
        job_title: 'Full Stack Engineer',
        role: UserRole.EMPLOYEE,
        created_at: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
    }

    throw new Error('Invalid credentials');
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }
};
