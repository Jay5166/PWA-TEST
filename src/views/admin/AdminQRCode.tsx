import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Copy, Download, Smartphone, Check, ExternalLink, Globe } from 'lucide-react';
import { useToast } from '../../components/Toast';

export const AdminQRCode: React.FC = () => {
  const { showToast } = useToast();
  const [appUrl, setAppUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    setAppUrl(origin);

    QRCode.toDataURL(origin, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR code', err));
  }, []);

  const handleCopy = () => {
    if (!appUrl) return;
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    showToast('App URL copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'business-pwa-qr-code.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('QR Code downloaded', 'success');
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto animate-in fade-in duration-300">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
          Mobile QR Onboarding
        </div>
        <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <QrCode className="w-6 h-6 text-purple-400" />
          Business Launch QR Code
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Scan this code from any smartphone camera to open and install the business PWA immediately.
        </p>
      </div>

      {/* Main QR Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center space-y-6">
        <div className="text-xs uppercase font-bold tracking-widest text-slate-400">
          SCAN TO USE OUR APP
        </div>

        {/* QR Code Container */}
        <div className="p-4 bg-white rounded-3xl shadow-xl shadow-purple-950/20 max-w-[260px] w-full aspect-square flex items-center justify-center">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR Code"
              className="w-full h-full object-contain rounded-xl"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
              Generating QR Code...
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-200">
            Scan using your phone's camera
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-blue-400 font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 max-w-sm truncate">
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{appUrl}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={handleCopy}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition border border-slate-700 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'COPY APP URL'}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={!qrDataUrl}
            className="py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD QR</span>
          </button>
        </div>
      </div>

      {/* Demonstration Flow Explanation */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3 text-xs text-slate-300">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-indigo-400" />
          Demonstration Flow for Clients:
        </h3>
        <ol className="list-decimal list-inside space-y-1.5 text-slate-400 leading-relaxed text-[11px]">
          <li>Open your smartphone camera and point it at this QR code.</li>
          <li>Tap the detected browser link to open the business PWA.</li>
          <li>Tap <strong>"Enable Notifications"</strong> on your phone.</li>
          <li>Switch back to this Admin console, go to <strong>"Send Notification"</strong>, and broadcast a message.</li>
          <li>Watch your phone ring with the push notification alert!</li>
          <li>Open the AI Assistant on your phone and ask questions grounded in your Knowledge Base.</li>
        </ol>
      </div>
    </div>
  );
};
