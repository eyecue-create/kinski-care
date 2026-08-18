(()=>{const TZ="Europe/Berlin",KEY="kinski-care-v2",GRACE=20;
const APP=[{id:"",label:"Appetit?"},{id:"none",label:"nichts"},{id:"little",label:"wenig"},{id:"ok",label:"normal"},{id:"good",label:"gut"},{id:"all",label:"alles"}];
const T=[
{id:"m-vet",s:"m",t:"Vetmedin",d:"3/4",c:"#8B5A2B",tl:"7:30-8:00",a:450,b:480,k:"med",w:"Nuechtern - danach 1 h kein Futter"},
{id:"m-food",s:"m",t:"Fruehstueck",tl:"8:30-9:00",a:510,b:540,k:"food",m:"morning",w:"1 h nach Vetmedin"},
{id:"m-th",s:"m",t:"Schilddruese",d:"1x",tl:"9:00-10:00",a:540,b:600,k:"med"},
{id:"m-di",s:"m",t:"Dimazon",d:"1/2",c:"#f5f5f5",tl:"9:00-10:00",a:540,b:600,k:"med"},
{id:"m-ka",s:"m",t:"Kalium",d:"1,75 ml",tl:"9:00-10:00",a:540,b:600,k:"med"},
{id:"d-food",s:"d",t:"Mittagessen",tl:"14:00-15:00",a:840,b:900,k:"food",m:"midday"},
{id:"d-ka",s:"d",t:"Kalium",d:"1,75 ml",tl:"15:00-16:00",a:900,b:960,k:"med",u:"2026-08-19",w:"Nur bis inkl. 19.8."},
{id:"d-away",s:"d",t:"Futter weg",tl:"ab ca. 16:00",a:960,b:1020,k:"note"},
{id:"e-vet",s:"e",t:"Vetmedin",d:"3/4",c:"#8B5A2B",tl:"19:30-20:00",a:1170,b:1200,k:"med",w:"Nuechtern - danach 1 h kein Futter"},
{id:"e-food",s:"e",t:"Abendessen",tl:"20:30-21:00",a:1230,b:1260,k:"food",m:"evening",w:"1 h nach Vetmedin"},
{id:"e-th",s:"e",t:"Schilddruese",d:"1x",tl:"21:00-22:00",a:1260,b:1320,k:"med"},
{id:"e-di",s:"e",t:"Dimazon",d:"1/2",c:"#f5f5f5",tl:"21:00-22:00",a:1260,b:1320,k:"med"},
{id:"e-be",s:"e",t:"Benazepril",d:"1/2",c:"#e6c84c",tl:"21:00-22:00",a:1260,b:1320,k:"med"},
{id:"e-cl",s:"e",t:"Clopidogrel",d:"1/4",c:"#e89ab0",tl:"21:00-22:00",a:1260,b:1320,k:"med"},
{id:"e-ka",s:"e",t:"Kalium",d:"1,75 ml",tl:"21:00-22:00",a:1260,b:1320,k:"med"},
{id:"e-away",s:"e",t:"Futter nachts weg",tl:"ab ca. 2:00",a:120,b:180,k:"note"}
];
const SEC=[{id:"m",title:"Morgens",hint:"Vetmedin nuechtern · 1 h Pause"},{id:"d",title:"Mittags",hint:"Futter weg ab ca. 16:00"},{id:"e",title:"Abends",hint:"Vetmedin nuechtern · 1 h Pause"}];
let date=dk(),store=load(),notified=new Set();
function parts(d){d=d||new Date();var f=new Intl.DateTimeFormat("en-GB",{timeZone:TZ,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});var p={};f.formatToParts(d).forEach(function(x){p[x.type]=x.value});return{y:+p.year,m:+p.month,d:+p.day,h:+p.hour,mi:+p.minute}}
function dk(d){var p=parts(d);return p.y+"-"+String(p.m).padStart(2,"0")+"-"+String(p.d).padStart(2,"0")}
function mins(d){var p=parts(d);return p.h*60+p.mi}
function shift(k,n){var a=k.split("-").map(Number);var t=new Date(Date.UTC(a[0],a[1]-1,a[2]+n));return t.getUTCFullYear()+"-"+String(t.getUTCMonth()+1).padStart(2,"0")+"-"+String(t.getUTCDate()).padStart(2,"0")}
function long(k){var a=k.split("-").map(Number);return new Intl.DateTimeFormat("de-DE",{timeZone:"UTC",weekday:"long",day:"numeric",month:"long"}).format(new Date(Date.UTC(a[0],a[1]-1,a[2],12)))}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return{}}}
function save(){localStorage.setItem(KEY,JSON.stringify(store))}
function empty(dt){return{date:dt,items:{},meals:{morning:{food:"",appetite:"",note:""},midday:{food:"",appetite:"",note:""},evening:{food:"",appetite:"",note:""}},journal:""}}
function day(dt){if(!store[dt])store[dt]=empty(dt);return store[dt]}
function tasks(dt){return T.filter(function(t){return !t.u||dt<=t.u})}
function overdue(t,dt,n){n=n||new Date();if(dt!==dk(n))return false;if(day(dt).items[t.id]&&day(dt).items[t.id].done)return false;var m=mins(n);if(t.b<360){return m>t.b+GRACE&&m<360}return m>t.b+GRACE}
function isNow(t,dt,n){n=n||new Date();if(dt!==dk(n))return false;if(day(dt).items[t.id]&&day(dt).items[t.id].done)return false;var m=mins(n);return m>=t.a-15&&m<=t.b+10}
function toggle(id){var d=day(date),c=d.items[id]||{done:false},done=!c.done;d.items[id]={done:done,doneAt:done?new Date().toISOString():undefined};save();render()}
function setMeal(m,p){var d=day(date);d.meals[m]=Object.assign({},d.meals[m],p);save()}
function setJournal(v){day(date).journal=v;save()}
function doneAt(iso){if(!iso)return"";try{return new Intl.DateTimeFormat("de-DE",{timeZone:TZ,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date(iso))}catch(e){return""}}
function esc(s){return String(s).replace(/&/g,"&").replace(/</g,"<").replace(/>/g,">").replace(/"/g,""")}
function attr(s){return esc(s).replace(/'/g,"&#39;")}
function renderTask(t){
var d=day(date),it=d.items[t.id]||{},done=!!it.done,od=overdue(t,date),nw=isNow(t,date),meal=t.m?d.meals[t.m]:null;
var sw=t.c?'<span class="swatch" style="background:'+t.c+'"></span>':"";
var bd="";if(od)bd+='<span class="badge overdue">Ueberfaellig</span>';else if(nw)bd+='<span class="badge now">Jetzt</span>';if(done&&it.doneAt)bd+='<span class="badge done-at">um '+doneAt(it.doneAt)+'</span>';
var notes="";
if(t.k==="food"&&meal){
var opts=APP.map(function(o){return '<option value="'+o.id+'"'+(meal.appetite===o.id?' selected':'')+'>'+o.label+'</option>'}).join("");
notes='<div class="notes"><div class="row"><input data-meal="'+t.m+'" data-field="food" value="'+attr(meal.food)+'" placeholder="Welches Futter?" /><select data-meal="'+t.m+'" data-field="appetite">'+opts+'</select></div><input data-meal="'+t.m+'" data-field="note" value="'+attr(meal.note)+'" placeholder="Notiz, z. B. gut gefressen" /></div>';
}
return '<article class="task '+(done?"done":"")+" "+(nw?"now":"")+" "+(od?"overdue":"")+'"><button type="button" class="task-main" data-toggle="'+t.id+'" aria-pressed="'+done+'"><span class="check" aria-hidden="true">✓</span><span><span class="task-title">'+esc(t.t)+" "+bd+'</span><span class="meta">'+(t.d?"<span>"+esc(t.d)+"</span>":"")+sw+"<span>"+esc(t.tl)+"</span></span>"+(t.w&&!done?'<div class="warn-text">'+esc(t.w)+"</div>":"")+"</span></button>"+notes+"</article>";
}
function render(){
var ts=tasks(date),today=dk();
document.getElementById("titleDate").textContent=date===today?("Heute · "+long(date)):long(date);
var doneC=ts.filter(function(t){return day(date).items[t.id]&&day(date).items[t.id].done}).length;
var pct=ts.length?Math.round(doneC/ts.length*100):0;
document.getElementById("progressBar").innerHTML="<span>"+doneC+" / "+ts.length+'</span><div class="bar"><span style="width:'+pct+'%"></span></div><span>'+pct+"%</span>";
var od=ts.filter(function(t){return overdue(t,date)}),b=document.getElementById("overdueBanner");
if(od.length&&date===today){b.hidden=false;b.innerHTML="<div>Noch offen / ueberfaellig</div><ul>"+od.map(function(t){return "<li>"+esc(t.t)+" ("+esc(t.tl)+")</li>"}).join("")+"</ul>";maybeNotify(od)}else{b.hidden=true;b.innerHTML=""}
document.getElementById("board").innerHTML=SEC.map(function(sec){var list=ts.filter(function(t){return t.s===sec.id});if(!list.length)return"";return '<section class="col"><h2>'+sec.title+'</h2><p class="hint">'+sec.hint+"</p>"+list.map(renderTask).join("")+"</section>"}).join("");
document.getElementById("journal").value=day(date).journal||"";
}
function maybeNotify(list){if(!("Notification"in window)||Notification.permission!=="granted")return;var k=date+":"+list.map(function(t){return t.id}).join(",");if(notified.has(k))return;notified.add(k);try{new Notification("Kinski - offene Gaben",{body:list.slice(0,3).map(function(t){return t.t}).join(", ")+(list.length>3?" ...":""),tag:"kinski-overdue"})}catch(e){}}
document.getElementById("btnPrev").onclick=function(){date=shift(date,-1);render()};
document.getElementById("btnNext").onclick=function(){date=shift(date,1);render()};
document.getElementById("btnToday").onclick=function(){date=dk();render()};
document.getElementById("btnNotify").onclick=async function(){if(!("Notification"in window)){alert("Keine Browser-Benachrichtigungen.");return}var p=await Notification.requestPermission();document.getElementById("btnNotify").textContent=p==="granted"?"Erinnerungen an":"Erinnerungen erlauben"};
if("Notification"in window&&Notification.permission==="granted")document.getElementById("btnNotify").textContent="Erinnerungen an";
document.getElementById("board").addEventListener("click",function(e){var b=e.target.closest("[data-toggle]");if(b)toggle(b.getAttribute("data-toggle"))});
document.getElementById("board").addEventListener("input",function(e){var el=e.target;if(el.matches("[data-meal][data-field]")){var o={};o[el.getAttribute("data-field")]=el.value;setMeal(el.getAttribute("data-meal"),o)}});
document.getElementById("journal").addEventListener("input",function(e){setJournal(e.target.value)});
render();setInterval(render,60000);
if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js").catch(function(){});
})();
