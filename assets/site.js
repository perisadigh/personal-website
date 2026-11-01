(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Local time in the header
  var clock = document.querySelector('[data-clock]');
  function tick() {
    if (clock) clock.textContent = 'Local time ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }
  tick();
  setInterval(tick, 30000);
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Work & Play filter
  var filters = document.querySelectorAll('[data-filter]');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var kind = btn.getAttribute('data-filter');
      filters.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      document.querySelectorAll('[data-kind]').forEach(function (el) {
        el.hidden = kind !== 'all' && el.getAttribute('data-kind').indexOf(kind) === -1;
      });
    });
  });

  // Polaroid reel arrows
  document.querySelectorAll('[data-reel]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var reel = document.getElementById(btn.getAttribute('data-reel'));
      reel.scrollBy({ left: (btn.getAttribute('data-dir') === 'next' ? 1 : -1) * reel.clientWidth * 0.6, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  // Reveal on scroll
  var items = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }
})();
