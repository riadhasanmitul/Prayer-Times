import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button } from 'react-native-paper';
import { useAppTheme, spacing, typography } from '../theme';

export const AboutScreen: React.FC<any> = ({ navigation }) => {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[typography.displayMedium, { color: colors.primary, textAlign: 'center' }]}>Prayer Silencer</Text>
        <Text style={[typography.titleMedium, { color: colors.onSurfaceVariant, textAlign: 'center', marginTop: spacing.sm }]}>Version 1.0.0</Text>
        
        <Text style={[typography.bodyLarge, { color: colors.onSurface, marginTop: spacing.xl, textAlign: 'center' }]}>
          Built with React Native and the Adhan library.
        </Text>
        <Text style={[typography.bodyMedium, { color: colors.onSurfaceVariant, marginTop: spacing.md, textAlign: 'center' }]}>
          Privacy Policy: We collect absolutely no data. All data stays on your device.
        </Text>

        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
          Back
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  button: {
    marginTop: spacing.xxl,
  },
});
