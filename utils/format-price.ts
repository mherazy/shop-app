import { getLocales } from 'expo-localization';

const locale = getLocales()[0]?.languageTag ?? 'en-US';

export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}
