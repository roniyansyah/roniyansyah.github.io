/*=============== TAHUN FOOTER ===============*/
document.getElementById('year').textContent = new Date().getFullYear();

/*=============== TAB SWITCHING ===============*/
const tabButtons = document.querySelectorAll('.tabs__btn');
const panels = document.querySelectorAll('.panel');
const accentMap = {
  personal: 'var(--accent-personal)',
  working: 'var(--accent-working)',
  business: 'var(--accent-business)',
  community: 'var(--accent-community)',
  organization: 'var(--accent-organization)'
};

function activateTab(target){
  tabButtons.forEach(btn => {
    const isActive = btn.dataset.target === target;
    btn.classList.toggle('is-active', isActive);
    btn.style.setProperty('--tab-accent', accentMap[btn.dataset.target]);
  });
  panels.forEach(panel => {
    panel.classList.toggle('is-active', panel.id === target);
  });
  // scroll active tab into view on mobile
  const activeBtn = document.querySelector(`.tabs__btn[data-target="${target}"]`);
  activeBtn?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn.dataset.target));
});

// set initial accent colors
tabButtons.forEach(btn => btn.style.setProperty('--tab-accent', accentMap[btn.dataset.target]));

/*=============== DEEP LINK VIA HASH (#working dll) ===============*/
const initialHash = window.location.hash.replace('#', '');
if (initialHash && document.getElementById(initialHash)) {
  activateTab(initialHash);
}

/*=============== THEME TOGGLE ===============*/
const themeButton = document.getElementById('theme-button');
const root = document.documentElement;
const savedTheme = localStorage.getItem('aturkata-theme');

function applyTheme(theme){
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
    themeButton.classList.replace('ri-moon-line', 'ri-sun-line');
  } else {
    root.removeAttribute('data-theme');
    themeButton.classList.replace('ri-sun-line', 'ri-moon-line');
  }
}

applyTheme(savedTheme || 'dark');

themeButton.addEventListener('click', () => {
  const isLight = root.getAttribute('data-theme') === 'light';
  const next = isLight ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem('aturkata-theme', next);
});

/*=============== PERINGATAN LINK BELUM DIISI (khusus saat development) ===============*/
document.querySelectorAll('[data-todo]').forEach(el => {
  el.addEventListener('click', (e) => {
    if (el.getAttribute('href') === '#') {
      e.preventDefault();
      console.warn('TODO:', el.dataset.todo);
    }
  });
});
