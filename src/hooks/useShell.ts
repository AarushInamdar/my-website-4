'use client';

import { useState, useCallback, useRef } from 'react';
import { FILE_SYSTEM, MAN_PAGES, resolvePath, FSNode } from '@/data/filesystem';
import { focusComponent, resetCamera } from '@/components/3d/Environment';
import { useOSStore } from '@/store/useOSStore';

export interface ShellLine {
    id: number;
    text: string;
    type: 'input' | 'output' | 'error' | 'system' | 'ai';
    typewriter?: boolean;
}

const SUDO_PASSWORD = 'akpsi';
const PROMPT_PREFIX = 'aarush@kernel';

export function useShell() {
    const [cwd, setCwd] = useState('/');
    const [history, setHistory] = useState<ShellLine[]>([
        {
            id: 0,
            text: 'Kernel Terminal v1.0 — Type "help" or "man <topic>" for documentation.',
            type: 'system',
        },
    ]);
    const [awaitingSudo, setAwaitingSudo] = useState<string | null>(null);
    const [cmdHistory, setCmdHistory] = useState<string[]>([]);
    const [cmdHistoryIdx, setCmdHistoryIdx] = useState(-1);
    const lineIdRef = useRef(1);
    const setHoveredComponents = useOSStore((s) => s.setHoveredComponents);

    const nextId = () => lineIdRef.current++;

    const addLine = useCallback(
        (text: string, type: ShellLine['type'], typewriter = false) => {
            setHistory((prev) => [
                ...prev,
                { id: nextId(), text, type, typewriter },
            ]);
        },
        []
    );

    const addLines = useCallback(
        (lines: string[], type: ShellLine['type'], typewriter = false) => {
            setHistory((prev) => [
                ...prev,
                ...lines.map((text) => ({
                    id: nextId(),
                    text,
                    type,
                    typewriter,
                })),
            ]);
        },
        []
    );

    const getPrompt = useCallback(() => {
        const dir = cwd === '/' ? '~' : cwd.split('/').pop() || '~';
        return `${PROMPT_PREFIX}:${dir}$ `;
    }, [cwd]);

    /* ─── Command Handlers ─── */

    const handleLs = useCallback(
        (args: string[]) => {
            const target = args[0] || cwd;
            const { absolutePath, node } = resolvePath(cwd, target);

            if (!node || node.type !== 'dir') {
                addLine(`ls: cannot access '${target}': No such directory`, 'error');
                return;
            }

            // Hardware awareness — pulse 3D components when listing /mnt/hardware
            if (absolutePath === '/mnt/hardware') {
                setHoveredComponents(['pmu', 'sap']);
                setTimeout(() => setHoveredComponents([]), 3000);
            }

            const entries = Object.entries(node.children || {}).map(([name, child]) => {
                if (child.type === 'dir') return `<span class="text-neon-cyan font-bold">${name}/</span>`;
                if (name.endsWith('.sh')) return `<span class="text-green-400 font-bold">${name}</span>`;
                if (child.protected) return `<span class="text-red-400 font-bold">${name}</span>`;
                if (child.hardware) return `<span class="text-amber-400 font-bold">${name}</span>`;
                return name;
            });

            addLine(`<div class="flex flex-wrap gap-4 mt-1 mb-1">${entries.join('')}</div>`, 'output');
        },
        [cwd, addLine, setHoveredComponents]
    );

    const handleCd = useCallback(
        (args: string[]) => {
            if (!args[0] || args[0] === '~') {
                setCwd('/');
                return;
            }

            const { absolutePath, node } = resolvePath(cwd, args[0]);

            if (!node) {
                addLine(`cd: no such file or directory: ${args[0]}`, 'error');
                return;
            }
            if (node.type !== 'dir') {
                addLine(`cd: not a directory: ${args[0]}`, 'error');
                return;
            }
            setCwd(absolutePath);
        },
        [cwd, addLine]
    );

    const handleCat = useCallback(
        (args: string[], isSudo = false) => {
            if (!args[0]) {
                addLine('cat: missing file operand', 'error');
                return;
            }

            const { node } = resolvePath(cwd, args[0]);

            if (!node) {
                addLine(`cat: ${args[0]}: No such file or directory`, 'error');
                return;
            }
            if (node.type === 'dir') {
                addLine(`cat: ${args[0]}: Is a directory`, 'error');
                return;
            }

            // Protected file check
            if (node.protected && !isSudo) {
                addLine(
                    `cat: ${args[0]}: Permission denied. Use sudo.`,
                    'error'
                );
                return;
            }

            // Hardware hook — focus 3D component
            if (node.hardware) {
                focusComponent(node.hardware);
                setHoveredComponents([node.hardware]);
                setTimeout(() => {
                    setHoveredComponents([]);
                    resetCamera();
                }, 5000);
            }

            // Output file content with typewriter effect
            const lines = (node.content || '').split('\n');
            addLines(lines, 'output', true);
        },
        [cwd, addLine, addLines, setHoveredComponents]
    );

    const handleMan = useCallback(
        (args: string[]) => {
            if (!args[0]) {
                addLine('What manual page do you want?', 'error');
                addLine('Usage: man <command|topic>', 'error');
                return;
            }

            const page = MAN_PAGES[args[0].toLowerCase()];
            if (!page) {
                addLine(`No manual entry for ${args[0]}`, 'error');
                addLine(
                    'Available: ls, cd, cat, man, pwd, clear, sudo, help, adobe, apple, series, trl11, sap, checksplit, netaudit, spots',
                    'system'
                );
                return;
            }

            const lines = page.split('\n');
            addLines(lines, 'output', true);
        },
        [addLine, addLines]
    );

    const handleHelp = useCallback(() => {
        const helpText = [
            '╔══════════════════════════════════════════════╗',
            '║         KERNEL SHELL — COMMAND REFERENCE      ║',
            '╠══════════════════════════════════════════════╣',
            '║  ls [path]        List directory contents     ║',
            '║  cd <path>        Change directory             ║',
            '║  cat <file>       Display file contents        ║',
            '║  man <topic>      Open manual page             ║',
            '║  pwd              Print working directory      ║',
            '║  clear            Clear terminal               ║',
            '║  sudo <cmd>       Execute with elevation       ║',
            '║  help             Show this message            ║',
            '╠══════════════════════════════════════════════╣',
            '║  Use "man <topic>" for detailed man pages.    ║',
            '║  Topics: adobe, apple, series, trl11, sap     ║',
            '║          checksplit, netaudit, spots           ║',
            '╚══════════════════════════════════════════════╝',
        ];
        addLines(helpText, 'output');
    }, [addLines]);

    const handlePwd = useCallback(() => {
        addLine(cwd, 'output');
    }, [cwd, addLine]);

    const handleAskGemini = useCallback(
        async (args: string[]) => {
            if (args.length === 0) {
                addLine('usage: ask-gemini <query>', 'error');
                return;
            }
            const query = args.join(' ');
            addLine(`[Neural Engine] Synthesizing response for: "${query}"...`, 'system');

            try {
                const res = await fetch('/api/gemini', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query })
                });
                const data = await res.json();

                if (res.ok) {
                    const lines = data.response.split('\n');
                    addLines(lines, 'ai', true);
                } else {
                    addLine(`[Neural Engine Error] ${data.error || 'Connection failed'}`, 'error');
                }
            } catch (err) {
                addLine('[Neural Engine Error] Connection failed', 'error');
            }
        },
        [addLine, addLines]
    );

    const handlePing = useCallback(
        (args: string[]) => {
            if (!args[0]) {
                addLine('usage: ping <protocol | skill>', 'error');
                return;
            }
            const skill = args[0].toLowerCase();
            const skillMap: Record<string, string> = {
                swift: 'apple.com',
                swiftui: 'apple.com',
                'c++': 'adobe.com',
                cpp: 'adobe.com',
                python: 'series.so',
                fastapi: 'series.so',
                abap: 'sap.com',
                javascript: 'sap.com',
                sql: 'trl11.com',
                sqlite: 'trl11.com',
                react: 'vercel.com',
                nextjs: 'vercel.com',
                go: 'golang.org',
            };

            const host = skillMap[skill] || `${skill}.net`;

            const pingLines = [
                `PING ${host} (${skill} protocol): 56 data bytes`,
                `64 bytes from ${host}: icm_seq=0 ttl=64 time=${(Math.random() * 0.5 + 0.1).toFixed(2)} ms`,
                `64 bytes from ${host}: icm_seq=1 ttl=64 time=${(Math.random() * 0.5 + 0.1).toFixed(2)} ms`,
                `64 bytes from ${host}: icm_seq=2 ttl=64 time=${(Math.random() * 0.5 + 0.1).toFixed(2)} ms`,
            ];
            addLines(pingLines, 'output');
        },
        [addLines]
    );

    /* ─── Main Execute ─── */

    const execute = useCallback(
        (input: string) => {
            const trimmed = input.trim();

            // ── Sudo password prompt handling ──
            if (awaitingSudo !== null) {
                // Show masked input line
                addLine(`[sudo] password: ${'•'.repeat(trimmed.length)}`, 'input');
                if (trimmed === SUDO_PASSWORD || trimmed === 'uci') {
                    addLine('[sudo] Authentication successful.', 'system');
                    // Re-execute the original command with sudo flag
                    const parts = awaitingSudo.split(/\s+/);
                    const cmd = parts[0];
                    const args = parts.slice(1);
                    if (cmd === 'cat') handleCat(args, true);
                    else execute(awaitingSudo);
                } else {
                    addLine('[sudo] Authentication failed. Incorrect password.', 'error');
                }
                setAwaitingSudo(null);
                return;
            }

            // Skip empty input entirely — no ghost prompt
            if (!trimmed) return;

            // Add the prompt+input to history
            addLine(`${getPrompt()}${trimmed}`, 'input');

            // Track command history for up-arrow
            setCmdHistory((prev) => [...prev, trimmed]);
            setCmdHistoryIdx(-1);

            const parts = trimmed.split(/\s+/);
            const cmd = parts[0].toLowerCase();
            const args = parts.slice(1);

            switch (cmd) {
                case 'ls':
                    handleLs(args);
                    break;
                case 'cd':
                    handleCd(args);
                    break;
                case 'cat':
                    handleCat(args);
                    break;
                case 'man':
                    handleMan(args);
                    break;
                case 'help':
                    handleHelp();
                    break;
                case 'pwd':
                    handlePwd();
                    break;
                case 'clear':
                    setHistory([]);
                    break;
                case 'ask-gemini':
                    handleAskGemini(args);
                    break;
                case 'ping':
                    handlePing(args);
                    break;
                case 'sudo':
                    if (args.length === 0) {
                        addLine('usage: sudo <command>', 'error');
                    } else {
                        addLine('[sudo] password for aarush: ', 'system');
                        setAwaitingSudo(args.join(' '));
                    }
                    break;
                default:
                    addLine(
                        `${cmd}: command not found. Type 'help' for available commands.`,
                        'error'
                    );
            }
        },
        [
            cwd,
            getPrompt,
            awaitingSudo,
            addLine,
            handleLs,
            handleCd,
            handleCat,
            handleMan,
            handleHelp,
            handlePwd,
            handleAskGemini,
            handlePing,
        ]
    );

    return {
        cwd,
        history,
        execute,
        getPrompt,
        awaitingSudo,
        cmdHistory,
        cmdHistoryIdx,
        setCmdHistoryIdx,
    };
}
