import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withTiming } from 'react-native-reanimated';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing, borderRadius, typography } from '../theme';

interface Props {
  prayerName: string;
  profileName: string;
  remainingMinutes: number;
  onRestore: () => void;
}

export const ActiveBanner: React.FC<Props> = ({ prayerName, profileName, remainingMinutes, onRestore }) => {
  const { colors } = useAppTheme();
  
  const pulse = useSharedValue(1);
  const slide = useSharedValue(50);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(0.5, { duration: 1000 }), -1, true);
    slide.value = withSpring(0);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slide.value }],
  }));

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.surfaceVariant }, slideStyle]}>
      <Animated.View style={[styles.accent, { backgroundColor: colors.primary }, animatedStyle]} />
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[typography.titleMedium, { color: colors.onSurface }]}>Silenced for {prayerName}</Text>
          <Text style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}>{profileName} • {remainingMinutes}m remaining</Text>
        </View>
        <Button mode="contained" onPress={onRestore} buttonColor={colors.primary} textColor={colors.onPrimary}>
          Restore Now
        </Button>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginVertical: spacing.sm,
    elevation: 2,
  },
  accent: {
    width: 6,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
});
