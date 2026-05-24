import { useState } from 'react';
import { supabase } from '@/utils/supabase';

type Fields = {
  name: string;
  description: string;
  category: string;
  price: string;
  discount: string;
  stock: string;
};

const INITIAL_FIELDS: Fields = {
  name: '',
  description: '',
  category: '',
  price: '',
  discount: '0',
  stock: '',
};

export function useAddProduct() {
  const [fields, setFieldsState] = useState<Fields>(INITIAL_FIELDS);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = (key: keyof Fields, value: string) => {
    setFieldsState((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): string | null => {
    if (!fields.name.trim()) return 'Product name is required.';
    if (!fields.category.trim()) return 'Category is required.';
    const price = parseFloat(fields.price);
    if (isNaN(price) || price <= 0) return 'Enter a valid price greater than 0.';
    const discount = parseFloat(fields.discount);
    if (isNaN(discount) || discount < 0 || discount > 100) return 'Discount must be between 0 and 100.';
    const stock = parseInt(fields.stock, 10);
    if (isNaN(stock) || stock < 0) return 'Stock must be 0 or more.';
    return null;
  };

  const uploadImage = async (uri: string): Promise<string | null> => {
    const ext = uri.split('.').pop()?.toLowerCase() ?? 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';

    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, arrayBuffer, { contentType });

    if (uploadError) return null;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const submit = async (): Promise<boolean> => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return false;
    }

    setSubmitting(true);
    setError(null);

    let imageUrl: string | null = null;
    if (imageUri) {
      imageUrl = await uploadImage(imageUri);
      if (!imageUrl) {
        setError('Failed to upload image. Please try again.');
        setSubmitting(false);
        return false;
      }
    }

    const { error: insertError } = await supabase.from('products').insert({
      name: fields.name.trim(),
      description: fields.description.trim() || null,
      category: fields.category.trim(),
      price: parseFloat(fields.price),
      discount: parseFloat(fields.discount),
      stock: parseInt(fields.stock, 10),
      image_url: imageUrl,
      barcode: barcode || null,
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return false;
    }

    setSubmitting(false);
    return true;
  };

  const reset = () => {
    setFieldsState(INITIAL_FIELDS);
    setImageUri(null);
    setBarcode(null);
    setError(null);
  };

  return {
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
  };
}
