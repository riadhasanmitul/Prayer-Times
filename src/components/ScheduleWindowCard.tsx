import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton, Switch } from 'react-native-paper';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing, borderRadius, typography } from '../theme';

interface ScheduleWindow {
  id: string;
  name: string;
  type: 'offset' | 'exact';
  enabled: boolean;
  startMinutes?: number;
  endMinutes?: number;
  startTime?: string;
  endTime?: string;
}

interface Props {
  window: ScheduleWindow;
  prayerTime: Date;
  onToggle: (enabled: boolean) => void;
  onDelete: () => void;
  onEdit: () => void;
}

export const ScheduleWindowCard: React.FC<Props> = ({ window, prayerTime, onToggle, onDelete, onEdit }) => {
  const { colors } = useAppTheme();

  let timeString = '';
  if (window.type === 'offset') {
    timeString = `${window.startMinutes}m to +${window.endMinutes}m`;
  } else {
    timeString = `${window.startTime} - ${window.endTime}`;
  }

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]} onPress={onEdit}>
      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={[typography.titleMedium, { color: colors.onSurface }]}>{window.name}</Text>
          <View style={[styles.badge, { backgroundColor: colors.secondaryContainer }]}>
            <Text style={[typography.labelSmall, { color: colors.onSecondaryContainer }]}>{window.type}</Text>
          </View>
        </View>
        <Text style={[typography.bodyMedium, { color: colors.onSurfaceVariant, marginTop: spacing.xs }]}>
          {timeString}
        </Text>
      </View>
      <View style={styles.actions}>
        <Switch value={window.enabled} onValueChange={onToggle} color={colors.primary} />
        <IconButton icon="delete" iconColor={colors.error} onPress={onDelete} size={20} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
