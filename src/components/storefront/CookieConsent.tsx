'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('volvelo-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('volvelo-cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('volvelo-cookie-consent', 'essential-only');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Privacy & Cookie Preferences"
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 bg-[#111111] text-[#FAFAF8] p-5 rounded-2xl shadow-2xl border border-[#333330] animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-full bg-[#1e2922] text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck size={18} />
        </div>
        <div className="flex-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            European Privacy & Cookies
          </h3>
          <p className="text-xs text-[#AAAAA0] mt-1 leading-relaxed">
            We use essential cookies to maintain your shopping cart and analyze anonymous performance signals to rank products effectively.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              onClick={handleAccept}
              className="px-3.5 py-1.5 bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={handleDecline}
              className="px-3 py-1.5 bg-[#222220] hover:bg-[#333330] text-[#D5D5D0] text-xs font-medium rounded-lg transition-colors"
            >
              Essential Only
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDecline}
          className="text-[#888880] hover:text-white p-1"
          aria-label="Close Notice"
        >
          <X size={14} />
        </button>
      </div>
    </aside>
  );
}
