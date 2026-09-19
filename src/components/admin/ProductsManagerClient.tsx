'use client';

import React, { useState } from 'react';
import { Product, Category, Tenant } from '@/lib/types';
import { formatPrice } from '@/lib/currency';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  TrendingUp,
  Store,
  Layers,
  Sparkles,
  Tag,
  Truck,
  RotateCcw,
  SlidersHorizontal,
  X,
  ArrowRight,
  Eye,
  Wand2,
  Loader2,
} from 'lucide-react';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface ProductsManagerClientProps {
  initialProducts: Product[];
  categories: Category[];
  tenants: Tenant[];
}

export function ProductsManagerClient({
  initialProducts,
  categories,
  tenants,
}: ProductsManagerClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<string>('all');
  const [notification, setNotification] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    productId: string | null;
    title: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    productId: null,
    title: '',
    isDeleting: false,
  });

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formTenantId, setFormTenantId] = useState(tenants[0]?.id || '');
  const [formCategoryId, setFormCategoryId] = useState(categories[0]?.id || '');
  const [formBasePrice, setFormBasePrice] = useState<number>(99);
  const [formComparePrice, setFormComparePrice] = useState<number | ''>('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formShippingOverride, setFormShippingOverride] = useState('');
  const [formReturnsOverride, setFormReturnsOverride] = useState('');
  const [formMaterialTag, setFormMaterialTag] = useState('');
  const [formCustomBadge, setFormCustomBadge] = useState('');
  const [formSeoTitle, setFormSeoTitle] = useState('');
  const [formSeoDescription, setFormSeoDescription] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  // Variant Matrix Generator State
  const [option1Name, setOption1Name] = useState('Color');
  const [option1Values, setOption1Values] = useState('Emerald Forest, Charcoal Grey');
  const [option2Name, setOption2Name] = useState('Size');
  const [option2Values, setOption2Values] = useState('M, L');
  const [formVariants, setFormVariants] = useState<Array<{
    sku: string;
    price: number;
    compareAtPrice?: number | null;
    stock: number;
    image?: string | null;
    optionValues: Record<string, string>;
  }>>([]);

  const filteredProducts = products.filter((p) => {
    if (selectedTenant !== 'all' && p.tenantId !== selectedTenant) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.variants.some((v) => v.sku.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const openNewProductModal = () => {
    setEditingProductId(null);
    setFormTitle('');
    setFormSlug('');
    setFormTenantId(tenants[0]?.id || '');
    setFormCategoryId(categories[0]?.id || '');
    setFormBasePrice(89);
    setFormComparePrice(110);
    setFormDescription('');
    setFormImageUrl('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80');
    setFormShippingOverride('2-4 Days (EU Direct)');
    setFormReturnsOverride('7-Day Free Returns');
    setFormMaterialTag('100% ZQ Merino Wool');
    setFormCustomBadge('New Season');
    setFormSeoTitle('');
    setFormSeoDescription('');
    setFormIsFeatured(false);

    // Initial default variants
    setFormVariants([
      {
        sku: 'SKU-EMR-M',
        price: 89,
        stock: 15,
        optionValues: { Color: 'Emerald Forest', Size: 'M' },
      },
      {
        sku: 'SKU-EMR-L',
        price: 89,
        stock: 10,
        optionValues: { Color: 'Emerald Forest', Size: 'L' },
      },
    ]);

    setIsModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProductId(product.id);
    setFormTitle(product.title);
    setFormSlug(product.slug);
    setFormTenantId(product.tenantId);
    setFormCategoryId(product.categoryId);
    setFormBasePrice(product.basePrice);
    setFormComparePrice(product.compareAtPrice || '');
    setFormDescription(product.description);
    setFormImageUrl(product.images[0]?.url || '');
    setFormShippingOverride(product.shippingTimeOverride || '');
    setFormReturnsOverride(product.returnsPolicyOverride || '');
    setFormMaterialTag(product.materialTag || '');
    setFormCustomBadge(product.customBadge || '');
    setFormSeoTitle(product.seoTitle || '');
    setFormSeoDescription(product.seoDescription || '');
    setFormIsFeatured(product.isFeatured);
    setFormVariants(
      product.variants.map((v) => ({
        sku: v.sku,
        price: v.price,
        compareAtPrice: v.compareAtPrice,
        stock: v.stock,
        image: v.image,
        optionValues: (v.optionValues as Record<string, string>) || {},
      }))
    );
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingProductId) {
      setFormSlug(slugify(val));
    }
  };

  const handleGenerateVariantMatrix = () => {
    const list1 = option1Values
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const list2 = option2Values
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newMatrix: typeof formVariants = [];
    const baseSkuPrefix = (formSlug || 'PROD').toUpperCase().slice(0, 4);

    if (list1.length > 0 && list2.length > 0) {
      list1.forEach((val1) => {
        list2.forEach((val2) => {
          const skuCode = `${baseSkuPrefix}-${val1.slice(0, 3).toUpperCase()}-${val2.slice(0, 2).toUpperCase()}`;
          newMatrix.push({
            sku: skuCode,
            price: formBasePrice,
            stock: 12,
            optionValues: {
              [option1Name]: val1,
              [option2Name]: val2,
            },
          });
        });
      });
    } else if (list1.length > 0) {
      list1.forEach((val1) => {
        const skuCode = `${baseSkuPrefix}-${val1.slice(0, 3).toUpperCase()}`;
        newMatrix.push({
          sku: skuCode,
          price: formBasePrice,
          stock: 12,
          optionValues: { [option1Name]: val1 },
        });
      });
    }

    if (newMatrix.length > 0) {
      setFormVariants(newMatrix);
    }
  };

  const handleAutoGenerateSeo = () => {
    const cat = categories.find((c) => c.id === formCategoryId)?.name || 'Essentials';
    const maker = tenants.find((t) => t.id === formTenantId)?.name || 'European Workshop';
    setFormSeoTitle(`${formTitle} — ${cat} by ${maker} | Volvelo`);
    setFormSeoDescription(
      formDescription.slice(0, 150) ||
        `Shop ${formTitle} ethically crafted in Europe. Sustainable materials, direct fulfillment, and 7-day return guarantee.`
    );
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        id: editingProductId || undefined,
        tenantId: formTenantId,
        categoryId: formCategoryId,
        title: formTitle,
        slug: formSlug || slugify(formTitle),
        description: formDescription,
        basePrice: parseFloat(formBasePrice.toString()),
        compareAtPrice: formComparePrice ? parseFloat(formComparePrice.toString()) : null,
        isFeatured: formIsFeatured,
        seoTitle: formSeoTitle || `${formTitle} | Volvelo`,
        seoDescription: formSeoDescription || formDescription.slice(0, 150),
        shippingTimeOverride: formShippingOverride || null,
        returnsPolicyOverride: formReturnsOverride || null,
        materialTag: formMaterialTag || null,
        customBadge: formCustomBadge || null,
        images: [{ url: formImageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80', order: 0 }],
        variants: formVariants.length > 0 ? formVariants : [
          {
            sku: `${(formSlug || 'PROD').toUpperCase()}-STD`,
            price: formBasePrice,
            stock: 10,
            optionValues: { Standard: 'Default' },
          },
        ],
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.product) {
        if (editingProductId) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProductId ? data.product : p))
          );
          setNotification(`Product "${data.product.title}" updated successfully.`);
        } else {
          setProducts((prev) => [data.product, ...prev]);
          setNotification(`New product "${data.product.title}" listed and live on storefront.`);
        }
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProductClick = (product: Product) => {
    setDeleteModal({
      isOpen: true,
      productId: product.id,
      title: product.title,
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.productId) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      await fetch(`/api/admin/products?id=${deleteModal.productId}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p.id !== deleteModal.productId));
      setNotification(`Product "${deleteModal.title}" permanently removed from catalog.`);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteModal({
        isOpen: false,
        productId: null,
        title: '',
        isDeleting: false,
      });
    }
  };

  const handleToggleFeatured = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isFeatured: !p.isFeatured } : p
      )
    );
    setNotification('Product featured status updated.');
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-4 bg-[#E8F3EE] rounded-xl border border-[#d2e8dd] text-xs font-medium text-[#0F5132] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-[#0F5132] hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Action Header & Bulk Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, slug, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 pl-9 text-[#111111] focus:outline-none focus:border-[#0F5132]"
            />
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666660]"
            />
          </div>

          <select
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            className="text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111] focus:outline-none focus:border-[#0F5132]"
          >
            <option value="all">All Makers / Tenants</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.status})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openNewProductModal}
            className="px-4 py-2 bg-[#0F5132] hover:bg-[#0A3622] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus size={15} />
            <span>List New Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#E4E4E0] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F0F0EC] text-[#111111] font-semibold border-b border-[#E4E4E0]">
              <tr>
                <th className="p-3.5">Product & Badges</th>
                <th className="p-3.5">Maker</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Base Price</th>
                <th className="p-3.5 text-center">Stock</th>
                <th className="p-3.5 text-center">SEO Score</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E0]">
              {filteredProducts.map((prod) => {
                const totalStock = prod.variants.reduce(
                  (acc, v) => acc + v.stock,
                  0
                );

                return (
                  <tr key={prod.id} className="hover:bg-[#FAFAF8]">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            prod.images[0]?.url ||
                            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=100&q=80'
                          }
                          alt={prod.title}
                          className="w-10 h-12 object-cover rounded-lg bg-[#F0F0EC] shrink-0 border border-[#E4E4E0]"
                        />
                        <div>
                          <a
                            href={`/product/${prod.slug}`}
                            target="_blank"
                            className="font-bold text-[#111111] hover:text-[#0F5132] flex items-center gap-1"
                          >
                            <span>{prod.title}</span>
                            <ExternalLink size={12} className="text-[#666660]" />
                          </a>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px]">
                            {prod.materialTag && (
                              <span className="bg-[#E8F3EE] text-[#0F5132] font-semibold px-1.5 py-0.5 rounded">
                                {prod.materialTag}
                              </span>
                            )}
                            {prod.customBadge && (
                              <span className="bg-[#111111] text-white px-1.5 py-0.5 rounded font-bold">
                                {prod.customBadge}
                              </span>
                            )}
                            <span className="text-[#666660] font-mono">
                              {prod.variants.length} variants
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-[#666660]">
                      {prod.tenant?.name || 'Nordic Atelier'}
                    </td>
                    <td className="p-3.5 text-[#666660]">
                      {prod.category?.name || 'Apparel'}
                    </td>
                    <td className="p-3.5 font-bold font-mono text-[#111111]">
                      {formatPrice(prod.basePrice)}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-mono font-semibold text-[11px] ${
                          totalStock <= 5
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-[#E8F3EE] text-[#0F5132]'
                        }`}
                      >
                        {totalStock} units
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="inline-flex items-center gap-1 font-bold font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#E8F3EE] text-[#0F5132]">
                        ★ {prod.seoScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(prod.id)}
                          className={`p-1.5 rounded-lg text-xs font-semibold ${
                            prod.isFeatured
                              ? 'bg-[#0F5132] text-white'
                              : 'bg-[#F0F0EC] text-[#666660] hover:bg-[#E4E4E0]'
                          }`}
                          title="Boost Placement"
                        >
                          ★
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditProductModal(prod)}
                          className="p-1.5 text-[#666660] hover:text-[#111111] hover:bg-[#F0F0EC] rounded-lg"
                          title="Edit Product & Badges"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProductClick(prod)}
                          className="p-1.5 text-[#999990] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative min-h-screen flex items-center justify-center p-4 md:p-6">
            <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#E4E4E0] overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-5 border-b border-[#E4E4E0] flex items-center justify-between bg-[#FAFAF8]">
                <div className="flex items-center gap-2">
                  <Package size={18} className="text-[#0F5132]" />
                  <h3 className="text-base font-bold text-[#111111]">
                    {editingProductId ? 'Edit Product & Custom Badges' : 'List New Product'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-[#666660] hover:text-[#111111] hover:bg-[#F0F0EC] rounded-full"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Form Body */}
              <form onSubmit={handleSaveProduct} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                {/* 1. Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F5132] pb-1 border-b border-[#F0F0EC]">
                    1. Basic Product Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-[#111111] block mb-1">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. Merino Wool All-Day Runner"
                        className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111] focus:border-[#0F5132]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#111111] block mb-1">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={formSlug}
                        onChange={(e) => setFormSlug(e.target.value)}
                        className="w-full text-xs font-mono bg-[#FAFAF8] border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#111111] block mb-1">
                        Maker / Tenant *
                      </label>
                      <select
                        value={formTenantId}
                        onChange={(e) => setFormTenantId(e.target.value)}
                        className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111]"
                      >
                        {tenants.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#111111] block mb-1">
                        Category / Department *
                      </label>
                      <select
                        value={formCategoryId}
                        onChange={(e) => setFormCategoryId(e.target.value)}
                        className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111]"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#111111] block mb-1">
                        Base Price (€) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formBasePrice}
                        onChange={(e) => setFormBasePrice(parseFloat(e.target.value) || 0)}
                        className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#111111] block mb-1">
                        Compare-at Price (€) (Optional)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formComparePrice}
                        onChange={(e) => setFormComparePrice(e.target.value ? parseFloat(e.target.value) : '')}
                        placeholder="e.g. 135.00"
                        className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-[#111111] block mb-1">
                        Primary Image URL
                      </label>
                      <input
                        type="url"
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-[#111111] block mb-1">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Describe the materials, fit, and craftsmanship..."
                        className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl p-3 text-[#111111]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Custom Merchant Product Badges & Overrides */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F5132] pb-1 border-b border-[#F0F0EC]">
                    2. Custom Product Badges & Policy Overrides
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#111111] block mb-1">
                        Custom Shipping Note Override
                      </label>
                      <input
                        type="text"
                        value={formShippingOverride}
                        onChange={(e) => setFormShippingOverride(e.target.value)}
                        placeholder="e.g. 2-4 Days (EU Express)"
                        className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#111111] block mb-1">
                        Custom Returns Note Override
                      </label>
                      <input
                        type="text"
                        value={formReturnsOverride}
                        onChange={(e) => setFormReturnsOverride(e.target.value)}
                        placeholder="e.g. 7-Day Free Returns"
                        className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#111111] block mb-1">
                        Material Tag Badge
                      </label>
                      <input
                        type="text"
                        value={formMaterialTag}
                        onChange={(e) => setFormMaterialTag(e.target.value)}
                        placeholder="e.g. 100% ZQ Merino Wool"
                        className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#111111] block mb-1">
                        Custom Marketing Badge
                      </label>
                      <input
                        type="text"
                        value={formCustomBadge}
                        onChange={(e) => setFormCustomBadge(e.target.value)}
                        placeholder="e.g. Bestseller, Limited Drop"
                        className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111]"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Variant Matrix Generator */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-1 border-b border-[#F0F0EC]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F5132]">
                      3. Multi-Option Variant Matrix
                    </h4>
                    <button
                      type="button"
                      onClick={handleGenerateVariantMatrix}
                      className="text-xs font-semibold text-[#0F5132] hover:underline flex items-center gap-1"
                    >
                      <Wand2 size={13} />
                      <span>Generate Matrix Combinations</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAFAF8] p-4 rounded-xl border border-[#E4E4E0]">
                    <div>
                      <label className="text-[11px] font-semibold text-[#666660] block mb-1">
                        Option 1 (e.g. Color)
                      </label>
                      <input
                        type="text"
                        value={option1Name}
                        onChange={(e) => setOption1Name(e.target.value)}
                        className="w-full text-xs bg-white border border-[#E4E4E0] rounded-lg px-2.5 py-1.5 mb-1.5"
                      />
                      <input
                        type="text"
                        value={option1Values}
                        onChange={(e) => setOption1Values(e.target.value)}
                        placeholder="Values: Emerald, Charcoal, Sand"
                        className="w-full text-xs bg-white border border-[#E4E4E0] rounded-lg px-2.5 py-1.5"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#666660] block mb-1">
                        Option 2 (e.g. Size / Volume)
                      </label>
                      <input
                        type="text"
                        value={option2Name}
                        onChange={(e) => setOption2Name(e.target.value)}
                        className="w-full text-xs bg-white border border-[#E4E4E0] rounded-lg px-2.5 py-1.5 mb-1.5"
                      />
                      <input
                        type="text"
                        value={option2Values}
                        onChange={(e) => setOption2Values(e.target.value)}
                        placeholder="Values: EU 41, EU 42, EU 43"
                        className="w-full text-xs bg-white border border-[#E4E4E0] rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                  </div>

                  {/* Generated Variant Rows */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#111111] block">
                      Active Variant SKUs ({formVariants.length})
                    </label>
                    <div className="max-h-48 overflow-y-auto space-y-2 border border-[#E4E4E0] rounded-xl p-3 bg-white">
                      {formVariants.map((v, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2 bg-[#FAFAF8] rounded-lg text-xs border border-[#E4E4E0]"
                        >
                          <div className="flex-1 font-bold text-[#111111] truncate">
                            {Object.entries(v.optionValues).map(([k, val]) => `${k}: ${val}`).join(' / ')}
                          </div>
                          <input
                            type="text"
                            value={v.sku}
                            onChange={(e) => {
                              const updated = [...formVariants];
                              updated[idx].sku = e.target.value;
                              setFormVariants(updated);
                            }}
                            placeholder="SKU"
                            className="w-28 text-xs font-mono bg-white border border-[#E4E4E0] rounded px-2 py-1"
                          />
                          <input
                            type="number"
                            value={v.price}
                            onChange={(e) => {
                              const updated = [...formVariants];
                              updated[idx].price = parseFloat(e.target.value) || 0;
                              setFormVariants(updated);
                            }}
                            placeholder="Price"
                            className="w-20 text-xs font-mono bg-white border border-[#E4E4E0] rounded px-2 py-1"
                          />
                          <input
                            type="number"
                            value={v.stock}
                            onChange={(e) => {
                              const updated = [...formVariants];
                              updated[idx].stock = parseInt(e.target.value) || 0;
                              setFormVariants(updated);
                            }}
                            placeholder="Stock"
                            className="w-16 text-xs font-mono bg-white border border-[#E4E4E0] rounded px-2 py-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. SEO Tags Generator */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-1 border-b border-[#F0F0EC]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F5132]">
                      4. SEO & Search Engine Preview
                    </h4>
                    <button
                      type="button"
                      onClick={handleAutoGenerateSeo}
                      className="text-xs font-semibold text-[#0F5132] hover:underline flex items-center gap-1"
                    >
                      <Sparkles size={13} />
                      <span>Auto-Generate SEO Tags</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-[#111111] block mb-1">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        value={formSeoTitle}
                        onChange={(e) => setFormSeoTitle(e.target.value)}
                        className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#111111] block mb-1">
                        Meta Description
                      </label>
                      <textarea
                        rows={2}
                        value={formSeoDescription}
                        onChange={(e) => setFormSeoDescription(e.target.value)}
                        className="w-full text-xs bg-white border border-[#E4E4E0] rounded-xl p-3 text-[#111111]"
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="pt-4 border-t border-[#E4E4E0] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-[#666660] hover:text-[#111111]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all"
                  >
                    {isSaving ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={14} />
                    )}
                    <span>{editingProductId ? 'Update Product' : 'Publish Product'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, productId: null, title: '', isDeleting: false })}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${deleteModal.title}" from the catalog? This will remove all associated SKUs, inventory records, and search index listings.`}
        confirmText="Yes, Delete Product"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteModal.isDeleting}
      />
    </div>
  );
}
