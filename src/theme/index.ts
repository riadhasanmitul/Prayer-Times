import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { DarkColors, LightColors } from './colors';

export const AppDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: DarkColors.background,
    surface: DarkColors.surface,
    surfaceVariant: DarkColors.surfaceVariant,
    primary: DarkColors.primary,
    primaryContainer: DarkColors.primaryContainer,
    onPrimary: DarkColors.onPrimary,
    secondary: DarkColors.secondary,
    secondaryContainer: DarkColors.secondaryContainer,
    onSecondary: DarkColors.onSecondary,
    error: DarkColors.error,
    errorContainer: DarkColors.errorContainer,
    onBackground: DarkColors.onBackground,
    onSurface: DarkColors.onSurface,
    onSurfaceVariant: DarkColors.onSurfaceVariant,
    outline: DarkColors.outline,
    outlineVariant: DarkColors.outlineVariant,
    scrim: DarkColors.scrim,
    inverseSurface: DarkColors.inverseSurface,
    inverseOnSurface: DarkColors.inverseOnSurface,
    inversePrimary: DarkColors.inversePrimary,
  },
};

export const AppLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: LightColors.background,
    surface: LightColors.surface,
    surfaceVariant: LightColors.surfaceVariant,
    primary: LightColors.primary,
    primaryContainer: LightColors.primaryContainer,
    onPrimary: LightColors.onPrimary,
    secondary: LightColors.secondary,
    secondaryContainer: LightColors.secondaryContainer,
    onSecondary: LightColors.onSecondary,
    error: LightColors.error,
    errorContainer: LightColors.errorContainer,
    onBackground: LightColors.onBackground,
    onSurface: LightColors.onSurface,
    onSurfaceVariant: LightColors.onSurfaceVariant,
    outline: LightColors.outline,
    outlineVariant: LightColors.outlineVariant,
    scrim: LightColors.scrim,
    inverseSurface: LightColors.inverseSurface,
    inverseOnSurface: LightColors.inverseOnSurface,
    inversePrimary: LightColors.inversePrimary,
  },
};

export type AppThemeType = typeof AppDarkTheme;
export { DarkColors, LightColors, PrayerColors } from './colors';
export { spacing, borderRadius } from './spacing';
export { typography } from './typography';
export { useAppTheme } from './useAppTheme';
