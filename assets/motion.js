/* Shared motion: Lenis smooth scroll (MIT, assets/lenis.min.js), a lagging cursor dot, and word-by-word scroll fills. */
(function(){
var d=document.documentElement;
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var st=document.createElement('style');
st.textContent='html.lenis,html.lenis body{height:auto}.lenis.lenis-smooth{scroll-behavior:auto!important}.lenis.lenis-stopped{overflow:hidden}'
+'.cur{position:fixed;left:0;top:0;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;background:#f6efe6;mix-blend-mode:difference;pointer-events:none;z-index:99;opacity:0;transition:width .45s cubic-bezier(.2,.7,.2,1),height .45s cubic-bezier(.2,.7,.2,1),margin .45s cubic-bezier(.2,.7,.2,1),opacity .3s}'
+'.cur.on{opacity:1}.cur.big{width:60px;height:60px;margin:-30px 0 0 -30px}'
+'.wf .wd{opacity:.18;will-change:opacity}'
+'.dvon .dev img{opacity:0}.dvc{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;z-index:1}.dev>img{position:relative}'
+'.fn{position:absolute;left:14px;top:12px;z-index:3;color:#f6efe6;font-size:.6rem;letter-spacing:.22em;text-shadow:0 0 8px rgba(0,0,0,.45);opacity:0;pointer-events:none}';
document.head.appendChild(st);
var lenis=null;
if(window.Lenis){lenis=new Lenis({lerp:.1,smoothWheel:true});window.__lenis=lenis;(function raf(t){lenis.raf(t);requestAnimationFrame(raf)})(performance.now())}

/* Develop: a photograph that develops out of blank paper. Dark tones bloom first, then mid-tones, then highlights, in blotchy patches. */
d.classList.add('dvon');
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function noiseField(W,H,seed){var rnd=mulberry(seed),out=new Float32Array(W*H),amp=1,tot=0;
 [[5,.5],[11,.3],[26,.2]].forEach(function(o){var gx=o[0],gy=Math.max(3,Math.round(o[0]*H/W)),g=new Float32Array((gx+2)*(gy+2));for(var i=0;i<g.length;i++)g[i]=rnd();
  for(var y=0;y<H;y++){var fy=y/H*gy,iy=fy|0,ty=fy-iy;ty=ty*ty*(3-2*ty);for(var x=0;x<W;x++){var fx=x/W*gx,ix=fx|0,tx=fx-ix;tx=tx*tx*(3-2*tx);
   var a=g[iy*(gx+2)+ix],b=g[iy*(gx+2)+ix+1],c=g[(iy+1)*(gx+2)+ix],e=g[(iy+1)*(gx+2)+ix+1];out[y*W+x]+=o[1]*((a+(b-a)*tx)*(1-ty)+(c+(e-c)*tx)*ty)}}});
 return out}
function seg(p,a,b){return p<=a?0:p>=b?1:(p-a)/(b-a)}
window.Develop={make:function(fig,img,seed,label){
 if(getComputedStyle(fig).position==='static')fig.style.position='relative';
 var cv=document.createElement('canvas');cv.className='dvc';cv.setAttribute('aria-hidden','true');fig.appendChild(cv);
 var fn=null;if(label){fn=document.createElement('span');fn.className='fn cap';fn.setAttribute('aria-hidden','true');fn.textContent=label+' ▸ '+label+'A';fig.appendChild(fn)}
 var ctx=cv.getContext('2d'),T,SR,SG,SB,out,W,H,ready=false,last=-1,want=0;
 function build(){var w0=img.naturalWidth,h0=img.naturalHeight;W=innerWidth<760?440:760;H=Math.round(W*h0/w0);cv.width=W;cv.height=H;
  var o=document.createElement('canvas');o.width=W;o.height=H;var oc=o.getContext('2d');oc.drawImage(img,0,0,W,H);var px=oc.getImageData(0,0,W,H).data,n=W*H;
  var nz=noiseField(W,H,seed||7);T=new Float32Array(n);SR=new Uint8Array(n);SG=new Uint8Array(n);SB=new Uint8Array(n);
  for(var i=0;i<n;i++){var r=px[i*4],g=px[i*4+1],b=px[i*4+2];SR[i]=r;SG[i]=g;SB[i]=b;var L=(.3*r+.59*g+.11*b)/255;T[i]=Math.min(1,.5*nz[i]+.5*L)}
  out=ctx.createImageData(W,H);ready=true;last=-1;set(want)}
 function set(dv){want=dv;if(!ready)return;dv=dv<0?0:dv>1?1:dv;if(Math.abs(dv-last)<.002&&dv<1&&dv>0)return;last=dv;
  if(fn)fn.style.opacity=seg(dv,.55,.9).toFixed(2);
  if(dv>=.995){img.style.opacity=1;cv.style.opacity=0;return}
  img.style.opacity=seg(dv,.9,.99).toFixed(3);cv.style.opacity=(1-seg(dv,.95,1)).toFixed(3);
  if(dv<=0){cv.style.opacity=0;return}
  var data=out.data,n=W*H,k=dv*1.25,fog=(1-dv)*.28;
  for(var i=0;i<n;i++){var a=(k-T[i])*4;a=a<0?0:a>1?1:a;var j=i*4;
   if(a<=0){data[j+3]=0;continue}
   var r=SR[i],g=SG[i],b=SB[i];data[j]=r+(242-r)*fog;data[j+1]=g+(238-g)*fog;data[j+2]=b+(231-b)*fog;data[j+3]=a*255}
  ctx.putImageData(out,0,0)}
 if(img.complete&&img.naturalWidth)build();else img.addEventListener('load',build,{once:true});
 addEventListener('resize',function(){if(ready)build()});
 return{set:set}}};
/* every [data-fn] photo develops as it scrolls into view */
var devs=[];
function bindDev(){[].slice.call(document.querySelectorAll('figure.dev[data-fn]')).forEach(function(f,i){var im=f.querySelector('img');if(!im)return;devs.push({el:f,api:Develop.make(f,im,31+i*17,f.getAttribute('data-fn'))})});if(devs.length){addEventListener('scroll',updDev,{passive:true});addEventListener('resize',updDev);updDev()}}
function updDev(){var vh=innerHeight;devs.forEach(function(o){var r=o.el.getBoundingClientRect();if(r.bottom<-80||r.top>vh+80)return;var p=(vh*.94-r.top)/(vh*.62);o.api.set(p<0?0:p>1?1:p)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindDev);else bindDev();
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
