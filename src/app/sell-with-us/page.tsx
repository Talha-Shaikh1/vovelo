'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Globe,
  Leaf,
  CheckCircle2,
  ArrowRight,
  Store,
  Clock,
  Euro,
} from 'lucide-react';

const EUROPEAN_COUNTRIES = [
  'Denmark',
  'Germany',
  'Italy',
  'France',
  'Sweden',
  'Portugal',
  'Netherlands',
  'Austria',
  'Spain',
  'Belgium',
  'United Kingdom',
  'Switzerland',
];

const ECO_STANDARDS = [
  'GOTS Certified Organic',
  'OEKO-TEX® Standard 100',
  'ZQ Certified Merino Wool',
  '100% Vegetable-Tanned Leather',
  'Recycled Ballistic Materials',
  'Zero-Waste 3D Knitting',
  'Circular / Repair Guarantee',
];

export default function SellWithUsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [autoApproved, setAutoApproved] = useState(false);
  const [createdTenantSlug, setCreatedTenantSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [website, setWebsite] = useState('');
  const [story, setStory] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<string[]>(['GOTS Certified Organic']);

  const handleToggleBadge = (badge: string) => {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !city || !story || !contactPerson) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/tenants/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          contactPerson,
          country,
          city,
          website,
          story,
          ecoBadges: selectedBadges,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setAutoApproved(data.autoApproved);
        setCreatedTenantSlug(data.tenant.slug);
      } else {
        setError(data.error || 'Failed to submit application.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#111111]">
      <Header announcement="Calling Luxury Merchants & Independent Designers" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center">
          <div className="inline-flex items-center gap-1.5 bg-[#E8F3EE] text-[#0F5132] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={13} />
            <span>Maker Partnership Program</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#111111] max-w-3xl mx-auto leading-tight">
            Crafted in Europe. Dispatched Directly. Zero Customer Friction.
          </h1>

          <p className="text-sm sm:text-base text-[#666660] max-w-2xl mx-auto mt-4 leading-relaxed">
            Volvelo unites premier independent brands under one shared domain so search ranking and customer trust accumulate exponentially. You fulfill, while we handle conversion.
          </p>

          {/* Pillars Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12 text-left">
            <div className="bg-white p-6 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#E8F3EE] text-[#0F5132] flex items-center justify-center font-bold">
                <Euro size={18} />
              </div>
              <h3 className="text-sm font-bold text-[#111111]">85% Net Maker Payout</h3>
              <p className="text-xs text-[#666660] leading-relaxed">
                Simple 15% marketplace commission. No hidden monthly software fees or listing charges.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#E8F3EE] text-[#0F5132] flex items-center justify-center font-bold">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-sm font-bold text-[#111111]">100% Guest Checkout</h3>
              <p className="text-xs text-[#666660] leading-relaxed">
                Zero forced account walls for buyers. Rapid conversion from customers worldwide.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#E8F3EE] text-[#0F5132] flex items-center justify-center font-bold">
                <Globe size={18} />
              </div>
              <h3 className="text-sm font-bold text-[#111111]">Dedicated Brand Page</h3>
              <p className="text-xs text-[#666660] leading-relaxed">
                Your own verified brand profile page showcasing your craftsmanship and catalog.
              </p>
            </div>
          </div>
        </section>

        {/* Application Form Section */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E4E4E0] shadow-xl">
            {submitted ? (
              <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-[#E8F3EE] text-[#0F5132] flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#111111]">
                    {autoApproved ? 'Welcome to Volvelo Brand Portal!' : 'Application Submitted for Review'}
                  </h2>
                  <p className="text-xs text-[#666660] max-w-md mx-auto mt-2 leading-relaxed">
                    {autoApproved
                      ? 'Your brand has been instantly provisioned. You can now access your Merchant Portal to list products and fulfill orders.'
                      : 'Our curation team reviews maker applications within 24 hours to ensure verified production standards.'}
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/portal"
                    className="w-full sm:w-auto px-6 py-3 bg-[#0F5132] text-white text-xs font-bold rounded-xl hover:bg-[#0A3622] transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <Store size={15} />
                    <span>Enter Merchant Portal</span>
                  </Link>

                  {createdTenantSlug && (
                    <Link
                      href={`/brand/${createdTenantSlug}`}
                      className="w-full sm:w-auto px-6 py-3 bg-white text-[#111111] border border-[#E4E4E0] text-xs font-semibold rounded-xl hover:bg-[#F0F0EC] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Preview Brand Page</span>
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#111111] tracking-tight">
                    Partner Registration
                  </h2>
                  <p className="text-xs text-[#666660] mt-0.5">
                    Tell us about your workshop, European crafting heritage, and sustainable practices.
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                      Brand / Merchant Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nordic Heritage"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E4E4E0] rounded-xl text-xs focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lars Møller"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E4E4E0] rounded-xl text-xs focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="merchant@brand.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E4E4E0] rounded-xl text-xs focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                      Website or Instagram (optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://nordicbrand.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E4E4E0] rounded-xl text-xs focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                      Workshop Country *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Switzerland, Germany, France, Italy, Pakistan..."
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E4E4E0] rounded-xl text-xs focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                      City / Region *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Copenhagen"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E4E4E0] rounded-xl text-xs focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                    Brand Craft Story & Materials *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your manufacturing heritage, material sources (e.g. Italian calfskin, ZQ Merino, recycled canvas), and packaging standards..."
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E4E4E0] rounded-xl text-xs focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                  />
                </div>

                {/* Eco Certification Badges */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-2">
                    Eco & Craft Credentials (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ECO_STANDARDS.map((badge) => {
                      const isSelected = selectedBadges.includes(badge);
                      return (
                        <button
                          key={badge}
                          type="button"
                          onClick={() => handleToggleBadge(badge)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#0F5132] text-white border-[#0F5132] font-semibold'
                              : 'bg-white text-neutral-700 border-[#E4E4E0] hover:bg-[#F0F0EC]'
                          }`}
                        >
                          <Leaf size={11} className={isSelected ? 'text-emerald-300' : 'text-[#0F5132]'} />
                          <span>{badge}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E4E4E0] flex items-center justify-between">
                  <span className="text-[11px] text-[#666660]">
                    Direct European Dropshipping Agreement
                  </span>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-[#0F5132] hover:bg-[#0A3622] text-white font-bold text-xs rounded-xl transition-all shadow-md disabled:opacity-50"
                  >
                    {loading ? 'Submitting Application...' : 'Apply as European Maker'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
