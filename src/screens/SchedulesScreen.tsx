import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Chip, List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppTheme, spacing, typography } from '../theme';
import type { MainTabScreenProps } from '../types';

export const SchedulesScreen: React.FC<MainTabScreenProps<'Schedules'>> = ({ navigation }) => {
  const { colors } = useAppTheme();
  
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[typography.headlineMedium, { color: colors.onBackground }]}>Schedules</Text>
      </View>
      
      <View style={styles.profileSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip selected style={styles.chip} mode="outlined">Work</Chip>
          <Chip style={styles.chip} mode="outlined">Home</Chip>
          <Chip style={styles.chip} mode="outlined">Weekend</Chip>
        </ScrollView>
      </View>
      
      <ScrollView contentContainerStyle={styles.list}>
        {prayers.map((prayer) => (
          <List.Item
            key={prayer}
            title={prayer}
            description="2 windows active"
            left={props => <List.Icon {...props} icon="clock-outline" color={colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('PrayerScheduleDetail', { prayerName: prayer })}
            style={[styles.listItem, { backgroundColor: colors.surface }]}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
  },
  profileSelector: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  chip: {
    marginRight: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  listItem: {
    marginBottom: spacing.sm,
    borderRadius: 12,
  },
});
