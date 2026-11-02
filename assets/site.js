(function () {
  var root = document.documentElement;
  root.classList.add('js');

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // gentle reveal; anything already on screen shows straight away
  var els = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }
  setTimeout(function () { els.forEach(function (el) { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in'); }); }, 60);

  // home: hovering a link swaps the portrait for a photo from that page
  var hp = document.querySelector('.home-photo');
  if (hp) {
    var cap = hp.querySelector('.cap');
    document.querySelectorAll('[data-swap]').forEach(function (a) {
      var img = hp.querySelector('img[data-for="' + a.getAttribute('data-swap') + '"]');
      if (!img) return;
      var on = function () { img.classList.add('on'); hp.classList.add('swapped'); cap.textContent = a.getAttribute('data-label') || ''; };
      var off = function () { img.classList.remove('on'); hp.classList.remove('swapped'); };
      a.addEventListener('mouseenter', on); a.addEventListener('focus', on);
      a.addEventListener('mouseleave', off); a.addEventListener('blur', off);
    });
  }

  // two truths and a lie
  var game = document.querySelector('.game');
  if (game) {
    var status = game.querySelector('.status');
    game.querySelectorAll('.card').forEach(function (c) {
      c.addEventListener('click', function () {
        if (game.classList.contains('done')) return;
        c.classList.add('chosen');
        game.classList.add('done');
        status.textContent = c.hasAttribute('data-lie') ? 'You got it.' : 'Nope. That one actually happened.';
      });
    });
    game.querySelector('.again').addEventListener('click', function () {
      game.classList.remove('done');
      game.querySelectorAll('.card').forEach(function (c) { c.classList.remove('chosen'); });
      status.textContent = '';
    });
  }

  // things I love: a small photo follows the pointer over some items
  var peek = document.querySelector('.peek');
  if (peek && window.matchMedia('(hover:hover)').matches) {
    var pimg = peek.querySelector('img');
    document.querySelectorAll('[data-img]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { pimg.src = el.getAttribute('data-img'); peek.classList.add('on'); });
      el.addEventListener('mouseleave', function () { peek.classList.remove('on'); });
      el.addEventListener('mousemove', function (e) {
        var w = peek.offsetWidth, h = peek.offsetHeight || w * 1.3;
        var x = Math.min(e.clientX + 24, innerWidth - w - 12);
        var y = Math.min(Math.max(e.clientY - h / 2, 12), innerHeight - h - 12);
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
