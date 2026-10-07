import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, Key } from 'lucide-react';
import { StorageService } from '../utils/storage';
import { useToast } from '../components/Toast';

interface AdminLoginViewProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onSuccess, onCancel }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Prototype credentials per brief (admin@example.com / admin123)
    if (email.trim().toLowerCase() === 'admin@example.com' && password === 'admin123') {
      StorageService.setAdminAuthenticated(true);
      showToast('Admin session started', 'success');
      onSuccess();
    } else {
      setError('Invalid demo credentials. Use admin@example.com / admin123');
      showToast('Invalid credentials', 'error');
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@example.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4 animate-in fade-in duration-300">
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/10">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-1">
            Prototype Admin Login
          </span>
          <h2 className="text-xl font-bold text-white">Business Control Center</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your AI knowledge base, push notifications & QR code.
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="mb-5 p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs">
          <div className="flex items-center justify-between font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" /> Demo Credentials:
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] text-amber-400 hover:text-white underline font-medium cursor-pointer"
            >
              Autofill
            </button>
          </div>
          <div className="text-[11px] text-amber-300/80 font-mono space-y-0.5">
            <div>Email: <span className="text-white">admin@example.com</span></div>
            <div>Password: <span className="text-white">admin123</span></div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Enter Admin Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium transition cursor-pointer"
          >
            Return to Customer PWA
          </button>
        </form>

        <p className="text-[10px] text-slate-500 text-center mt-6">
          Note: This is a prototype session and does not connect to enterprise auth.
        </p>
      </div>
    </div>
  );
};
