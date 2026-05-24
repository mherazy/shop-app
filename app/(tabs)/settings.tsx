import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AuthButton } from '@/components/ui/auth-button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useThemePreference, type ThemePreference } from '@/contexts/theme-preference';
import { useAuth } from '@/hooks/use-auth';

const THEME_OPTIONS: { label: string; value: ThemePreference }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Device', value: 'system' },
  { label: 'Dark', value: 'dark' },
];

export default function SettingsScreen() {
  const { preference, setPreference } = useThemePreference();
  const { signOut, loading } = useAuth();
  const router = useRouter();
  const tint = useThemeColor({}, 'primary');
  const inputBorder = useThemeColor({}, 'inputBorder');
  const icon = useThemeColor({}, 'icon');

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.pageTitle}>
        Settings
      </ThemedText>

      <View style={styles.section}>
        <ThemedText style={[styles.sectionLabel, { color: icon }]}>
          APPEARANCE
        </ThemedText>

        <View style={[styles.segmentedControl, { borderColor: inputBorder }]}>
          {THEME_OPTIONS.map(({ label, value }) => {
            const isSelected = preference === value;
            return (
              <Pressable
                key={value}
                onPress={() => setPreference(value)}
                style={({ pressed }) => [
                  styles.segment,
                  isSelected && { backgroundColor: tint },
                  pressed && !isSelected && styles.segmentPressed,
                ]}
              >
                <ThemedText
                  style={[
                    styles.segmentLabel,
                    isSelected && styles.segmentLabelSelected,
                  ]}
                >
                  {label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <AuthButton
        title="Sign Out"
        onPress={handleSignOut}
        loading={loading}
        variant="ghost"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  pageTitle: {
    marginBottom: 36,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentPressed: {
    opacity: 0.5,
  },
  segmentLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  segmentLabelSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});
