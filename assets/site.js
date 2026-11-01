(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Load-in
  requestAnimationFrame(function () { requestAnimationFrame(function () { document.documentElement.classList.add('is-loaded'); }); });
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Header: hide on scroll down, show on scroll up
  var head = $('.site-head'), lastY = 0;
  function onScrollHead() {
    var y = window.scrollY;
    if (!head) return;
    head.classList.toggle('solid', y > 40);
    head.classList.toggle('hide', y > 200 && y > lastY && !document.body.classList.contains('menu-open'));
    lastY = y;
  }

  // Mobile menu
  var overlay = $('.overlay');
  $$('[data-menu]').forEach(function (b) {
    b.addEventListener('click', function () {
      var open = !overlay.classList.contains('open');
      overlay.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  });

  // Reveal on scroll
  var revealEls = $$('[data-reveal], .img-reveal, .love-list');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Stagger the things-I-love list
  $$('.love-list').forEach(function (list) {
    $$('.it', list).forEach(function (it, i) { it.style.transitionDelay = Math.min(i * 0.035, 1.2) + 's'; });
  });

  // Floating image peek on hover
  var peek = $('.peek'), peekImg = peek && $('img', peek), px = 0, py = 0, cx = 0, cy = 0, peekOn = false;
  if (peek && finePointer) {
    $$('[data-img]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { peekImg.src = el.getAttribute('data-img'); peek.classList.add('on'); peekOn = true; });
      el.addEventListener('mouseleave', function () { peek.classList.remove('on'); peekOn = false; });
    });
    window.addEventListener('mousemove', function (e) { px = e.clientX; py = e.clientY; });
    (function loop() {
      cx += (px - cx) * 0.16; cy += (py - cy) * 0.16;
      peek.style.left = cx + 'px'; peek.style.top = (cy - 20) + 'px';
      requestAnimationFrame(loop);
    })();
  }

  // Tilt cards
  if (finePointer && !reduce) {
    $$('.card').forEach(function (card) {
      var t = $('.tilt', card);
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        t.style.transform = 'rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg)';
      });
      card.addEventListener('mouseleave', function () { t.style.transform = ''; });
    });
  }

  // Scroll-scrubbed words
  var scrubs = $$('.scrub');
  scrubs.forEach(function (el) {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
  });
  function onScrollScrub() {
    var vh = window.innerHeight;
    scrubs.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var p = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
      p = Math.max(0, Math.min(1, p));
      var ws = $$('.w', el), n = Math.round(p * ws.length);
      ws.forEach(function (w, i) { w.classList.toggle('lit', i < n); });
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { onScrollHead(); onScrollScrub(); ticking = false; });
  }, { passive: true });
  onScrollHead(); onScrollScrub();

  // Work & Play tabs
  var tabs = $('.tabs');
  if (tabs) {
    var ind = $('.ind', tabs), btns = $$('button', tabs);
    function place(b) { ind.style.width = b.offsetWidth + 'px'; ind.style.transform = 'translateX(' + b.offsetLeft + 'px)'; }
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-filter');
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        place(b);
        $$('[data-kind]').forEach(function (el) { el.hidden = k !== 'all' && el.getAttribute('data-kind') !== k; });
      });
    });
    var start = function () { place($('[aria-pressed="true"]', tabs)); };
    window.addEventListener('load', start); window.addEventListener('resize', start); start();
  }

  // Drag-to-scroll reels
  $$('.reel').forEach(function (reel) {
    var down = false, sx = 0, sl = 0, moved = false;
    reel.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = reel.scrollLeft; });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      if (Math.abs(e.clientX - sx) > 4) { moved = true; reel.classList.add('drag'); }
      reel.scrollLeft = sl - (e.clientX - sx);
    });
    window.addEventListener('pointerup', function () { down = false; reel.classList.remove('drag'); });
    reel.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  });
  $$('[data-reel]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var reel = document.getElementById(btn.getAttribute('data-reel'));
      reel.scrollBy({ left: (btn.getAttribute('data-dir') === 'next' ? 1 : -1) * reel.clientWidth * 0.6, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  // Lightbox
  var lb = $('.lb');
  if (lb) {
    var lbImg = $('img', lb);
    $$('[data-lightbox]').forEach(function (el) {
      el.addEventListener('click', function () { lbImg.src = el.getAttribute('data-lightbox'); lbImg.alt = el.getAttribute('data-alt') || ''; lb.classList.add('open'); });
    });
    var close = function () { lb.classList.remove('open'); };
    lb.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  // Two truths and a lie
  var game = $('.game');
  if (game) {
    var box = $('.truths', game), cards = $$('.truth', game), status = $('.game-status', game);
    function shuffle() {
      cards.sort(function () { return Math.random() - 0.5; }).forEach(function (c) { box.appendChild(c); });
    }
    function reset() {
      game.classList.remove('done');
      cards.forEach(function (c) { c.disabled = false; c.classList.remove('picked'); });
      status.innerHTML = 'Pick the one you think is the lie.';
      shuffle();
    }
    cards.forEach(function (c) {
      c.addEventListener('click', function () {
        if (game.classList.contains('done')) return;
        c.classList.add('picked');
        game.classList.add('done');
        cards.forEach(function (x) { x.disabled = true; });
        status.innerHTML = (c.hasAttribute('data-lie') ? 'You got it.' : 'Not quite.') + ' <button type="button">Play again</button>';
        $('button', status).addEventListener('click', reset);
      });
    });
    reset();
  }

  // Duplicate marquee track for a seamless loop
  $$('.marquee .track').forEach(function (t) { t.innerHTML += t.innerHTML; });
})();
