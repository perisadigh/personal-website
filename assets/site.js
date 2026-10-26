(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var now = new Date();

  // Dates
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = now.getFullYear(); });
  document.querySelectorAll('[data-day]').forEach(function (el) { el.textContent = pad(now.getDate()); });
  document.querySelectorAll('[data-month]').forEach(function (el) { el.textContent = pad(now.getMonth() + 1); });

  // Letter-spaced dividers: <p class="spaced" data-spaced="selected work">
  document.querySelectorAll('[data-spaced]').forEach(function (el) {
    var text = el.getAttribute('data-spaced');
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split('').map(function (c) {
      return c === ' ' ? '<span class="gap"></span>' : '<span aria-hidden="true">' + c + '</span>';
    }).join('');
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

  // Archive: connect each fragment to the core with a thread
  var board = document.querySelector('.board');
  function connect() {
    if (!board) return;
    var svg = board.querySelector('.thread-layer');
    if (!svg || getComputedStyle(svg).display === 'none') return;
    var b = board.getBoundingClientRect();
    var core = board.querySelector('.core .frame').getBoundingClientRect();
    var cx = core.left + core.width / 2 - b.left, cy = core.top + core.height * 0.35 - b.top;
    svg.setAttribute('viewBox', '0 0 ' + b.width + ' ' + b.height);
    svg.innerHTML = '';
    board.querySelectorAll('.frag').forEach(function (f, i) {
      var r = f.getBoundingClientRect();
      var x = r.left + r.width / 2 - b.left, y = (r.top < core.top ? r.bottom : r.top) - b.top;
      var mx = (x + cx) / 2 + (i % 2 ? 40 : -40), my = (y + cy) / 2 + (i % 3 ? -30 : 30);
      var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', 'M' + x + ' ' + y + ' Q ' + mx + ' ' + my + ' ' + cx + ' ' + cy);
      p.dataset.frag = i;
      if (f.classList.contains('dim')) p.style.opacity = 0.1;
      svg.appendChild(p);
      var len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = reduce ? 0 : len;
      p.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.2,.7,.2,1) ' + (0.15 + i * 0.08) + 's, opacity .4s';
      requestAnimationFrame(function () { requestAnimationFrame(function () { p.style.strokeDashoffset = 0; }); });
    });
  }

  // Archive filters
  document.querySelectorAll('.filters button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var kind = btn.dataset.filter;
      document.querySelectorAll('.filters button').forEach(function (b) { b.setAttribute('aria-pressed', b === btn); });
      board.querySelectorAll('.frag').forEach(function (f, i) {
        var on = kind === 'all' || f.dataset.kind === kind;
        f.classList.toggle('dim', !on);
        var p = board.querySelector('path[data-frag="' + i + '"]');
        if (p) p.style.opacity = on ? 1 : 0.1;
      });
    });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { buildThreads(); connect(); });
  window.addEventListener('load', function () { buildThreads(); connect(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { buildThreads(); connect(); });
})();
