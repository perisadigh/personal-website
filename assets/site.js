(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var now = new Date();

  // Dates
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = now.getFullYear(); });
  document.querySelectorAll('[data-day]').forEach(function (el) { el.textContent = pad(now.getDate()); });
  document.querySelectorAll('[data-month]').forEach(function (el) { el.textContent = pad(now.getMonth() + 1); });
  document.querySelectorAll('[data-month-name]').forEach(function (el) { el.textContent = now.toLocaleString('en', { month: 'short' }).toLowerCase(); });

  // Letter-spaced dividers: <p class="spaced" data-spaced="selected work">
  document.querySelectorAll('[data-spaced]').forEach(function (el) {
    var text = el.getAttribute('data-spaced');
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split('').map(function (c) {
      return c === ' ' ? '<span class="gap"></span>' : '<span aria-hidden="true">' + c + '</span>';
    }).join('');
  });

  // Scattered text: words spread across the full width, a few per line
  function scatter() {
    document.querySelectorAll('[data-scatter]').forEach(function (el) {
      if (!el.dataset.text) el.dataset.text = el.textContent.trim();
      var words = el.dataset.text.split(/\s+/), html = '';
      var pattern = window.innerWidth < 760 ? [3, 4, 2, 5, 3, 4] : [5, 7, 3, 6, 8, 4, 6];
      for (var i = 0, k = 0; i < words.length; k++) {
        var n = pattern[k % pattern.length];
        html += '<span class="line">' + words.slice(i, i + n).map(function (w) { return '<span>' + w + '</span>'; }).join('') + '</span>';
        i += n;
      }
      el.setAttribute('aria-label', el.dataset.text);
      el.innerHTML = html;
    });
  }
  scatter();
  window.addEventListener('resize', scatter);

  // Reveal on scroll
  var items = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  // Threads that draw themselves as you scroll
  var drawn = [];
  function prepare(path) {
    var len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = reduce ? 0 : len;
    drawn.push({ path: path, len: len });
  }
  function onScroll() {
    drawn.forEach(function (d) {
      var box = d.path.ownerSVGElement.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = Math.min(1, Math.max(0, (vh * 0.85 - box.top) / (box.height + vh * 0.2)));
      d.path.style.strokeDashoffset = d.len * (1 - p);
    });
  }
  // Route the page thread down the margins, crossing over in the gaps between sections
  function route(svg) {
    var main = svg.parentElement, m = main.getBoundingClientRect();
    var secs = Array.prototype.filter.call(main.children, function (c) { return c.tagName === 'SECTION'; });
    if (!secs.length) return;
    var first = secs[0], cs = getComputedStyle(first);
    var fr = first.getBoundingClientRect();
    var left = (fr.left - m.left + parseFloat(cs.paddingLeft)) / 2;
    var right = m.width - left;
    var W = m.width, H = m.height;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var x = right, y = fr.top - m.top + 40, d = 'M' + x + ' ' + y;
    for (var i = 1; i < secs.length; i++) {
      var gy = secs[i].getBoundingClientRect().top - m.top - 48;
      var nx = x === right ? left : right, mid = (x + nx) / 2;
      d += ' C ' + (x + (x === right ? 4 : -4)) + ' ' + (y + (gy - y) * 0.5) + ', ' + x + ' ' + (gy - 80) + ', ' + x + ' ' + (gy - 40);
      d += ' C ' + x + ' ' + (gy + 4) + ', ' + (x + (nx - x) * 0.25) + ' ' + gy + ', ' + mid + ' ' + (gy + 2);
      d += ' C ' + (x + (nx - x) * 0.75) + ' ' + (gy + 4) + ', ' + nx + ' ' + (gy - 2) + ', ' + nx + ' ' + (gy + 40);
      x = nx; y = gy + 40;
    }
    d += ' C ' + x + ' ' + (y + (H - y) * 0.5) + ', ' + (x === right ? x : x + 10) + ' ' + (H - 40) + ', ' + x + ' ' + H;
    svg.querySelector('path').setAttribute('d', d);
  }
  function buildThreads() {
    drawn = [];
    document.querySelectorAll('.thread-layer.scroll').forEach(function (svg) {
      if (getComputedStyle(svg).display === 'none') return;
      route(svg);
      prepare(svg.querySelector('path'));
    });
    onScroll();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { buildThreads(); });
  window.addEventListener('load', function () { buildThreads(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { buildThreads(); });
})();
