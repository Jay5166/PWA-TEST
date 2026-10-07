import React from 'react';
import { History, Trash2, Calendar, CheckCircle2, Image, Send, ArrowRight } from 'lucide-react';
import { AdminTab, NotificationItem } from '../../types';
import { StorageService } from '../../utils/storage';
import { useToast } from '../../components/Toast';

interface AdminNotificationHistoryProps {
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  setCurrentTab: (tab: AdminTab) => void;
}

export const AdminNotificationHistory: React.FC<AdminNotificationHistoryProps> = ({
  notifications,
  setNotifications,
  setCurrentTab
}) => {
  const { showToast } = useToast();

  const handleClearHistory = () => {
    if (window.confirm('Clear all sent notifications history?')) {
      StorageService.clearNotifications();
      setNotifications([]);
      showToast('Notification history cleared', 'info');
    }
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Recent';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
              Sent Campaigns
            </span>
            <span className="text-xs text-slate-400">● Prototype Local History</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-400" />
            Notification History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Log of push announcements and messages sent from the business admin console.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 text-xs font-semibold transition border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}

          <button
            onClick={() => setCurrentTab('notifications')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send New</span>
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900 border border-slate-800">
          <History className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No notifications sent yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Broadcast your first Web Push message to see delivery logs here.
          </p>
          <button
            onClick={() => setCurrentTab('notifications')}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Compose Notification
          </button>
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="divide-y divide-slate-800/80">
            {notifications.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-850/50 transition">
                <div className="flex items-start gap-4">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-700"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                      <Send className="w-5 h-5" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold flex items-center gap-1 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 max-w-xl">
                      {item.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formatDate(item.sentAt)}
                      </span>
                      {item.recipientsCount !== undefined && (
                        <span>• Broadcasted to {item.recipientsCount} recipient(s)</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
