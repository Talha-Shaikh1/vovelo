import React from 'react';
import { getSiteSettings } from '@/lib/data-service';
import { SiteSettingsClient } from '@/components/admin/SiteSettingsClient';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Centralized Configuration
        </h1>
        <p className="text-xs text-[#666660] mt-1">
          Single source of truth. Updates here reflect across all storefront headers, footers, and SEO tags.
        </p>
      </div>

      <SiteSettingsClient initialSettings={settings} />
    </div>
  );
}
