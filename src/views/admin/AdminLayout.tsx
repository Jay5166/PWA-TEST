import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Bot,
  Send,
  History,
  Users,
  QrCode,
  Settings,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { AdminTab, BusinessSettings } from '../../types';

interface AdminLayoutProps {
  currentTab: AdminTab;
  setCurrentTab: (tab: AdminTab) => void;
  onLogout: () => void;
  onReturnToPWA: () => void;
  settings: BusinessSettings;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  setCurrentTab,
  onLogout,
  onReturnToPWA,
  settings,
  children
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuSections = [
    {
      label: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      label: 'Business Knowledge',
      items: [
        { id: 'knowledge-base', label: 'Knowledge Base', icon: BookOpen },
        { id: 'settings', label: 'Business Profile', icon: Settings }
      ]
    },
    {
      label: 'AI System',
      items: [
        { id: 'ai-assistant', label: 'AI Assistant Test', icon: Bot }
      ]
    },
    {
      label: 'Push Notifications',
      items: [
        { id: 'notifications', label: 'Send Notification', icon: Send },
        { id: 'history', label: 'Notification History', icon: History },
        { id: 'subscribers', label: 'Subscribers', icon: Users }
      ]
    },
    {
      label: 'PWA & Deployment',
      items: [
        { id: 'qr-code', label: 'QR Code Launcher', icon: QrCode }
      ]
    }
  ];

  const handleNavClick = (tabId: AdminTab) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row pb-12">
      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-xs text-white uppercase tracking-wider">
              Admin Panel
            </span>
          </div>
        </div>

        <button
          onClick={onReturnToPWA}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Admin</span>
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-40 w-64 bg-slate-900/95 md:bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Admin Panel
                </h2>
                <p className="text-[10px] text-slate-400 truncate max-w-[130px]">
                  {settings.businessName}
                </p>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-170px)]">
            {menuSections.map((sec, i) => (
              <div key={i} className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {sec.label}
                </span>
                <div className="space-y-0.5">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id as AdminTab)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                          isActive
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-slate-800 space-y-1.5">
          <button
            onClick={onReturnToPWA}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-blue-400 hover:bg-blue-950/30 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Customer App</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/30 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>End Admin Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};
