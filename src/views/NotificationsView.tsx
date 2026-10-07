import React from 'react';
import { Bell, Trash2, Calendar, ExternalLink, Sparkles, Inbox } from 'lucide-react';
import { NotificationItem } from '../types';
import { NotificationPrompt } from '../components/NotificationPrompt';
import { StorageService } from '../utils/storage';
import { useToast } from '../components/Toast';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  setNotifications
}) => {
  const { showToast } = useToast();

  const handleClearAll = () => {
    StorageService.clearNotifications();
    setNotifications([]);
    showToast('Notifications history cleared', 'info');
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor(diffMs / (1000 * 60));

      if (diffMins < 5) return 'Just now';
      if (diffMins < 60) return `${diffMins} minutes ago`;
      if (diffHrs < 24) return `${diffHrs} hours ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Recently';
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20 pt-2 animate-in fade-in duration-300">
      {/* Header card */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">🔔 Business Updates & Alerts</h2>
            <p className="text-xs text-slate-400">
              Announcements, promotions, and notifications from the business
            </p>
          </div>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
            title="Clear all alerts"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Permission helper prompt */}
      <NotificationPrompt compact />

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-950 border border-slate-800/80">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto mb-3">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-semibold text-slate-300">No Notifications Yet</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
            When the business sends updates or special announcements, they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-slate-900/90 border border-slate-800/90 overflow-hidden shadow-lg hover:border-slate-700 transition"
            >
              {item.image && (
                <div className="w-full h-44 overflow-hidden bg-slate-950 relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 mb-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    {formatTime(item.sentAt)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-semibold">
                    {item.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mt-1">{item.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed whitespace-pre-line">
                  {item.message}
                </p>

                {item.actionText && (
                  <div className="mt-3 pt-3 border-t border-slate-800 flex justify-end">
                    <a
                      href={item.url || '/'}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 text-xs font-semibold transition"
                    >
                      <span>{item.actionText}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
