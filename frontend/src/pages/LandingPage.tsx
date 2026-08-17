import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hexagon, ArrowRight, Check, Layers, Zap, TrendingUp, Shield, MessageSquare, ArrowUpRight, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white overflow-x-hidden">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <Hexagon className="w-6 h-6 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">DevTrack</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
            <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all"
            >
              GET STARTED
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-7xl mx-auto text-center relative">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] animate-fade-in-up">
            Ship Better Software, Faster.
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            The unified workspace for engineering teams to manage issues, track progress, and collaborate with velocity.
          </p>

          <div className="pt-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <span>Get Started for Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Hero iMac / Laptop Display Frame with Dashboard UI */}
        <div className="mt-14 max-w-5xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-35 transition-opacity" />
          
          {/* Laptop Monitor Shell */}
          <div className="relative rounded-2xl bg-slate-900 p-3 sm:p-4 shadow-2xl border border-slate-700/80">
            {/* Monitor Top Header Bar */}
            <div className="h-6 bg-slate-800 rounded-t-lg flex items-center justify-between px-3 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[11px] font-mono text-slate-400">app.devtrack.io/dashboard</span>
              <div className="w-12" />
            </div>

            {/* Simulated Live UI Preview */}
            <div className="bg-slate-950 rounded-lg p-4 sm:p-6 text-left border border-slate-800 text-white space-y-6 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold">Project Velocity Overview</h3>
                  <p className="text-xs text-slate-400">Sprint 42 • Active Engineering Metrics</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold">
                    + New Project
                  </span>
                </div>
              </div>

              {/* KPI Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Open Issues</span>
                  <p className="text-xl font-bold text-slate-100">18</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Closed Issues</span>
                  <p className="text-xl font-bold text-emerald-400">115</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Velocity (Points)</span>
                  <p className="text-xl font-bold text-indigo-400">142</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Deployments</span>
                  <p className="text-xl font-bold text-purple-400">6</p>
                </div>
              </div>

              {/* Mock Charts & Table Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-slate-300">Sprint Progress Trend</span>
                  <div className="h-28 flex items-end justify-between gap-2 pt-2 border-b border-slate-800 pb-2">
                    <div className="w-full bg-indigo-600/30 rounded-t h-[30%]" />
                    <div className="w-full bg-indigo-600/50 rounded-t h-[55%]" />
                    <div className="w-full bg-indigo-600/70 rounded-t h-[40%]" />
                    <div className="w-full bg-indigo-600 rounded-t h-[85%]" />
                    <div className="w-full bg-indigo-500 rounded-t h-[65%]" />
                    <div className="w-full bg-purple-500 rounded-t h-[95%]" />
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-slate-300">Task Status Distribution</span>
                  <div className="space-y-2 pt-1 text-xs">
                    <div className="flex justify-between text-slate-400"><span>Frontend Redesign</span><span className="text-indigo-400 font-bold">85%</span></div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden"><div className="bg-indigo-500 h-full w-[85%]" /></div>
                    <div className="flex justify-between text-slate-400"><span>Mobile API Sync</span><span className="text-amber-400 font-bold">60%</span></div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden"><div className="bg-amber-500 h-full w-[60%]" /></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Monitor Stand Base */}
            <div className="w-36 h-6 bg-slate-700 mx-auto mt-2 rounded-b-xl border-t border-slate-600" />
            <div className="w-48 h-2 bg-slate-600 mx-auto rounded-full" />
          </div>
        </div>
      </section>

      {/* Trusted By Logos */}
      <section className="py-12 border-y border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
            TRUSTED BY INNOVATIVE ENGINEERING TEAMS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all">
            <span className="font-mono font-extrabold text-slate-800 text-lg tracking-wider">AcmeCorp</span>
            <span className="font-mono font-extrabold text-slate-800 text-lg tracking-wider">CloudScale</span>
            <span className="font-mono font-extrabold text-slate-800 text-lg tracking-wider">DevOpsX</span>
            <span className="font-mono font-extrabold text-slate-800 text-lg tracking-wider">DataFlow</span>
            <span className="font-mono font-extrabold text-slate-800 text-lg tracking-wider">HyperPulse</span>
          </div>
        </div>
      </section>

      {/* 3 Key Highlight Cards */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Unified Workspace</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Everything in one place. Connect your codebase, PRs, and discussions seamlessly.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Built for Developers</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              High-density views and keyboard-first navigation designed for ultimate speed.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Team Velocity</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Track progress with precision using customizable burn-down charts and sprints.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Section 1 (Issue Tracking) */}
      <section className="py-20 px-6 bg-indigo-50/40 border-y border-indigo-100/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Laptop Image showing Issues Table */}
          <div className="relative group">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
                alt="DevTrack Issue Tracking Workstation"
                className="w-full h-auto object-cover max-h-[420px]"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider inline-block">
              Issue Tracking
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Master your issue tracking
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              Create, prioritize, and assign issues with unparalleled speed. Our streamlined interface ensures your team stays focused on writing code, not managing tickets.
            </p>

            <ul className="space-y-3 pt-2">
              <li className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Custom workflows</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Rich text descriptions</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Bulk editing</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Feature Section 2 (Collaboration) */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-6 order-2 lg:order-1">
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider inline-block">
              Collaboration
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Collaborate with your core team
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              Keep everyone aligned with real-time updates, inline comments, and seamless integrations with your favorite version control systems.
            </p>

            <ul className="space-y-3 pt-2">
              <li className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Real-time updates</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>GitHub/GitLab sync</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Threaded discussions</span>
              </li>
            </ul>
          </div>

          {/* Laptop Image showing Kanban Board */}
          <div className="relative group order-1 lg:order-2">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                alt="Engineering Team Collaboration"
                className="w-full h-auto object-cover max-h-[420px]"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-slate-100/60 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-base text-slate-600 max-w-xl mx-auto">
            Start for free, upgrade when you need to.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Free Tier */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Free</h3>
              <p className="text-xs text-slate-500 mt-1">For small teams just getting started.</p>
              <div className="mt-6 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$0</span>
                <span className="text-xs text-slate-500 font-medium"> /user/mo</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2">✓ Up to 5 users</li>
                <li className="flex items-center gap-2">✓ Unlimited issues</li>
                <li className="flex items-center gap-2">✓ Basic reporting</li>
              </ul>
            </div>
            <div className="pt-8">
              <Link
                to="/login"
                className="w-full py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors block text-center"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Pro Tier (Most Popular) */}
          <div className="bg-white p-8 rounded-3xl border-2 border-indigo-600 shadow-xl flex flex-col justify-between relative transform md:-translate-y-2">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
              Most Popular
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Pro</h3>
              <p className="text-xs text-slate-500 mt-1">For growing engineering organizations.</p>
              <div className="mt-6 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$12</span>
                <span className="text-xs text-slate-500 font-medium"> /user/mo</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2">✓ Unlimited users</li>
                <li className="flex items-center gap-2">✓ Advanced reporting & sprints</li>
                <li className="flex items-center gap-2">✓ GitHub/GitLab integrations</li>
                <li className="flex items-center gap-2">✓ Custom workflows</li>
              </ul>
            </div>
            <div className="pt-8">
              <Link
                to="/login"
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-indigo-600/30 transition-all block text-center"
              >
                Start Free Trial
              </Link>
            </div>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Enterprise</h3>
              <p className="text-xs text-slate-500 mt-1">For large scale security & support.</p>
              <div className="mt-6 mb-6">
                <span className="text-3xl font-extrabold text-slate-900">Custom</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2">✓ SAML SSO</li>
                <li className="flex items-center gap-2">✓ Dedicated success manager</li>
                <li className="flex items-center gap-2">✓ 99.9% Uptime SLA</li>
              </ul>
            </div>
            <div className="pt-8">
              <Link
                to="/login"
                className="w-full py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors block text-center"
              >
                Contact Sales
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-white border-t border-slate-200/80 pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Hexagon className="w-5 h-5 fill-current" />
              </div>
              <span className="text-lg font-bold text-slate-900">DevTrack</span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Empowering engineering teams to build the future, faster.
            </p>
            <div className="flex items-center gap-3 text-slate-400 pt-2">
              <Github className="w-4 h-4 hover:text-slate-700 transition-colors cursor-pointer" />
              <Twitter className="w-4 h-4 hover:text-slate-700 transition-colors cursor-pointer" />
              <Linkedin className="w-4 h-4 hover:text-slate-700 transition-colors cursor-pointer" />
              <Mail className="w-4 h-4 hover:text-slate-700 transition-colors cursor-pointer" />
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li><a href="#features" className="hover:text-indigo-600 transition-colors">Features</a></li>
              <li><a href="#features" className="hover:text-indigo-600 transition-colors">Integrations</a></li>
              <li><a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
              <li><a href="#features" className="hover:text-indigo-600 transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li><a href="#about" className="hover:text-indigo-600 transition-colors">About Us</a></li>
              <li><a href="#about" className="hover:text-indigo-600 transition-colors">Careers</a></li>
              <li><a href="#about" className="hover:text-indigo-600 transition-colors">Blog</a></li>
              <li><a href="#about" className="hover:text-indigo-600 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Links Col 3 */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li><a href="#about" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#about" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
              <li><a href="#about" className="hover:text-indigo-600 transition-colors">Security</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <p>© 2026 DevTrack Inc. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};
