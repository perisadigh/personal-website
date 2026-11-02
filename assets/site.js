(function () {
  document.documentElement.classList.add('js');
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  var els = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }

  // two truths and a lie: your pick gets circled, then everything is revealed
  function drawLoop(c) {
    var svg = c.querySelector('.loop'), path = svg.querySelector('path');
    var r = svg.getBoundingClientRect(), w = r.width, h = r.height;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    var P = function (x, y) { return (x * w).toFixed(1) + ' ' + (y * h).toFixed(1); };
    path.setAttribute('d', 'M' + P(.58, .02) + 'C' + P(.26, -.04) + ' ' + P(.01, .14) + ' ' + P(.01, .52) +
      'C' + P(.01, .92) + ' ' + P(.32, 1.03) + ' ' + P(.54, 1.0) + 'C' + P(.82, .97) + ' ' + P(.995, .82) + ' ' + P(.99, .46) +
      'C' + P(.985, .08) + ' ' + P(.7, -.03) + ' ' + P(.4, .05) + 'C' + P(.3, .08) + ' ' + P(.2, .14) + ' ' + P(.13, .22));
    var len = path.getTotalLength();
    path.style.transition = 'none';
    path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
    path.getBoundingClientRect();
    path.style.transition = ''; path.style.strokeDashoffset = 0;
  }
  var game = document.querySelector('.game');
  if (game) {
    var status = game.querySelector('.status');
    game.querySelectorAll('.claim').forEach(function (c) {
      c.addEventListener('click', function () {
        if (game.classList.contains('done')) return;
        c.classList.add('chosen');
        drawLoop(c);
        game.classList.add('done');
        status.textContent = c.hasAttribute('data-lie') ? 'You got it.' : 'Nope. That one actually happened.';
      });
    });
    game.querySelector('.again').addEventListener('click', function () {
      game.classList.remove('done');
      game.querySelectorAll('.claim').forEach(function (c) { c.classList.remove('chosen'); });
      status.textContent = '';
    });
  }

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
