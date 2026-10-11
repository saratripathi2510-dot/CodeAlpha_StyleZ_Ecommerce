# âœ¦ StyleZ â€” Haute Couture & Contemporary Luxury E-Commerce

A modern, full-stack luxury fashion e-commerce platform built with **Node.js**, **Express.js**, **SQLite**, and **vanilla HTML/CSS/JavaScript**.

Featuring a visual palette of **deep obsidian black (`#0A0A0A`)**, **champagne gold (`#D4AF37`)**, and **warm ivory (`#FAF7F2`)**, StyleZ delivers an editorial shopping experience with fluid transitions, scroll reveals, interactive quick view with image zoom, sliding shopping-cart drawer, server-validated stock checkouts, and user order archives.

---

## ðŸ’Ž Features & Capabilities

1. **Editorial Fashion Experience**:
   - Cinematic hero section with high-resolution imagery and campaign metrics.
   - Animated marquee badge ticker ("Handcrafted in Florence", "Super 150s Virgin Wool", etc.).
   - Fluid scroll-triggered reveals powered by `IntersectionObserver`.
   - Hover micro-interactions with smooth gold glow and card elevation.

2. **Catalog & Filtering**:
   - Category filtering pills: *All Collections*, *Women*, *Men*, *Outerwear*, *Accessories*, *Footwear*.
   - Live debounced search across product titles, descriptions, and materials.
   - Interactive price range slider ($150 to $1,200).
   - Multi-option sorting: *Featured Curations*, *Price: Low to High*, *Price: High to Low*, *Customer Rating*, *Newest Additions*.
   - Instant 1-click filter reset.

3. **Product Details & Quick View Modal**:
   - Interactive gallery with thumbnail switching.
   - Cursor-driven hover zoom over fabric details.
   - Interactive size pills and color variation selectors.
   - Live atelier stock indicator ("In Atelier" or "X remaining").
   - Detailed fabric and craftsmanship specifications.

4. **Sliding Shopping Cart Drawer**:
   - Slide-in drawer with glassmorphism backdrop.
   - Dynamic item quantity adjustment (`+` / `âˆ’`) bound to inventory limits.
   - Real-time subtotal calculation.
   - Free shipping progress bar indicating distance to complimentary courier ($300 threshold).
   - Animated cart badge bump in navbar.
   - Cart state persisted in browser `localStorage`.

5. **Secure Authentication & Session Management**:
   - Server-side session authentication with `express-session`.
   - Secure password hashing with `bcryptjs`.
   - Registration with input validation and duplicate email checks.
   - Tabbed login/register modal with error alerts.
   - **1-Click Demo Pre-Fill** for rapid testing:
     - **Email:** `client@stylez.com`
     - **Password:** `password123`
   - Signed-in user menu with initials avatar, profile greeting, and quick links.

6. **Server-Validated Demo Checkout**:
   - **Strict server-side validation**: unit prices and line totals are calculated on the server from the SQLite database (client prices are never trusted).
   - **Atomic inventory decrement**: stock counts are decremented within an atomic SQLite transaction upon order placement.
   - Out-of-stock and quantity bounds enforcement with user alerts.
   - Demo payment methods (Demo Platinum Card, White-Glove Cash on Delivery) clearly marked with evaluation disclaimers (no real cards billed).
   - Instant order confirmation modal with itemized receipt and generated tracking code (e.g. `STZ-2026-849102`).

7. **Order Archives & Order History**:
   - Signed-in clients can review all past orders at `/api/orders`.
   - Status indicators (*Confirmed*, *Processing*, *Delivered*).
   - Product thumbnails, item quantities, delivery destination, and price breakdowns.

---

## ðŸ›  Technology Stack

- **Backend:** Node.js, Express.js (v5)
- **Database:** SQLite with `better-sqlite3` (WAL mode enabled, foreign keys enforced)
- **Authentication:** `express-session`, `bcryptjs`
- **Frontend:** Semantic HTML5, CSS3 Custom Properties (Variables), Vanilla ES6+ JavaScript
- **Logging:** `morgan`

---

## ðŸ“ Project Structure

```
styleZ/
â”œâ”€â”€ package.json               # Dependencies and start scripts
â”œâ”€â”€ .env.example               # Environment variables template
â”œâ”€â”€ .env                       # Active environment configuration
â”œâ”€â”€ server.js                  # Express application and route mounting
â”œâ”€â”€ README.md                  # Documentation and setup guide
â”‚
â”œâ”€â”€ database/
â”‚   â”œâ”€â”€ db.js                  # SQLite database connection & schema init
â”‚   â”œâ”€â”€ schema.sql             # SQL table definitions & indexes
â”‚   â”œâ”€â”€ seed.js                # Sample catalog and demo user seeder
â”‚   â””â”€â”€ stylez.db              # SQLite database file
â”‚
â”œâ”€â”€ middleware/
â”‚   â””â”€â”€ auth.js                # Session attachment and protected route guard
â”‚
â”œâ”€â”€ routes/
â”‚   â”œâ”€â”€ auth.js                # Register, login, logout, session /me
â”‚   â”œâ”€â”€ products.js            # Catalog filtering, search, and details
â”‚   â”œâ”€â”€ checkout.js            # Stock-validated atomic order processor
â”‚   â””â”€â”€ orders.js              # User order history archives
â”‚
â””â”€â”€ public/
    â”œâ”€â”€ index.html             # Single-page storefront markup & modals
    â”œâ”€â”€ css/
    â”‚   â”œâ”€â”€ styles.css         # Design tokens, layout, hero, typography
    â”‚   â”œâ”€â”€ components.css     # Cards, drawer, modals, forms, toasts
    â”‚   â””â”€â”€ animations.css     # Keyframes and scroll reveal classes
    â””â”€â”€ js/
        â”œâ”€â”€ api.js             # Fetch wrapper for all backend routes
        â”œâ”€â”€ state.js           # Client state store (cart, user, filters)
        â”œâ”€â”€ cart.js            # Shopping bag drawer and quantity logic
        â”œâ”€â”€ auth.js            # Auth modal, demo autofill, session check
        â”œâ”€â”€ checkout.js        # Checkout modal, validation, confirmation
        â”œâ”€â”€ orders.js          # Order history archives controller
        â”œâ”€â”€ ui.js              # Product cards, quick view zoom, toasts
        â””â”€â”€ app.js             # Bootstrap and catalog event wiring
```

---

## ðŸš€ Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher recommended; v24 installed)
- **npm** (v9+)

### 2. Install Dependencies
Dependencies are already configured. If running on a new clone:
```bash
npm install
```

### 3. Initialize & Seed Database
The SQLite database comes pre-configured. To re-seed with fresh sample products and demo orders at any time:
```bash
npm run seed
```

### 4. Start the Application Server
Run the production/development server:
```bash
npm start
```
Or with automatic reload:
```bash
npm run dev
```

### 5. Open in Your Browser
Navigate to:
```
http://localhost:3000
```

---

## ðŸ”‘ Demo Account Credentials

| Role | Email | Password |
|---|---|---|
| **Client (Sample Orders)** | `client@stylez.com` | `password123` |
| **Admin** | `admin@stylez.com` | `admin123` |

*Tip: Clicking the **"âœ¦ 1-Click Auto-Fill Demo Account"** button in the Sign In modal fills these credentials automatically.*
# CodeAlpha_StyleZ_Ecommerce
CodeAlpha internship projects â€” full-stack web development

