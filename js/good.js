// GOOD EXAMPLE JS — proper button semantics + aria-expanded, and the
// nav is actually removed from the accessibility tree when closed.

// "a, b and c" instead of "a, b, c" — so a list of dates reads as one
// natural sentence instead of a comma-spliced run-on.
function naturalJoin(items) {
  if (items.length <= 1) return items.join('');
  return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
}

function toggleMenu() {
  var nav = document.getElementById('primary-nav');
  var btn = document.getElementById('menu-btn');
  var icon = btn.querySelector('.hamburger-icon');
  var isOpen = !nav.hidden;

  if (isOpen) {
    nav.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
    btn.classList.remove('is-open');
    if (icon) icon.textContent = 'menu';
    // Fix: return focus to the trigger on close, in case it had moved
    // further into the menu (e.g. via the "Close menu" item) — nothing
    // left stranded inside a now-hidden panel.
    btn.focus();
  } else {
    nav.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Close menu');
    btn.classList.add('is-open');
    if (icon) icon.textContent = 'close';
    // Fix: focus deliberately stays on the button (standard disclosure-
    // button pattern) — its aria-expanded/aria-label change is announced
    // right where focus already is, and because the nav sits immediately
    // after the header in the DOM (unlike bad.html), the very next Tab
    // moves naturally into the first link (WCAG 2.4.3).
  }
}

// Event details keyed by the slug passed in good.html's Register links
// (?event=<slug>), so good-register.html can show which event the form
// is actually for instead of a generic, unlabelled "Event Registration".
var EVENTS = {
  'tuesday-stadium-run': {
    name: 'Tuesday Stadium Run',
    description: 'An easy-paced group run along the waterfront, great for building a weekly habit. All paces welcome, and the group regroups every kilometre. Meet at the main entrance; bring water and comfortable shoes.',
    dates: ['Tue, 4 May', 'Tue, 11 May', 'Tue, 18 May'],
    weekday: 'Tuesdays',
    month: 'May',
    time: '6:30 – 7:30 AM',
    time12h: '6:30 to 7:30 AM',
    location: 'Stadium Waterfront Promenade'
  },
  'wednesday-sunset-yoga': {
    name: 'Wednesday Sunset Yoga',
    description: 'Gentle, accessible yoga as the sun goes down. Suitable for complete beginners, no flexibility required. Mats and props are provided, just bring a water bottle.',
    dates: ['Wed, 6 Aug', 'Wed, 13 Aug', 'Wed, 20 Aug'],
    weekday: 'Wednesdays',
    month: 'Aug',
    time: '6:00 – 7:00 PM',
    time12h: '6:00 to 7:00 PM',
    location: 'Rhu Point Lookout'
  },
  'saturday-reservoir-run': {
    name: 'Saturday Reservoir Run',
    description: 'A scenic loop around the water, open to walkers, joggers, and runners alike. Choose your own pace and distance, and turn back whenever you like. Meet at the boathouse car park.',
    dates: ['Sat, 5 Jun', 'Sat, 12 Jun', 'Sat, 19 Jun'],
    weekday: 'Saturdays',
    month: 'Jun',
    time: '8:00 – 9:00 AM',
    time12h: '8:00 to 9:00 AM',
    location: 'Serangoon Reservoir'
  }
};

(function () {
  var heading = document.getElementById('register-heading');
  if (!heading) return; // not on good-register.html

  var slug = new URLSearchParams(window.location.search).get('event');
  var eventInfo = EVENTS[slug];
  if (!eventInfo) return; // no/unknown event — keep the generic heading

  heading.textContent = 'Event Registration for ' + eventInfo.name;
  document.title = 'Register for ' + eventInfo.name + " - Let's Play";

  // Fix: Eventbrite-style date/time/location line, so a registrant sees
  // exactly what they're signing up for right next to the form, not just
  // a bare event name — written as one flowing sentence (same style as
  // the event cards on good.html), not a dot-separated, fragmented one.
  var meta = document.getElementById('register-event-meta');
  if (meta && eventInfo.dates && eventInfo.weekday && eventInfo.month && eventInfo.time12h && eventInfo.location) {
    var days = eventInfo.dates.map(function (d) {
      return d.split(', ')[1].split(' ')[0];
    });
    meta.textContent = eventInfo.weekday + ', ' + naturalJoin(days) + ' ' + eventInfo.month + ', ' + eventInfo.time12h + ', at ' + eventInfo.location;
    meta.hidden = false;
  }

  var desc = document.getElementById('register-event-desc');
  desc.textContent = eventInfo.description;
  desc.hidden = false;

  // Fix: the date options matched the event actually being registered
  // for, instead of a fixed set of Tuesday dates regardless of which
  // event a visitor arrived from.
  var dateOptions = document.getElementById('date-options');
  if (dateOptions && eventInfo.dates) {
    dateOptions.innerHTML = eventInfo.dates.map(function (date, i) {
      var checked = i === 0 ? ' checked' : '';
      return '<label class="date-option-row">' +
        '<input type="radio" name="event-date" value="' + date + '"' + checked + '>' +
        '<span class="date-option">' + date + '</span>' +
        '</label>';
    }).join('');
  }
})();

// Fix: writes into the role="status"/aria-live="polite" region in the
// page instead of alert() or a plain toggled <div> — a screen reader
// announces this the moment it's set, same instant a sighted user sees
// it appear (WCAG 4.1.3 Status Messages).
function handleRegisterSubmit(event) {
  event.preventDefault();
  var form = event.target;
  var selectedDate = form.querySelector('input[name="event-date"]:checked');
  var status = document.getElementById('form-status');
  status.textContent = "Thanks for signing up for " + selectedDate.value + "! We'll email you the details shortly.";
}
