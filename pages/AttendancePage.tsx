
import React, { useState, useEffect } from 'react';
import { User, UserRole, Attendance } from '../types';
import { attendanceService } from '../services/attendanceService';

interface AttendancePageProps {
  user: User;
}

const AttendancePage: React.FC<AttendancePageProps> = ({ user }) => {
  const [history, setHistory] = useState<Attendance[]>([]);
  const isAdmin = user.role === UserRole.ADMIN;

  useEffect(() => {
    attendanceService.getAllAttendance().then(setHistory);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Log</h1>
          <p className="text-gray-500 mt-1">Review your daily attendance and work hours.</p>
        </div>
        <div className="flex gap-4">
           <button className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
             <i className="fa-solid fa-filter text-gray-500"></i>
           </button>
           <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100">
             Export CSV
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
           <div className="flex gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                 <span className="text-sm font-bold text-gray-700">Present</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                 <span className="text-sm font-bold text-gray-700">Absent</span>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all">
                <i className="fa-solid fa-chevron-left text-xs"></i>
              </button>
              <span className="font-bold text-gray-900">October 2023</span>
              <button className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all">
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Check In</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Check Out</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Working Hours</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {history.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-gray-900">{record.date}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Thursday</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-arrow-right-to-bracket text-indigo-500 text-xs"></i>
                      <span className="text-sm font-bold text-gray-700">{record.check_in || '--:--'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-arrow-right-from-bracket text-violet-500 text-xs"></i>
                      <span className="text-sm font-bold text-gray-700">{record.check_out || '--:--'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold">
                       {record.working_hours.toFixed(2)} hrs
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${record.status === 'Present' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                       <span className="text-xs font-black uppercase tracking-wider">{record.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
