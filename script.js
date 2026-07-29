// script.js
// Professional frontend logic for portfolio

const backendURL = "https://portfolio-zoxu.onrender.com";

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

// =====================
// PRELOADER
// =====================
function runPreloader() {
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  const percentLabel = document.getElementById('preloaderPercent');
  if (!preloader || !fill || !percentLabel) return;

  let progress = 0;
  const startTime = performance.now();
  const MIN_DURATION_MS = 1400; // feels intentional, not a flash

  const pageReady = new Promise(resolve => {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', resolve, { once: true });
  });
  let readyFlag = false;
  pageReady.then(() => { readyFlag = true; });

  const tick = () => {
    const elapsed = performance.now() - startTime;
    const minElapsed = elapsed >= MIN_DURATION_MS;
    // Ease toward 90% quickly, then wait for real page-load + min duration to finish
    const target = (readyFlag && minElapsed) ? 100 : 90;
    progress += (target - progress) * 0.12 + 0.4;
    if (progress > target) progress = target;

    fill.style.width = progress.toFixed(0) + '%';
    percentLabel.textContent = Math.floor(progress) + '%';

    if (progress >= 100) {
      finishPreloader(preloader);
      return;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function finishPreloader(preloader) {
  preloader.classList.add('preloader-hide');
  // Kick off the bars-wipe + navbar/hero reveal sequence
  document.body.classList.add('reveal');
  setTimeout(() => {
    preloader.remove();
  }, 650);
}

// =====================
// DARK / LIGHT THEME TOGGLE
// =====================
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  };

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
  initThemeToggle();
  runPreloader();
});
