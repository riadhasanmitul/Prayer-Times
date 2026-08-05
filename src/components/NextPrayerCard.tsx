import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { useAnimatedStyle, withRepeat, withTiming, useSharedValue, useEffect, Easing } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing, typography, borderRadius } from '../theme';

interface Props {
  prayerName: string;
  prayerTime: string;
  countdown: string;
  color: string;
}

export const NextPrayerCard: React.FC<Props> = ({ prayerName, prayerTime, countdown, color }) => {
  const { colors } = useAppTheme();
  
  const shimmer = useSharedValue(0.3);
  
  React.useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.1)' }, animatedStyle]} />
      <View style={styles.content}>
        <Icon name="weather-sunset" size={80} color={colors.onPrimary} style={styles.icon} />
        <View>
          <Text style={[typography.headlineLarge, { color: colors.onPrimary }]}>{prayerName}</Text>
          <Text style={[typography.titleLarge, { color: colors.onPrimary }]}>{prayerTime}</Text>
          <Text style={[typography.displaySmall, { color: colors.onPrimary, fontFamily: 'monospace' }]}>{countdown}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    padding: spacing.xl,
    marginVertical: spacing.md,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: spacing.lg,
  },
});
