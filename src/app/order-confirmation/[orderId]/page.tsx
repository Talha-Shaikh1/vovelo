import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderById } from '@/lib/data-service';
import { formatPrice } from '@/lib/utils';
import { OrderConfirmationClient } from '@/components/storefront/OrderConfirmationClient';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';

export const dynamic = 'force-dynamic';

interface OrderConfirmationProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationProps) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#111111]">
      <Header announcement={null} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <OrderConfirmationClient order={order} />
      </main>

      <Footer />
    </div>
  );
}
