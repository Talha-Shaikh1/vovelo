# 🌟 Volvelo — Luxury Multi-Tenant Dropshipping & Atelier Marketplace

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-Serverless-00E599?style=flat&logo=postgresql)](https://neon.tech/)
[![Clerk](https://img.shields.io/badge/Clerk-Core_3_RBAC-6C47FF?style=flat&logo=clerk)](https://clerk.com/)

> A high-performance European multi-tenant dropshipping luxury marketplace connecting artisan European ateliers with international luxury consumers.

---

## 📖 Complete Case Study
For the detailed architectural breakdown, security model, database design, and feature walkthrough, view:  
👉 **[PORTFOLIO_CASE_STUDY.md](./PORTFOLIO_CASE_STUDY.md)**

---

## ✨ Core Highlights

- **🏛️ Strict Multi-Tenant Isolation:** Dedicated European Maker portal (`/portal`) where verified ateliers manage their own products, inventory, and order fulfillments with 85% net payout automation.
- **🛡️ Server-Side RBAC & Clerk Cloud Sync:** Real-time synchronization of roles (`SUPER_ADMIN`, `ADMIN`, `SUPPORT`, `MERCHANT`) between Neon PostgreSQL and Clerk `publicMetadata`.
- **💱 Dynamic Multi-Currency Engine:** Instant client-side conversion between **EUR (€)**, **USD ($)**, **GBP (£)**, and **PKR (Rs.)** with persistent Zustand store.
- **💳 Global Checkout System:** Free-text international shipping support and 3 checkout payment methods (256-bit Encrypted Card, COD, Direct Wire / IBAN).
- **⚙️ 48-Route Enterprise Super Admin Panel:** Complete operations suite covering tenant verification, abandoned cart recovery pipelines, promo codes, taxonomy approvals, staff permissions, and editorial CMS.
- **🤖 Answer Engine Optimization (AEO/SEO):** Full JSON-LD schema suite (`FAQPage`, `Organization`, `WebSite`, `CollectionPage`, `Article`) and custom AI bot allowances (`GPTBot`, `PerplexityBot`, `ClaudeBot`).

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the live storefront.

---

## 👨‍💻 Author & Lead Engineer
**Talha Shaikh** — Full Stack & Cloud Application Engineer
