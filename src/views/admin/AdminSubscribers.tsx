import React, { useState, useEffect } from 'react';
import { Users, RefreshCw, Smartphone, Laptop, CheckCircle, ShieldAlert, Radio } from 'lucide-react';
import { SubscriberItem } from '../../types';
import { useToast } from '../../components/Toast';

export const AdminSubscribers: React.FC = () => {
  const { showToast } = useToast();
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/push/subscribers');
      const data = await res.json();
      if (data.subscribers) {
        setSubscribers(data.subscribers);
      }
    } catch (e) {
      console.warn('Error fetching subscribers', e);
      showToast('Could not refresh subscribers list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              Connected Devices
            </span>
            <span className="text-xs text-slate-400">● Prototype / Current Session Data</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            Notification Subscribers
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Devices that have granted push permission and registered active Web Push subscriptions.
          </p>
        </div>

        <button
          onClick={fetchSubscribers}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Prototype Notice Box */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-300">Prototype In-Memory Store:</span>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
            As this is a prototype, subscribers are held in the server's session memory. In a full production deployment, push endpoints are persisted in PostgreSQL, MySQL, or MongoDB.
          </p>
        </div>
      </div>

      {/* Subscribers List */}
      {subscribers.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900 border border-slate-800">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No active subscribers in current session</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Open the customer PWA in another tab or phone and click <strong>"Enable Notifications"</strong> to register a subscriber.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-4">Browser / Device</th>
                  <th className="py-3.5 px-4">Platform OS</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {subscribers.map((sub, index) => {
                  const isMobile = sub.os.includes('Android') || sub.os.includes('iOS');
                  return (
                    <tr key={sub.id} className="hover:bg-slate-850/40 transition">
                      <td className="py-3.5 px-4 font-mono text-slate-500">{index + 1}</td>
                      <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                        {isMobile ? (
                          <Smartphone className="w-4 h-4 text-indigo-400" />
                        ) : (
                          <Laptop className="w-4 h-4 text-blue-400" />
                        )}
                        <span>{sub.browser}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{sub.os}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(sub.subscribedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
