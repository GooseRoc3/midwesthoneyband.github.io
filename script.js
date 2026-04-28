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
