const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');

toggle?.addEventListener('click', () => {
  const open = header.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => header.classList.remove('open'));
});

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const upcomingTbody = document.querySelector('#shows-upcoming tbody');
const pastTbody = document.querySelector('#shows-past tbody');
const pastSection = document.getElementById('past-shows');
if (upcomingTbody && pastTbody && pastSection) {
  const today = new Date().toISOString().slice(0, 10);
  const dated = Array.from(upcomingTbody.querySelectorAll('tr[data-date]'));
  const pastRows = dated.filter(r => r.dataset.date < today)
    .sort((a, b) => b.dataset.date.localeCompare(a.dataset.date));
  pastRows.forEach(r => pastTbody.appendChild(r));
  if (pastTbody.children.length > 0) pastSection.hidden = false;
}

const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = document.querySelectorAll('section[id]');
if (navAnchors.length && sections.length) {
  const linkBySection = new Map();
  navAnchors.forEach(a => {
    const id = a.getAttribute('href').slice(1);
    if (id) linkBySection.set(id, a);
  });
  const setActive = (id) => {
    navAnchors.forEach(a => a.removeAttribute('aria-current'));
    const link = linkBySection.get(id);
    if (link) link.setAttribute('aria-current', 'location');
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-30% 0px -65% 0px', threshold: 0 });
  sections.forEach(s => observer.observe(s));
}

const welcomeModal = document.getElementById('welcome-modal');
if (welcomeModal) {
  const STORAGE_KEY = 'mh_welcome_seen_v1';
  const closeModal = () => {
    welcomeModal.hidden = true;
    document.body.classList.remove('modal-open');
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
  };
  let seen = false;
  try { seen = localStorage.getItem(STORAGE_KEY) === '1'; } catch {}
  if (!seen) {
    welcomeModal.hidden = false;
    document.body.classList.add('modal-open');
    welcomeModal.querySelectorAll('[data-close]').forEach(el => {
      el.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !welcomeModal.hidden) closeModal();
    });
  }
}

const carousel = document.querySelector('.member-carousel');
if (carousel) {
  const track = carousel.querySelector('.carousel-track');
  const cards = carousel.querySelectorAll('.member-card');
  const tabs = carousel.querySelectorAll('.tab');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  const counter = carousel.querySelector('.carousel-counter');
  const total = cards.length;
  let index = 0;

  const pad = n => String(n).padStart(2, '0');

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    if (counter) counter.textContent = `${pad(index + 1)} / ${pad(total)}`;
  }

  function go(dir) {
    index = (index + dir + total) % total;
    update();
  }

  prevBtn?.addEventListener('click', () => go(-1));
  nextBtn?.addEventListener('click', () => go(1));
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => { index = i; update(); });
  });

  update();
}
