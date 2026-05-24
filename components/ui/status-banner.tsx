import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type StatusBannerProps = {
  isOnline: boolean;
  isLowBattery: boolean;
};

export function StatusBanner({ isOnline, isLowBattery }: StatusBannerProps) {
  if (isOnline && !isLowBattery) return null;

  const offline = !isOnline;
  const backgroundColor = offline ? '#1f2937' : '#78350f';
  const icon = offline ? 'cloud-offline-outline' : 'battery-dead-outline';
  const message = offline
    ? 'Offline - showing cached products'
    : 'Battery below 20% - showing cached products';

  return (
    <View style={[styles.banner, { backgroundColor }]}>
      <Ionicons name={icon} size={15} color="#fff" />
      <ThemedText style={styles.text}>{message}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  text: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
});
