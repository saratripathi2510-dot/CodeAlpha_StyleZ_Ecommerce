-- StyleZ Database Schema

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category_id INTEGER NOT NULL,
    price REAL NOT NULL,
    compare_price REAL,
    description TEXT NOT NULL,
    details TEXT,
    images TEXT NOT NULL,
    sizes TEXT NOT NULL,
    colors TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 10,
    rating REAL DEFAULT 4.9,
    review_count INTEGER DEFAULT 24,
    featured INTEGER DEFAULT 0,
    badge TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT UNIQUE NOT NULL,
    user_id INTEGER,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL COLLATE NOCASE,
    customer_phone TEXT,
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL,
    subtotal REAL NOT NULL,
    shipping_fee REAL NOT NULL DEFAULT 0.0,
    tax REAL NOT NULL DEFAULT 0.0,
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'Confirmed',
    payment_method TEXT NOT NULL DEFAULT 'Demo Card',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    size TEXT,
    color TEXT,
    subtotal REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
