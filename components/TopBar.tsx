
import React, { useState } from 'react';
import { User, UserRole, AttendanceStatus } from '../types';
import { Link, NavLink } from 'react-router-dom';
import { attendanceService } from '../services/attendanceService';

interface TopBarProps {
  user: User;
  onLogout: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ user, onLogout }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showAttendanceDropdown, setShowAttendanceDropdown] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<AttendanceStatus | null>(null);

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Employees', path: '/', hidden: user.role !== UserRole.ADMIN },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Time Off', path: '/time-off' },
    { name: 'Salary', path: '/salary', hidden: user.role !== UserRole.ADMIN },
  ];

  const handleStatusChange = async (status: AttendanceStatus) => {
    if (status === AttendanceStatus.PRESENT) {
      await attendanceService.checkIn(user.id);
    }
    // In a real app, we'd handle ABSENT/LEAVE status updates via service
    setCurrentStatus(status);
    setShowAttendanceDropdown(false);
  };

  const getStatusDisplay = () => {
    switch(currentStatus) {
      case AttendanceStatus.PRESENT: return { label: 'Present', icon: '🟢' };
      case AttendanceStatus.ABSENT: return { label: 'Absent', icon: '🟡' };
      case AttendanceStatus.LEAVE: return { label: 'Leave', icon: '✈️' };
      default: return { label: 'Status', icon: '📅' };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <header className="h-20 bg-white border-b border-gray-200 px-6 md:px-12 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <i className="fa-solid fa-layer-group text-white text-lg"></i>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight hidden lg:block">HRMaster</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.filter(item => !item.hidden).map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                ${isActive 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Attendance Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowAttendanceDropdown(!showAttendanceDropdown)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all"
          >
            <span className="text-lg leading-none">{statusInfo.icon}</span>
            <span className="text-sm font-bold text-gray-700 hidden sm:block">{statusInfo.label}</span>
            <i className="fa-solid fa-chevron-down text-[10px] text-gray-400"></i>
          </button>

          {showAttendanceDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowAttendanceDropdown(false)}></div>
              <div className="absolute right-0 mt-3 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <button 
                  onClick={() => handleStatusChange(AttendanceStatus.PRESENT)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors text-left"
                >
                  <span className="text-lg">🟢</span>
                  <span className="font-semibold">Present</span>
                </button>
                <button 
                  onClick={() => handleStatusChange(AttendanceStatus.ABSENT)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-yellow-50 transition-colors text-left"
                >
                  <span className="text-lg">🟡</span>
                  <span className="font-semibold">Absent</span>
                </button>
                <button 
                  onClick={() => handleStatusChange(AttendanceStatus.LEAVE)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors text-left"
                >
                  <span className="text-lg">✈️</span>
                  <span className="font-semibold">Leave</span>
                </button>
              </div>
            </>
          )}
        </div>

        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

        <div className="relative">
          <button 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">{user.name}</p>
              <p className="text-[10px] text-gray-400 capitalize font-bold tracking-widest">{user.role}</p>
            </div>
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
              alt="Avatar" 
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-indigo-100 transition-all shadow-sm"
            />
          </button>

          {showProfileDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfileDropdown(false)}></div>
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <Link 
                  to={`/profile/${user.id}`}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  <i className="fa-solid fa-user text-gray-400 w-5"></i>
                  My Profile
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
                  <i className="fa-solid fa-gear text-gray-400 w-5"></i>
                  Settings
                </button>
                <div className="h-px bg-gray-100 my-2"></div>
                <button 
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-bold"
                >
                  <i className="fa-solid fa-right-from-bracket w-5"></i>
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
