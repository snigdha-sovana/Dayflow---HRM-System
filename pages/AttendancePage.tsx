
import React, { useState, useEffect } from 'react';
import { User, UserRole, Attendance, AttendanceStatus } from '../types';
import { attendanceService } from '../services/attendanceService';
import { employeeService } from '../services/employeeService';

interface AttendancePageProps {
  user: User;
}

const AttendancePage: React.FC<AttendancePageProps> = ({ user }) => {
  const [history, setHistory] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const isAdmin = user.role === UserRole.ADMIN;

  useEffect(() => {
    const loadData = async () => {
      if (isAdmin) {
        // Fetch all attendance records for the selected date
        const [attData, empData] = await Promise.all([
          attendanceService.getAllAttendance(undefined, selectedDate),
          employeeService.getAll()
        ]);
        setHistory(attData);
        setEmployees(empData);
      } else {
        // Fetch history for the specific employee
        const attData = await attendanceService.getAllAttendance(user.id);
        setHistory(attData);
      }
    };
    loadData();
  }, [isAdmin, selectedDate, user.id]);

  const stats = attendanceService.calculateStats(history);

  // Helper to get extra hours (Working Hours - 8)
  const getExtraHoursValue = (hours: number) => Math.max(0, hours - 8).toFixed(2);

  // For Admin: Link attendance records to employee names for the specific selected date
  const adminRows = employees
    .filter(emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .map(emp => {
      const record = history.find(a => a.user_id === emp.id);
      return {
        id: emp.id,
        name: emp.name,
        check_in: record?.check_in || '--:--',
        check_out: record?.check_out || '--:--',
        working_hours: record?.working_hours || 0,
        extra_hours: record ? getExtraHoursValue(record.working_hours) : '0.00'
      };
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Attendance Log</h1>
          <p className="text-gray-500 mt-1 font-medium">
            {isAdmin ? "Review daily presence across the company" : "Monitor your attendance history and extra hours."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Date Selector - Shared by both, but crucial for Admin view */}
          <div className="flex flex-col">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Select Date</label>
            <div className="bg-white border border-gray-200 rounded-2xl p-1.5 flex shadow-sm hover:border-indigo-300 transition-colors">
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 bg-transparent text-sm font-bold text-black focus:outline-none"
              />
            </div>
          </div>

          {/* Admin Specific Search Bar */}
          {isAdmin && (
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Search Employee</label>
              <div className="relative w-64">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input 
                  type="text" 
                  placeholder="Employee name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-black placeholder:text-gray-400 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all shadow-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Employee Stats Dashboard - Not visible to Admin per requirements */}
      {!isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Present Days" value={stats.presentDays.toString()} icon="fa-calendar-check" color="green" />
          <StatCard label="Leaves Count" value={stats.leaveDays.toString()} icon="fa-plane-departure" color="orange" />
          <StatCard label="Total Working Days" value={stats.totalPayable.toString()} icon="fa-briefcase" color="indigo" />
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                {isAdmin ? (
                  <>
                    <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Employee</th>
                    <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Check In</th>
                    <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Check Out</th>
                    <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 text-center">Working Hours</th>
                    <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 text-center">Extra Hours</th>
                  </>
                ) : (
                  <>
                    <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Date</th>
                    <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Check In</th>
                    <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Check Out</th>
                    <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 text-center">Work Hours</th>
                    <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 text-center">Extra Hours</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isAdmin ? (
                adminRows.map((row) => (
                  <tr key={row.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=random`} 
                          className="w-9 h-9 rounded-xl shadow-sm"
                          alt={row.name}
                        />
                        <span className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-sm font-bold text-gray-600">{row.check_in}</td>
                    <td className="px-10 py-6 text-sm font-bold text-gray-600">{row.check_out}</td>
                    <td className="px-10 py-6 text-center">
                      <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-black">
                        {row.working_hours.toFixed(2)} hrs
                      </span>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-xl text-xs font-black ${parseFloat(row.extra_hours) > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {row.extra_hours} hrs
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                history.map((record) => (
                  <tr key={record.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-10 py-6 font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {new Date(record.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-10 py-6 text-sm font-bold text-gray-600">{record.check_in || '--:--'}</td>
                    <td className="px-10 py-6 text-sm font-bold text-gray-600">{record.check_out || '--:--'}</td>
                    <td className="px-10 py-6 text-center">
                      <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-black">
                        {record.working_hours.toFixed(2)} hrs
                      </span>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-xl text-xs font-black ${parseFloat(getExtraHoursValue(record.working_hours)) > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {getExtraHoursValue(record.working_hours)} hrs
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {isAdmin && adminRows.length === 0 && (
            <div className="py-20 text-center text-gray-400 font-medium">
              No attendance records found for this date.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string, value: string, icon: string, color: string }> = ({ label, value, icon, color }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all">
    <div>
      <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-4xl font-black text-gray-900">{value}</p>
    </div>
    <div className={`w-14 h-14 bg-${color}-50 text-${color}-500 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
      <i className={`fa-solid ${icon}`}></i>
    </div>
  </div>
);

export default AttendancePage;
