import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing, typography } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<Props> = ({ title, subtitle, actionLabel, onAction }) => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={[typography.titleLarge, { color: colors.onSurface }]}>{title}</Text>
        {subtitle && (
          <Text style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}>{subtitle}</Text>
        )}
      </View>
      {actionLabel && onAction && (
        <Button mode="text" onPress={onAction} textColor={colors.primary}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
});
