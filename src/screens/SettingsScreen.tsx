import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, List, Divider } from 'react-native-paper';
import { useAppTheme, spacing, typography } from '../theme';

export const SettingsScreen: React.FC<any> = ({ navigation }) => {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[typography.headlineMedium, { color: colors.onBackground }]}>Settings</Text>
      </View>
      
      <ScrollView>
        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          <List.Item title="Theme" description="System Default" left={props => <List.Icon {...props} icon="palette" />} />
        </List.Section>
        <Divider />
        <List.Section>
          <List.Subheader>Prayer</List.Subheader>
          <List.Item title="Calculation Method" description="Muslim World League" left={props => <List.Icon {...props} icon="calculator" />} />
          <List.Item title="Madhab" description="Shafi" left={props => <List.Icon {...props} icon="book-open" />} />
        </List.Section>
        <Divider />
        <List.Section>
          <List.Subheader>App</List.Subheader>
          <List.Item title="Permissions" onPress={() => navigation.navigate('Permissions')} left={props => <List.Icon {...props} icon="shield-check" />} />
          <List.Item title="About" onPress={() => navigation.navigate('About')} left={props => <List.Icon {...props} icon="information" />} />
        </List.Section>
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
});
