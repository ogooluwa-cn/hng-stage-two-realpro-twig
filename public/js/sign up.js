document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const submitBtn = document.getElementById('submitBtn');
    
    // Clear error on input
    const inputs = signupForm.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorMessage = this.parentElement.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            }
        });
    });
    
    // Client-side validation
    signupForm.addEventListener('submit', function(e) {
        let isValid = true;
        const formData = new FormData(signupForm);
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
        
        // Name validation
        const name = formData.get('name');
        if (!name?.trim()) {
            showError('signupName', 'Name is required');
            isValid = false;
        }
        
        // Email validation
        const email = formData.get('email');
        if (!email) {
            showError('signupEmail', 'Email is required');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            showError('signupEmail', 'Email is invalid');
            isValid = false;
        }
        
        // Password validation
        const password = formData.get('password');
        if (!password) {
            showError('signupPassword', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showError('signupPassword', 'Password must be at least 6 characters');
            isValid = false;
        }
        
        // Confirm password validation
        const confirmPassword = formData.get('confirmPassword');
        if (!confirmPassword) {
            showError('confirmPassword', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }
        
        // Terms validation
        const terms = formData.get('terms');
        if (!terms) {
            alert('Please agree to the Terms of Service and Privacy Policy');
            isValid = false;
        }
        
        if (!isValid) {
            e.preventDefault();
        } else {
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }
    });
    
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        field.parentElement.appendChild(errorDiv);
    }
    
    // Social login buttons
    document.querySelector('.btn-google')?.addEventListener('click', function() {
        alert('Google signup would be implemented here');
    });
    
    document.querySelector('.btn-github')?.addEventListener('click', function() {
        alert('GitHub signup would be implemented here');
    });
});