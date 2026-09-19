'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductVariant } from '@/lib/types';
import { Check, AlertCircle } from 'lucide-react';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onSelectVariant: (variant: ProductVariant) => void;
}

export function VariantSelector({
  variants,
  selectedVariant,
  onSelectVariant,
}: VariantSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract all available option types (e.g. ['Color', 'Size', 'Capacity'])
  const optionTypes = Array.from(
    new Set(
      variants.flatMap((v) => Object.keys((v.optionValues as Record<string, string>) || {}))
    )
  );

  const selectedOptions = (selectedVariant.optionValues as Record<string, string>) || {};

  const handleOptionChange = (optionName: string, optionValue: string) => {
    const targetOptions = {
      ...selectedOptions,
      [optionName]: optionValue,
    };

    // Find the closest matching variant
    const matchedVariant =
      variants.find((v) => {
        const vOpts = (v.optionValues as Record<string, string>) || {};
        return Object.entries(targetOptions).every(([k, val]) => vOpts[k] === val);
      }) ||
      variants.find((v) => {
        const vOpts = (v.optionValues as Record<string, string>) || {};
        return vOpts[optionName] === optionValue;
      }) ||
      variants[0];

    if (matchedVariant) {
      onSelectVariant(matchedVariant);

      // Update URL query param e.g. ?variant=sku
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('variant', matchedVariant.sku);
      router.replace(`?${current.toString()}`, { scroll: false });
    }
  };

  // Color mapping helper for visual circles
  const getColorHex = (colorName: string): string => {
    const lower = colorName.toLowerCase();
    if (lower.includes('emerald') || lower.includes('forest') || lower.includes('pine') || lower.includes('moss') || lower.includes('green')) return '#0F5132';
    if (lower.includes('black') || lower.includes('onyx') || lower.includes('stealth')) return '#1A1A1A';
    if (lower.includes('white') || lower.includes('chalk') || lower.includes('oatmeal')) return '#F4F4F0';
    if (lower.includes('grey') || lower.includes('gray') || lower.includes('charcoal')) return '#5A5A55';
    if (lower.includes('tan') || lower.includes('sand') || lower.includes('beige') || lower.includes('stone')) return '#D2B48C';
    if (lower.includes('navy') || lower.includes('blue')) return '#1B2A4A';
    return '#888888';
  };

  return (
    <div className="space-y-6">
      {optionTypes.map((optType) => {
        // Unique values available for this option type
        const uniqueValues = Array.from(
          new Set(
            variants
              .map((v) => (v.optionValues as Record<string, string>)?.[optType])
              .filter(Boolean)
          )
        );

        const currentValue = selectedOptions[optType];
        const isColorType = optType.toLowerCase() === 'color';

        return (
          <div key={optType} className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#111111] uppercase tracking-wider">
                {optType}: <span className="font-normal text-[#666660]">{currentValue}</span>
              </span>
              {optType.toLowerCase() === 'size' && (
                <span className="text-[#666660] hover:text-[#0F5132] underline cursor-pointer">
                  Size Guide
                </span>
              )}
            </div>

            {/* If Color, render luxury circular swatches */}
            {isColorType ? (
              <div className="flex flex-wrap items-center gap-3">
                {uniqueValues.map((val) => {
                  const isSelected = currentValue === val;
                  const hex = getColorHex(val);

                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleOptionChange(optType, val)}
                      className={`group relative flex items-center justify-center w-9 h-9 rounded-full transition-all ${
                        isSelected
                          ? 'ring-2 ring-[#0F5132] ring-offset-2 scale-105'
                          : 'hover:scale-105 border border-[#E4E4E0]'
                      }`}
                      title={val}
                    >
                      <span
                        className="w-full h-full rounded-full border border-black/10 flex items-center justify-center shadow-inner"
                        style={{ backgroundColor: hex }}
                      >
                        {isSelected && (
                          <Check
                            size={14}
                            className={
                              hex === '#F4F4F0' ? 'text-black' : 'text-white'
                            }
                          />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Buttons for Size / Capacity / Material */
              <div className="flex flex-wrap items-center gap-2">
                {uniqueValues.map((val) => {
                  const isSelected = currentValue === val;

                  // Check if any variant with this option is in stock
                  const hasStock = variants.some((v) => {
                    const vOpts = (v.optionValues as Record<string, string>) || {};
                    return vOpts[optType] === val && v.stock > 0;
                  });

                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleOptionChange(optType, val)}
                      disabled={!hasStock}
                      className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                          : hasStock
                          ? 'bg-white text-[#111111] border-[#E4E4E0] hover:border-[#111111]'
                          : 'bg-[#F0F0EC] text-[#999990] border-[#E4E4E0] line-through cursor-not-allowed'
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Stock Status Indicator */}
      <div className="pt-2">
        {selectedVariant.stock > 0 ? (
          selectedVariant.stock <= 5 ? (
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              <AlertCircle size={14} />
              <span>Only {selectedVariant.stock} units remaining in stock</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-xs text-[#0F5132] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#0F5132]"></span>
              <span>In Stock — Ready to ship from EU warehouse</span>
            </div>
          )
        ) : (
          <div className="inline-flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
            <AlertCircle size={14} />
            <span>Currently out of stock</span>
          </div>
        )}
      </div>
    </div>
  );
}
