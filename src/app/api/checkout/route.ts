import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/data-service';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      shippingFee,
      totalAmount,
      notes,
    } = body;

    // Strict input validation & sanitization
    if (
      !customerName ||
      typeof customerName !== 'string' ||
      customerName.trim().length === 0 ||
      customerName.length > 100
    ) {
      return NextResponse.json(
        { success: false, error: 'Valid customer name is required (max 100 characters).' },
        { status: 400 }
      );
    }

    if (
      !customerEmail ||
      typeof customerEmail !== 'string' ||
      !EMAIL_REGEX.test(customerEmail.trim()) ||
      customerEmail.length > 150
    ) {
      return NextResponse.json(
        { success: false, error: 'Valid customer email address is required.' },
        { status: 400 }
      );
    }

    if (
      !shippingAddress ||
      typeof shippingAddress !== 'object' ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.country
    ) {
      return NextResponse.json(
        { success: false, error: 'Valid shipping street, city, and country are required.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one valid item.' },
        { status: 400 }
      );
    }

    // Validate each order line item against negative or NaN injection
    for (const item of items) {
      if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return NextResponse.json(
          { success: false, error: 'Invalid line item quantity or product ID detected.' },
          { status: 400 }
        );
      }
    }

    const parsedSubtotal = parseFloat(subtotal);
    const parsedShippingFee = parseFloat(shippingFee);
    const parsedTotalAmount = parseFloat(totalAmount);

    if (
      isNaN(parsedSubtotal) ||
      isNaN(parsedShippingFee) ||
      isNaN(parsedTotalAmount) ||
      parsedTotalAmount < 0
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid numerical financial totals.' },
        { status: 400 }
      );
    }

    const order = await createOrder({
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: typeof customerPhone === 'string' ? customerPhone.trim().slice(0, 30) : '',
      shippingAddress: {
        street: String(shippingAddress.street).trim().slice(0, 200),
        city: String(shippingAddress.city).trim().slice(0, 100),
        state: String(shippingAddress.state || '').trim().slice(0, 100),
        postalCode: String(shippingAddress.postalCode || '').trim().slice(0, 20),
        country: String(shippingAddress.country).trim().slice(0, 100),
      },
      items,
      subtotal: parsedSubtotal,
      shippingFee: parsedShippingFee,
      totalAmount: parsedTotalAmount,
      notes: typeof notes === 'string' ? notes.trim().slice(0, 500) : undefined,
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('[Checkout Security Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Order processing encountered an internal error.' },
      { status: 500 }
    );
  }
}
