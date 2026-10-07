import React, { useState, useEffect } from 'react';
import { Bell, BellRing, CheckCircle2, AlertTriangle, ShieldAlert, Loader2 } from 'lucide-react';
import { PushClient } from '../utils/push';
import { useToast } from './Toast';

interface NotificationPromptProps {
  compact?: boolean;
}

export const NotificationPrompt: React.FC<NotificationPromptProps> = ({ compact = false }) => {
  const { showToast } = useToast();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const supported = PushClient.isSupported();
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
      PushClient.getExistingSubscription().then((sub) => {
        setIsSubscribed(!!sub);
      });
    }
  }, []);

  const handleEnableNotifications = async () => {
    if (!isSupported) {
      showToast('Push notifications are not supported in this browser.', 'error');
      return;
    }

    if (permission === 'denied') {
      showToast('Notifications are blocked in site settings.', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await PushClient.subscribeUser();
      if (result.success) {
        setPermission('granted');
        setIsSubscribed(true);
        showToast('✓ Notifications enabled successfully!', 'success');
      } else {
        setPermission(Notification.permission);
        showToast(result.error || 'Failed to enable notifications.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error subscribing to notifications.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // CASE 5: Browser does not support notifications
  if (!isSupported) {
    if (compact) return null;
    return (
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 text-slate-400 text-sm flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-slate-200">Push Notifications Not Supported</p>
          <p className="text-xs text-slate-400 mt-1">
            Notifications are not supported by this browser or Web Push is disabled in this mode.
          </p>
        </div>
      </div>
    );
  }

  // CASE 1: Permission is granted and subscribed
  if (permission === 'granted' && isSubscribed) {
    if (compact) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Notifications Enabled</span>
        </div>
      );
    }

    return (
      <div className="rounded-2xl bg-emerald-950/20 border border-emerald-500/30 p-5 text-emerald-200 relative overflow-hidden shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-emerald-300 text-base">✓ Notifications Enabled</h4>
            <p className="text-xs text-emerald-400/80 mt-1 leading-relaxed">
              You will receive important business updates, special offers, and announcements right on your device.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // CASE 3: Permission is denied
  if (permission === 'denied') {
    return (
      <div className="rounded-2xl bg-amber-950/20 border border-amber-500/30 p-5 text-amber-200 text-sm">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-amber-300">🔔 Notifications are currently blocked</h4>
            <p className="text-xs text-amber-400/80 mt-1 leading-relaxed">
              Please enable notifications from your browser's site settings (lock icon in address bar) if you want to receive updates.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // CASE 2 & 4: Permission is default or subscription does not exist
  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800/90 border border-slate-700/60 p-5 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400 shadow-inner">
          <BellRing className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Stay Updated</span>
          </div>
          <h3 className="text-base font-bold text-white mt-0.5">Enable Business Notifications</h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Receive important business updates, exclusive offers, and instant announcements directly.
          </p>

          <ul className="grid grid-cols-2 gap-1.5 mt-3 text-[11px] text-slate-400">
            <li className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span> Important announcements
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span> New offers
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span> Business updates
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span> Special promotions
            </li>
          </ul>

          <div className="mt-4">
            <button
              onClick={handleEnableNotifications}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-xs tracking-wide uppercase transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Enable Notifications</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
