import React from 'react';
import { getCategories, getCategoryRequests } from '@/lib/data-service';
import { CategoriesManagerClient } from '@/components/admin/CategoriesManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const [categories, requests] = await Promise.all([
    getCategories(),
    getCategoryRequests(),
  ]);

  return (
    <CategoriesManagerClient
      initialCategories={categories}
      initialRequests={requests}
    />
  );
}
