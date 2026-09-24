'use client';

import React from 'react';
import { formatPrice } from '@/lib/utils';

interface PriceDisplayProps {
  amount: number;
  className?: string;
  precise?: boolean;
}

export function PriceDisplay({ amount, className = '' }: PriceDisplayProps) {
  return <span className={className}>{formatPrice(amount)}</span>;
}

export default PriceDisplay;
