import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
};

export type Order = {
  id: string;
  user_id: string;
  items: OrderItem[];
  total: number;
  delivery_address: string;
  notes: string | null;
  status: string;
  created_at: string;
};

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setOrders((data ?? []) as Order[]);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  return { orders, loading, error };
}
