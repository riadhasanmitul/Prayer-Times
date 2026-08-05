import { create } from 'zustand';
import { profileRepository } from '../data/repositories/ProfileRepository';
import type { Profile, ProfileId } from '../types';

interface ProfileState {
  profiles: Profile[];
  activeProfileId: ProfileId;
  isLoading: boolean;
  error: string | null;
  loadProfiles: () => void;
  setActiveProfile: (id: ProfileId) => void;
  saveProfile: (profile: Profile) => void;
  deleteProfile: (id: ProfileId) => void;
}

export const useProfileStore = create<ProfileState>()(set => ({
  profiles: [],
  activeProfileId: 'default',
  isLoading: false,
  error: null,

  loadProfiles: () => {
    set({ isLoading: true, error: null });
    try {
      const profiles = profileRepository.getAllProfiles();
      const activeProfileId = profileRepository.getActiveProfileId();
      set({ profiles, activeProfileId, isLoading: false });
    } catch (e) {
      set({ error: String(e), isLoading: false });
    }
  },

  setActiveProfile: (id) => {
    profileRepository.setActiveProfileId(id);
    set({ activeProfileId: id });
  },

  saveProfile: (profile) => {
    profileRepository.saveProfile(profile);
    set(state => {
      const idx = state.profiles.findIndex(p => p.id === profile.id);
      const profiles = [...state.profiles];
      if (idx >= 0) profiles[idx] = profile;
      else profiles.push(profile);
      return { profiles };
    });
  },

  deleteProfile: (id) => {
    profileRepository.deleteProfile(id);
    set(state => ({ profiles: state.profiles.filter(p => p.id !== id) }));
  },
}));
