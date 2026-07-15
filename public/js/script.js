// RentEase API Base URL
const API_BASE = '/api';

// Load products from server
async function loadProducts() {
  try {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error('Failed to load products');
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('Error loading products:', error);
    document.getElementById('productContainer').innerHTML = '<p>Error loading products</p>';
  }
}

// Display products on page
function displayProducts(products) {
  const container = document.getElementById('productContainer');
  if (!container) return;

  container.innerHTML = products.map(product => `
    <div class="card">
      <img src="images/${product.image}" alt="${product.name}" style="width:100%; height:200px; background:#ddd;">
      <h3>${product.name}</h3>
      <p class="price">₹${product.price}/month</p>
      <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Rent Now</button>
    </div>
  `).join('');
}

// Add to cart
function addToCart(id, name, price) {
  let cart = getCart();
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    alert(`${name} is already in your cart!`);
  } else {
    cart.push({ id, name, price });
    saveCart(cart);
    alert(`${name} added to cart!`);
  }
}

// Get cart from localStorage
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Display cart items
function displayCart() {
  const cart = getCart();
  const cartContainer = document.getElementById('cartContainer');
  const totalRentEl = document.getElementById('totalRent');

  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p style="text-align:center; padding:20px;">Your cart is empty</p>';
    if (totalRentEl) totalRentEl.textContent = '₹0/month';
    return;
  }

  const totalRent = cart.reduce((sum, item) => sum + item.price, 0);

  cartContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <h4>${item.name}</h4>
        <p class="price">₹${item.price}/month</p>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
    </div>
  `).join('');

  if (totalRentEl) {
    totalRentEl.textContent = `₹${totalRent}/month`;
  }
}

// Remove from cart
function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  displayCart();
}

// Checkout
async function checkout() {
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;
  const phone = document.getElementById('phone').value;
  const cart = getCart();

  if (!fullName || !email || !address || !phone) {
    alert('Please fill in all fields');
    return;
  }

  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }

  const totalRent = cart.reduce((sum, item) => sum + item.price, 0);

  try {
    const response = await fetch(`${API_BASE}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, address, phone, cart, totalRent })
    });

    if (!response.ok) throw new Error('Checkout failed');
    
    const result = await response.json();
    alert(`Order Confirmed!\nOrder ID: ${result.orderId}\n\nWe'll contact you at ${phone} to arrange delivery.`);
    
    localStorage.removeItem('cart');
    window.location.href = '/';
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Checkout failed. Please try again.');
  }
}

// Search products
function searchProducts(query) {
  const container = document.getElementById('productContainer');
  if (!container) return;

  const cards = container.querySelectorAll('.card');
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(query.toLowerCase()) ? 'block' : 'none';
  });
}

// Admin: Add product
async function addProduct() {
  const name = document.getElementById('productName').value;
  const price = document.getElementById('productPrice').value;

  if (!name || !price) {
    alert('Please fill in all fields');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price })
    });

    if (!response.ok) throw new Error('Failed to add product');

    alert('Product added successfully!');
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    loadAdminProducts();
  } catch (error) {
    console.error('Error adding product:', error);
    alert('Failed to add product');
  }
}

// Admin: Load all products
async function loadAdminProducts() {
  try {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error('Failed to load products');
    const products = await response.json();

    const container = document.getElementById('productsList');
    if (!container) return;

    container.innerHTML = products.map(p => `
      <div class="product-item">
        <div>
          <h4>${p.name}</h4>
          <p>Price: ₹${p.price}/month</p>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading admin products:', error);
  }
}

// Login
async function login() {
  const email = document.getElementById('email')?.value;
  const password = document.getElementById('password')?.value;

  if (!email || !password) {
    alert('Please fill in all fields');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (result.success) {
      localStorage.setItem('admin', 'true');
      alert('Login successful!');
      window.location.href = '/admin';
    } else {
      alert(result.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed');
  }
}

// Check if user is admin
function checkAdmin() {
  if (!localStorage.getItem('admin')) {
    alert('Please login first');
    window.location.href = '/login';
  }
}

// Logout
function logout() {
  localStorage.removeItem('admin');
  window.location.href = '/';
}

// Load on page load
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  displayCart();

  // Auto-refresh cart on other pages
  setInterval(() => {
    displayCart();
  }, 1000);
});
