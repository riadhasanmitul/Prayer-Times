import { ProfileRepository, BUILT_IN_PROFILES } from '../src/data/repositories/ProfileRepository';

// Mock MMKV
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    getString: jest.fn(() => undefined),
    delete: jest.fn(),
    getAllKeys: jest.fn(() => []),
    clearAll: jest.fn(),
    contains: jest.fn(() => false),
  })),
}));

describe('ProfileRepository', () => {
  let repo: ProfileRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new ProfileRepository();
  });

  describe('getAllProfiles', () => {
    it('should return all 5 built-in profiles', () => {
      const profiles = repo.getAllProfiles();
      expect(profiles.length).toBeGreaterThanOrEqual(5);
      
      const ids = profiles.map(p => p.id);
      expect(ids).toContain('default');
      expect(ids).toContain('home');
      expect(ids).toContain('office');
      expect(ids).toContain('mosque');
      expect(ids).toContain('travel');
    });

    it('should have default profile marked as isDefault', () => {
      const profiles = repo.getAllProfiles();
      const defaultProfile = profiles.find(p => p.id === 'default');
      expect(defaultProfile?.isDefault).toBe(true);
    });
  });

  describe('getEffectiveProfile', () => {
    it('should return default profile unchanged when id is default', () => {
      const defaultProfile = repo.getEffectiveProfile('default');
      expect(defaultProfile.id).toBe('default');
      expect(defaultProfile.isDefault).toBe(true);
    });

    it('should merge office profile with default', () => {
      const officeProfile = repo.getEffectiveProfile('office');
      // Office inherits from default, but overrides ringerMode to vibrate
      expect(officeProfile.soundSettings.ringerMode).toBe('vibrate');
    });

    it('should return default profile for unknown id', () => {
      const profile = repo.getEffectiveProfile('nonexistent-id');
      expect(profile.id).toBe('default');
    });
  });

  describe('BUILT_IN_PROFILES', () => {
    it('should all be marked as isBuiltIn', () => {
      BUILT_IN_PROFILES.forEach(profile => {
        expect(profile.isBuiltIn).toBe(true);
      });
    });

    it('default profile should have all prayers enabled', () => {
      const defaultProfile = BUILT_IN_PROFILES.find(p => p.id === 'default');
      expect(defaultProfile?.enabledPrayers.Fajr).toBe(true);
      expect(defaultProfile?.enabledPrayers.Dhuhr).toBe(true);
      expect(defaultProfile?.enabledPrayers.Asr).toBe(true);
      expect(defaultProfile?.enabledPrayers.Maghrib).toBe(true);
      expect(defaultProfile?.enabledPrayers.Isha).toBe(true);
    });
  });
});
