# PRD: Reviews & Wishlists

## 1. Product overview

### 1.1 Document title and version
- PRD: Reviews & Wishlists
- Version: 1.0

### 1.2 Product summary

This feature enables shoppers to leave reviews and ratings for products, as well as save favorite items to wishlists. Reviews are moderated for quality and abuse prevention, and users can report inappropriate content. Wishlists are available to registered users, allowing them to save and organize products for future purchases.

## 2. Goals

### 2.1 Business goals
- Increase user engagement and trust
- Drive repeat visits and purchases
- Provide brands with valuable feedback

### 2.2 User goals
- Share honest feedback and ratings on products
- Save favorite products for easy access later
- Report inappropriate or abusive reviews

### 2.3 Non-goals
- Public wishlists (initially)
- Reviews for non-product content

## 3. User personas

### 3.1 Key user types
- Shoppers (registered and guest)
- Brand managers
- Platform administrators

### 3.2 Basic persona details
- **Registered Shopper:** Can leave reviews and manage wishlists.
- **Guest Shopper:** Can read reviews but not leave reviews or save wishlists.
- **Brand Manager:** Monitors reviews for their products.
- **Platform Admin:** Moderates reviews and handles abuse reports.

### 3.3 Role-based access
- **Registered Shopper:** Can write reviews and manage wishlists.
- **Guest Shopper:** Can read reviews only.
- **Brand Manager:** Can view and respond to reviews for their products.
- **Platform Admin:** Can moderate, edit, or remove any review.

## 4. Functional requirements
- **Product Reviews & Ratings** (Priority: High)
    - Registered users can leave reviews and star ratings
    - Reviews displayed on product pages
    - Brands can respond to reviews
- **Review Moderation & Reporting** (Priority: High)
    - Admin dashboard for moderating reviews
    - Users can report inappropriate or abusive reviews
    - Automated filters for spam/abuse
- **Wishlists** (Priority: High)
    - Registered users can add/remove products to wishlists
    - Wishlists accessible from user dashboard
    - Option to move items from wishlist to cart
- **User Experience & Abuse Prevention** (Priority: Medium)
    - Prevent review spam (rate limiting, verification)
    - Clear guidelines for reviews
    - Responsive, accessible UI for reviews and wishlists

## 5. User experience

### 5.1 Entry points & first-time user flow
- Reviews visible on all product pages
- Wishlist option visible on product and catalog pages (for logged-in users)

### 5.2 Core experience
- **Step 1:** Read reviews and ratings on product pages
    - See overall rating and recent reviews
- **Step 2:** Leave a review (registered users)
    - Simple form with rating, text, and optional images
- **Step 3:** Add products to wishlist (registered users)
    - Wishlist accessible from account dashboard

### 5.3 Advanced features & edge cases
- Handling review/report abuse
- Preventing duplicate reviews
- Wishlists for out-of-stock or discontinued products

### 5.4 UI/UX highlights
- Prominent review and wishlist buttons
- Clear moderation/reporting tools
- Responsive design for all devices

## 6. Narrative

Shoppers can share feedback and save favorite products, while brands and admins ensure a safe, high-quality review environment. Wishlists help users organize and revisit products, driving engagement and sales.

## 7. Success metrics

### 7.1 User-centric metrics
- Review submission and approval rate
- Wishlist usage rate

### 7.2 Business metrics
- Increase in repeat purchases
- Growth in product review volume

### 7.3 Technical metrics
- Review moderation response time
- Spam/abuse report rate

## 8. Technical considerations

### 8.1 Integration points
- Product catalog (for reviews and wishlists)
- User accounts (for wishlist and review authorship)
- Admin dashboard (for moderation)

### 8.2 Data storage & privacy
- Store reviews and wishlists securely
- Protect user privacy in reviews

### 8.3 Scalability & performance
- Support for high review and wishlist volumes
- Efficient moderation workflows

### 8.4 Potential challenges
- Preventing spam and abuse
- Handling review/report disputes

## 9. Milestones & sequencing

### 9.1 Project estimate
- Medium: 3-4 weeks

### 9.2 Team size & composition
- Small Team: 1 PM, 2 Engineers, 1 Designer

### 9.3 Suggested phases
- **Phase 1:** Reviews & ratings core (1 week)
    - Key deliverables: Review forms, display, moderation tools
- **Phase 2:** Wishlists (1 week)
    - Key deliverables: Wishlist add/remove, dashboard
- **Phase 3:** Abuse prevention & advanced features (1 week)
    - Key deliverables: Reporting, spam filters, brand responses
- **Phase 4:** QA, polish, and launch (1 week)
    - Key deliverables: Testing, bug fixes, documentation

## 10. User stories

### 10.1 Product Reviews
- **ID**: US-001
- **Description**: As a registered user, I want to leave reviews and ratings for products so that I can share my experience.
- **Acceptance Criteria**:
    - Review form with rating and text
    - Reviews displayed on product pages

### 10.2 Review Moderation & Reporting
- **ID**: US-002
- **Description**: As an admin, I want to moderate and respond to abuse reports so that reviews remain high quality.
- **Acceptance Criteria**:
    - Admin dashboard for moderation
    - User reporting tools

### 10.3 Wishlists
- **ID**: US-003
- **Description**: As a registered user, I want to save products to a wishlist so that I can find them easily later.
- **Acceptance Criteria**:
    - Add/remove products to wishlist
    - Wishlist accessible from dashboard 