'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOSStore } from '@/store/useOSStore';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function NeuralEngine() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'system',
      content: 'Neural Engine CLI v2.4 initialized. Ready to answer questions about Aarush.',
    }
  ]);
  const [input, setInput] = useState('');
  const setIsGenerating = useOSStore(s => s.setIsGenerating);
  const isGenerating = useOSStore(s => s.isGenerating);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsGenerating(true);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.response },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'system', content: `Error: ${data.error || 'Connection failed'}` },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'system', content: 'Error: Failed to reach Neural Engine.' },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
      {/* ─── Header ─── */}
      <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md z-10 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 animate-pulse shadow-[0_0_8px_#d946ef]" />
          <span className="text-fuchsia-400 font-bold tracking-widest uppercase text-xs">
            Neural Engine Chat
          </span>
        </div>
        <span className="text-white/30 text-[10px] tracking-widest">
          POWERED BY GEMINI
        </span>
      </div>

      {/* ─── Chat History ─── */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-28 scroll-smooth font-sans">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {msg.role !== 'system' && (
              <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1.5 px-1">
                {msg.role === 'user' ? 'GUEST' : 'AI'}
              </span>
            )}
            
            <div
              className={`max-w-[85%] rounded-2xl p-4 leading-relaxed text-[15px] ${
                msg.role === 'user'
                  ? 'bg-neutral-800 text-white rounded-br-sm'
                  : msg.role === 'assistant'
                  ? 'bg-fuchsia-900/40 text-fuchsia-50/90 border border-fuchsia-500/20 backdrop-blur-md rounded-bl-sm shadow-[0_4px_24px_rgba(217,70,239,0.1)]'
                  : 'bg-transparent text-white/50 border border-white/10 text-xs font-mono font-medium'
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-start"
          >
             <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1.5 px-1">
                AI
              </span>
            <div className="bg-fuchsia-900/20 backdrop-blur-md border border-fuchsia-500/20 rounded-2xl rounded-bl-sm px-5 py-4 flex items-center gap-1.5 w-max">
              <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400/60 animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400/60 animate-bounce" style={{ animationDelay: '0.15s' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400/60 animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* ─── Input Area ─── */}
      <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent pt-12 pointer-events-none font-sans">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center bg-[#151515] border border-white/10 rounded-2xl overflow-hidden shadow-2xl pointer-events-auto transition-all focus-within:border-fuchsia-500/50 focus-within:ring-1 focus-within:ring-fuchsia-500/30"
        >
          <div className="pl-5 pr-3 text-fuchsia-500 font-bold font-mono">{'>'}</div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Aarush's experience..."
            className="flex-1 bg-transparent text-white placeholder-white/30 px-2 py-4 focus:outline-none text-[15px] pr-20"
            disabled={isGenerating}
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="absolute right-2 px-5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-50 disabled:hover:bg-fuchsia-600 text-white rounded-xl text-xs font-bold font-mono tracking-wider transition-colors shadow-md"
          >
            SEND
          </button>
        </form>
      </div>
    </div>
  );
}
