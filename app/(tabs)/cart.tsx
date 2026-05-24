import { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AuthButton } from '@/components/ui/auth-button';
import { useCart, type CartItem } from '@/contexts/cart';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFormatPrice } from '@/hooks/use-format-price';

const fallbackImage = require('@/assets/images/icon.png');

function CartRow({ item }: { item: CartItem }) {
  const { removeFromCart, updateQuantity } = useCart();
  const formatPrice = useFormatPrice();
  const primary = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'inputBorder');
  const errorColor = useThemeColor({}, 'error');
  const iconColor = useThemeColor({}, 'icon');

  const discountedPrice =
    item.product.price * (1 - item.product.discount / 100);
  const atMin = item.quantity === 1;
  const atMax = item.quantity >= item.product.stock;

  return (
    <View style={[styles.row, { borderColor }]}>
      <Image
        source={item.product.image_url ? { uri: item.product.image_url } : fallbackImage}
        placeholder={fallbackImage}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />

      <View style={styles.rowContent}>
        <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.rowName}>
          {item.product.name}
        </ThemedText>
        <ThemedText style={[styles.rowPrice, { color: primary }]}>
          {formatPrice(discountedPrice)} each
        </ThemedText>

        <View style={styles.rowFooter}>
          <View style={[styles.stepper, { borderColor }]}>
            <Pressable
              onPress={() => updateQuantity(item.product.id, -1)}
              style={[styles.stepBtn, atMin && styles.stepDimmed]}
              hitSlop={8}
            >
              <Ionicons name="remove" size={16} color={iconColor} />
            </Pressable>
            <ThemedText style={styles.stepQty}>{item.quantity}</ThemedText>
            <Pressable
              onPress={() => updateQuantity(item.product.id, +1)}
              style={[styles.stepBtn, atMax && styles.stepDimmed]}
              hitSlop={8}
            >
              <Ionicons name="add" size={16} color={iconColor} />
            </Pressable>
          </View>

          <Pressable onPress={() => removeFromCart(item.product.id)} hitSlop={8}>
            <Ionicons name="trash-outline" size={20} color={errorColor} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function EmptyCart() {
  const iconColor = useThemeColor({}, 'icon');
  return (
    <View style={styles.empty}>
      <Ionicons name="cart-outline" size={64} color={iconColor} />
      <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
        Your cart is empty
      </ThemedText>
      <ThemedText style={[styles.emptyHint, { color: iconColor }]}>
        Add products from the home screen
      </ThemedText>
    </View>
  );
}

export default function CartScreen() {
  const { items, totalPrice } = useCart();
  const formatPrice = useFormatPrice();
  const insets = useSafeAreaInsets();
  const borderColor = useThemeColor({}, 'inputBorder');
  const primary = useThemeColor({}, 'primary');

  const renderItem = useCallback(
    ({ item }: { item: CartItem }) => <CartRow item={item} />,
    []
  );

  const keyExtractor = useCallback((item: CartItem) => item.product.id, []);

  return (
    <ThemedView style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <ThemedText type="title">Cart</ThemedText>
      </View>

      <FlatList
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={EmptyCart}
        contentContainerStyle={[
          styles.list,
          items.length === 0 && styles.listEmpty,
        ]}
      />

      {items.length > 0 && (
        <View style={[styles.footer, { borderColor, paddingBottom: insets.bottom + 8 }]}>
          <View style={styles.totalRow}>
            <ThemedText type="defaultSemiBold" style={styles.totalLabel}>
              Total
            </ThemedText>
            <ThemedText style={[styles.totalValue, { color: primary }]}>
              {formatPrice(totalPrice)}
            </ThemedText>
          </View>
          <AuthButton
            title="Proceed to Checkout"
            onPress={() => router.push('/checkout')}
          />
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  listEmpty: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: 80,
    height: 80,
  },
  rowContent: {
    flex: 1,
    padding: 10,
    gap: 4,
    justifyContent: 'space-between',
  },
  rowName: {
    fontSize: 14,
  },
  rowPrice: {
    fontSize: 13,
    fontWeight: '600',
  },
  rowFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  stepBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stepDimmed: {
    opacity: 0.35,
  },
  stepQty: {
    minWidth: 24,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
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
  },
});
