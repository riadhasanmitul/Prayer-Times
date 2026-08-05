import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Switch } from 'react-native-paper';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing, borderRadius, typography } from '../theme';

interface PrayerCardProps {
  prayerName: string;
  time: string;
  enabled: boolean;
  isActive: boolean;
  isNext: boolean;
  onToggle: (enabled: boolean) => void;
  onPress: () => void;
}

const PRAYER_ICONS: Record<string, string> = {
  Fajr: 'weather-sunset-up',
  Dhuhr: 'weather-sunny',
  Asr: 'weather-partly-cloudy',
  Maghrib: 'weather-sunset-down',
  Isha: 'weather-night',
};

export const PrayerCard: React.FC<PrayerCardProps> = ({
  prayerName, time, enabled, isActive, isNext, onToggle, onPress,
}) => {
  const { colors, theme } = useAppTheme();
  
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);
  
  useEffect(() => {
    if (isActive) {
      glow.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      glow.value = 0;
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: isActive 
      ? `rgba(212, 175, 55, ${0.5 + glow.value * 0.5})` 
      : colors.outlineVariant,
    borderWidth: isActive ? 2 : 1,
  }));

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.surface }, animatedStyle]}>
      <TouchableOpacity 
        style={styles.touchable} 
        onPress={onPress}
        onPressIn={() => scale.value = withSpring(0.97)}
        onPressOut={() => scale.value = withSpring(1)}
        activeOpacity={0.8}
      >
        <View style={styles.left}>
          <Icon name={PRAYER_ICONS[prayerName] || 'clock'} size={32} color={colors.primary} />
          <View style={styles.textContainer}>
            <Text style={[typography.titleMedium, { color: colors.onSurface }]}>{prayerName}</Text>
            <Text style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}>{time}</Text>
          </View>
        </View>
        <View style={styles.right}>
          {isNext && (
            <View style={[styles.badge, { backgroundColor: colors.secondaryContainer }]}>
              <Text style={[typography.labelSmall, { color: colors.onSecondaryContainer }]}>Next</Text>
            </View>
          )}
          {isActive && (
            <View style={[styles.badge, { backgroundColor: colors.primaryContainer }]}>
              <Text style={[typography.labelSmall, { color: colors.onPrimaryContainer }]}>Active</Text>
            </View>
          )}
          <Switch value={enabled} onValueChange={onToggle} color={colors.primary} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: spacing.md,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
});
