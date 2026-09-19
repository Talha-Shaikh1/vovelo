'use client';

import { useCurrencyStore } from '@/lib/currency-store';
import { formatPrice, formatPricePrecise } from '@/lib/currency';
import { useEffect, useState } from 'react';

interface PriceDisplayProps {
  amount: number;
  className?: string;
  precise?: boolean;
}

export function PriceDisplay({ amount, className = '', precise = false }: PriceDisplayProps) {
  const currency = useCurrencyStore((state) => state.currency);
  const rates = useCurrencyStore((state) => state.rates);
  const fetchLiveRates = useCurrencyStore((state) => state.fetchLiveRates);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchLiveRates();
  }, [fetchLiveRates]);

  const formatted = mounted
    ? precise
      ? formatPricePrecise(amount, currency, rates)
      : formatPrice(amount, currency, rates)
    : `€${amount.toFixed(2)}`;

  return <span className={className}>{formatted}</span>;
}

export default PriceDisplay;
