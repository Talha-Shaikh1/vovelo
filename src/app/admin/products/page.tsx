import React from 'react';
import { getProducts, getCategories, getAllTenants } from '@/lib/data-service';
import { ProductsManagerClient } from '@/components/admin/ProductsManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const [products, categories, tenants] = await Promise.all([
    getProducts({ includeInactiveTenants: true }),
    getCategories(),
    getAllTenants(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Product & Variant Matrix
        </h1>
        <p className="text-xs text-[#666660] mt-1">
          Control SKUs, prices, stock levels, and SEO ranking boosts.
        </p>
      </div>

      <ProductsManagerClient
        initialProducts={products}
        categories={categories}
        tenants={tenants}
      />
    </div>
  );
}
