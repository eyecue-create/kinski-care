(()=>{const TZ="Europe/Berlin",KEY="kinski-care-v2",GRACE=20;
const APP=[{id:"",label:"Appetit?"},{id:"none",label:"nichts"},{id:"little",label:"wenig"},{id:"ok",label:"normal"},{id:"good",label:"gut"},{id:"all",label:"alles"}];
const T=[
{id:"m-vet",s:"m",t:"Vetmedin",d:"3/4",c:"#8B5A2B",tl:"7:30–8:00",a:450,b:480,k:"med",w:"Nüchtern – danach 1 h kein Futter"},
{id:"m-food",s:"m",t:"Frühstück",tl:"8:30–9:00",a:510,b:540,k:"food",m:"morning",w:"1 h nach Vetmedin"},
{id:"m-th",s:"m",t:"Schilddrüse",d:"1×",tl:"9:00–10:00",a:540,b:600,k:"med"},
{id:"m-di",s:"m",t:"Dimazon",d:"½",c:"#f5f5f5",tl:"9:00–10:00",a:540,b:600,k:"med"},
{id:"m-ka",s:"m",t:"Kalium",d:"1,75 ml",tl:"9:00–10:00",a:540,b:600,k:"med"},
{id:"d-food",s:"d",t:"Mittagessen",tl:"14:00–15:00",a:840,b:900,k:"food",m:"midday"},
{id:"d-ka",s:"d",t:"Kalium",d:"1,75 ml",tl:"15:00–16:00",a:900,b:960,k:"med",u:"2026-08-19",w:"Nur bis inkl. 19.8."},
{id:"d-away",s:"d",t:"Futter weg",tl:"ab ca. 16:00",a:960,b:1020,k:"note"},
{id:"e-vet",s:"e",t:"Vetmedin",d:"3/4",c:"#8B5A2B",tl:"19:30–20:00",a:1170,b:1200,k:"med",w:"Nüchtern – danach 1 h kein Futter"},
{id:"e-food",s:"e",t:"Abendessen",tl:"20:30–21:00",a:1230,b:1260,k:"food",m:"evening",w:"1 h nach Vetmedin"},
{id:"e-th",s:"e",t:"Schilddrüse",d:"1×",tl:"21:00–22:00",a:1260,b:1320,k:"med"},
{id:"e-di",s:"e",t:"Dimazon",d:"½",c:"#f5f5f5",tl:"21:00–22:00",a:1260,b:1320,k:"med"},
{id:"e-be",s:"e",t:"Benazepril",d:"½",c:"#e6c84c",tl:"21:00–22:00",a:1260,b:1320,k:"med"},
{id:"e-cl",s:"e",t:"Clopidogrel",d:"¼",c:"#e89ab0",tl:"21:00–22:00",a:1260,b:1320,k:"med"},
{id:"e-ka",s:"e",t:"Kalium",d:"1,75 ml",tl:"21:00–22:00",a:1260,b:1320,k:"med"},
{id:"e-away",s:"e",t:"Futter nachts weg",tl:"ab ca. 2:00",a:120,b:180,k:"note"}
];
const SEC=[{id:"m",title:"Morgens",hint:"Vetmedin nüchtern · 1 h Pause"},{id:"d",title:"Mittags",hint:"Futter weg ab ca. 16:00"},{id:"e",title:"Abends",hint:"Vetmedin nüchtern · 1 h Pause"}];
let date=dk(),store=load(),notified=new Set();
function parts(d=new Date()){const f=new Intl.DateTimeFormat("en-GB",{timeZone:TZ,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});const p=Object.fromEntries(f.formatToParts(d).map(x=>[x.type,x.value]));return{y:+p.year,m:+p.month,d:+p.day,h:+p.hour,mi:+p.minute}}
function dk(d=new Date()){const p=parts(d);return `${p.y}-${String(p.m).padStart(2,"0")}-${String(p.d).padStart(2,"0")}`}
function mins(d=new Date()){const p=parts(d);return p.h*60+p.mi}
function shift(k,n){const[y,m,d]=k.split("-").map(Number);const t=new Date(Date.UTC(y,m-1,d+n));return `${t.getUTCFullYear()}-${String(t.getUTCMonth()+1).padStart(2,"0")}-${String(t.getUTCDate()).padStart(2,"0")}`}
function long(k){const[y,m,d]=k.split("-").map(Number);return new Intl.DateTimeFormat("de-DE",{timeZone:"UTC",weekday:"long",day:"numeric",month:"long"}).format(new Date(Date.UTC(y,m-1,d,12)))}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return{}}}
function save(){localStorage.setItem(KEY,JSON.stringify(store))}
function empty(dt){return{date:dt,items:{},meals:{morning:{food:"",appetite:"",note:""},midday:{food:"",appetite:"",note:""},evening:{food:"",appetite:"",note:""}},journal:""}}
function day(dt){if(!store[dt])store[dt]=empty(dt);return store[dt]}
function tasks(dt){return T.filter(t=>!t.u||dt<=t.u)}
function overdue(t,dt,n=new Date()){if(dt!==dk(n))return false;if(day(dt).items[t.id]?.done)return false;return mins(n)>t.b+GRACE}
function isNow(t,dt,n=new Date()){if(dt!==dk(n))return false;if(day(dt).items[t.id]?.done)return false;const m=mins(n);return m>=t.a-15&&m<=t.b+10}
function toggle(id){const d=day(date),c=d.items[id]||{done:false},done=!c.done;d.items[id]={...c,done,doneAt:done?new Date().toISOString():undefined};save();render()}
function setMeal(m,p){const d=day(date);d.meals[m]={...d.meals[m],...p};save()}
function setJournal(v){day(date).journal=v;save()}
function doneAt(iso){if(!iso)return"";try{return new Intl.DateTimeFormat("de-DE",{timeZone:TZ,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date(iso))}catch{return""}}
function esc(s){return String(s).replaceAll("&","&").replaceAll("<","<").replaceAll(">",">").replaceAll('"',""")}
function attr(s){return esc(s).replaceAll("'","&#39;")}
function renderTask(t){const d=day(date),it=d.items[t.id]||{},done=!!it.done,od=overdue(t,date),nw=isNow(t,date),meal=t.m?d.meals[t.m]:null;
const sw=t.c?`<span class=\"swatch\" style=\"background:${t.c}\"></span>`:"";
let bd="";if(od)bd+=`<span class=\"badge overdue\">Überfällig</span>`;else if(nw)bd+=`<span class=\"badge now\">Jetzt</span>`;if(done&&it.doneAt)bd+=`<span class=\"badge done-at\">um ${doneAt(it.doneAt)}</span>`;
let notes="";if(t.k==="food"&&meal){const opts=APP.map(o=>`<option value=\"${o.id}\" ${meal.appetite===o.id?"selected":""}>${o.label}</option>`).join("");notes=`<div class=\"notes\"><div class=\"row\"><input data-meal=\"${t.m}\" data-field=\"food\" value=\"${attr(meal.food)}\" placeholder=\"Welches Futter?\" /><select data-meal=\"${t.m}\" data-field=\"appetite\">${opts}</select></div><input data-meal=\"${t.m}\" data-field=\"note\" value=\"${attr(meal.note)}\" placeholder=\"Notiz, z. B. gut gefressen\" /></div>`}
return `<article class=\"task ${done?\"done\":\"\"} ${nw?\"now\":\"\"} ${od?\"overdue\":\"\"}\"><button type=\"button\" class=\"task-main\" data-toggle=\"${t.id}\" aria-pressed=\"${done}\"><span class=\"check\" aria-hidden=\"true\">✓</span><span><span class=\"task-title\">${esc(t.t)} ${bd}</span><span class=\"meta\">${t.d?`<span>${esc(t.d)}</span>`:\"\"}${sw}<span>${esc(t.tl)}</span></span>${t.w&&!done?`<div class=\"warn-text\">${esc(t.w)}</div>`:\"\"}</span></button>${notes}</article>`}
function render(){const ts=tasks(date),today=dk();document.getElementById("titleDate").textContent=date===today?`Heute · ${long(date)}`:long(date);
const done=ts.filter(t=>day(date).items[t.id]?.done).length,pct=ts.length?Math.round(done/ts.length*100):0;
document.getElementById("progressBar").innerHTML=`<span>${done} / ${ts.length}</span><div class=\"bar\"><span style=\"width:${pct}%\"></span></div><span>${pct}%</span>`;
const od=ts.filter(t=>overdue(t,date)),b=document.getElementById("overdueBanner");
if(od.length&&date===today){b.hidden=false;b.innerHTML=`<div>Noch offen / überfällig</div><ul>${od.map(t=>`<li>${esc(t.t)} (${esc(t.tl)})</li>`).join("")}</ul>`;maybeNotify(od)}else{b.hidden=true;b.innerHTML=""}
document.getElementById("board").innerHTML=SEC.map(sec=>{const list=ts.filter(t=>t.s===sec.id);if(!list.length)return"";return `<section class=\"col\"><h2>${sec.title}</h2><p class=\"hint\">${sec.hint}</p>${list.map(renderTask).join("")}</section>`}).join("");
document.getElementById("journal").value=day(date).journal||""}
function maybeNotify(list){if(!("Notification"in window)||Notification.permission!=="granted")return;const k=date+":"+list.map(t=>t.id).join(",");if(notified.has(k))return;notified.add(k);try{new Notification("Kinski – offene Gaben",{body:list.slice(0,3).map(t=>t.t).join(", ")+(list.length>3?" …":""),tag:"kinski-overdue"})}catch{}}
document.getElementById("btnPrev").onclick=()=>{date=shift(date,-1);render()};
document.getElementById("btnNext").onclick=()=>{date=shift(date,1);render()};
document.getElementById("btnToday").onclick=()=>{date=dk();render()};
document.getElementById("btnNotify").onclick=async()=>{if(!("Notification"in window)){alert("Keine Browser-Benachrichtigungen.");return}const p=await Notification.requestPermission();document.getElementById("btnNotify").textContent=p==="granted"?"Erinnerungen an":"Erinnerungen erlauben"};
if("Notification"in window&&Notification.permission==="granted")document.getElementById("btnNotify").textContent="Erinnerungen an";
document.getElementById("board").addEventListener("click",e=>{const b=e.target.closest("[data-toggle]");if(b)toggle(b.getAttribute("data-toggle"))});
document.getElementById("board").addEventListener("input",e=>{const el=e.target;if(el.matches("[data-meal][data-field]"))setMeal(el.getAttribute("data-meal"),{[el.getAttribute("data-field")]:el.value})});
document.getElementById("journal").addEventListener("input",e=>setJournal(e.target.value));
render();setInterval(render,60000);
if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});
})();
