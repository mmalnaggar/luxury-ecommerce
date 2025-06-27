# Project Tasks

<!--
This file is the master checklist for all active development tasks. Each entry will be added as tasks are planned from the PRDs.
--> 

- [x] **ID 1: Project Scaffolding & Tech Setup** (Priority: critical)
> Set up Next.js, Tailwind CSS, PostgreSQL, i18next, and initial repo structure for the e-commerce platform.

- [x] **ID 2: Authentication & User Roles** (Priority: critical)
> Implement user authentication (NextAuth.js), support for registered and guest users, and role-based access (shopper, brand, admin).

- [ ] **ID 3: Brand Management Dashboard** (Priority: high)
> Dependencies: 2
> Build the dashboard for brands to register, manage products, view analytics, and customize their storefronts.

- [ ] **ID 4: Product Catalog & Search** (Priority: high)
> Dependencies: 3
> Implement product catalog, advanced search, filtering, and product detail pages with AR try-on entry point.

- [ ] **ID 5: Augmented Reality Try-On Integration** (Priority: high)
> Dependencies: 4
> Integrate web-based AR try-on for clothing, including fit/measurement tools and brand asset management.

- [ ] **ID 6: Payments Integration** (Priority: high)
> Dependencies: 4
> Integrate Paymob, Fawry, and Stripe for EGP payments, including installment support, refunds, and payment status tracking.

- [ ] **ID 7: Multi-language Support** (Priority: medium)
> Dependencies: 1
> Enable Arabic/English language switching, RTL/LTR layout, and translation management for brands/admins.

- [ ] **ID 8: Reviews & Wishlists** (Priority: medium)
> Dependencies: 2, 4
> Implement product reviews (with moderation/reporting) and wishlists for registered users. 