/* Peri Sadigh: shared behaviour. Header colour follows the section under it, a blush fog between pages, the note in the footer settles in. */
(function(){
var d=document.documentElement,rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
function ready(f){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',f);else f()}
ready(function(){
 document.querySelectorAll('[data-year]').forEach(function(e){e.textContent=new Date().getFullYear()});
 var h=document.querySelector('header.site'),tones=[].slice.call(document.querySelectorAll('[data-tone]')),ly=0;
 function tone(){if(!h)return;var y=h.getBoundingClientRect().top+h.offsetHeight/2,c='';
  tones.forEach(function(s){var r=s.getBoundingClientRect();if(r.top<=y&&r.bottom>=y)c=s.getAttribute('data-tone')});
  h.style.setProperty('--hc',c==='dark'||c==='red'?'var(--paper)':'var(--ink)')}
 var hold=document.getElementById('open');
 function sc(){var y=scrollY,held=hold&&y<hold.offsetTop+hold.offsetHeight-innerHeight*.5;if(h&&innerWidth>760){if(held)h.classList.remove('away');else if(y>160&&y>ly+4)h.classList.add('away');else if(y<ly-4||y<160)h.classList.remove('away')}ly=y;tone()}
 addEventListener('scroll',sc,{passive:true});addEventListener('resize',tone);tone();

 /* fog between pages */
 var fog=document.createElement('div');fog.className='fog';fog.setAttribute('aria-hidden','true');document.body.appendChild(fog);
 addEventListener('pageshow',function(e){if(e.persisted)fog.classList.remove('on')});
 if(!rm)document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||a.target==='_blank')return;
  var u=new URL(a.href,location.href);if(u.origin!==location.origin||u.pathname===location.pathname||/^mailto:/.test(a.href))return;
  e.preventDefault();fog.style.opacity=0;fog.classList.add('on');void fog.offsetWidth;fog.style.opacity='';setTimeout(function(){location.href=a.href},480)});

 /* the note in the footer */
 var notes=[].slice.call(document.querySelectorAll('.end .note'));
 if(rm||!('IntersectionObserver' in window))notes.forEach(function(n){n.classList.add('in')});
 else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -12% 0px'});notes.forEach(function(n){io.observe(n)})}
});
})();
