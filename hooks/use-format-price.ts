import { useMemo } from 'react';
import { getLocales } from 'expo-localization';
import { useCurrency } from '@/contexts/currency';

export function useFormatPrice() {
  const { currency } = useCurrency();
  const locale = getLocales()[0]?.languageTag ?? 'en-US';

  return useMemo(() => {
    const fmt = new Intl.NumberFormat(locale, { style: 'currency', currency });
    return (amount: number) => fmt.format(amount);
  }, [locale, currency]);
}
