# Kāshida Couture — Luxury Kashmiri Fashion Platform

An editorial, high-craft digital flagship for **Kāshida Couture**, celebrating the centuries-old heritage of the Kashmir Valley through artisanal pherans, kurtas, authentic Pashmina shawls, and silk stoles. Combines an international luxury aesthetic (warm ivory, deep forest green, soft beige, and muted antique gold) with an interactive catalog, live predictive search, immersive zoomable PDP, and a streamlined Razorpay checkout experience.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following directions have been confirmed and established based on your feedback:

- **Confirmed Brand Identity**: **Kāshida Couture** (*"Haute Artisanat Du Kashmir"*), emphasizing royal valley heritage, 150-year master artisan legacy, and made-to-order bespoke craftsmanship.
- **Confirmed Storefront Focus**: **Apparel & Heritage Textiles**, led by handcrafted velvet & wool pherans (Aari & Tilla needlework), silk chanderi kurtas, hand-spun GI Pashmina shawls, and woven silk stoles.
- **Confirmed Payment & Checkout Architecture**: **Interactive Razorpay Test Gateway Simulation**, supporting instantaneous Card, UPI, and NetBanking testing with server-authoritative HMAC signature verification and post-order tracking dossiers.

---

### 1. Overview & Core Concept

- **What It Does**: Kāshida Couture provides an elevated, high-fashion e-commerce destination where connoisseurs of traditional South Asian and Kashmiri textile arts can explore bespoke collections, inspect intricate needlework (Kashida, Sozni, and metallic Tilla), select customized sizes/colors, manage a persistent shopping bag, and experience a realistic luxury checkout.
- **Target Audience**: Global patrons of luxury handlooms, modest fashion enthusiasts, bridal couture collectors, and cultural heritage connoisseurs who value genuine provenance, certified craft, and transparent artisan attribution.
- **Key Value**: Replaces generic e-commerce templates with a serene, high-aesthetic experience rooted in Kashmiri geography and craft traditions (Dal Lake, saffron fields, Chinar motifs), backed by friction-free search, variant selection, and clear checkout flows.

---

### 2. User Experience & Visual Design

#### A. Key User Flows
1. **Editorial Storefront**:
   - Curated top announcement bar with complimentary insured worldwide shipping callout.
   - 3-zone minimalist header: single-element wordmark, 4 clean nav links (*"Phirans"*, *"Kurtas"*, *"Pashmina"*, *"Artisan Stories"*), and functional tools (Live Search, Wishlist, Bag with live counter).
   - Cinematic hero campaign: *"Tradition Woven Into Every Detail"*, pairing high-resolution textile photography with direct routes to the new seasonal edit.
   - Curated 3-column collection showcase with subtle hover elevations, authentic craft tags (*"Sozni Needlework"*, *"GI Certified Pashmina"*), and Quick-View modal.
   - Artisan Legacy section highlighting master weavers, spinning charkhas, and ethical made-to-order models.
2. **Predictive Search & Category Exploration**:
   - Responsive slide-out or dropdown live search with autocomplete suggestions, thumbnail previews, stock availability, and instant keyboard navigation.
   - Rich filter panel on collection view: Silhouette, Fabric/Material (Pure Pashmina, Silk Velvet, Chanderi Silk), Needlework (Aari, Sozni, Tilla), and Price Range.
3. **Immersive Product Detail Page (PDP)**:
   - Contiguous 2-column purchase layout: multi-angle thumbnail reel and high-res main showcase with interactive loupe/zoom.
   - Dynamic variant matrix for Color swatches and Size options (XS to XXL) with low-stock badges (*"Only 2 pieces remaining in this artisan cut"*).
   - Interactive Size Guide modal with exact chest/shoulder/length measurements.
   - Tabbed heritage dossier: **Craftsmanship Notes**, **Fabric & Care Specifications**, and **Complimentary White-Glove Shipping**.
4. **Silk Bag & 2-Step Frictionless Checkout**:
   - Slide-over Silk Bag (Cart Drawer) with quantity steppers, coupon redemption code input (e.g. `KASHIDA10`), and real-time subtotal calculation.
   - 2-Step Checkout Wizard:
     - **Step 1: Delivery Dossier** (Customer Name, Email, Phone, Street, City, State, PIN code).
     - **Step 2: Luxury Assurance & Razorpay Modal** (Interactive test modal simulating UPI QR code, Credit/Debit card input, and Instant Auth, returning a verified cryptographic signature).
   - Order Confirmation dossier with tracking code, order breakdown, and downloadable PDF/printable receipt.

#### B. Visual Identity & Palette
- **Dominant Neutral Canvas (60%)**: Warm Ivory (`#FAF8F5`) and Soft Warm Paper (`#F7F4EE`) for an unhurried, tactile editorial feel.
- **Structural Surfaces & Contrast (30%)**: Deep Forest Green (`#162B21`), Soft Parchment Beige (`#EDE6DA`), and Charcoal Typography (`#1A1C1B`).
- **Disciplined Accents (10%)**: Muted Antique Gold (`#C5A059`), Warm Amber Gold (`#DFC289`), and Royal Kashmiri Ruby (`#6E1B24`) reserved strictly for active states, CTA buttons, and craft authenticity seals.
- **Typography**:
  - *Display / Hero Titles*: `Playfair Display` & `Cinzel` (high-contrast, royal serif with generous letter-spacing).
  - *Body Prose & Controls*: `Plus Jakarta Sans` (refined, geometric, highly legible modern sans-serif).
  - *Prices & Measurements*: Tabular numerals (`tabular-nums font-mono`).
- **Restraint & Anti-Slop Rules**: Zero pill-badge enclosures, no code-comment prefixes, no pulsing dots, single-level card elevation, and no decorative left accent bars.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client & Server-Authoritative Simulation Architecture**
  - *Chosen Approach*: Implement a complete high-fidelity client-side catalog state store synchronized with responsive local storage and server endpoints for search and order validation.
  - *Why*: Delivers instantaneous zero-latency navigation, fluid drawer transitions, and dependable evaluation without reliance on external live payment gateway test credentials.
  - *Alternative Considered*: Live external Razorpay credentials requiring user API key input. Passed over to guarantee flawless immediate out-of-the-box demo functionality while maintaining full signature-verification fidelity in the code.
- **Decision 2: High-Fidelity Domain Imagery via Parallel Generation**
  - *Chosen Approach*: Batch-generate bespoke luxury editorial photographs using `generate_image` (Pashmina shawls, Aari embroidered pherans, silk kurtas, artisan atelier) paired with robust CSS/SVG fallback containers.
  - *Why*: Strictly adheres to the zero-broken-image policy and provides domain-authentic Kashmiri imagery.
- **Decision 3: Contiguous PDP Architecture with Real-Time Stock Delta**
  - *Chosen Approach*: Sticky gallery on desktop left, contiguous purchasing module on right with variant-specific SKU and stock tracking.
  - *Why*: Eliminates customer hesitation and checkout friction as validated by Baymard luxury retail research.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          KĀSHIDA COUTURE UI                            │
│                                                                        │
│  ┌───────────────────────┐  ┌───────────────────────────────────────┐  │
│  │    Announcement Bar   │  │   Navbar (Brand, Links, Search, Bag)  │  │
│  └───────────────────────┘  └───────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Views: Storefront Home | Category Filter | Product PDP | Checkout│  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ User Actions
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        STATE & SERVICES LAYER                          │
│                                                                        │
│  ┌─────────────────────────┐   ┌────────────────────────────────────┐  │
│  │   Cart & Wishlist Store │   │       Catalog & Variant Store      │  │
│  │  (Persisted via Storage)│   │  (Pherans, Kurtas, Shawls, Stoles) │  │
│  └─────────────────────────┘   └────────────────────────────────────┘  │
│                                                                        │
│  ┌─────────────────────────┐   ┌────────────────────────────────────┐  │
│  │  Predictive Search API  │   │  Razorpay Modal & Signature Engine │  │
│  └─────────────────────────┘   └────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Core Data Entities:
- **Product**: ID, Slug, Name, Category (`Pherans`, `Kurtas`, `Pashmina Shawls`, `Silk Stoles`), Base Price, Discount %, Description, Craftsmanship Story, Care Instructions, Primary Image, Gallery Images, Rating, Reviews Count.
- **ProductVariant**: SKU, Product ID, Color, Size (`XS`, `S`, `M`, `L`, `XL`), Stock Count, Price Delta.
- **CartItem**: Variant ID, Product ID, Quantity, Selected Color, Selected Size, Unit Price.
- **OrderDossier**: Order Number, Timestamp, Shipping Address, Items, Subtotal, Discount, Taxes, Total Amount, Payment Method (`Razorpay Card / UPI`), Payment Status (`PAID`).

---

### 5. Implementation Sequence & Next Steps

1. **Step 1 (Asset Generation)**: Generate a cohesive parallel batch of luxury Kashmiri textile and craft assets via `generate_image`.
2. **Step 2 (Design System & Theme)**: Configure typography, Kashmiri color tokens, and layout styles in `src/index.css` and `index.html`.
3. **Step 3 (Data & Mock Store)**: Build complete catalog dataset with authentic artisan descriptions, variants, and specifications.
4. **Step 4 (Core Components)**: Implement AnnouncementBar, Navbar, Hero, Featured Collections, Quick-View Modal, and Live Search Autocomplete.
5. **Step 5 (Product Detail View & Cart)**: Implement interactive PDP with zoom loupe, size chart modal, review tab, and slide-out Cart Drawer.
6. **Step 6 (Razorpay Checkout & Confirmation)**: Build 2-step checkout wizard with simulated UPI/Card payment modal and rich Order Confirmation dossier.
7. **Step 7 (Verification & Polish)**: Run `compile_applet` and `lint_applet` to verify clean build and flawless user interactions.
