import React from 'react';
import { getAbandonedCarts } from '@/lib/data-service';
import { AbandonedCartsClient } from '@/components/admin/AbandonedCartsClient';

export const dynamic = 'force-dynamic';

export default async function AdminAbandonedCartsPage() {
  const carts = await getAbandonedCarts();
  return <AbandonedCartsClient initialCarts={carts} />;
}
