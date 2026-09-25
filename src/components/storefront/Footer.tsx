'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Award, RefreshCw, Truck, Sparkles, Check, ArrowRight, Mail, Lock } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { InstagramIcon } from './InstagramIcon';
import { toast } from '@/lib/toast-store';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
    toast.success(
      'VIP Access Confirmed',
      'You are now subscribed to exclusive drop announcements & archival previews.'
    );
  };

  return (
    <footer className="bg-[#111111] text-[#FAFAF8] mt-20 md:mt-28 border-t border-[#222222]">
      {/* 1. Value Badges (Mobile: 2x2 Grid, Desktop: 4 Columns) */}
      <div className="border-b border-[#222222] py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1e2922] flex items-center justify-center text-emerald-400 shrink-0">
              <Award size={20} className="md:w-[22px] md:h-[22px]" />
            </div>
            <div>
              <h4 className="font-semibold text-xs md:text-sm">1:1 Master Quality</h4>
              <p className="text-[11px] md:text-xs text-[#999990] mt-0.5">Exact leather, weight & hardware</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1e2922] flex items-center justify-center text-emerald-400 shrink-0">
              <RefreshCw size={20} className="md:w-[22px] md:h-[22px]" />
            </div>
            <div>
              <h4 className="font-semibold text-xs md:text-sm">7-Day Guarantee</h4>
              <p className="text-[11px] md:text-xs text-[#999990] mt-0.5">100% money-back or replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1e2922] flex items-center justify-center text-emerald-400 shrink-0">
              <Truck size={20} className="md:w-[22px] md:h-[22px]" />
            </div>
            <div>
              <h4 className="font-semibold text-xs md:text-sm">Express Delivery</h4>
              <p className="text-[11px] md:text-xs text-[#999990] mt-0.5">Dispatched with live tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1e2922] flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles size={20} className="md:w-[22px] md:h-[22px]" />
            </div>
            <div>
              <h4 className="font-semibold text-xs md:text-sm">Full Luxury Box</h4>
              <p className="text-[11px] md:text-xs text-[#999990] mt-0.5">Dustbags, tags & packaging included</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand & Newsletter Column */}
          <div className="sm:col-span-2 lg:col-span-5 space-y-4">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <BrandLogo variant="light" />
            </Link>
            <p className="text-xs md:text-sm text-[#999990] max-w-md leading-relaxed">
              Curated haute couture luxury archive featuring 1:1 master quality designer handbags, Swiss timepieces, handcrafted footwear, and accessories.
            </p>

            <a
              href="https://www.instagram.com/vo.velo.eu/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] text-xs font-semibold text-[#FAFAF8] transition-colors"
            >
              <InstagramIcon size={14} className="text-pink-400" />
              <span>@vo.velo.eu</span>
            </a>

            {/* Newsletter VIP Box */}
            <div className="pt-2 max-w-md">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block mb-2">
                Join The Archival Drop List
              </span>
              {isSubscribed ? (
                <div className="p-3 bg-[#1e2922] border border-emerald-900/50 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                  <Check size={16} />
                  <span>You are on the VIP Archival list. Watch your inbox for secret drops.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666660]" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs bg-[#1A1A1A] border border-[#333333] rounded-xl pl-9 pr-3 py-2.5 text-[#FAFAF8] placeholder-[#666660] focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#0F5132] hover:bg-[#0A3622] text-white rounded-xl text-xs font-bold shrink-0 transition-colors flex items-center gap-1"
                  >
                    <span>Join</span>
                    <ArrowRight size={13} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Department Collections Links */}
          <div className="lg:col-span-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#FAFAF8] mb-4 text-emerald-400/90">
              Luxury Departments
            </h5>
            <ul className="space-y-2.5 text-xs md:text-sm text-[#999990]">
              <li>
                <Link href="/category/bags" className="hover:text-emerald-400 transition-colors">
                  Handbags & Shoulder Bags
                </Link>
              </li>
              <li>
                <Link href="/category/footwear" className="hover:text-emerald-400 transition-colors">
                  Artisanal Footwear & Sneakers
                </Link>
              </li>
              <li>
                <Link href="/category/coats" className="hover:text-emerald-400 transition-colors">
                  Coats & Outerwear
                </Link>
              </li>
              <li>
                <Link href="/category/watches" className="hover:text-emerald-400 transition-colors">
                  Timepieces & Chronographs
                </Link>
              </li>
              <li>
                <Link href="/category/sunglasses" className="hover:text-emerald-400 transition-colors">
                  Designer Sunglasses
                </Link>
              </li>
              <li>
                <Link href="/category/belts" className="hover:text-emerald-400 transition-colors">
                  Designer Belts & Wallets
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-emerald-400 font-medium text-emerald-400/80 transition-colors">
                  Browse All Collections →
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Shopping Links */}
          <div className="lg:col-span-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#FAFAF8] mb-4 text-emerald-400/90">
              Client Concierge
            </h5>
            <ul className="space-y-2.5 text-xs md:text-sm text-[#999990]">
              <li>
                <Link href="/shop" className="hover:text-emerald-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-emerald-400 transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-emerald-400 transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-emerald-400 transition-colors">
                  All Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Quality & Security Column */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#FAFAF8] mb-4 text-emerald-400/90">
              Verified Authenticity
            </h5>
            <p className="text-xs text-[#999990] leading-relaxed">
              Every item is physical-match inspected with weight calibration, leather grain analysis, and serial verification prior to packing.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e2922] text-emerald-400 text-xs font-medium">
              <Lock size={12} />
              <span>256-Bit Encrypted Checkout</span>
            </div>
          </div>
        </div>

        {/* 3. Bottom Credits & Payment Badges */}
        <div className="border-t border-[#222222] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666660]">
          <p>© {new Date().getFullYear()} Vovelo Luxury Archive. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link href="/categories" className="hover:text-gray-400 transition-colors">
              Collections
            </Link>
            <Link href="/shop" className="hover:text-gray-400 transition-colors">
              Shop Catalog
            </Link>
            <Link href="/cart" className="hover:text-gray-400 transition-colors">
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
