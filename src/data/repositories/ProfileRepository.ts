import { MMKVStorage } from '../storage/MMKVStorage';
import { STORAGE_KEYS } from '../../constants';
import type { Profile, ProfileId, SoundSettings } from '../../types';

const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  ringerMode: 'silent',
  respectUserOverride: true,
};

export const BUILT_IN_PROFILES: Profile[] = [
  {
    id: 'default',
    name: 'Default',
    icon: 'mosque',
    isDefault: true,
    isBuiltIn: true,
    soundSettings: DEFAULT_SOUND_SETTINGS,
    enabledPrayers: { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true },
    automationRules: [],
    createdAt: 0,
    updatedAt: 0,
  },
  {
    id: 'home',
    name: 'Home',
    icon: 'home',
    isDefault: false,
    isBuiltIn: true,
    soundSettings: DEFAULT_SOUND_SETTINGS,
    enabledPrayers: {},
    automationRules: [],
    createdAt: 0,
    updatedAt: 0,
  },
  {
    id: 'office',
    name: 'Office',
    icon: 'office-building',
    isDefault: false,
    isBuiltIn: true,
    soundSettings: { ringerMode: 'vibrate', respectUserOverride: true },
    enabledPrayers: {},
    automationRules: [],
    createdAt: 0,
    updatedAt: 0,
  },
  {
    id: 'mosque',
    name: 'Mosque',
    icon: 'mosque',
    isDefault: false,
    isBuiltIn: true,
    soundSettings: DEFAULT_SOUND_SETTINGS,
    enabledPrayers: {},
    automationRules: [],
    createdAt: 0,
    updatedAt: 0,
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: 'airplane',
    isDefault: false,
    isBuiltIn: true,
    soundSettings: { ringerMode: 'vibrate', respectUserOverride: true },
    enabledPrayers: {},
    automationRules: [],
    createdAt: 0,
    updatedAt: 0,
  },
];

export class ProfileRepository {
  private getStoredProfiles(): Profile[] {
    return MMKVStorage.get<Profile[]>(STORAGE_KEYS.PROFILES) ?? [];
  }

  getAllProfiles(): Profile[] {
    const stored = this.getStoredProfiles();
    const builtInIds = new Set(BUILT_IN_PROFILES.map(p => p.id));
    const customProfiles = stored.filter(p => !builtInIds.has(p.id));
    // Merge built-in with stored overrides
    const mergedBuiltIn = BUILT_IN_PROFILES.map(bp => {
      const stored = this.getStoredProfiles().find(s => s.id === bp.id);
      return stored ? { ...bp, ...stored } : bp;
    });
    return [...mergedBuiltIn, ...customProfiles];
  }

  getProfile(id: ProfileId): Profile | null {
    return this.getAllProfiles().find(p => p.id === id) ?? null;
  }

  getEffectiveProfile(id: ProfileId): Profile {
    const defaultProfile = this.getProfile('default')!;
    if (id === 'default') return defaultProfile;
    const profile = this.getProfile(id);
    if (!profile) return defaultProfile;
    // Inherit: only override what's explicitly set in non-default profile
    return {
      ...defaultProfile,
      ...profile,
      soundSettings: Object.keys(profile.soundSettings).length > 0
        ? { ...defaultProfile.soundSettings, ...profile.soundSettings }
        : defaultProfile.soundSettings,
      enabledPrayers: Object.keys(profile.enabledPrayers).length > 0
        ? { ...defaultProfile.enabledPrayers, ...profile.enabledPrayers }
        : defaultProfile.enabledPrayers,
    };
  }

  saveProfile(profile: Profile): void {
    const stored = this.getStoredProfiles();
    const idx = stored.findIndex(p => p.id === profile.id);
    if (idx >= 0) {
      stored[idx] = profile;
    } else {
      stored.push(profile);
    }
    MMKVStorage.set(STORAGE_KEYS.PROFILES, stored);
  }

  deleteProfile(id: ProfileId): void {
    const builtInIds = new Set(BUILT_IN_PROFILES.map(p => p.id));
    if (builtInIds.has(id)) return; // Cannot delete built-in
    const stored = this.getStoredProfiles().filter(p => p.id !== id);
    MMKVStorage.set(STORAGE_KEYS.PROFILES, stored);
  }

  getActiveProfileId(): ProfileId {
    return MMKVStorage.get<ProfileId>(STORAGE_KEYS.ACTIVE_PROFILE_ID) ?? 'default';
  }

  setActiveProfileId(id: ProfileId): void {
    MMKVStorage.set(STORAGE_KEYS.ACTIVE_PROFILE_ID, id);
  }
}

export const profileRepository = new ProfileRepository();
