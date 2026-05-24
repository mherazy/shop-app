import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';

import { supabase } from '@/utils/supabase';
import { useWishlist } from '@/contexts/wishlist';

export function useStockNotifications() {
  const { items } = useWishlist();
  const wishlistRef = useRef(items);

  useEffect(() => {
    wishlistRef.current = items;
  }, [items]);

  useEffect(() => {
    const channel = supabase
      .channel('stock-watcher')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'products' },
        (payload) => {
          const prev = payload.old as { id: string; stock: number };
          const next = payload.new as { id: string; stock: number; name: string };
          if (prev.stock === 0 && next.stock > 0) {
            const wishlisted = wishlistRef.current.some((p) => p.id === next.id);
            if (wishlisted) {
              Notifications.scheduleNotificationAsync({
                content: {
                  title: 'Back in Stock!',
                  body: `${next.name} is now available. Grab it before it sells out!`,
                  data: { screen: 'home' },
                },
                trigger: null,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
