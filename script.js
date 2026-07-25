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

  if (upcomingTbody.children.length === 0) {
    const upcomingTable = document.getElementById('shows-upcoming');
    const upcomingEmpty = document.querySelector('.shows-empty');
    if (upcomingTable) upcomingTable.hidden = true;
    if (upcomingEmpty) upcomingEmpty.hidden = false;
  }
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
  const todayIso = new Date().toISOString().slice(0, 10);
  const futureRows = Array.from(document.querySelectorAll('#shows-upcoming tbody tr[data-date]'))
    .filter(r => r.dataset.date >= todayIso)
    .sort((a, b) => a.dataset.date.localeCompare(b.dataset.date));
  const nextShow = futureRows[0];

  if (nextShow) {
    const STORAGE_KEY = 'mh_welcome_seen_' + nextShow.dataset.date;
    let seen = false;
    try { seen = localStorage.getItem(STORAGE_KEY) === '1'; } catch {}

    if (!seen) {
      const venue = nextShow.querySelector('.show-venue')?.textContent.trim() || '';
      const when = nextShow.querySelector('.show-when')?.textContent.trim() || '';
      const where = nextShow.querySelector('.show-where')?.textContent.trim() || '';
      const tickets = nextShow.querySelector('.ticket-col')?.textContent.trim() || '';
      const detailEl = welcomeModal.querySelector('.modal-detail');
      const subEl = welcomeModal.querySelector('.modal-sub');
      if (detailEl) detailEl.textContent = [venue, when].filter(Boolean).join(' · ');
      if (subEl) subEl.textContent = [where, tickets].filter(Boolean).join(' · ');

      const closeModal = () => {
        welcomeModal.hidden = true;
        document.body.classList.remove('modal-open');
        try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
      };
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

// Lightbox: click any [data-full] image to view it large, with prev/next.
const lbThumbs = Array.from(document.querySelectorAll('[data-full]'));
if (lbThumbs.length) {
  const items = lbThumbs.map(img => ({
    full: img.getAttribute('data-full'),
    thumb: img.currentSrc || img.src,
    alt: img.getAttribute('alt') || '',
    credit: img.closest('figure')?.querySelector('figcaption')?.innerHTML || ''
  }));
  const single = items.length < 2;

  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.hidden = true;
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Photo viewer');
  lb.innerHTML =
    '<button class="lb-close" aria-label="Close">&times;</button>' +
    '<button class="lb-prev" aria-label="Previous photo">&#8249;</button>' +
    '<button class="lb-next" aria-label="Next photo">&#8250;</button>' +
    '<figure class="lb-figure"><img class="lb-img" alt=""><figcaption class="lb-cap"></figcaption></figure>';
  document.body.appendChild(lb);

  const lbImg = lb.querySelector('.lb-img');
  const lbCap = lb.querySelector('.lb-cap');
  const btnClose = lb.querySelector('.lb-close');
  const btnPrev = lb.querySelector('.lb-prev');
  const btnNext = lb.querySelector('.lb-next');
  if (single) { btnPrev.hidden = true; btnNext.hidden = true; }

  let idx = 0, lastFocus = null;

  function show(i) {
    idx = (i + items.length) % items.length;
    const it = items[idx];
    lbImg.src = it.thumb;              // instant: the already-loaded thumbnail
    lbImg.alt = it.alt;
    const pre = new Image();           // then swap to the full-size once it loads
    pre.onload = () => { if (items[idx] === it) lbImg.src = it.full; };
    pre.src = it.full;
    lbCap.innerHTML = it.credit ? it.alt + ' &middot; ' + it.credit : it.alt;
    if (!single) [idx + 1, idx - 1].forEach(n => { new Image().src = items[(n + items.length) % items.length].full; });
  }
  function openAt(i) {
    lastFocus = document.activeElement;
    show(i);
    lb.hidden = false;
    document.body.classList.add('modal-open');
    btnClose.focus();
  }
  function close() {
    lb.hidden = true;
    document.body.classList.remove('modal-open');
    lbImg.removeAttribute('src');
    if (lastFocus) lastFocus.focus();
  }

  lbThumbs.forEach((img, i) => {
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.addEventListener('click', () => openAt(i));
    img.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAt(i); }
    });
  });
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => show(idx - 1));
  btnNext.addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', e => {
    if (!e.target.closest('.lb-img, .lb-prev, .lb-next, .lb-close')) close();
  });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft' && !single) show(idx - 1);
    else if (e.key === 'ArrowRight' && !single) show(idx + 1);
  });
  let sx = null;
  lb.addEventListener('touchstart', e => { sx = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (sx === null || single) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
    sx = null;
  }, { passive: true });
}
