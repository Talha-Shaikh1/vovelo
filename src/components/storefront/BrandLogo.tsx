import React from 'react';

interface BrandLogoProps {
  variant?: 'dark' | 'light';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo({ variant = 'dark', className = '', size = 'md' }: BrandLogoProps) {
  const isLight = variant === 'light';
  const textColor = isLight ? '#FFFFFF' : '#111111';
  const subtitleColor = isLight ? '#34D399' : '#0F5132';

  const heights = {
    sm: 'h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-10 sm:h-12',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Monogram Crest Icon */}
      <svg
        viewBox="0 0 64 64"
        className={`${heights[size]} w-auto aspect-square shrink-0`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldGradLogo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#F3E5AB" />
            <stop offset="100%" stopColor="#AA7C11" />
          </linearGradient>
          <linearGradient id="emeraldGradLogo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F5132" />
            <stop offset="100%" stopColor="#082A1A" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="64" height="64" rx="14" fill="url(#emeraldGradLogo)" />
        <rect
          x="3"
          y="3"
          width="58"
          height="58"
          rx="11"
          fill="none"
          stroke="url(#goldGradLogo)"
          strokeWidth="1.5"
          opacity="0.85"
        />

        {/* Monogram V */}
        <path d="M18 20 L32 46 L46 20 L39 20 L32 35 L25 20 Z" fill="url(#goldGradLogo)" />

        {/* Star Accent */}
        <polygon
          points="32,22 34,26 38,26 35,29 36,33 32,30 28,33 29,29 26,26 30,26"
          fill="#FFFFFF"
          opacity="0.95"
        />
      </svg>

      {/* Typography */}
      <div className="flex flex-col justify-center text-left">
        <span
          className="font-serif font-black tracking-[0.24em] leading-none text-base sm:text-lg"
          style={{ color: textColor }}
        >
          VOLVELO
        </span>
        <span
          className="font-sans font-bold tracking-[0.28em] text-[8px] sm:text-[9px] uppercase mt-1 leading-none"
          style={{ color: subtitleColor }}
        >
          Haute Couture
        </span>
      </div>
    </div>
  );
}

export default BrandLogo;
