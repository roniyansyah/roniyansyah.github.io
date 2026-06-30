/*=============== TAHUN FOOTER ===============*/
document.getElementById('year').textContent = new Date().getFullYear();

/*=============== TAB SWITCHING ===============*/
const tabButtons = document.querySelectorAll('.tabs__btn');
const panels = document.querySelectorAll('.panel');
const body = document.body;

function activateTab(target){
  tabButtons.forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.target === target);
  });
  panels.forEach(panel => {
    panel.classList.toggle('is-active', panel.id === target);
  });
  // ganti tema warna keseluruhan halaman mengikuti tab aktif
  body.setAttribute('data-accent', target);
}

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn.dataset.target));
});

/*=============== DEEP LINK VIA HASH (#working dll) ===============*/
const initialHash = window.location.hash.replace('#', '');
if (initialHash && document.getElementById(initialHash)) {
  activateTab(initialHash);
}

/*=============== THEME TOGGLE (terang/gelap) ===============*/
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

/*=============== PERINGATAN LINK BELUM DIISI ===============*/
document.querySelectorAll('[data-todo]').forEach(el => {
  el.addEventListener('click', (e) => {
    if (el.getAttribute('href') === '#') {
      e.preventDefault();
      console.warn('TODO:', el.dataset.todo);
    }
  });
});
