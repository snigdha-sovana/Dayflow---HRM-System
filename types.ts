
export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee'
}

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LEAVE = 'Leave'
}

export interface User {
  id: string;
  login_id: string;
  name: string;
  email: string;
  mobile: string;
  department: string;
  job_title: string;
  role: UserRole;
  password_hash?: string;
  avatar?: string;
  created_at: string;
}

export interface Salary {
  id: string;
  user_id: string;
  wage: number;
  basic: number;
  hra: number;
  allowance: number;
  lta: number;
  pf: number;
  professional_tax: number;
  net_salary: number;
  updated_at: string;
}

export interface Attendance {
  id: string;
  user_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  working_hours: number;
  status: AttendanceStatus;
}

export interface LeaveRequest {
  id: string;
  user_id: string;
  user_name: string;
  type: 'Paid Time Off' | 'Sick Leave' | 'Unpaid Leave';
  start_date: string;
  end_date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  allocation?: number;
}
