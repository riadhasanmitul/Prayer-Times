import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing, borderRadius, typography } from '../theme';

interface Profile {
  id: string;
  name: string;
  icon: string;
  enabledPrayersCount: number;
}

interface Props {
  profile: Profile;
  isActive: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

export const ProfileCard: React.FC<Props> = ({ profile, isActive, onPress, onLongPress }) => {
  const { colors } = useAppTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: isActive ? colors.primary : colors.outlineVariant,
    borderWidth: isActive ? 2 : 1,
  }));

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.surface }, animatedStyle]}>
      <TouchableOpacity
        style={styles.touchable}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={() => scale.value = withSpring(0.95)}
        onPressOut={() => scale.value = withSpring(1)}
        activeOpacity={0.8}
      >
        <View style={[styles.iconContainer, { backgroundColor: isActive ? colors.primaryContainer : colors.surfaceVariant }]}>
          <Icon name={profile.icon || 'account'} size={32} color={isActive ? colors.primary : colors.onSurfaceVariant} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[typography.titleMedium, { color: colors.onSurface }]}>{profile.name}</Text>
          <Text style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}>
            {profile.enabledPrayersCount} prayers enabled
          </Text>
        </View>
        {isActive && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={[typography.labelSmall, { color: colors.onPrimary }]}>Active</Text>
          </View>
        )}
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
    padding: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
});
