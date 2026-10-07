import React, { useState } from 'react';
import { Settings, Save, RotateCcw, Palette, Building, Phone, Mail, Globe, MapPin, Key } from 'lucide-react';
import { BusinessSettings } from '../../types';
import { StorageService, DEFAULT_SETTINGS } from '../../utils/storage';
import { useToast } from '../../components/Toast';

interface AdminSettingsProps {
  settings: BusinessSettings;
  setSettings: (settings: BusinessSettings) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, setSettings }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<BusinessSettings>(settings);

  const handleChange = (field: keyof BusinessSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSettings(formData);
    setSettings(formData);
    showToast('✓ Business settings saved successfully', 'success');
  };

  const handleReset = () => {
    if (window.confirm('Reset settings to ABC Digital Solutions defaults?')) {
      setFormData(DEFAULT_SETTINGS);
      StorageService.saveSettings(DEFAULT_SETTINGS);
      setSettings(DEFAULT_SETTINGS);
      showToast('Settings reset to default', 'info');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold uppercase tracking-wider">
              Branding & Configuration
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-400" />
            Business Profile & Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Customize business identity, contact channels, and visual branding across the PWA.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition border border-slate-700 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identity Card */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Building className="w-4 h-4 text-blue-400" />
            Company Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Business Name
              </label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                placeholder="ABC Digital Solutions"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Short App Name
              </label>
              <input
                type="text"
                required
                value={formData.appName}
                onChange={(e) => handleChange('appName', e.target.value)}
                placeholder="ABC Business AI"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tagline / Subtitle
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              placeholder="Your Digital Growth Partner"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
            />
          </div>
        </div>

        {/* Contact Details Card */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Phone className="w-4 h-4 text-emerald-400" />
            Public Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91 90000 00000"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="hello@example.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Office Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Tech Park Tower B, Suite 402, Innovation District"
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Website URL
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
            />
          </div>
        </div>

        {/* Developer / Vercel Environment Instructions Box */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Key className="w-4 h-4 text-amber-400" />
            VAPID & Groq Secret Keys Guide
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Generate your own Web Push keys at any time via terminal:
          </p>
          <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 select-all overflow-x-auto">
            npx web-push generate-vapid-keys
          </pre>
          <p className="text-xs text-slate-400 leading-relaxed">
            Then place the generated keys into your Vercel Project Settings or <code className="text-white">.env.local</code>:
          </p>
          <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-blue-300 select-all overflow-x-auto">
{`GROQ_API_KEY="gsk_..."
GROQ_MODEL="llama-3.3-70b-versatile"
NEXT_PUBLIC_VAPID_PUBLIC_KEY="B..."
VAPID_PUBLIC_KEY="B..."
VAPID_PRIVATE_KEY="..."
VAPID_SUBJECT="mailto:admin@example.com"`}
          </pre>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save Business Profile</span>
        </button>
      </form>
    </div>
  );
};
