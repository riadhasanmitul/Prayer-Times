import { SilentMode, RINGER_MODE } from '../native/SilentModeModule';
import type { RingerMode } from '../types';

const toRingerMode = (value: number): RingerMode => {
  switch (value) {
    case RINGER_MODE.SILENT: return 'silent';
    case RINGER_MODE.VIBRATE: return 'vibrate';
    case RINGER_MODE.NORMAL: return 'normal';
    default: return 'normal';
  }
};

const toNativeMode = (mode: RingerMode): number => {
  switch (mode) {
    case 'silent': return RINGER_MODE.SILENT;
    case 'vibrate': return RINGER_MODE.VIBRATE;
    case 'normal': return RINGER_MODE.NORMAL;
  }
};

export class SoundStateManager {
  async getCurrentRingerMode(): Promise<RingerMode> {
    const value = await SilentMode.getRingerMode();
    return toRingerMode(value);
  }

  async silencePhone(targetMode: RingerMode = 'silent'): Promise<void> {
    await SilentMode.setRingerMode(toNativeMode(targetMode));
  }

  async restorePhone(previousMode: RingerMode): Promise<void> {
    await SilentMode.setRingerMode(toNativeMode(previousMode));
  }

  async storeCurrentModeAndSilence(targetMode: RingerMode): Promise<RingerMode> {
    const current = await this.getCurrentRingerMode();
    await this.silencePhone(targetMode);
    return current;
  }

  async hasUserOverridden(expectedMode: RingerMode): Promise<boolean> {
    const current = await this.getCurrentRingerMode();
    return current !== expectedMode;
  }

  async hasDndAccess(): Promise<boolean> {
    return SilentMode.hasDndAccess();
  }

  async requestDndAccess(): Promise<void> {
    return SilentMode.requestDndAccess();
  }
}

export const soundStateManager = new SoundStateManager();
