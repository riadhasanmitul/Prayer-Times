import { create } from 'zustand';
import { settingsRepository } from '../data/repositories/SettingsRepository';
import type { AppSettings } from '../types';
import { DEFAULT_SETTINGS } from '../types';

interface SettingsState {
  settings: AppSettings;
  isLoading: boolean;
  loadSettings: () => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(set => ({
  settings: DEFAULT_SETTINGS,
  isLoading: false,

  loadSettings: () => {
    set({ isLoading: true });
    const settings = settingsRepository.getSettings();
    set({ settings, isLoading: false });
  },

  updateSettings: (updates) => {
    settingsRepository.saveSettings(updates);
    set(state => ({ settings: { ...state.settings, ...updates } }));
  },

  resetSettings: () => {
    settingsRepository.resetSettings();
    set({ settings: DEFAULT_SETTINGS });
  },
}));
