---
id: 3.2
title: 'Build Core Dashboard UI and Layout'
status: completed
priority: high
feature: 'Brand Management'
dependencies:
  - 3.1
assigned_agent: null
created_at: "2025-06-26T17:24:07Z"
started_at: "2025-06-26T17:29:35Z"
completed_at: "2025-06-26T17:32:26Z"
error_log: null
---

## Description
Create the main layout, navigation, and protected routes for the brand dashboard. This will be the shell that holds the other dashboard features.

## Details
- Create a new route group for the dashboard (e.g., `/(dashboard)/...`).
- Implement a shared layout for all dashboard pages (`layout.tsx`).
- The layout should include a sidebar for navigation (e.g., Products, Analytics, Storefront).
- Add middleware to protect all routes under `/dashboard`, allowing access only to users with the `BRAND` or `ADMIN` role.
- Create placeholder pages for each navigation item.

## Test Strategy
- Verify that users without the `BRAND` role are redirected from any `/dashboard` route.
- Confirm that `BRAND` users can access the dashboard and see the main layout.
- Test navigation links in the sidebar to ensure they lead to the correct placeholder pages. 