/* Recorder, tabletop and contact: clear purpose with the fleet's original visual themes. */
(function(){
'use strict';
const chapters=[{"label":"Navy signals","title":"Notice. Understand. Communicate.","body":"Active duty Aug 1989 to Jul 1997. My Navy background includes visual communications and standing watch. Signal lamps and flag hoists make a practical point: a message only works when someone can recognize it and act on it.","lesson":"Start by understanding the system, its purpose, and the people who depend on it."},{"label":"Protection & training","title":"Judgment belongs beside the equipment.","body":"My service also included Master-at-Arms work and Air Force Security Forces – CATM. In the reserves, I served as NCOIC of CATM for an air wing.","lesson":"Protection takes preparation, instruction, and judgment under real conditions."},{"label":"Food R&D","title":"Follow the effects through the process.","body":"I work in hands-on food research and development. Changing a process means asking what changed, measuring the result, and checking what happened elsewhere in the system.","lesson":"Question assumptions, try something, and investigate the evidence."},{"label":"Cybersecurity","title":"Build protection that helps people.","body":"My academic path includes cybersecurity, and my projects include ransomware triage. I am interested in protection that does useful work rather than simply checking a box.","lesson":"A security control needs to work for the people using it."},{"label":"Computer science & AI","title":"A convincing answer still needs testing.","body":"I am completing an MSCS with a focus on AI and machine learning. I want to co-create with AI and understand what I build, including where a model or a decision can fail.","lesson":"Test the answer, examine the assumptions, and keep following the difficult questions."},{"label":"The next horizon","title":"Research with a protective purpose.","body":"A doctorate is a longer-term goal. The questions drawing me toward it involve human behavior, AI-assisted judgment, and a stronger scientific foundation for cybersecurity.","lesson":"Use the tools to protect people and make the system better."}];
const objects=[{"id":"lamp","icon":"◐","label":"Signal lamp","x":15,"y":22,"r":-7,"body":"Visual communication from my Navy background. It reminds me that sending a signal and being understood are different parts of the same job.","connection":"Clear communication is part of protection.","destination":"05","action":"Read the service chapter"},{"id":"notebook","icon":"▤","label":"Field notebook","x":39,"y":23,"r":3,"body":"Understand the system. Question assumptions. Try something. See what happens. These are the questions I bring to a new problem.","connection":"Keep the reasoning visible, then test it.","destination":"05","action":"Read the lessons behind the work"},{"id":"pcb","icon":"⬡","label":"Circuit trace","x":63,"y":24,"r":8,"body":"A reminder to examine how the parts connect. A small change can affect the behavior of a larger system.","connection":"Defend. Automate. Build. Improve.","destination":"03","action":"Try the daily defender challenge"},{"id":"axe","icon":"⚒","label":"Viking axe","x":86,"y":30,"r":-10,"body":"A visual link to the Longship theme: exploration, practical tools, and old principles applied to new problems.","connection":"The tools can change while the purpose stays clear.","destination":"05","action":"Visit the Longship"},{"id":"mug","icon":"☕","label":"Coffee mug","x":17,"y":68,"r":-2,"body":"Coffee, World of Warcraft, and food history are part of the person behind the projects. There is room for ordinary interests on this table.","connection":"Curiosity does not stop at the edge of a job description.","destination":"04","action":"Explore the personal channels"},{"id":"wgu","icon":"◇","label":"Study notes","x":41,"y":65,"r":6,"body":"My studies connect cybersecurity with computer science, AI, and machine learning. The coursework showcase holds examples of the work.","connection":"Understanding comes from doing, testing, and explaining.","href":"/wgu-showcase/","action":"Open the coursework showcase"},{"id":"crate","icon":"▣","label":"Ransomware triage","x":65,"y":69,"r":4,"body":"The ransomware-triage repository contains ransomtriage, an offline tool for the first hour of ransomware incident triage. Its README explains its scope and current status.","connection":"Build practical help for defenders when time matters.","href":"https://github.com/redhat1032/ransomware-triage","action":"Open the project on GitHub"},{"id":"compass","icon":"◎","label":"Brass compass","x":86,"y":76,"r":-6,"body":"Technology today. Strategy tomorrow. The compass represents direction: understand why a tool matters before deciding how to build it.","connection":"A useful next step should serve a clear purpose.","destination":"01","action":"Explore the experience log"}];
const email='dweant@proton.me';
const fingerprint='DA37 81CC FFE4 8F08 B6AF F5F9 640A 90CF 4215 36DE';
const styles=`
.fleet-section{--accent:#ff6a00;--ink:#eee;--muted:#b2bac4;--panel:#11171e;min-height:calc(100vh - 56px);background:#0a0a0a;color:var(--ink);font-family:'JetBrains Mono',monospace}
.fleet-section *{box-sizing:border-box}.fleet-section .section-mast{padding:18px clamp(20px,4vw,48px);border-bottom:1px solid var(--accent);font-size:11px;line-height:1.8;letter-spacing:.13em;color:var(--accent)}
.fleet-section .section-content{max-width:1180px;margin:auto;padding:36px clamp(20px,4vw,48px)}
.fleet-section h2{font:700 clamp(30px,5vw,48px)/1.2 Cinzel,Georgia,serif;margin:12px 0 20px}
.fleet-section h3{font:700 24px/1.4 Cinzel,Georgia,serif;margin:12px 0}
.fleet-section p{font-size:14px;line-height:1.9;color:var(--muted);max-width:760px}
.fleet-section .section-kicker{font-size:11px;line-height:1.8;letter-spacing:.12em;color:var(--accent)}
.fleet-section button,.fleet-section a.section-button{min-height:44px;padding:12px 16px;border:1px solid var(--accent);background:transparent;color:var(--ink);font:inherit;font-size:12px;line-height:1.6;cursor:pointer;text-decoration:none;display:inline-block}
.fleet-section button:hover,.fleet-section a.section-button:hover{background:#ffffff0c}
.fleet-section button:disabled{opacity:.4;cursor:default}
.fleet-section button:focus-visible,.fleet-section a:focus-visible,.fleet-section input:focus-visible{outline:3px solid var(--accent);outline-offset:4px}
.fleet-section .section-card{background:var(--panel);border:1px solid #7e899344;padding:clamp(20px,3vw,32px);min-width:0}
.fleet-section .section-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}.fleet-section .section-small{font-size:11px;line-height:1.9;overflow-wrap:anywhere}
.recorder-grid{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(260px,.8fr);gap:24px;margin:30px 0}
.recorder-chapters{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0}.recorder-chapters button[aria-pressed="true"]{background:#ff6a00;color:#111}
.recorder-dial{width:230px;height:230px;max-width:100%;margin:24px auto;border:14px solid #292929;border-radius:50%;display:grid;place-items:center;background:repeating-conic-gradient(#ff6a0066 0deg 1deg,transparent 1deg 15deg);position:relative;touch-action:none;cursor:ew-resize}
.recorder-dial-center{width:82%;height:82%;background:#101010;border:1px solid #ff6a0077;border-radius:50%;display:grid;place-items:center;font-size:36px;font-weight:bold;color:#ff9a4a}
.recorder-needle{position:absolute;left:50%;top:50%;height:40%;width:3px;background:#ff6a00;transform-origin:50% 0;pointer-events:none}
.recorder-slider{display:block;width:100%;accent-color:#ff6a00;margin:20px 0;min-height:32px}
.recorder-wave{width:100%;height:80px;color:#ff6a00;opacity:.6;margin-top:24px}
.war-room{--accent:#d9c5a0;--ink:#f0e2c7;--muted:#c3b496;--panel:#261f17;background:#1a150f}
.war-table{position:relative;height:480px;border:1px solid #d9c5a044;border-radius:12px;background:repeating-linear-gradient(90deg,#0000000c 0 2px,transparent 2px 28px),linear-gradient(#3c2e20,#231b13);margin:24px 0}
.fleet-section .war-object{position:absolute;width:130px;min-height:114px;padding:12px;transform:translate(-50%,-50%) rotate(var(--rotation));background:#f2e7cc;color:#2b2117;border:2px solid #806f55;border-radius:9px;box-shadow:0 10px 22px #0006;touch-action:none;user-select:none;display:flex;flex-direction:column;justify-content:center;gap:10px;cursor:grab;overflow-wrap:anywhere}
.fleet-section .war-object:hover{background:#fff4da}.fleet-section .war-object[aria-pressed="true"]{border-color:#ffbe0b;outline:2px solid #ffbe0b;z-index:2}.war-object-icon{font-size:26px}.war-object-label{font-size:11px;line-height:1.5}
.war-inventory{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0}.war-inventory button[aria-pressed="true"]{background:#d9c5a0;color:#231b13}
.war-dossier{border-top:3px solid #d9c5a0}.war-dossier p{max-width:850px}
.contact-page{--accent:#00f5ff;--ink:#e7f5ff;--muted:#b3c9db;--panel:#0a1423;background:radial-gradient(ellipse at 20% 10%,#143340,#020a14 60%)}
.contact-grid{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr);gap:24px;margin:30px 0}
.contact-address{font:700 clamp(20px,4vw,32px)/1.5 Cinzel,Georgia,serif;color:#ffce5c;overflow-wrap:anywhere}
.contact-fingerprint{font-size:13px;line-height:2;overflow-wrap:anywhere;color:#d4e7f5;user-select:text}
.contact-message{border-left:2px solid #ffbe0b;padding-left:20px}.contact-footer{margin-top:40px;padding-top:24px;border-top:1px solid #67869b55}
@media(max-width:800px){.recorder-grid,.contact-grid{grid-template-columns:1fr}}
@media(max-width:640px){.war-table{height:auto;padding:18px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.fleet-section .war-object{position:static;width:100%;min-height:120px;transform:none;touch-action:auto;cursor:pointer}.recorder-dial{width:200px;height:200px}}
`;
function sharedStyle(el){return el('style',null,styles);}
function action(el,item,onNavigate){
 return item.href?el('a',{className:'section-button',href:item.href,target:item.href.startsWith('https:')?'_blank':undefined,rel:item.href.startsWith('https:')?'noopener noreferrer':undefined},item.action+' →'):el('button',{type:'button',onClick:()=>onNavigate(item.destination)},item.action+' →');
}
window.FlightRecorder=function FlightRecorder({React:R,onNavigate}){
 const el=R.createElement;
 const [index,setIndex]=R.useState(0);
 const drag=R.useRef(null),chapter=chapters[index];
 const select=value=>setIndex(Math.max(0,Math.min(chapters.length-1,value)));
 function move(event){if(!drag.current||drag.current.pointerId!==event.pointerId)return;select(drag.current.index+Math.round((event.clientX-drag.current.x)/40));}
 function release(event){if(drag.current&&drag.current.pointerId===event.pointerId)drag.current=null;}
 return el('section',{className:'fleet-section flight-recorder','aria-label':'Flight recorder experience log'},sharedStyle(el),
 el('div',{className:'section-mast'},'01 / BLACK BOX • THE EXPERIENCE LOG'),
 el('div',{className:'section-content'},el('h2',null,'What shaped the way I work.'),
 el('p',null,'Choose a chapter to explore the experience and the principle behind it. This is a personal record, not a live instrument.'),
 el('div',{className:'recorder-chapters',role:'group','aria-label':'Experience chapters'},chapters.map((item,i)=>el('button',{key:item.label,type:'button','aria-pressed':i===index,'aria-controls':'recorder-transcript',onClick:()=>select(i)},String(i+1).padStart(2,'0')+' / '+item.label))),
 el('div',{className:'recorder-grid'},
 el('div',{className:'section-card',id:'recorder-transcript',role:'region','aria-live':'polite','aria-atomic':true,'aria-labelledby':'recorder-title'},
 el('div',{className:'section-kicker'},'CHAPTER '+(index+1)+' / '+chapters.length+' • '+chapter.label),
 el('h3',{id:'recorder-title'},chapter.title),el('p',null,chapter.body),el('div',{className:'section-kicker'},'THE PRINCIPLE'),el('p',null,chapter.lesson),
 el('svg',{className:'recorder-wave',viewBox:'0 0 600 80','aria-hidden':true},el('path',{d:'M0 40 L40 40 L55 22 L70 58 L85 12 L100 67 L115 35 L160 40 L220 40 L240 16 L260 64 L280 26 L300 53 L320 40 L385 40 L400 22 L420 58 L440 34 L470 40 L600 40',fill:'none',stroke:'currentColor',strokeWidth:2})),
 el('div',{className:'section-actions'},el('button',{type:'button',disabled:index===0,onClick:()=>select(index-1)},'← Previous chapter'),el('button',{type:'button',disabled:index===chapters.length-1,onClick:()=>select(index+1)},'Next chapter →'))),
 el('div',{className:'section-card'},el('div',{className:'section-kicker'},'JOG / SHUTTLE'),
 el('div',{className:'recorder-dial','aria-hidden':true,onPointerDown:event=>{if(event.button!==0&&event.pointerType!=='touch')return;drag.current={pointerId:event.pointerId,x:event.clientX,index};event.currentTarget.setPointerCapture(event.pointerId);},onPointerMove:move,onPointerUp:release,onPointerCancel:release},
 el('div',{className:'recorder-dial-center'},String(index+1).padStart(2,'0')),el('div',{className:'recorder-needle',style:{transform:'rotate('+(index/(chapters.length-1)*270+45)+'deg)'}})),
 el('label',{htmlFor:'recorder-chapter-range',className:'section-kicker'},'Choose a chapter'),
 el('input',{id:'recorder-chapter-range',className:'recorder-slider',type:'range',min:1,max:chapters.length,step:1,value:index+1,'aria-valuetext':chapter.label,onChange:event=>select(Number(event.target.value)-1)}),
 el('p',{className:'section-small'},'Drag the dial left or right, move the slider, or use the chapter buttons. The waveform is decorative.'),
 el('div',{className:'section-actions'},el('button',{type:'button',onClick:()=>onNavigate('05')},'Read the longer story →'),el('a',{className:'section-button',href:'/wgu-showcase/'},'View coursework →'))))));
};
window.WarRoom=function WarRoom({React:R,onNavigate}){
 const el=R.createElement;
 const [positions,setPositions]=R.useState(()=>objects.map(item=>({id:item.id,x:item.x,y:item.y})));
 const [selected,setSelected]=R.useState('notebook');
 const table=R.useRef(null),drag=R.useRef(null);
 const item=objects.find(object=>object.id===selected);
 function down(event,id){
  drag.current={id,pointerId:event.pointerId,moved:false};
  if(event.button!==0&&event.pointerType!=='touch')return;
  if(window.matchMedia('(max-width:640px)').matches)return;
  const bounds=table.current.getBoundingClientRect(),position=positions.find(p=>p.id===id);
  drag.current={id,pointerId:event.pointerId,moved:false,startX:event.clientX,startY:event.clientY,x:position.x,y:position.y,width:bounds.width,height:bounds.height,cardWidth:event.currentTarget.offsetWidth,cardHeight:event.currentTarget.offsetHeight};
  event.currentTarget.setPointerCapture(event.pointerId);
 }
 function move(event){
  const current=drag.current;if(!current||current.pointerId!==event.pointerId||current.startX===undefined)return;
  const dx=event.clientX-current.startX,dy=event.clientY-current.startY;
  if(Math.hypot(dx,dy)<=6&&!current.moved)return;current.moved=true;
  const marginX=Math.min(45,(current.cardWidth/2+16)/current.width*100),marginY=Math.min(45,(current.cardHeight/2+16)/current.height*100);
  const x=Math.max(marginX,Math.min(100-marginX,current.x+dx/current.width*100));
  const y=Math.max(marginY,Math.min(100-marginY,current.y+dy/current.height*100));
  setPositions(previous=>previous.map(p=>p.id===current.id?{...p,x,y}:p));
 }
 function release(event){if(drag.current&&drag.current.pointerId===event.pointerId)drag.current.pointerId=null;}
 function choose(event,id){if(event.detail!==0&&drag.current&&drag.current.id===id&&drag.current.moved){drag.current.moved=false;return;}setSelected(id);}
 return el('section',{className:'fleet-section war-room','aria-label':'War room objects and ideas'},sharedStyle(el),
 el('div',{className:'section-mast'},'02 / WAR ROOM • OBJECTS WITH A STORY'),
 el('div',{className:'section-content'},el('h2',null,'A few things on my worktable.'),
 el('p',null,'Select an object to read its story and follow a related project or chapter. On a larger screen you can also rearrange the table.'),
 el('div',{className:'war-table',ref:table},objects.map(object=>{const position=positions.find(p=>p.id===object.id);return el('button',{
 key:object.id,type:'button',className:'war-object','aria-label':'Open '+object.label+' dossier','aria-pressed':selected===object.id,'aria-controls':'war-dossier',
 style:{left:position.x+'%',top:position.y+'%','--rotation':object.r+'deg'},onPointerDown:event=>down(event,object.id),onPointerMove:move,onPointerUp:release,onPointerCancel:release,onClick:event=>choose(event,object.id)},
 el('span',{className:'war-object-icon','aria-hidden':true},object.icon),el('span',{className:'war-object-label'},object.label));})),
 el('div',{className:'section-actions'},el('button',{type:'button',onClick:()=>{drag.current=null;setPositions(objects.map(object=>({id:object.id,x:object.x,y:object.y})));}},'Reset table layout')),
 el('div',{className:'war-inventory',role:'group','aria-label':'Object inventory'},objects.map(object=>el('button',{type:'button',key:object.id,'aria-pressed':selected===object.id,'aria-controls':'war-dossier',onClick:()=>setSelected(object.id)},object.label))),
 el('div',{id:'war-dossier',className:'section-card war-dossier',role:'region','aria-live':'polite','aria-atomic':true,'aria-labelledby':'war-dossier-title'},
 el('div',{className:'section-kicker'},'DOSSIER OPEN'),el('h3',{id:'war-dossier-title'},item.label),el('p',null,item.body),el('p',null,item.connection),el('div',{className:'section-actions'},action(el,item,onNavigate)))));
};
window.ContactDeck=function ContactDeck({React:R}){
 const el=R.createElement;
 const [status,setStatus]=R.useState('');
 const [story,setStory]=R.useState(false);
 async function copy(value,label){try{await navigator.clipboard.writeText(value);setStatus(label+' copied.');}catch{setStatus('Copy is unavailable in this browser. Select and copy the '+label.toLowerCase()+' shown on this page.');}}
 return el('section',{className:'fleet-section contact-page','aria-label':'Contact Douglas Weant'},sharedStyle(el),
 el('div',{className:'section-mast'},'06 / CONTACT • OPEN A CONVERSATION'),
 el('div',{className:'section-content'},el('h2',null,'Send a signal.'),
 el('p',null,'Have a question, a useful challenge, or an idea worth investigating? Email is the direct route.'),
 el('div',{className:'contact-grid'},el('div',{className:'section-card'},
 el('div',{className:'section-kicker'},'DIRECT CONTACT'),el('p',{className:'contact-address'},email),
 el('div',{className:'section-actions'},el('a',{className:'section-button',href:'mailto:'+email},'Email Douglas →'),el('button',{type:'button',onClick:()=>copy(email,'Email address')},'Copy email address')),
 el('p',{className:'section-small'},'The email button opens your mail app. There is no puzzle to unlock and no message is sent by this page.'),
 el('p',{role:'status',className:'section-small'},status),
 el('h3',null,'Things I’m interested in discussing'),
 el('p',null,'Cybersecurity and human behavior. AI-assisted judgment. Practical tools that protect people. Research, learning, and difficult problems worth testing.'),
 el('a',{className:'section-button',href:'https://github.com/redhat1032',target:'_blank',rel:'noopener noreferrer'},'Find my work on GitHub ↗')),
 el('div',{className:'section-card'},el('div',{className:'section-kicker'},'OPTIONAL / PGP PUBLIC KEY'),
 el('p',null,'If you use PGP, the published public key is available below. Its fingerprint is shown for comparison.'),
 el('div',{className:'contact-fingerprint'},fingerprint),
 el('div',{className:'section-actions'},el('a',{className:'section-button',href:'/assets/dw-weant-publickey.asc',download:'dw-weant-publickey.asc'},'Download public key'),el('button',{type:'button',onClick:()=>copy(fingerprint,'Fingerprint')},'Copy fingerprint')),
 el('p',{className:'section-small'},'Email works without PGP.'),
 el('div',{className:'contact-message'},el('h3',null,'Why “WATCH”?'),
 el('button',{type:'button','aria-expanded':story,'aria-controls':'contact-watch-story',onClick:()=>setStory(previous=>!previous)},story?'Close the note ↑':'Read the note in the bottle ↓'),
 el('p',{id:'contact-watch-story',hidden:!story},'WATCH connects the service background to the work ahead: pay attention, understand the system, and protect the people depending on it. Same ocean. New threats.')))),
 el('footer',{className:'contact-footer section-small'},'DOUGLAS WEANT / THE WATCH CONTINUES')));
};
})();
