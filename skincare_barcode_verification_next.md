# 🚀 Frontend Spec — Next.js (Trailbase API)

## 🧠 SYSTEM ROLE
You are a senior frontend engineer. Build a clean, production-ready Next.js (App Router) application using TypeScript and Tailwind CSS.

The app must connect to the external API:
👉 https://api.pixinia.web.id

Assume this API is powered by Trailbase (REST-based, no SDK required).

---

## 📱 APP OVERVIEW

- Mobile-first responsive UI
- Clean, minimal, modern design
- Fast loading (server components preferred)

Core features:
- Barcode verification (MAIN)
- Product catalog
- Product detail

---

## 🔌 API CONFIG

Base URL:
```
https://api.pixinia.web.id
```

Use native `fetch` (no axios required).

---

## 📁 PROJECT STRUCTURE

```
app/
  layout.tsx
  page.tsx

  verify/[code]/page.tsx
  products/page.tsx
  products/[slug]/page.tsx

components/
  ProductCard.tsx
  ProductGrid.tsx
  StatusBadge.tsx

lib/
  api.ts
```

---

## 🔁 CORE FEATURES

---

### 1. 🔍 Barcode Verification (MAIN)

**Route:**
```
/verify/[code]
```

**Logic:**
1. Get `code` from params
2. Fetch barcode:
```
GET /barcodes?code=eq.{code}
```
3. If empty → show NOT FOUND
4. If found → get `product_id`
5. Fetch product:
```
GET /products?id=eq.{product_id}
```

---

### UI Requirements:

Display:
- Product image
- Product name
- Ingredients
- Description

Status:
- VALID → green badge
- INVALID → red badge

---

### 2. 📦 Product Catalog

**Route:**
```
/products
```

**Fetch:**
```
GET /products
```

Display grid:
- image
- name

---

### 3. 📄 Product Detail

**Route:**
```
/products/[slug]
```

**Fetch:**
```
GET /products?slug=eq.{slug}
```

---

## 🧩 COMPONENTS

### ProductCard
- image
- title
- link

### StatusBadge
- props: status
- styles:
  - valid → green
  - invalid → red

---

## 🔌 API HELPER

Create:

```ts
const BASE_URL = "https://api.pixinia.web.id";

export async function fetchAPI(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    cache: "no-store"
  });

  if (!res.ok) throw new Error("API Error");

  return res.json();
}
```

---

## ⚠️ EDGE CASES

- Barcode not found
- Product not found
- Image missing
- API error

---

## 🎨 UI NOTES

- Use Tailwind
- Clean layout
- Centered verification result
- Mobile-first

---

## 🚀 IMPORTANT

- Use Server Components where possible
- Avoid client-side heavy logic
- Keep components reusable

---

## 💥 BONUS (OPTIONAL)

- Add loading skeleton
- Add error state UI
- Add scan history (optional)

---

## 🎯 FINAL GOAL

A working frontend where:
- Visiting `/verify/FFY-SERUM-001` shows product
- Clean UI
- Fully connected to Trailbase API

---

## ❗ NOTE

Trailbase API is REST-based and can be consumed directly via fetch.
No special SDK required.

