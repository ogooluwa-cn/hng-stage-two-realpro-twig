document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');
    
    // Clear error on input
    const inputs = loginForm.querySelectorAll('.form-input');
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
    loginForm.addEventListener('submit', function(e) {
        let isValid = true;
        const formData = new FormData(loginForm);
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
        
        // Email validation
        const email = formData.get('email');
        if (!email) {
            showError('loginEmail', 'Email is required');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            showError('loginEmail', 'Email is invalid');
            isValid = false;
        }
        
        // Password validation
        const password = formData.get('password');
        if (!password) {
            showError('loginPassword', 'Password is required');
            isValid = false;
        }
        
        if (!isValid) {
            e.preventDefault();
        } else {
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Form will submit normally to server
            // Loading state will be maintained until page redirects
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
});

// Social login functions
function socialLogin(provider) {
    alert(`${provider} login would be implemented here`);
    // In real implementation, redirect to OAuth endpoint
    // window.location.href = `/auth/${provider}`;
}

function showForgotPassword() {
    alert('Password reset feature coming soon!');
    // In real implementation, show forgot password modal
    // or redirect to password reset page
}

// Check if user is already logged in (optional)
function checkAuthentication() {
    // This would check for existing session cookie or token
    // For now, it's handled server-side
}