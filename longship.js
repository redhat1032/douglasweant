/* Longship reading experience. Isolated from the other fleet sections. */
(function () {
'use strict';
const labels=['First watch','Service and judgment','Systems in industry','The learning forge','The AI sea','The next horizon'];
window.Longship = function Longship({React:R,stanzas}) {
 const el=R.createElement;
 const [active,setActive]=R.useState(0);
 const [decoded,setDecoded]=R.useState({});
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
.longship-decode{border:1px solid #8a2a1a66;color:#6c291e;background:#efe0b0;padding:12px 16px;min-height:44px;font:inherit;font-size:11px;letter-spacing:.08em;cursor:pointer}
.longship-decode:hover{background:#e4ce95}.longship-code{margin:12px 0;padding:20px;background:#e9d9ae;border:1px solid #8a2a1a40;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;font:12px/1.8 'JetBrains Mono',monospace;color:#3b2a1e}
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
 el('p',{className:'longship-eyebrow'},'Old principles. New battlefields. One watch.'),
 el('p',{className:'longship-eyebrow'},'Choose a rune to visit a verse. Decode each verse into Python.')),
 stanzas.map((stanza,index)=>el('article',{
  key:stanza.rune,id:'longship-verse-'+index,className:'longship-verse',tabIndex:-1,
  ref:node=>{verses.current[index]=node;},'aria-labelledby':'longship-title-'+index
 },el('div',{className:'longship-verse-head'},el('span',{className:'longship-verse-symbol','aria-hidden':true},stanza.rune),el('h3',{id:'longship-title-'+index},labels[index])),
 el('p',null,stanza.text),
 el('button',{type:'button',className:'longship-decode','aria-expanded':!!decoded[index],'aria-controls':'longship-code-'+index,
 onClick:()=>setDecoded(previous=>({...previous,[index]:!previous[index]}))},decoded[index]?'Hide Python ↑':'Decode into Python ↓'),
 el('pre',{id:'longship-code-'+index,className:'longship-code',hidden:!decoded[index]},el('code',null,stanza.code)),
 el('div',{className:'longship-divider'},'STANZA '+(index+1)+' OF '+stanzas.length))),
 el('div',{className:'longship-final'},el('h3',null,'FINAL VERSE — TECHNOLOGY TODAY. STRATEGY TOMORROW.'),
 el('p',null,'Different era, same game. Old principles, new battlefields. The watch does not end — it changes frequency.'),
 el('p',null,'From signal lamp to packet trace, from axe to Python, from coffee to code.'),
 el('p',null,el('strong',null,'Defend. Automate. Build. Improve.')),
 el('button',{type:'button',className:'longship-decode',onClick:()=>jump(0)},'Return to the first watch ↑')))
 ));
};
})();
