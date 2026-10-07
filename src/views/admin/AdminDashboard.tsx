import React, { useState, useEffect } from 'react';
import {
  Users,
  Send,
  Bot,
  BookOpen,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Key,
  Radio,
  ExternalLink
} from 'lucide-react';
import { AdminTab, BusinessSettings, NotificationItem } from '../../types';

interface AdminDashboardProps {
  setCurrentTab: (tab: AdminTab) => void;
  settings: BusinessSettings;
  knowledgeBase: string;
  notifications: NotificationItem[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  setCurrentTab,
  settings,
  knowledgeBase,
  notifications
}) => {
  const [subscriberCount, setSubscriberCount] = useState<number>(0);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  useEffect(() => {
    // Fetch system status & active subscribers
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setSystemStatus(data);
        if (typeof data.subscribersCount === 'number') {
          setSubscriberCount(data.subscribersCount);
        }
      })
      .catch((err) => console.warn('Could not fetch /api/status', err));
  }, []);

  const kbWordCount = knowledgeBase.split(/\s+/).filter(Boolean).length;
  const isKbConfigured = kbWordCount > 20;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
              Prototype Dashboard
            </span>
            <span className="text-xs text-slate-400">● Local / Demo Data</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            {settings.businessName} Assistant Control
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time control over business knowledge, mobile push alerts & client PWA engagement.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('notifications')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>New Notification</span>
        </button>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Knowledge Base */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Knowledge Base</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-lg font-bold text-white">
              {isKbConfigured ? 'Configured' : 'Needs Setup'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {kbWordCount} words parsed • Ready for AI
          </p>
          <button
            onClick={() => setCurrentTab('knowledge-base')}
            className="mt-3 text-xs text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Edit Information</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Notifications Sent */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Notifications Sent</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{notifications.length}</span>
            <span className="text-xs text-slate-400">Campaigns</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Broadcast to active PWA devices
          </p>
          <button
            onClick={() => setCurrentTab('history')}
            className="mt-3 text-xs text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View History</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Push Subscribers */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Subscribers</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{subscriberCount}</span>
            <span className="text-xs text-emerald-400 font-semibold">Active In Session</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Web Push endpoints connected
          </p>
          <button
            onClick={() => setCurrentTab('subscribers')}
            className="mt-3 text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Subscribers</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* PWA Status */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">PWA Status</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-lg font-bold text-white">Installable</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Manifest & Service Worker registered
          </p>
          <button
            onClick={() => setCurrentTab('qr-code')}
            className="mt-3 text-xs text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View QR Launcher</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* System Integration Status Overview */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-400" />
            System & Service Integrations
          </h2>
          <span className="text-[11px] text-slate-400">
            Prototype Runtime Configuration
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Groq AI Status */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-400" /> Groq AI Engine
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  systemStatus?.groqConfigured
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}
              >
                {systemStatus?.groqConfigured ? 'GROQ_API_KEY Active' : 'Prototype Fallback Active'}
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Model: <code className="text-blue-300">{systemStatus?.groqModel || 'llama-3.3-70b-versatile'}</code>
              <br />
              {systemStatus?.groqConfigured
                ? 'High-speed LLaMA-3.3 inference is ready and active.'
                : 'Enter your GROQ_API_KEY in .env.local or Vercel variables to activate live cloud inference. Local contextual simulator answers user questions in the meantime.'}
            </p>
            <button
              onClick={() => setCurrentTab('ai-assistant')}
              className="text-blue-400 hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>Test Knowledge Base with AI</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          {/* Web Push VAPID Status */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" /> Web Push & VAPID
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  !systemStatus?.isEphemeralVapid
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                }`}
              >
                {!systemStatus?.isEphemeralVapid ? 'Production VAPID Set' : 'Ephemeral Demo Keys Active'}
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {systemStatus?.isEphemeralVapid
                ? 'Auto-generated ephemeral VAPID keys are active so Web Push works out of the box in this preview session! For production on Vercel, set VAPID_PUBLIC_KEY & VAPID_PRIVATE_KEY.'
                : 'VAPID keys loaded from environment variables.'}
            </p>
            <button
              onClick={() => setCurrentTab('notifications')}
              className="text-indigo-400 hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>Compose Push Notification</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
