import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Set up Twig
app.set("view engine", "twig");
app.set("views", path.join(__dirname, "templates"));

// Routes
app.get("/", (req, res) => {
  res.render("pages/landing", {
    // You can pass any data needed for the landing page here
    // For example: featuredStats, testimonials, etc.
  });
});
app.get("/login", (req, res) => {
  res.render("pages/login", {
    errors: { 
      email: null, 
      password: null 
    },
    old: { 
      email: "" 
    },
    isLoading: false,
  });
});

app.post("/login", (req, res) => {
  const { email, password, remember } = req.body;

  let emailError = "";
  let passwordError = "";

  // Validation
  if (!email) {
    emailError = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    emailError = "Email is invalid";
  }

  if (!password) {
    passwordError = "Password is required";
  }

  if (emailError || passwordError) {
    return res.render("pages/login", {
      errors: { 
        email: emailError, 
        password: passwordError 
      },
      old: { email },
      isLoading: false,
    });
  }

  // In a real app, you would validate against a database
  // For demo purposes, we'll use a simple check
  const validEmail = "user@example.com";
  const validPassword = "password123";

  if (email === validEmail && password === validPassword) {
    // Set session or JWT token here
    // For now, just redirect to dashboard
    return res.redirect("/dashboard");
  } else {
    // Check if email exists but password is wrong
    if (email === validEmail) {
      passwordError = "Invalid password";
    } else {
      emailError = "Email not found. Please sign up first.";
    }
    
    return res.render("pages/login", {
      errors: { 
        email: emailError, 
        password: passwordError 
      },
      old: { email },
      isLoading: false,
    });
  }
});
app.get("/signup", (req, res) => {
  res.render("pages/signup", {
    errors: { 
      name: null, 
      email: null, 
      password: null, 
      confirmPassword: null 
    },
    old: { 
      name: "", 
      email: "" 
    },
    isLoading: false,
  });
});

app.post("/signup", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  let nameError = "";
  let emailError = "";
  let passwordError = "";
  let confirmPasswordError = "";

  // Validation
  if (!name?.trim()) nameError = "Name is required";
  if (!email) emailError = "Email is required";
  if (!password) passwordError = "Password is required";
  if (!confirmPassword) confirmPasswordError = "Confirm password is required";
  
  if (email && !/\S+@\S+\.\S+/.test(email)) {
    emailError = "Email is invalid";
  }
  
  if (password && password.length < 6) {
    passwordError = "Password must be at least 6 characters";
  }
  
  if (password && confirmPassword && password !== confirmPassword) {
    confirmPasswordError = "Passwords do not match";
  }

  if (nameError || emailError || passwordError || confirmPasswordError) {
    return res.render("pages/signup", {
      errors: { 
        name: nameError, 
        email: emailError, 
        password: passwordError, 
        confirmPassword: confirmPasswordError 
      },
      old: { name, email },
      isLoading: false,
    });
  }

  // If valid - redirect to dashboard
  res.redirect("/dashboard");
});

// Dashboard route
// Dashboard route
app.get("/dashboard", (req, res) => {
  // In a real app, you would get this data from your database
  // For now, using mock data
  const mockStats = {
    totalTickets: 24,
    openTickets: 8,
    inProgressTickets: 6,
    closedTickets: 10,
    highPriorityTickets: 3
  };

  const mockUser = {
    name: "John Doe",
    email: "john@example.com"
  };

  res.render("pages/dashboard", {
    stats: mockStats,
    user: mockUser,
    isLoading: false,
    // recentTickets: [] // Uncomment if you implement recent tickets
  });
});

// Tickets route
app.get("/tickets", (req, res) => {
  // Get query parameters for filters
  const { search, status, priority } = req.query;
  
  // Mock tickets data - in real app, this would come from a database
  const mockTickets = [
    {
      id: "1",
      title: "Login issue",
      description: "Unable to login to the dashboard",
      status: "open",
      priority: "high",
      category: "Authentication",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
      createdBy: "user@example.com"
    },
    {
      id: "2",
      title: "Feature request",
      description: "Add dark mode support",
      status: "in_progress",
      priority: "medium",
      category: "Enhancement",
      createdAt: "2024-01-14",
      updatedAt: "2024-01-15",
      createdBy: "user@example.com"
    },
    {
      id: "3",
      title: "Bug fix",
      description: "Fix navigation menu on mobile",
      status: "closed",
      priority: "low",
      category: "Bug",
      createdAt: "2024-01-10",
      updatedAt: "2024-01-12",
      createdBy: "user@example.com"
    }
  ];

  // Filter tickets based on query parameters
  let filteredTickets = mockTickets;
  
  if (search) {
    filteredTickets = filteredTickets.filter(ticket =>
      ticket.title.toLowerCase().includes(search.toLowerCase()) ||
      ticket.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (status) {
    filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
  }
  
  if (priority) {
    filteredTickets = filteredTickets.filter(ticket => ticket.priority === priority);
  }

  res.render("pages/tickets", {
    tickets: filteredTickets,
    isLoading: false,
    searchTerm: search || "",
    statusFilter: status || "",
    priorityFilter: priority || "",
    // Provide simple summary counts so templates don't need complex filters
    totalTickets: filteredTickets.length,
    openTickets: filteredTickets.filter(t => t.status === 'open').length,
    inProgressTickets: filteredTickets.filter(t => t.status === 'in_progress').length,
    closedTickets: filteredTickets.filter(t => t.status === 'closed').length
  });
});

// Helper functions for template
app.locals.getStatusBadgeClass = (status) => {
  switch (status) {
    case 'open': return 'status-open';
    case 'in_progress': return 'status-in-progress';
    case 'closed': return 'status-closed';
    default: return '';
  }
};

app.locals.getPriorityBadgeClass = (priority) => {
  switch (priority) {
    case 'high': return 'priority-high';
    case 'urgent': return 'priority-urgent';
    case 'medium': return 'priority-medium';
    case 'low': return 'priority-low';
    default: return '';
  }
};

app.locals.formatStatus = (status) => {
  return status.replace('_', ' ').toUpperCase();
};

app.locals.formatPriority = (priority) => {
  return priority.toUpperCase();
};

app.get("/create-ticket", (req, res) => {
  res.render("pages/create-ticket", {
    errors: { title: null, description: null },
    old: { title: "", description: "" },
    isLoading: false,
  });
});

// Create Ticket - GET route
app.get("/create-ticket", (req, res) => {
  res.render("pages/create-ticket", {
    errors: {
      title: null,
      description: null
    },
    old: {
      title: "",
      description: "",
      priority: "medium",
      category: "technical"
    },
    isSubmitting: false
  });
});

// Create Ticket - POST route
app.post("/create-ticket", (req, res) => {
  const { title, description, priority, category } = req.body;

  let titleError = "";
  let descriptionError = "";

  // Validation
  if (!title?.trim()) {
    titleError = "Title is required";
  } else if (title.length < 5) {
    titleError = "Title must be at least 5 characters";
  }

  if (!description?.trim()) {
    descriptionError = "Description is required";
  } else if (description.length < 10) {
    descriptionError = "Description must be at least 10 characters";
  }

  if (titleError || descriptionError) {
    return res.render("pages/create-ticket", {
      errors: {
        title: titleError,
        description: descriptionError
      },
      old: {
        title,
        description,
        priority: priority || "medium",
        category: category || "technical"
      },
      isSubmitting: false
    });
  }

  // In a real app, you would save to a database here
  // For demo purposes, we'll simulate successful creation
  
  // Mock ticket data
  const newTicket = {
    id: Date.now().toString(),
    title: title.trim(),
    description: description.trim(),
    priority: priority || "medium",
    category: category || "technical",
    status: "open",
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    createdBy: "current-user@example.com" // In real app, get from session
  };

  // Here you would typically:
  // 1. Save to database
  // 2. Send confirmation email
  // 3. Log the activity
  
  console.log("New ticket created:", newTicket);

  // Redirect to tickets page with success message
  // In a real app, you might use flash messages or query parameters
  res.redirect("/tickets?created=true");
});
// 404 handler
app.use((req, res) => {
  res.status(404).render("pages/404");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("pages/500");
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));