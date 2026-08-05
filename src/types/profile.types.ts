import type { RingerMode, PrayerName } from './prayer.types';
import type { ProfileId } from './settings.types';
// Re-export ProfileId from prayer.types or define here

export type AutomationTriggerType = 'wifi' | 'bluetooth' | 'gps';

export interface AutomationRule {
  id: string;
  type: AutomationTriggerType;
  condition: string; // SSID, BT device name, or 'lat,lon,radius'
  profileId: ProfileId;
  enabled: boolean;
  name: string;
}

export interface SoundSettings {
  ringerMode: RingerMode;
  respectUserOverride: boolean;
}

export interface Profile {
  id: ProfileId;
  name: string;
  icon: string; // MaterialCommunityIcons name
  isDefault: boolean;
  isBuiltIn: boolean;
  soundSettings: SoundSettings;
  enabledPrayers: Partial<Record<PrayerName, boolean>>;
  automationRules: AutomationRule[];
  createdAt: number;
  updatedAt: number;
}
