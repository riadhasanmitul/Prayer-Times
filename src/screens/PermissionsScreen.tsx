import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PermissionItem } from '../components';
import { useAppTheme, spacing, typography } from '../theme';

export const PermissionsScreen: React.FC<any> = ({ navigation }) => {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Icon name="mosque" size={64} color={colors.primary} />
          <Text style={[typography.headlineMedium, { color: colors.onBackground, textAlign: 'center', marginTop: spacing.md }]}>
            Prayer Silencer needs your permission
          </Text>
          <Text style={[typography.bodyLarge, { color: colors.onSurfaceVariant, textAlign: 'center', marginTop: spacing.sm }]}>
            To automatically silence your phone during prayer
          </Text>
        </View>

        <View style={styles.list}>
          <PermissionItem
            icon="map-marker"
            title="Location"
            description="Required to calculate accurate prayer times."
            status="granted"
            onRequest={() => {}}
          />
          <PermissionItem
            icon="bell-cancel"
            title="Do Not Disturb Access"
            description="Required to silence your phone."
            status="denied"
            onRequest={() => {}}
          />
        </View>

        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
          Continue
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  list: {
    marginBottom: spacing.xl,
  },
  button: {
    marginTop: 'auto',
  },
});
