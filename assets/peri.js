(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // the sentence, spread across the photos a few words per line
  function scatter() {
    document.querySelectorAll('[data-scatter]').forEach(function (el) {
      if (!el.dataset.text) el.dataset.text = el.textContent.trim();
      var words = el.dataset.text.split(/\s+/), html = '';
      var pattern = window.innerWidth < 760 ? [3, 3, 3, 3, 3, 2] : [4, 6, 4, 3];
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
  var lastW = window.innerWidth;
  window.addEventListener('resize', function () { if (window.innerWidth !== lastW) { lastW = window.innerWidth; scatter(); } });

  var items = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }
})();
