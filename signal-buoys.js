/* Signal buoys: select a personal channel; the ocean remains a visual background. */
(function () {
'use strict';
const channels=[{"id":"navy","icon":"⚓","label":"NAVY SIGNALMAN","title":"The first signal was light.","body":"Active duty Aug 1989 to Jul 1997. Signal lamps, flag hoists, and watchstanding are part of my Navy background. Communication only works when someone is paying attention at the other end.","connection":"The connection: notice what matters, communicate clearly, and understand the system before acting.","destination":"05","action":"Read the story behind the work"},{"id":"food","icon":"⚙","label":"FOOD R&D","title":"A process is a system you can test.","body":"My day job is hands-on research and development in food manufacturing. It keeps experimentation grounded in what actually happens when a process changes.","connection":"The connection: question assumptions, measure results, and follow the effects beyond the part you changed.","destination":"05","action":"Explore the lessons from industry"},{"id":"wgu","icon":"◇","label":"WGU · 3 DEGREES","title":"The learning continues.","body":"Cybersecurity and computer science are part of my academic path. I want to understand what I build, test my reasoning, and keep working toward doctoral research.","connection":"The connection: curiosity needs practice. A useful answer should survive a closer look.","destination":"01","action":"Open the learning log"},{"id":"wow","icon":"⚔","label":"WOW","title":"Coordination is part of the challenge.","body":"World of Warcraft is one of my interests. Coordinating a group puts communication, timing, and adaptation into the same encounter.","connection":"The connection: a plan becomes useful when people can act on it together and adjust when conditions change.","destination":"02","action":"Visit the war room"},{"id":"coffee","icon":"☕","label":"COFFEE","title":"Fuel for the next question.","body":"Coffee belongs here because a personal site should leave room for ordinary interests as well as projects and credentials.","connection":"The connection: curiosity is allowed to have a daily ritual.","destination":"02","action":"Look around the war room"},{"id":"history","icon":"⌛","label":"FOOD HISTORY","title":"How did we get here?","body":"Food history connects an everyday subject with a much larger story: people, tools, constraints, and changing habits.","connection":"The connection: understanding how something came to be can expose assumptions that are easy to overlook.","destination":"05","action":"Follow the longer story"}];
window.SignalBuoys=function SignalBuoys({React:R,canvasRef,broadcasting,onBroadcast,onNavigate}){
 const el=R.createElement;
 const [selected,setSelected]=R.useState(null),[visited,setVisited]=R.useState(()=>new Set());
 const held=R.useRef(false);
 const buoyRefs=R.useRef([]);
 const channel=selected===null?null:channels[selected];
 function focusBuoy(index){const buoy=buoyRefs.current[index];if(buoy)buoy.focus();}
 function select(index){if(selected===index)focusBuoy(index);setSelected(current=>{const next=current===index?null:index;if(next!==null)setVisited(previous=>{const marks=new Set(previous);marks.add(next);return marks;});return next;});}
 function closePanel(){focusBuoy(selected);setSelected(null);}
 R.useEffect(()=>{if(selected===null)return;const onKey=event=>{if(event.key==='Escape')closePanel();};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);},[selected]);
 R.useEffect(()=>{
  const interactive=target=>target&&target.closest&&target.closest('button,a,input,textarea,select,[contenteditable="true"],[role="button"]');
  const down=event=>{if(event.code!=='Space'||event.repeat||event.ctrlKey||event.metaKey||event.altKey||interactive(event.target))return;event.preventDefault();held.current=true;onBroadcast(true);};
  const up=event=>{if(event.code==='Space'&&held.current){held.current=false;onBroadcast(false);}};
  const reset=()=>{held.current=false;onBroadcast(false);};
  window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',reset);
  return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',reset);reset();};
 },[onBroadcast]);
 return el('section',{className:'signal-buoys','aria-label':'Signal buoys personal channels'},
 el('style',null,`
.signal-buoys{position:relative;isolation:isolate;min-height:calc(100vh - 56px);overflow:hidden;background:#04121f;color:#d5e9f4;font-family:'JetBrains Mono',monospace}
.signal-ocean{position:absolute;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none}
.signal-mast{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;padding:20px clamp(20px,5vw,60px);border-bottom:1px solid #00f5ff40;background:#020a14cc}
.signal-kicker{font-size:11px;letter-spacing:.15em;color:#69e5e9;line-height:1.8}
.signal-sos{border:1px solid #00f5ff88;padding:12px 16px;min-height:44px;color:#a6f3f5;background:#04121f;font:inherit;font-size:12px;cursor:pointer}
.signal-sos[aria-pressed="true"]{background:#ffbe0b;color:#08121c;border-color:#ffbe0b}
.signal-beacon-controls{display:flex;align-items:center;gap:16px;flex-wrap:wrap}.signal-beacon{width:52px;height:52px;flex-shrink:0;border-radius:50%;background:#ffbe0b;border:4px solid #806423;box-shadow:0 0 0 6px #020a14;opacity:.12}
.signal-beacon[data-active="true"]{border-color:#ffe19a;box-shadow:0 0 18px #ffbe0b80;animation:signal-sos-flash 10.2s steps(1,end) infinite}
.signal-beacon-caption{font-size:10px;line-height:1.8;color:#aac4d6;margin:8px 0 0}.signal-motion-note{display:none}
@keyframes signal-sos-flash{0%{opacity:1}2.941176%{opacity:.12}5.882353%{opacity:1}8.823529%{opacity:.12}11.764706%{opacity:1}14.705882%{opacity:.12}23.529412%{opacity:1}32.352941%{opacity:.12}35.294118%{opacity:1}44.117647%{opacity:.12}47.058824%{opacity:1}55.882353%{opacity:.12}64.705882%{opacity:1}67.647059%{opacity:.12}70.588235%{opacity:1}73.529412%{opacity:.12}76.470588%{opacity:1}79.411765%{opacity:.12}100%{opacity:1}}
.signal-body{max-width:1100px;margin:auto;padding:clamp(28px,5vw,56px) clamp(20px,4vw,48px)}
.signal-heading{font:700 clamp(30px,5vw,48px)/1.2 Cinzel,Georgia,serif;color:#e7faff;margin:16px 0}
.signal-intro{max-width:700px;color:#aac4d6;font-size:14px;line-height:1.8}.signal-channel-list{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:14px;margin:36px 0}
.signal-channel{min-width:0;display:flex;flex-direction:column;align-items:center;gap:14px;padding:16px 8px;background:#04121faa;color:#b2d1e4;border:1px solid #34546c;cursor:pointer;font:inherit;border-radius:4px}
.signal-float{width:58px;height:58px;border-radius:50%;border:2px solid #00f5ff77;background:#06233f;display:grid;place-items:center;font-size:24px;animation:signal-bob 3s ease-in-out infinite}
.signal-channel:hover,.signal-channel[aria-pressed="true"]{border-color:#ffbe0b;color:#ffdc79;background:#102333}
.signal-channel[aria-pressed="true"] .signal-float{border-color:#ffbe0b;box-shadow:0 0 24px #ffbe0b33}
.signal-label{font-size:12px;line-height:1.6;text-align:center;overflow-wrap:anywhere}.signal-channel-number{font-size:10px;letter-spacing:.1em;color:#8ba9bf}
.signal-panel{background:#020a14ed;border:1px solid #00f5ff55;border-top:3px solid #ffbe0b;padding:clamp(22px,4vw,36px);max-width:850px;margin:auto}
.signal-panel h3{font:700 clamp(24px,4vw,32px)/1.3 Cinzel,Georgia,serif;margin:16px 0;color:#f1f7fa}
.signal-panel p{font-size:14px;line-height:1.9;color:#b9cfdf}.signal-connection{border-left:2px solid #ffbe0b;padding-left:18px}
.signal-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}.signal-action{display:inline-block;text-decoration:none;border:1px solid #4b6f89;background:#0d2539;color:#d5edf9;min-height:44px;padding:12px 16px;font:inherit;font-size:12px;line-height:1.8;cursor:pointer}.signal-action:hover{background:#1c3b50}
.signal-buoys button:focus-visible{outline:3px solid #ffbe0b;outline-offset:4px}
.signal-footnote{font-size:11px;color:#8ca9bd;line-height:1.8;margin-top:24px}
@keyframes signal-bob{50%{transform:translateY(-5px)}}
@media(max-width:800px){.signal-channel-list{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:420px){.signal-channel-list{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(prefers-reduced-motion:reduce){.signal-float{animation:none}.signal-beacon[data-active="true"]{animation:none;opacity:1}.signal-motion-note{display:block}}
`),
 el('canvas',{ref:canvasRef,className:'signal-ocean','aria-hidden':true}),
 el('div',{className:'signal-mast'},el('div',{className:'signal-kicker'},'04 / SIGNAL BUOYS • SIX PERSONAL CHANNELS'),
 el('div',{className:'signal-beacon-controls'},el('div',{className:'signal-beacon','data-active':broadcasting,role:'img','aria-label':broadcasting?'SOS signal lamp active':'SOS signal lamp off'}),el('div',null,el('button',{type:'button',className:'signal-sos','aria-pressed':broadcasting,onClick:()=>onBroadcast(previous=>!previous)},broadcasting?'Stop SOS light ■':'Test SOS light ··· ——— ···'),el('p',{className:'signal-beacon-caption'},'Three short · three long · three short'),broadcasting&&el('p',{className:'signal-beacon-caption signal-motion-note'},'Steady light: reduced motion is enabled.')))),
 el('div',{className:'signal-body'},el('div',{className:'signal-kicker'},'TUNE INTO A DIFFERENT SIDE OF THE WATCH'),
 el('h2',{className:'signal-heading'},'There’s a person behind the projects.'),
 el('p',{className:'signal-intro'},'Six buoys, six interests and experiences. Select one to open its signal and see how it connects to the way I think and work.'),
 el('div',{className:'signal-channel-list',role:'group','aria-label':'Choose a personal channel'},
 channels.map((item,index)=>el('button',{key:item.id,type:'button',className:'signal-channel',ref:node=>{buoyRefs.current[index]=node;},
 'aria-label':'Open '+item.label+' signal','aria-pressed':selected===index,'aria-controls':'signal-channel-panel',onClick:()=>select(index)},
 el('span',{className:'signal-channel-number'},'CHANNEL '+String(index+1).padStart(2,'0')),
 el('span',{className:'signal-float','aria-hidden':true,style:{animationDelay:(index*.2)+'s'}},item.icon),
 el('span',{className:'signal-label'},item.label)))),
 channel&&el('div',{id:'signal-channel-panel',className:'signal-panel',role:'region','aria-live':'polite','aria-atomic':true,'aria-labelledby':'signal-channel-title'},
 el('div',{className:'signal-kicker'},channel.label+' / SIGNAL RECEIVED'),
 el('h3',{id:'signal-channel-title'},channel.title),el('p',null,channel.body),el('p',{className:'signal-connection'},channel.connection),
 el('div',{className:'signal-actions'},el('button',{type:'button',className:'signal-action',onClick:()=>onNavigate(channel.destination)},channel.action+' →'),
 el('button',{type:'button',className:'signal-action',onClick:()=>select((selected+1)%channels.length)},'Next buoy →'),
 el('button',{type:'button',className:'signal-action',onClick:closePanel},'Close'))),
 el('p',{className:'signal-footnote',role:'status'},visited.size+' of '+channels.length+' channels explored.'),
 el('p',{className:'signal-footnote'},'Hold Space outside the controls, or use “Test SOS light,” to flash the signal lamp in SOS Morse code. The ocean waves are background scenery. No message is sent.')
 ));
};
})();
