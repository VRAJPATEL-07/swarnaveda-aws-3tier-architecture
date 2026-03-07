document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('sv_token')) {
    // already logged in
    window.location.href = '/';
    return;
  }
  const form = document.getElementById('loginForm');
  const msg = document.getElementById('msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    msg.textContent = '';
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('sv_token', data.token);
      localStorage.setItem('sv_user', JSON.stringify(data.user));
      window.location.href = data.user.isAdmin ? '/admin-dashboard.html' : '/';
    } catch (err) {
      msg.textContent = err.message;
    }
  });
});