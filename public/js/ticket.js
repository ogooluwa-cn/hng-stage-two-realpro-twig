document.addEventListener('DOMContentLoaded', function() {
    initializeTicketsPage();
    
    // Set up event listeners for filters
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    
    if (priorityFilter) {
        priorityFilter.addEventListener('change', applyFilters);
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
    
    // Check if filters are active on page load
    updateClearFiltersButton();
});

function initializeTicketsPage() {
    // Add any initialization logic here
    console.log('Tickets page initialized');
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    
    // Build query string
    const params = new URLSearchParams();
    
    if (searchTerm) params.append('search', searchTerm);
    if (statusFilter) params.append('status', statusFilter);
    if (priorityFilter) params.append('priority', priorityFilter);
    
    // Reload page with filters
    window.location.href = `/tickets?${params.toString()}`;
}

function clearFilters() {
    // Clear all filters and reload
    window.location.href = '/tickets';
}

function updateClearFiltersButton() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    const hasActiveFilters = 
        (searchInput && searchInput.value) || 
        (statusFilter && statusFilter.value) || 
        (priorityFilter && priorityFilter.value);
    
    if (clearFiltersBtn) {
        clearFiltersBtn.style.display = hasActiveFilters ? 'inline-block' : 'none';
    }
}

function deleteTicket(ticketId) {
    if (confirm('Are you sure you want to delete this ticket?')) {
        // In a real app, this would be an API call
        // For now, we'll simulate deletion by reloading
        alert(`Ticket ${ticketId} would be deleted (simulated)`);
        
        // You could implement client-side deletion here if using localStorage
        // deleteTicketFromStorage(ticketId);
    }
}

function editTicket(ticketId) {
    alert(`Edit ticket ${ticketId} - Feature coming soon!`);
    // In real implementation: window.location.href = `/edit-ticket/${ticketId}`;
}

function viewTicket(ticketId) {
    // Find ticket data (in real app, this would come from server or API)
    const ticketElement = document.querySelector(`[data-ticket-id="${ticketId}"]`);
    if (ticketElement) {
        const title = ticketElement.querySelector('.ticket-title').textContent;
        const description = ticketElement.querySelector('.ticket-description').textContent;
        const status = ticketElement.querySelector('.status-badge').textContent.trim();
        const priority = ticketElement.querySelector('.priority-badge').textContent.replace('PRIORITY', '').trim();
        
        const ticketDetails = `
🎫 TICKET DETAILS

📋 Title: ${title}
📝 Description: ${description}
🔄 Status: ${status}
🚨 Priority: ${priority}
📅 Created: (see full details)
✏️ Last Updated: (see full details)
👤 Created By: Current User
🆔 Ticket ID: ${ticketId}
        `;
        alert(ticketDetails);
    }
}

// Utility function to debounce rapid events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// LocalStorage integration (if you want client-side persistence)
function deleteTicketFromStorage(ticketId) {
    try {
        const savedTickets = localStorage.getItem("tickets");
        if (savedTickets) {
            const tickets = JSON.parse(savedTickets);
            const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
            localStorage.setItem("tickets", JSON.stringify(updatedTickets));
            
            // Remove from DOM
            const ticketElement = document.querySelector(`[data-ticket-id="${ticketId}"]`);
            if (ticketElement) {
                ticketElement.remove();
            }
            
            // Update summary counts
            updateTicketSummary();
            
            alert('Ticket deleted successfully!');
        }
    } catch (error) {
        console.error("Error deleting ticket:", error);
        alert('Error deleting ticket');
    }
}

function updateTicketSummary() {
    // This would update the summary counts client-side
    // Implementation depends on your specific needs
}