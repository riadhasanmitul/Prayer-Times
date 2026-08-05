import { useColorScheme } from 'react-native';
import { AppDarkTheme, AppLightTheme } from './index';
import { DarkColors, LightColors } from './colors';
import { useSettingsStore } from '../store/settingsStore';

export const useAppTheme = () => {
  const systemScheme = useColorScheme();
  const { settings } = useSettingsStore();
  
  const isDark =
    settings?.theme === 'dark' ||
    (settings?.theme === 'system' && systemScheme === 'dark') ||
    systemScheme === 'dark';

  return {
    theme: isDark ? AppDarkTheme : AppLightTheme,
    isDark,
    colors: isDark ? DarkColors : LightColors,
  };
};
