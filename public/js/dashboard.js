document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();
    
    // Set up auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
        refreshDashboardData();
    }, 30000);

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        clearInterval(refreshInterval);
    });
});

function initializeDashboard() {
    // Load any additional client-side data
    loadClientSideStats();
    
    // Add click handlers for action cards
    document.querySelectorAll('.action-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function loadClientSideStats() {
    // If you want to combine server-side data with client-side updates
    // you can fetch additional data here
    const tickets = getTicketsFromStorage();
    if (tickets.length > 0) {
        updateStatsFromLocalStorage(tickets);
    }
}

function getTicketsFromStorage() {
    try {
        const savedTickets = localStorage.getItem("tickets");
        return savedTickets ? JSON.parse(savedTickets) : [];
    } catch (error) {
        console.error("Error loading tickets from storage:", error);
        return [];
    }
}

function updateStatsFromLocalStorage(tickets) {
    const stats = calculateTicketStats(tickets);
    
    // Update the stats display if needed
    // This could be used for real-time updates without page refresh
    document.querySelectorAll('.stat-number span').forEach(span => {
        const statType = span.closest('.stat-card').querySelector('.stat-label').textContent;
        switch(statType) {
            case 'Total Tickets':
                span.textContent = stats.totalTickets;
                break;
            case 'Open Tickets':
                span.textContent = stats.openTickets;
                break;
            case 'In Progress':
                span.textContent = stats.inProgressTickets;
                break;
            case 'Resolved Tickets':
                span.textContent = stats.closedTickets;
                break;
        }
    });
}

function calculateTicketStats(tickets) {
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(ticket => ticket.status === 'open').length;
    const inProgressTickets = tickets.filter(ticket => ticket.status === 'in_progress').length;
    const closedTickets = tickets.filter(ticket => ticket.status === 'closed').length;
    const highPriorityTickets = tickets.filter(ticket => ticket.priority === 'high' || ticket.priority === 'urgent').length;

    return {
        totalTickets,
        openTickets,
        inProgressTickets,
        closedTickets,
        highPriorityTickets
    };
}

function refreshDashboardData() {
    // This would typically make an API call to get fresh data
    console.log("Refreshing dashboard data...");
    
    // For now, just update from localStorage
    const tickets = getTicketsFromStorage();
    if (tickets.length > 0) {
        updateStatsFromLocalStorage(tickets);
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear session data
        localStorage.removeItem("userSession");
        sessionStorage.clear();
        
        // Redirect to login page
        window.location.href = '/login';
    }
}

function showComingSoon(feature) {
    alert(`${feature} feature coming soon!`);
}

// Utility functions for ticket formatting (if you uncomment the recent tickets section)
function formatStatus(status) {
    return status.replace('_', ' ').toUpperCase();
}

function formatPriority(priority) {
    return priority.toUpperCase();
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'open': return 'status-open';
        case 'in_progress': return 'status-in-progress';
        case 'closed': return 'status-closed';
        default: return '';
    }
}

function getPriorityBadgeClass(priority) {
    switch (priority) {
        case 'high': return 'priority-high';
        case 'urgent': return 'priority-high';
        case 'medium': return 'priority-medium';
        case 'low': return 'priority-low';
        default: return '';
    }
}

// Listen for storage changes to update stats in real-time
window.addEventListener('storage', function(e) {
    if (e.key === 'tickets') {
        const tickets = getTicketsFromStorage();
        updateStatsFromLocalStorage(tickets);
    }
});