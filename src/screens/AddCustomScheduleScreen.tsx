import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { useAppTheme, spacing, typography } from '../theme';

export const AddCustomScheduleScreen: React.FC<any> = ({ navigation }) => {
  const { colors } = useAppTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.headlineMedium, { color: colors.onBackground, marginBottom: spacing.lg }]}>Add Schedule</Text>
        
        <TextInput
          label="Window Name"
          mode="outlined"
          style={styles.input}
        />
        
        <SegmentedButtons
          value="offset"
          onValueChange={() => {}}
          buttons={[
            { value: 'offset', label: 'Offset' },
            { value: 'exact', label: 'Exact Time' },
          ]}
          style={styles.input}
        />
        
        <View style={styles.preview}>
          <Text style={[typography.titleMedium, { color: colors.onSurface }]}>Preview</Text>
          <Text style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}>12:15 PM - 01:00 PM</Text>
        </View>

        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
          Save
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
  input: {
    marginBottom: spacing.md,
  },
  preview: {
    marginVertical: spacing.lg,
    padding: spacing.md,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  button: {
    marginTop: spacing.lg,
  },
});
