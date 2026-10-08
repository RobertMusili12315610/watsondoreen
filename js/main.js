/* ==========================================================
   Doreen Watson Hair Studio - site scripts
   EDIT THIS: put the salon's WhatsApp number below, in
   international format with no "+" or spaces (Kenya = 254...).
   ========================================================== */
const WHATSAPP_NUMBER = '254700000000';

document.documentElement.classList.add('js');

/* ---------- Mobile menu ---------- */
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

function setMenu(open) {
  nav.classList.toggle('open', open);
  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
navToggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

/* ---------- Header shadow on scroll ---------- */
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('sticky', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('visible'));
}

/* ---------- Footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Gallery lightbox ---------- */
const items = Array.from(document.querySelectorAll('.g-item'));
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
let current = 0;

function showPhoto(index) {
  current = (index + items.length) % items.length;
  const item = items[current];
  lbImg.src = item.dataset.full;
  lbImg.alt = item.querySelector('img').alt;
}
function openLightbox(index) {
  showPhoto(index);
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.hidden = true;
  lbImg.src = '';
  document.body.style.overflow = '';
}
items.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => showPhoto(current - 1));
document.getElementById('lbNext').addEventListener('click', () => showPhoto(current + 1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPhoto(current - 1);
  if (e.key === 'ArrowRight') showPhoto(current + 1);
});

/* ---------- "Book for her / him" buttons pre-pick the form ---------- */
document.querySelectorAll('[data-service]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.getElementById('msg').placeholder = `I'd like to book for: ${btn.dataset.service}...`;
  });
});

/* ---------- Booking form -> WhatsApp ---------- */
const form = document.getElementById('bookingForm');
const formMsg = document.getElementById('formMsg');
const dateInput = document.getElementById('date');
dateInput.min = new Date().toISOString().split('T')[0];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const service = form.service.value;
  const date = form.date.value;
  const msg = form.msg.value.trim();

  ['name', 'phone', 'service'].forEach((id) => form[id].classList.remove('invalid'));
  formMsg.className = 'form-msg';

  const phoneOk = /^[+\d][\d\s-]{7,18}$/.test(phone);
  if (!name || !phoneOk || !service) {
    if (!name) form.name.classList.add('invalid');
    if (!phoneOk) form.phone.classList.add('invalid');
    if (!service) form.service.classList.add('invalid');
    formMsg.textContent = 'Please add your name, a valid phone number and a service.';
    return;
  }

  const lines = [
    'Hello Doreen! I would like to book an appointment.',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Service: ${service}`,
  ];
  if (date) lines.push(`Preferred day: ${date}`);
  if (msg) lines.push(`Notes: ${msg}`);

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
  formMsg.classList.add('ok');
  formMsg.textContent = 'Opening WhatsApp so you can send your request...';
  window.open(url, '_blank', 'noopener');
  form.reset();
});
