(()=>{const d=document;d.body.classList.replace('nojs','js');let deg='all',q='';
const cards=[...d.querySelectorAll('.sc-card')],secs=[...d.querySelectorAll('.sc-sec')],note=d.getElementById('count-note'),empty=d.getElementById('empty');
const run=()=>{let n=0;const w=q.toLowerCase().split(/\s+/).filter(Boolean);cards.forEach(c=>{const ok=(deg==='all'||c.dataset.deg===deg)&&w.every(x=>c.dataset.hay.includes(x));c.hidden=!ok;n+=ok;});
secs.forEach(s=>{const v=s.querySelectorAll('.sc-card:not([hidden])').length;s.hidden=!v;const c=s.querySelector('.cnt');if(c)c.textContent=v+' courses';});empty.hidden=!!n;note.textContent=n+' of '+cards.length+' courses shown';};
d.querySelectorAll('.pill').forEach(p=>{if(p.getAttribute('aria-pressed')==='true')p.classList.add('on');p.setAttribute('aria-pressed',String(p.classList.contains('on')));p.onclick=()=>{d.querySelectorAll('.pill').forEach(x=>{x.classList.toggle('on',x===p);x.setAttribute('aria-pressed',String(x===p));});deg=p.dataset.deg;run();};});
d.getElementById('q').addEventListener('input',e=>{q=e.target.value.trim();run();});run();})();
