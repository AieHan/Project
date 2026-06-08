// Password strength checker core logic
class PasswordChecker {
    constructor(password) {
        this.password = password;
        this.strength = 0;
        this.issues = [];
        this.suggestions = [];
    }

    analyze() {
        this.checkLength();
        this.checkCharacterVariety();
        this.checkCommonPatterns();
        this.calculateStrength();
        return this.getResults();
    }

    checkLength() {
        const length = this.password.length;
        if (length === 0) {
            this.issues.push("Password is empty");
        } else if (length < 8) {
            this.issues.push("Too short - minimum 8 characters recommended");
            this.suggestions.push("Add more characters (aim for 12-16 characters)");
        } else if (length < 12) {
            this.suggestions.push("Good length, but longer is better (12+ characters)");
        } else if (length >= 16) {
            this.strength += 2;
        } else {
            this.strength += 1;
        }
    }

    checkCharacterVariety() {
        let hasUpper = /[A-Z]/.test(this.password);
        let hasLower = /[a-z]/.test(this.password);
        let hasNumber = /[0-9]/.test(this.password);
        let hasSymbol = /[^A-Za-z0-9]/.test(this.password);
        
        let varietyCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
        
        if (varietyCount < 3) {
            this.issues.push("Missing character variety");
            if (!hasUpper) this.suggestions.push("Add uppercase letters (A-Z)");
            if (!hasLower) this.suggestions.push("Add lowercase letters (a-z)");
            if (!hasNumber) this.suggestions.push("Add numbers (0-9)");
            if (!hasSymbol) this.suggestions.push("Add symbols (!@#$%^&*)");
        } else if (varietyCount === 4) {
            this.strength += 2;
        } else {
            this.strength += 1;
        }
    }

    checkCommonPatterns() {
        const commonPasswords = ["password", "123456", "qwerty", "admin", "welcome", "letmein"];
        const commonPatterns = ["123", "abc", "qwe", "asd", "zxc", "111", "000"];
        
        let lowerPass = this.password.toLowerCase();
        
        if (commonPasswords.includes(lowerPass)) {
            this.issues.push("Using a commonly hacked password!");
            this.suggestions.push("Avoid common passwords like 'password123'");
            this.strength = 0;
        }
        
        for (let pattern of commonPatterns) {
            if (lowerPass.includes(pattern)) {
                this.issues.push("Contains predictable pattern");
                this.suggestions.push(`Avoid simple sequences like "${pattern}"`);
                break;
            }
        }
        
        if (this.password === this.password.toLowerCase()) {
            this.issues.push("No uppercase letters");
        }
        
        if (this.password === this.password.toUpperCase()) {
            this.issues.push("All caps - mix it up!");
        }
    }

    calculateStrength() {
        // Normalize strength score (0-4)
        if (this.strength <= 0) this.strength = 0;
        else if (this.strength <= 2) this.strength = 1;
        else if (this.strength <= 3) this.strength = 2;
        else if (this.strength <= 4) this.strength = 3;
        else this.strength = 4;
        
        // Adjust based on issues
        if (this.issues.length >= 3 && this.strength > 1) this.strength--;
        if (this.issues.length === 0 && this.strength < 4) this.strength++;
    }

    getResults() {
        const strengthLabels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
        
        return {
            strength: this.strength,
            strengthLabel: strengthLabels[this.strength],
            issues: this.issues,
            suggestions: this.suggestions,
            stats: {
                length: this.password.length,
                uppercase: (this.password.match(/[A-Z]/g) || []).length,
                lowercase: (this.password.match(/[a-z]/g) || []).length,
                numbers: (this.password.match(/[0-9]/g) || []).length,
                symbols: (this.password.match(/[^A-Za-z0-9]/g) || []).length
            }
        };
    }
}

// UI Update Functions
function updateStrengthUI(results) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthLabel = document.getElementById('strengthLabel');
    
    strengthFill.className = `strength-fill strength-${results.strength}`;
    strengthLabel.textContent = results.strengthLabel;
    strengthLabel.style.color = 
        results.strength === 0 ? '#e74c3c' :
        results.strength === 1 ? '#e67e22' :
        results.strength === 2 ? '#f39c12' :
        results.strength === 3 ? '#3498db' : '#2ecc71';
}

function updateStatistics(stats) {
    document.getElementById('length').textContent = stats.length;
    document.getElementById('uppercase').textContent = stats.uppercase;
    document.getElementById('lowercase').textContent = stats.lowercase;
    document.getElementById('numbers').textContent = stats.numbers;
    document.getElementById('symbols').textContent = stats.symbols;
}

function updateIssuesList(issues) {
    const issuesList = document.getElementById('issuesList');
    if (issues.length === 0) {
        issuesList.innerHTML = '<li>✅ No critical issues found!</li>';
    } else {
        issuesList.innerHTML = issues.map(issue => `<li>${issue}</li>`).join('');
    }
}

function updateSuggestionsList(suggestions) {
    const suggestionsList = document.getElementById('suggestionsList');
    if (suggestions.length === 0) {
        suggestionsList.innerHTML = '<li>💪 Great password! Keep it safe.</li>';
    } else {
        suggestionsList.innerHTML = suggestions.map(suggestion => `<li>${suggestion}</li>`).join('');
    }
}

// Main check function
function checkPassword(password) {
    if (!password) {
        const emptyResults = {
            strength: 0,
            strengthLabel: "Enter a password",
            issues: ["No password entered"],
            suggestions: ["Type a password to check its strength"],
            stats: { length: 0, uppercase: 0, lowercase: 0, numbers: 0, symbols: 0 }
        };
        updateStrengthUI(emptyResults);
        updateStatistics(emptyResults.stats);
        updateIssuesList(emptyResults.issues);
        updateSuggestionsList(emptyResults.suggestions);
        return null;
    }
    
    const checker = new PasswordChecker(password);
    const results = checker.analyze();
    
    updateStrengthUI(results);
    updateStatistics(results.stats);
    updateIssuesList(results.issues);
    updateSuggestionsList(results.suggestions);
    
    return results;
}

// Event listener
document.getElementById('password')?.addEventListener('input', (e) => {
    const results = checkPassword(e.target.value);
    
    // Save to history if password is meaningful (length >= 4)
    if (e.target.value.length >= 4 && typeof saveToHistory === 'function') {
        saveToHistory(e.target.value, results);
    }
});