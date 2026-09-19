import React from 'react';
import { getAllUsers, getAllTenants } from '@/lib/data-service';
import { StaffManagerClient } from '@/components/admin/StaffManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminStaffPage() {
  const [users, tenants] = await Promise.all([
    getAllUsers(),
    getAllTenants(),
  ]);

  return <StaffManagerClient initialUsers={users} tenants={tenants} />;
}
