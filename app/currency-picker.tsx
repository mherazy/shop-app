import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useCurrency, CURRENCIES, type CurrencyOption } from '@/contexts/currency';
import { useThemeColor } from '@/hooks/use-theme-color';

function CurrencyRow({ item }: { item: CurrencyOption }) {
  const { currency, setCurrency } = useCurrency();
  const borderColor = useThemeColor({}, 'inputBorder');
  const primary = useThemeColor({}, 'primary');
  const isSelected = currency === item.code;

  return (
    <Pressable
      onPress={() => setCurrency(item.code)}
      style={({ pressed }) => [
        styles.row,
        { borderColor },
        pressed && styles.rowPressed,
      ]}
    >
      <View style={styles.rowLeft}>
        <ThemedText type="defaultSemiBold" style={styles.code}>
          {item.code}
        </ThemedText>
        <ThemedText style={styles.name}>{item.name}</ThemedText>
      </View>
      {isSelected && (
        <Ionicons name="checkmark-circle" size={22} color={primary} />
      )}
    </Pressable>
  );
}

export default function CurrencyPickerScreen() {
  return (
    <ThemedView style={styles.root}>
      <FlatList
        data={CURRENCIES}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => <CurrencyRow item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  list: {
    padding: 16,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowPressed: {
    opacity: 0.5,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  code: {
    fontSize: 15,
    fontFamily: 'monospace',
    minWidth: 44,
  },
  name: {
    fontSize: 15,
  },
});
