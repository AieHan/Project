// History management (saves only strength scores, not actual passwords)
let passwordHistory = [];

function loadHistory() {
    const saved = localStorage.getItem('passwordHistory');
    if (saved) {
        passwordHistory = JSON.parse(saved);
        displayHistory();
    }
}

function saveToHistory(password, results) {
    if (!results) return;
    
    // Don't save actual password, just masked version + strength
    const maskedPassword = '*'.repeat(Math.min(password.length, 8)) + (password.length > 8 ? '...' : '');
    
    const historyItem = {
        id: Date.now(),
        masked: maskedPassword,
        strength: results.strength,
        strengthLabel: results.strengthLabel,
        length: results.stats.length,
        timestamp: new Date().toLocaleString()
    };
    
    passwordHistory.unshift(historyItem);
    
    // Keep only last 10 items
    if (passwordHistory.length > 10) passwordHistory.pop();
    
    localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
    displayHistory();
}

function displayHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    if (passwordHistory.length === 0) {
        historyList.innerHTML = '<li style="text-align:center">No passwords checked yet</li>';
        return;
    }
    
    historyList.innerHTML = passwordHistory.map(item => `
        <li>
            <span>${item.masked}</span>
            <span style="color: ${getStrengthColor(item.strength)}">${item.strengthLabel}</span>
            <small>${item.timestamp}</small>
        </li>
    `).join('');
}

function getStrengthColor(strength) {
    const colors = ['#e74c3c', '#e67e22', '#f39c12', '#3498db', '#2ecc71'];
    return colors[strength];
}

document.getElementById('clearHistory')?.addEventListener('click', () => {
    if (confirm('Clear all password check history?')) {
        passwordHistory = [];
        localStorage.removeItem('passwordHistory');
        displayHistory();
    }
});

// Initialize history on page load
loadHistory();