import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { CartProvider } from '@/contexts/cart';
import { CurrencyProvider } from '@/contexts/currency';
import { WishlistProvider } from '@/contexts/wishlist';
import { ThemePreferenceProvider, useThemePreference } from '@/contexts/theme-preference';

function ThemedLayout() {
  const { effectiveScheme } = useThemePreference();

  return (
    <ThemeProvider value={effectiveScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="checkout" options={{ title: 'Checkout', headerBackTitle: 'Cart' }} />
        <Stack.Screen name="orders" options={{ title: 'Order History', headerBackTitle: 'Settings' }} />
        <Stack.Screen name="wishlist" options={{ title: 'Wishlist', headerBackTitle: 'Settings' }} />
        <Stack.Screen name="currency-picker" options={{ title: 'Currency', headerBackTitle: 'Settings' }} />
      </Stack>
      <StatusBar style={effectiveScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemePreferenceProvider>
      <CurrencyProvider>
        <CartProvider>
          <WishlistProvider>
            <ThemedLayout />
          </WishlistProvider>
        </CartProvider>
      </CurrencyProvider>
    </ThemePreferenceProvider>
  );
}
