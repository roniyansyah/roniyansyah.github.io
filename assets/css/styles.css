/*=============== TAHUN FOOTER ===============*/
document.getElementById('year').textContent = new Date().getFullYear();

/*=============== TAB SWITCHING + GESER VIA PANAH (tanpa scroll) ===============*/
const tabsList   = document.getElementById('tabsList');
const tabsViewport = document.querySelector('.tabs__viewport');
const prevBtn    = document.getElementById('tabPrev');
const nextBtn    = document.getElementById('tabNext');
const tabButtons = document.querySelectorAll('.tabs__btn');
const panels     = document.querySelectorAll('.panel');
const body       = document.body;

let offset = 0; // posisi geser tabsList saat ini (px, selalu <= 0)

function updateArrows(){
  const maxOffset = Math.max(0, tabsList.scrollWidth - tabsViewport.clientWidth);
  offset = Math.min(Math.max(offset, -maxOffset), 0);
  tabsList.style.transform = `translateX(${offset}px)`;

  const overflowing = maxOffset > 0;
  prevBtn.hidden = !overflowing || offset >= 0;
  nextBtn.hidden = !overflowing || offset <= -maxOffset;
}

function shiftTabs(direction){
  const step = 130; // jarak geser per klik panah (px)
  offset += direction === 'next' ? -step : step;
  updateArrows();
}

function bringActiveIntoView(btn){
  const viewportRect = tabsViewport.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();
  if (btnRect.left < viewportRect.left) {
    offset += (viewportRect.left - btnRect.left) + 8;
  } else if (btnRect.right > viewportRect.right) {
    offset -= (btnRect.right - viewportRect.right) + 8;
  }
  updateArrows();
}

function activateTab(target){
  tabButtons.forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.target === target);
  });
  panels.forEach(panel => {
    panel.classList.toggle('is-active', panel.id === target);
  });
  body.setAttribute('data-accent', target);

  // tunggu animasi lebar tab aktif selesai, lalu hitung ulang & pastikan tab aktif terlihat
  requestAnimationFrame(() => {
    setTimeout(() => {
      updateArrows();
      const activeBtn = document.querySelector(`.tabs__btn[data-target="${target}"]`);
      if (activeBtn) bringActiveIntoView(activeBtn);
    }, 260);
  });
}

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn.dataset.target));
});

prevBtn.addEventListener('click', () => shiftTabs('prev'));
nextBtn.addEventListener('click', () => shiftTabs('next'));

window.addEventListener('resize', updateArrows);
window.addEventListener('load', updateArrows);
updateArrows();

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
