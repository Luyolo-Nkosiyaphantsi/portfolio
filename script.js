// script.js
// Professional frontend logic for portfolio

const backendURL = "http://localhost:3000"; // Change to your deployed backend URL when online

// Load projects dynamically
async function loadProjects() {
  try {
    const res = await fetch(`${backendURL}/api/projects`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const projects = await res.json();
    const list = document.getElementById('project-list');
    list.innerHTML = "";

    projects.forEach(p => {
      const card = document.createElement('div');
      card.classList.add('project-card');
      card.innerHTML = `
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="project-meta">
          <span class="project-tech"><i class="fa-solid fa-code"></i> ${p.tech}</span>
          <span class="project-year"><i class="fa-solid fa-calendar"></i> ${p.year}</span>
        </div>
      `;
      list.appendChild(card);
    });
  } catch (error) {
    console.error("❌ Failed to load projects:", error);
    const list = document.getElementById('project-list');
    list.innerHTML = "<p>Unable to load projects at the moment.</p>";
  }
}

// Handle contact form submission
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: e.target.name.value.trim(),
    email: e.target.email.value.trim(),
    message: e.target.message.value.trim()
  };

  try {
    const res = await fetch(`${backendURL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const text = await res.text();
    alert(text);
    e.target.reset();
  } catch (error) {
    console.error("❌ Failed to send message:", error);
    alert("There was an error sending your message. Please try again later.");
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', loadProjects);