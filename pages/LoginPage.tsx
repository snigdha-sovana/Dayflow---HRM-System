
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await authService.login(emailOrId, password);
      onLogin(user);
    } catch (err) {
      setError('Invalid credentials. Use your registered Email or Employee ID.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden p-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-3xl mb-6 shadow-lg shadow-indigo-50">
            <i className="fa-solid fa-layer-group text-indigo-600 text-4xl"></i>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Portal Login</h1>
          <p className="text-gray-500 mt-2 font-medium">Enter your credentials to access HRMaster</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-5 py-4 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3 border border-red-100">
            <i className="fa-solid fa-circle-exclamation text-lg"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email or Employee ID</label>
            <div className="relative">
              <i className="fa-solid fa-user absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                required
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                placeholder="EMPXXXX or name@company.com"
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-2xl text-gray-900 font-bold transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-2xl text-gray-900 font-bold transition-all outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 mt-4"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : 'Sign In to Workspace'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-400 text-xs font-bold">
            Trouble signing in? <span className="text-indigo-600 hover:underline cursor-pointer">Contact HR Support</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
