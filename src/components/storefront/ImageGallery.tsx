'use client';

import React, { useState } from 'react';
import { ProductImage } from '@/lib/types';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: ProductImage[];
  activeVariantImage?: string | null;
  productTitle: string;
}

export function ImageGallery({
  images,
  activeVariantImage,
  productTitle,
}: ImageGalleryProps) {
  // Combine all product images, ensuring the variant image is prioritized if present
  const allImages = React.useMemo(() => {
    let list = images.length > 0 ? [...images] : [];
    if (list.length === 0) {
      list = [
        {
          id: 'default',
          productId: 'default',
          url: activeVariantImage || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
          altText: productTitle,
          order: 0,
        },
      ];
    }
    return list;
  }, [images, activeVariantImage, productTitle]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const activeImage = allImages[selectedIndex] || allImages[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail Strip (Vertical on Desktop, Horizontal on Mobile) */}
      {allImages.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar max-h-[560px] shrink-0">
          {allImages.map((img, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                  isSelected
                    ? 'border-[#0F5132] opacity-100 scale-95 shadow-sm'
                    : 'border-transparent opacity-60 hover:opacity-100 hover:border-[#E4E4E0]'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.altText || `${productTitle} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Image Display with Hover Zoom */}
      <div className="relative flex-1 aspect-[4/5] bg-[#F0F0EC] rounded-2xl overflow-hidden border border-[#E4E4E0] group">
        <div
          className="relative w-full h-full cursor-crosshair overflow-hidden"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <img
            src={activeImage?.url}
            alt={activeImage?.altText || productTitle}
            className={`w-full h-full object-cover object-center transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  }
                : undefined
            }
          />
        </div>

        {/* Navigation arrows */}
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#111111] flex items-center justify-center shadow-md backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100"
              aria-label="Previous Image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#111111] flex items-center justify-center shadow-md backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100"
              aria-label="Next Image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Zoom Hint Indicator */}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-xs pointer-events-none opacity-80">
          <ZoomIn size={12} />
          <span>Hover to zoom</span>
        </div>
      </div>
    </div>
  );
}
