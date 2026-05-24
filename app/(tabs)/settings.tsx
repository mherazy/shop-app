import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AuthButton } from '@/components/ui/auth-button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useThemePreference, type ThemePreference } from '@/contexts/theme-preference';
import { useCurrency } from '@/contexts/currency';
import { useAuth } from '@/hooks/use-auth';

const THEME_OPTIONS: { label: string; value: ThemePreference }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Device', value: 'system' },
  { label: 'Dark', value: 'dark' },
];

export default function SettingsScreen() {
  const { preference, setPreference } = useThemePreference();
  const { currency } = useCurrency();
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

      <View style={styles.section}>
        <ThemedText style={[styles.sectionLabel, { color: icon }]}>
          REGIONAL
        </ThemedText>
        <Pressable
          onPress={() => router.push('/currency-picker')}
          style={({ pressed }) => [
            styles.menuRow,
            { borderColor: inputBorder },
            pressed && styles.menuRowPressed,
          ]}
        >
          <View style={styles.menuRowLeft}>
            <Ionicons name="cash-outline" size={20} color={tint} />
            <ThemedText style={styles.menuRowLabel}>Currency</ThemedText>
          </View>
          <View style={styles.menuRowRight}>
            <ThemedText style={[styles.menuRowValue, { color: icon }]}>
              {currency}
            </ThemedText>
            <Ionicons name="chevron-forward" size={18} color={icon} />
          </View>
        </Pressable>
      </View>

      <View style={styles.section}>
        <ThemedText style={[styles.sectionLabel, { color: icon }]}>
          ACCOUNT
        </ThemedText>
        <Pressable
          onPress={() => router.push('/orders')}
          style={({ pressed }) => [
            styles.menuRow,
            { borderColor: inputBorder },
            pressed && styles.menuRowPressed,
          ]}
        >
          <View style={styles.menuRowLeft}>
            <Ionicons name="receipt-outline" size={20} color={tint} />
            <ThemedText style={styles.menuRowLabel}>Order History</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={18} color={icon} />
        </Pressable>

        <Pressable
          onPress={() => router.push('/wishlist')}
          style={({ pressed }) => [
            styles.menuRow,
            styles.menuRowSpaced,
            { borderColor: inputBorder },
            pressed && styles.menuRowPressed,
          ]}
        >
          <View style={styles.menuRowLeft}>
            <Ionicons name="heart-outline" size={20} color={tint} />
            <ThemedText style={styles.menuRowLabel}>Wishlist</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={18} color={icon} />
        </Pressable>
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
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  menuRowPressed: {
    opacity: 0.5,
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuRowLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  menuRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  menuRowValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  menuRowSpaced: {
    marginTop: 10,
  },
});
