import { toast } from '@/lib/toast-store';

export interface SingleProductOrderPayload {
  productTitle: string;
  variantTitle?: string;
  sku?: string;
  quantity?: number;
  productSlug?: string;
  productUrl?: string;
  instagramHandle?: string;
}

export interface CartItemOrderPayload {
  title: string;
  variantTitle?: string;
  sku?: string;
  quantity: number;
}

export function getCleanInstagramHandle(handle?: string | null): string {
  if (!handle) return 'vovelo';
  return handle.replace(/^@+/, '').trim() || 'vovelo';
}

export function getInstagramDmUrl(handle?: string | null): string {
  const cleanHandle = getCleanInstagramHandle(handle);
  // ig.me/m/<username> opens Instagram DM directly in the native app on iOS/Android or in browser on desktop
  return `https://ig.me/m/${cleanHandle}`;
}

export function getInstagramProfileUrl(handle?: string | null): string {
  const cleanHandle = getCleanInstagramHandle(handle);
  return `https://instagram.com/${cleanHandle}`;
}

export function buildSingleProductMessage({
  productTitle,
  variantTitle,
  sku,
  quantity = 1,
  productUrl,
}: SingleProductOrderPayload): string {
  const currentUrl =
    productUrl ||
    (typeof window !== 'undefined' ? window.location.href : '');

  const lines = [
    `👋 Hello Vovelo Concierge!`,
    `I would like to order the following item:`,
    ``,
    `🛍️ Product: ${productTitle}`,
  ];

  if (variantTitle && variantTitle !== 'Standard') {
    lines.push(`🏷️ Selected Variant: ${variantTitle}`);
  }

  if (sku) {
    lines.push(`🔖 SKU: ${sku}`);
  }

  if (quantity > 1) {
    lines.push(`🔢 Quantity: ${quantity}`);
  }

  if (currentUrl) {
    lines.push(`🔗 Product Link: ${currentUrl}`);
  }

  lines.push(``);
  lines.push(`Please confirm availability, price, and dispatch time. Thank you!`);

  return lines.join('\n');
}

export function buildMultiItemCartMessage(
  items: CartItemOrderPayload[],
  storeUrl?: string
): string {
  const siteUrl =
    storeUrl ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://vovelo.vercel.app');

  const lines = [
    `👋 Hello Vovelo Concierge!`,
    `I would like to place an order for the following items:`,
    ``,
  ];

  items.forEach((item, index) => {
    const variantInfo =
      item.variantTitle && item.variantTitle !== 'Standard'
        ? ` (${item.variantTitle})`
        : '';
    lines.push(`${index + 1}. 🛍️ ${item.title}${variantInfo} x ${item.quantity}`);
    if (item.sku) {
      lines.push(`   🔖 SKU: ${item.sku}`);
    }
  });

  lines.push(``);
  lines.push(`🌐 From Store: ${siteUrl}`);
  lines.push(``);
  lines.push(`Please let me know total pricing, payment method, and shipping details. Thank you!`);

  return lines.join('\n');
}

/**
 * Copies the message to clipboard and redirects to Instagram direct message
 */
export async function initiateInstagramOrder(
  payload: SingleProductOrderPayload
): Promise<void> {
  const message = buildSingleProductMessage(payload);
  const dmUrl = getInstagramDmUrl(payload.instagramHandle);

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(message);
    }
  } catch (err) {
    console.warn('Clipboard write failed:', err);
  }

  toast.success(
    'Order Message Copied! 📋',
    'Opening Instagram chat... Paste the message in DM to complete your order.'
  );

  if (typeof window !== 'undefined') {
    // Open in new tab/window
    window.open(dmUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Copies multi-item cart message to clipboard and redirects to Instagram direct message
 */
export async function initiateMultiItemInstagramOrder(
  items: CartItemOrderPayload[],
  instagramHandle?: string
): Promise<void> {
  if (!items || items.length === 0) return;

  const message = buildMultiItemCartMessage(items);
  const dmUrl = getInstagramDmUrl(instagramHandle);

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(message);
    }
  } catch (err) {
    console.warn('Clipboard write failed:', err);
  }

  toast.success(
    'Bag Summary Copied! 📋',
    'Opening Instagram chat... Paste the message in DM to complete your order.'
  );

  if (typeof window !== 'undefined') {
    window.open(dmUrl, '_blank', 'noopener,noreferrer');
  }
}
