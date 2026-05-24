import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/utils/supabase';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { useBatteryStatus } from '@/hooks/use-battery-status';

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount: number;
  stock: number;
  category: string;
  image_url: string | null;
  barcode: string | null;
  created_at: string;
};

const PAGE_SIZE = 12;
const CACHE_KEY = '@shop_app/products_cache';

export function useProducts(search: string, category: string | null) {
  const { isOnline } = useNetworkStatus();
  const { isLowBattery } = useBatteryStatus();
  const useCached = !isOnline || isLowBattery;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [realtimeVersion, setRealtimeVersion] = useState(0);
  const pageRef = useRef(0);
  const loadingRef = useRef(false);

  const loadCached = async () => {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    let cached: Product[] = raw ? (JSON.parse(raw) as Product[]) : [];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      cached = cached.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (category) {
      cached = cached.filter((p) => p.category === category);
    }

    setProducts(cached);
    setHasMore(false);
    loadingRef.current = false;
    setLoading(false);
    setRefreshing(false);
  };

  const fetchPage = async (pageNum: number, reset: boolean) => {
    if (loadingRef.current && !reset) return;
    loadingRef.current = true;
    setLoading(true);

    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);

    if (search.trim()) {
      query = query.ilike('name', `%${search.trim()}%`);
    }
    if (category) {
      query = query.eq('category', category);
    }

    const { data } = await query;
    const rows = (data ?? []) as Product[];

    if (pageNum === 0 && !search.trim() && !category && rows.length > 0) {
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify(rows));
    }

    setProducts(reset ? rows : (prev) => [...prev, ...rows]);
    pageRef.current = pageNum;
    setHasMore(rows.length === PAGE_SIZE);
    loadingRef.current = false;
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    pageRef.current = 0;
    loadingRef.current = false;

    if (useCached) {
      loadCached();
    } else {
      fetchPage(0, true);
    }
  }, [search, category, useCached, realtimeVersion]);

  useEffect(() => {
    if (useCached) return;

    const channel = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          setRealtimeVersion((v) => v + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [useCached]);

  const loadMore = () => {
    if (!hasMore || loadingRef.current || useCached) return;
    fetchPage(pageRef.current + 1, false);
  };

  const refresh = () => {
    setRefreshing(true);
    if (useCached) {
      loadCached();
    } else {
      fetchPage(0, true);
    }
  };

  return {
    products,
    loading,
    refreshing,
    hasMore,
    loadMore,
    refresh,
    isOnline,
    isLowBattery,
    useCached,
  };
}
