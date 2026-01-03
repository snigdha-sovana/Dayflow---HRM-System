
export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee'
}

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  HALF_DAY = 'Half-day',
  LEAVE = 'Leave'
}

export interface User {
  id: string;
  login_id: string;
  name: string;
  email: string;
  mobile: string;
  address?: string;
  department: string;
  job_title: string;
  role: UserRole;
  password_hash?: string;
  avatar?: string;
  created_at: string;
  
  // Professional Context
  company: string;
  manager: string;
  location: string;
  joining_date: string;
  
  // Private Info
  dob: string;
  nationality: string;
  personal_email: string;
  gender: string;
  marital_status: string;
  
  // Bank Details
  bank_account_no: string;
  bank_name: string;
  ifsc_code: string;
  pan_number: string;
  resume_url?: string;
}

export interface Salary {
  id: string;
  user_id: string;
  monthly_wage: number;
  working_days_week: number;
  working_hours: number;
  break_time: string;
  updated_at: string;
}

// Added Attendance interface to fix import errors in TopBar.tsx, attendanceService.ts and AttendancePage.tsx
export interface Attendance {
  id: string;
  user_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  working_hours: number;
  status: AttendanceStatus;
}

// Added LeaveRequest interface to fix import error in TimeOffPage.tsx
export interface LeaveRequest {
  id: string;
  user_id: string;
  user_name: string;
  type: 'Paid' | 'Sick' | 'Unpaid';
  start_date: string;
  end_date: string;
  remarks: string;
  status: 'Approved' | 'Rejected' | 'Pending';
  attachment_name?: string;
}
