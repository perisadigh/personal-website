/* Shared motion: Lenis smooth scroll (MIT, assets/lenis.min.js), a lagging cursor dot, and word-by-word scroll fills. */
(function(){
var d=document.documentElement;
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var st=document.createElement('style');
st.textContent='html.lenis,html.lenis body{height:auto}.lenis.lenis-smooth{scroll-behavior:auto!important}.lenis.lenis-stopped{overflow:hidden}'
+'.cur{position:fixed;left:0;top:0;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;background:#f6efe6;mix-blend-mode:difference;pointer-events:none;z-index:99;opacity:0;transition:width .45s cubic-bezier(.2,.7,.2,1),height .45s cubic-bezier(.2,.7,.2,1),margin .45s cubic-bezier(.2,.7,.2,1),opacity .3s}'
+'.cur.on{opacity:1}.cur.big{width:60px;height:60px;margin:-30px 0 0 -30px}'
+'.wf .wd{opacity:.18;will-change:opacity}';
document.head.appendChild(st);
var lenis=null;
if(window.Lenis){lenis=new Lenis({lerp:.1,smoothWheel:true});window.__lenis=lenis;(function raf(t){lenis.raf(t);requestAnimationFrame(raf)})(performance.now())}
/* cursor dot that trails the pointer, swelling over anything clickable */
if(matchMedia('(pointer:fine)').matches){
 var c=document.createElement('div');c.className='cur';c.setAttribute('aria-hidden','true');(function put(){if(document.body)document.body.appendChild(c);else document.addEventListener('DOMContentLoaded',put)})();
 var x=-100,y=-100,cx=x,cy=y,seen=false;
 addEventListener('mousemove',function(e){x=e.clientX;y=e.clientY;if(!seen){seen=true;cx=x;cy=y;c.classList.add('on')}},{passive:true});
 document.addEventListener('mouseleave',function(){c.classList.remove('on');seen=false});
 document.addEventListener('mouseover',function(e){c.classList.toggle('big',!!(e.target.closest&&e.target.closest('a,button,.card,[data-cursor]')))});
 (function loop(){cx+=(x-cx)*.18;cy+=(y-cy)*.18;c.style.transform='translate3d('+cx.toFixed(1)+'px,'+cy.toFixed(1)+'px,0)';requestAnimationFrame(loop)})();
}
/* [data-fill]: words brighten in reading order as the paragraph passes through the screen */
var fills=[];
function setup(){fills=[].slice.call(document.querySelectorAll('[data-fill]'));if(!fills.length)return;fills.forEach(function(el){var words=el.textContent.trim().split(/\s+/);el.setAttribute('aria-label',el.textContent.trim());el.classList.add('wf');
 el.innerHTML=words.map(function(w){return'<span class="wd" aria-hidden="true">'+w+'</span>'}).join(' ');el._w=[].slice.call(el.querySelectorAll('.wd'))});addEventListener('scroll',fill,{passive:true});addEventListener('resize',fill);fill()}
function fill(){var vh=innerHeight;fills.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<-50||r.top>vh+50)return;
 var p=(vh*.88-r.top)/(r.height+vh*.28);p=p<0?0:p>1?1:p;var n=el._w.length,soft=5;
 for(var i=0;i<n;i++){var t=(p*(n+soft)-i)/soft;t=t<0?0:t>1?1:t;el._w[i].style.opacity=(.18+.82*t).toFixed(3)}})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
