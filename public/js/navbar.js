document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const themeToggle = document.getElementById('themeToggle');
  const themeLabel = document.getElementById('themeLabel');
  const logoutBtn = document.getElementById('logoutBtn');
  const logoutText = document.getElementById('logoutText');
  const logoutConfirm = document.getElementById('logoutConfirm');
  const cancelLogout = document.getElementById('cancelLogout');
  const confirmLogout = document.getElementById('confirmLogout');

  let darkMode = localStorage.getItem('theme') === 'dark';

  // Set initial theme
  if (darkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.checked = true;
    themeLabel.textContent = 'Dark';
  }

  // Toggle dark mode
  themeToggle.addEventListener('change', () => {
    darkMode = !darkMode;
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeLabel.textContent = 'Dark';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      themeLabel.textContent = 'Light';
    }
  });

  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('nav-links-active');
    mobileMenuBtn.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
  });

  // Close menu when overlay clicked
  mobileOverlay.addEventListener('click', () => {
    navLinks.classList.remove('nav-links-active');
    mobileMenuBtn.classList.remove('active');
    mobileOverlay.classList.remove('active');
  });

  // Logout confirmation
  logoutBtn.addEventListener('click', () => {
    logoutConfirm.style.display = 'flex';
  });

  cancelLogout.addEventListener('click', () => {
    logoutConfirm.style.display = 'none';
  });

  confirmLogout.addEventListener('click', () => {
    logoutText.textContent = 'Logging out...';
    setTimeout(() => {
      localStorage.removeItem('ticketapp_session');
      alert('Logged out successfully!');
      window.location.href = '/';
    }, 1000);
  });
});

// Navigate helper
function navigateTo(path) {
  window.location.href = path;
}
