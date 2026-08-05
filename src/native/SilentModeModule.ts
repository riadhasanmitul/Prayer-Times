import { NativeModules, Platform } from 'react-native';

export const RINGER_MODE = {
  SILENT: 0,
  VIBRATE: 1,
  NORMAL: 2,
} as const;

export type RingerModeValue = (typeof RINGER_MODE)[keyof typeof RINGER_MODE];

interface SilentModeNativeModule {
  setRingerMode(mode: number): Promise<void>;
  getRingerMode(): Promise<number>;
  requestDndAccess(): Promise<void>;
  hasDndAccess(): Promise<boolean>;
}

const { SilentModeModule } = NativeModules as { SilentModeModule: SilentModeNativeModule };

const MockModule: SilentModeNativeModule = {
  setRingerMode: () => Promise.resolve(),
  getRingerMode: () => Promise.resolve(RINGER_MODE.NORMAL),
  requestDndAccess: () => Promise.resolve(),
  hasDndAccess: () => Promise.resolve(false),
};

export const SilentMode: SilentModeNativeModule =
  Platform.OS === 'android' && SilentModeModule ? SilentModeModule : MockModule;
