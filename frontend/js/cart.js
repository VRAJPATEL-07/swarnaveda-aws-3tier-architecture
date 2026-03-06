document.addEventListener('DOMContentLoaded', () => {
  const cartEl = document.getElementById('cartItems');
  const msg = document.getElementById('msg');
  const checkoutBtn = document.getElementById('checkoutBtn');

  const getToken = () => localStorage.getItem('sv_token');
  const requireLogin = () => {
    if (!getToken()) {
      window.location.href = '/login.html';
      return false;
    }
    return true;
  };

  const fetchCart = async () => {
    if (!requireLogin()) return;
    try {
      const res = await fetch('/api/cart', { headers: { Authorization: 'Bearer ' + getToken() } });
      if (!res.ok) throw new Error();
      const items = await res.json();
      render(items);
    } catch (err) {
      cartEl.innerHTML = '<p style="color:rgba(255,255,255,0.6);">Unable to load cart.</p>';
    }
  };

  const render = (items) => {
    if (!items || items.length === 0) {
      cartEl.innerHTML = '<p style="color:rgba(255,255,255,0.6);text-align:center;padding:40px;">Your cart is empty.</p>';
      document.getElementById('subtotal').textContent = '0';
      return;
    }
    let subtotal = 0;
    cartEl.innerHTML = items.map(i => {
      const p = i.product;
      const price = p.price || 0;
      const itemTotal = price * i.quantity;
      subtotal += itemTotal;
      const priceStr = price.toLocaleString('en-IN');
      const totalStr = itemTotal.toLocaleString('en-IN');
      return `
        <div class="cart-item" data-item="${i._id}" style="display:grid;grid-template-columns:100px 1fr auto;gap:20px;align-items:start;padding:16px;border-bottom:1px solid rgba(255,215,0,0.1);margin-bottom:16px;">
          <img src="${encodeURI(p.image)}" alt="${p.name}" width="100" height="100" style="object-fit:cover;border-radius:8px;" />
          <div>
            <h4 style="margin:0 0 8px;color:var(--gold-start);font-size:16px;">${p.name}</h4>
            <p style="margin:0;color:rgba(255,255,255,0.7);">Price: <strong style="color:var(--white);">₹ ${priceStr}</strong></p>
            <div style="display:flex;align-items:center;gap:12px;margin-top:12px;">
              <label style="display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.8);\">Qty:
                <input type="number" class="qty" value="${i.quantity}" min="1" max="100" style="width:50px;padding:6px;border-radius:6px;border:0;background:rgba(255,255,255,0.1);color:var(--white);font-weight:600;\" />
              </label>
            </div>
          </div>
          <div style="text-align:right;display:flex;flex-direction:column;gap:12px;min-width:150px;\">
            <div>
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.6);\">Total</p>
              <h3 style="margin:4px 0;color:var(--gold-start);font-size:18px;\">₹ ${totalStr}</h3>
            </div>
            <button class="remove-btn" style="background:rgba(255,100,100,0.9);border:0;color:white;padding:8px 16px;border-radius:6px;cursor:pointer;font-weight:600;font-size:13px;transition:all .2s;\">Remove</button>
          </div>
        </div>
      `;
    }).join('');
    document.getElementById('subtotal').textContent = subtotal.toLocaleString('en-IN');
  };

  cartEl.addEventListener('click', async (e) => {
    const btn = e.target.closest('button.remove-btn');
    if (!btn) return;
    const item = btn.closest('.cart-item');
    const itemId = item.dataset.item;
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + getToken() } });
      if (!res.ok) throw new Error();
      const items = await res.json();
      render(items);
      msg.textContent = 'Item removed from cart';
      setTimeout(() => { msg.textContent = ''; }, 2000);
    } catch {
      msg.textContent = 'Could not remove item';
    }
  });

  cartEl.addEventListener('change', async (e) => {
    if (e.target.classList.contains('qty')) {
      const item = e.target.closest('.cart-item');
      const itemId = item.dataset.item;
      const qty = e.target.value;
      try {
        const res = await fetch(`/api/cart/${itemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
          body: JSON.stringify({ quantity: qty })
        });
        if (!res.ok) throw new Error();
        const items = await res.json();
        render(items);
      } catch {
        msg.textContent = 'Could not update quantity';
      }
    }
  });

  checkoutBtn.addEventListener('click', async () => {
    if (!requireLogin()) return;
    try {
      const res = await fetch('/api/cart/checkout', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + getToken() }
      });
      if (!res.ok) throw new Error();
      msg.textContent = 'Thank you for your purchase!';
      cartEl.innerHTML = '<p style="color:rgba(255,255,255,0.6);">Your cart is empty.</p>';
      cartCountEl = document.getElementById('cart-count');
      if (cartCountEl) cartCountEl.textContent = '0';
    } catch {
      msg.textContent = 'Checkout failed';
    }
  });

  fetchCart();
});