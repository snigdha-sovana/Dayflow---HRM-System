
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import AttendancePage from './pages/AttendancePage';
import SalaryPage from './pages/SalaryPage';
import TimeOffPage from './pages/TimeOffPage';
import TopBar from './components/TopBar';
import { User } from './types';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <LoginPage onLogin={setUser} /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/*" 
          element={
            user ? (
              <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
                <TopBar user={user} onLogout={handleLogout} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                  <Routes>
                    <Route path="/" element={<Dashboard user={user} />} />
                    <Route path="/profile/:id" element={<ProfilePage currentUser={user} />} />
                    <Route path="/attendance" element={<AttendancePage user={user} />} />
                    <Route path="/salary" element={<SalaryPage user={user} />} />
                    <Route path="/time-off" element={<TimeOffPage user={user} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </main>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
