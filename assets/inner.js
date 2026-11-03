/* Peri: motion and small behaviours for the inner pages */
(function(){
var d=document.documentElement,rm=matchMedia('(prefers-reduced-motion: reduce)').matches,small=matchMedia('(max-width:760px)').matches;
document.querySelectorAll('[data-year]').forEach(function(e){e.textContent=new Date().getFullYear()});
requestAnimationFrame(function(){requestAnimationFrame(function(){d.classList.add('go')})});

/* things come into view once, a little before they are fully on screen, and an image only starts to appear when it has loaded */
var seen=[].slice.call(document.querySelectorAll('.fd,.stag,.plot,.bloom')),rv=[].slice.call(document.querySelectorAll('.rv')),hi=[].slice.call(document.querySelectorAll('.hello .hi'));
[].forEach.call(document.querySelectorAll('img[loading=lazy]'),function(i){i.loading='eager'});
var ready=function(el,cb){var im=el.querySelector('img');if(!im||(im.complete&&im.naturalWidth)){cb();return}var d=0,f=function(){if(!d){d=1;cb()}};im.addEventListener('load',f,{once:true});im.addEventListener('error',f,{once:true});setTimeout(f,1200)};
if(rm||!('IntersectionObserver' in window)){seen.concat(rv,hi).forEach(function(e){e.classList.add('in')})}
else{
 var opt={threshold:0,rootMargin:'0px 0px -4% 0px'};
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},opt);
 seen.forEach(function(e){io.observe(e)});
 /* clipped elements can't be observed directly, so watch their parent */
 var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){[].forEach.call(e.target.querySelectorAll(':scope > .rv'),function(x){ready(x,function(){x.classList.add('in')})});io2.unobserve(e.target)}})},opt);
 rv.forEach(function(e){io2.observe(e.parentElement)});
 /* handwriting is written as soon as it is in view */
 if(hi.length){var chk=function(){hi=hi.filter(function(h){if(h.getBoundingClientRect().top<innerHeight*.92){h.classList.add('in');return false}return true});if(!hi.length)removeEventListener('scroll',chk)};addEventListener('scroll',chk,{passive:true});chk()}
}

/* the video gets a plate-style play button until it is first played */
document.querySelectorAll('.vid .vp').forEach(function(vp){var v=vp.querySelector('video');if(!v)return;
 var b=document.createElement('button');b.type='button';b.className='big';b.setAttribute('aria-label','Play video');
 b.innerHTML='<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 0.5v9l8-4.5z" fill="currentColor"/></svg>';vp.appendChild(b);
 v.controls=false;b.addEventListener('click',function(){v.controls=true;v.play()});v.addEventListener('play',function(){b.hidden=true;v.controls=true});v.addEventListener('ended',function(){b.hidden=false})});

/* photos open as the film frame itself; arrows, keys and swipes move along the roll */
var lb=document.querySelector('.lb');
if(lb){var li=lb.querySelector('img'),lbtn=lb.querySelector('button'),opener=null,items=[].slice.call(document.querySelectorAll('[data-lightbox]')),cur=-1,tx=0,
  mk=function(c,t,l){var b=document.createElement('button');b.type='button';b.className=c;b.textContent=t;b.setAttribute('aria-label',l);lb.appendChild(b);return b},
  prev=mk('lbp','\u2039','Previous photo'),next=mk('lbx','\u203a','Next photo'),cnt=document.createElement('span');
 cnt.className='lbn cap';lb.appendChild(cnt);
 var many=items.length>1;if(!many){prev.hidden=next.hidden=cnt.hidden=true}
 var close=function(){lb.classList.remove('open');if(opener)opener.focus()};
 var show=function(i,quiet){cur=(i+items.length)%items.length;var f=items[cur],im=f.querySelector('img');
  li.alt=f.getAttribute('data-alt')||(im?im.alt:'');li.src=f.getAttribute('data-lightbox');
  cnt.textContent=('0'+(cur+1)).slice(-2)+' / '+('0'+items.length).slice(-2);
  if(!quiet){li.classList.remove('sw');void li.offsetWidth;li.classList.add('sw')}};
 items.forEach(function(f,i){f.tabIndex=0;f.setAttribute('role','button');f.setAttribute('aria-label',f.getAttribute('data-alt')||'Open photo');
  var open=function(){opener=f;show(i,true);lb.classList.add('open');lbtn.focus()};
  f.addEventListener('click',open);f.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})});
 lb.addEventListener('click',function(e){if(e.target===prev||e.target===next)return;close()});
 prev.addEventListener('click',function(){show(cur-1)});next.addEventListener('click',function(){show(cur+1)});
 document.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;
  if(e.key==='Escape')close();else if(many&&e.key==='ArrowRight'){e.preventDefault();show(cur+1)}else if(many&&e.key==='ArrowLeft'){e.preventDefault();show(cur-1)}});
 lb.addEventListener('touchstart',function(e){tx=e.changedTouches[0].clientX},{passive:true});
 lb.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-tx;if(many&&Math.abs(dx)>50){e.preventDefault();show(cur+(dx<0?1:-1))}});
 /* the next photo is already warm in the cache by the time it is asked for */
 lb.addEventListener('transitionend',function(){if(many&&lb.classList.contains('open')){[cur+1,cur-1].forEach(function(j){var k=items[(j+items.length)%items.length];(new Image).src=k.getAttribute('data-lightbox')})}})}

/* the contact sheet is pinned: the page holds while three strips slide through in opposite directions */
var pin=document.getElementById('people'),cs=document.querySelector('.csheet');
if(pin&&cs&&!rm){pin.classList.add('live');var rws=[].slice.call(cs.querySelectorAll('.rw')).map(function(w){var r=w.querySelector('.crow');return{w:w,r:r,d:+r.getAttribute('data-dir'),cur:null,tgt:0}}),raf2=0,mxx=0;
 function sizep(){mxx=0;rws.forEach(function(o){o.mx=Math.max(0,o.r.offsetWidth-o.w.offsetWidth);mxx=Math.max(mxx,o.mx)});pin.style.height=Math.round(innerHeight+mxx*1.15+innerHeight*.25)+'px'}
 var lt=0;
 function stepc(t){raf2=0;var dt=lt?Math.min(50,t-lt):16.7,k=1-Math.pow(1-.2,dt/16.7);lt=t;var busy=false;rws.forEach(function(o){o.cur+=(o.tgt-o.cur)*k;if(Math.abs(o.tgt-o.cur)<.3)o.cur=o.tgt;else busy=true;o.r.style.setProperty('--tx',o.cur.toFixed(2)+'px')});if(busy)raf2=requestAnimationFrame(stepc);else lt=0}
 function calc(){var b=pin.getBoundingClientRect(),p=Math.min(1,Math.max(0,-b.top/Math.max(1,b.height-innerHeight)));p=Math.min(1,Math.max(0,(p-.05)/.9));rws.forEach(function(o){o.tgt=(o.d>0?-p:-(1-p))*o.mx;if(o.cur===null)o.cur=o.tgt});if(!raf2)raf2=requestAnimationFrame(stepc)}
 function all(){sizep();calc()}
 addEventListener('scroll',calc,{passive:true});addEventListener('resize',all);addEventListener('load',all);all()}

/* the portraits: pinned, sliding sideways */
var rail=document.querySelector('.prail');
if(rail&&!rm&&!small){var track=rail.querySelector('.track'),figs=[].slice.call(rail.querySelectorAll('.pf')),cnt=rail.querySelector('.count'),bar=rail.querySelector('.bar i'),dist=0,cur=0,tgt=0,raf=0;
 function size(){dist=Math.max(0,track.scrollWidth-innerWidth);rail.style.height=(dist+innerHeight)+'px'}
 function read(){var r=rail.getBoundingClientRect();tgt=Math.min(1,Math.max(0,-r.top/Math.max(1,r.height-innerHeight)));if(!raf)raf=requestAnimationFrame(tick)}
 var pt=0;
 function tick(t){raf=0;var dt=pt?Math.min(50,t-pt):16.7,k=1-Math.pow(1-.17,dt/16.7);pt=t;cur+=(tgt-cur)*k;if(Math.abs(tgt-cur)<.0004)cur=tgt;
  track.style.transform='translate3d('+(-cur*dist).toFixed(1)+'px,0,0)';bar.style.setProperty('--p',cur.toFixed(4));
  var best=0,bd=1e9,c=innerWidth/2,ms=figs.map(function(f){var b=f.getBoundingClientRect();return b.left+b.width/2});ms.forEach(function(m,i){figs[i].querySelector('img').style.setProperty('--px',(((m-c)/innerWidth)*-9).toFixed(2)+'%');if(Math.abs(m-c)<bd){bd=Math.abs(m-c);best=i}});
  cnt.textContent=('0'+(best+1)).slice(-2)+' / 0'+figs.length;
  if(cur!==tgt)raf=requestAnimationFrame(tick);else pt=0}
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
