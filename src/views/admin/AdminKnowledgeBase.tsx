import React, { useState } from 'react';
import { BookOpen, Save, RotateCcw, Trash2, Bot, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { AdminTab } from '../../types';
import { StorageService, DEFAULT_KNOWLEDGE_BASE } from '../../utils/storage';
import { useToast } from '../../components/Toast';

interface AdminKnowledgeBaseProps {
  knowledgeBase: string;
  setKnowledgeBase: (content: string) => void;
  setCurrentTab: (tab: AdminTab) => void;
}

export const AdminKnowledgeBase: React.FC<AdminKnowledgeBaseProps> = ({
  knowledgeBase,
  setKnowledgeBase,
  setCurrentTab
}) => {
  const { showToast } = useToast();
  const [content, setContent] = useState(knowledgeBase);
  const [lastUpdated, setLastUpdated] = useState(() => StorageService.getKnowledgeBase().lastUpdated);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    StorageService.saveKnowledgeBase(content);
    setKnowledgeBase(content);
    const updatedTime = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    setLastUpdated(updatedTime);
    setTimeout(() => {
      setIsSaving(false);
      showToast('✓ Knowledge Base saved successfully', 'success');
    }, 300);
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset knowledge base to default demo business data?')) {
      setContent(DEFAULT_KNOWLEDGE_BASE);
      StorageService.saveKnowledgeBase(DEFAULT_KNOWLEDGE_BASE);
      setKnowledgeBase(DEFAULT_KNOWLEDGE_BASE);
      const updatedTime = new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      setLastUpdated(updatedTime);
      showToast('Reset to default demo data', 'info');
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear all knowledge base contents?')) {
      setContent('');
      StorageService.saveKnowledgeBase('');
      setKnowledgeBase('');
      showToast('Knowledge base cleared', 'info');
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const isConfigured = content.trim().length > 30;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
              AI Grounding Source
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            Business Knowledge Base
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Add all information about your business that the AI assistant should use when answering customer questions. The AI will strictly ground its answers on this text.
          </p>
        </div>

        {/* Action Buttons Header */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCurrentTab('ai-assistant')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 font-semibold text-xs transition border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Test AI</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide transition shadow-lg shadow-blue-600/25 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'SAVE KNOWLEDGE BASE'}</span>
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div
        className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
          isConfigured
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isConfigured ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <div>
            <p className="font-semibold text-sm">
              {isConfigured ? '✓ Knowledge Base Saved' : '⚠ Knowledge Base Not Configured'}
            </p>
            <p className="text-[11px] opacity-80 mt-0.5">
              {isConfigured
                ? `Last updated: ${lastUpdated} • ${wordCount} words`
                : 'Enter your business details below and click Save.'}
            </p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900/60 font-mono">
          Prototype / Local Storage
        </span>
      </div>

      {/* Main Textarea Editor */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-medium flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-400" />
            Knowledge Base Editor
          </span>
          <span>{wordCount} words | {content.length} characters</span>
        </div>

        <textarea
          rows={18}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`BUSINESS NAME:
ABC Business

ABOUT US:
We are...

SERVICES:
1. Website Development
2. App Development
3. Digital Marketing

ADDRESS:
...

PHONE:
...

EMAIL:
...

BUSINESS HOURS:
Monday-Friday, 10 AM - 7 PM

PRICING:
...

SPECIAL OFFERS:
...

PAYMENT METHODS:
...

RETURN POLICY:
...

FAQ:
...

OTHER INFORMATION:
...`}
          className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl p-4 text-xs md:text-sm font-mono text-slate-200 placeholder-slate-600 outline-none transition leading-relaxed resize-y"
        />

        {/* Footer Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDemo}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition border border-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Demo Data</span>
            </button>

            <button
              onClick={handleClear}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 text-xs font-medium transition border border-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTab('ai-assistant')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 font-semibold text-xs transition border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>TEST AI</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wide transition shadow-lg shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'SAVE KNOWLEDGE BASE'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
