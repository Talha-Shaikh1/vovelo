import React from 'react';
import { getAllTenants } from '@/lib/data-service';
import { TenantsManagerClient } from '@/components/admin/TenantsManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminTenantsPage() {
  const tenants = await getAllTenants();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Tenants & European Makers
        </h1>
        <p className="text-xs text-[#666660] mt-1">
          Manage seller entities and instant storefront visibility toggles.
        </p>
      </div>

      <TenantsManagerClient initialTenants={tenants} />
    </div>
  );
}
