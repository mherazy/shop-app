import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type CurrencyOption = {
  code: string;
  name: string;
};

export const CURRENCIES: CurrencyOption[] = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EGP', name: "Egyptian Pound" },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'AED', name: 'UAE Dirham' },
  { code: 'SAR', name: 'Saudi Riyal' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'CHF', name: 'Swiss Franc' },
];

type CurrencyContextType = {
  currency: string;
  setCurrency: (code: string) => void;
};

const STORAGE_KEY = '@shop_app/currency';
const DEFAULT_CURRENCY = 'USD';

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState(DEFAULT_CURRENCY);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved) setCurrencyState(saved);
    });
  }, []);

  const setCurrency = (code: string) => {
    setCurrencyState(code);
    AsyncStorage.setItem(STORAGE_KEY, code);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
