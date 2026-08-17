import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Hexagon, Mail, Lock, ShieldCheck, Briefcase, Code, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const autofillDemo = (userEmail: string, pass: string) => {
    setEmail(userEmail);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Top Purple Gradient Accent Bar */}
      <div className="h-2.5 w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 shadow-sm" />

      {/* Main Split Screen Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Floating Login Card */}
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
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Login</h1>
                <p className="text-xs text-slate-500 mt-1.5 font-medium">
                  Doesn't have an account yet?{' '}
                  <Link to="/register" className="font-bold text-purple-600 hover:text-purple-700 hover:underline">
                    Sign Up
                  </Link>
                </p>
              </div>

              {/* Quick Demo Credentials Autofill Selector */}
              <div className="mb-6 bg-purple-50/60 border border-purple-100 rounded-2xl p-3">
                <p className="text-[11px] font-bold text-purple-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> One-Click Demo Login:
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => autofillDemo('admin@devtrack.io', 'admin123')}
                    className="px-2 py-1.5 rounded-lg bg-white border border-purple-200 text-purple-900 text-[11px] font-bold hover:bg-purple-600 hover:text-white transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ShieldCheck className="w-3 h-3" /> Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => autofillDemo('pm.alex@devtrack.io', 'pm123')}
                    className="px-2 py-1.5 rounded-lg bg-white border border-purple-200 text-purple-900 text-[11px] font-bold hover:bg-purple-600 hover:text-white transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Briefcase className="w-3 h-3" /> PM
                  </button>
                  <button
                    type="button"
                    onClick={() => autofillDemo('dev.sarah@devtrack.io', 'dev123')}
                    className="px-2 py-1.5 rounded-lg bg-white border border-purple-200 text-purple-900 text-[11px] font-bold hover:bg-purple-600 hover:text-white transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Code className="w-3 h-3" /> Dev
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo reset: Use admin123, pm123, or dev123'); }} className="text-xs font-semibold text-purple-600 hover:underline">
                      Forgot Password?
                    </a>
                  </div>
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

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-xs font-medium text-slate-600 cursor-pointer">
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'LOGIN'
                  )}
                </button>
              </form>

              {/* Social Login Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative px-3 bg-white text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  or login with
                </span>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => autofillDemo('admin@devtrack.io', 'admin123')}
                  className="flex items-center justify-center gap-2 py-2 px-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => autofillDemo('pm.alex@devtrack.io', 'pm123')}
                  className="flex items-center justify-center gap-2 py-2 px-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: High Resolution Vector Illustration */}
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

      {/* Footer copyright */}
      <footer className="py-3 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white">
        © 2026 DevTrack SaaS Platform. All rights reserved.
      </footer>
    </div>
  );
};
