// script.js — Luyolo Nkosiyaphantsi Portfolio

const backendURL = "https://portfolio-zoxu.onrender.com";

/* ─────────────────────────────────────────
   TERMINAL LOADER
   Sequence:
   1. $ boot --portfolio luyolo
   2. → Loading Software Development modules...
   3. → Loading Data Analytics modules...
   4. → Mounting Azure & Cisco certifications...
   5. ✔ All systems go
   6. Welcome to Luyolo's Portfolio 🚀
───────────────────────────────────────── */
const termLines = [
  { type: 'cmd',     text: 'boot --portfolio luyolo',                  delay: 300  },
  { type: 'out',     text: '→ Loading Software Development modules...', delay: 900  },
  { type: 'out',     text: '→ Loading Data Analytics modules...',       delay: 1500 },
  { type: 'out',     text: '→ Mounting Azure & Cisco certifications...', delay: 2100 },
  { type: 'success', text: '✔ All systems go.',                         delay: 2700 },
  { type: 'welcome', text: "Welcome to Luyolo's Portfolio 🚀",          delay: 3200 },
];

function typeText(el, text, speed = 35) {
  return new Promise(resolve => {
    let i = 0;
    const tick = () => {
      el.textContent += text[i++];
      if (i < text.length) setTimeout(tick, speed);
      else resolve();
    };
    tick();
  });
}

async function runTerminalLoader() {
  const body = document.getElementById('terminalBody');

  for (const line of termLines) {
    await new Promise(r => setTimeout(r, line.delay - (termLines[termLines.indexOf(line) - 1]?.delay ?? 0)));

    const div = document.createElement('div');
    div.classList.add('t-line');

    if (line.type === 'cmd') {
      div.innerHTML = '<span class="t-prompt">$ </span>';
      const cmd = document.createElement('span');
      cmd.classList.add('t-cmd');
      div.appendChild(cmd);
      body.appendChild(div);
      await typeText(cmd, line.text, 40);

    } else if (line.type === 'out') {
      div.innerHTML = `<span class="t-out">${line.text}<span class="t-blink">_</span></span>`;
      body.appendChild(div);
      await new Promise(r => setTimeout(r, 400));
      div.querySelector('.t-blink')?.remove();

    } else if (line.type === 'success') {
      div.innerHTML = `<span class="t-success">${line.text}</span>`;
      body.appendChild(div);

    } else if (line.type === 'welcome') {
      div.innerHTML = `<span class="t-welcome">${line.text}</span>`;
      body.appendChild(div);
      await new Promise(r => setTimeout(r, 900));
    }

    body.scrollTop = body.scrollHeight;
  }

  // Fade out loader
  await new Promise(r => setTimeout(r, 600));
  document.getElementById('pageLoader').classList.add('hide');
}

/* ─────────────────────────────────────────
   TYPED WORDS in hero (cycling)
───────────────────────────────────────── */
const words = [
  'software that scales.',
  'data-driven insights.',
  'clean, readable code.',
  'fullstack web apps.',
  'Azure ML pipelines.',
  'things that matter.',
];

async function runTypedWords() {
  const el = document.getElementById('typedWords');
  if (!el) return;
  let wi = 0;
  while (true) {
    const word = words[wi % words.length];
    // Type
    for (let i = 0; i <= word.length; i++) {
      el.textContent = word.slice(0, i);
      await new Promise(r => setTimeout(r, 55));
    }
    await new Promise(r => setTimeout(r, 1800));
    // Delete
    for (let i = word.length; i >= 0; i--) {
      el.textContent = word.slice(0, i);
      await new Promise(r => setTimeout(r, 28));
    }
    await new Promise(r => setTimeout(r, 300));
    wi++;
  }
}

/* ─────────────────────────────────────────
   SKELETON PLACEHOLDERS
───────────────────────────────────────── */
function showSkeletons(count = 5) {
  const list = document.getElementById('project-list');
  list.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.classList.add('skeleton');
    list.appendChild(s);
  }
}

/* ─────────────────────────────────────────
   LOAD PROJECTS
───────────────────────────────────────── */
async function loadProjects() {
  showSkeletons(5);
  try {
    const res = await fetch(`${backendURL}/api/projects`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const projects = await res.json();
    const list = document.getElementById('project-list');
    list.innerHTML = '';
    projects.forEach(p => {
      const card = document.createElement('div');
      card.classList.add('project-card');
      card.innerHTML = `
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="project-meta">
          <span class="project-tech"><i class="fa-solid fa-code"></i> ${p.tech}</span>
          <span class="project-year"><i class="fa-solid fa-calendar"></i> ${p.year}</span>
        </div>`;
      list.appendChild(card);
    });
  } catch {
    document.getElementById('project-list').innerHTML =
      '<p style="color:var(--muted);font-size:.9rem;grid-column:1/-1">Unable to load projects — make sure the server is running.</p>';
  }
}

/* ─────────────────────────────────────────
   SKILL BAR ANIMATION (on scroll)
───────────────────────────────────────── */
function animateSkills() {
  const fills = document.querySelectorAll('.skill-fill');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => obs.observe(f));
}

/* ─────────────────────────────────────────
   SCROLL SPY — active nav link
───────────────────────────────────────── */
function initScrollSpy() {
  const sections = document.querySelectorAll('.section');
  const links = document.querySelectorAll('.nav-link');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        links.forEach(l => l.classList.toggle('active', l.dataset.section === id));
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => obs.observe(s));
}

/* ─────────────────────────────────────────
   MOBILE SIDEBAR TOGGLE
───────────────────────────────────────── */
function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const side = document.getElementById('sidebar');
  btn?.addEventListener('click', () => side.classList.toggle('open'));
  document.querySelectorAll('.nav-link').forEach(l =>
    l.addEventListener('click', () => side.classList.remove('open'))
  );
}

/* ─────────────────────────────────────────
   CONTACT FORM
───────────────────────────────────────── */
document.getElementById('contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const btn  = e.target.querySelector('button');
  const orig = btn.innerHTML;
  btn.innerHTML = 'Sending<span class="t-blink">...</span>';
  btn.disabled  = true;

  try {
    const res = await fetch(`${backendURL}/api/contact`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        name:    e.target.name.value.trim(),
        email:   e.target.email.value.trim(),
        message: e.target.message.value.trim(),
      }),
    });
    if (!res.ok) throw new Error();
    btn.innerHTML       = '✔ Message sent!';
    btn.style.background = '#22c55e';
    e.target.reset();
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; }, 3000);
  } catch {
    alert('Error sending message. Please try again.');
    btn.innerHTML = orig;
    btn.disabled  = false;
  }
});

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  initMobileMenu();
  initScrollSpy();
  animateSkills();
  runTypedWords();
  loadProjects(); // don't await — runs in background
  await runTerminalLoader(); // controls when loader disappears
});
