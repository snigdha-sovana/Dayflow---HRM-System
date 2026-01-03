
import React, { useState, useEffect } from 'react';
import { User, UserRole, AttendanceStatus } from '../types';
import { employeeService } from '../services/employeeService';
import { Link } from 'react-router-dom';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user.role === UserRole.ADMIN) {
      employeeService.getAll().then(setEmployees);
    }
  }, [user.role]);

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.login_id.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: AttendanceStatus) => {
    switch(status) {
      case AttendanceStatus.PRESENT: return 'bg-green-500';
      case AttendanceStatus.ABSENT: return 'bg-yellow-500';
      case AttendanceStatus.LEAVE: return 'bg-blue-400';
      default: return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch(status) {
      case AttendanceStatus.PRESENT: return 'fa-circle-check';
      case AttendanceStatus.ABSENT: return 'fa-circle-xmark';
      case AttendanceStatus.LEAVE: return 'fa-paper-plane';
      default: return 'fa-circle';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            {user.role === UserRole.ADMIN 
              ? 'Manage your workforce and monitor real-time activity.' 
              : `Welcome back, ${user.name}! Here is your overview.`}
          </p>
        </div>
        {user.role === UserRole.ADMIN && (
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <i className="fa-solid fa-plus"></i>
            NEW EMPLOYEE
          </button>
        )}
      </div>

      {user.role === UserRole.ADMIN ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Employees" value={employees.length.toString()} icon="fa-users" color="indigo" />
            <StatCard label="Present Today" value="4" icon="fa-user-check" color="green" />
            <StatCard label="On Leave" value="1" icon="fa-paper-plane" color="blue" />
            <StatCard label="Late Arrivals" value="0" icon="fa-clock" color="orange" />
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <h2 className="font-bold text-gray-800 text-lg">Employee Directory</h2>
              <div className="relative w-72">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input 
                  type="text" 
                  placeholder="Search name, ID..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {filteredEmployees.map((emp) => (
                <Link 
                  key={emp.id} 
                  to={`/profile/${emp.id}`}
                  className="group bg-white border border-gray-100 rounded-3xl p-5 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                     <div className={`w-2 h-2 rounded-full ${getStatusColor(emp.role === UserRole.ADMIN ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT)}`}></div>
                     <span className="text-[10px] font-bold text-gray-500 uppercase">{emp.role === UserRole.ADMIN ? 'Online' : 'Offline'}</span>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random&size=128`} 
                        alt={emp.name}
                        className="w-20 h-20 rounded-2xl object-cover ring-4 ring-gray-50 group-hover:ring-indigo-50 transition-all"
                      />
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{emp.name}</h3>
                    <p className="text-xs font-semibold text-gray-400 mt-0.5 tracking-wider uppercase">{emp.login_id}</p>
                    <p className="text-sm text-gray-500 mt-2">{emp.job_title}</p>
                    <p className="text-xs text-indigo-500 font-medium mt-1">{emp.department}</p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-medium text-gray-400">
                    <span className="flex items-center gap-1"><i className="fa-solid fa-calendar"></i> Joined Jan '23</span>
                    <i className="fa-solid fa-chevron-right group-hover:translate-x-1 transition-transform"></i>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-10 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
               <div className="relative z-10">
                 <h2 className="text-3xl font-bold mb-2">Good Day, {user.name}!</h2>
                 <p className="text-indigo-100 opacity-90 max-w-md">Your work performance has been exceptional this week. Keep up the great spirit!</p>
                 <div className="flex gap-4 mt-8">
                   <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
                     <p className="text-xs font-semibold text-indigo-200 uppercase tracking-widest mb-1">Working hours</p>
                     <p className="text-2xl font-bold">38.5 hrs</p>
                   </div>
                   <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
                     <p className="text-xs font-semibold text-indigo-200 uppercase tracking-widest mb-1">Tasks Done</p>
                     <p className="text-2xl font-bold">12 / 15</p>
                   </div>
                 </div>
               </div>
               <i className="fa-solid fa-rocket absolute -right-8 -bottom-8 text-[12rem] opacity-10 rotate-12"></i>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Upcoming Schedule</h3>
              <div className="space-y-4">
                 <ScheduleItem time="10:00 AM" title="Weekly Sprint Review" type="Meeting" color="blue" />
                 <ScheduleItem time="01:30 PM" title="Design System Workshop" type="Workshop" color="purple" />
                 <ScheduleItem time="04:00 PM" title="Project Update Sync" type="Sync" color="green" />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Leave Balance</h3>
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364.4" strokeDashoffset="120" className="text-indigo-600" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">24</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Days Left</span>
                </div>
              </div>
              <button className="w-full bg-gray-50 text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                Apply for Leave
              </button>
            </div>
            
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-6">
                <ActivityItem text="Checked in at 09:12 AM" time="2h ago" />
                <ActivityItem text="Salary slip generated" time="Yesterday" />
                <ActivityItem text="Time off request approved" time="2 days ago" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; icon: string; color: string }> = ({ label, value, icon, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 bg-${color}-50 text-${color}-600 rounded-2xl flex items-center justify-center mb-4 text-xl`}>
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

const ScheduleItem: React.FC<{ time: string, title: string, type: string, color: string }> = ({ time, title, type, color }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors">
    <div className="text-center min-w-[70px]">
      <p className="text-sm font-bold text-gray-900">{time}</p>
    </div>
    <div className={`w-1.5 h-10 bg-${color}-500 rounded-full`}></div>
    <div className="flex-1">
      <h4 className="text-sm font-bold text-gray-900">{title}</h4>
      <p className="text-xs text-gray-500">{type}</p>
    </div>
  </div>
);

const ActivityItem: React.FC<{ text: string, time: string }> = ({ text, time }) => (
  <div className="flex gap-3">
    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5"></div>
    <div>
      <p className="text-sm text-gray-800">{text}</p>
      <p className="text-xs text-gray-400 mt-0.5">{time}</p>
    </div>
  </div>
);

export default Dashboard;
