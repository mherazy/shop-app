import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { type Product } from '@/hooks/use-products';

const fallbackImage = require('@/assets/images/icon.png');

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const borderColor = useThemeColor({}, 'inputBorder');
  const primary = useThemeColor({}, 'primary');
  const errorColor = useThemeColor({}, 'error');
  const iconColor = useThemeColor({}, 'icon');

  const hasDiscount = product.discount > 0;
  const discountedPrice = product.price * (1 - product.discount / 100);
  const inStock = product.stock > 0;

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
          <ThemedText type="defaultSemiBold" numberOfLines={2} style={styles.name}>
            {product.name}
          </ThemedText>
          <View style={[styles.categoryPill, { borderColor: primary }]}>
            <ThemedText style={[styles.categoryLabel, { color: primary }]}>
              {product.category}
            </ThemedText>
          </View>
        </View>

        <ThemedText numberOfLines={2} style={[styles.description, { color: iconColor }]}>
          {product.description ?? ''}
        </ThemedText>

        <View style={styles.bottomRow}>
          <View style={styles.priceRow}>
            {hasDiscount ? (
              <>
                <ThemedText style={[styles.originalPrice, { color: iconColor }]}>
                  ${product.price.toFixed(2)}
                </ThemedText>
                <ThemedText style={[styles.discountedPrice, { color: primary }]}>
                  ${discountedPrice.toFixed(2)}
                </ThemedText>
              </>
            ) : (
              <ThemedText type="defaultSemiBold" style={styles.price}>
                ${product.price.toFixed(2)}
              </ThemedText>
            )}
          </View>

          <ThemedText style={[styles.stock, { color: inStock ? '#16a34a' : errorColor }]}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </ThemedText>
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
});
