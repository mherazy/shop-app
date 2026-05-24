import { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchBar } from '@/components/ui/search-bar';
import { CategoryFilter } from '@/components/ui/category-filter';
import { ProductCard } from '@/components/ui/product-card';
import { useProducts } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const insets = useSafeAreaInsets();
  const primary = useThemeColor({}, 'primary');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchText), 400);
    return () => clearTimeout(t);
  }, [searchText]);

  const { products, loading, refreshing, hasMore, loadMore, refresh } =
    useProducts(debouncedSearch, activeCategory);
  const { categories } = useCategories();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  const renderFooter = useCallback(() => {
    if (!hasMore || products.length === 0) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator color={primary} />
      </View>
    );
  }, [hasMore, products.length, primary]);

  const renderEmpty = useCallback(() => {
    if (loading) return null;
    return (
      <View style={styles.empty}>
        <ThemedText type="defaultSemiBold">No products found</ThemedText>
      </View>
    );
  }, [loading]);

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <ThemedText type="title" style={styles.title}>
          Products
        </ThemedText>
        <SearchBar value={searchText} onChangeText={setSearchText} />
        <CategoryFilter
          categories={categories}
          selected={activeCategory}
          onSelect={setActiveCategory}
        />
      </View>

      {loading && products.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProductCard product={item} />}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={primary}
              colors={[primary]}
            />
          }
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={Platform.OS === 'android'}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  title: {
    marginBottom: 12,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    paddingTop: 60,
    alignItems: 'center',
  },
});
