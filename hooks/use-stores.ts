import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export type Store = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
  created_at: string;
};

export function useStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('stores')
        .select('*')
        .order('name');

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setStores((data ?? []) as Store[]);
      }
      setLoading(false);
    };

    fetchStores();
  }, []);

  return { stores, loading, error };
}
