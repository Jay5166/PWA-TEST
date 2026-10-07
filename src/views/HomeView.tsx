import React from 'react';
import { Bot, MessageSquare, Phone, MapPin, Sparkles, ChevronRight, Clock, ShieldAlert } from 'lucide-react';
import { BusinessSettings, ActiveTab } from '../types';
import { NotificationPrompt } from '../components/NotificationPrompt';
import { PWAInstallBanner } from '../components/PWAInstallBanner';

interface HomeViewProps {
  settings: BusinessSettings;
  setActiveTab: (tab: ActiveTab) => void;
  knowledgeBaseSummary?: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  settings,
  setActiveTab
}) => {
  return (
    <div className="space-y-6 pb-20 pt-2 animate-in fade-in duration-300">
      {/* Hero Welcome Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 md:p-8 text-center shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo badge */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-1 shadow-xl shadow-blue-600/30 mb-4 transform hover:rotate-3 transition duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-9 h-9 text-blue-400" />
            </div>
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Official Business Assistant
          </span>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Welcome to {settings.businessName}
          </h2>

          <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
            {settings.tagline}
          </p>

          <p className="text-xs text-slate-400 mt-3 font-medium">
            How can we help you today?
          </p>

          {/* Primary Action Button */}
          <div className="mt-5 w-full max-w-xs">
            <button
              onClick={() => setActiveTab('chat')}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 transition active:scale-95 cursor-pointer"
            >
              <Bot className="w-5 h-5 text-blue-200" />
              <span>🤖 ASK OUR AI</span>
            </button>
          </div>
        </div>
      </section>

      {/* Notification Module */}
      <section>
        <NotificationPrompt />
      </section>

      {/* PWA Install Module */}
      <section>
        <PWAInstallBanner />
      </section>

      {/* Quick Actions */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setActiveTab('chat')}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 text-left transition group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white flex items-center justify-between">
              AI Assistant
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition" />
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Instant answers about services, pricing & hours.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 text-left transition group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white flex items-center justify-between">
              Business Info
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Hours, services, office location and team details.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 text-left transition group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white flex items-center justify-between">
              Contact Us
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" />
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {settings.phone || 'Reach our support team'}
            </p>
          </button>
        </div>
      </section>

      {/* Prototype Demo Banner notice */}
      <section className="rounded-2xl bg-slate-950 border border-slate-800/80 p-4 text-xs text-slate-400 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-300">Prototype Demo System</span>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
            Data is saved locally in your browser. Use the <strong>Admin</strong> tab to customize the knowledge base, send push notifications, or view the QR launch code.
          </p>
        </div>
      </section>
    </div>
  );
};
