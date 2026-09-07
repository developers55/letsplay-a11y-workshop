// BAD EXAMPLE JS — intentionally missing the accessibility fixes that
// live in js/good.js. See facilitator-notes.html.

// Toggles the *visible* nav copy only. nav-copy-2 is never touched, so
// it stays parked off-screen (still in the accessibility tree) no matter
// what the hamburger does — a screen reader user hits both copies.
function toggleMenu() {
  var nav = document.getElementById('nav-copy-1');
  if (nav.classList.contains('is-hidden-offscreen')) {
    nav.classList.remove('is-hidden-offscreen');
    nav.classList.add('is-visible');
  } else {
    nav.classList.remove('is-visible');
    nav.classList.add('is-hidden-offscreen');
  }
}

// Issue: makes the hamburger keyboard-activatable, but toggleMenu() never
// moves focus anywhere — opening the menu leaves focus sitting right on
// this div, so the very next Tab goes wherever it would have gone anyway
// (straight into the hero/page content), not into the newly-opened menu.
function handleHamburgerKey(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleMenu();
  }
}

function submitForm() {
  alert('Thanks for signing up!');
}

// Auto-advancing carousel: no pause/stop control anywhere (WCAG 2.2.2),
// and content changes without any aria-live announcement.
(function () {
  var items = document.querySelectorAll('#news-carousel .news-item');
  var index = 0;
  setInterval(function () {
    items[index].classList.remove('is-active');
    index = (index + 1) % items.length;
    items[index].classList.add('is-active');
  }, 1200);
})();
