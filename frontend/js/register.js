document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('sv_token')) {
    window.location.href = '/';
    return;
  }
  const form = document.getElementById('registerForm');
  const msg = document.getElementById('msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    msg.textContent = '';
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      localStorage.setItem('sv_token', data.token);
      window.location.href = '/';
    } catch (err) {
      msg.textContent = err.message;
    }
  });
});