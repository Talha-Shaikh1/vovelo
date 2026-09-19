import { CurrencyCode, CurrencyConfig } from './types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    rate: 1.0,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    rate: 0.854,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    rate: 1.1603,
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF',
    name: 'Swiss Franc',
    flag: '🇨🇭',
    rate: 0.945,
  },
};

export function convertPrice(
  amountInEur: number,
  targetCurrency: CurrencyCode,
  customRates?: Record<CurrencyCode, number>
): number {
  const rate = customRates?.[targetCurrency] ?? CURRENCIES[targetCurrency]?.rate ?? 1.0;
  return Math.round(amountInEur * rate * 100) / 100;
}

export function formatPrice(
  amountInEur: number,
  currency: CurrencyCode = 'EUR',
  customRates?: Record<CurrencyCode, number>
): string {
  const config = CURRENCIES[currency] || CURRENCIES.EUR;
  const rate = customRates?.[currency] ?? config.rate;
  const converted = amountInEur * rate;
  
  // Display clean decimal formatting: 2 decimals if not whole integer
  const formattedNumber = converted.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (config.code === 'EUR') {
    return `€${formattedNumber}`;
  }
  if (config.code === 'GBP') {
    return `£${formattedNumber}`;
  }
  if (config.code === 'USD') {
    return `$${formattedNumber}`;
  }
  if (config.code === 'CHF') {
    return `${formattedNumber} CHF`;
  }
  return `€${formattedNumber}`;
}

export function formatPricePrecise(
  amountInEur: number,
  currency: CurrencyCode = 'EUR',
  customRates?: Record<CurrencyCode, number>
): string {
  return formatPrice(amountInEur, currency, customRates);
}
