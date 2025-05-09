// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Initialize auth forms
if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}

if (signupForm) {
  signupForm.addEventListener('submit', handleSignup);
}

// Floating labels
document.querySelectorAll('.input-group.floating input').forEach(input => {
  input.addEventListener('focus', () => {
    input.nextElementSibling.style.color = '#4361ee';
  });
  
  input.addEventListener('blur', () => {
    input.nextElementSibling.style.color = '';
  });
});

function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  
  if (!username || !password) {
    showAuthNotification('Please fill in all fields', 'error');
    return;
  }
  
  // In a real app, you would validate against a database
  // For this demo, we'll just store the username
  localStorage.setItem('username', username);
  
  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  submitBtn.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}

function handleSignup(e) {
  e.preventDefault();
  
  const username = document.getElementById('signupUsername').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  const confirmPassword = document.getElementById('signupConfirmPassword').value.trim();
  
  if (!username || !password || !confirmPassword) {
    showAuthNotification('Please fill in all fields', 'error');
    return;
  }
  
  if (password !== confirmPassword) {
    showAuthNotification('Passwords do not match', 'error');
    return;
  }
  
  // In a real app, you would create a new user in database
  // For this demo, we'll just store the username
  localStorage.setItem('username', username);
  
  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  submitBtn.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    showAuthNotification('Account created successfully! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }, 1500);
}

function showAuthNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `auth-notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Animation
  gsap.from(notification, {
    y: 20,
    opacity: 0,
    duration: 0.3
  });
  
  setTimeout(() => {
    gsap.to(notification, {
      y: -20,
      opacity: 0,
      duration: 0.3,
      onComplete: () => notification.remove()
    });
  }, 3000);
}

// Initialize theme if set
document.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    document.body.classList.add('dark');
  }
});