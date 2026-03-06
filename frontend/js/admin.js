// Admin page script: signup, login, upload product
document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('uploadForm');
  const msg = document.getElementById('msg');
  const btnSignup = document.getElementById('btnSignup');
  const btnLogin = document.getElementById('btnLogin');

  let token = localStorage.getItem('sv_token') || null;

  const show = (t) => { msg.textContent = t; };

  btnSignup.addEventListener('click', async () => {
    const name = document.getElementById('name').value.trim();
    const email = prompt('Enter email for signup:');
    const password = prompt('Enter password:');
    if (!name || !email || !password) return show('Name, email, password required for signup');
    try {
      const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      token = data.token; localStorage.setItem('sv_token', token); show('Signup successful');
    } catch (err) { show(err.message); }
  });

  btnLogin.addEventListener('click', async () => {
    const email = prompt('Email:');
    const password = prompt('Password:');
    if (!email || !password) return show('Email and password required');
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      token = data.token; localStorage.setItem('sv_token', token); show('Login successful');
    } catch (err) { show(err.message); }
  });

  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const price = document.getElementById('price').value;
    const category = document.getElementById('category').value.trim();
    const description = document.getElementById('description').value.trim();
    const imageInput = document.getElementById('image');
    if (!token) return show('You must login/signup first');
    const fd = new FormData();
    fd.append('name', name);
    fd.append('price', price);
    fd.append('category', category);
    fd.append('description', description);
    if (imageInput.files[0]) fd.append('image', imageInput.files[0]);
    try {
      const res = await fetch('/api/admin/product', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token }, body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      show('Product uploaded: ' + data.name);
      // Clear form
      uploadForm.reset();
    } catch (err) { show(err.message); }
  });
});
