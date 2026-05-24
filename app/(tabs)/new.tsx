import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
import { ImagePickerField } from '@/components/ui/image-picker-field';
import { BarcodeScannerModal } from '@/components/ui/barcode-scanner-modal';
import { useAddProduct } from '@/hooks/use-add-product';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function NewProductScreen() {
  const {
    fields,
    setField,
    imageUri,
    setImageUri,
    barcode,
    setBarcode,
    submitting,
    error,
    submit,
    reset,
  } = useAddProduct();

  const [scannerOpen, setScannerOpen] = useState(false);

  const color = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'inputBorder');
  const placeholderColor = useThemeColor({}, 'icon');
  const iconColor = useThemeColor({}, 'icon');
  const primary = useThemeColor({}, 'primary');
  const errorColor = useThemeColor({}, 'error');

  const handleSubmit = async () => {
    const ok = await submit();
    if (ok) {
      reset();
      router.replace('/(tabs)' as any);
    }
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
          <ThemedText type="title" style={styles.heading}>
            New Product
          </ThemedText>

          <ImagePickerField
            uri={imageUri}
            onSelect={setImageUri}
            onRemove={() => setImageUri(null)}
          />

          <AuthInput
            label="Name *"
            value={fields.name}
            onChangeText={(v) => setField('name', v)}
            placeholder="e.g. Wireless Headphones"
            autoCapitalize="words"
          />

          <View style={styles.fieldContainer}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Description
            </ThemedText>
            <TextInput
              style={[
                styles.textArea,
                { color, backgroundColor, borderColor },
              ]}
              value={fields.description}
              onChangeText={(v) => setField('description', v)}
              placeholder="Product description…"
              placeholderTextColor={placeholderColor}
              multiline
              numberOfLines={3}
              autoCapitalize="sentences"
              autoCorrect={false}
            />
          </View>

          <AuthInput
            label="Category *"
            value={fields.category}
            onChangeText={(v) => setField('category', v)}
            placeholder="e.g. Electronics"
            autoCapitalize="words"
          />

          <AuthInput
            label="Price ($) *"
            value={fields.price}
            onChangeText={(v) => setField('price', v)}
            placeholder="0.00"
            keyboardType="decimal-pad"
          />

          <AuthInput
            label="Discount (%)"
            value={fields.discount}
            onChangeText={(v) => setField('discount', v)}
            placeholder="0"
            keyboardType="decimal-pad"
          />

          <AuthInput
            label="Stock *"
            value={fields.stock}
            onChangeText={(v) => setField('stock', v)}
            placeholder="0"
            keyboardType="number-pad"
          />

          <View style={styles.barcodeRow}>
            <View style={styles.barcodeInput}>
              <AuthInput
                label="Barcode"
                value={barcode ?? ''}
                onChangeText={setBarcode}
                placeholder="Scan or enter manually"
              />
            </View>
            <Pressable
              style={[styles.scanBtn, { borderColor, backgroundColor }]}
              onPress={() => setScannerOpen(true)}
            >
              <Ionicons name="barcode-outline" size={26} color={iconColor} />
            </Pressable>
          </View>

          {error ? (
            <ThemedText style={[styles.error, { color: errorColor }]}>
              {error}
            </ThemedText>
          ) : null}

          <AuthButton
            title="Add Product"
            onPress={handleSubmit}
            loading={submitting}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <BarcodeScannerModal
        visible={scannerOpen}
        onScanned={(code) => setBarcode(code)}
        onClose={() => setScannerOpen(false)}
      />
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  heading: {
    marginBottom: 24,
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
    textAlignVertical: 'top',
  },
  barcodeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    marginBottom: 4,
  },
  barcodeInput: {
    flex: 1,
  },
  scanBtn: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  error: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
});
