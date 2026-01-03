
import React, { useState } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await authService.login(loginId, password);
      onLogin(user);
    } catch (err) {
      setError('Invalid login credentials. Try "admin" or "emp".');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
            <i className="fa-solid fa-layer-group text-indigo-600 text-3xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back!' : 'Join HRMaster'}
          </h1>
          <p className="text-gray-500 mt-2">
            {isLogin ? 'Sign in to manage your workplace' : 'Create an account for your organization'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isLogin ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Login ID / Email</label>
                <div className="relative">
                  <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="EMP0001 or admin"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-xl text-gray-900 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-xl text-gray-900 transition-all"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-xl text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-xl text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Email</label>
                <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-xl text-gray-900" />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-xl text-gray-900" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
