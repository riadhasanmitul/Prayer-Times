import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing, borderRadius, typography } from '../theme';

type Status = 'granted' | 'denied' | 'blocked' | 'unknown';

interface Props {
  icon: string;
  title: string;
  description: string;
  status: Status;
  onRequest: () => void;
}

export const PermissionItem: React.FC<Props> = ({ icon, title, description, status, onRequest }) => {
  const { colors } = useAppTheme();

  const getStatusColor = () => {
    switch (status) {
      case 'granted': return '#4CAF50';
      case 'denied': return colors.error;
      case 'blocked': return colors.error;
      default: return colors.outline;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
      <Icon name={icon} size={32} color={colors.primary} style={styles.icon} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[typography.titleMedium, { color: colors.onSurface }]}>{title}</Text>
          <View style={[styles.badge, { backgroundColor: getStatusColor() }]}>
            <Text style={[typography.labelSmall, { color: '#FFF' }]}>{status}</Text>
          </View>
        </View>
        <Text style={[typography.bodyMedium, { color: colors.onSurfaceVariant, marginTop: spacing.xs }]}>
          {description}
        </Text>
        {status !== 'granted' && (
          <Button mode="outlined" onPress={onRequest} style={styles.button} textColor={colors.primary}>
            Request
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  icon: {
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  button: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
});
