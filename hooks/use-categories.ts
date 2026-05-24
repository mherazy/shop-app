import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('category')
      .order('category', { ascending: true })
      .then(({ data }) => {
        const unique = [...new Set((data ?? []).map((r) => r.category as string))];
        setCategories(unique);
        setLoading(false);
      });
  }, []);

  return { categories, loading };
}
