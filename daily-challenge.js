/* Daily lab challenge. Curated scenarios rotate weekly; no account or server required. */
(function () {
'use strict';
const scenarios = [["The borrowed badge","A late shift researcher cannot open the lab dashboard.",[["A message from “IT” asks for her sign-in code. The help desk has no matching ticket.",["Send the code","Verify through the known help desk number","Ignore all IT messages"],1,"An unexpected request for a sign-in code deserves independent verification. Sharing it could hand over an active session.",0,12],["The researcher confirms she shared a code before calling. A new session has opened from an unknown device.",["Revoke her sessions and secure the account","Block every employee","Wait until tomorrow"],0,"Revoke the compromised sessions and secure the account through the response process. A password change alone may leave a session active.",12,6],["A known backup service starts its scheduled transfer to the approved storage destination.",["Delete the backups","Disable every transfer","Check the job record and allow the verified backup"],2,"Compare activity with its owner, schedule and destination. A legitimate backup should not be stopped just because it moves lots of data.",0,15]]],["The quiet export","Someone is moving research out of the lab.",[["A contractor account downloads an entire project at 02:00. Its contract ended yesterday; there is no approved extension.",["Suspend that account and preserve its activity logs","Erase the account and all logs","Assume overtime"],0,"An expired account with unexplained bulk access calls for scoped containment and preserved evidence.",12,6],["The same account created a new application token minutes before suspension.",["Only change its password","Revoke the token and review related access","Email the token to the whole lab"],1,"Tokens can survive password changes. Revoke the unauthorized credential and investigate its scope.",12,6],["Another export belongs to the scheduled replication job, verified by its owner and approved destination.",["Stop the entire storage system","Delete the replica","Keep the verified job running while monitoring"],2,"Contain the confirmed intrusion while preserving legitimate work. Volume alone does not establish malicious intent.",0,15]]],["The locked notebook","A workstation is changing shared research files.",[["A workstation renames hundreds of files. Its user reports a ransom note; endpoint monitoring confirms suspicious encryption.",["Restart the file server","Isolate the workstation from the network","Wait for more files to change"],1,"Isolate the affected endpoint using the response process to limit spread while retaining evidence.",15,8],["An attached backup share is still writable from the compromised machine.",["Protect backup access and preserve recovery copies","Pay immediately","Delete every backup"],0,"Protect recovery assets from the compromised access path. Restore only after containment and investigation.",12,8],["A clean recovery copy exists. The endpoint is still compromised.",["Restore onto the infected endpoint now","Reconnect it to test the attack","Rebuild and validate a clean environment before restoring"],2,"Restoring into an active compromise risks repeating the incident. Validate recovery in a clean environment.",12,6]]],["The helpful visitor","A visitor says a researcher needs urgent help.",[["A person without a badge asks you to hold the secure lab door. They know a colleague’s name.",["Let them follow you in","Verify with reception and arrange an escort","Post their photo publicly"],1,"Knowing a name is not authorization. A courteous identity check protects people without assuming bad intent.",0,12],["Reception confirms the visitor is expected, but access requires an escort who has not arrived.",["Lend them your badge","Cancel all visitors","Have them wait in reception for the authorized escort"],2,"Use the established visitor process. Convenience should not create untracked access.",0,12],["The escorted visitor finds a USB drive labeled “Research results” outside the lab.",["Give it to the security team without plugging it in","Open it on the lab workstation","Ask a colleague to try it"],0,"Unknown removable media should go through the approved analysis process, away from production devices.",12,6]]],["The familiar invoice","An apparently routine invoice lands in the lab inbox.",[["A supplier email requests new bank details and urgent payment. The sender domain differs by one letter.",["Pay to avoid delay","Reply with your password","Call the supplier using a previously verified number"],2,"Urgency and a lookalike domain are clues. Verify payment changes through a trusted channel.",0,15],["The supplier confirms the message is fraudulent. One colleague opened its attachment.",["Report it and have security investigate the affected device","Delete the email and forget it","Wipe all lab computers immediately"],0,"Preserve the message and investigate the exposed endpoint. Clicking is a reason to assess impact, not proof every device is compromised.",12,6],["Mail logs identify the same confirmed phishing message in several inboxes.",["Block all external email indefinitely","Quarantine matching messages and notify affected staff","Forward the live attachment to everyone"],1,"Use the confirmed indicators to remove matching threats and give clear guidance without spreading the payload.",12,6]]],["The midnight login","An identity alert interrupts an otherwise quiet watch.",[["A researcher reports repeated approval prompts they did not initiate.",["Approve one to stop the noise","Ask them to deny the prompts and report the activity","Disable authentication for everyone"],1,"Unexpected approval prompts may be an attempt to wear someone down. Deny them and investigate.",12,6],["The researcher approved one prompt. Audit records confirm a new unauthorized session.",["Revoke sessions and secure the affected account","Only mute notifications","Wait for proof of stolen files"],0,"Confirmed unauthorized access warrants prompt containment, even before data theft is established.",15,6],["A separate location alert belongs to a verified employee using the company VPN and registered device.",["Lock every account from that city","Block the VPN permanently","Document the verified explanation and continue monitoring"],2,"Location is a clue that needs context. Corroborating identity and device evidence prevents unnecessary disruption.",0,15]]],["The extra permission","A small configuration change has a large audience.",[["A project folder containing private participant data was changed to “anyone with the link.” No public release was approved.",["Restrict sharing and preserve the access audit","Wait for someone to complain","Publish the link to ask for help"],0,"Remove the confirmed exposure and preserve the evidence needed to assess who accessed it.",12,6],["Audit logs show an unfamiliar external address downloaded files during the exposure.",["Declare that no data left","Delete the logs","Escalate to the response and privacy leads with the evidence"],2,"A download needs an evidence-based impact assessment and the organization’s response process.",12,6],["A separate folder holds approved public research and has a documented public-sharing owner.",["Make every public resource private","Keep the approved public folder available","Delete the public research"],1,"Classify the data and verify intent. Correcting a private-data exposure does not require removing approved public work.",0,15]]]];
const KEY = 'dw-daily-lab-v1';
function dayKey(date = new Date()) {
 const parts = new Intl.DateTimeFormat('en-US', {timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
 const get = type => parts.find(p => p.type === type).value;
 return get('year')+'-'+get('month')+'-'+get('day');
}
function dayNumber(key) { return Math.floor(Date.parse(key+'T12:00:00Z')/86400000); }
function read() { try { const value = JSON.parse(localStorage.getItem(KEY)); return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; } catch { return {}; } }
function valid(entry) { return entry && Array.isArray(entry.answers) && entry.answers.length <= 3 && entry.answers.every(a => Number.isInteger(a) && a >= 0 && a < 3); }
function streak(records, key) {
 let n=0, day=dayNumber(key);
 if (!valid(records[key]) || records[key].answers.length!==3) day--;
 while(n<3660) { const k=new Date(day*86400000).toISOString().slice(0,10); if(!valid(records[k])||records[k].answers.length!==3) break; n++; day--; }
 return n;
}
window.DailyChallenge = function DailyChallenge({React:R}) {
 const el=R.createElement;
 const [today,setToday]=R.useState(dayKey);
 const [records,setRecords]=R.useState(read);
 const [started,setStarted]=R.useState(false);
 const [feedback,setFeedback]=R.useState(false);
 const [notice,setNotice]=R.useState('');
 const [saveFailed,setSaveFailed]=R.useState(false);
 R.useEffect(()=>{const id=setInterval(()=>{const next=dayKey(); if(next!==today){setToday(next);setStarted(false);setFeedback(false);setNotice('A new daily challenge is ready.');}},15000);return()=>clearInterval(id);},[today]);
 const scenario=scenarios[((dayNumber(today)%scenarios.length)+scenarios.length)%scenarios.length];
 const answers=valid(records[today])?records[today].answers:[];
 const complete=answers.length===3;
 const round=Math.min(answers.length-(feedback?1:0),2);
 const task=scenario[2][Math.max(0,round)];
 const score=answers.reduce((sum,a,i)=>sum+(a===scenario[2][i][2]?1:0),0);
 const disruption=answers.reduce((sum,a,i)=>sum+(a===scenario[2][i][2]?0:scenario[2][i][5]),0);
 const exposure=answers.reduce((sum,a,i)=>sum+(a===scenario[2][i][2]?0:scenario[2][i][4]),0);
 function choose(index) {
  if(feedback||complete)return;
  if(dayKey()!==today){setToday(dayKey());setStarted(false);setFeedback(false);return;}
  const latest=read(), existing=latest[today];
  if(valid(existing)&&existing.answers.length>answers.length){setRecords(latest);setNotice('Progress restored from your other tab.');return;}
  const next={...records,...latest,[today]:{answers:[...answers,index]}};
  const keys=Object.keys(next).sort(); keys.slice(0,Math.max(0,keys.length-400)).forEach(k=>delete next[k]);
  setRecords(next);setFeedback(true);
  try{localStorage.setItem(KEY,JSON.stringify(next));}catch{setSaveFailed(true);}
 }
 async function share() {
  const text='Spot the Intruder · '+today+' · '+score+'/3 decisions · '+streak(records,today)+' day streak\nhttps://douglasweant.com/#03';
  try{await navigator.clipboard.writeText(text);setNotice('Spoiler-free result copied.');}catch{setNotice(text);}
 }
 const button=(text,onClick,primary=false)=>el('button',{type:'button',onClick,className:'lab-button'+(primary?' lab-primary':'')},text);
 const heading=(text)=>el('h2',{className:'lab-heading',tabIndex:-1},text);
 return el('section',{className:'daily-lab','aria-label':'Spot the Intruder daily challenge'},
  el('style',null,`
.daily-lab{min-height:calc(100vh - 56px);background:#050a14;color:#e5edf5;padding:clamp(20px,5vw,64px);font-family:ui-monospace,monospace}
.lab-wrap{max-width:960px;margin:auto}.lab-kicker{color:#ffbe0b;letter-spacing:.16em;font-size:12px;line-height:1.8}
.lab-heading{font-family:Georgia,serif;font-size:clamp(32px,6vw,62px);line-height:1.12;margin:20px 0;outline:none}
.lab-copy{color:#b0c1d3;font-size:15px;line-height:1.8;max-width:680px}.lab-stats{display:flex;flex-wrap:wrap;gap:12px;margin:26px 0}
.lab-stat{border:1px solid #324458;padding:12px 16px;font-size:12px;color:#b9d6e8}.lab-card{background:#0a1423;border:1px solid #324458;border-top:3px solid #ffbe0b;padding:clamp(20px,4vw,36px);margin:24px 0}
.lab-button{display:block;width:100%;text-align:left;color:#d8edf7;background:#111f30;border:1px solid #466079;border-radius:3px;padding:16px 20px;min-height:48px;margin:12px 0;font:inherit;font-size:14px;line-height:1.6;cursor:pointer;transition:background .15s}
.lab-button:hover{background:#20374c}.lab-button:focus-visible{outline:3px solid #ffbe0b;outline-offset:4px}.lab-primary{background:#ffbe0b;color:#07101a;border-color:#ffbe0b;font-weight:bold}.lab-primary:hover{background:#ffd15a}
.lab-verdict{color:#69e5e9;font-size:17px;font-weight:bold}.lab-note{color:#97abbe;font-size:12px;line-height:1.8;white-space:pre-wrap;overflow-wrap:anywhere}.lab-review{border-top:1px solid #324458;padding:18px 0}.lab-review strong{color:#e1edf7}.lab-progress{display:flex;gap:8px;margin-top:24px}.lab-progress span{height:4px;flex:1;background:#253448}.lab-progress .done{background:#69e5e9}
`),
 el('div',{className:'lab-wrap'},
 el('div',{className:'lab-kicker'},'03 / ADVERSARIAL • DAILY WATCH'),
 (!started&&!complete&&answers.length===0)?
 el(R.Fragment,null,heading('Spot the Intruder.'),
 el('p',{className:'lab-copy'},'Something’s wrong in the lab. You have three decisions to figure out what. Read the evidence, contain the threat, and keep legitimate research moving.'),
 el('div',{className:'lab-stats'},el('span',{className:'lab-stat'},today+' · Pacific'),el('span',{className:'lab-stat'},'3 decisions / ~2 minutes'),el('span',{className:'lab-stat'},streak(records,today)+' day streak')),
 el('div',{className:'lab-card'},el('div',{className:'lab-kicker'},'TODAY’S CASE FILE'),el('h3',null,scenario[0]),el('p',{className:'lab-copy'},scenario[1]),button('Begin today’s watch →',()=>setStarted(true),true))):
 (complete&&!feedback)?
 el(R.Fragment,null,heading(score===3?'Lab secured.':'Watch complete.'),
 el('div',{className:'lab-stats'},el('span',{className:'lab-stat'},score+'/3 best decisions'),el('span',{className:'lab-stat'},'Exposure +'+exposure),el('span',{className:'lab-stat'},'Disruption +'+disruption),el('span',{className:'lab-stat'},streak(records,today)+' day streak')),
 el('p',{className:'lab-copy'},'Case closed: '+scenario[0]+'. Review the evidence below, then return for the next watch.'),
 button('Copy spoiler-free result ↗',share,true),
 el('div',{className:'lab-card'},scenario[2].map((q,i)=>el('div',{className:'lab-review',key:i},el('strong',null,(answers[i]===q[2]?'✓ ':'↗ ')+'Decision '+(i+1)+': '+q[1][answers[i]]),el('p',{className:'lab-copy'},q[3]))))):
 el(R.Fragment,null,heading(scenario[0]),
 el('div',{className:'lab-stats'},el('span',{className:'lab-stat'},today+' · Pacific'),el('span',{className:'lab-stat'},'Decision '+(round+1)+' / 3'),el('span',{className:'lab-stat'},score+' correct so far')),
 el('div',{className:'lab-progress','aria-hidden':true},[0,1,2].map(i=>el('span',{key:i,className:i<answers.length?'done':''}))),
 el('div',{className:'lab-card'},
 el('div',{className:'lab-kicker'},'EVIDENCE / '+String(round+1).padStart(2,'0')),
 el('p',{className:'lab-copy'},task[0]),
 feedback?el('div',{'aria-live':'polite'},el('p',{className:'lab-verdict'},answers[round]===task[2]?'✓ Threat handled.':'↗ A better move was available.'),
 el('p',{className:'lab-copy'},task[3]),answers[round]!==task[2]&&el('p',{className:'lab-note'},'Best action: '+task[1][task[2]]+' · Exposure +'+task[4]+' / disruption +'+task[5]),
 button(complete?'Open debrief →':'Next evidence →',()=>setFeedback(false),true)):
 task[1].map((option,i)=>el('div',{key:i},button(String.fromCharCode(65+i)+' / '+option,()=>choose(i)))))),
 el('p',{className:'lab-note',role:'status'},notice),
 el('p',{className:'lab-note'},saveFailed?'Browser storage is unavailable. Your progress lasts for this visit.':'Progress and streaks stay in this browser. No account required.'),
 el('p',{className:'lab-note'},'New watch at midnight Pacific. Seven curated cases rotate weekly. Exposure and disruption are game points, not real-world risk estimates. Fictional training scenarios.')
 ));
};
window.DailyLabLogic={dayKey,dayNumber,streak,valid,scenarios};
})();
