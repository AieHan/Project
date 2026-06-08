// Strong password generator
class PasswordGenerator {
    static generate(length, options) {
        const charSets = {
            upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
            lower: 'abcdefghijkmnpqrstuvwxyz',
            numbers: '23456789',
            symbols: '!@#$%^&*'
        };
        
        let availableChars = '';
        if (options.includeUpper) availableChars += charSets.upper;
        if (options.includeLower) availableChars += charSets.lower;
        if (options.includeNumbers) availableChars += charSets.numbers;
        if (options.includeSymbols) availableChars += charSets.symbols;
        
        if (availableChars === '') return 'Select at least one character type';
        
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * availableChars.length);
            password += availableChars[randomIndex];
        }
        
        // Ensure at least one from each selected type
        let needsShuffle = false;
        if (options.includeUpper && !/[A-Z]/.test(password)) needsShuffle = true;
        if (options.includeLower && !/[a-z]/.test(password)) needsShuffle = true;
        if (options.includeNumbers && !/[0-9]/.test(password)) needsShuffle = true;
        if (options.includeSymbols && !/[^A-Za-z0-9]/.test(password)) needsShuffle = true;
        
        if (needsShuffle) {
            return this.generate(length, options);
        }
        
        return password;
    }
}

// UI for generator
document.getElementById('generateBtn')?.addEventListener('click', () => {
    const options = {
        includeUpper: document.getElementById('includeUpper').checked,
        includeLower: document.getElementById('includeLower').checked,
        includeNumbers: document.getElementById('includeNumbers').checked,
        includeSymbols: document.getElementById('includeSymbols').checked
    };
    
    const length = parseInt(document.getElementById('passwordLength').value);
    
    if (length < 8) {
        alert('Password length should be at least 8 characters');
        return;
    }
    
    const password = PasswordGenerator.generate(length, options);
    document.getElementById('generatedPassword').value = password;
});

document.getElementById('copyBtn')?.addEventListener('click', () => {
    const passwordField = document.getElementById('generatedPassword');
    passwordField.select();
    document.execCommand('copy');
    
    // Show feedback
    const copyBtn = document.getElementById('copyBtn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✅ Copied!';
    setTimeout(() => {
        copyBtn.textContent = originalText;
    }, 2000);
});