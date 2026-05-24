import { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProductCard } from '@/components/ui/product-card';
import { useWishlist } from '@/hooks/use-wishlist';
import { useThemeColor } from '@/hooks/use-theme-color';
import { type Product } from '@/hooks/use-products';

function EmptyWishlist() {
  const iconColor = useThemeColor({}, 'icon');
  return (
    <View style={styles.empty}>
      <Ionicons name="heart-outline" size={64} color={iconColor} />
      <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
        No saved items
      </ThemedText>
      <ThemedText style={[styles.emptyHint, { color: iconColor }]}>
        Tap the heart on any product to save it here
      </ThemedText>
    </View>
  );
}

export default function WishlistScreen() {
  const { items } = useWishlist();

  const renderItem = useCallback(
    ({ item }: { item: Product }) => <ProductCard product={item} />,
    []
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  return (
    <ThemedView style={styles.root}>
      <FlatList
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={EmptyWishlist}
        contentContainerStyle={[
          styles.list,
          items.length === 0 && styles.listEmpty,
        ]}
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
    gap: 12,
  },
  listEmpty: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 60,
  },
  emptyTitle: {
    fontSize: 18,
  },
  emptyHint: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
