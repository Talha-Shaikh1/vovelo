import { prisma } from './db';
import {
  mockCategories,
  mockProducts,
  mockTenants,
  mockBlogPosts,
  mockSiteSettings,
  mockOrders,
  mockPromoCodes,
  mockReviews,
  mockAbandonedCarts,
  mockUsers,
  mockCategoryRequests,
} from './mock-data';
import {
  Product,
  ProductVariant,
  Category,
  Tenant,
  BlogPost,
  SiteSettings,
  Order,
  OrderStatus,
  PromoCode,
  ProductReview,
  AbandonedCart,
  UserAccount,
  UserRole,
  CategoryRequest,
} from './types';
import { calculateSeoScore } from './ranking';
import { syncUserRoleToClerk } from './clerk-sync';

// In-memory runtime state for mutations when DB is offline or mock mode
let runtimeProducts = [...mockProducts];
let runtimeTenants = [...mockTenants];
let runtimeCategories = [...mockCategories];
let runtimeOrders = [...mockOrders];
let runtimeBlogPosts = [...mockBlogPosts];
let runtimeSettings = { ...mockSiteSettings };
let runtimePromoCodes = [...mockPromoCodes];
let runtimeReviews = [...mockReviews];
let runtimeAbandonedCarts = [...mockAbandonedCarts];
let runtimeUsers = [...mockUsers];
let runtimeCategoryRequests = [...mockCategoryRequests];

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });
    if (settings) return settings as unknown as SiteSettings;
  } catch {
    // fallback to runtime/mock settings
  }
  return runtimeSettings;
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  try {
    const updated = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: data,
      create: { id: 'default', ...data },
    });
    return updated as unknown as SiteSettings;
  } catch {
    runtimeSettings = { ...runtimeSettings, ...data };
    return runtimeSettings;
  }
}

export async function getActiveTenants(): Promise<Tenant[]> {
  try {
    const tenants = await prisma.tenant.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { name: 'asc' },
    });
    if (tenants.length > 0) return tenants as unknown as Tenant[];
  } catch {}
  return runtimeTenants.filter((t) => t.status === 'ACTIVE');
}

export async function getAllTenants(): Promise<Tenant[]> {
  try {
    const tenants = await prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (tenants.length > 0) return tenants as unknown as Tenant[];
  } catch {}
  return runtimeTenants;
}

export async function toggleTenantStatus(id: string): Promise<Tenant | null> {
  try {
    const existing = await prisma.tenant.findUnique({ where: { id } });
    if (existing) {
      const nextStatus = existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const updated = await prisma.tenant.update({
        where: { id },
        data: { status: nextStatus },
      });
      return updated as unknown as Tenant;
    }
  } catch {}

  const idx = runtimeTenants.findIndex((t) => t.id === id);
  if (idx > -1) {
    runtimeTenants[idx].status =
      runtimeTenants[idx].status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    return runtimeTenants[idx];
  }
  return null;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    if (categories.length > 0) return categories as unknown as Category[];
  } catch {}
  return runtimeCategories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        children: true,
      },
    });
    if (category) return category as unknown as Category;
  } catch {}
  return runtimeCategories.find((c) => c.slug === slug) || null;
}

export interface ProductQueryParams {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'seo' | 'price_asc' | 'price_desc' | 'newest';
  inStockOnly?: boolean;
  search?: string;
  tenantSlug?: string;
  limit?: number;
  featuredOnly?: boolean;
  includeInactiveTenants?: boolean;
}

export async function getProducts(params: ProductQueryParams = {}): Promise<Product[]> {
  const {
    categorySlug,
    minPrice,
    maxPrice,
    sort = 'seo',
    inStockOnly,
    search,
    tenantSlug,
    limit,
    featuredOnly,
    includeInactiveTenants = false,
  } = params;

  try {
    // Try database
    const activeTenants = await prisma.tenant.findMany({
      where: includeInactiveTenants ? {} : { status: 'ACTIVE' },
      select: { id: true },
    });
    const allowedTenantIds = activeTenants.map((t: any) => t.id);

    const whereClause: any = {
      tenantId: { in: allowedTenantIds },
      status: 'ACTIVE',
    };

    if (categorySlug) {
      whereClause.category = { slug: categorySlug };
    }
    if (tenantSlug) {
      whereClause.tenant = { slug: tenantSlug };
    }
    if (featuredOnly) {
      whereClause.isFeatured = true;
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.basePrice = {};
      if (minPrice !== undefined) whereClause.basePrice.gte = minPrice;
      if (maxPrice !== undefined) whereClause.basePrice.lte = maxPrice;
    }
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } },
      ];
    }

    let orderBy: any = { seoScore: 'desc' };
    if (sort === 'price_asc') orderBy = { basePrice: 'asc' };
    if (sort === 'price_desc') orderBy = { basePrice: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        variants: true,
        images: { orderBy: { order: 'asc' } },
        tenant: true,
        category: true,
      },
      orderBy,
      take: limit,
    });

    if (products.length > 0) {
      let result = products as unknown as Product[];
      if (inStockOnly) {
        result = result.filter((p) =>
          p.variants.some((v) => v.stock > 0)
        );
      }
      return result;
    }
  } catch {}

  // Fallback to runtime memory / mock products
  let filtered = runtimeProducts.filter((p) => {
    // Tenant active check
    const tenant = runtimeTenants.find((t) => t.id === p.tenantId);
    if (!includeInactiveTenants && tenant && tenant.status !== 'ACTIVE') {
      return false;
    }
    if (categorySlug) {
      const cat = runtimeCategories.find((c) => c.slug === categorySlug);
      if (!cat) return false;
      const targetCategoryIds = [cat.id];
      if (cat.children && cat.children.length > 0) {
        cat.children.forEach((child) => targetCategoryIds.push(child.id));
      }
      runtimeCategories
        .filter((c) => c.parentId === cat.id)
        .forEach((c) => targetCategoryIds.push(c.id));

      if (!targetCategoryIds.includes(p.categoryId)) return false;
    }
    if (tenantSlug) {
      const t = runtimeTenants.find((ten) => ten.slug === tenantSlug);
      if (!t || p.tenantId !== t.id) return false;
    }
    if (featuredOnly && !p.isFeatured) return false;
    if (minPrice !== undefined && p.basePrice < minPrice) return false;
    if (maxPrice !== undefined && p.basePrice > maxPrice) return false;
    if (inStockOnly) {
      const hasStock = p.variants.some((v) => v.stock > 0);
      if (!hasStock) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const tenant = runtimeTenants.find((t) => t.id === p.tenantId);
      const category = runtimeCategories.find((c) => c.id === p.categoryId);
      const matches =
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        (tenant?.name && tenant.name.toLowerCase().includes(q)) ||
        (category?.name && category.name.toLowerCase().includes(q)) ||
        (category?.slug && category.slug.toLowerCase().includes(q));
      if (!matches) return false;
    }
    return true;
  });

  // Attach category and tenant objects
  filtered = filtered.map((p) => ({
    ...p,
    category: runtimeCategories.find((c) => c.id === p.categoryId),
    tenant: runtimeTenants.find((t) => t.id === p.tenantId),
  }));

  // Sort
  if (sort === 'price_asc') {
    filtered.sort((a, b) => a.basePrice - b.basePrice);
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => b.basePrice - a.basePrice);
  } else if (sort === 'newest') {
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else {
    // SEO score default
    filtered.sort((a, b) => b.seoScore - a.seoScore);
  }

  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  return filtered;
}

export interface PaginatedProductsResult {
  products: Product[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export async function getPaginatedProducts(
  params: ProductQueryParams & { page?: number; pageSize?: number } = {}
): Promise<PaginatedProductsResult> {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, Math.min(100, params.pageSize || 24));

  const allFiltered = await getProducts({ ...params, limit: undefined });
  const total = allFiltered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const validPage = Math.min(page, totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const products = allFiltered.slice(startIndex, startIndex + pageSize);

  return {
    products,
    total,
    totalPages,
    currentPage: validPage,
    pageSize,
  };
}

export async function getCuratedFeaturedProducts(limit: number = 64): Promise<Product[]> {
  const all = await getProducts();
  const categories = await getCategories();

  const curated: Product[] = [];
  const priorityCategorySlugs = [
    'bags',
    'footwear',
    'watches',
    'coats',
    'sunglasses',
    'belts',
    'jewelry',
    'wallets',
    'hats',
    'scarfs',
    't-shirts',
    'summer-wear',
    'belt-bags',
    'backpacks',
    'caps',
  ];

  // Group products by category slug
  const productsByCat: Record<string, Product[]> = {};
  for (const slug of priorityCategorySlugs) {
    const cat = categories.find((c) => c.slug === slug);
    if (cat) {
      productsByCat[slug] = all.filter((p) => p.categoryId === cat.id);
    }
  }

  // Round-robin selection across categories
  let maxPerCat = Math.ceil(limit / priorityCategorySlugs.length) + 3;
  for (let i = 0; i < maxPerCat; i++) {
    for (const slug of priorityCategorySlugs) {
      const catList = productsByCat[slug];
      if (catList && catList[i]) {
        if (!curated.some((c) => c.id === catList[i].id)) {
          curated.push(catList[i]);
        }
      }
      if (curated.length >= limit) break;
    }
    if (curated.length >= limit) break;
  }

  // Fill any remaining from all
  for (const p of all) {
    if (curated.length >= limit) break;
    if (!curated.some((c) => c.id === p.id)) {
      curated.push(p);
    }
  }

  return curated.slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: true,
        images: { orderBy: { order: 'asc' } },
        tenant: true,
        category: true,
      },
    });
    if (product) {
      // check tenant active
      if (product.tenant && product.tenant.status !== 'ACTIVE') {
        return null;
      }
      return product as unknown as Product;
    }
  } catch {}

  // 1. Direct match
  let p = runtimeProducts.find((item) => item.slug === slug);

  // 2. Redirect / Merged match (Search in redirectFromSlugs)
  if (!p) {
    p = runtimeProducts.find(
      (item) => item.redirectFromSlugs && item.redirectFromSlugs.includes(slug)
    );
  }

  // 3. Merged Into Child Lookup
  if (!p) {
    const mergedChild = runtimeProducts.find(
      (item) => item.slug === slug && item.mergedIntoProductId
    );
    if (mergedChild && mergedChild.mergedIntoProductId) {
      p = runtimeProducts.find((item) => item.id === mergedChild.mergedIntoProductId);
    }
  }

  if (!p) return null;

  const tenant = runtimeTenants.find((t) => t.id === p.tenantId);
  if (tenant && tenant.status !== 'ACTIVE') return null;

  return {
    ...p,
    category: runtimeCategories.find((c) => c.id === p.categoryId),
    tenant,
  };
}

export async function getRelatedProducts(
  categoryId: string,
  excludeProductId: string,
  limit: number = 4
): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: excludeProductId },
        status: 'ACTIVE',
        tenant: { status: 'ACTIVE' },
      },
      include: {
        variants: true,
        images: { orderBy: { order: 'asc' } },
        tenant: true,
        category: true,
      },
      orderBy: { seoScore: 'desc' },
      take: limit,
    });
    if (products.length > 0) return products as unknown as Product[];
  } catch {}

  return runtimeProducts
    .filter((p) => p.categoryId === categoryId && p.id !== excludeProductId)
    .filter((p) => {
      const t = runtimeTenants.find((ten) => ten.id === p.tenantId);
      return t?.status === 'ACTIVE';
    })
    .sort((a, b) => b.seoScore - a.seoScore)
    .slice(0, limit)
    .map((p) => ({
      ...p,
      category: runtimeCategories.find((c) => c.id === p.categoryId),
      tenant: runtimeTenants.find((t) => t.id === p.tenantId),
    }));
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
    });
    if (posts.length > 0) return posts as unknown as BlogPost[];
  } catch {}
  return runtimeBlogPosts.filter((b) => b.isPublished);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });
    if (post) return post as unknown as BlogPost;
  } catch {}
  return runtimeBlogPosts.find((b) => b.slug === slug) || null;
}

export async function getOrders(): Promise<Order[]> {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    if (orders.length > 0) return orders as unknown as Order[];
  } catch {}
  return runtimeOrders;
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: true,
      },
    });
    if (order) return order as unknown as Order;
  } catch {}
  return (
    runtimeOrders.find((o) => o.id === id || o.orderNumber === id) || null
  );
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string
): Promise<Order | null> {
  try {
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(trackingNumber ? { trackingNumber } : {}),
      },
      include: { items: true },
    });
    return updated as unknown as Order;
  } catch {}

  const idx = runtimeOrders.findIndex((o) => o.id === orderId);
  if (idx > -1) {
    runtimeOrders[idx].status = status;
    if (trackingNumber) {
      runtimeOrders[idx].trackingNumber = trackingNumber;
    }
    return runtimeOrders[idx];
  }
  return null;
}

export async function createOrder(data: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: any;
  items: Array<{
    productId: string;
    variantId: string;
    tenantId: string;
    title: string;
    variantTitle: string;
    sku: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  }>;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  notes?: string;
}): Promise<Order> {
  const orderNumber = `VOL-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        addressLine1: data.shippingAddress.addressLine1,
        addressLine2: data.shippingAddress.addressLine2 || null,
        city: data.shippingAddress.city,
        state: data.shippingAddress.state || null,
        postalCode: data.shippingAddress.postalCode,
        country: data.shippingAddress.country || 'DE',
        subtotal: data.subtotal,
        shippingFee: data.shippingFee,
        totalAmount: data.totalAmount,
        notes: data.notes || null,
        status: 'PENDING_PAYMENT',
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            tenantId: item.tenantId,
            title: item.title,
            variantTitle: item.variantTitle,
            sku: item.sku,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl || null,
          })),
        },
      },
      include: { items: true },
    });

    // Update product stats
    for (const item of data.items) {
      try {
        await prisma.product.update({
          where: { id: item.productId },
          data: { ordersCount: { increment: item.quantity } },
        });
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      } catch {}
    }

    return order as unknown as Order;
  } catch {
    // fallback runtime order creation
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      shippingAddress: data.shippingAddress,
      subtotal: data.subtotal,
      shippingFee: data.shippingFee,
      totalAmount: data.totalAmount,
      status: 'PENDING_PAYMENT',
      notes: data.notes,
      items: data.items.map((item, idx) => ({
        id: `oi-${Date.now()}-${idx}`,
        orderId: `ord-${Date.now()}`,
        ...item,
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    runtimeOrders.unshift(newOrder);

    // deduct stock in memory
    for (const item of data.items) {
      const prod = runtimeProducts.find((p) => p.id === item.productId);
      if (prod) {
        prod.ordersCount = (prod.ordersCount || 0) + item.quantity;
        const variant = prod.variants.find((v) => v.id === item.variantId);
        if (variant) {
          variant.stock = Math.max(0, variant.stock - item.quantity);
        }
      }
    }

    return newOrder;
  }
}

export async function createOrUpdateProduct(data: {
  id?: string;
  tenantId: string;
  categoryId: string;
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  compareAtPrice?: number | null;
  isFeatured?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  tags?: string[];
  shippingTimeOverride?: string | null;
  returnsPolicyOverride?: string | null;
  materialTag?: string | null;
  customBadge?: string | null;
  images: Array<{ url: string; altText?: string; order?: number }>;
  variants: Array<{
    id?: string;
    sku: string;
    price: number;
    compareAtPrice?: number | null;
    stock: number;
    image?: string | null;
    optionValues: Record<string, string>;
  }>;
}): Promise<Product> {
  const isEditing = Boolean(data.id);
  const productId = data.id || `prod-${Date.now()}`;

  const fullProduct: Product = {
    id: productId,
    tenantId: data.tenantId,
    categoryId: data.categoryId,
    title: data.title,
    slug: data.slug,
    description: data.description,
    basePrice: data.basePrice,
    compareAtPrice: data.compareAtPrice,
    isFeatured: data.isFeatured || false,
    status: 'ACTIVE',
    seoScore: calculateSeoScore({
      hasMetaTitle: Boolean(data.seoTitle),
      hasMetaDescription: Boolean(data.seoDescription),
      hasAltText: data.images.some((img) => Boolean(img.altText)),
      hasStructuredData: true,
      createdAt: new Date(),
      isFeatured: data.isFeatured,
    }),
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    tags: data.tags || [],
    shippingTimeOverride: data.shippingTimeOverride,
    returnsPolicyOverride: data.returnsPolicyOverride,
    materialTag: data.materialTag,
    customBadge: data.customBadge,
    images: data.images.map((img, idx) => ({
      id: `img-${Date.now()}-${idx}`,
      productId,
      url: img.url,
      altText: img.altText || data.title,
      order: img.order || idx,
    })),
    variants: data.variants.map((v, idx) => ({
      id: v.id || `var-${Date.now()}-${idx}`,
      productId,
      sku: v.sku,
      price: v.price,
      compareAtPrice: v.compareAtPrice,
      stock: v.stock,
      image: v.image || data.images[0]?.url,
      optionValues: v.optionValues,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    if (isEditing) {
      const updated = await prisma.product.update({
        where: { id: productId },
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description,
          basePrice: data.basePrice,
          compareAtPrice: data.compareAtPrice,
          isFeatured: data.isFeatured,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
          tags: data.tags,
        },
        include: { variants: true, images: true },
      });
      return updated as unknown as Product;
    }
  } catch {}

  const existingIdx = runtimeProducts.findIndex((p) => p.id === productId);
  if (existingIdx > -1) {
    runtimeProducts[existingIdx] = { ...runtimeProducts[existingIdx], ...fullProduct };
  } else {
    runtimeProducts.unshift(fullProduct);
  }

  return fullProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await prisma.product.delete({ where: { id } });
  } catch {}
  runtimeProducts = runtimeProducts.filter((p) => p.id !== id);
  return true;
}

// ==================== PROMO CODES ====================

export async function getAllPromoCodes(): Promise<PromoCode[]> {
  return runtimePromoCodes;
}

export async function validatePromoCode(
  code: string,
  subtotal: number
): Promise<{
  valid: boolean;
  promo?: PromoCode;
  discountAmount: number;
  message?: string;
}> {
  const promo = runtimePromoCodes.find(
    (p) => p.code.toUpperCase() === code.trim().toUpperCase()
  );

  if (!promo) {
    return { valid: false, discountAmount: 0, message: 'Invalid promo code.' };
  }

  if (!promo.isActive) {
    return { valid: false, discountAmount: 0, message: 'This promo code is no longer active.' };
  }

  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
    return { valid: false, discountAmount: 0, message: 'This promo code has expired.' };
  }

  if (promo.minSpend && subtotal < promo.minSpend) {
    return {
      valid: false,
      discountAmount: 0,
      message: `Minimum spend of €${promo.minSpend} required for this promo code.`,
    };
  }

  let discountAmount = 0;
  if (promo.discountType === 'PERCENTAGE') {
    discountAmount = Math.round(((subtotal * promo.discountValue) / 100) * 100) / 100;
  } else if (promo.discountType === 'FIXED') {
    discountAmount = Math.min(promo.discountValue, subtotal);
  } else if (promo.discountType === 'FREE_SHIPPING') {
    discountAmount = 4.90; // Standard shipping waiver value
  }

  return { valid: true, promo, discountAmount };
}

export async function createPromoCode(data: Omit<PromoCode, 'id' | 'usageCount'>): Promise<PromoCode> {
  const newPromo: PromoCode = {
    ...data,
    id: `promo-${Date.now()}`,
    code: data.code.toUpperCase().trim(),
    usageCount: 0,
  };
  runtimePromoCodes.unshift(newPromo);
  return newPromo;
}

export async function togglePromoCodeStatus(id: string): Promise<PromoCode | null> {
  const promo = runtimePromoCodes.find((p) => p.id === id);
  if (!promo) return null;
  promo.isActive = !promo.isActive;
  return promo;
}

export async function deletePromoCode(id: string): Promise<boolean> {
  runtimePromoCodes = runtimePromoCodes.filter((p) => p.id !== id);
  return true;
}

// ==================== PRODUCT REVIEWS ====================

export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  return runtimeReviews.filter((r) => r.productId === productId);
}

export async function getProductRatingSummary(productId: string): Promise<{
  averageRating: number;
  totalReviews: number;
  ratingCounts: Record<number, number>;
}> {
  const reviews = runtimeReviews.filter((r) => r.productId === productId);
  if (reviews.length === 0) {
    return {
      averageRating: 5.0,
      totalReviews: 0,
      ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;

  reviews.forEach((r) => {
    counts[r.rating] = (counts[r.rating] || 0) + 1;
    sum += r.rating;
  });

  return {
    averageRating: Math.round((sum / reviews.length) * 10) / 10,
    totalReviews: reviews.length,
    ratingCounts: counts,
  };
}

export async function addProductReview(
  data: Omit<ProductReview, 'id' | 'createdAt' | 'helpfulCount'>
): Promise<ProductReview> {
  const newReview: ProductReview = {
    ...data,
    id: `rev-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    helpfulCount: 0,
  };
  runtimeReviews.unshift(newReview);
  return newReview;
}

export async function voteReviewHelpful(id: string): Promise<ProductReview | null> {
  const review = runtimeReviews.find((r) => r.id === id);
  if (!review) return null;
  review.helpfulCount += 1;
  return review;
}

// ==================== ABANDONED CARTS ====================

export async function getAbandonedCarts(): Promise<AbandonedCart[]> {
  return runtimeAbandonedCarts;
}

export async function recordAbandonedCart(data: {
  customerEmail: string;
  customerName?: string;
  items: AbandonedCart['items'];
  subtotal: number;
}): Promise<AbandonedCart> {
  const existingIndex = runtimeAbandonedCarts.findIndex(
    (c) => c.customerEmail.toLowerCase() === data.customerEmail.toLowerCase() && !c.recovered
  );

  if (existingIndex > -1) {
    runtimeAbandonedCarts[existingIndex] = {
      ...runtimeAbandonedCarts[existingIndex],
      ...data,
      lastActiveAt: new Date().toISOString(),
    };
    return runtimeAbandonedCarts[existingIndex];
  }

  const newCart: AbandonedCart = {
    id: `ab-${Date.now()}`,
    customerEmail: data.customerEmail,
    customerName: data.customerName,
    items: data.items,
    subtotal: data.subtotal,
    lastActiveAt: new Date().toISOString(),
    recovered: false,
    recoveryEmailSent: false,
    recoverySentAt: null,
  };

  runtimeAbandonedCarts.unshift(newCart);
  return newCart;
}

export async function sendAbandonedCartRecovery(id: string): Promise<AbandonedCart | null> {
  const cart = runtimeAbandonedCarts.find((c) => c.id === id);
  if (!cart) return null;
  cart.recoveryEmailSent = true;
  cart.recoverySentAt = new Date().toISOString();
  return cart;
}

// ==================== TENANTS / BRANDS ====================

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const tenant = runtimeTenants.find((t) => t.slug === slug);
  return tenant || null;
}

export async function getPendingTenants(): Promise<Tenant[]> {
  return runtimeTenants.filter((t) => t.status === 'PENDING_REVIEW');
}

export async function submitMerchantApplication(data: {
  name: string;
  email: string;
  country: string;
  city: string;
  story: string;
  website?: string;
  contactPerson: string;
  ecoBadges?: string[];
}): Promise<{ tenant: Tenant; autoApproved: boolean }> {
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const autoApprove = runtimeSettings.autoApproveMerchants;

  const newTenant: Tenant = {
    id: `tenant-${Date.now()}`,
    name: data.name,
    slug,
    logo: null,
    status: autoApprove ? 'ACTIVE' : 'PENDING_REVIEW',
    email: data.email,
    country: data.country,
    city: data.city,
    story: data.story,
    website: data.website || null,
    commissionRate: runtimeSettings.defaultCommissionRate || 15,
    contactPerson: data.contactPerson,
    ecoBadges: data.ecoBadges || ['Verified Luxury'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  runtimeTenants.unshift(newTenant);
  return { tenant: newTenant, autoApproved: autoApprove };
}

export async function approveTenant(id: string): Promise<Tenant | null> {
  const tenant = runtimeTenants.find((t) => t.id === id);
  if (!tenant) return null;
  tenant.status = 'ACTIVE';
  tenant.updatedAt = new Date();
  return tenant;
}

export async function rejectTenant(id: string): Promise<Tenant | null> {
  const tenant = runtimeTenants.find((t) => t.id === id);
  if (!tenant) return null;
  tenant.status = 'REJECTED';
  tenant.updatedAt = new Date();
  return tenant;
}

// ==================== USERS & BOOTSTRAP AUTO-ADMIN ====================

export async function getAllUsers(): Promise<UserAccount[]> {
  return runtimeUsers;
}

export async function getOrCreateBootstrapUser(userData: {
  email: string;
  name: string;
  clerkId?: string;
}): Promise<UserAccount> {
  const normalizedEmail = userData.email.toLowerCase().trim();

  // If already in runtime state, update and return
  const existing = runtimeUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    if (userData.clerkId) existing.clerkId = userData.clerkId;
    if (userData.name) existing.name = userData.name;

    // Guaranteed Super Admin promotion for primary owner or if no other super admin is active
    if (
      normalizedEmail === 'talha.shaikh.dev1@gmail.com' ||
      !runtimeUsers.some((u) => u.role === 'SUPER_ADMIN' && u.email.toLowerCase() !== normalizedEmail)
    ) {
      existing.role = 'SUPER_ADMIN';
    }

    // Sync role to Clerk publicMetadata asynchronously
    if (existing.clerkId) {
      syncUserRoleToClerk(existing.clerkId, existing.role, existing.tenantId).catch(() => {});
    }

    return existing;
  }

  // Determine if this is the first primary user
  const otherSuperAdminExists = runtimeUsers.some(
    (u) => u.role === 'SUPER_ADMIN' && u.email.toLowerCase() !== normalizedEmail
  );

  const shouldBeSuperAdmin =
    normalizedEmail === 'talha.shaikh.dev1@gmail.com' || !otherSuperAdminExists;

  const newUser: UserAccount = {
    id: `user-${Date.now()}`,
    clerkId: userData.clerkId || `clerk_${Date.now()}`,
    email: userData.email,
    name: userData.name,
    role: shouldBeSuperAdmin ? 'SUPER_ADMIN' : 'MERCHANT',
    tenantId: null,
    createdAt: new Date(),
  };

  runtimeUsers.push(newUser);

  // Sync role to Clerk publicMetadata asynchronously
  if (userData.clerkId) {
    syncUserRoleToClerk(userData.clerkId, newUser.role, newUser.tenantId).catch(() => {});
  }

  return newUser;
}

export async function updateStaffRole(userId: string, role: UserRole, tenantId?: string | null): Promise<UserAccount | null> {
  const user = runtimeUsers.find((u) => u.id === userId);
  if (!user) return null;
  user.role = role;
  if (tenantId !== undefined) user.tenantId = tenantId;

  // Sync to Clerk publicMetadata (by clerkId or email lookup)
  syncUserRoleToClerk({ clerkId: user.clerkId, email: user.email }, user.role, user.tenantId).catch(() => {});

  return user;
}

export async function inviteStaffUser(data: {
  name: string;
  email: string;
  role: UserRole;
  tenantId?: string | null;
}): Promise<UserAccount> {
  const newUser: UserAccount = {
    id: `user-${Date.now()}`,
    email: data.email,
    name: data.name,
    role: data.role,
    tenantId: data.tenantId || null,
    createdAt: new Date(),
  };
  runtimeUsers.push(newUser);

  // Sync to Clerk publicMetadata if user already exists in Clerk
  syncUserRoleToClerk({ email: data.email }, data.role, data.tenantId).catch(() => {});

  return newUser;
}

// ==================== CATEGORY REQUESTS ====================

export async function getCategoryRequests(): Promise<CategoryRequest[]> {
  return runtimeCategoryRequests;
}

export async function submitCategoryRequest(data: {
  name: string;
  description: string;
  suggestedParentId?: string | null;
  tenantId: string;
  tenantName: string;
}): Promise<CategoryRequest> {
  const newReq: CategoryRequest = {
    id: `req-${Date.now()}`,
    name: data.name,
    description: data.description,
    suggestedParentId: data.suggestedParentId || null,
    requestedByTenantId: data.tenantId,
    requestedByTenantName: data.tenantName,
    status: 'PENDING',
    createdAt: new Date().toISOString().split('T')[0],
  };
  runtimeCategoryRequests.unshift(newReq);
  return newReq;
}

export async function approveCategoryRequest(requestId: string): Promise<Category | null> {
  const req = runtimeCategoryRequests.find((r) => r.id === requestId);
  if (!req) return null;
  req.status = 'APPROVED';

  // Add into Master Taxonomy
  const slug = req.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name: req.name,
    slug,
    description: req.description,
    parentId: req.suggestedParentId || null,
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { products: 0 },
  };

  runtimeCategories.push(newCat);
  return newCat;
}

export async function rejectCategoryRequest(requestId: string): Promise<boolean> {
  const req = runtimeCategoryRequests.find((r) => r.id === requestId);
  if (!req) return false;
  req.status = 'REJECTED';
  return true;
}

// ==================== MERCHANT SCOPED PORTAL DATA ====================

export async function getMerchantScopedData(tenantId: string): Promise<{
  tenant: Tenant | null;
  products: Product[];
  orders: Order[];
  metrics: {
    grossSales: number;
    netEarnings: number;
    platformCommission: number;
    totalUnitsSold: number;
    pendingFulfillments: number;
    lowStockCount: number;
  };
}> {
  const tenant = runtimeTenants.find((t) => t.id === tenantId) || null;
  const products = runtimeProducts.filter((p) => p.tenantId === tenantId);
  const commissionRate = tenant?.commissionRate ?? 15;

  // Find all order items matching this tenant
  let grossSales = 0;
  let totalUnitsSold = 0;
  let pendingFulfillments = 0;

  const relevantOrders = runtimeOrders.filter((ord) =>
    ord.items.some((item) => item.tenantId === tenantId)
  );

  relevantOrders.forEach((ord) => {
    ord.items
      .filter((item) => item.tenantId === tenantId)
      .forEach((item) => {
        grossSales += item.price * item.quantity;
        totalUnitsSold += item.quantity;
        if (item.fulfillmentStatus !== 'SHIPPED') {
          pendingFulfillments += 1;
        }
      });
  });

  const platformCommission = Math.round(((grossSales * commissionRate) / 100) * 100) / 100;
  const netEarnings = Math.round((grossSales - platformCommission) * 100) / 100;

  let lowStockCount = 0;
  products.forEach((p) => {
    p.variants.forEach((v) => {
      if (v.stock <= 4) lowStockCount += 1;
    });
  });

  return {
    tenant,
    products,
    orders: relevantOrders,
    metrics: {
      grossSales,
      netEarnings,
      platformCommission,
      totalUnitsSold,
      pendingFulfillments,
      lowStockCount,
    },
  };
}

export async function fulfillMerchantOrderItem(
  orderId: string,
  itemId: string,
  carrier: string,
  trackingNumber: string
): Promise<{ success: boolean; order?: Order }> {
  const order = runtimeOrders.find((o) => o.id === orderId);
  if (!order) return { success: false };

  const item = order.items.find((i) => i.id === itemId);
  if (!item) return { success: false };

  item.fulfillmentStatus = 'SHIPPED';
  item.carrier = carrier;
  item.trackingNumber = trackingNumber;
  item.shippedAt = new Date().toISOString();

  // If all items in the order are now shipped, update order overall status
  const allShipped = order.items.every((i) => i.fulfillmentStatus === 'SHIPPED');
  if (allShipped) {
    order.status = 'SHIPPED';
    order.trackingNumber = trackingNumber;
  } else {
    order.status = 'PROCESSING';
  }

  return { success: true, order };
}

export async function mergeProductsIntoVariants(params: {
  masterProductId: string;
  mergedProductIds: string[];
  optionName: string; // e.g. "Color", "Style", "Size"
  variantCustomNames: Record<string, string>; // productId -> "Obsidian Black"
  preserveRedirects?: boolean;
}): Promise<{ success: boolean; masterProduct?: Product; error?: string }> {
  const master = runtimeProducts.find((p) => p.id === params.masterProductId);
  if (!master) return { success: false, error: 'Master product not found' };

  if (!master.redirectFromSlugs) {
    master.redirectFromSlugs = [];
  }

  const optionKey = params.optionName || 'Color';

  // Ensure initial variant has option label
  if (master.variants.length > 0 && !master.variants[0].optionValues?.[optionKey]) {
    const initialLabel = params.variantCustomNames[master.id] || 'Primary';
    master.variants[0].optionValues = {
      ...(master.variants[0].optionValues || {}),
      [optionKey]: initialLabel,
    };
    if (master.images[0]?.url && !master.variants[0].image) {
      master.variants[0].image = master.images[0].url;
    }
  }

  const otherProductIds = params.mergedProductIds.filter((id) => id !== params.masterProductId);

  for (const prodId of otherProductIds) {
    const prod = runtimeProducts.find((p) => p.id === prodId);
    if (!prod) continue;

    const variantLabel =
      params.variantCustomNames[prodId] ||
      prod.title.split('—').pop()?.trim() ||
      prod.title;

    const prodImg = prod.images[0]?.url || (prod.variants[0] as any)?.image || '';

    // Create new variant
    const newVariant: ProductVariant = {
      id: `var-${master.id}-${prod.id}`,
      productId: master.id,
      sku: prod.variants[0]?.sku || `${master.slug.slice(0, 6).toUpperCase()}-${master.variants.length + 1}`,
      price: prod.basePrice || master.basePrice,
      compareAtPrice: prod.compareAtPrice || master.compareAtPrice,
      stock: prod.variants.reduce((sum, v) => sum + v.stock, 0) || 10,
      image: prodImg || master.images[0]?.url || '',
      optionValues: {
        [optionKey]: variantLabel,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    master.variants.push(newVariant);

    // Add image to master product gallery if not already present
    if (prodImg && !master.images.some((img) => img.url === prodImg)) {
      master.images.push({
        id: `img-${master.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: master.id,
        variantId: newVariant.id,
        url: prodImg,
        altText: `${master.title} - ${variantLabel}`,
        order: master.images.length,
      });
    }

    // Preserve SEO 301 Redirect mapping
    if (params.preserveRedirects !== false) {
      if (!master.redirectFromSlugs.includes(prod.slug)) {
        master.redirectFromSlugs.push(prod.slug);
      }
      if (prod.redirectFromSlugs) {
        prod.redirectFromSlugs.forEach((s) => {
          if (!master.redirectFromSlugs!.includes(s)) {
            master.redirectFromSlugs!.push(s);
          }
        });
      }
    }

    // Set merged product status to ARCHIVED and mark its master parent ID
    prod.status = 'ARCHIVED';
    prod.mergedIntoProductId = master.id;
  }

  master.updatedAt = new Date();
  return { success: true, masterProduct: master };
}


