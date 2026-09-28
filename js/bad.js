// BAD EXAMPLE JS — intentionally missing the accessibility fixes that
// live in js/good.js. See facilitator-notes.html.

// Toggles the *visible* nav copy only. nav-copy-2 is never touched, so
// it stays parked off-screen (still in the accessibility tree) no matter
// what the hamburger does — a screen reader user hits both copies.
function toggleMenu() {
  var nav = document.getElementById('nav-copy-1');
  var hamburger = document.querySelector('.hamburger');
  var icon = hamburger.querySelector('.hamburger-icon');
  if (nav.classList.contains('is-hidden-offscreen')) {
    nav.classList.remove('is-hidden-offscreen');
    nav.classList.add('is-visible');
    hamburger.classList.add('is-open');
    if (icon) icon.textContent = 'close';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  } else {
    nav.classList.remove('is-visible');
    nav.classList.add('is-hidden-offscreen');
    hamburger.classList.remove('is-open');
    if (icon) icon.textContent = 'menu';
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
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

// Issue: toggles a checked class on a plain <div> — no aria-checked,
// no role="checkbox", nothing exposed to AT at all.
function toggleCheckbox(el) {
  el.classList.toggle('checked');
}

// Issue: silently does nothing if the slider hasn't been dragged to the
// end — no error message, no explanation, nothing at all. A keyboard-only
// user, who could never drag the slider in the first place, clicks this
// button and gets total silence every time (WCAG 3.3.1 Error Identification).
//
// Issue: shows the toast, but it's just a class toggle on a plain
// <div> — no role="status"/aria-live, so a screen reader never hears
// that submission succeeded (WCAG 4.1.3 Status Messages).
function submitForm() {
  var track = document.getElementById('puzzle-track');
  if (track && !track.classList.contains('is-verified')) {
    return;
  }

  var toast = document.getElementById('toast');
  if (toast) {
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 3000);
  }
}

// Auto-advancing carousel: no pause/stop control anywhere (WCAG 2.2.2),
// and content changes without any aria-live announcement. Picking a dot
// by hand doesn't reset or pause the interval either, so a slide picked
// manually gets yanked away 1.2s later anyway. Dots are bare <button>s
// with no text/aria-label/aria-current (WCAG 4.1.2).
(function () {
  var items = document.querySelectorAll('#news-carousel .news-item');
  var dots = document.querySelectorAll('#news-carousel-dots .carousel-dot');
  var index = 0;

  function showNewsSlide(i) {
    items[index].classList.remove('is-active');
    dots[index].classList.remove('is-active');
    index = (i + items.length) % items.length;
    items[index].classList.add('is-active');
    dots[index].classList.add('is-active');
  }

  window.goToNewsSlide = function (i) {
    showNewsSlide(i);
  };

  setInterval(function () {
    showNewsSlide(index + 1);
  }, 3000);
})();

// Same flaw, now on the hero banner — the very first thing on the page,
// and nothing here even tries to respect prefers-reduced-motion. Picking
// a dot by hand doesn't reset or pause the interval either, so a slide
// picked manually gets yanked away 3.5s later anyway.
(function () {
  var slides = document.querySelectorAll('#hero-carousel .carousel-slide');
  var dots = document.querySelectorAll('#hero-carousel .carousel-dot');
  var index = 0;

  function showHeroSlide(i) {
    slides[index].classList.remove('is-active');
    dots[index].classList.remove('is-active');
    index = (i + slides.length) % slides.length;
    slides[index].classList.add('is-active');
    dots[index].classList.add('is-active');
  }

  window.goToHeroSlide = function (i) {
    showHeroSlide(i);
  };

  setInterval(function () {
    showHeroSlide(index + 1);
  }, 3500);
})();

// Event card image carousels — dots only, no arrows. Same unlabelled-
// button bug as the hero's dots (see the HTML comment above each card).
window.goToEventSlide = function (carouselId, index) {
  var carousel = document.getElementById(carouselId);
  var images = carousel.querySelectorAll('.event-image');
  var dots = carousel.querySelectorAll('.carousel-dot');
  for (var i = 0; i < images.length; i++) {
    images[i].classList.toggle('is-active', i === index);
    dots[i].classList.toggle('is-active', i === index);
  }
};

// bad-register.html — Issue: styled like a radio group, but this is
// just a class swap on plain <div>s. No role="radio", no aria-checked,
// no fieldset/legend, no name attribute. A screen reader has no way to
// tell which date is selected, or that these options are even related.
window.selectDate = function (el) {
  var options = el.parentElement.querySelectorAll('.date-option');
  for (var i = 0; i < options.length; i++) {
    options[i].classList.remove('selected');
  }
  el.classList.add('selected');
};

// bad-register.html — Issue: pointerdown/pointermove/pointerup only,
// nothing else. No keydown handler, no tabindex, no role="slider", no
// aria-valuenow/min/max/text. A mouse or touchscreen user can drag the
// piece across; a keyboard-only or screen reader user has no way to
// interact with this control at all.
(function () {
  var piece = document.getElementById('puzzle-piece');
  if (!piece) return;

  var track = document.getElementById('puzzle-track');
  var fill = track.querySelector('.puzzle-track-fill');
  var label = track.querySelector('.puzzle-track-label');
  var submitBtn = document.getElementById('submit-btn');
  var dragging = false;
  var maxX = track.clientWidth - piece.clientWidth - 4;

  function setX(x) {
    x = Math.max(0, Math.min(maxX, x));
    piece.style.left = x + 'px';
    fill.style.width = (x + piece.clientWidth) + 'px';
    if (x >= maxX - 2) {
      track.classList.add('is-verified');
      label.textContent = 'Verified';
      piece.textContent = '✓';
      if (submitBtn) submitBtn.classList.remove('is-disabled-look');
    } else {
      track.classList.remove('is-verified');
      label.textContent = 'Slide to verify';
      piece.textContent = '»';
      if (submitBtn) submitBtn.classList.add('is-disabled-look');
    }
  }

  piece.addEventListener('pointerdown', function (e) {
    dragging = true;
    piece.setPointerCapture(e.pointerId);
  });
  piece.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var rect = track.getBoundingClientRect();
    setX(e.clientX - rect.left - piece.clientWidth / 2);
  });
  piece.addEventListener('pointerup', function () {
    dragging = false;
  });
})();
