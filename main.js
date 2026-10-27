(()=>{const d=document,b=d.body;b.classList.remove('nojs');b.classList.add('js');
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;if(RM)b.classList.add('rm');
// Morse lamp: correct International Morse, unit 160ms
const M={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.'};
const seq=w=>{const s=[];w.toUpperCase().split(' ').forEach((wd,wi)=>{if(wi)s.push([0,4]);[...wd].forEach((ch,ci)=>{if(ci)s.push([0,2]);(M[ch]||'').split('').forEach((e,ei)=>{if(ei)s.push([0,1]);s.push([1,e=='.'?1:3]);});});});s.push([0,7]);return s;};
const lamps=[...d.querySelectorAll('.lamp,#bigLamp')];
if(!RM&&lamps.length){const s=seq('WATCH');let i=0;const step=()=>{const[on,u]=s[i];lamps.forEach(l=>l.classList.toggle('on',!!on));i=(i+1)%s.length;setTimeout(step,u*160);};step();}
else lamps.forEach(l=>l.classList.add('on'));
// scroll: sweep, parallax fog, course line, worlds
const track=d.querySelector('.plot .track'),plot=d.querySelector('.plot'),sw=d.querySelector('.sweep'),fogs=d.querySelectorAll('.fog');
if(track&&!RM){track.style.strokeDasharray='1';}
let tick=false;const onS=()=>{tick=false;const y=scrollY,h=innerHeight;
 if(!RM){if(sw)sw.style.transform=`rotate(${y*.25}deg)`;fogs.forEach((f,k)=>f.style.transform=`translate3d(${(k?-1:1)*y*.08}px,${y*.15}px,0)`);
 if(track){const r=plot.getBoundingClientRect();const p=Math.min(1,Math.max(0,(h-r.top)/(h*.8)));track.style.strokeDashoffset=String(1-p);}}};
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(onS);}},{passive:true});onS();
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)b.dataset.w=e.target.dataset.world||'0';}),{rootMargin:'-45% 0px -45% 0px'});
d.querySelectorAll('[data-world],.intro,.course,#about,#notebook,#contact').forEach(s=>io.observe(s));
// console easter egg (facts only)
const dlg=d.getElementById('console'),out=d.getElementById('conOut'),inp=d.getElementById('conI'),btn=d.getElementById('conBtn');if(!dlg)return;btn.hidden=false;
const C={help:'Commands: whoami, service, study, projects, showcase, contact, pgp, morse <text>, clear, exit',
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
 if(k==='clear')out.textContent='';else if(k==='exit')dlg.close();else if(k==='morse'){const t=a.join(' ').slice(0,40);print(t.toUpperCase().split(' ').map(w=>[...w].map(ch=>M[ch.toUpperCase()]||'?').join(' ')).join(' / ')||'Usage: morse <text>');}
 else print(C[k]||'Unknown command. Type help.');};
})();
