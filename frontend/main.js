
// =================== DATA STORE ===================
let products = [
    { id: 1, name: "Premium Plain Makhana", category: "plain", price: 174, mrp: 299, weight: "100g", stock: 150, desc: "Pure, unprocessed fox nuts — perfect for your first MakhanaBliss experience. Hand-harvested from pristine wetlands.", emoji: "🌾", badge: "Bestseller" },
    { id: 2, name: "Salt & Pepper Makhana", category: "flavoured", price: 199, mrp: 299, weight: "100g", stock: 80, desc: "Perfectly baked with Himalayan pink salt and freshly cracked pepper. Addictively crispy.", emoji: "🧂", badge: "New" },
    { id: 3, name: "Peri Peri Makhana", category: "flavoured", price: 199, mrp: 299, weight: "100g", stock: 75, desc: "Bold African spice blend meets Bihar's finest fox nuts. Fiery, flavourful, fantastic.", emoji: "🌶️", badge: "Hot" },
    { id: 4, name: "Cream & Onion Makhana", category: "flavoured", price: 199, mrp: 299, weight: "100g", stock: 90, desc: "Classic cream & onion flavour on guilt-free makhana. Your favourite chips, reimagined healthy.", emoji: "🧅", badge: "Popular" },
    { id: 5, name: "Family Value Pack", category: "combo", price: 449, mrp: 699, weight: "300g", stock: 60, desc: "Three packs of our premium plain makhana. Best value for regular makhana lovers.", emoji: "📦", badge: "Save 36%" },
    { id: 6, name: "Flavour Explorer Combo", category: "combo", price: 549, mrp: 799, weight: "4×100g", stock: 40, desc: "Try all four flavours! Perfect gift set or sampler pack for new customers.", emoji: "🎁", badge: "Gift Pack" },
    { id: 7, name: "Honey & Cinnamon Makhana", category: "special", price: 229, mrp: 349, weight: "100g", stock: 55, desc: "A touch of pure honey and warm cinnamon. Perfect healthy dessert alternative.", emoji: "🍯", badge: "Special" },
    { id: 8, name: "Keto Starter Pack", category: "special", price: 649, mrp: 999, weight: "2×100g+Guide", stock: 30, desc: "Specially curated for keto diet followers. Includes nutrition guide and two premium packs.", emoji: "💪", badge: "Keto" },
];

let cart = [];
let orders = JSON.parse(localStorage.getItem('mb_orders') || '[]');
let nextProductId = Math.max(...products.map(p => p.id)) + 1;

// =================== NAVIGATION ===================
function navigate(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    window.scrollTo(0, 0);
    if (page === 'home') renderHomeProducts();
    if (page === 'products') renderAllProducts('all');
    if (page === 'cart') renderCart();
    if (page === 'checkout') renderCheckout();
    if (page === 'admin') renderAdmin();
}

// =================== TOAST ===================
function showToast(msg, emoji = '✓') {
    const t = document.getElementById('toast');
    t.innerHTML = `<span style="font-size:1.2rem">${emoji}</span> ${msg}`;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

// =================== CART LOGIC ===================
function updateCartCount() {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    document.getElementById('cartCount').textContent = total;
}

function addToCart(productId) {
    const p = products.find(x => x.id === productId);
    if (!p) return;
    const existing = cart.find(x => x.id === productId);
    if (existing) { existing.qty++; }
    else { cart.push({ ...p, qty: 1 }); }
    updateCartCount();
    showToast(`${p.name} added to cart!`, p.emoji);
}

function removeFromCart(productId) {
    cart = cart.filter(x => x.id !== productId);
    updateCartCount();
    renderCart();
}

function updateQty(productId, delta) {
    const item = cart.find(x => x.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(productId);
    else renderCart();
    updateCartCount();
}

function getCartTotal() {
    return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

// =================== PRODUCT CARD ===================
function productCardHTML(p, showFull = false) {
    const dotsHTML = Array.from({ length: 12 }, (_, i) => `
    <div class="makhana-dot" style="--d:${2 + Math.random() * 2}s; --delay:${Math.random() * 2}s; 
    width:${14 + Math.random() * 8}px; height:${14 + Math.random() * 8}px; 
    background:radial-gradient(circle at 35% 35%, ${p.category === 'flavoured' ? '#F5C060,#C87820' : '#F5E8C0,#D4A820'})">
    </div>`).join('');

    const badgeClass = p.badge === 'New' || p.badge === 'Hot' ? 'new' : '';
    return `
    <div class="product-card" onclick="navigate('products')">
      <div class="product-img">
        <span style="font-size:4rem">${p.emoji}</span>
        ${p.badge ? `<div class="product-badge ${badgeClass}">${p.badge}</div>` : ''}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc.substring(0, 80)}...</div>
        <div class="product-footer">
          <div class="product-price">
            <span class="price-now">₹${p.price}</span>
            ${p.mrp > p.price ? `<span class="price-old">₹${p.mrp}</span>` : ''}
          </div>
          <button class="add-cart-btn" onclick="event.stopPropagation(); addToCart(${p.id})">+ Add</button>
        </div>
      </div>
    </div>`;
}

// =================== HOME PRODUCTS ===================
function renderHomeProducts() {
    const grid = document.getElementById('homeProductsGrid');
    if (!grid) return;
    grid.innerHTML = products.slice(0, 4).map(p => productCardHTML(p)).join('');
}

// =================== ALL PRODUCTS ===================
function renderAllProducts(filter) {
    const grid = document.getElementById('allProductsGrid');
    if (!grid) return;
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
    grid.innerHTML = filtered.length > 0
        ? filtered.map(p => productCardHTML(p)).join('')
        : `<div style="grid-column:1/-1; text-align:center; padding:60px; color:var(--text-muted)">No products in this category yet.</div>`;
}

function filterProducts(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderAllProducts(cat);
}

// =================== CART RENDER ===================
function renderCart() {
    const el = document.getElementById('cartContent');
    if (cart.length === 0) {
        el.innerHTML = `
      <div class="empty-cart">
        <div class="icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet!</p>
        <button class="btn-primary" onclick="navigate('products')">Shop Now</button>
      </div>`;
        return;
    }
    const shipping = getCartTotal() >= 299 ? 0 : 49;
    el.innerHTML = `
    <div class="cart-layout">
      <div>
        <div class="cart-items">
          ${cart.map(item => `
            <div class="cart-item">
              <div class="cart-item-img">${item.emoji}</div>
              <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-variant">${item.weight}</div>
                <div class="cart-item-price">₹${item.price * item.qty}</div>
              </div>
              <div class="qty-ctrl">
                <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
                <span class="qty-num">${item.qty}</span>
                <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
              </div>
              <button class="remove-btn" onclick="removeFromCart(${item.id})">✕ Remove</button>
            </div>`).join('')}
        </div>
      </div>
      <div>
        <div class="order-summary">
          <div class="summary-title">Order Summary</div>
          <div class="summary-row"><span>Subtotal (${cart.reduce((s, i) => s + i.qty, 0)} items)</span><span>₹${getCartTotal()}</span></div>
          <div class="summary-row"><span>Delivery</span><span>${shipping === 0 ? '<span style="color:var(--green)">FREE</span>' : '₹' + shipping}</span></div>
          ${shipping > 0 ? `<div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:8px;">Add ₹${299 - getCartTotal()} more for free delivery</div>` : ''}
          <div class="summary-row total"><span>Total</span><span>₹${getCartTotal() + shipping}</span></div>
          <div class="cod-badge">
            <span>💵</span>
            <span>Cash on Delivery Available</span>
          </div>
          <button class="checkout-btn" onclick="navigate('checkout')">Proceed to Checkout →</button>
          <button onclick="navigate('products')" style="width:100%; margin-top:10px; background:transparent; border:none; color:var(--text-muted); font-size:0.85rem; cursor:pointer; padding:8px;">← Continue Shopping</button>
        </div>
      </div>
    </div>`;
}

// =================== CHECKOUT ===================
function renderCheckout() {
    if (cart.length === 0) { navigate('cart'); return; }
    const shipping = getCartTotal() >= 299 ? 0 : 49;
    document.getElementById('checkoutItems').innerHTML = cart.map(i => `
    <div class="checkout-item">
      <div class="checkout-item-img">${i.emoji}</div>
      <div>
        <div class="checkout-item-name">${i.name}</div>
        <div class="checkout-item-qty">Qty: ${i.qty} · ${i.weight}</div>
      </div>
      <div class="checkout-item-price">₹${i.price * i.qty}</div>
    </div>`).join('');
    document.getElementById('checkoutTotals').innerHTML = `
    <div style="margin-top:16px;">
      <div class="summary-row"><span>Subtotal</span><span>₹${getCartTotal()}</span></div>
      <div class="summary-row"><span>Delivery</span><span>${shipping === 0 ? '<span style="color:var(--green)">FREE</span>' : '₹' + shipping}</span></div>
      <div class="summary-row total"><span>Total (COD)</span><span>₹${getCartTotal() + shipping}</span></div>
    </div>`;
}

function validateCheckout() {
    const fields = [
        { id: 'fname', msg: 'First name is required' },
        { id: 'lname', msg: 'Last name is required' },
        { id: 'phone', msg: 'Valid phone number required', pattern: /^[6-9]\d{9}$/ },
        { id: 'email', msg: 'Valid email required', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        { id: 'addr1', msg: 'Address is required' },
        { id: 'city', msg: 'City is required' },
        { id: 'state', msg: 'Please select a state' },
        { id: 'pin', msg: 'Valid 6-digit PIN code required', pattern: /^\d{6}$/ },
    ];
    let valid = true;
    fields.forEach(f => {
        const el = document.getElementById(f.id);
        const errEl = document.getElementById(f.id + '-err');
        if (!el) return;
        const val = el.value.trim();
        let ok = val.length > 0;
        if (ok && f.pattern) ok = f.pattern.test(val);
        if (!ok) {
            el.classList.add('error');
            if (errEl) errEl.textContent = f.msg;
            valid = false;
        } else {
            el.classList.remove('error');
            if (errEl) errEl.textContent = '';
        }
    });
    return valid;
}

function placeOrder() {
    if (!validateCheckout()) {
        showToast('Please fill all required fields', '⚠️');
        return;
    }
    const shipping = getCartTotal() >= 299 ? 0 : 49;
    const order = {
        id: 'MB' + Date.now().toString().slice(-6),
        customer: document.getElementById('fname').value + ' ' + document.getElementById('lname').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('addr1').value + ', ' + document.getElementById('city').value + ', ' + document.getElementById('state').value + ' - ' + document.getElementById('pin').value,
        items: [...cart],
        subtotal: getCartTotal(),
        shipping, total: getCartTotal() + shipping,
        payment: 'COD',
        status: 'Confirmed',
        date: new Date().toLocaleDateString('en-IN')
    };
    orders.unshift(order);
    localStorage.setItem('mb_orders', JSON.stringify(orders));

    // Render confirmation
    document.getElementById('confirmDetails').innerHTML = `
    <div class="order-detail-row"><span>Order ID</span><span style="color:var(--gold); font-family:'Playfair Display',serif">#${order.id}</span></div>
    <div class="order-detail-row"><span>Customer</span><span>${order.customer}</span></div>
    <div class="order-detail-row"><span>Items</span><span>${order.items.reduce((s, i) => s + i.qty, 0)} items</span></div>
    <div class="order-detail-row"><span>Total Amount</span><span>₹${order.total}</span></div>
    <div class="order-detail-row"><span>Payment</span><span>💵 Cash on Delivery</span></div>
    <div class="order-detail-row"><span>Delivery Address</span><span style="text-align:right; max-width:200px;">${order.address}</span></div>
    <div class="order-detail-row"><span>Estimated Delivery</span><span style="color:var(--green)">3–5 Business Days</span></div>`;

    cart = [];
    updateCartCount();
    navigate('confirm');
}

// =================== ADMIN ===================
function renderAdmin() {
    renderAdminStats();
    renderAdminProducts();
    renderAdminOrders();
    renderRecentOrders();
}

function renderAdminStats() {
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const el = document.getElementById('adminStats');
    if (!el) return;
    el.innerHTML = `
    <div class="stat-card"><div class="stat-label">Total Orders</div><div class="stat-num">${orders.length}</div><div class="stat-change">↑ All time</div></div>
    <div class="stat-card"><div class="stat-label">Total Revenue</div><div class="stat-num">₹${totalRevenue.toLocaleString('en-IN')}</div><div class="stat-change">↑ COD</div></div>
    <div class="stat-card"><div class="stat-label">Products</div><div class="stat-num">${products.length}</div><div class="stat-change">Active</div></div>
    <div class="stat-card"><div class="stat-label">In Stock</div><div class="stat-num">${products.filter(p => p.stock > 0).length}</div><div class="stat-change">Available</div></div>`;
}

function renderRecentOrders() {
    const el = document.getElementById('recentOrdersTable');
    if (!el) return;
    if (orders.length === 0) { el.innerHTML = '<tr><td colspan="5" style="padding:24px; text-align:center; color:var(--text-muted)">No orders yet</td></tr>'; return; }
    el.innerHTML = `<thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead><tbody>` +
        orders.slice(0, 5).map(o => `
      <tr>
        <td><strong style="color:var(--gold)">#${o.id}</strong></td>
        <td>${o.customer}</td>
        <td>₹${o.total}</td>
        <td><span class="status-badge confirmed">${o.status}</span></td>
        <td>${o.date}</td>
      </tr>`).join('') + '</tbody>';
}

function renderAdminProducts() {
    const el = document.getElementById('adminProductsTable');
    if (!el) return;
    el.innerHTML = products.map(p => `
    <tr>
      <td><strong>${p.emoji} ${p.name}</strong><div style="font-size:0.78rem; color:var(--text-muted)">${p.weight}</div></td>
      <td style="text-transform:capitalize">${p.category}</td>
      <td>₹${p.price}</td>
      <td style="text-decoration:line-through; color:var(--text-muted)">₹${p.mrp}</td>
      <td>${p.stock}</td>
      <td>
        <div class="table-actions">
          <button class="table-btn edit" onclick="editProduct(${p.id})">Edit</button>
          <button class="table-btn delete" onclick="deleteProduct(${p.id})">Delete</button>
        </div>
      </td>
    </tr>`).join('');
}

function renderAdminOrders() {
    const el = document.getElementById('adminOrdersTable');
    if (!el) return;
    if (orders.length === 0) { el.innerHTML = '<tr><td colspan="7" style="padding:24px; text-align:center; color:var(--text-muted)">No orders yet. Orders will appear here after customers place them.</td></tr>'; return; }
    el.innerHTML = orders.map(o => `
    <tr>
      <td><strong style="color:var(--gold)">#${o.id}</strong></td>
      <td>${o.customer}<div style="font-size:0.78rem; color:var(--text-muted)">${o.phone}</div></td>
      <td>${o.items.reduce((s, i) => s + i.qty, 0)} items</td>
      <td>₹${o.total}</td>
      <td><span class="status-badge ${o.status === 'Delivered' ? 'delivered' : 'confirmed'}">${o.status}</span></td>
      <td>${o.date}</td>
      <td>
        <button class="table-btn edit" onclick="markDelivered('${o.id}')">Mark Delivered</button>
      </td>
    </tr>`).join('');
}

function markDelivered(orderId) {
    const o = orders.find(x => x.id === orderId);
    if (o) { o.status = 'Delivered'; localStorage.setItem('mb_orders', JSON.stringify(orders)); renderAdminOrders(); showToast('Order marked as delivered!', '✓'); }
}

function showAdminPanel(panel, btn) {
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
    document.getElementById('admin-' + panel).classList.add('active');
    btn.classList.add('active');
    if (panel === 'dashboard') { renderAdminStats(); renderRecentOrders(); }
    if (panel === 'products') renderAdminProducts();
    if (panel === 'orders') renderAdminOrders();
}

let isEditing = false;
function toggleAddForm() {
    const f = document.getElementById('addProductForm');
    f.style.display = f.style.display === 'none' ? 'block' : 'none';
    if (f.style.display === 'none') { clearProductForm(); isEditing = false; }
}

function clearProductForm() {
    ['pName', 'pCategory', 'pPrice', 'pMrp', 'pWeight', 'pStock', 'pDesc', 'pEmoji', 'editProductId'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    document.getElementById('formTitle').textContent = 'Add New Product';
    isEditing = false;
}

function saveProduct() {
    const name = document.getElementById('pName').value.trim();
    const price = parseInt(document.getElementById('pPrice').value);
    if (!name || !price) { showToast('Name and price are required!', '⚠️'); return; }

    const editId = parseInt(document.getElementById('editProductId').value);
    if (isEditing && editId) {
        const p = products.find(x => x.id === editId);
        if (p) {
            p.name = name;
            p.category = document.getElementById('pCategory').value;
            p.price = price;
            p.mrp = parseInt(document.getElementById('pMrp').value) || price;
            p.weight = document.getElementById('pWeight').value || '100g';
            p.stock = parseInt(document.getElementById('pStock').value) || 0;
            p.desc = document.getElementById('pDesc').value || '';
            p.emoji = document.getElementById('pEmoji').value || '📦';
            showToast('Product updated!', '✓');
        }
    } else {
        products.push({
            id: nextProductId++,
            name, price,
            category: document.getElementById('pCategory').value,
            mrp: parseInt(document.getElementById('pMrp').value) || price,
            weight: document.getElementById('pWeight').value || '100g',
            stock: parseInt(document.getElementById('pStock').value) || 0,
            desc: document.getElementById('pDesc').value || 'Premium quality makhana.',
            emoji: document.getElementById('pEmoji').value || '📦',
            badge: 'New'
        });
        showToast('Product added!', '✓');
    }
    clearProductForm();
    document.getElementById('addProductForm').style.display = 'none';
    renderAdminProducts();
}

function editProduct(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    document.getElementById('editProductId').value = p.id;
    document.getElementById('pName').value = p.name;
    document.getElementById('pCategory').value = p.category;
    document.getElementById('pPrice').value = p.price;
    document.getElementById('pMrp').value = p.mrp;
    document.getElementById('pWeight').value = p.weight;
    document.getElementById('pStock').value = p.stock;
    document.getElementById('pDesc').value = p.desc;
    document.getElementById('pEmoji').value = p.emoji;
    document.getElementById('formTitle').textContent = 'Edit Product';
    document.getElementById('addProductForm').style.display = 'block';
    isEditing = true;
    document.getElementById('addProductForm').scrollIntoView({ behavior: 'smooth' });
}

function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    products = products.filter(p => p.id !== id);
    renderAdminProducts();
    showToast('Product deleted', '🗑️');
}

// =================== HERO MAKHANA VISUAL ===================
function initHeroMakhana() {
    const el = document.getElementById('heroMakhana');
    if (!el) return;
    el.innerHTML = Array.from({ length: 20 }, (_, i) => `
    <div class="makhana-dot" style="
      --d:${2 + Math.random() * 3}s;
      --delay:${Math.random() * 3}s;
      width:${16 + Math.random() * 10}px;
      height:${16 + Math.random() * 10}px;">
    </div>`).join('');
}
// =================== CONTACT FORM ===================
function submitContact() {
    const fields = [
        { id: 'cname', msg: 'Name is required' },
        { id: 'cphone', msg: 'Valid phone number required', pattern: /^[6-9]\d{9}$/ },
        { id: 'cemail', msg: 'Valid email required', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        { id: 'cmessage', msg: 'Please write a message' },
    ];
    let valid = true;
    fields.forEach(f => {
        const el = document.getElementById(f.id);
        const err = document.getElementById(f.id + '-err');
        if (!el) return;
        const val = el.value.trim();
        let ok = val.length > 0;
        if (ok && f.pattern) ok = f.pattern.test(val);
        if (!ok) {
            el.classList.add('error');
            if (err) err.textContent = f.msg;
            valid = false;
        } else {
            el.classList.remove('error');
            if (err) err.textContent = '';
        }
    });
    if (!valid) { showToast('Please fill all required fields', '⚠️'); return; }

    // Show success
    document.getElementById('contactSuccess').classList.add('show');
    showToast('Message sent successfully!', '✓');

    // Reset form after 4 seconds
    setTimeout(() => {
        document.getElementById('contactSuccess').classList.remove('show');
        ['cname', 'cphone', 'cemail', 'csubject', 'cmessage'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    }, 4000);
}

// =================== FAQ TOGGLE ===================
function toggleFaq(item) {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
}

// =================== INIT ===================
document.addEventListener('DOMContentLoaded', () => {
    initHeroMakhana();
    renderHomeProducts();
});