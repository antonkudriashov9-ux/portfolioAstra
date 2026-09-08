import { create } from 'zustand'

interface AppState {
  audioEnabled: boolean
  wireframeMode: boolean
  terminalOpen: boolean
  activeNodeId: string | null
  setAudioEnabled: (enabled: boolean) => void
  toggleWireframe: () => void
  setTerminalOpen: (open: boolean) => void
  setActiveNodeId: (id: string | null) => void
}

export const useStore = create<AppState>((set) => ({
  audioEnabled: false,
  wireframeMode: false,
  terminalOpen: false,
  activeNodeId: null,
  setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
  toggleWireframe: () => set((s) => ({ wireframeMode: !s.wireframeMode })),
  setTerminalOpen: (open) => set({ terminalOpen: open }),
  setActiveNodeId: (id) => set({ activeNodeId: id }),
}))
