
import { User, UserRole, Salary } from '../types';

let MOCK_EMPLOYEES: User[] = [
  { 
    id: '1', 
    login_id: 'OIJOAN20230001', 
    name: 'Alex Johnson', 
    email: 'alex@hrmaster.com', 
    mobile: '+91 9876543210', 
    department: 'Operations', 
    job_title: 'HR Director', 
    role: UserRole.ADMIN, 
    created_at: '2023-01-01',
    company: 'Odoo India',
    manager: 'CEO Office',
    location: 'Gandhinagar, Gujarat',
    joining_date: '2023-01-01',
    dob: '1988-05-15',
    nationality: 'Indian',
    personal_email: 'alex.personal@gmail.com',
    gender: 'Male',
    marital_status: 'Married',
    bank_account_no: '918273645510',
    bank_name: 'HDFC Bank',
    ifsc_code: 'HDFC0001234',
    pan_number: 'ABCDE1234F'
  },
  { 
    id: '2', 
    login_id: 'OIPIPA20230002', 
    name: 'Piyush Pareek', 
    email: 'piyushpareek@hrmaster.com', 
    mobile: '+91 8888888888', 
    department: 'Engineering', 
    job_title: 'Full Stack Dev', 
    role: UserRole.EMPLOYEE, 
    created_at: '2023-02-15',
    company: 'Odoo India',
    manager: 'Alex Johnson',
    location: 'Remote, India',
    joining_date: '2023-02-15',
    dob: '1995-10-22',
    nationality: 'Indian',
    personal_email: 'piyushpareek@outlook.com',
    gender: 'Male',
    marital_status: 'Single',
    bank_account_no: '100200300400',
    bank_name: 'ICICI Bank',
    ifsc_code: 'ICIC0005678',
    pan_number: 'FGHIJ5678K'
  },
];

let MOCK_SALARIES: Salary[] = [
  { id: 's1', user_id: '1', monthly_wage: 150000, working_days_week: 5, working_hours: 8, break_time: '1:00 PM - 2:00 PM', updated_at: new Date().toISOString() },
  { id: 's2', user_id: '2', monthly_wage: 50000, working_days_week: 5, working_hours: 8, break_time: '1:30 PM - 2:30 PM', updated_at: new Date().toISOString() },
];

export const employeeService = {
  getAll: async (): Promise<User[]> => {
    return [...MOCK_EMPLOYEES];
  },
  getById: async (id: string): Promise<User | undefined> => {
    return MOCK_EMPLOYEES.find(e => e.id === id);
  },
  getSalaryByUserId: async (userId: string): Promise<Salary | undefined> => {
    return MOCK_SALARIES.find(s => s.user_id === userId);
  },
  updateSalary: async (userId: string, data: Partial<Salary>): Promise<Salary> => {
    const index = MOCK_SALARIES.findIndex(s => s.user_id === userId);
    if (index !== -1) {
      MOCK_SALARIES[index] = { ...MOCK_SALARIES[index], ...data, updated_at: new Date().toISOString() };
      return MOCK_SALARIES[index];
    } else {
      const newSalary = { id: Math.random().toString(), user_id: userId, monthly_wage: 0, working_days_week: 5, working_hours: 8, break_time: '1:00 PM - 2:00 PM', ...data, updated_at: new Date().toISOString() } as Salary;
      MOCK_SALARIES.push(newSalary);
      return newSalary;
    }
  },
  generateEmployeeId: (companyName: string, fullName: string): string => {
    const co = companyName.substring(0, 2).toUpperCase();
    const names = fullName.split(' ');
    const fn = (names[0] || 'XX').substring(0, 2).toUpperCase();
    const ln = (names[1] || names[0] || 'XX').substring(0, 2).toUpperCase();
    const year = new Date().getFullYear().toString();
    const count = MOCK_EMPLOYEES.length + 1;
    const serial = String(count).padStart(4, '0');
    return `${co}${fn}${ln}${year}${serial}`;
  },
  create: async (data: Partial<User>): Promise<User> => {
    const newUser = { ...data, id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() } as User;
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
