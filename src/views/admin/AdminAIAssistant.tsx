import React, { useState } from 'react';
import { Bot, Send, Sparkles, HelpCircle, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '../../components/Toast';

interface AdminAIAssistantProps {
  knowledgeBase: string;
}

export const AdminAIAssistant: React.FC<AdminAIAssistantProps> = ({ knowledgeBase }) => {
  const { showToast } = useToast();
  const [question, setQuestion] = useState('What are your business hours?');
  const [answer, setAnswer] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testQuestions = [
    'What are your business hours?',
    'What services do you provide?',
    'Do you provide AI automation?',
    'What packages or pricing do you offer?',
    'Where is your office located?'
  ];

  const handleAsk = async (queryToAsk?: string) => {
    const q = (queryToAsk || question).trim();
    if (!q || loading) return;

    setLoading(true);
    setAnswer(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          knowledgeBase,
          messages: [{ role: 'user', content: q }]
        })
      });

      if (!res.ok) throw new Error('API server failed');

      const data = await res.json();
      setAnswer(data.message || 'No response returned.');
      setModelUsed(data.modelUsed || 'AI Engine');
      showToast('AI response generated', 'success');
    } catch (err: any) {
      setAnswer('Sorry, I am temporarily unable to answer. Please try again.');
      showToast('Error querying AI assistant', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
            Verification Tool
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-400" />
          Test Knowledge Base with AI
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Ask questions to ensure the AI assistant responds accurately according to your saved business knowledge base before clients ask.
        </p>
      </div>

      {/* Test Form Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
        <label className="block text-xs font-semibold text-slate-300">
          Enter Test Question
        </label>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What are your business hours?"
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 outline-none transition"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAsk();
              }
            }}
          />
          <button
            onClick={() => handleAsk()}
            disabled={!question.trim() || loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95 shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4" />
                <span>ASK AI</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Questions */}
        <div className="pt-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Quick Sample Test Inquiries:
          </span>
          <div className="flex flex-wrap gap-2">
            {testQuestions.map((tq, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuestion(tq);
                  handleAsk(tq);
                }}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition cursor-pointer disabled:opacity-50"
              >
                {tq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Response Output Box */}
      {answer && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> AI RESPONSE
            </span>
            {modelUsed && (
              <span className="text-[11px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 font-mono">
                Model: {modelUsed}
              </span>
            )}
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
};
