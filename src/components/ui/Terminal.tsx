'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useShell, ShellLine } from '@/hooks/useShell';

/* ─── Typewriter Line Component ─── */
function TypewriterLine({
  text,
  onComplete,
}: {
  text: string;
  onComplete?: () => void;
}) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    if (indexRef.current >= text.length) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      indexRef.current++;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        clearInterval(timer);
        onComplete?.();
      }
    }, 8);

    return () => clearInterval(timer);
  }, [text, onComplete]);

  return <span>{displayed}</span>;
}

/* ─── Terminal Component (pure div-based, no xterm.js canvas issues) ─── */
export default function Terminal() {
  const { history, execute, getPrompt, awaitingSudo } = useShell();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  // Auto-scroll: trigger on history changes AND during typewriter content growth
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  // MutationObserver catches typewriter character-by-character growth
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const observer = new MutationObserver(scrollToBottom);
    observer.observe(el, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [scrollToBottom]);

  // Focus input on click
  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const cmd = input;
      setInput('');
      if (cmd.trim()) {
        setCmdHistory((prev) => [...prev, cmd]);
        setHistoryIdx(-1);
      }
      execute(cmd);
    },
    [input, execute]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (cmdHistory.length === 0) return;
        const newIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(newIdx);
        setInput(cmdHistory[newIdx] || '');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIdx === -1) return;
        const newIdx = historyIdx + 1;
        if (newIdx >= cmdHistory.length) {
          setHistoryIdx(-1);
          setInput('');
        } else {
          setHistoryIdx(newIdx);
          setInput(cmdHistory[newIdx] || '');
        }
      }
    },
    [cmdHistory, historyIdx]
  );

  const getLineColor = (line: ShellLine) => {
    switch (line.type) {
      case 'input':
        return 'text-white/70';
      case 'error':
        return 'text-red-400';
      case 'system':
        return 'text-neon-cyan/80';
      case 'ai':
        return 'text-[#A855F7]'; // Purple for AI responses
      case 'output':
      default:
        return 'text-green-300/90';
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col bg-[#0a0a0a] font-mono text-sm cursor-text"
      onClick={handleContainerClick}
      id="terminal-content"
    >
      {/* ─── Output Area ─── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-0.5" style={{ scrollbarWidth: 'none' }}>
        {history.map((line) => (
          <div key={line.id} className={`${getLineColor(line)} leading-relaxed break-all`}>
            {line.typewriter ? (
              <TypewriterLine text={line.text} />
            ) : line.text.includes('<span') || line.text.includes('<div') ? (
              <span dangerouslySetInnerHTML={{ __html: line.text }} />
            ) : (
              <span className="whitespace-pre-wrap">{line.text}</span>
            )}
          </div>
        ))}
      </div>

      {/* ─── Input Line ─── */}
      <form onSubmit={handleSubmit} className="shrink-0 p-3 pt-0">
        <div className="flex items-center">
          <span className="text-neon-cyan/80 mr-1 shrink-0">
            {awaitingSudo ? '[sudo] password: ' : getPrompt()}
          </span>
          <input
            ref={inputRef}
            type={awaitingSudo ? 'password' : 'text'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white/90 caret-neon-cyan font-mono text-sm"
            autoFocus
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal input"
          />
          {/* Blinking cursor indicator */}
          <span className="w-2 h-4 bg-neon-cyan/70 animate-cursor-blink ml-0.5" />
        </div>
      </form>
    </div>
  );
}
