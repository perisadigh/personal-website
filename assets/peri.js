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
        if (e.target === typed) setTimeout(typeOut, document.querySelector('.home') ? 1500 : 600);
        io.unobserve(e.target);
      });
    }, { threshold: 0.35 });
    // The eyes start clipped to a thin line, so they get a lower bar than everything else.
    var io0 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io0.unobserve(e.target); } });
    }, { threshold: 0 });
    els.forEach(function (el) { (el.classList.contains('eyes') ? io0 : io).observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  // Each page name has a photo beside it: hovering either one lights up the pair.
  var strip = document.querySelector('.page-photos');
  if (strip) {
    var pairs = document.querySelectorAll('.home [data-pv]');
    var light = function (n) {
      strip.classList.toggle('dim', !!n);
      pairs.forEach(function (el) { el.classList.toggle('hot', el.getAttribute('data-pv') === n); });
    };
    pairs.forEach(function (el) {
      var n = el.getAttribute('data-pv');
      el.addEventListener('mouseenter', function () { light(n); });
      el.addEventListener('mouseleave', function () { light(null); });
      el.addEventListener('focus', function () { light(n); });
      el.addEventListener('blur', function () { light(null); });
    });
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

  // Photo viewer: the small squares (or prev / next) change the large photo.
  document.querySelectorAll('.viewer').forEach(function (v) {
    var main = v.querySelector('.v-main'), img = main.querySelector('img'), count = v.querySelector('.v-count');
    var thumbs = v.querySelectorAll('.v-thumbs button'), n = thumbs.length, cur = 0;
    var pad = function (k) { return (k < 10 ? '0' : '') + k; };
    var show = function (k) {
      cur = (k + n) % n;
      var b = thumbs[cur];
      thumbs.forEach(function (t) { t.setAttribute('aria-pressed', t === b ? 'true' : 'false'); });
      count.textContent = pad(cur + 1) + ' / ' + pad(n);
      main.setAttribute('data-lightbox', b.getAttribute('data-src'));
      main.classList.add('swap');
      setTimeout(function () {
        img.onload = function () { main.classList.remove('swap'); };
        img.src = b.getAttribute('data-src'); img.alt = b.getAttribute('data-alt') || '';
        if (img.complete) main.classList.remove('swap');
      }, 160);
    };
    thumbs.forEach(function (b, k) { b.addEventListener('click', function () { show(k); }); });
    v.querySelector('.v-prev').addEventListener('click', function () { show(cur - 1); });
    v.querySelector('.v-next').addEventListener('click', function () { show(cur + 1); });
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

/* AI music: one track plays at a time; the button turns into a pause */
(function(){
  var PLAY='<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1l9 5-9 5z" fill="currentColor"/></svg>',
      PAUSE='<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1h3v10H2zM7 1h3v10H7z" fill="currentColor"/></svg>',
      cur=null,au=null;
  function reset(li){if(!li)return;var b=li.querySelector('.play');b.innerHTML=PLAY;b.setAttribute('aria-label','Play '+li.querySelector('.tt').textContent);li.classList.remove('on')}
  document.querySelectorAll('.tracks li[data-src]').forEach(function(li){
    var b=li.querySelector('.play');b.setAttribute('aria-label','Play '+li.querySelector('.tt').textContent);
    b.addEventListener('click',function(){
      if(cur===li&&au){if(au.paused){au.play();b.innerHTML=PAUSE;b.setAttribute('aria-label','Pause');li.classList.add('on')}else{au.pause();reset(li)}return}
      if(au){au.pause();reset(cur)}
      au=new Audio(li.dataset.src);cur=li;au.play();b.innerHTML=PAUSE;b.setAttribute('aria-label','Pause');li.classList.add('on');
      au.addEventListener('ended',function(){reset(li);cur=null;au=null});
    });
  });
})();
