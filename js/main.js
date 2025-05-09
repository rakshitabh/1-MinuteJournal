// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const newEntryBtn = document.querySelector('.new-entry');
const viewEntriesBtn = document.querySelector('.view-entries');
const logoutBtn = document.querySelector('.logout-btn');
const journalEntry = document.getElementById('journalEntry');
const saveBtn = document.querySelector('.save-btn');
const voiceBtn = document.querySelector('.voice-btn');
const photoBtn = document.querySelector('.photo-btn');
const emojiOptions = document.querySelectorAll('.emoji-option');
const currentMood = document.querySelector('.current-mood');
const entryDate = document.querySelector('.entry-date');
const entryPreview = document.querySelector('.entry-preview');
const entriesList = document.querySelector('.entries-list');
const notification = document.querySelector('.notification');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  setupEventListeners();
  updateDateTime();
  
  // Check if user is logged in
  if (!localStorage.getItem('username')) {
    window.location.href = 'login.html';
  }
  
  // Load entries
  loadEntries();
  
  // Animate title
  animateTitle();
});

function initApp() {
  // Set theme from localStorage
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
  
  // Set current date
  updateDateTime();
}

function setupEventListeners() {
  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);
  
  // New entry button
  newEntryBtn.addEventListener('click', () => {
    journalEntry.value = '';
    currentMood.textContent = '';
    document.querySelector('.emoji-option.selected')?.classList.remove('selected');
    showNotification('New entry created');
  });
  
  // View entries button
  viewEntriesBtn.addEventListener('click', toggleEntriesPreview);
  
  // Logout button
  logoutBtn.addEventListener('click', logout);
  
  // Save entry
  saveBtn.addEventListener('click', saveJournal);
  
  // Voice button
  voiceBtn.addEventListener('click', startVoiceRecording);
  
  // Photo button
  photoBtn.addEventListener('click', addPhoto);
  
  // Mood selection
  emojiOptions.forEach(emoji => {
    emoji.addEventListener('click', () => {
      emojiOptions.forEach(e => e.classList.remove('selected'));
      emoji.classList.add('selected');
      currentMood.textContent = emoji.textContent;
      showNotification(`Mood set to ${emoji.dataset.mood}`);
    });
  });
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  
  if (document.body.classList.contains('dark')) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    showNotification('Dark mode enabled');
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    showNotification('Light mode enabled');
  }
}

function updateDateTime() {
  const now = new Date();
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  entryDate.textContent = now.toLocaleDateString('en-US', options);
}

function saveJournal() {
  const entryText = journalEntry.value.trim();
  const mood = document.querySelector('.emoji-option.selected')?.dataset.mood || 'neutral';
  const moodEmoji = document.querySelector('.emoji-option.selected')?.textContent || '';
  
  if (!entryText) {
    showNotification('Please write something before saving', 'error');
    return;
  }
  
  const username = localStorage.getItem('username');
  const entry = {
    date: new Date().toISOString(),
    text: entryText,
    mood: mood,
    moodEmoji: moodEmoji
  };
  
  let journals = JSON.parse(localStorage.getItem('journals') || '{}');
  journals[username] = journals[username] || [];
  journals[username].push(entry);
  localStorage.setItem('journals', JSON.stringify(journals));
  
  showNotification('Entry saved successfully');
  loadEntries();
  
  // Add animation to save button
  saveBtn.classList.add('saved');
  setTimeout(() => {
    saveBtn.classList.remove('saved');
  }, 1000);
}

function loadEntries() {
  const username = localStorage.getItem('username');
  const journals = JSON.parse(localStorage.getItem('journals') || '{}');
  const userEntries = journals[username] || [];
  
  entriesList.innerHTML = '';
  
  if (userEntries.length === 0) {
    entriesList.innerHTML = '<p class="no-entries">No entries yet. Start writing!</p>';
    return;
  }
  
  // Show last 5 entries
  const recentEntries = userEntries.slice(-5).reverse();
  
  recentEntries.forEach(entry => {
    const entryItem = document.createElement('div');
    entryItem.className = 'entry-item';
    
    const date = new Date(entry.date);
    const dateStr = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    entryItem.innerHTML = `
      <div class="entry-header">
        <span class="entry-date">${dateStr}</span>
        <span class="entry-mood">${entry.moodEmoji}</span>
      </div>
      <p class="entry-text">${entry.text}</p>
    `;
    
    entryItem.addEventListener('click', () => {
      journalEntry.value = entry.text;
      currentMood.textContent = entry.moodEmoji;
      
      // Select the corresponding mood emoji
      emojiOptions.forEach(emoji => {
        if (emoji.dataset.mood === entry.mood) {
          emoji.classList.add('selected');
        } else {
          emoji.classList.remove('selected');
        }
      });
      
      toggleEntriesPreview();
      showNotification('Entry loaded');
    });
    
    entriesList.appendChild(entryItem);
  });
}

function toggleEntriesPreview() {
  entryPreview.classList.toggle('hidden');
  
  if (!entryPreview.classList.contains('hidden')) {
    loadEntries();
    gsap.from(entryPreview, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out"
    });
  }
}

function startVoiceRecording() {
  showNotification('Voice recording feature coming soon!', 'info');
  
  // This would be implemented with the Web Speech API
  // For now, it's just a placeholder
}

function addPhoto() {
  showNotification('Photo upload feature coming soon!', 'info');
  
  // This would create an input element for file upload
  // For now, it's just a placeholder
}

function logout() {
  localStorage.removeItem('username');
  window.location.href = 'login.html';
}

function showNotification(message, type = 'success') {
  notification.textContent = message;
  notification.className = 'notification';
  
  // Set notification color based on type
  switch (type) {
    case 'error':
      notification.style.backgroundColor = 'var(--warning)';
      break;
    case 'info':
      notification.style.backgroundColor = 'var(--info)';
      break;
    default:
      notification.style.backgroundColor = 'var(--success)';
  }
  
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

function animateTitle() {
  gsap.to(".title-word", {
    y: 0,
    opacity: 1,
    stagger: 0.3,
    duration: 1,
    ease: "back.out(1.7)"
  });
}