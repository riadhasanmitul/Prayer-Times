import React, { useCallback, useState } from 'react';
import { View, ScrollView, RefreshControl, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button } from 'react-native-paper';
import { NextPrayerCard, PrayerCard, ActiveBanner, SkeletonLoader } from '../components';
import { useAppTheme, PrayerColors } from '../theme';
import { spacing, typography } from '../theme';
import type { MainTabScreenProps } from '../types';

export const HomeScreen: React.FC<MainTabScreenProps<'Home'>> = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  
  // Mock data for UI layout
  const isLoading = false;
  const error = null;
  const [refreshing, setRefreshing] = useState(false);
  
  const dailyTimes = {
    Fajr: '05:30 AM',
    Dhuhr: '01:15 PM',
    Asr: '04:45 PM',
    Maghrib: '07:30 PM',
    Isha: '09:00 PM',
  };
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <View style={styles.header}>
        <Text style={[typography.headlineMedium, { color: colors.onBackground }]}>Prayer Times</Text>
        <Text style={[typography.bodyLarge, { color: colors.onSurfaceVariant }]}>New York, NY • Today</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ActiveBanner 
          prayerName="Dhuhr" 
          profileName="Work Mode" 
          remainingMinutes={15} 
          onRestore={() => {}} 
        />
        
        <NextPrayerCard 
          prayerName="Asr" 
          prayerTime="04:45 PM" 
          countdown="02:15:30" 
          color={PrayerColors.Asr} 
        />
        
        {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => (
          <PrayerCard
            key={prayer}
            prayerName={prayer}
            time={dailyTimes[prayer as keyof typeof dailyTimes]}
            enabled={true}
            isActive={prayer === 'Dhuhr'}
            isNext={prayer === 'Asr'}
            onToggle={() => {}}
            onPress={() => navigation.navigate('PrayerScheduleDetail', { prayerName: prayer })}
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl * 2,
  },
});
