import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button, RadioButton } from 'react-native-paper';
import { useAppTheme, spacing, typography } from '../theme';

export const ProfileEditorScreen: React.FC<any> = ({ navigation }) => {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.headlineMedium, { color: colors.onBackground, marginBottom: spacing.lg }]}>Edit Profile</Text>
        
        <TextInput
          label="Profile Name"
          mode="outlined"
          style={styles.input}
        />
        
        <Text style={[typography.titleMedium, { color: colors.onSurface, marginTop: spacing.md }]}>Ringer Mode</Text>
        <RadioButton.Group onValueChange={() => {}} value="silent">
          <RadioButton.Item label="Silent" value="silent" />
          <RadioButton.Item label="Vibrate" value="vibrate" />
        </RadioButton.Group>

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
  button: {
    marginTop: spacing.xl,
  },
});
