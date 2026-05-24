import { useCallback } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useOrders, type Order } from '@/hooks/use-orders';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFormatPrice } from '@/hooks/use-format-price';
import { useCurrency } from '@/contexts/currency';
import { shareInvoice } from '@/utils/generate-invoice';

const fallbackImage = require('@/assets/images/icon.png');

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function StatusBadge({ status }: { status: string }) {
  const primary = useThemeColor({}, 'primary');
  const isPending = status === 'pending';
  const bg = isPending ? '#f59e0b' : primary;
  const label = isPending ? 'Pending' : 'Completed';

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <ThemedText style={styles.badgeText}>{label}</ThemedText>
    </View>
  );
}

function OrderCard({ order }: { order: Order }) {
  const formatPrice = useFormatPrice();
  const { currency } = useCurrency();
  const borderColor = useThemeColor({}, 'inputBorder');
  const iconColor = useThemeColor({}, 'icon');
  const primary = useThemeColor({}, 'primary');

  return (
    <View style={[styles.card, { borderColor }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <ThemedText type="defaultSemiBold" style={styles.orderId} numberOfLines={1}>
            #{order.id.slice(0, 8).toUpperCase()}
          </ThemedText>
          <ThemedText style={[styles.orderDate, { color: iconColor }]}>
            {formatDate(order.created_at)}
          </ThemedText>
        </View>
        <StatusBadge status={order.status} />
      </View>

      <View style={[styles.divider, { borderColor }]} />

      <View style={styles.itemsList}>
        {order.items.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Image
              source={item.imageUrl ? { uri: item.imageUrl } : fallbackImage}
              placeholder={fallbackImage}
              style={styles.itemImage}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.itemInfo}>
              <ThemedText numberOfLines={1} style={styles.itemName}>
                {item.name}
              </ThemedText>
              <ThemedText style={[styles.itemMeta, { color: iconColor }]}>
                {item.quantity} × {formatPrice(item.price)}
              </ThemedText>
            </View>
            <ThemedText style={[styles.itemTotal, { color: primary }]}>
              {formatPrice(item.quantity * item.price)}
            </ThemedText>
          </View>
        ))}
      </View>

      <View style={[styles.divider, { borderColor }]} />

      <View style={styles.cardFooter}>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={14} color={iconColor} />
          <ThemedText numberOfLines={2} style={[styles.address, { color: iconColor }]}>
            {order.delivery_address}
          </ThemedText>
        </View>
        <View style={styles.totalRow}>
          <ThemedText type="defaultSemiBold" style={styles.totalLabel}>
            Total
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={[styles.totalValue, { color: primary }]}>
            {formatPrice(order.total)}
          </ThemedText>
        </View>
        <Pressable
          style={({ pressed }) => [styles.invoiceBtn, { borderColor: primary, opacity: pressed ? 0.6 : 1 }]}
          onPress={() => shareInvoice(order, currency).catch(() => {})}
        >
          <Ionicons name="document-text-outline" size={14} color={primary} />
          <ThemedText style={[styles.invoiceBtnText, { color: primary }]}>Invoice</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

function EmptyOrders() {
  const iconColor = useThemeColor({}, 'icon');
  return (
    <View style={styles.empty}>
      <Ionicons name="receipt-outline" size={64} color={iconColor} />
      <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
        No orders yet
      </ThemedText>
      <ThemedText style={[styles.emptyHint, { color: iconColor }]}>
        Your completed orders will appear here
      </ThemedText>
    </View>
  );
}

export default function OrdersScreen() {
  const { orders, loading } = useOrders();
  const primary = useThemeColor({}, 'primary');

  const renderItem = useCallback(
    ({ item }: { item: Order }) => <OrderCard order={item} />,
    []
  );

  const keyExtractor = useCallback((item: Order) => item.id, []);

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color={primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.root}>
      <FlatList
        data={orders}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={EmptyOrders}
        contentContainerStyle={[
          styles.list,
          orders.length === 0 && styles.listEmpty,
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
    gap: 14,
  },
  listEmpty: {
    flexGrow: 1,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 14,
  },
  cardHeaderLeft: {
    gap: 2,
    flex: 1,
    marginRight: 10,
  },
  orderId: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  orderDate: {
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  divider: {
    borderTopWidth: 1,
    marginHorizontal: 14,
  },
  itemsList: {
    padding: 14,
    gap: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 13,
  },
  itemMeta: {
    fontSize: 12,
  },
  itemTotal: {
    fontSize: 13,
    fontWeight: '600',
  },
  cardFooter: {
    padding: 14,
    gap: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  address: {
    fontSize: 12,
    flex: 1,
    lineHeight: 17,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 16,
  },
  invoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 2,
  },
  invoiceBtnText: {
    fontSize: 13,
    fontWeight: '600',
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
