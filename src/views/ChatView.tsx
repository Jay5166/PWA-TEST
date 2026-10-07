import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Trash2, Sparkles, User, AlertCircle, RefreshCw } from 'lucide-react';
import { ChatMessage, BusinessSettings } from '../types';
import { StorageService } from '../utils/storage';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useToast } from '../components/Toast';

interface ChatViewProps {
  settings: BusinessSettings;
  knowledgeBase: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ settings, knowledgeBase }) => {
  const isOnline = useOnlineStatus();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const history = StorageService.getChatHistory();
    setMessages(history);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    if (!isOnline) {
      showToast('You are offline. The AI assistant requires an internet connection.', 'error');
      return;
    }

    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    StorageService.saveChatHistory(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Send conversation payload to /api/chat
      const apiPayload = newMessages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          knowledgeBase,
          messages: apiPayload
        })
      });

      if (!res.ok) {
        throw new Error('API server error');
      }

      const data = await res.json();
      const botReply = data.message || 'Sorry, I am temporarily unable to answer. Please try again.';

      const botMessage: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        role: 'assistant',
        content: botReply,
        timestamp: new Date().toISOString(),
        modelUsed: data.modelUsed
      };

      const finalMessages = [...newMessages, botMessage];
      setMessages(finalMessages);
      StorageService.saveChatHistory(finalMessages);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I am temporarily unable to answer. Please check your network or try again.',
        timestamp: new Date().toISOString()
      };
      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      StorageService.saveChatHistory(finalMessages);
      showToast('Unable to connect to AI server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    const initial: ChatMessage[] = [
      {
        id: `msg_welcome_${Date.now()}`,
        role: 'assistant',
        content: `Hello! I am the official AI assistant for ${settings.businessName}. How can I help you today?`,
        timestamp: new Date().toISOString()
      }
    ];
    setMessages(initial);
    StorageService.saveChatHistory(initial);
    showToast('Chat history cleared', 'info');
  };

  const quickQuestions = [
    'What services do you provide?',
    'What are your business hours?',
    'Do you provide AI automation?',
    'How do I contact support?'
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[650px] max-w-3xl mx-auto rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden pb-1">
      {/* Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              🤖 AI Business Assistant
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h2>
            <p className="text-[11px] text-slate-400">
              Grounded strictly in {settings.businessName}'s Knowledge Base
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          title="Clear Chat History"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-800 border border-slate-700 text-blue-400'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[82%] rounded-2xl p-3.5 text-xs md:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-sm shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm shadow-sm'
              }`}
            >
              <div className="whitespace-pre-line">{msg.content}</div>

              {msg.modelUsed && (
                <div className="mt-2 pt-1 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  <span>Powered by {msg.modelUsed}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-blue-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-slate-900 border border-slate-800 px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
              <span>AI is thinking...</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Quick Chips */}
      {messages.length <= 3 && (
        <div className="px-4 py-2 border-t border-slate-900 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-slate-400 font-semibold uppercase shrink-0">
            Suggested:
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading || !isOnline}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] whitespace-nowrap transition cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800">
        {!isOnline && (
          <div className="mb-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>You are offline. The AI assistant requires an internet connection.</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || !isOnline}
            placeholder={isOnline ? "Type your question..." : "Offline - AI unavailable"}
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 outline-none transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading || !isOnline}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide transition shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>SEND</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
