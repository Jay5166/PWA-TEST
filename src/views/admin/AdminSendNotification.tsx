import React, { useState, useEffect } from 'react';
import { Send, Image, Link, Type, Users, Loader2, Sparkles, AlertCircle, CheckCircle2, Upload, X } from 'lucide-react';
import { AdminTab, NotificationItem } from '../../types';
import { StorageService } from '../../utils/storage';
import { useToast } from '../../components/Toast';

interface AdminSendNotificationProps {
  onNotificationSent: (item: NotificationItem) => void;
  setCurrentTab: (tab: AdminTab) => void;
}

export const AdminSendNotification: React.FC<AdminSendNotificationProps> = ({
  onNotificationSent,
  setCurrentTab
}) => {
  const { showToast } = useToast();
  const [title, setTitle] = useState('New Weekend Offer');
  const [message, setMessage] = useState('Get 20% off all website and mobile application packages this weekend!');
  const [image, setImage] = useState<string>('');
  const [url, setUrl] = useState('/');
  const [actionText, setActionText] = useState('View Offer');
  const [loading, setLoading] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState<number>(0);

  useEffect(() => {
    fetch('/api/push/subscribers')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.count === 'number') {
          setSubscribersCount(data.count);
        }
      })
      .catch((e) => console.warn('Could not fetch subscribers count', e));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Image size exceeds 2 MB limit', 'error');
      return;
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      showToast('Only JPG, PNG, and WEBP formats supported', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      showToast('Image attached', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = (preset: { title: string; message: string; actionText: string; image?: string }) => {
    setTitle(preset.title);
    setMessage(preset.message);
    setActionText(preset.actionText);
    if (preset.image) setImage(preset.image);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim() || loading) return;

    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        body: message.trim(),
        image: image || undefined,
        url: url.trim() || '/',
        actionText: actionText.trim() || 'View'
      };

      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Server error sending push notification');
      }

      // Record in local prototype history
      const newNotification: NotificationItem = {
        id: `notif_${Date.now()}`,
        title: payload.title,
        message: payload.body,
        image: payload.image,
        url: payload.url,
        actionText: payload.actionText,
        sentAt: new Date().toISOString(),
        status: 'Sent',
        recipientsCount: data.sentCount || subscribersCount || 1
      };

      StorageService.addNotification(newNotification);
      onNotificationSent(newNotification);

      showToast(`✓ Notification broadcasted to ${data.sentCount ?? subscribersCount} subscriber(s)!`, 'success');
      setTimeout(() => {
        setCurrentTab('history');
      }, 1000);
    } catch (err: any) {
      console.error('Send error:', err);
      showToast('Unable to send notification. Please check your notification configuration.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-300">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
            Web Push Broadcaster
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          <Send className="w-6 h-6 text-indigo-400" />
          Send Push Notification
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Compose and broadcast text or rich image notifications directly to all subscribed customer devices.
        </p>
      </div>

      {/* Preset Templates */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          Quick Preset Campaigns:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              handlePresetSelect({
                title: 'New Service Available',
                message: 'We now provide custom AI automation services for your workflow.',
                actionText: 'Explore AI'
              })
            }
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition cursor-pointer"
          >
            🚀 AI Automation Launch
          </button>
          <button
            type="button"
            onClick={() =>
              handlePresetSelect({
                title: 'Holiday Office Notice',
                message: 'Our office will remain closed tomorrow for the national holiday.',
                actionText: 'Check Hours'
              })
            }
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition cursor-pointer"
          >
            📅 Holiday Notice
          </button>
          <button
            type="button"
            onClick={() =>
              handlePresetSelect({
                title: 'Special 20% Discount',
                message: 'Get 20% off all website and mobile app packages this weekend!',
                actionText: 'Claim Offer'
              })
            }
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition cursor-pointer"
          >
            🎁 20% Discount Offer
          </button>
        </div>
      </div>

      {/* Composer Form */}
      <form onSubmit={handleSend} className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Notification Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Important Business Update"
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white placeholder-slate-500 outline-none transition"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Message (Body) *
          </label>
          <textarea
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Our office will remain closed tomorrow."
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs md:text-sm text-white placeholder-slate-500 outline-none transition resize-none"
          />
        </div>

        {/* Image Upload */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Notification Image (Optional, max 2MB)
            </label>
            {image && (
              <button
                type="button"
                onClick={() => setImage('')}
                className="text-[11px] text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" /> Remove image
              </button>
            )}
          </div>

          {image ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 max-h-48 bg-slate-950">
              <img src={image} alt="Preview" className="w-full h-44 object-cover" />
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition bg-slate-950/40">
              <Upload className="w-6 h-6 text-slate-500" />
              <div className="text-center">
                <span className="text-xs font-semibold text-indigo-400">Upload Image</span>
                <p className="text-[10px] text-slate-500 mt-0.5">JPG, PNG, WEBP (under 2MB)</p>
              </div>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* URL and Action Button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Notification URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="/"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Button Action Text
            </label>
            <input
              type="text"
              value={actionText}
              onChange={(e) => setActionText(e.target.value)}
              placeholder="View Offer"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
            />
          </div>
        </div>

        {/* Recipients Summary */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">Recipients: All subscribed users</span>
          </div>
          <span className="font-semibold text-indigo-400">
            {subscribersCount} active in session
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !title.trim() || !message.trim()}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending notification...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>SEND NOTIFICATION</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
