import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Hexagon, User as UserIcon, Mail, Lock, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('DEVELOPER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await register({ name, email, password, role });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Top Purple Gradient Accent Bar */}
      <div className="h-2.5 w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 shadow-sm" />

      {/* Main Split Screen Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Floating Register Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 w-full max-w-md relative transition-all">
              
              {/* Brand Header */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Hexagon className="w-5 h-5 fill-current" />
                </div>
                <span className="text-lg font-bold text-slate-900 tracking-tight">DevTrack</span>
              </div>

              {/* Title & Subtitle */}
              <div className="mb-6">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sign Up</h1>
                <p className="text-xs text-slate-500 mt-1.5 font-medium">
                  Already have an account?{' '}
                  <Link to="/login" className="font-bold text-purple-600 hover:text-purple-700 hover:underline">
                    Login here
                  </Link>
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Sarah Connor"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="Enter 6 character or more"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role Assignment</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50/50 font-medium"
                  >
                    <option value="DEVELOPER">DEVELOPER (Task Execution)</option>
                    <option value="PROJECT_MANAGER">PROJECT MANAGER (Team Lead)</option>
                    <option value="ADMIN">ADMINISTRATOR (Full Platform Scope)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'CREATE ACCOUNT'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Vector Illustration */}
          <div className="lg:col-span-7 hidden lg:flex flex-col items-center justify-center p-4">
            <div className="relative max-w-lg">
              <img
                src="/login_illustration.jpg"
                alt="DevTrack Developer Workspace Illustration"
                className="w-full h-auto object-contain rounded-2xl shadow-sm"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="py-3 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white">
        © 2026 DevTrack SaaS Platform. All rights reserved.
      </footer>
    </div>
  );
};
