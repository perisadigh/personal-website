(function () {
  // year
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // reveal on scroll
  var els = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }

  // two truths and a lie
  var game = document.querySelector('.game');
  if (game) {
    var status = game.querySelector('.game-status');
    game.querySelectorAll('.truth button').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = b.closest('.truth');
        game.classList.add('done');
        status.textContent = t.hasAttribute('data-lie') ? 'You got it.' : 'Nope. That one actually happened.';
      });
    });
  }

  // things I love: a small photo follows the pointer over some items
  var peek = document.querySelector('.peek');
  if (peek && window.matchMedia('(hover:hover)').matches) {
    var img = peek.querySelector('img');
    document.querySelectorAll('[data-img]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { img.src = el.getAttribute('data-img'); peek.classList.add('on'); });
      el.addEventListener('mouseleave', function () { peek.classList.remove('on'); });
      el.addEventListener('mousemove', function (e) {
        var w = peek.offsetWidth, h = peek.offsetHeight || w * 1.3;
        var x = Math.min(e.clientX + 24, window.innerWidth - w - 12);
        var y = Math.min(Math.max(e.clientY - h / 2, 12), window.innerHeight - h - 12);
        peek.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
    });
  }

  // lightbox
  var lb = document.querySelector('.lb');
  if (lb) {
    var lbImg = lb.querySelector('img');
    document.querySelectorAll('[data-lightbox]').forEach(function (f) {
      f.addEventListener('click', function () {
        lbImg.src = f.getAttribute('data-lightbox');
        lbImg.alt = (f.querySelector('img') || {}).alt || '';
        lb.classList.add('open');
      });
    });
    lb.addEventListener('click', function () { lb.classList.remove('open'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('open'); });
  }
})();
