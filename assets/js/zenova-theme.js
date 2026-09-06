const menuButton = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav-links');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = document.querySelector('.form-status');
    if (status) {
      status.textContent = 'Thanks — the page design is working. Connect this form to your preferred email/form service before using it for production submissions.';
      status.classList.add('show');
    }
  });
}