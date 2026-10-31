(()=>{const d=document,root=d.documentElement,b=d.body;b.classList.remove('nojs');b.classList.add('js');
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;if(RM)b.classList.add('rm');

/* ---------- red lights (remembered across pages) ---------- */
const lb=d.getElementById('lights');
const setLights=red=>{red?root.setAttribute('data-lights','red'):root.removeAttribute('data-lights');if(lb)lb.setAttribute('aria-pressed',String(red));
 try{red?localStorage.setItem('lights','red'):localStorage.removeItem('lights');}catch(e){}readPalette();};
if(lb){lb.hidden=false;lb.setAttribute('aria-pressed',String(root.getAttribute('data-lights')==='red'));
 lb.onclick=()=>setLights(lb.getAttribute('aria-pressed')!=='true');}

/* ---------- palette for the canvas, read from the CSS tokens ---------- */
const P={};
const hex=v=>{v=v.trim().replace('#','');if(v.length===3)v=v.replace(/./g,'$&$&');const n=parseInt(v,16);return[n>>16&255,n>>8&255,n&255];};
function readPalette(){const cs=getComputedStyle(root);['night','sea','foam','lamp'].forEach(k=>P[k]=hex(cs.getPropertyValue('--'+k)));}
const rgba=(c,a)=>`rgba(${c[0]},${c[1]},${c[2]},${a})`;
const mix=(a,c,t)=>[0,1,2].map(i=>Math.round(a[i]+(c[i]-a[i])*t));
readPalette();

/* ---------- International Morse ---------- */
const M={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.','.':'.-.-.-',',':'--..--','?':'..--..','/':'-..-.'};

/* ---------- hero: sea, stars, signal lamp keying a message ---------- */
const cv=d.getElementById('sea');
if(cv){
 const ctx=cv.getContext('2d'),disp=d.getElementById('morse')||d.createElement('div'),statusEl=d.getElementById('status')||d.createElement('div'),form=d.getElementById('sendf'),msgIn=d.getElementById('msg'),snd=d.getElementById('snd');
 const U=130;let W=0,H=0,stars=[],visible=true,lit=0,target=0,lastOn=0,cur,t0=null,rest=0,ei=0,auto=!RM,last=0;
 const build=text=>{const clean=text.toUpperCase().replace(/[^A-Z0-9 .,?\/]/g,'').replace(/\s+/g,' ').trim();disp.textContent='';
  const ev=[];let t=0;const words=clean.split(' ').filter(Boolean);
  words.forEach((w,wi)=>{const wd=d.createElement('span');wd.className='word';
   [...w].forEach((ch,ci)=>{const code=M[ch];if(!code)return;const l=d.createElement('span');l.className='ltr';
    const lab=d.createElement('b');lab.textContent=ch;l.append(lab);const sy=d.createElement('span');sy.className='syms';
    [...code].forEach((s,si)=>{const e=d.createElement('i');e.className=s==='.'?'dot':'dash';sy.append(e);const du=s==='.'?1:3;ev.push({s:t,e:t+du,el:e});t+=du;if(si<code.length-1)t+=1;});
    l.append(sy);wd.append(l);if(ci<w.length-1)t+=3;});
   disp.append(wd);if(wi<words.length-1)t+=7;});
  return{ev,total:t,clean};};
 cur=build(cv.dataset.msg||'WATCH');
 if(RM)statusEl.textContent=form?'Lamp idle. Press Transmit to send a signal.':'';
 /* optional sound, only after the visitor ticks the box */
 let ac=null,gn=null;
 if(snd)snd.addEventListener('change',()=>{if(!snd.checked)return;
  try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();
   if(!gn){const o=ac.createOscillator();gn=ac.createGain();o.type='sine';o.frequency.value=620;gn.gain.value=0;o.connect(gn);gn.connect(ac.destination);o.start();}}
  catch(e){snd.checked=false;}});
 const tone=on=>{if(gn&&snd&&snd.checked&&ac)gn.gain.setTargetAtTime(on?0.06:0,ac.currentTime,0.006);};
 if(form)form.addEventListener('submit',e=>{e.preventDefault();const bld=build(msgIn.value);
  if(!bld.ev.length){statusEl.textContent='Use letters, numbers, spaces, or . , ? /';return;}
  cur=bld;t0=performance.now();ei=0;auto=true;});
 const size=()=>{const r=cv.getBoundingClientRect(),dp=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;cv.width=Math.round(W*dp);cv.height=Math.round(H*dp);ctx.setTransform(dp,0,0,dp,0,0);
  const n=Math.round(W*H/5200);stars=[];for(let i=0;i<n;i++)stars.push({x:Math.random()*W,y:Math.random()*H*.6,r:Math.random()*1.1+.25,p:Math.random()*6.28,s:.5+Math.random()*1.5});};
 const draw=now=>{const hz=H*.6,tt=RM?0:now/1000;
  let g=ctx.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(P.night,1));g.addColorStop(1,rgba(mix(P.night,P.sea,.85),1));ctx.fillStyle=g;ctx.fillRect(0,0,W,hz+1);
  for(const s of stars){const a=.25+.55*(.5+.5*Math.sin(tt*s.s+s.p))*(1-s.y/hz*.5);ctx.fillStyle=rgba(P.foam,a);ctx.fillRect(s.x,s.y,s.r,s.r);}
  g=ctx.createLinearGradient(0,hz,0,H);g.addColorStop(0,rgba(mix(P.sea,P.night,.2),1));g.addColorStop(1,rgba(P.night,1));ctx.fillStyle=g;ctx.fillRect(0,hz,W,H-hz);
  g=ctx.createLinearGradient(0,hz-60,0,hz+2);g.addColorStop(0,rgba(P.foam,0));g.addColorStop(1,rgba(P.foam,.07));ctx.fillStyle=g;ctx.fillRect(0,hz-60,W,62);
  const NR=22,lx=W*(W<640?.7:.74);
  for(let r=0;r<NR;r++){const k=r/NR,y=hz+Math.pow(k,1.9)*(H-hz)+2,amp=.4+k*5,fr=.012-k*.006;ctx.beginPath();
   for(let x=0;x<=W;x+=8){const yy=y+Math.sin(x*fr*(1+r*.05)+tt*(.5+k)+r*1.7)*amp;x?ctx.lineTo(x,yy):ctx.moveTo(x,yy);}
   ctx.strokeStyle=rgba(P.foam,.05+k*.07);ctx.lineWidth=1;ctx.stroke();
   if(lit>.02){const jx=Math.sin(tt*1.3+r*2.1)*(2+k*14),wd=4+k*70*(.6+.4*Math.sin(tt*2+r));ctx.fillStyle=rgba(P.lamp,lit*.55*(1-k)*(.5+.5*Math.sin(tt*3+r*1.3)));ctx.fillRect(lx+jx-wd/2,y-1,wd,1.6+k*2);}}
  const ly=hz-5;ctx.fillStyle=rgba(mix(P.night,P.sea,.4),1);ctx.fillRect(lx-26,hz-5,52,5);ctx.fillRect(lx-12,hz-10,16,5);ctx.fillRect(lx+6,hz-13,3,8);
  const rad=14+lit*150;g=ctx.createRadialGradient(lx,ly,0,lx,ly,rad);g.addColorStop(0,rgba(P.lamp,.25+lit*.75));g.addColorStop(.18,rgba(P.lamp,lit*.45));g.addColorStop(1,rgba(P.lamp,0));
  ctx.fillStyle=g;ctx.fillRect(lx-rad,ly-rad,rad*2,rad*2);ctx.fillStyle=rgba(P.lamp,.35+lit*.65);ctx.beginPath();ctx.arc(lx,ly,2.2,0,6.283);ctx.fill();};
 const frame=now=>{requestAnimationFrame(frame);if(!visible)return;const dt=Math.min(now-(last||now),100);last=now;
  if(t0!==null){const el=(now-t0)/U;let on=false;
   while(ei<cur.ev.length&&el>=cur.ev[ei].e){cur.ev[ei].el.classList.remove('on');ei++;}
   if(ei<cur.ev.length&&el>=cur.ev[ei].s){on=true;cur.ev[ei].el.classList.add('on');}
   target=on?1:0;if(form)statusEl.textContent='Transmitting '+cur.clean;
   if(el>cur.total+2){t0=null;rest=now+4200;target=0;if(form)statusEl.textContent='Lamp idle';}}
  else{target=0;if(auto&&rest&&now>rest&&cur.ev.length){t0=now;ei=0;rest=0;}}
  if(target!==lastOn){tone(!!target);lastOn=target;}
  lit+=(target-lit)*(1-Math.exp(-dt/28));draw(now);};
 size();addEventListener('resize',size);
 const hero=cv.closest('.hero');
 if('IntersectionObserver' in window&&hero)new IntersectionObserver(en=>{visible=en[0].isIntersecting;if(!visible)tone(false);},{threshold:0}).observe(hero);
 if(!RM)t0=performance.now()+600;
 requestAnimationFrame(frame);
 /* the console and other scripts can ask the lamp to send a message */
 root.addEventListener('transmit',e=>{if(msgIn)msgIn.value=e.detail;const bld=build(e.detail);if(bld.ev.length){cur=bld;t0=performance.now();ei=0;auto=true;}});
}

/* ---------- course line: fills as you scroll, or stops at the stop still ahead ---------- */
const list=d.getElementById('courseList'),fill=d.getElementById('fill');
if(list&&fill){const stops=[...list.querySelectorAll('.stop')];
 if(list.dataset.mode==='static'){stops.forEach(s=>s.classList.toggle('lit',!s.classList.contains('pending')));const set=()=>{fill.style.height=stops[stops.length-1].offsetTop+'px';};set();addEventListener('resize',set);if(d.fonts&&d.fonts.ready)d.fonts.ready.then(set);}
 else{const run=()=>{const r=list.getBoundingClientRect(),line=innerHeight*.62;
   fill.style.height=Math.max(0,Math.min(r.height-68,line-r.top-12))+'px';
   stops.forEach(s=>s.classList.toggle('lit',s.getBoundingClientRect().top+12<line));};
  addEventListener('scroll',run,{passive:true});addEventListener('resize',run);run();}}

/* ---------- copy buttons ---------- */
d.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',()=>{
 const el=d.getElementById(btn.dataset.copy),txt=el.textContent.trim(),old=btn.textContent;
 const done=()=>{btn.textContent='Copied';setTimeout(()=>btn.textContent=old,1600);};
 const sel=()=>{const rg=d.createRange();rg.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(rg);btn.textContent='Selected, press copy';setTimeout(()=>btn.textContent=old,2200);};
 try{navigator.clipboard.writeText(txt).then(done,sel);}catch(e){sel();}}));

/* ---------- console (facts only) ---------- */
const dlg=d.getElementById('console'),out=d.getElementById('conOut'),inp=d.getElementById('conI'),btn=d.getElementById('conBtn');if(!dlg)return;btn.hidden=false;const vv=window.visualViewport;if(vv){const fit=()=>{dlg.style.setProperty('--vvh',vv.height+'px');dlg.style.setProperty('--kb',Math.max(0,innerHeight-vv.height-vv.offsetTop)+'px')};vv.addEventListener('resize',fit);vv.addEventListener('scroll',fit);fit();}
const C={help:'Commands: whoami, service, study, projects, showcase, contact, pgp, morse <text>, watch <text>, lights, clear, exit',
whoami:"Douglas Weant. Navy Signalman, food-manufacturing R&D, graduate study in cybersecurity and AI.",
service:'Navy Signalman and Master-at-Arms, then Air Force Reserve Security Forces — NCOIC of CATM for the 932nd and then the 375th Air Wing.',
study:"B.S. Cybersecurity & IA — 2024 · M.S. Cybersecurity & IA — 2025 · M.S. Computer Science, AI/ML — in progress. I'm considering pursuing a PhD.",
projects:'ransomtriage — github.com/redhat1032/ransomware-triage · pypi.org/project/ransomtriage\nkevbrief — github.com/redhat1032/kevbrief',
showcase:'Thirty-six courses across three WGU degrees → wgu-showcase/',contact:'dweant@proton.me — PGP-encrypted email is preferred.',
pgp:'Fingerprint: DA37 81CC FFE4 8F08 B6AF F5F9 640A 90CF 4215 36DE'};
const print=t=>{const p=d.createElement('pre');p.textContent=t;out.append(p);out.scrollTop=out.scrollHeight;};
const open=()=>{dlg.showModal();if(!out.childElementCount)print('Type help and press Enter.');inp.focus();};
btn.onclick=open;d.getElementById('conX').onclick=()=>dlg.close();
d.addEventListener('keydown',e=>{if(e.key==='`'&&!dlg.open&&!/INPUT|TEXTAREA/.test(e.target.tagName)){e.preventDefault();open();}});
d.getElementById('conF').onsubmit=e=>{e.preventDefault();const v=inp.value.trim();inp.value='';if(!v)return;print('> '+v);const[c,...a]=v.split(/\s+/);const k=c.toLowerCase();
 if(k==='clear')out.textContent='';else if(k==='exit')dlg.close();
 else if(k==='morse'){const t=a.join(' ').slice(0,40);print(t.toUpperCase().split(' ').map(w=>[...w].map(ch=>M[ch.toUpperCase()]||'?').join(' ')).join(' / ')||'Usage: morse <text>');}
 else if(k==='watch'){const t=a.join(' ').slice(0,24)||'WATCH';root.dispatchEvent(new CustomEvent('transmit',{detail:t}));dlg.close();scrollTo({top:0,behavior:RM?'auto':'smooth'});}
 else if(k==='lights'){setLights(root.getAttribute('data-lights')!=='red');print('Lights changed.');}
 else print(C[k]||'Unknown command. Type help.');};
})();
