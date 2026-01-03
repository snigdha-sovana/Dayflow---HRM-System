
import React, { useState, useEffect } from 'react';
import { User, UserRole, AttendanceStatus, Attendance } from '../types';
import { Link, NavLink } from 'react-router-dom';
import { attendanceService } from '../services/attendanceService';

interface TopBarProps {
  user: User;
  onLogout: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ user, onLogout }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Employees', path: '/', hidden: user.role !== UserRole.ADMIN },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Time Off', path: '/time-off' },
    // Salary removed from here as requested
  ];

  useEffect(() => {
    const fetchAttendance = async () => {
      const record = await attendanceService.getTodayAttendance(user.id);
      setTodayAttendance(record);
    };
    fetchAttendance();
  }, [user.id]);

  const handleCheckIn = async () => {
    setIsProcessing(true);
    try {
      const record = await attendanceService.checkIn(user.id);
      setTodayAttendance(record);
    } catch (error) {
      alert("Check-in failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckOut = async () => {
    setIsProcessing(true);
    try {
      const record = await attendanceService.checkOut(user.id);
      setTodayAttendance(record);
    } catch (error) {
      alert("Check-out failed. Ensure you have checked in first.");
    } finally {
      setIsProcessing(false);
    }
  };

  const isCheckedIn = !!todayAttendance?.check_in && !todayAttendance?.check_out;

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
          
          <div className="h-6 w-px bg-gray-200 mx-2"></div>

          {/* New Check-in / Check-out Options in Nav Bar */}
          <div className="flex items-center gap-2">
            {!todayAttendance?.check_in ? (
              <button
                onClick={handleCheckIn}
                disabled={isProcessing}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-green-100 disabled:opacity-50"
              >
                {isProcessing ? '...' : 'Check In'}
              </button>
            ) : !todayAttendance?.check_out ? (
              <button
                onClick={handleCheckOut}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-red-100 disabled:opacity-50"
              >
                {isProcessing ? '...' : 'Check Out'}
              </button>
            ) : (
              <div className="px-4 py-2 bg-gray-100 text-gray-400 text-xs font-black uppercase tracking-widest rounded-xl">
                Done for Today
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="relative">
          <button 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">{user.name}</p>
              <p className="text-[10px] text-gray-400 capitalize font-bold tracking-widest">{user.role}</p>
            </div>
            <div className="relative">
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                alt="Avatar" 
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-indigo-100 transition-all shadow-sm"
              />
              {/* Status Symbol on Profile Icon */}
              <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full shadow-sm ${isCheckedIn ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            </div>
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
                {user.role === UserRole.ADMIN && (
                   <Link 
                    to="/salary"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    <i className="fa-solid fa-money-bill-transfer text-gray-400 w-5"></i>
                    Payroll Management
                  </Link>
                )}
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
