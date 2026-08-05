import { MMKVStorage } from '../storage/MMKVStorage';
import { STORAGE_KEYS } from '../../constants';
import { AppSettings, DEFAULT_SETTINGS } from '../../types';
import type { LocationState } from '../../types';

export class SettingsRepository {
  getSettings(): AppSettings {
    return MMKVStorage.get<AppSettings>(STORAGE_KEYS.SETTINGS) ?? DEFAULT_SETTINGS;
  }

  saveSettings(updates: Partial<AppSettings>): void {
    const current = this.getSettings();
    MMKVStorage.set(STORAGE_KEYS.SETTINGS, { ...current, ...updates });
  }

  getLocationState(): LocationState | null {
    return MMKVStorage.get<LocationState>(STORAGE_KEYS.LOCATION_STATE) ?? null;
  }

  saveLocationState(state: LocationState): void {
    MMKVStorage.set(STORAGE_KEYS.LOCATION_STATE, state);
  }

  resetSettings(): void {
    MMKVStorage.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }
}

export const settingsRepository = new SettingsRepository();
