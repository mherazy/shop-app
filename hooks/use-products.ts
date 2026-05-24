import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/utils/supabase';

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

export function useProducts(search: string, category: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(0);
  const loadingRef = useRef(false);

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

    setProducts(reset ? rows : (prev) => [...prev, ...rows]);
    pageRef.current = pageNum;
    setHasMore(rows.length === PAGE_SIZE);
    loadingRef.current = false;
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPage(0, true);
  }, [search, category]);

  const loadMore = () => {
    if (!hasMore || loadingRef.current) return;
    fetchPage(pageRef.current + 1, false);
  };

  const refresh = () => {
    setRefreshing(true);
    fetchPage(0, true);
  };

  return { products, loading, refreshing, hasMore, loadMore, refresh };
}
