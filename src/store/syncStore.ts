import { create } from 'zustand';

interface SyncState {
  isSaving: boolean;
  lastSaved: Date | null;
  setIsSaving: (isSaving: boolean) => void;
  setLastSaved: (date: Date) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  isSaving: false,
  lastSaved: null,
  setIsSaving: (isSaving) => set({ isSaving }),
  setLastSaved: (date) => set({ lastSaved: date }),
}));
