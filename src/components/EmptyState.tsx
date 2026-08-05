import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing, typography } from '../theme';

interface Props {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<Props> = ({ icon, title, description, actionLabel, onAction }) => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <Icon name={icon} size={80} color={colors.outlineVariant} style={styles.icon} />
      <Text style={[typography.titleLarge, { color: colors.onSurface, marginBottom: spacing.sm, textAlign: 'center' }]}>
        {title}
      </Text>
      <Text style={[typography.bodyMedium, { color: colors.onSurfaceVariant, textAlign: 'center', marginBottom: spacing.lg }]}>
        {description}
      </Text>
      {actionLabel && onAction && (
        <Button mode="contained" onPress={onAction} buttonColor={colors.primary} textColor={colors.onPrimary}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  icon: {
    marginBottom: spacing.lg,
  },
});
