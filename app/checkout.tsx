import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AuthInput } from '@/components/ui/auth-input';
import { AuthButton } from '@/components/ui/auth-button';
import { useCart } from '@/hooks/use-cart';
import { useThemeColor } from '@/hooks/use-theme-color';
import { supabase } from '@/utils/supabase';
import { useFormatPrice } from '@/hooks/use-format-price';

export default function CheckoutScreen() {
  const { items, totalPrice, clearCart } = useCart();
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = useFormatPrice();
  const primary = useThemeColor({}, 'primary');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'inputBorder');
  const iconColor = useThemeColor({}, 'icon');
  const errorColor = useThemeColor({}, 'error');
  const placeholderColor = useThemeColor({}, 'icon');
  const textColor = useThemeColor({}, 'text');

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      setError('Delivery address is required.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const productIds = items.map((i) => i.product.id);
    const { data: freshProducts, error: fetchError } = await supabase
      .from('products')
      .select('id, stock')
      .in('id', productIds);

    if (fetchError || !freshProducts) {
      setError('Failed to verify stock. Please try again.');
      setSubmitting(false);
      return;
    }

    const stockMap = new Map(freshProducts.map((p: { id: string; stock: number }) => [p.id, p.stock]));

    for (const item of items) {
      const liveStock = stockMap.get(item.product.id) ?? 0;
      if (item.quantity > liveStock) {
        setError(
          `"${item.product.name}" only has ${liveStock} unit(s) available. Please update your cart.`
        );
        setSubmitting(false);
        return;
      }
    }

    for (const item of items) {
      const newStock = (stockMap.get(item.product.id) ?? 0) - item.quantity;
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', item.product.id);

      if (updateError) {
        setError('Failed to process order. Please try again.');
        setSubmitting(false);
        return;
      }
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user.id;

    const orderItems = items.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: parseFloat(
        (item.product.price * (1 - item.product.discount / 100)).toFixed(2)
      ),
      quantity: item.quantity,
      imageUrl: item.product.image_url,
    }));

    const { error: orderError } = await supabase.from('orders').insert({
      user_id: userId,
      items: orderItems,
      total: parseFloat(totalPrice.toFixed(2)),
      delivery_address: address.trim(),
      notes: notes.trim() || null,
      status: 'pending',
    });

    if (orderError) {
      setError('Failed to place order. Please try again.');
      setSubmitting(false);
      return;
    }

    clearCart();
    router.replace('/(tabs)' as any);
    Alert.alert(
      'Order Placed!',
      'Your order has been placed successfully. We will contact you shortly.'
    );
  };

  return (
    <ThemedView style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Order Summary
          </ThemedText>

          {items.map((item) => {
            const lineTotal = item.product.price * (1 - item.product.discount / 100) * item.quantity;
            return (
              <View key={item.product.id} style={styles.summaryRow}>
                <ThemedText numberOfLines={1} style={[styles.summaryName, { color: iconColor }]}>
                  {item.product.name} × {item.quantity}
                </ThemedText>
                <ThemedText style={styles.summaryPrice}>
                  {formatPrice(lineTotal)}
                </ThemedText>
              </View>
            );
          })}

          <View style={[styles.divider, { borderColor }]} />

          <View style={styles.totalRow}>
            <ThemedText type="defaultSemiBold" style={styles.totalLabel}>
              Total
            </ThemedText>
            <ThemedText style={[styles.totalValue, { color: primary }]}>
              {formatPrice(totalPrice)}
            </ThemedText>
          </View>

          <View style={[styles.divider, { borderColor }]} />

          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Delivery Details
          </ThemedText>

          <AuthInput
            label="Delivery Address *"
            value={address}
            onChangeText={setAddress}
            placeholder="Street, City, Zip"
            autoCapitalize="words"
            autoComplete="street-address"
          />

          <View style={styles.fieldContainer}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Notes (optional)
            </ThemedText>
            <TextInput
              style={[styles.textArea, { color: textColor, backgroundColor, borderColor }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any special instructions…"
              placeholderTextColor={placeholderColor}
              multiline
              numberOfLines={3}
              autoCapitalize="sentences"
              autoCorrect={false}
              textAlignVertical="top"
            />
          </View>

          <View style={[styles.divider, { borderColor }]} />

          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Payment
          </ThemedText>

          <View style={[styles.paymentBox, { borderColor, backgroundColor }]}>
            <Ionicons name="cash-outline" size={24} color={primary} />
            <View style={styles.paymentText}>
              <ThemedText type="defaultSemiBold" style={styles.paymentTitle}>
                Cash on Delivery
              </ThemedText>
              <ThemedText style={[styles.paymentSub, { color: iconColor }]}>
                Pay when your order arrives
              </ThemedText>
            </View>
          </View>

          {error ? (
            <ThemedText style={[styles.error, { color: errorColor }]}>
              {error}
            </ThemedText>
          ) : null}

          <AuthButton
            title="Place Order"
            onPress={handlePlaceOrder}
            loading={submitting}
            disabled={!address.trim() || items.length === 0}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryName: {
    flex: 1,
    fontSize: 14,
    marginRight: 8,
  },
  summaryPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    borderTopWidth: 1,
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
    minHeight: 90,
  },
  paymentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  paymentText: {
    gap: 2,
  },
  paymentTitle: {
    fontSize: 15,
  },
  paymentSub: {
    fontSize: 13,
  },
  error: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
});
