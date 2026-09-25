'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CurrencyCode } from './types';
import { CURRENCIES } from './currency';

interface CurrencyState {
  currency: CurrencyCode;
  rates: Record<CurrencyCode, number>;
  lastUpdated?: string;
  setCurrency: (code: CurrencyCode) => void;
  setRates: (rates: Record<CurrencyCode, number>) => void;
  fetchLiveRates: () => Promise<void>;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: 'EUR',
      rates: {
        EUR: CURRENCIES.EUR.rate,
        GBP: CURRENCIES.GBP.rate,
        USD: CURRENCIES.USD.rate,
        CHF: CURRENCIES.CHF.rate,
      },
      setCurrency: (currency) => set({ currency }),
      setRates: (rates) => set({ rates, lastUpdated: new Date().toISOString() }),
      fetchLiveRates: async () => {
        try {
          const res = await fetch('https://open.er-api.com/v6/latest/EUR');
          if (res.ok) {
            const data = await res.json();
            if (data && data.rates) {
              set({
                rates: {
                  EUR: 1.0,
                  USD: data.rates.USD || get().rates.USD,
                  GBP: data.rates.GBP || get().rates.GBP,
                  CHF: data.rates.CHF || get().rates.CHF,
                },
                lastUpdated: new Date().toISOString(),
              });
            }
          }
        } catch {
          // Graceful fallback to static high-precision rates
        }
      },
    }),
    {
      name: 'vovelo-currency-preference',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
