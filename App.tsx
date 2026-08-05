import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAppTheme } from './src/theme/useAppTheme';
import { useSettingsStore } from './src/store/settingsStore';
import { useProfileStore } from './src/store/profileStore';

function AppContent(): React.JSX.Element {
  const { theme, isDark } = useAppTheme();

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <AppNavigator />
    </PaperProvider>
  );
}

function App(): React.JSX.Element {
  const loadSettings = useSettingsStore(state => state.loadSettings);
  const loadProfiles = useProfileStore(state => state.loadProfiles);

  useEffect(() => {
    loadSettings();
    loadProfiles();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
