export type TenantStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING_REVIEW' | 'REJECTED';
export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
export type OrderStatus = 'PENDING_PAYMENT' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'SUPPORT' | 'MERCHANT';

export interface UserAccount {
  id: string;
  clerkId?: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId?: string | null; // Associated maker/tenant if role is MERCHANT
  createdAt: Date;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  status: TenantStatus;
  email?: string | null;
  country?: string | null;
  city?: string | null;
  story?: string | null;
  website?: string | null;
  commissionRate?: number; // e.g. 15 for 15% platform cut
  contactPerson?: string | null;
  ecoBadges?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  parent?: Category | null;
  children?: Category[];
  createdAt?: Date;
  updatedAt?: Date;
  _count?: {
    products: number;
  };
}

export interface ProductOption {
  name: string; // e.g., 'Color', 'Size'
  values: string[]; // e.g., ['Emerald', 'Midnight Black', 'Sand']
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  image?: string | null;
  optionValues: Record<string, string>; // e.g. { "Color": "Emerald", "Size": "M" }
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: string;
  productId: string;
  variantId?: string | null;
  url: string;
  altText?: string | null;
  order: number;
}

export interface Product {
  id: string;
  tenantId: string;
  categoryId: string;
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  compareAtPrice?: number | null;
  isFeatured: boolean;
  status: ProductStatus;
  seoScore: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  tags: string[];
  viewsCount?: number;
  cartAddCount?: number;
  ordersCount?: number;
  shippingTimeOverride?: string | null;
  returnsPolicyOverride?: string | null;
  materialTag?: string | null;
  customBadge?: string | null;
  tenant?: Tenant;
  category?: Category;
  variants: ProductVariant[];
  images: ProductImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  variantId: string;
  tenantId: string;
  title: string;
  variantTitle: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  selectedOptions: Record<string, string>;
  maxStock: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  tenantId: string;
  title: string;
  variantTitle: string;
  sku: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
  fulfillmentStatus?: 'PENDING' | 'SHIPPED';
  carrier?: string | null; // e.g. DHL Express, DPD, PostNord
  trackingNumber?: string | null;
  shippedAt?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  totalAmount: number;
  subtotal: number;
  shippingFee: number;
  discountAmount?: number;
  promoCode?: string | null;
  status: OrderStatus;
  trackingNumber?: string | null;
  notes?: string | null;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryRequest {
  id: string;
  name: string;
  suggestedParentId?: string | null;
  description: string;
  requestedByTenantId: string;
  requestedByTenantName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  author: string;
  isPublished: boolean;
  publishedAt?: Date | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  tags: string[];
  embeddedProductIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteSettings {
  id: string;
  storeName: string;
  tagline: string;
  logoUrl?: string | null;
  contactEmail: string;
  contactPhone: string;
  currencySymbol: string;
  currencyCode: string;
  announcementText?: string | null;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  lowStockThreshold: number;
  shippingBadgeTitle: string;
  shippingBadgeSubtitle: string;
  returnsBadgeTitle: string;
  returnsBadgeSubtitle: string;
  guaranteeBadgeTitle: string;
  guaranteeBadgeSubtitle: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  carbonNeutralBadge: string;
  autoApproveMerchants: boolean; // Instant merchant onboarding toggle
  defaultCommissionRate: number; // e.g. 15 for 15% platform take
}

export type CurrencyCode = 'EUR' | 'GBP' | 'USD' | 'CHF';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  rate: number; // Against EUR (base: 1.00)
}

export type PromoDiscountType = 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: PromoDiscountType;
  discountValue: number; // e.g. 10 for 10%, 25 for 25 EUR
  minSpend?: number;
  isActive: boolean;
  usageCount: number;
  maxUses?: number;
  expiresAt?: string | null;
}

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  authorLocation: string; // e.g., 'Milan, Italy'
  rating: number; // 1 to 5
  title: string;
  comment: string;
  isVerifiedBuyer: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface AbandonedCart {
  id: string;
  customerEmail: string;
  customerName?: string;
  items: CartItem[];
  subtotal: number;
  lastActiveAt: string;
  recovered: boolean;
  recoveryEmailSent: boolean;
  recoverySentAt?: string | null;
}
