// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');

function initDarkMode() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

darkModeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    
    // Update button text
    darkModeToggle.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
});

// Password visibility toggle
document.getElementById('toggleVisibility')?.addEventListener('click', () => {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    
    const toggleBtn = document.getElementById('toggleVisibility');
    toggleBtn.textContent = type === 'text' ? '🙈' : '👁️';
});

// Initialize
initDarkMode();

// Update dark mode button text on load
if (darkModeToggle && localStorage.getItem('theme') === 'dark') {
    darkModeToggle.textContent = '☀️ Light';
} else if (darkModeToggle) {
    darkModeToggle.textContent = '🌙 Dark';
}