// GOOD EXAMPLE JS — proper button semantics + aria-expanded, and the
// nav is actually removed from the accessibility tree when closed.

function toggleMenu() {
  var nav = document.getElementById('primary-nav');
  var btn = document.getElementById('menu-btn');
  var isOpen = !nav.hidden;

  if (isOpen) {
    nav.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
    btn.classList.remove('is-open');
    // Fix: return focus to the trigger on close, in case it had moved
    // further into the menu (e.g. via the "Close menu" item) — nothing
    // left stranded inside a now-hidden panel.
    btn.focus();
  } else {
    nav.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Close menu');
    btn.classList.add('is-open');
    // Fix: focus deliberately stays on the button (standard disclosure-
    // button pattern) — its aria-expanded/aria-label change is announced
    // right where focus already is, and because the nav sits immediately
    // after the header in the DOM (unlike bad.html), the very next Tab
    // moves naturally into the first link (WCAG 2.4.3).
  }
}

function submitForm() {
  alert('Thanks for signing up!');
}
