// server.js
// Professional Node.js + Express backend for portfolio

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname))); // serve frontend files

// Sample project data (replace with DB later if needed)
const projects = [
  {
    title: "CRUD Application",
    description: "A full-stack web application implementing Create, Read, Update, and Delete operations for managing records in a database.",
    tech: "HTML, CSS, JavaScript, PHP, MySQL",
    year: "2026"
  },
  {
    title: "Personal Portfolio Website",
    description: "A responsive personal portfolio website showcasing projects, skills, and contact information for potential employers.",
    tech: "HTML, CSS, JavaScript",
    year: "2026"
  },
  {
    title: "Vehicle Rental System Web",
    description: "A system designed to facilitate and modernize corporate vehicle rental and return procedures.",
    tech: "HTML, ASP.Net, MySQL",
    year: "2025"
  },
  {
    title: "Weather App",
    description: "A web application that fetches and displays real-time weather data for any city using a third-party weather API.",
    tech: "HTML, CSS, JavaScript, OpenWeatherMap API",
    year: "2026"
  },
  {
    title: "TradeRoute Logistics System",
    description: "A logistics management system designed to track shipments, manage routes, and streamline delivery operations.",
    tech: "Python, MySQL, HTML, CSS, JavaScript",
    year: "2026"
  }
];

// Routes
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send("All fields are required.");
  }

  console.log("📩 New contact form submission:", { name, email, message });
  res.send("Message received! Thank you for reaching out.");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);
  res.status(500).send("Something went wrong on the server.");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
