import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, FAB } from 'react-native-paper';
import { ProfileCard } from '../components';
import { useAppTheme, spacing, typography } from '../theme';
import type { MainTabScreenProps } from '../types';

export const ProfilesScreen: React.FC<MainTabScreenProps<'Profiles'>> = ({ navigation }) => {
  const { colors } = useAppTheme();
  
  const profiles = [
    { id: '1', name: 'Work', icon: 'briefcase', enabledPrayersCount: 5 },
    { id: '2', name: 'Home', icon: 'home', enabledPrayersCount: 3 },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[typography.headlineMedium, { color: colors.onBackground }]}>Profiles</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.list}>
        {profiles.map((profile, index) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            isActive={index === 0}
            onPress={() => {}}
            onLongPress={() => navigation.navigate('ProfileEditor', { profileId: profile.id })}
          />
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        color={colors.onPrimary}
        onPress={() => navigation.navigate('ProfileEditor', {})}
      />
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
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
  },
});
