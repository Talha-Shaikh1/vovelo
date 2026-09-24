'use client';

import React, { useState } from 'react';
import { SiteSettings, CurrencyCode } from '@/lib/types';
import { useCurrencyStore } from '@/lib/currency-store';
import { extractVerificationCode } from '@/lib/utils';
import { Settings, Save, CheckCircle2, Globe, ShieldCheck, Mail, Bell, Truck, RotateCcw, Award, RefreshCw, DollarSign, Search, BarChart2, Target, Code, ExternalLink, Sparkles, Key, FileCheck } from 'lucide-react';

interface SiteSettingsClientProps {
  initialSettings: SiteSettings;
}

export function SiteSettingsClient({ initialSettings }: SiteSettingsClientProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Currency Store Integration
  const rates = useCurrencyStore((state) => state.rates);
  const setRates = useCurrencyStore((state) => state.setRates);
  const fetchLiveRates = useCurrencyStore((state) => state.fetchLiveRates);
  const lastUpdated = useCurrencyStore((state) => state.lastUpdated);
  const [isSyncingRates, setIsSyncingRates] = useState(false);
  const [rateSyncMsg, setRateSyncMsg] = useState('');

  const handleRateChange = (code: CurrencyCode, val: number) => {
    setRates({
      ...rates,
      [code]: val,
    });
  };

  const handleSyncLiveRates = async () => {
    setIsSyncingRates(true);
    setRateSyncMsg('');
    try {
      await fetchLiveRates();
      setRateSyncMsg('Real-time Forex rates synced successfully!');
      setTimeout(() => setRateSyncMsg(''), 3000);
    } catch {
      setRateSyncMsg('Failed to sync live rates.');
    } finally {
      setIsSyncingRates(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let cleanValue: any = value;

    if (name === 'lowStockThreshold') {
      cleanValue = parseInt(value) || 0;
    } else if (name === 'freeShippingThreshold' || name === 'standardShippingFee') {
      cleanValue = parseFloat(value) || 0;
    } else if (name === 'googleSiteVerification' || name === 'bingSiteVerification' || name === 'pinterestVerification') {
      cleanValue = extractVerificationCode(value);
    }

    setSettings((prev) => ({
      ...prev,
      [name]: cleanValue,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {savedSuccess && (
        <div className="p-4 bg-[#E8F3EE] rounded-xl border border-[#d2e8dd] text-xs font-medium text-[#0F5132] flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 size={16} />
          <span>Global site settings saved! All storefront badges, shipping rates, and values updated dynamically.</span>
        </div>
      )}

      {/* 1. Brand & Store Identity */}
      <div className="bg-white p-6 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#E4E4E0]">
          <Globe size={16} className="text-[#0F5132]" />
          <span>1. Brand & Store Identity</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#111111] block mb-1">
              Store Name
            </label>
            <input
              type="text"
              name="storeName"
              value={settings.storeName}
              onChange={handleChange}
              className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111] focus:outline-none focus:border-[#0F5132]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#111111] block mb-1">
              Tagline
            </label>
            <input
              type="text"
              name="tagline"
              value={settings.tagline}
              onChange={handleChange}
              className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111] focus:outline-none focus:border-[#0F5132]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-[#111111] block mb-1">
              Top Announcement Bar Text
            </label>
            <input
              type="text"
              name="announcementText"
              value={settings.announcementText || ''}
              onChange={handleChange}
              className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111] focus:outline-none focus:border-[#0F5132]"
            />
          </div>
        </div>
      </div>

      {/* 2. Global Dynamic Policy Badges (Applied to PDP & Storefront) */}
      <div className="bg-white p-6 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#E4E4E0]">
          <Award size={16} className="text-[#0F5132]" />
          <span>2. Storefront Policy Badges (Dynamic PDP & Header/Footer)</span>
        </h3>
        <p className="text-xs text-[#666660]">
          These values control the badges displayed on every Product Detail Page (PDP), Cart, and Footer.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E4E4E0] space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#111111]">
              <Truck size={15} className="text-[#0F5132]" />
              <span>Badge 1: Shipping</span>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#666660] block mb-1">Title</label>
              <input
                type="text"
                name="shippingBadgeTitle"
                value={settings.shippingBadgeTitle || 'EU Shipping'}
                onChange={handleChange}
                className="w-full text-xs bg-white border border-[#E4E4E0] rounded-lg px-2.5 py-1.5"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#666660] block mb-1">Subtitle / Days</label>
              <input
                type="text"
                name="shippingBadgeSubtitle"
                value={settings.shippingBadgeSubtitle || '2-4 Days'}
                onChange={handleChange}
                className="w-full text-xs bg-white border border-[#E4E4E0] rounded-lg px-2.5 py-1.5"
              />
            </div>
          </div>

          <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E4E4E0] space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#111111]">
              <RotateCcw size={15} className="text-[#0F5132]" />
              <span>Badge 2: Returns</span>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#666660] block mb-1">Title</label>
              <input
                type="text"
                name="returnsBadgeTitle"
                value={settings.returnsBadgeTitle || '30 Days'}
                onChange={handleChange}
                className="w-full text-xs bg-white border border-[#E4E4E0] rounded-lg px-2.5 py-1.5"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#666660] block mb-1">Subtitle / Policy</label>
              <input
                type="text"
                name="returnsBadgeSubtitle"
                value={settings.returnsBadgeSubtitle || 'Free Returns'}
                onChange={handleChange}
                className="w-full text-xs bg-white border border-[#E4E4E0] rounded-lg px-2.5 py-1.5"
              />
            </div>
          </div>

          <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E4E4E0] space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#111111]">
              <ShieldCheck size={15} className="text-[#0F5132]" />
              <span>Badge 3: Guarantee</span>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#666660] block mb-1">Title</label>
              <input
                type="text"
                name="guaranteeBadgeTitle"
                value={settings.guaranteeBadgeTitle || 'Guaranteed'}
                onChange={handleChange}
                className="w-full text-xs bg-white border border-[#E4E4E0] rounded-lg px-2.5 py-1.5"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#666660] block mb-1">Subtitle / Assurance</label>
              <input
                type="text"
                name="guaranteeBadgeSubtitle"
                value={settings.guaranteeBadgeSubtitle || 'Verified Maker'}
                onChange={handleChange}
                className="w-full text-xs bg-white border border-[#E4E4E0] rounded-lg px-2.5 py-1.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Shipping Thresholds & Pricing */}
      <div className="bg-white p-6 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#E4E4E0]">
          <Truck size={16} className="text-[#0F5132]" />
          <span>3. Shipping Thresholds & Fees</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#111111] block mb-1">
              Free Shipping Threshold (€)
            </label>
            <input
              type="number"
              name="freeShippingThreshold"
              value={settings.freeShippingThreshold || 50}
              onChange={handleChange}
              className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#111111] block mb-1">
              Standard Shipping Fee (€)
            </label>
            <input
              type="number"
              step="0.1"
              name="standardShippingFee"
              value={settings.standardShippingFee || 4.9}
              onChange={handleChange}
              className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#111111] block mb-1">
              Low Stock Alert Threshold
            </label>
            <input
              type="number"
              name="lowStockThreshold"
              value={settings.lowStockThreshold || 4}
              onChange={handleChange}
              className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111]"
            />
          </div>
        </div>
      </div>

      {/* 4. Contact & SEO Defaults */}
      <div className="bg-white p-6 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#E4E4E0]">
          <Mail size={16} className="text-[#0F5132]" />
          <span>4. Contact Information & SEO Defaults</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#111111] block mb-1">
              Contact Email
            </label>
            <input
              type="email"
              name="contactEmail"
              value={settings.contactEmail}
              onChange={handleChange}
              className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#111111] block mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              name="contactPhone"
              value={settings.contactPhone}
              onChange={handleChange}
              className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-[#111111] block mb-1">
              Default Meta Title Template
            </label>
            <input
              type="text"
              name="defaultMetaTitle"
              value={settings.defaultMetaTitle}
              onChange={handleChange}
              className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-[#111111] block mb-1">
              Default Meta Description Template
            </label>
            <textarea
              name="defaultMetaDescription"
              rows={3}
              value={settings.defaultMetaDescription}
              onChange={handleChange}
              className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl p-3"
            />
          </div>
        </div>
      </div>

      {/* 5. Multi-Tenant Onboarding & Commission Economics */}
      <div className="bg-white p-6 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#E4E4E0]">
          <ShieldCheck size={16} className="text-[#0F5132]" />
          <span>5. European Maker Onboarding & Marketplace Economics</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 p-4 bg-[#F7F7F5] rounded-xl border border-[#E4E4E0] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#111111] block">
                Instant Merchant Onboarding (Auto-Approve Applications)
              </span>
              <span className="text-[11px] text-[#666660]">
                When enabled, applications on /sell-with-us instantly provision an active brand profile with direct /portal access without manual review.
              </span>
            </div>
            <input
              type="checkbox"
              name="autoApproveMerchants"
              checked={settings.autoApproveMerchants || false}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, autoApproveMerchants: e.target.checked }))
              }
              className="w-5 h-5 accent-[#0F5132] rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#111111] block mb-1">
              Default Platform Commission Rate (%)
            </label>
            <input
              type="number"
              name="defaultCommissionRate"
              min="0"
              max="100"
              value={settings.defaultCommissionRate ?? 15}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  defaultCommissionRate: parseFloat(e.target.value) || 0,
                }))
              }
              className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111]"
            />
            <span className="text-[10px] text-[#666660] mt-1 block">
              Makers receive 100% minus this percentage (Default: 15% platform, 85% maker payout).
            </span>
          </div>
        </div>
      </div>

      {/* 6. Multi-Currency Engine & Real-Time Exchange Rates */}
      <div className="bg-white p-6 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E4E4E0] gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
              <DollarSign size={16} className="text-[#0F5132]" />
              <span>6. Multi-Currency Engine & Live Exchange Rates</span>
            </h3>
            <p className="text-[11px] text-[#666660] mt-0.5">
              Base store currency is Euro (€ EUR). All international currencies convert automatically across product pages, cart, and checkout.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSyncLiveRates}
            disabled={isSyncingRates}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#0F5132] border border-emerald-200 rounded-xl text-xs font-bold transition-all shrink-0"
          >
            <RefreshCw size={13} className={isSyncingRates ? 'animate-spin' : ''} />
            <span>{isSyncingRates ? 'Fetching ECB Rates...' : 'Sync Real-Time Forex Rates'}</span>
          </button>
        </div>

        {rateSyncMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-[#0F5132] flex items-center gap-2">
            <CheckCircle2 size={15} />
            <span>{rateSyncMsg}</span>
          </div>
        )}

        {/* Currency Rates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* EUR */}
          <div className="p-4 bg-[#FAFAF8] border border-[#E4E4E0] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                <span>🇪🇺</span>
                <span>EUR (€)</span>
              </span>
              <span className="text-[10px] font-bold bg-[#E8F3EE] text-[#0F5132] px-2 py-0.5 rounded-md">
                Base (1.00)
              </span>
            </div>
            <p className="text-xs text-[#666660]">European Euro</p>
            <p className="text-xs font-mono font-bold text-[#111111] mt-2">€38.00 = €38.00</p>
          </div>

          {/* USD */}
          <div className="p-4 bg-white border border-[#E4E4E0] rounded-xl shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                <span>🇺🇸</span>
                <span>USD ($)</span>
              </span>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                Active
              </span>
            </div>
            <label className="text-[10px] font-semibold text-[#666660] block mb-1">
              Rate against 1 EUR
            </label>
            <input
              type="number"
              step="0.0001"
              value={rates.USD ?? 1.1603}
              onChange={(e) => handleRateChange('USD', parseFloat(e.target.value) || 1)}
              className="w-full text-xs font-mono font-bold bg-[#FAFAF8] border border-[#E4E4E0] rounded-lg px-2.5 py-1.5 focus:border-[#0F5132] focus:outline-none"
            />
            <p className="text-[11px] text-[#0F5132] font-semibold mt-2">
              €38.00 = ${(38 * (rates.USD ?? 1.1603)).toFixed(2)} USD
            </p>
          </div>

          {/* GBP */}
          <div className="p-4 bg-white border border-[#E4E4E0] rounded-xl shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                <span>🇬🇧</span>
                <span>GBP (£)</span>
              </span>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                Active
              </span>
            </div>
            <label className="text-[10px] font-semibold text-[#666660] block mb-1">
              Rate against 1 EUR
            </label>
            <input
              type="number"
              step="0.0001"
              value={rates.GBP ?? 0.854}
              onChange={(e) => handleRateChange('GBP', parseFloat(e.target.value) || 1)}
              className="w-full text-xs font-mono font-bold bg-[#FAFAF8] border border-[#E4E4E0] rounded-lg px-2.5 py-1.5 focus:border-[#0F5132] focus:outline-none"
            />
            <p className="text-[11px] text-[#0F5132] font-semibold mt-2">
              €38.00 = £{(38 * (rates.GBP ?? 0.854)).toFixed(2)} GBP
            </p>
          </div>

          {/* CHF */}
          <div className="p-4 bg-white border border-[#E4E4E0] rounded-xl shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                <span>🇨🇭</span>
                <span>CHF</span>
              </span>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                Active
              </span>
            </div>
            <label className="text-[10px] font-semibold text-[#666660] block mb-1">
              Rate against 1 EUR
            </label>
            <input
              type="number"
              step="0.0001"
              value={rates.CHF ?? 0.945}
              onChange={(e) => handleRateChange('CHF', parseFloat(e.target.value) || 1)}
              className="w-full text-xs font-mono font-bold bg-[#FAFAF8] border border-[#E4E4E0] rounded-lg px-2.5 py-1.5 focus:border-[#0F5132] focus:outline-none"
            />
            <p className="text-[11px] text-[#0F5132] font-semibold mt-2">
              €38.00 = {(38 * (rates.CHF ?? 0.945)).toFixed(2)} CHF
            </p>
          </div>
        </div>

        {lastUpdated && (
          <p className="text-[10px] text-[#666660]">
            Last exchange rates sync timestamp: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}
      </div>

      {/* 8. SEO, Webmaster & Marketing Tracking (Google, Meta, GA4, GTM) */}
      <div className="bg-white p-6 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E0]">
          <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
            <Search size={16} className="text-[#0F5132]" />
            <span>8. SEO, Webmaster & Marketing Tracking</span>
          </h3>
          <span className="text-[11px] font-semibold text-[#0F5132] bg-[#E8F3EE] px-2.5 py-1 rounded-full flex items-center gap-1">
            <Sparkles size={12} />
            Live Auto-Injection
          </span>
        </div>

        <p className="text-xs text-[#666660] leading-relaxed">
          Easily connect Google Search Console, Google Analytics 4, Meta (Facebook/Instagram) Pixel, and custom tags. Verification tags and tracking scripts are dynamically injected into the site headers automatically.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Google Search Console */}
          <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E4E4E0] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                <Search size={14} className="text-[#0F5132]" />
                <span>Google Search Console HTML Tag / Code</span>
              </label>
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#0F5132] hover:underline flex items-center gap-1 font-medium"
              >
                <span>Open Console</span>
                <ExternalLink size={10} />
              </a>
            </div>
            <input
              type="text"
              name="googleSiteVerification"
              value={settings.googleSiteVerification || ''}
              onChange={handleChange}
              placeholder='Paste full <meta name="..." content="..." /> or code'
              className="w-full text-xs font-mono bg-white border border-[#E4E4E0] rounded-lg px-3 py-2 text-[#111111] focus:outline-none focus:border-[#0F5132]"
            />
            <div className="flex items-start gap-1.5 text-[10px] text-[#666660] leading-relaxed">
              <FileCheck size={13} className="text-[#0F5132] shrink-0 mt-0.5" />
              <span>
                <strong>Tip:</strong> You can paste the entire HTML tag from Google or just the content code. If Google gave you an HTML file (e.g. <code>google123.html</code>), the server automatically verifies it!
              </span>
            </div>
          </div>

          {/* Google Analytics 4 (GA4) */}
          <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E4E4E0] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                <BarChart2 size={14} className="text-[#0F5132]" />
                <span>Google Analytics 4 (Measurement ID)</span>
              </label>
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#0F5132] hover:underline flex items-center gap-1 font-medium"
              >
                <span>Analytics</span>
                <ExternalLink size={10} />
              </a>
            </div>
            <input
              type="text"
              name="googleAnalyticsId"
              value={settings.googleAnalyticsId || ''}
              onChange={handleChange}
              placeholder="e.g. G-ABC1234XYZ"
              className="w-full text-xs font-mono bg-white border border-[#E4E4E0] rounded-lg px-3 py-2 text-[#111111] focus:outline-none focus:border-[#0F5132]"
            />
            <p className="text-[10px] text-[#666660]">
              Loads Google Tag (<code className="bg-gray-100 px-1 py-0.5 rounded">gtag.js</code>) on all pages for real-time traffic and e-commerce tracking.
            </p>
          </div>

          {/* Meta (Facebook/Instagram) Pixel */}
          <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E4E4E0] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                <Target size={14} className="text-[#0F5132]" />
                <span>Meta Pixel ID (Facebook / IG Ads)</span>
              </label>
              <a
                href="https://business.facebook.com/events_manager"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#0F5132] hover:underline flex items-center gap-1 font-medium"
              >
                <span>Events Manager</span>
                <ExternalLink size={10} />
              </a>
            </div>
            <input
              type="text"
              name="metaPixelId"
              value={settings.metaPixelId || ''}
              onChange={handleChange}
              placeholder="e.g. 1234567890123456"
              className="w-full text-xs font-mono bg-white border border-[#E4E4E0] rounded-lg px-3 py-2 text-[#111111] focus:outline-none focus:border-[#0F5132]"
            />
            <p className="text-[10px] text-[#666660]">
              Tracks pageviews, catalog browsing, and ad conversion performance for Instagram/Facebook ads.
            </p>
          </div>

          {/* Google Tag Manager (GTM) */}
          <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E4E4E0] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                <Code size={14} className="text-[#0F5132]" />
                <span>Google Tag Manager (GTM ID)</span>
              </label>
              <a
                href="https://tagmanager.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#0F5132] hover:underline flex items-center gap-1 font-medium"
              >
                <span>GTM</span>
                <ExternalLink size={10} />
              </a>
            </div>
            <input
              type="text"
              name="googleTagManagerId"
              value={settings.googleTagManagerId || ''}
              onChange={handleChange}
              placeholder="e.g. GTM-XXXXXXX"
              className="w-full text-xs font-mono bg-white border border-[#E4E4E0] rounded-lg px-3 py-2 text-[#111111] focus:outline-none focus:border-[#0F5132]"
            />
            <p className="text-[10px] text-[#666660]">
              Optional: Use GTM if managing complex third-party tags, remarketing, or triggers.
            </p>
          </div>

          {/* Bing Webmaster Verification */}
          <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E4E4E0] space-y-2">
            <label className="text-xs font-bold text-[#111111] block">
              Bing Webmaster Verification Code
            </label>
            <input
              type="text"
              name="bingSiteVerification"
              value={settings.bingSiteVerification || ''}
              onChange={handleChange}
              placeholder="e.g. msvalidate.01 token"
              className="w-full text-xs font-mono bg-white border border-[#E4E4E0] rounded-lg px-3 py-2 text-[#111111] focus:outline-none focus:border-[#0F5132]"
            />
            <p className="text-[10px] text-[#666660]">
              Adds <code className="bg-gray-100 px-1 py-0.5 rounded">&lt;meta name=&quot;msvalidate.01&quot;&gt;</code> for Bing / Yahoo indexing.
            </p>
          </div>

          {/* Pinterest Verification */}
          <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E4E4E0] space-y-2">
            <label className="text-xs font-bold text-[#111111] block">
              Pinterest Domain Verification Token
            </label>
            <input
              type="text"
              name="pinterestVerification"
              value={settings.pinterestVerification || ''}
              onChange={handleChange}
              placeholder="e.g. p:domain_verify token"
              className="w-full text-xs font-mono bg-white border border-[#E4E4E0] rounded-lg px-3 py-2 text-[#111111] focus:outline-none focus:border-[#0F5132]"
            />
            <p className="text-[10px] text-[#666660]">
              Verifies claim for Pinterest Business and Rich Pins.
            </p>
          </div>
        </div>

        {/* Custom Head Scripts */}
        <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E4E4E0] space-y-2 mt-4">
          <label className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
            <Code size={14} className="text-[#0F5132]" />
            <span>Custom Head & Tracking Scripts (Advanced)</span>
          </label>
          <textarea
            name="customHeadScripts"
            value={settings.customHeadScripts || ''}
            onChange={handleChange}
            rows={3}
            placeholder="<!-- Paste custom tracking scripts here (e.g. TikTok Pixel, Hotjar, Microsoft Clarity, etc.) -->"
            className="w-full text-xs font-mono bg-white border border-[#E4E4E0] rounded-lg px-3 py-2 text-[#111111] focus:outline-none focus:border-[#0F5132]"
          />
          <p className="text-[10px] text-[#666660]">
            Any raw HTML/JavaScript tags pasted here will be injected safely on all storefront pages.
          </p>
        </div>
      </div>

      {/* Save Button */}
      <button
        type="submit"
        disabled={isSaving}
        className="px-8 py-4 bg-[#0F5132] hover:bg-[#0A3622] text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
      >
        <Save size={16} />
        <span>{isSaving ? 'Saving Changes...' : 'Save Global Settings & Apply Everywhere'}</span>
      </button>
    </form>
  );
}
