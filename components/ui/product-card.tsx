import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { type Product } from '@/hooks/use-products';
import { useFormatPrice } from '@/hooks/use-format-price';

const fallbackImage = require('@/assets/images/icon.png');

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const borderColor = useThemeColor({}, 'inputBorder');
  const primary = useThemeColor({}, 'primary');
  const errorColor = useThemeColor({}, 'error');
  const iconColor = useThemeColor({}, 'icon');
  const { addToCart, items } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const formatPrice = useFormatPrice();
  const wishlisted = isWishlisted(product.id);

  const hasDiscount = product.discount > 0;
  const discountedPrice = product.price * (1 - product.discount / 100);
  const inStock = product.stock > 0;

  const qtyInCart = items.find((i) => i.product.id === product.id)?.quantity ?? 0;
  const atStockCap = qtyInCart >= product.stock;

  return (
    <ThemedView style={[styles.card, { borderColor }]}>
      <Image
        source={product.image_url ? { uri: product.image_url } : fallbackImage}
        placeholder={fallbackImage}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.topRowMain}>
            <ThemedText type="defaultSemiBold" numberOfLines={2} style={styles.name}>
              {product.name}
            </ThemedText>
            <View style={[styles.categoryPill, { borderColor: primary }]}>
              <ThemedText style={[styles.categoryLabel, { color: primary }]}>
                {product.category}
              </ThemedText>
            </View>
          </View>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleWishlist(product);
            }}
            hitSlop={8}
          >
            <Ionicons
              name={wishlisted ? 'heart' : 'heart-outline'}
              size={20}
              color={wishlisted ? '#ef4444' : iconColor}
            />
          </Pressable>
        </View>

        <ThemedText numberOfLines={2} style={[styles.description, { color: iconColor }]}>
          {product.description ?? ''}
        </ThemedText>

        <View style={styles.bottomRow}>
          <View style={styles.priceRow}>
            {hasDiscount ? (
              <>
                <ThemedText style={[styles.originalPrice, { color: iconColor }]}>
                  {formatPrice(product.price)}
                </ThemedText>
                <ThemedText style={[styles.discountedPrice, { color: primary }]}>
                  {formatPrice(discountedPrice)}
                </ThemedText>
              </>
            ) : (
              <ThemedText type="defaultSemiBold" style={styles.price}>
                {formatPrice(product.price)}
              </ThemedText>
            )}
          </View>

          {inStock ? (
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                addToCart(product);
              }}
              disabled={atStockCap}
              style={({ pressed }) => [
                styles.cartBtn,
                { backgroundColor: primary },
                (pressed || atStockCap) && styles.dimmed,
              ]}
              hitSlop={8}
            >
              {qtyInCart > 0 ? (
                <ThemedText style={styles.cartBadge}>{qtyInCart}</ThemedText>
              ) : (
                <Ionicons name="cart-outline" size={14} color="#fff" />
              )}
            </Pressable>
          ) : (
            <ThemedText style={[styles.stock, { color: errorColor }]}>
              Out of Stock
            </ThemedText>
          )}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: 110,
    height: 110,
  },
  content: {
    flex: 1,
    padding: 12,
    gap: 6,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  topRowMain: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 15,
    lineHeight: 20,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    lineHeight: 17,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontSize: 15,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 15,
    fontWeight: '700',
  },
  stock: {
    fontSize: 11,
    fontWeight: '600',
  },
  cartBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  dimmed: {
    opacity: 0.4,
  },
});
