import React from 'react';
import { getAllPromoCodes } from '@/lib/data-service';
import { PromosManagerClient } from '@/components/admin/PromosManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminPromosPage() {
  const promos = await getAllPromoCodes();
  return <PromosManagerClient initialPromos={promos} />;
}
