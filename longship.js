/* Longship reading experience. Isolated from the other fleet sections. */
(function () {
'use strict';
const lessons=[{"lesson":"Pay attention before you act. A signal only helps if the person receiving it understands what it means.","today":"I start by understanding the system and what it is supposed to do. Then I look at how it works and what could be improved."},{"lesson":"Protection depends on people and judgment as much as equipment. A procedure has to work when someone is tired, distracted, or under pressure.","today":"That is part of why human behavior matters to me in cybersecurity. A control should help people make sound decisions in real conditions."},{"lesson":"Changing one part of a process can affect everything around it. An improvement needs evidence from the whole system.","today":"My work in food R&D keeps that practical: question assumptions, try something, measure what happens, and investigate the result."},{"lesson":"Learning means doing the work, testing your understanding, and staying with a difficult problem long enough to make progress.","today":"I want to co-create with AI, understand what I build, and carry that curiosity into doctoral research."},{"lesson":"An answer can look convincing and still be wrong. The interesting work begins when I test it and ask what the evidence supports.","today":"I am interested in how AI changes human judgment, especially when someone is trying to mislead the person or the system."},{"lesson":"The tools change. The reason for using them can stay the same: protect people and make systems better.","today":"My longer-term goal is research that contributes to useful protective technology and a stronger scientific foundation for cybersecurity."}];
const labels=['First watch','Service and judgment','Systems in industry','The learning forge','The AI sea','The next horizon'];
window.Longship = function Longship({React:R,stanzas}) {
 const el=R.createElement;
 const [active,setActive]=R.useState(0);
 const [revealed,setRevealed]=R.useState({});
 const root=R.useRef(null), verses=R.useRef([]);
 R.useEffect(()=>{
  let frame=0;
  const update=()=>{
   frame=0;
   const header=document.querySelector('header');
   const top=header?header.getBoundingClientRect().bottom:0;
   if(root.current)root.current.style.setProperty('--fleet-header-bottom',Math.max(0,top)+'px');
   const line=top+150;
   let index=0;
   verses.current.forEach((node,i)=>{if(node&&node.getBoundingClientRect().top<=line)index=i;});
   if(root.current&&root.current.getBoundingClientRect().bottom<=window.innerHeight+2)index=stanzas.length-1;
   setActive(index);
  };
  const queue=()=>{if(!frame)frame=requestAnimationFrame(update);};
  update();window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);
  return()=>{window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);if(frame)cancelAnimationFrame(frame);};
 },[]);
 function jump(index) {
  const node=verses.current[index];if(!node)return;
  const header=document.querySelector('header');
  const offset=(header?header.getBoundingClientRect().bottom:0)+100;
  const y=window.scrollY+node.getBoundingClientRect().top-offset;
  window.scrollTo({top:Math.max(0,y),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  node.focus({preventScroll:true});setActive(index);
 }
 return el('section',{ref:root,className:'longship-page','aria-label':'Longship saga'},
 el('style',null,`
.longship-page{--fleet-header-bottom:60px;position:relative;min-height:calc(100vh - 56px);background:#f4e8c1;color:#2b2117;color-scheme:light;font-family:'JetBrains Mono',monospace}
.longship-page *{box-sizing:border-box}.longship-mast{position:sticky;top:var(--fleet-header-bottom);z-index:20;background:#efe0b0;border-bottom:1px solid #8a2a1a40;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:20px;font-size:11px;letter-spacing:.15em}
.longship-mast strong{font-family:Cinzel,Georgia,serif}.longship-status{font-size:10px;letter-spacing:.05em;white-space:nowrap}
.longship-layout{display:grid;grid-template-columns:92px minmax(0,1fr);max-width:1120px;margin:auto}
.longship-nav{position:sticky;top:calc(var(--fleet-header-bottom) + 80px);align-self:start;display:flex;flex-direction:column;gap:14px;padding:28px 20px}
.longship-rune{width:48px;min-height:48px;border:1px solid #8a2a1a66;background:transparent;color:#5b261c;font-size:24px;cursor:pointer;display:grid;place-items:center;transition:background .2s}
.longship-rune:hover,.longship-rune[aria-current="location"]{background:#8a2a1a;color:#fff7df;border-color:#8a2a1a}
.longship-page button:focus-visible{outline:3px solid #6e281b;outline-offset:4px}
.longship-content{min-width:0;max-width:860px;margin:auto;padding:48px clamp(20px,5vw,60px)}
.longship-intro{text-align:center;margin-bottom:64px}.longship-eyebrow{font-size:11px;letter-spacing:.2em;color:#785a40;line-height:1.8}
.longship-title{font-family:'Cinzel Decorative',Cinzel,Georgia,serif;font-size:clamp(32px,6vw,56px);line-height:1.12;margin:20px 0;font-weight:900}
.longship-verse{position:relative;margin:0 0 64px;scroll-margin-top:160px;outline:none}
.longship-verse:focus-visible{outline:2px solid #8a2a1a;outline-offset:10px}
.longship-verse-head{display:flex;gap:20px;align-items:center}.longship-verse-symbol{font-size:44px;color:#8a2a1a}
.longship-verse h3{font-family:Cinzel,Georgia,serif;font-size:20px;margin:0}.longship-verse p{font-family:Cinzel,Georgia,serif;font-size:clamp(17px,2.5vw,20px);line-height:1.8;margin:20px 0}
.longship-reveal{border:1px solid #8a2a1a66;color:#6c291e;background:#efe0b0;padding:12px 16px;min-height:44px;font:inherit;font-size:11px;letter-spacing:.08em;cursor:pointer}
.longship-reveal:hover{background:#e4ce95}.longship-lesson{margin:12px 0;padding:20px;background:#e9d9ae;border:1px solid #8a2a1a40;color:#3b2a1e}.longship-lesson h4{font:11px/1.8 'JetBrains Mono',monospace;letter-spacing:.1em;margin:0}.longship-lesson p{font:16px/1.8 Georgia,serif;margin:10px 0 20px}.longship-lesson p:last-child{margin-bottom:0}
.longship-divider{display:flex;align-items:center;gap:14px;margin-top:28px;color:#785a40;font-size:10px;letter-spacing:.1em}.longship-divider:before{content:'';height:1px;background:#8a2a1a40;flex:1}
.longship-final{border:2px solid #8a2a1a55;background:#efe0b0;padding:24px}.longship-final h3{font-size:12px;line-height:1.8;letter-spacing:.12em}.longship-final p{font:16px/1.9 Cinzel,Georgia,serif}
.longship-voyage{height:3px;background:#d4ba82;position:absolute;bottom:0;left:0;right:0}.longship-voyage span{display:block;height:100%;background:#8a2a1a;transition:width .3s;position:relative}.longship-voyage span:after{content:'⛵';position:absolute;right:0;bottom:1px;font-size:17px}
@media(max-width:640px){.longship-mast{padding:12px 16px;align-items:flex-start;gap:8px;flex-direction:column}.longship-layout{grid-template-columns:1fr}.longship-nav{position:static;flex-direction:row;justify-content:center;flex-wrap:wrap;gap:8px;padding:24px 16px 0}.longship-content{padding-top:32px}.longship-status{font-size:10px}.longship-verse-head{gap:12px}.longship-title{font-size:34px}}
`),
 el('div',{className:'longship-mast'},el('strong',null,'LONGSHIP LOG / SAGA OF THE WATCHSTANDER'),
 el('span',{className:'longship-status'},'⛵ Verse '+(active+1)+' of '+stanzas.length),
 el('div',{className:'longship-voyage',role:'progressbar','aria-label':'Saga reading progress','aria-valuemin':1,'aria-valuemax':stanzas.length,'aria-valuenow':active+1},
 el('span',{style:{width:((active+1)/stanzas.length*100)+'%'}}))),
 el('div',{className:'longship-layout'},
 el('nav',{className:'longship-nav','aria-label':'Saga verses'},stanzas.map((stanza,index)=>el('button',{
  key:stanza.rune,type:'button',className:'longship-rune',title:'Verse '+(index+1)+': '+labels[index],
  'aria-label':'Go to verse '+(index+1)+': '+labels[index],
  'aria-current':active===index?'location':undefined,
  'aria-controls':'longship-verse-'+index,onClick:()=>jump(index)
 },stanza.rune))),
 el('div',{className:'longship-content'},
 el('div',{className:'longship-intro'},el('div',{className:'longship-eyebrow'},'HEARKEN! • ᚻᛖᚨᚱᚲᛖᚾ'),
 el('h2',{className:'longship-title'},'The Saga of',el('br'),'Douglas Weant'),
 el('p',{className:'longship-eyebrow'},'The story behind the work. Six chapters, one protective instinct.'),
 el('p',{className:'longship-eyebrow'},'Choose a rune to visit a chapter, then open the lesson behind it.')),
 stanzas.map((stanza,index)=>el('article',{
  key:stanza.rune,id:'longship-verse-'+index,className:'longship-verse',tabIndex:-1,
  ref:node=>{verses.current[index]=node;},'aria-labelledby':'longship-title-'+index
 },el('div',{className:'longship-verse-head'},el('span',{className:'longship-verse-symbol','aria-hidden':true},stanza.rune),el('h3',{id:'longship-title-'+index},labels[index])),
 el('p',null,stanza.text),
 el('button',{type:'button',className:'longship-reveal','aria-expanded':!!revealed[index],'aria-controls':'longship-lesson-'+index,
 onClick:()=>setRevealed(previous=>({...previous,[index]:!previous[index]}))},revealed[index]?'Close the lesson ↑':'What this taught me ↓'),
 el('div',{id:'longship-lesson-'+index,className:'longship-lesson',hidden:!revealed[index]},el('h4',null,'THE LESSON'),el('p',null,lessons[index].lesson),el('h4',null,'HOW I APPLY IT TODAY'),el('p',null,lessons[index].today)),
 el('div',{className:'longship-divider'},'STANZA '+(index+1)+' OF '+stanzas.length))),
 el('div',{className:'longship-final'},el('h3',null,'FINAL VERSE — TECHNOLOGY TODAY. STRATEGY TOMORROW.'),
 el('p',null,'Different era, same game. Old principles, new battlefields. The watch does not end — it changes frequency.'),
 el('p',null,'From signal lamp to packet trace, from axe to Python, from coffee to code.'),
 el('p',null,el('strong',null,'Defend. Automate. Build. Improve.')),
 el('button',{type:'button',className:'longship-reveal',onClick:()=>jump(0)},'Return to the first watch ↑')))
 ));
};
})();
