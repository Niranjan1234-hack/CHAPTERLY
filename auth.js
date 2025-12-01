// DOM Elements
const signInBtn = document.getElementById('sign-in-btn');
const signUpBtn = document.getElementById('sign-up-btn');
const container = document.querySelector('.container');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const toast = document.getElementById('authToast');

// Toggle between sign in and sign up forms
signUpBtn.addEventListener('click', () => {
    container.classList.add('sign-up-mode');
});

signInBtn.addEventListener('click', () => {
    container.classList.remove('sign-up-mode');
});

// Show toast notification
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = 'toast show';
    
    if (type === 'error') {
        toast.classList.add('error');
    } else if (type === 'success') {
        toast.classList.add('success');
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
        // Remove the class after animation completes
        setTimeout(() => toast.className = 'toast', 300);
    }, 3000);
}

// Check if user is already logged in
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.isLoggedIn) {
        window.location.href = 'tracker.html';
    }
}

// Handle user registration
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.email === email);
    
    if (userExists) {
        showToast('Email already registered', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In a real app, hash the password before saving
        createdAt: new Date().toISOString()
    };
    
    // Save user to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration
    loginUser(email, password);
});

// Handle user login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showToast('Please enter both email and password', 'error');
        return;
    }
    
    loginUser(email, password);
});

// Login helper function
function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Set current user session
        const currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            isLoggedIn: true
        };
        
        // Save the user with isLoggedIn flag
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update the user in the users array with isLoggedIn status
        const updatedUsers = users.map(u => 
            u.id === user.id ? { ...u, isLoggedIn: true } : u
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        showToast('Login successful!', 'success');
        
        // Redirect to tracker page after a short delay
        setTimeout(() => {
            window.location.href = 'tracker.html';
        }, 1000);
    } else {
        showToast('Invalid email or password', 'error');
    }
}

// Handle social login (placeholder)
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Social login coming soon!', 'info');
    });
});

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', checkAuth);
