
import { Attendance, AttendanceStatus } from '../types';

export const attendanceService = {
  getTodayAttendance: async (userId: string): Promise<Attendance | null> => {
    const data = localStorage.getItem(`attendance_${userId}_${new Date().toLocaleDateString()}`);
    return data ? JSON.parse(data) : null;
  },

  checkIn: async (userId: string): Promise<Attendance> => {
    const now = new Date();
    const attendance: Attendance = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: userId,
      date: now.toLocaleDateString(),
      check_in: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      check_out: null,
      working_hours: 0,
      status: AttendanceStatus.PRESENT
    };
    localStorage.setItem(`attendance_${userId}_${attendance.date}`, JSON.stringify(attendance));
    return attendance;
  },

  checkOut: async (userId: string): Promise<Attendance> => {
    const date = new Date().toLocaleDateString();
    const data = localStorage.getItem(`attendance_${userId}_${date}`);
    if (!data) throw new Error('No check-in record found');
    
    const attendance: Attendance = JSON.parse(data);
    const now = new Date();
    attendance.check_out = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Calculate simple working hours
    const checkInTime = new Date();
    const [h, m] = attendance.check_in!.split(':');
    checkInTime.setHours(parseInt(h), parseInt(m));
    const diff = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    attendance.working_hours = Math.max(0, diff);

    localStorage.setItem(`attendance_${userId}_${date}`, JSON.stringify(attendance));
    return attendance;
  },

  getAllAttendance: async (userId?: string): Promise<Attendance[]> => {
    // Return mock historical data
    return [
      { id: '101', user_id: userId || '1', date: '2023-10-24', check_in: '09:00 AM', check_out: '06:00 PM', working_hours: 9.0, status: AttendanceStatus.PRESENT },
      { id: '102', user_id: userId || '1', date: '2023-10-23', check_in: '09:15 AM', check_out: '06:15 PM', working_hours: 9.0, status: AttendanceStatus.PRESENT },
      { id: '103', user_id: userId || '1', date: '2023-10-22', check_in: null, check_out: null, working_hours: 0, status: AttendanceStatus.ABSENT },
    ];
  }
};
