document.addEventListener('DOMContentLoaded', () => {
  const getToken = () => localStorage.getItem('sv_token');
  const isLoggedIn = () => !!getToken();

  if (!isLoggedIn()) {
    window.location.href = '/login.html';
    return;
  }

  const fetchUserData = async () => {
    try {
      // Decode JWT to get user data (this is a simple approach)
      const token = getToken();
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid token');
      
      const decoded = JSON.parse(atob(parts[1]));
      const userId = decoded.id;

      // Fetch user details from a new endpoint
      const res = await fetch(`/api/auth/me`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      
      if (!res.ok) throw new Error('Failed to fetch profile');
      const user = await res.json();

      // Display user info
      document.getElementById('user-name').textContent = user.name || 'User';
      document.getElementById('user-email').textContent = user.email;
      document.getElementById('user-phone').textContent = user.phone || '–';
      document.getElementById('acc-email').textContent = user.email;
      document.getElementById('acc-phone').textContent = user.phone || '–';
      document.getElementById('acc-role').textContent = user.isAdmin ? 'Admin' : 'Customer';

      // Show admin link if admin
      if (user.isAdmin) {
        const navRight = document.querySelector('.nav-right');
        const adminLink = document.createElement('a');
        adminLink.href = '/admin-dashboard.html';
        adminLink.className = 'btn login';
        adminLink.textContent = 'Admin Panel';
        adminLink.style.fontSize = '13px';
        navRight.insertBefore(adminLink, navRight.lastChild);
      }
    } catch (err) {
      console.error(err);
      document.getElementById('msg').textContent = 'Error loading profile';
    }
  };

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('sv_token');
    window.location.href = '/';
  });

  document.getElementById('order-btn').addEventListener('click', () => {
    alert('Order history feature coming soon!');
  });

  fetchUserData();
});