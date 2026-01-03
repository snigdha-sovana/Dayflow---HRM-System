
import { Attendance, AttendanceStatus, User } from '../types';

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
      date: now.toISOString().split('T')[0],
      check_in: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      check_out: null,
      working_hours: 0,
      status: AttendanceStatus.PRESENT
    };
    localStorage.setItem(`attendance_${userId}_${attendance.date}`, JSON.stringify(attendance));
    return attendance;
  },

  checkOut: async (userId: string): Promise<Attendance> => {
    const date = new Date().toISOString().split('T')[0];
    const data = localStorage.getItem(`attendance_${userId}_${date}`);
    if (!data) throw new Error('No check-in record found');
    
    const attendance: Attendance = JSON.parse(data);
    const now = new Date();
    attendance.check_out = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const checkInParts = attendance.check_in!.split(/[:\s]/);
    const checkInTime = new Date();
    let hours = parseInt(checkInParts[0]);
    if (attendance.check_in!.includes('PM') && hours !== 12) hours += 12;
    if (attendance.check_in!.includes('AM') && hours === 12) hours = 0;
    checkInTime.setHours(hours, parseInt(checkInParts[1]), 0);
    
    const diff = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    attendance.working_hours = Math.max(0, diff);

    localStorage.setItem(`attendance_${userId}_${date}`, JSON.stringify(attendance));
    return attendance;
  },

  getAllAttendance: async (userId?: string, dateFilter?: string): Promise<Attendance[]> => {
    // Simulated historical data
    const mockData: Attendance[] = [
      { id: '101', user_id: '1', date: '2025-05-15', check_in: '09:00 AM', check_out: '06:30 PM', working_hours: 9.5, status: AttendanceStatus.PRESENT },
      { id: '102', user_id: '2', date: '2025-05-15', check_in: '08:45 AM', check_out: '05:45 PM', working_hours: 9.0, status: AttendanceStatus.PRESENT },
      { id: '103', user_id: '3', date: '2025-05-15', check_in: '09:15 AM', check_out: '05:15 PM', working_hours: 8.0, status: AttendanceStatus.PRESENT },
      { id: '104', user_id: '4', date: '2025-05-15', check_in: '09:00 AM', check_out: '07:00 PM', working_hours: 10.0, status: AttendanceStatus.PRESENT },
      { id: '105', user_id: '5', date: '2025-05-15', check_in: null, check_out: null, working_hours: 0, status: AttendanceStatus.ABSENT },
      // Previous days
      { id: '106', user_id: '2', date: '2025-05-14', check_in: '09:00 AM', check_out: '05:00 PM', working_hours: 8.0, status: AttendanceStatus.PRESENT },
      { id: '107', user_id: '2', date: '2025-05-13', check_in: '09:00 AM', check_out: '06:00 PM', working_hours: 9.0, status: AttendanceStatus.PRESENT },
    ];

    let filtered = mockData;
    if (userId) filtered = filtered.filter(a => a.user_id === userId);
    if (dateFilter) filtered = filtered.filter(a => a.date === dateFilter);
    
    return filtered;
  },

  calculateStats: (history: Attendance[]) => {
    const presentDays = history.filter(a => a.status === AttendanceStatus.PRESENT || a.status === AttendanceStatus.HALF_DAY).length;
    const leaveDays = history.filter(a => a.status === AttendanceStatus.LEAVE).length;
    const totalPayable = presentDays + leaveDays; // Simplified logic
    return { presentDays, leaveDays, totalPayable };
  }
};
