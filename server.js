const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Data file paths
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initialize data files if they don't exist
if (!fs.existsSync(PRODUCTS_FILE)) {
  const defaultProducts = [
    { id: 1, name: 'Sofa', price: 899, image: 'sofa.jpg' },
    { id: 2, name: 'Bed', price: 1299, image: 'bed.jpg' },
    { id: 3, name: 'Dining Table', price: 999, image: 'dining-table.jpg' },
    { id: 4, name: 'Chair', price: 299, image: 'chair.jpg' },
    { id: 5, name: 'TV', price: 1499, image: 'tv.jpg' },
    { id: 6, name: 'Washing Machine', price: 2499, image: 'washing-machine.jpg' },
    { id: 7, name: 'Refrigerator', price: 3499, image: 'refrigerator.jpg' },
    { id: 8, name: 'Study Table', price: 599, image: 'study-table.jpg' }
  ];
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(defaultProducts, null, 2));
}

if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
}

// ============ PRODUCTS ROUTES ============

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
    const product = products.find(p => p.id == req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Add new product (admin)
app.post('/api/products', (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
    const newProduct = {
      id: Math.max(...products.map(p => p.id), 0) + 1,
      name: req.body.name,
      price: parseFloat(req.body.price),
      image: `product-${Date.now()}.jpg`
    };
    products.push(newProduct);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// ============ ORDERS/CHECKOUT ROUTES ============

// Process checkout
app.post('/api/checkout', (req, res) => {
  try {
    const { fullName, email, address, phone, cart, totalRent } = req.body;
    
    if (!fullName || !email || !address || !phone || !cart || cart.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const order = {
      orderId: 'ORD-' + Date.now(),
      fullName,
      email,
      address,
      phone,
      cart,
      totalRent,
      orderDate: new Date().toISOString(),
      status: 'confirmed'
    };

    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
    orders.push(order);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));

    res.status(201).json({
      message: 'Order confirmed',
      orderId: order.orderId,
      order
    });
  } catch (error) {
    res.status(500).json({ error: 'Checkout failed' });
  }
});

// Get all orders (admin)
app.get('/api/orders', (req, res) => {
  try {
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ============ AUTH ROUTES ============

// Simple login (dummy)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // Dummy credentials
  const adminEmail = 'admin@rentease.com';
  const adminPassword = 'admin123';
  
  if (email === adminEmail && password === adminPassword) {
    res.json({
      success: true,
      message: 'Login successful',
      user: { email, role: 'admin' }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// ============ SERVE PAGES ============

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Products page
app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'products.html'));
});

// Cart page
app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

// Checkout page
app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});

// Admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ============ ERROR HANDLING ============

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 RentEase server running on http://localhost:${PORT}`);
  console.log('Admin Login: admin@rentease.com / admin123');
});
