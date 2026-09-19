import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RefreshCw, Leaf } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#111111] text-[#FAFAF8] mt-24 border-t border-[#222222]">
      {/* Trust Badges */}
      <div className="border-b border-[#222222] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1e2922] flex items-center justify-center text-emerald-400 shrink-0">
              <Truck size={22} />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Carbon-Neutral Shipping</h4>
              <p className="text-xs text-[#999990] mt-0.5">Free over €50 across the EU</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1e2922] flex items-center justify-center text-emerald-400 shrink-0">
              <RefreshCw size={22} />
            </div>
            <div>
              <h4 className="font-semibold text-sm">30-Day Hassle-Free Returns</h4>
              <p className="text-xs text-[#999990] mt-0.5">Prepaid return labels provided</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1e2922] flex items-center justify-center text-emerald-400 shrink-0">
              <Leaf size={22} />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Conscious Materials</h4>
              <p className="text-xs text-[#999990] mt-0.5">Merino wool & organic cotton</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1e2922] flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Direct Fulfillment</h4>
              <p className="text-xs text-[#999990] mt-0.5">Verified European makers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block bg-white/95 px-3 py-1.5 rounded-xl hover:bg-white transition-colors">
              <img
                src="/logo.png"
                alt="Volvelo"
                className="h-6 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-[#999990] max-w-sm leading-relaxed">
              Curated European essentials built with timeless aesthetics, durable materials, and full transparency.
            </p>
            <p className="text-xs text-[#666660]">
              Headquarters: Berlin, Germany • Operating across EU & Global
            </p>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#FAFAF8] mb-4">
              Catalog
            </h5>
            <ul className="space-y-2.5 text-sm text-[#999990]">
              <li>
                <Link href="/category/men-watches" className="hover:text-emerald-400 transition-colors">
                  Men&apos;s Watches
                </Link>
              </li>
              <li>
                <Link href="/category/men-shoes" className="hover:text-emerald-400 transition-colors">
                  Men&apos;s Footwear
                </Link>
              </li>
              <li>
                <Link href="/category/women-clothes" className="hover:text-emerald-400 transition-colors">
                  Women&apos;s Atelier Clothes
                </Link>
              </li>
              <li>
                <Link href="/category/women-jewellery" className="hover:text-emerald-400 transition-colors">
                  Fine Jewellery & Earrings
                </Link>
              </li>
              <li>
                <Link href="/category/women-watches" className="hover:text-emerald-400 transition-colors">
                  Women&apos;s Timepieces
                </Link>
              </li>
              <li>
                <Link href="/category/women-shoes" className="hover:text-emerald-400 transition-colors">
                  Women&apos;s Footwear
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#FAFAF8] mb-4">
              Makers & Platform
            </h5>
            <ul className="space-y-2.5 text-sm text-[#999990]">
              <li>
                <Link href="/sell-with-us" className="text-emerald-400 font-semibold hover:underline">
                  ★ Sell with Us (Partner Atelier)
                </Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-emerald-400 transition-colors">
                  Merchant Portal (/portal)
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-emerald-400 transition-colors">
                  Journal & Buying Guides
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Admin & Operations Hub</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#FAFAF8] mb-4">
              Sustainability
            </h5>
            <p className="text-xs text-[#999990] leading-relaxed mb-4">
              All packaging is 100% FSC-certified recycled paper and 0% virgin plastics.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e2922] text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>100% Climate Neutral</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="border-t border-[#222222] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666660]">
          <p>© {new Date().getFullYear()} Volvelo Commerce Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-400 cursor-pointer">Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
