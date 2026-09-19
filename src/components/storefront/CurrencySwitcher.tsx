'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCurrencyStore } from '@/lib/currency-store';
import { CURRENCIES } from '@/lib/currency';
import { CurrencyCode } from '@/lib/types';
import { ChevronDown, Globe } from 'lucide-react';

export default function CurrencySwitcher({ variant = 'minimal' }: { variant?: 'minimal' | 'full' }) {
  const { currency, setCurrency } = useCurrencyStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeConfig = CURRENCIES[currency] || CURRENCIES.EUR;

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 text-xs font-mono text-neutral-600 bg-neutral-100 px-2 py-1 rounded">
        <span>🇪🇺</span>
        <span>EUR (€)</span>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:text-neutral-950 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-full transition-all focus:outline-none"
        aria-label="Select currency"
      >
        <span className="text-sm leading-none">{activeConfig.flag}</span>
        <span className="font-mono">{activeConfig.code}</span>
        <span className="text-neutral-400 text-[10px]">({activeConfig.symbol})</span>
        <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white border border-neutral-200 shadow-xl rounded-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 border-b border-neutral-100 text-[10px] uppercase tracking-wider font-semibold text-neutral-400 flex items-center gap-1">
            <Globe className="w-3 h-3" /> Select Currency
          </div>
          {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
            const item = CURRENCIES[code];
            const isSelected = item.code === currency;
            return (
              <button
                key={code}
                onClick={() => {
                  setCurrency(code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                  isSelected
                    ? 'bg-neutral-100 text-neutral-950 font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.flag}</span>
                  <div>
                    <span className="font-medium">{item.code}</span>
                    <span className="text-[10px] text-neutral-400 block -mt-0.5">{item.name}</span>
                  </div>
                </div>
                <span className="font-mono text-neutral-500 font-normal">{item.symbol}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
