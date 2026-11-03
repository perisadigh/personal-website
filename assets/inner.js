/* Peri: motion and small behaviours for the inner pages */
(function(){
var d=document.documentElement,rm=matchMedia('(prefers-reduced-motion: reduce)').matches,small=matchMedia('(max-width:760px)').matches;
document.querySelectorAll('[data-year]').forEach(function(e){e.textContent=new Date().getFullYear()});
requestAnimationFrame(function(){requestAnimationFrame(function(){d.classList.add('go')})});

/* things come into view once: plates open, rows settle, script is written */
var seen=[].slice.call(document.querySelectorAll('.fd,.stag,.plot')),rv=[].slice.call(document.querySelectorAll('.rv')),hi=[].slice.call(document.querySelectorAll('.hello .hi'));
if(rm||!('IntersectionObserver' in window)){seen.concat(rv,hi).forEach(function(e){e.classList.add('in')})}
else{
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.2});
 seen.forEach(function(e){io.observe(e)});
 /* clipped elements can't be observed directly, so watch their parent */
 var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){[].forEach.call(e.target.querySelectorAll(':scope > .rv,:scope > .hi'),function(x){x.classList.add('in')});io2.unobserve(e.target)}})},{threshold:.2});
 rv.concat(hi).forEach(function(e){io2.observe(e.parentElement)});
}

/* photos open as the film frame itself */
var lb=document.querySelector('.lb');
if(lb){var li=lb.querySelector('img'),lbtn=lb.querySelector('button'),opener=null;
 var close=function(){lb.classList.remove('open');if(opener)opener.focus()};
 document.querySelectorAll('[data-lightbox]').forEach(function(f){f.tabIndex=0;f.setAttribute('role','button');f.setAttribute('aria-label',f.getAttribute('data-alt')||'Open photo');
  var open=function(){opener=f;var im=f.querySelector('img');li.alt=f.getAttribute('data-alt')||(im?im.alt:'');li.src=f.getAttribute('data-lightbox');lb.classList.add('open');lbtn.focus()};
  f.addEventListener('click',open);f.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})});
 lb.addEventListener('click',close);document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lb.classList.contains('open'))close()})}

/* the contact sheet: each strip slides sideways as you scroll past it, in alternating directions */
var cs=document.querySelector('.csheet');
if(cs&&!rm){cs.classList.add('live');var rws=[].slice.call(cs.querySelectorAll('.rw')).map(function(w){var r=w.querySelector('.crow');return{w:w,r:r,d:+r.getAttribute('data-dir'),cur:null,tgt:0}}),raf2=0;
 function stepc(){raf2=0;var busy=false;rws.forEach(function(o){o.cur+=(o.tgt-o.cur)*.11;if(Math.abs(o.tgt-o.cur)<.4)o.cur=o.tgt;else busy=true;o.r.style.setProperty('--tx',o.cur.toFixed(1)+'px')});if(busy)raf2=requestAnimationFrame(stepc)}
 function calc(){var vh=innerHeight;rws.forEach(function(o){var b=o.w.getBoundingClientRect(),p=Math.min(1,Math.max(0,(vh-b.top)/(vh+b.height))),mx=Math.max(0,o.r.offsetWidth-o.w.offsetWidth);o.tgt=(o.d>0?-p:-(1-p))*mx;if(o.cur===null)o.cur=o.tgt});if(!raf2)raf2=requestAnimationFrame(stepc)}
 addEventListener('scroll',calc,{passive:true});addEventListener('resize',calc);addEventListener('load',calc);calc()}

/* the portraits: pinned, sliding sideways */
var rail=document.querySelector('.prail');
if(rail&&!rm&&!small){var track=rail.querySelector('.track'),figs=[].slice.call(rail.querySelectorAll('.pf')),cnt=rail.querySelector('.count'),bar=rail.querySelector('.bar i'),dist=0,cur=0,tgt=0,raf=0;
 function size(){dist=Math.max(0,track.scrollWidth-innerWidth);rail.style.height=(dist+innerHeight)+'px'}
 function read(){var r=rail.getBoundingClientRect();tgt=Math.min(1,Math.max(0,-r.top/Math.max(1,r.height-innerHeight)));if(!raf)raf=requestAnimationFrame(tick)}
 function tick(){raf=0;cur+=(tgt-cur)*.085;if(Math.abs(tgt-cur)<.0004)cur=tgt;
  track.style.transform='translate3d('+(-cur*dist).toFixed(1)+'px,0,0)';bar.style.setProperty('--p',cur.toFixed(4));
  var best=0,bd=1e9,c=innerWidth/2;figs.forEach(function(f,i){var b=f.getBoundingClientRect(),m=b.left+b.width/2;f.querySelector('img').style.setProperty('--px',(((m-c)/innerWidth)*-9).toFixed(2)+'%');if(Math.abs(m-c)<bd){bd=Math.abs(m-c);best=i}});
  cnt.textContent=('0'+(best+1)).slice(-2)+' / 0'+figs.length;
  if(cur!==tgt)raf=requestAnimationFrame(tick)}
 size();read();addEventListener('scroll',read,{passive:true});addEventListener('resize',function(){size();read()});addEventListener('load',function(){size();read()})}
})();

/* AI music: one track plays at a time; the button turns into a pause */
(function(){
var PLAY='<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1l9 5-9 5z" fill="currentColor"/></svg>',PAUSE='<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1h3v10H2zM7 1h3v10H7z" fill="currentColor"/></svg>',cur=null,au=null;
function reset(li){if(!li)return;var b=li.querySelector('.play');b.innerHTML=PLAY;b.setAttribute('aria-label','Play '+li.querySelector('.tt').textContent);li.classList.remove('on')}
document.querySelectorAll('.tracks li[data-src]').forEach(function(li){var b=li.querySelector('.play');b.setAttribute('aria-label','Play '+li.querySelector('.tt').textContent);
 b.addEventListener('click',function(){
  if(cur===li&&au){if(au.paused){au.play();b.innerHTML=PAUSE;b.setAttribute('aria-label','Pause');li.classList.add('on')}else{au.pause();reset(li)}return}
  if(au){au.pause();reset(cur)}
  au=new Audio(li.dataset.src);cur=li;au.play();b.innerHTML=PAUSE;b.setAttribute('aria-label','Pause');li.classList.add('on');
  au.addEventListener('ended',function(){reset(li);cur=null;au=null})})})
})();

;(function(){var h=document.querySelector('header'),ly=0;if(!h)return;addEventListener('scroll',function(){var y=scrollY;if(innerWidth>760){if(y>140&&y>ly+4)h.classList.add('away');else if(y<ly-4||y<140)h.classList.remove('away')}ly=y},{passive:true})})();
