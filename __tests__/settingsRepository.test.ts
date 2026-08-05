import { SettingsRepository } from '../src/data/repositories/SettingsRepository';
import { DEFAULT_SETTINGS } from '../src/types/settings.types';

jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => {
    const store: Record<string, string> = {};
    return {
      set: jest.fn((key: string, val: string) => { store[key] = val; }),
      getString: jest.fn((key: string) => store[key]),
      delete: jest.fn((key: string) => { delete store[key]; }),
      getAllKeys: jest.fn(() => Object.keys(store)),
      clearAll: jest.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
      contains: jest.fn((key: string) => key in store),
    };
  }),
}));

describe('SettingsRepository', () => {
  let repo: SettingsRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new SettingsRepository();
  });

  describe('getSettings', () => {
    it('should return default settings when nothing is stored', () => {
      const settings = repo.getSettings();
      expect(settings).toEqual(DEFAULT_SETTINGS);
    });
  });

  describe('saveSettings + getSettings', () => {
    it('should persist partial settings updates', () => {
      repo.saveSettings({ theme: 'dark', timeFormat: '24h' });
      const settings = repo.getSettings();
      expect(settings.theme).toBe('dark');
      expect(settings.timeFormat).toBe('24h');
      // Other settings should remain as default
      expect(settings.calculationMethod).toBe(DEFAULT_SETTINGS.calculationMethod);
    });
  });

  describe('resetSettings', () => {
    it('should restore default settings after reset', () => {
      repo.saveSettings({ theme: 'dark', madhab: 'Shafi' });
      repo.resetSettings();
      const settings = repo.getSettings();
      expect(settings.theme).toBe(DEFAULT_SETTINGS.theme);
      expect(settings.madhab).toBe(DEFAULT_SETTINGS.madhab);
    });
  });

  describe('DEFAULT_SETTINGS', () => {
    it('should use Karachi as default calculation method', () => {
      expect(DEFAULT_SETTINGS.calculationMethod).toBe('Karachi');
    });

    it('should use Hanafi as default madhab', () => {
      expect(DEFAULT_SETTINGS.madhab).toBe('Hanafi');
    });

    it('should use system theme by default', () => {
      expect(DEFAULT_SETTINGS.theme).toBe('system');
    });
  });
});
