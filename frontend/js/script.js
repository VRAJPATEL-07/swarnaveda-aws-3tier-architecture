// Frontend script to fetch and render products and handle filtering/search
document.addEventListener('DOMContentLoaded', () => {
  const productsEl = document.getElementById('products');
  const categoriesEl = document.getElementById('categories');
  const searchInput = document.getElementById('search');
  const navLogin = document.getElementById('nav-login');
  const navProfile = document.getElementById('nav-profile');
  const cartCountEl = document.getElementById('cart-count');

  let allProducts = [];
  let activeCategory = 'All';

  // helper for auth
  const getToken = () => localStorage.getItem('sv_token');
  const isLoggedIn = () => !!getToken();
  const updateNav = () => {
    if (isLoggedIn()) {
      navLogin.textContent = 'Logout';
      navProfile.style.display = 'inline-block';
    } else {
      navLogin.textContent = 'Login';
      navProfile.style.display = 'none';
    }
  };

  const fetchCartCount = async () => {
    if (!isLoggedIn()) {
      cartCountEl.textContent = '0';
      return;
    }
    try {
      const res = await fetch('/api/cart', { headers: { Authorization: 'Bearer ' + getToken() } });
      if (!res.ok) throw new Error();
      const items = await res.json();
      const total = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
      cartCountEl.textContent = total;
    } catch {
      cartCountEl.textContent = '0';
    }
  };

  // Fetch products from API with query params
  const fetchProducts = async (opts = {}) => {
    try {
      const params = new URLSearchParams();
      if (opts.category && opts.category !== 'All') params.set('category', opts.category);
      if (opts.q) params.set('q', opts.q);
      if (opts.minPrice) params.set('minPrice', opts.minPrice);
      if (opts.maxPrice) params.set('maxPrice', opts.maxPrice);
      if (opts.sort) params.set('sort', opts.sort);
      const url = '/api/products' + (params.toString() ? `?${params.toString()}` : '');
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      allProducts = data;
      renderProducts();
    } catch (err) {
      console.error(err);
      productsEl.innerHTML = '<p style="color:rgba(255,255,255,0.6);">Unable to load products.</p>';
    }
  };

  // Render product cards based on current filters
  const renderProducts = () => {
    const q = searchInput.value.trim().toLowerCase();
    const filtered = allProducts.filter(p => {
      if (!q) return true;
      return (p.name + ' ' + (p.description || '') + ' ' + p.category).toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      productsEl.innerHTML = '<p style="color:rgba(255,255,255,0.6);">No products found.</p>';
      return;
    }

    productsEl.innerHTML = filtered.map(p => cardHTML(p)).join('');
  };

  const cardHTML = (p) => {
    const price = (p.price || 0).toLocaleString('en-IN');
    return `
      <div class="card" data-id="${p._id}">
        <img src="${encodeURI(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" />
        <div class="card-body">
          <h3 class="product-name">${escapeHtml(p.name)}</h3>
          <p class="product-price">₹ ${price}</p>
          <div class="card-actions">
            <button class="add-btn" data-id="${p._id}">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
  };

  // Escape HTML helper
  const escapeHtml = (str) => String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));

  // Category button clicks
  categoriesEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-cat]');
    if (!btn) return;
    const cat = btn.dataset.cat;
    // update active class
    categoriesEl.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = cat;
    // fetch filtered list from server for category
    fetchProducts({ category: activeCategory, q: searchInput.value.trim() });
  });

  // Search with debounce (server-side search)
  let searchTimer = null;

  // handle cart button delegation
  productsEl.addEventListener('click', async (e) => {
    const btn = e.target.closest('button.add-btn');
    if (!btn) return;
    const id = btn.dataset.id;
    if (!isLoggedIn()) {
      window.location.href = '/login.html';
      return;
    }
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + getToken()
        },
        body: JSON.stringify({ productId: id, quantity: 1 })
      });
      if (!res.ok) throw new Error('Failed to add');
      await res.json();
      fetchCartCount();
      alert('Added to cart');
    } catch (err) {
      console.error(err);
      alert('Unable to add to cart');
    }
  });
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      fetchProducts({ category: activeCategory, q: searchInput.value.trim() });
    }, 180);
  });

  // Initialization
  updateNav();
  fetchCartCount();

  // Initial load of products
  fetchProducts({ category: activeCategory });

  // handle login/logout click
  navLogin.addEventListener('click', (e) => {
    e.preventDefault();
    if (isLoggedIn()) {
      localStorage.removeItem('sv_token');
      window.location.href = '/';
    } else {
      window.location.href = '/login.html';
    }
  });
});
