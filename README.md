# ✦ StyleZ — Haute Couture & Contemporary Luxury E-Commerce

A modern, full-stack luxury fashion e-commerce platform built with **Node.js**, **Express.js**, **SQLite**, and **vanilla HTML/CSS/JavaScript**.

Featuring a visual palette of **deep obsidian black (`#0A0A0A`)**, **champagne gold (`#D4AF37`)**, and **warm ivory (`#FAF7F2`)**, StyleZ delivers an editorial shopping experience with fluid transitions, scroll reveals, interactive quick view with image zoom, sliding shopping-cart drawer, and dual-mode architecture:
- **Full-Stack Mode**: Node.js/Express + SQLite backend with session auth, server-side stock-decremented checkout, and order history.
- **Static GitHub Pages Mode**: Automatic fallback to client-side static data (`public/js/products-data.js`), enabling the complete product catalog, category filters, live search, price slider, sorting, product quick view with fabric zoom, and shopping bag with local persistence to run without any backend server.

---

## 💎 Features & Dual-Mode Compatibility

| Feature | Static Mode (GitHub Pages) | Full-Stack Mode (Node.js/Express + SQLite) | Description |
|---|---|---|---|
| **Product Catalog** | ✅ Works 100% | ✅ Works 100% | 12 luxury garments with editorial photography & details |
| **Category Filtering** | ✅ Works 100% | ✅ Works 100% | All, Women, Men, Outerwear, Accessories, Footwear |
| **Debounced Search** | ✅ Works 100% | ✅ Works 100% | Instant search by name, fabric, cut, or badge |
| **Price Slider & Sorting** | ✅ Works 100% | ✅ Works 100% | Max price filter & sort by price, rating, newest, featured |
| **Product Quick View** | ✅ Works 100% | ✅ Works 100% | Interactive thumbnail gallery, size & color pickers |
| **Interactive Fabric Zoom** | ✅ Works 100% | ✅ Works 100% | Cursor-driven zoom over garment fabrics |
| **Shopping Bag Drawer** | ✅ Works 100% | ✅ Works 100% | Slide-in drawer, +/- quantity steppers, free shipping bar |
| **Local Storage Persistence**| ✅ Works 100% | ✅ Works 100% | Bag contents preserved in browser `localStorage` |
| **Toast Notifications** | ✅ Works 100% | ✅ Works 100% | Micro-interaction toast alerts for user feedback |
| **User Sign-In / Register** | ℹ️ Backend Notice | ✅ Full Session Auth | Salted bcrypt hashing, session cookies, demo autofill |
| **Atomic Stock Checkout** | ℹ️ Backend Notice | ✅ Server Stock Decrement | Calculates prices & atomically deducts units in SQLite |
| **Order Archives History** | ℹ️ Backend Notice | ✅ Persistent SQLite | Displays previous orders, item receipts, and statuses |

*Note: In static mode on GitHub Pages, features requiring a database (Sign-in, Server Checkout, Order Archives) display an informative notification explaining that a Node.js/Express host is required.*

---

## 🛠 Technology Stack

- **Frontend:** Semantic HTML5, CSS3 Custom Properties (Variables), Vanilla ES6+ JavaScript
- **Static Data Source:** `public/js/products-data.js` (exported via `window.StyleZStaticData`)
- **Backend:** Node.js, Express.js (v5)
- **Database:** SQLite with `better-sqlite3` (WAL mode enabled, foreign keys enforced)
- **Authentication:** `express-session`, `bcryptjs`
- **Logging:** `morgan`

---

## 📁 Project Structure

```
styleZ/
├── package.json               # Dependencies and start scripts
├── index.html                 # Root redirect for GitHub Pages (branch root deployment)
├── .env.example               # Environment variables template
├── .env                       # Active environment configuration
├── server.js                  # Express application and route mounting
├── README.md                  # Documentation and setup guide
│
├── database/
│   ├── db.js                  # SQLite database connection & schema init
│   ├── schema.sql             # SQL table definitions & indexes
│   ├── seed.js                # Sample catalog and demo user seeder
│   └── stylez.db              # SQLite database file
│
├── middleware/
│   └── auth.js                # Session attachment and protected route guard
│
├── routes/
│   ├── auth.js                # Register, login, logout, session /me
│   ├── products.js            # Catalog filtering, search, and details
│   ├── checkout.js            # Stock-validated atomic order processor
│   └── orders.js              # User order history archives
│
└── public/
    ├── index.html             # Single-page storefront markup & modals
    ├── css/
    │   ├── styles.css         # Design tokens, layout, hero, typography
    │   ├── components.css     # Cards, drawer, modals, forms, toasts
    │   └── animations.css     # Keyframes and scroll reveal classes
    └── js/
        ├── products-data.js   # 12 seeded products & 5 categories for static mode
        ├── api.js             # API client with automatic static catalog fallback
        ├── state.js           # Client state store (cart, user, filters)
        ├── cart.js            # Shopping bag drawer and quantity logic
        ├── auth.js            # Auth modal, demo autofill, session check
        ├── checkout.js        # Checkout modal, validation, confirmation
        ├── orders.js          # Order history archives controller
        ├── ui.js              # Product cards, quick view zoom, toasts
        └── app.js             # Bootstrap and catalog event wiring
```

---

## 🚀 How to Test Locally

### Option A: Test Full-Stack Mode (with Express & SQLite)
1. In the project folder, start the backend server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
3. Test all features:
   - Full catalog with category filtering, search, sorting, and price slider.
   - Click "Sign In", click **"✦ 1-Click Auto-Fill Demo Account"** (`client@stylez.com` / `password123`), and log in.
   - View previous purchases in **Order Archives**.
   - Add pieces to bag, click "Proceed to Checkout", and submit demo order. Stock is validated and decremented in SQLite!

### Option B: Test Static Mode (Simulating GitHub Pages)
You can test static mode locally using any static HTTP server (without running Node/Express backend):
```bash
# Using npx serve:
npx serve public -p 8080

# Or Python's built-in static server:
cd public && python -m http.server 8080
```
Open `http://localhost:8080` in your browser.
Notice:
- The catalog loads instantly with all 12 haute couture pieces.
- Category filters (*Women*, *Men*, *Outerwear*, *Accessories*, *Footwear*) work immediately.
- Live search (*Silk*, *Cashmere*, *Blazer*), price slider, and sorting work seamlessly.
- Quick View with fabric hover zoom, size pills, and color selectors works.
- Shopping bag drawer with quantity adjustments and local storage persistence works.

---

## 🌐 How to Deploy to GitHub Pages

1. **Push your repository to GitHub**:
   ```bash
   git add .
   git commit -m "Add GitHub Pages static catalog support"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Under **Branch**, select `main` and folder `/ (root)`.
   - Click **Save**.

3. **Open the live site**:
   - In a few moments, GitHub Pages will deploy your site at:
     `https://<your-username>.github.io/<repository-name>/`
   - The root `index.html` automatically routes directly to `public/index.html`.
   - The product catalog, shopping bag, and interactions work immediately without any backend server.

---

## 🔑 Demo Account Credentials (Full-Stack Mode)

| Role | Email | Password | Pre-loaded Data |
|---|---|---|---|
| **Client** | `client@stylez.com` | `password123` | 2 prior orders in Order Archives |
| **Admin** | `admin@stylez.com` | `admin123` | Full atelier access |
