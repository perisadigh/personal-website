(function () {
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  var root = document.documentElement;
  var motion = root.classList.contains('m');

  // Typed sentence: wrap every character so it can appear one at a time without moving the layout.
  var typed = document.querySelector('.typed');
  var chars = [];
  if (typed && motion) {
    typed.setAttribute('aria-label', typed.textContent.replace(/\s+/g, ' ').trim());
    typed.querySelectorAll(':scope > span').forEach(function (line) {
      var words = line.textContent.split(' ');
      line.textContent = '';
      line.setAttribute('aria-hidden', 'true');
      words.forEach(function (word, wi) {
        var w = document.createElement('span'); w.className = 'w';
        Array.from(word).forEach(function (c) {
          var ch = document.createElement('span'); ch.className = 'ch'; ch.textContent = c; w.appendChild(ch); chars.push(ch);
        });
        line.appendChild(w);
        if (wi < words.length - 1) { var sp = document.createElement('span'); sp.className = 'ch'; sp.textContent = ' '; line.appendChild(sp); chars.push(sp); }
      });
      chars.push(null); // pause at the end of each line
    });
    typed.classList.add('ready');
  }
  function typeOut() {
    var caret = document.createElement('span'); caret.className = 'caret'; caret.setAttribute('aria-hidden', 'true');
    var i = 0;
    (function step() {
      if (i >= chars.length) return;
      var ch = chars[i++];
      if (ch === null) { setTimeout(step, 380); return; }
      ch.classList.add('v'); ch.after(caret);
      setTimeout(step, 22 + Math.random() * 34);
    })();
  }

  // Reveal things as they scroll into view.
  var els = document.querySelectorAll('[data-in]');
  if (motion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        if (e.target === typed) setTimeout(typeOut, 600);
        io.unobserve(e.target);
      });
    }, { threshold: 0.35 });
    // The eyes start clipped to a thin line, so they get a lower bar than everything else.
    var io0 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io0.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -30% 0px' });
    els.forEach(function (el) { (el.classList.contains('eyes') ? io0 : io).observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  // Eyes drift slightly slower than the page.
  var eyes = document.querySelector('.eyes');
  if (eyes && motion) {
    var ticking = false;
    var update = function () {
      ticking = false;
      var r = eyes.getBoundingClientRect(), vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      var t = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // -1..1
      eyes.style.setProperty('--p', (-8 + t * 7).toFixed(2) + '%');
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  // The square photo previews each page while you hover its name.
  var mirror = document.querySelector('.mirror');
  if (mirror) {
    var imgs = mirror.querySelectorAll('img');
    var show = function (n) { imgs.forEach(function (im, k) { im.classList.toggle('on', k === n); }); };
    document.querySelectorAll('.stairs a[data-pv]').forEach(function (a) {
      var n = +a.getAttribute('data-pv');
      a.addEventListener('mouseenter', function () { show(n); });
      a.addEventListener('focus', function () { show(n); });
      a.addEventListener('mouseleave', function () { show(0); });
      a.addEventListener('blur', function () { show(0); });
    });
    imgs.forEach(function (im) { im.loading = 'eager'; });
  }

  // The corner index steps aside once the main list of pages is on screen.
  var index = document.querySelector('.index'), pages = document.querySelector('.pages');
  if (index && pages && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      index.classList.toggle('away', entries[0].isIntersecting);
    }, { rootMargin: '0px 0px -30% 0px' }).observe(pages);
  }

  // Two truths and a lie: pick a card, it gets tagged as your pick, then every card is stamped.
  var game = document.querySelector('.game');
  if (game) {
    var cards = game.querySelectorAll('.card');
    var status = game.querySelector('.status');
    cards.forEach(function (c) {
      c.addEventListener('click', function () {
        if (game.classList.contains('picked')) return;
        c.classList.add('chosen');
        c.setAttribute('aria-pressed', 'true');
        game.classList.add('picked');
        game.classList.toggle('right', c.hasAttribute('data-lie'));
        setTimeout(function () {
          game.classList.add('revealed');
          if (status) status.textContent = c.hasAttribute('data-lie') ? 'Correct.' : 'Not quite.';
        }, 450);
      });
    });
    game.querySelector('.again').addEventListener('click', function () {
      game.classList.remove('picked', 'revealed', 'right');
      cards.forEach(function (c) { c.classList.remove('chosen'); c.removeAttribute('aria-pressed'); });
      if (status) status.textContent = '';
      cards[0].focus();
    });
  }

  // Handwriting: once it has finished writing, drop the mask so nothing is clipped.
  document.querySelectorAll('[data-write]').forEach(function (el) {
    el.addEventListener('animationend', function () { el.classList.add('written'); });
  });

  // Photos open larger on click.
  var lb = document.querySelector('.lb');
  if (lb) {
    var lbImg = lb.querySelector('img'), lbBtn = lb.querySelector('button'), opener = null;
    var close = function () { lb.classList.remove('open'); if (opener) opener.focus(); };
    document.querySelectorAll('[data-lightbox]').forEach(function (f) {
      f.tabIndex = 0; f.setAttribute('role', 'button'); f.setAttribute('aria-label', 'Open photo');
      var open = function () { opener = f; lbImg.src = f.getAttribute('data-lightbox'); lb.classList.add('open'); lbBtn.focus(); };
      f.addEventListener('click', open);
      f.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
    lb.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.classList.contains('open')) close(); });
  }
})();
