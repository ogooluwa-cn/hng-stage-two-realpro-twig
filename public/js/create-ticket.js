document.addEventListener('DOMContentLoaded', function() {
    initializeCreateTicketForm();
});

function initializeCreateTicketForm() {
    const form = document.getElementById('createTicketForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!form) return;
    
    // Clear error on input
    const inputs = form.querySelectorAll('.form-input');
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
    form.addEventListener('submit', function(e) {
        let isValid = true;
        const formData = new FormData(form);
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
        
        // Title validation
        const title = formData.get('title');
        if (!title?.trim()) {
            showError('ticketTitle', 'Title is required');
            isValid = false;
        } else if (title.length < 5) {
            showError('ticketTitle', 'Title must be at least 5 characters');
            isValid = false;
        }
        
        // Description validation
        const description = formData.get('description');
        if (!description?.trim()) {
            showError('ticketDescription', 'Description is required');
            isValid = false;
        } else if (description.length < 10) {
            showError('ticketDescription', 'Description must be at least 10 characters');
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
    
    // Check for success parameter in URL
    checkForSuccessMessage();
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    field.parentElement.appendChild(errorDiv);
}

function checkForSuccessMessage() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('created') === 'true') {
        alert('SUCCESS: Ticket created successfully!');
        // Remove the parameter from URL without reloading
        window.history.replaceState({}, '', '/tickets');
    }
}

// Optional: Auto-save draft functionality
function autoSaveDraft() {
    const form = document.getElementById('createTicketForm');
    if (!form) return;
    
    const formData = {
        title: document.getElementById('ticketTitle').value,
        description: document.getElementById('ticketDescription').value,
        priority: document.getElementById('ticketPriority').value,
        category: document.getElementById('ticketCategory').value
    };
    
    localStorage.setItem('ticketDraft', JSON.stringify(formData));
}

function loadDraft() {
    try {
        const draft = localStorage.getItem('ticketDraft');
        if (draft) {
            const formData = JSON.parse(draft);
            document.getElementById('ticketTitle').value = formData.title || '';
            document.getElementById('ticketDescription').value = formData.description || '';
            document.getElementById('ticketPriority').value = formData.priority || 'medium';
            document.getElementById('ticketCategory').value = formData.category || 'technical';
        }
    } catch (error) {
        console.error('Error loading draft:', error);
    }
}

function clearDraft() {
    localStorage.removeItem('ticketDraft');
}

// Auto-save on input (debounced)
let autoSaveTimeout;
function setupAutoSave() {
    const inputs = document.querySelectorAll('#createTicketForm input, #createTicketForm textarea, #createTicketForm select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(autoSaveDraft, 1000);
        });
    });
}

// Load draft when page loads and set up auto-save
document.addEventListener('DOMContentLoaded', function() {
    loadDraft();
    setupAutoSave();
    
    // Clear draft when form is successfully submitted
    const form = document.getElementById('createTicketForm');
    if (form) {
        form.addEventListener('submit', function() {
            clearDraft();
        });
    }
    
    // Clear draft when leaving page (optional)
    window.addEventListener('beforeunload', function() {
        // You might want to conditionally clear the draft
        // clearDraft();
    });
});