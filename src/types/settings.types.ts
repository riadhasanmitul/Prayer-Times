export type CalculationMethodName =
  | 'Karachi'
  | 'MuslimWorldLeague'
  | 'Egyptian'
  | 'MoonsightingCommittee'
  | 'NorthAmerica'
  | 'Dubai'
  | 'Kuwait'
  | 'Qatar'
  | 'Singapore'
  | 'Tehran'
  | 'Turkey';

export type MadhabName = 'Hanafi' | 'Shafi';
export type AppTheme = 'light' | 'dark' | 'system';
export type TimeFormat = '12h' | '24h';
export type AppMode = 'simple' | 'advanced';
export type ProfileId = string;

export interface AppSettings {
  theme: AppTheme;
  timeFormat: TimeFormat;
  appMode: AppMode;
  calculationMethod: CalculationMethodName;
  madhab: MadhabName;
  language: 'en';
  activeProfileId: ProfileId;
  notificationsEnabled: boolean;
  batteryOptimizationIgnored: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  timeFormat: '12h',
  appMode: 'simple',
  calculationMethod: 'Karachi',
  madhab: 'Hanafi',
  language: 'en',
  activeProfileId: 'default',
  notificationsEnabled: true,
  batteryOptimizationIgnored: false,
};
