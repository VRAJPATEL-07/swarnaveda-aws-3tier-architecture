document.addEventListener('DOMContentLoaded', () => {
  const getToken = () => localStorage.getItem('sv_token');
  const isLoggedIn = () => !!getToken();
  const productsList = document.getElementById('products-list');
  const productsMsg = document.getElementById('products-msg');
  const addMsg = document.getElementById('add-msg');
  const addForm = document.getElementById('add-product-form');
  const searchInput = document.getElementById('search-products');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  let allProducts = [];

  // Check admin access
  if (!isLoggedIn()) {
    window.location.href = '/login.html';
    return;
  }

  // Verify user is admin
  const verifyAdmin = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: 'Bearer ' + getToken() }
      });
      if (!res.ok) throw new Error('Not authenticated');
      const user = await res.json();
      if (!user.isAdmin) {
        window.location.href = '/';
        return;
      }
      document.getElementById('user-info').textContent = `Admin: ${user.name}`;
    } catch {
      window.location.href = '/login.html';
    }
  };

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      tabContents.forEach(el => el.style.display = 'none');
      document.getElementById(tab + '-tab').style.display = 'block';
    });
  });

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch');
      allProducts = await res.json();
      renderProducts(allProducts);
    } catch (err) {
      productsMsg.textContent = 'Error loading products: ' + err.message;
      productsMsg.style.color = 'rgba(255,100,100,1)';
    }
  };

  // Render products table
  const renderProducts = (products) => {
    if (!products || products.length === 0) {
      productsList.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:rgba(255,255,255,0.6);">No products found</td></tr>';
      return;
    }
    productsList.innerHTML = products.map(p => `
      <tr>
        <td><img src="${encodeURI(p.image)}" alt="${p.name}" style="width:50px;height:50px;object-fit:cover;border-radius:4px;" /></td>
        <td><strong>${p.name}</strong></td>
        <td><span style="background:rgba(255,215,0,0.15);padding:4px 8px;border-radius:4px;font-size:12px;">${p.category}</span></td>
        <td><strong style="color:var(--gold-start);">₹${(p.price || 0).toLocaleString('en-IN')}</strong></td>
        <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.description || '–'}</td>
        <td>
          <button class="action-btn edit-btn" data-id="${p._id}">Edit</button>
          <button class="action-btn delete-btn delete-btn-click" data-id="${p._id}">Delete</button>
        </td>
      </tr>
    `).join('');

    // Delete buttons
    document.querySelectorAll('.delete-btn-click').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (!confirm('Delete this product?')) return;
        const productId = btn.dataset.id;
        try {
          const res = await fetch(`/api/admin/product/${productId}`, {
            method: 'DELETE',
            headers: { Authorization: 'Bearer ' + getToken() }
          });
          if (!res.ok) throw new Error('Failed to delete');
          fetchProducts();
          productsMsg.textContent = 'Product deleted successfully';
          productsMsg.style.color = 'rgba(100,200,100,1)';
          setTimeout(() => { productsMsg.textContent = ''; }, 3000);
        } catch (err) {
          productsMsg.textContent = 'Error: ' + err.message;
          productsMsg.style.color = 'rgba(255,100,100,1)';
        }
      });
    });
  };

  // Search products
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = allProducts.filter(p =>
      (p.name + ' ' + p.category + ' ' + (p.description || '')).toLowerCase().includes(q)
    );
    renderProducts(filtered);
  });

  // Add product form
  addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('product-name').value.trim();
    const price = document.getElementById('product-price').value;
    const category = document.getElementById('product-category').value;
    const description = document.getElementById('product-description').value.trim();
    const imageInput = document.getElementById('product-image');

    if (!name || !price || !category) {
      addMsg.textContent = 'All required fields must be filled';
      addMsg.style.color = 'rgba(255,100,100,1)';
      return;
    }

    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('price', price);
      fd.append('category', category);
      fd.append('description', description);
      if (imageInput.files[0]) fd.append('image', imageInput.files[0]);

      const res = await fetch('/api/admin/product', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + getToken() },
        body: fd
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to add product');
      }

      const product = await res.json();
      addMsg.textContent = 'Product added successfully: ' + product.name;
      addMsg.style.color = 'rgba(100,200,100,1)';
      addForm.reset();
      fetchProducts();
      setTimeout(() => { addMsg.textContent = ''; }, 3000);
    } catch (err) {
      addMsg.textContent = 'Error: ' + err.message;
      addMsg.style.color = 'rgba(255,100,100,1)';
    }
  });

  verifyAdmin();
  fetchProducts();
});