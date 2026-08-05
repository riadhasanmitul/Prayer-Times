import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, FAB, IconButton, Switch } from 'react-native-paper';
import { ScheduleWindowCard, EmptyState } from '../components';
import { useAppTheme, spacing, typography, PrayerColors } from '../theme';
import type { RootStackParamList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'PrayerScheduleDetail'>;

export const PrayerScheduleDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { prayerName } = route.params;
  const { colors } = useAppTheme();
  
  const windows = [
    { id: '1', name: 'Congregation', type: 'offset' as const, enabled: true, startMinutes: -15, endMinutes: 30 },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        <Text style={[typography.headlineMedium, { color: colors.onBackground, flex: 1 }]}>{prayerName}</Text>
        <Switch value={true} onValueChange={() => {}} />
      </View>
      
      <ScrollView contentContainerStyle={styles.list}>
        {windows.length > 0 ? (
          windows.map(w => (
            <ScheduleWindowCard
              key={w.id}
              window={w}
              prayerTime={new Date()}
              onToggle={() => {}}
              onDelete={() => {}}
              onEdit={() => navigation.navigate('AddCustomSchedule', { prayerName })}
            />
          ))
        ) : (
          <EmptyState
            icon="calendar-blank"
            title="No Schedules"
            description="Add a window to silence your phone."
          />
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        color={colors.onPrimary}
        onPress={() => navigation.navigate('AddCustomSchedule', { prayerName })}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
