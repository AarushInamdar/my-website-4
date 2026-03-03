import { create } from 'zustand';

export interface OSWindow {
    id: string;
    title: string;
    icon: string;
    zIndex: number;
    isMinimized: boolean;
    position: { x: number; y: number };
    size: { width: number; height: number };
}

export type SystemStatus = 'Booting' | 'Online' | 'Power_Off' | 'Locked';

interface OSState {
    systemStatus: SystemStatus;
    activeWindows: OSWindow[];
    nextZIndex: number;
    bootProgress: number;
    focusedComponent: string | null;
    hoveredComponents: string[];
    selectedCompany: string | null;

    // Actions
    boot: () => void;
    shutdown: () => void;
    lockScreen: () => void;
    unlockScreen: () => void;
    setBootProgress: (progress: number) => void;
    openWindow: (win: Omit<OSWindow, 'zIndex'>) => void;
    closeWindow: (id: string) => void;
    focusWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    setFocusedComponent: (name: string | null) => void;
    setHoveredComponents: (names: string[]) => void;
    setSelectedCompany: (company: string | null) => void;
    isGenerating: boolean;
    setIsGenerating: (val: boolean) => void;

    // System Preferences
    wallpaper: 'default' | 'matrix' | 'aurora' | 'minimal';
    setWallpaper: (val: 'default' | 'matrix' | 'aurora' | 'minimal') => void;
    dockMagnification: boolean;
    setDockMagnification: (val: boolean) => void;
    crtEnabled: boolean;
    setCrtEnabled: (val: boolean) => void;
    terminalOpacity: number;
    setTerminalOpacity: (val: number) => void;
}

export const useOSStore = create<OSState>((set, get) => ({
    systemStatus: 'Booting',
    activeWindows: [],
    nextZIndex: 100,
    bootProgress: 0,
    focusedComponent: null,
    hoveredComponents: [],
    selectedCompany: null,
    isGenerating: false,

    // System Preferences Default Values
    wallpaper: 'default',
    dockMagnification: true,
    crtEnabled: false,
    terminalOpacity: 0.8,

    boot: () => set({ systemStatus: 'Online' }),

    shutdown: () =>
        set({
            systemStatus: 'Power_Off',
            activeWindows: [],
            nextZIndex: 100,
        }),

    lockScreen: () =>
        set({
            systemStatus: 'Locked',
            activeWindows: [],
            nextZIndex: 100,
        }),

    unlockScreen: () =>
        set({ systemStatus: 'Online' }),

    setBootProgress: (progress: number) => set({ bootProgress: progress }),

    openWindow: (win) => {
        const state = get();
        // Don't open duplicate windows
        if (state.activeWindows.find((w) => w.id === win.id)) {
            // Focus instead
            get().focusWindow(win.id);
            return;
        }
        const newZ = state.nextZIndex;
        set({
            activeWindows: [...state.activeWindows, { ...win, zIndex: newZ }],
            nextZIndex: newZ + 1,
        });
    },

    closeWindow: (id: string) =>
        set((state) => ({
            activeWindows: state.activeWindows.filter((w) => w.id !== id),
        })),

    focusWindow: (id: string) => {
        const state = get();
        const newZ = state.nextZIndex;
        set({
            activeWindows: state.activeWindows.map((w) =>
                w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w
            ),
            nextZIndex: newZ + 1,
        });
    },

    minimizeWindow: (id: string) =>
        set((state) => ({
            activeWindows: state.activeWindows.map((w) =>
                w.id === id ? { ...w, isMinimized: true } : w
            ),
        })),

    setFocusedComponent: (name: string | null) =>
        set({ focusedComponent: name }),

    setHoveredComponents: (names: string[]) =>
        set({ hoveredComponents: names }),

    setSelectedCompany: (company: string | null) =>
        set({ selectedCompany: company }),

    setIsGenerating: (val: boolean) => set({ isGenerating: val }),

    // System Preferences actions
    setWallpaper: (val) => set({ wallpaper: val }),
    setDockMagnification: (val) => set({ dockMagnification: val }),
    setCrtEnabled: (val) => set({ crtEnabled: val }),
    setTerminalOpacity: (val) => set({ terminalOpacity: val }),
}));
