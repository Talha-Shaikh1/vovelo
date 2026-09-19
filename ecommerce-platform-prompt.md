# Volvelo — Multi-Tenant Dropshipping E-commerce Platform — Build Prompt

## Brand & Theme

- **Platform name:** Volvelo
- **Logo:** will be provided separately — leave a placeholder logo slot in the header/footer components.
- **Theme direction:** Modern Minimal / Clean Commerce (think Allbirds, Uniqlo, COS) — works well across a multi-category catalog and reads as premium/trustworthy for a European audience.
- **Color palette:**
  - Background: off-white `#FAFAF8`
  - Text: near-black `#111111`
  - Cards/section backgrounds: warm gray `#F0F0EC`
  - **Accent (buttons, CTAs, links, active states): deep emerald green `#0F5132`**
  - Borders/dividers: subtle light gray `#E4E4E0`
- **Typography:**
  - Headings: "Space Grotesk" or "Sora" (Google Fonts)
  - Body: "Inter"
- **Dark mode:** not needed for v1 — light theme only. Structure CSS variables/theme tokens so dark mode can be added later without a rewrite (ties into Section 9's design-token approach).
- Define all of the above as theme tokens (Tailwind config / CSS variables) in one place — never hardcode hex colors or font names directly in components.

## Overview
Build a full-stack, SEO-first e-commerce platform for dropshipping, designed to eventually support multiple sellers (tenants) listing products on a single shared storefront domain — **not** separate subdomains/stores per seller. All products live under one domain so SEO authority accumulates on the platform itself, not on individual sellers.

Primary market: Europe (multi-currency, multi-language ready). Architecture should be global-ready from day one, but initial launch content/marketing targets EU.

**Not needed yet (build architecture to support later, but skip implementation):**
- Payment gateway integration (use placeholder/mock checkout flow for now)
- Full self-serve seller onboarding/dashboard complexity (keep it simple — see Tenant Model below)

---

## 1. Tenant Model (Simplified for Now)

- Platform is multi-tenant, but tenants are added manually by the platform admin (no public seller signup yet).
- Each tenant = a "seller" entity with: name, slug, logo, status (`active` / `inactive`).
- **Admin panel has a toggle per tenant** — turning a tenant `inactive` immediately hides all of that tenant's products from the storefront (homepage, category pages, search, recommendations) without deleting data.
- All products stored with a `tenant_id` foreign key.
- Products table needs an `seo_score` or ranking field (see Section 2) to control homepage placement — this is independent of which tenant owns the product.
- Design the DB schema so that adding a real seller dashboard (self-serve product upload, order management) later is a clean extension, not a rewrite.

## 2. Homepage — SEO-Ranked Product Surfacing

**Core rule:** Homepage does NOT show all tenants' products equally or in raw chronological/random order. It shows products ranked by SEO/performance signals, so the best-performing products (regardless of tenant) get top visibility.

Ranking should be a computed score based on a combination of:
- Organic search impressions/clicks (if analytics data available — Google Search Console API integration later)
- On-page SEO completeness (has meta title, meta description, alt text on images, structured data present — score higher if complete)
- Product page engagement (views, add-to-cart rate, conversion rate)
- Recency (soft boost for newer products so nothing new is buried)
- Manual admin override/"featured" boost (admin can pin/boost specific products regardless of score)

Implementation approach:
- Store a `seo_score` (numeric) column on the product, recalculated on a schedule (cron/job) from the above signals.
- Homepage query: `ORDER BY seo_score DESC` with pagination, filtered to `tenant.status = 'active'`.
- Keep this scoring logic in a separate service/module (`lib/ranking.ts` or similar) so the algorithm can be tuned without touching page rendering code.

## 3. Category & Search Pages — Left Sidebar Filters

- Filters panel on the left (desktop) / collapsible drawer (mobile):
  - **Price range** — slider or min/max inputs
  - **Category** — nested/tree structure (category > subcategory)
  - **Brand / Tenant** (optional toggle — may hide "sold by" filter until multi-seller is fully live)
  - **Rating** (if reviews implemented)
  - **In stock only** toggle
- Filters must be reflected in the URL as query params (e.g. `/category/bags?price=10-50&sort=popular`) so filtered/category pages remain crawlable and indexable by search engines — do NOT make filtering purely client-side state with no URL reflection.
- Sort options: Relevance/SEO score (default), Price low-high, Price high-low, Newest.

## 4. Product Variants (Color, Size, etc.) — Critical for Order Accuracy

Products with multiple options (e.g. a bag in 4 colors, a shirt in 5 sizes) must NOT be modeled as separate products. Use a proper **parent product → variant** structure:

- **Product** (parent): shared title, description, category, base SEO fields.
- **Variant** (child): specific combination of option values (e.g. `Color: Red`, `Size: M`), each with its own:
  - SKU (unique identifier)
  - Price (can differ from base price, e.g. some colors cost more)
  - Stock quantity (tracked independently per variant)
  - Its own image or image set (see Section 5) — selecting "Red" should swap the gallery to red-colored images automatically
- **Option types** are configurable per product (not hardcoded to "color/size" — a product could have Color + Size + Material, another could have just Size).
- **Order integrity rule:** when a customer adds to cart, the exact `variant_id` (not just product_id) must be stored on the cart/order line item — this guarantees the correct color/size/SKU is what actually gets fulfilled, with no ambiguity for the supplier.
- On the product page: variant selector as swatches (color) and buttons/dropdown (size). Selecting a variant should:
  - Update price shown (if it differs)
  - Update stock status ("Only 3 left" / "Out of stock" — disable that combination if unavailable)
  - Update the image gallery to that variant's images
  - Update the URL (query param, e.g. `?variant=red-m`) so a specific variant combo is shareable/linkable and still indexable.
- Admin panel: variant management UI where adding a new option value (e.g. a new color) auto-generates the variant matrix, with bulk price/stock entry — not one-by-one manual creation for every combination.

## 5. Product Detail Page — Image Gallery & UI/UX

- **Multiple images per product/variant**, displayed as:
  - Main large image + thumbnail strip (click/hover thumbnail to switch main image)
  - Smooth crossfade or slide transition when switching images (no jarring instant swap)
  - Zoom-on-hover or click-to-zoom for the main image
  - Swipeable image gallery on mobile (touch gestures)
- **Micro-interactions/animation** (tasteful, not excessive):
  - Add-to-cart button gives visual feedback (subtle bounce/checkmark animation, cart icon updates with a small pulse)
  - Variant swatch selection has a smooth active-state transition (border/scale animation)
  - Page elements (price, description, related products) fade/slide in on scroll rather than appearing abruptly
  - Skeleton loading states instead of blank white space while images/data load
- Overall UI/UX bar: this page should feel like a premium DTC brand site (think Allbirds, Gymshark-tier polish), not a generic template — clean typography, generous whitespace, consistent spacing scale, fast perceived performance.
- Below the gallery/info: **"You may also like" / "Related products"** section.
  - Logic: pull products from the same category (and optionally same tags) as the currently viewed product, excluding the current product itself.
  - Ranking within the recommendation set: same `seo_score` / popularity logic as homepage, scoped to that category.
  - Later upgrade path (not required now, but design data model to allow it): track user view history to personalize recommendations ("customers who viewed this also viewed X").

## 6. Blog Section (Product-Linked Content)

- Standalone `/blog` section with SEO-optimized articles (buying guides, "Best [category] for [use case]", etc.).
- Each blog post can link to and embed specific products (e.g. inline product cards within article body).
- Blog posts should support: title, slug, meta description, featured image, category/tag, author, published date, rich content (markdown or block-based editor).
- Purpose: capture informational search queries and funnel traffic into product pages via internal links — this matters for both Google SEO and AI answer engines (AEO).

## 7. Product Management — Built for Speed, Not Manual Grind

- **Bulk import/export** via CSV/Excel — add or update hundreds of products/variants at once instead of one-by-one.
- **Bulk edit** — change price, category, or status across multiple selected products in one action.
- **Auto stock sync hooks**: architecture should support a scheduled job/webhook that updates variant stock from a supplier feed (even if the actual supplier integration is added later) — when stock hits 0, that variant auto-disables on the storefront (shown as "Out of stock", not orderable) without manual admin action.
- **Low-stock alerts**: admin gets a notification/dashboard flag when a variant's stock drops below a threshold.
- **Auto-generated SEO fields**: when a product is created, meta title/description/alt-text are pre-filled from a template (e.g. `"{product name} | {category} | {store name}"`), which the admin can override manually if desired — reduces manual SEO data entry per product.

## 8. Order Management — Minimize Manual Work

- **Centralized order dashboard**: every order (across all active tenants) in one place, filterable by status (pending, processing, shipped, delivered, cancelled, returned), tenant, and date range.
- **Auto order-forwarding to supplier**: when an order is placed, order + variant + shipping details are automatically sent to the relevant supplier/tenant (via email template or API webhook) — no manual copy-pasting of order info.
- **Status automation**: when an order's status is updated (e.g. marked "Shipped" with a tracking number), the system automatically emails/notifies the customer — no manual message sending.
- **Auto invoice generation**: a PDF invoice is generated automatically per order and attached to the confirmation email.
- **Abandoned cart recovery**: if a cart is created but checkout isn't completed within X hours, an automatic reminder email/notification is triggered.
- **Return/refund workflow**: customer can request a return from their order history; admin approves/rejects from the dashboard — structured workflow instead of manual back-and-forth over email/chat.
- Since payment gateway isn't wired up yet, orders can be created with a `pending_payment` / `manual` status — but the automation above (notifications, invoice, supplier-forwarding) should still work end-to-end on the mock flow, so plugging in real payments later doesn't require rebuilding this logic.

## 9. Dynamic, Centralized Configuration (Change Once, Reflect Everywhere)

This applies across the whole platform — nothing should be hardcoded in multiple places such that a single change requires editing several files/pages.

- **Site settings as a single source of truth**: store name, logo, contact info, social links, currency symbol, footer text, homepage banner, SEO defaults (default meta title/description templates) — all stored in one `SiteSettings` table/config, pulled everywhere it's used (header, footer, emails, meta tags). Admin edits it once in one settings screen.
- **Category/menu structure**: managed from one place (admin panel), and every page that references categories (nav menu, filters, footer links) pulls from that same source — never hardcode category lists into individual page components.
- **Design tokens**: colors, fonts, spacing defined once (e.g. in a Tailwind config / CSS variables file) and referenced everywhere — changing the brand's primary color should be a one-line change, not a find-and-replace across components.
- **Email templates**: order confirmation, shipped, delivered, abandoned cart — each stored as one editable template (with variables like `{customer_name}`, `{order_id}`) rather than duplicated/hardcoded strings across the codebase.
- **Reusable UI components**: product card, variant selector, price display, badge/label components — built once as shared components and reused across homepage, category pages, search, and related-products sections, so a UI tweak (e.g. how a discount badge looks) updates everywhere automatically.

## 10. Admin Panel

- Tenant management: add/edit tenant, **active/inactive toggle**.
- Product management: add/edit/delete product, manage variants (options, per-variant price/stock/images), assign to tenant + category, edit SEO fields, manual "featured" boost toggle, bulk import/export, bulk edit.
- Category management: create/edit nested categories.
- Blog management: create/edit/publish blog posts.
- Order management: centralized dashboard (see Section 8), manual status updates, return/refund handling.
- Site settings screen (see Section 9) — one place to edit global config.
- Basic analytics view: top-performing products by seo_score/traffic, low-stock report (even if mocked initially).

## 11. Global/EU Readiness (Architecture Only — Don't Fully Build Yet)

- i18n structure in place (even if only English content initially) — support adding DE/FR/ES/etc. later without restructuring.
- Currency field on products in base currency; design for future multi-currency display conversion.
- Cookie consent banner (GDPR) — basic implementation now since EU traffic is a target from day one.
- SEO fundamentals from day one: clean URLs, sitemap.xml (auto-generated), robots.txt, Product + Offer + BreadcrumbList structured data (schema.org/JSON-LD) on every product page, Open Graph tags for social sharing.

## 12. Suggested Tech Stack

- **Frontend/SSR:** Next.js (App Router) — needed for SEO (server-side rendering, metadata API, sitemap generation)
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion for page/element transitions and micro-interactions
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** NextAuth or Clerk (separate roles: super-admin, tenant — even if tenant login isn't exposed publicly yet)
- **Image handling:** Cloudinary or S3-compatible storage (with responsive/optimized image delivery)
- **Checkout:** Build the flow UI/UX now with a mock/placeholder "Place Order" step that just creates a pending order record — swap in Stripe later without changing the flow.

## 13. What NOT to build right now
- Real payment processing (Stripe/PayPal) — mock it.
- Public self-serve seller signup/onboarding flow — tenants added by admin only.
- Multi-currency conversion logic (just leave the field/structure for it).
- Full personalization/ML-based recommendations (use category-based rules for now).
- Real supplier API integrations (build the hooks/structure, mock the actual calls).

---

## Deliverable expectations
Please scaffold this as a working Next.js + PostgreSQL + Prisma project with:
1. Database schema (Prisma) covering: Tenant, Product, ProductVariant, VariantOption, Category, Blog Post, Order, OrderItem (with variant_id), Admin User, SiteSettings
2. Homepage with SEO-ranked product grid
3. Category page with left-sidebar filters (URL-reflected)
4. Product detail page with variant selector (color/size), animated multi-image gallery, and related-products section
5. Blog listing + single blog post page with embedded product cards
6. Admin panel (protected route) with tenant toggle, product + variant CRUD (with bulk import/export), order dashboard with status automation, blog CRUD, site settings screen
7. Basic sitemap.xml and JSON-LD structured data on product pages
8. Shared/reusable UI components (product card, variant selector, price display) used consistently across all pages
