/* Shared motion: Lenis smooth scroll (MIT, assets/lenis.min.js), a lagging cursor dot, and word-by-word scroll fills. */
(function(){
var d=document.documentElement;
/* page transitions (styles in assets/vt.css): the link you click to a titled page grows into its headline */
var TITLED=/(?:^|\/)(work|things-i-love|ranking)\.html$/,lastLink=null;
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');lastLink=a||null},true);
addEventListener('pageswap',function(e){if(!e.viewTransition)return;d.classList.add('vt');
 var url=e.activation&&e.activation.entry&&e.activation.entry.url,own=document.querySelector('.pt h1');if(own)own.style.viewTransitionName='none';
 try{sessionStorage.removeItem('vt-title')}catch(_){}
 if(url&&lastLink&&TITLED.test(new URL(url).pathname)&&lastLink.href.split('#')[0]===url.split('#')[0]&&!lastLink.closest('.toc')){
  var r=lastLink.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){lastLink.style.viewTransitionName='title';lastLink.style.color=getComputedStyle(d).getPropertyValue('--ink')||'#1c1b19';try{sessionStorage.setItem('vt-title','1')}catch(_){}}}});
addEventListener('pagereveal',function(e){if(!e.viewTransition)return;d.classList.add('vt');var t=null;try{t=sessionStorage.getItem('vt-title');sessionStorage.removeItem('vt-title')}catch(_){}
 var h=t&&document.querySelector('.pt h1');if(h){h.style.viewTransitionName='title';d.classList.add('vt-morph')}
 e.viewTransition.finished.finally(function(){d.classList.remove('vt','vt-morph');if(h)h.style.viewTransitionName=''})});
/* coming back with the browser's back button: put the page back as it was */
addEventListener('pageshow',function(e){if(e.persisted){d.classList.remove('vt');document.querySelectorAll('[style*="view-transition-name"]').forEach(function(x){x.style.viewTransitionName='';x.style.color=''})}});
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var st=document.createElement('style');
st.textContent='html.lenis,html.lenis body{height:auto}.lenis.lenis-smooth{scroll-behavior:auto!important}.lenis.lenis-stopped{overflow:hidden}'
+'.cur{position:fixed;left:0;top:0;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;background:#f6efe6;mix-blend-mode:difference;pointer-events:none;z-index:99;opacity:0;transition:width .45s cubic-bezier(.2,.7,.2,1),height .45s cubic-bezier(.2,.7,.2,1),margin .45s cubic-bezier(.2,.7,.2,1),opacity .3s}'
+'.cur.on{opacity:1}.cur.big{width:60px;height:60px;margin:-30px 0 0 -30px}'
+'.wf .wd{opacity:.18;will-change:opacity}'
+'.js [data-unmask]{clip-path:inset(calc(var(--u,1)*100% - 1px) 0 0 0)}'
+'.js .sm-ph img{opacity:1!important;transform:translate3d(0,var(--py,0px),0) scale(1.14)!important;transition:none!important;will-change:transform}'
+'[data-grow]{transform-origin:50% 100%;will-change:transform}[data-recede]{will-change:transform,opacity}';
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
/* scroll-linked motion: tied to the scroll position itself, so it moves only while you scroll and runs backwards when you scroll up.
   [data-unmask] the photo is uncovered from the bottom edge up as it rises into view, and drifts slower than the page inside its frame
   [data-drift="n"] the photo drifts inside its frame (n = speed, default .06)
   [data-float="n"] the whole element drifts against the page (n = speed, can be negative)
   [data-spread] each line of the headline eases sideways, alternating, as it passes
   [data-recede] the page title lifts away and fades as you scroll past it
   [data-grow] the frame grows from a slightly smaller size to full as it comes into view */
var sm=[],wide=matchMedia('(min-width:761px)');
function smSetup(){
 [].forEach.call(document.querySelectorAll('[data-unmask],[data-drift],[data-float],[data-spread],[data-recede],[data-grow]'),function(el){
  var o={el:el,img:el.querySelector('img'),u:el.hasAttribute('data-unmask'),dr:el.hasAttribute('data-drift')||el.hasAttribute('data-unmask')?(+el.getAttribute('data-drift')||.06):0,
   fl:el.hasAttribute('data-float')?(+el.getAttribute('data-float')||.06):0,sp:el.hasAttribute('data-spread')?[].slice.call(el.querySelectorAll('.ln')):null,rc:el.hasAttribute('data-recede'),gr:el.hasAttribute('data-grow')};
  if(o.u||o.dr)el.classList.add('sm-ph');sm.push(o)});
 if(!sm.length)return;addEventListener('scroll',smKick,{passive:true});addEventListener('resize',smKick);addEventListener('load',smKick);smDraw()}
var smRaf=0;function smKick(){if(!smRaf)smRaf=requestAnimationFrame(function(){smRaf=0;smDraw()})}
function cl(v){return v<0?0:v>1?1:v}
function smDraw(){var vh=innerHeight,big=wide.matches;sm.forEach(function(o){var el=o.el;
 if(o.rc){var y=scrollY;if(y>vh*1.2)return;var k=cl(y/(vh*.8));el.style.transform='translate3d(0,'+(y*.22).toFixed(1)+'px,0)';el.style.opacity=(1-k*.85).toFixed(3);return}
 var r=el.getBoundingClientRect();if(r.bottom<-vh*.3||r.top>vh*1.3)return;
 var c=(r.top+r.height/2-vh/2)/vh; /* 0 when centred, +/-1 a screen away */
 if(o.u){var p=cl((vh-r.top)/(Math.min(r.height,vh)*.85));p=1-Math.pow(1-p,3);el.style.setProperty('--u',(1-p).toFixed(4))}
 if(o.dr&&o.img)o.img.style.setProperty('--py',(c*-o.dr*vh).toFixed(1)+'px');
 if(o.fl&&big)el.style.translate='0 '+(c*-o.fl*vh).toFixed(1)+'px';
 if(o.sp&&big)o.sp.forEach(function(l,i){l.style.translate=((i%2?1:-1)*c*-2.2).toFixed(2)+'vw 0'});
 if(o.gr){var g=cl((vh-r.top)/(vh*.9));g=1-Math.pow(1-g,3);el.style.transform='scale('+(.9+.1*g).toFixed(4)+')'}})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',smSetup);else smSetup();
})();
