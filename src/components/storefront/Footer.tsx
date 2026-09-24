import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RefreshCw, Award, Sparkles } from 'lucide-react';

import { BrandLogo } from './BrandLogo';

export function Footer() {
  return (
    <footer className="bg-[#111111] text-[#FAFAF8] mt-24 border-t border-[#222222]">
      {/* Trust Badges */}
      <div className="border-b border-[#222222] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1e2922] flex items-center justify-center text-emerald-400 shrink-0">
              <Award size={22} />
            </div>
            <div>
              <h4 className="font-semibold text-sm">1:1 Master Quality</h4>
              <p className="text-xs text-[#999990] mt-0.5">Exact leather, weight & hardware</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1e2922] flex items-center justify-center text-emerald-400 shrink-0">
              <RefreshCw size={22} />
            </div>
            <div>
              <h4 className="font-semibold text-sm">7-Day Inspection Guarantee</h4>
              <p className="text-xs text-[#999990] mt-0.5">100% money-back or replacement</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1e2922] flex items-center justify-center text-emerald-400 shrink-0">
              <Truck size={22} />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Discreet Express Delivery</h4>
              <p className="text-xs text-[#999990] mt-0.5">Dispatched direct with real-time tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1e2922] flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles size={22} />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Complete Packaging</h4>
              <p className="text-xs text-[#999990] mt-0.5">Includes branded dustbag, box & cards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <BrandLogo variant="light" />
            </Link>
            <p className="text-sm text-[#999990] max-w-sm leading-relaxed">
              Curated haute couture luxury archive featuring 1:1 master quality designer handbags, timepieces, artisanal footwear, and accessories.
            </p>
            <p className="text-xs text-[#666660]">
              Direct Warehouse Dispatch • Worldwide Express Shipping
            </p>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#FAFAF8] mb-4">
              Luxury Collections
            </h5>
            <ul className="space-y-2.5 text-sm text-[#999990]">
              <li>
                <Link href="/category/bags" className="hover:text-emerald-400 transition-colors">
                  Handbags & Shoulder Bags
                </Link>
              </li>
              <li>
                <Link href="/category/footwear" className="hover:text-emerald-400 transition-colors">
                  Footwear & Sneakers
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
                  Designer Belts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#FAFAF8] mb-4">
              Customer Concierge
            </h5>
            <ul className="space-y-2.5 text-sm text-[#999990]">
              <li>
                <Link href="/shop" className="hover:text-emerald-400 transition-colors">
                  All Collections (5,300+ items)
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-emerald-400 transition-colors">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-emerald-400 transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Admin Hub</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#FAFAF8] mb-4">
              Quality Commitment
            </h5>
            <p className="text-xs text-[#999990] leading-relaxed mb-4">
              Every order is hand-inspected for flawless stitch alignment, weight, and hardware finish prior to dispatch.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e2922] text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>100% Quality Inspected</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="border-t border-[#222222] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666660]">
          <p>© {new Date().getFullYear()} Volvelo Luxury Archive. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/shop" className="hover:text-gray-400">Shop Catalog</Link>
            <Link href="/cart" className="hover:text-gray-400">Order Checkout</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
