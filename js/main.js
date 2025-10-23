document.addEventListener('DOMContentLoaded', function () {
  const role = localStorage.getItem('role');
  const user = localStorage.getItem('user');

  if (!role || !user) {
    if (!window.location.pathname.includes('index.html')) {
      window.location.href = 'index.html';
    }
    return;
  }

  const roleEl = document.getElementById('userRole');
  if (roleEl) roleEl.textContent = `${role === 'admin' ? 'Администратор' : 'Менеджер'}: ${user}`;

  const adminLink = document.getElementById('adminLink');
  if (adminLink && role === 'admin') adminLink.style.display = 'block';

  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
});

function logout() {
  localStorage.removeItem('role');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

function copyToClipboard(text) {
  if (text && text !== '—') {
    navigator.clipboard.writeText(text);
  }
}