
import { User, UserRole } from '../types';

let MOCK_EMPLOYEES: User[] = [
  { id: '1', login_id: 'OIJOAN20230001', name: 'Alex Johnson', email: 'alex@hrmaster.com', mobile: '+1 555-001', department: 'Operations', job_title: 'HR Director', role: UserRole.ADMIN, created_at: '2023-01-01' },
  { id: '2', login_id: 'OISAWI20230002', name: 'Sarah Williams', email: 'sarah@hrmaster.com', mobile: '+1 555-002', department: 'Engineering', job_title: 'Full Stack Dev', role: UserRole.EMPLOYEE, created_at: '2023-02-15' },
  { id: '3', login_id: 'OIMICH20230003', name: 'Michael Chen', email: 'michael@hrmaster.com', mobile: '+1 555-003', department: 'Design', job_title: 'UI Designer', role: UserRole.EMPLOYEE, created_at: '2023-03-10' },
  { id: '4', login_id: 'OIEMDA20230004', name: 'Emma Davis', email: 'emma@hrmaster.com', mobile: '+1 555-004', department: 'Sales', job_title: 'Account Manager', role: UserRole.EMPLOYEE, created_at: '2023-05-20' },
  { id: '5', login_id: 'OIROWI20230005', name: 'Robert Wilson', email: 'robert@hrmaster.com', mobile: '+1 555-005', department: 'Engineering', job_title: 'Frontend Lead', role: UserRole.EMPLOYEE, created_at: '2023-06-05' },
];

export const employeeService = {
  getAll: async (): Promise<User[]> => {
    return [...MOCK_EMPLOYEES];
  },
  getById: async (id: string): Promise<User | undefined> => {
    return MOCK_EMPLOYEES.find(e => e.id === id);
  },
  generateEmployeeId: (companyName: string, fullName: string): string => {
    const co = companyName.substring(0, 2).toUpperCase();
    const names = fullName.split(' ');
    const fn = (names[0] || 'XX').substring(0, 2).toUpperCase();
    const ln = (names[1] || names[0] || 'XX').substring(0, 2).toUpperCase();
    const year = new Date().getFullYear().toString();
    
    const count = MOCK_EMPLOYEES.filter(e => e.login_id.includes(year)).length + 1;
    const serial = String(count).padStart(4, '0');
    
    return `${co}${fn}${ln}${year}${serial}`;
  },
  create: async (data: Partial<User>): Promise<User> => {
    const newUser = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
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
