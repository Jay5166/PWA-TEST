import React from 'react';
import { Building2, Clock, MapPin, Phone, Mail, Globe, CheckCircle, Sparkles } from 'lucide-react';
import { BusinessSettings } from '../types';

interface BusinessInfoViewProps {
  settings: BusinessSettings;
  knowledgeBase: string;
}

export const BusinessInfoView: React.FC<BusinessInfoViewProps> = ({
  settings,
  knowledgeBase
}) => {
  // Extract parsed sections from knowledgeBase if present
  const parseSection = (regex: RegExp): string => {
    const match = knowledgeBase.match(regex);
    return match && match[1] ? match[1].trim() : '';
  };

  const aboutText = parseSection(/ABOUT US:?\s*([\s\S]*?)(?=SERVICES|ADDRESS|PHONE|EMAIL|BUSINESS HOURS|PRICING|$)/i) || settings.tagline;
  const servicesText = parseSection(/SERVICES:?\s*([\s\S]*?)(?=ADDRESS|PHONE|EMAIL|BUSINESS HOURS|PRICING|$)/i);
  const hoursText = parseSection(/BUSINESS HOURS:?\s*([\s\S]*?)(?=PRICING|SPECIAL OFFERS|PAYMENT|FAQ|SUPPORT|$)/i) || 'Monday - Friday: 10:00 AM - 7:00 PM';
  const pricingText = parseSection(/PRICING & PACKAGES:?\s*([\s\S]*?)(?=SPECIAL OFFERS|PAYMENT|FAQ|SUPPORT|$)/i);
  const offersText = parseSection(/SPECIAL OFFERS:?\s*([\s\S]*?)(?=PAYMENT|FAQ|SUPPORT|$)/i);

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20 pt-2 animate-in fade-in duration-300">
      {/* Header Profile */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 shadow-xl relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-1 shadow-lg shadow-blue-600/30 shrink-0">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Building2 className="w-10 h-10 text-blue-400" />
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-white">{settings.businessName}</h2>
          <p className="text-xs text-blue-400 font-medium mt-0.5">{settings.tagline}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3 text-xs text-slate-300">
            {settings.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                {settings.phone}
              </span>
            )}
            {settings.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                {settings.email}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* About Section */}
      {aboutText && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            About Us
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
            {aboutText}
          </p>
        </div>
      )}

      {/* Services Section */}
      {servicesText && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Services & Capabilities
          </h3>
          <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            {servicesText}
          </div>
        </div>
      )}

      {/* Business Hours */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-amber-400" />
          Operating Hours
        </h3>
        <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
          {hoursText}
        </p>
      </div>

      {/* Location & Contact */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-400" />
          Address & Contact Details
        </h3>

        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <span>{settings.address || 'Tech Park Tower B, Innovation District'}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-slate-500 shrink-0" />
            <span>{settings.phone}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-slate-500 shrink-0" />
            <span>{settings.email}</span>
          </div>
          {settings.website && (
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-slate-500 shrink-0" />
              <a
                href={settings.website}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline"
              >
                {settings.website}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Pricing / Offers preview if present */}
      {(pricingText || offersText) && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Special Offers & Packages
          </h3>
          {offersText && (
            <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-xs text-indigo-200 whitespace-pre-line">
              {offersText}
            </div>
          )}
          {pricingText && (
            <div className="text-xs text-slate-300 whitespace-pre-line">
              {pricingText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
