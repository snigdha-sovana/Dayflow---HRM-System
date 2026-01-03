
import { User, UserRole } from '../types';

const MOCK_EMPLOYEES: User[] = [
  { id: '1', login_id: 'EMP0001', name: 'Alex Johnson', email: 'alex@hrmaster.com', mobile: '+1 555-001', department: 'Operations', job_title: 'HR Director', role: UserRole.ADMIN, created_at: '2023-01-01' },
  { id: '2', login_id: 'EMP0002', name: 'Sarah Williams', email: 'sarah@hrmaster.com', mobile: '+1 555-002', department: 'Engineering', job_title: 'Full Stack Dev', role: UserRole.EMPLOYEE, created_at: '2023-02-15' },
  { id: '3', login_id: 'EMP0003', name: 'Michael Chen', email: 'michael@hrmaster.com', mobile: '+1 555-003', department: 'Design', job_title: 'UI Designer', role: UserRole.EMPLOYEE, created_at: '2023-03-10' },
  { id: '4', login_id: 'EMP0004', name: 'Emma Davis', email: 'emma@hrmaster.com', mobile: '+1 555-004', department: 'Sales', job_title: 'Account Manager', role: UserRole.EMPLOYEE, created_at: '2023-05-20' },
  { id: '5', login_id: 'EMP0005', name: 'Robert Wilson', email: 'robert@hrmaster.com', mobile: '+1 555-005', department: 'Engineering', job_title: 'Frontend Lead', role: UserRole.EMPLOYEE, created_at: '2023-06-05' },
];

export const employeeService = {
  getAll: async (): Promise<User[]> => {
    return MOCK_EMPLOYEES;
  },
  getById: async (id: string): Promise<User | undefined> => {
    return MOCK_EMPLOYEES.find(e => e.id === id);
  },
  create: async (data: Partial<User>): Promise<User> => {
    const newUser = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      login_id: `EMP${String(MOCK_EMPLOYEES.length + 1).padStart(4, '0')}`,
      created_at: new Date().toISOString()
    } as User;
    MOCK_EMPLOYEES.push(newUser);
    return newUser;
  },
  update: async (id: string, data: Partial<User>): Promise<User> => {
    const index = MOCK_EMPLOYEES.findIndex(e => e.id === id);
    if (index !== -1) {
      MOCK_EMPLOYEES[index] = { ...MOCK_EMPLOYEES[index], ...data };
      return MOCK_EMPLOYEES[index];
    }
    throw new Error('Employee not found');
  }
};
