
import { User, UserRole } from '../types';
import { employeeService } from './employeeService';

const STORAGE_KEY = 'hrm_auth_user';

export const authService = {
  login: async (identifier: string, password: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 800));
    
    const employees = await employeeService.getAll();
    const user = employees.find(e => 
      (e.email.toLowerCase() === identifier.toLowerCase() || 
       e.login_id.toLowerCase() === identifier.toLowerCase())
    );

    if (user) {
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
