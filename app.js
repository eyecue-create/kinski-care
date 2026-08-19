(function(){
var TZ="Europe/Berlin",KEY="kinski-v3",G=20;
var APP=[{id:"",label:"Appetit?"},{id:"none",label:"nichts"},{id:"little",label:"wenig"},{id:"ok",label:"normal"},{id:"good",label:"gut"},{id:"all",label:"alles"}];
var T=[
{id:"m1",s:"m",t:"Vetmedin",d:"3/4",c:"#8B5A2B",tl:"7:30-8:00",a:450,b:480,k:"med",w:"Nüchtern - 1h kein Futter"},
{id:"m2",s:"m",t:"Frühstück",tl:"8:30-9:00",a:510,b:540,k:"food",m:"morning"},
{id:"m3",s:"m",t:"Schilddrüse",d:"1x",tl:"9:00-10:00",a:540,b:600,k:"med"},
{id:"m4",s:"m",t:"Dimazon",d:"1/2",c:"#f5f5f5",tl:"9:00-10:00",a:540,b:600,k:"med"},
{id:"m5",s:"m",t:"Kalium",d:"1,75ml",tl:"9:00-10:00",a:540,b:600,k:"med"},
{id:"d1",s:"d",t:"Mittagessen",tl:"14:00-15:00",a:840,b:900,k:"food",m:"midday"},
{id:"d2",s:"d",t:"Kalium",d:"1,75ml",tl:"15:00-16:00",a:900,b:960,k:"med",u:"2026-08-19",w:"Nur bis 19.8."},
{id:"d3",s:"d",t:"Futter weg",tl:"ab 18:00",a:1080,b:1140,k:"note"},
{id:"e1",s:"e",t:"Vetmedin",d:"3/4",c:"#8B5A2B",tl:"19:30-20:00",a:1170,b:1200,k:"med",w:"Nüchtern - 1h kein Futter"},
{id:"e2",s:"e",t:"Abendessen",tl:"20:30-21:00",a:1230,b:1260,k:"food",m:"evening"},
{id:"e3",s:"e",t:"Schilddrüse",d:"1x",tl:"21:00-22:00",a:1260,b:1320,k:"med"},
{id:"e4",s:"e",t:"Dimazon",d:"1/2",c:"#f5f5f5",tl:"21:00-22:00",a:1260,b:1320,k:"med"},
{id:"e5",s:"e",t:"Benazepril",d:"1/2",c:"#e6c84c",tl:"21:00-22:00",a:1260,b:1320,k:"med"},
{id:"e6",s:"e",t:"Clopidogrel",d:"1/4",c:"#e89ab0",tl:"21:00-22:00",a:1260,b:1320,k:"med"},
{id:"e7",s:"e",t:"Kalium",d:"1,75ml",tl:"21:00-22:00",a:1260,b:1320,k:"med"},
{id:"e8",s:"e",t:"Futter nachts weg",tl:"ab 2:00",a:120,b:180,k:"note"}
];
var SEC=[{id:"m",title:"Morgens",hint:"Vetmedin nüchtern"},{id:"d",title:"Mittags",hint:"Futter weg ab 18:00"},{id:"e",title:"Abends",hint:"Vetmedin nüchtern"}];
var date=dk(),store=load();
function parts(d){d=d||new Date();var f=new Intl.DateTimeFormat("en-GB",{timeZone:TZ,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});var p={};f.formatToParts(d).forEach(function(x){p[x.type]=x.value});return{y:+p.year,m:+p.month,d:+p.day,h:+p.hour,mi:+p.minute};}
function dk(d){var p=parts(d);return p.y+"-"+String(p.m).padStart(2,"0")+"-"+String(p.d).padStart(2,"0");}
function mins(d){var p=parts(d);return p.h*60+p.mi;}
function shift(k,n){var a=k.split("-").map(Number);var t=new Date(Date.UTC(a[0],a[1]-1,a[2]+n));return t.getUTCFullYear()+"-"+String(t.getUTCMonth()+1).padStart(2,"0")+"-"+String(t.getUTCDate()).padStart(2,"0");}
function long(k){var a=k.split("-").map(Number);return new Intl.DateTimeFormat("de-DE",{timeZone:"UTC",weekday:"long",day:"numeric",month:"long"}).format(new Date(Date.UTC(a[0],a[1]-1,a[2],12)));}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"{}");}catch(e){return {};}}
function save(){localStorage.setItem(KEY,JSON.stringify(store));}
function empty(dt){return{date:dt,items:{},meals:{morning:{food:"",appetite:"",note:""},midday:{food:"",appetite:"",note:""},evening:{food:"",appetite:"",note:""}},journal:""};}
function day(dt){if(!store[dt])store[dt]=empty(dt);return store[dt];}
function tasks(dt){return T.filter(function(t){return !t.u||dt<=t.u;});}
function overdue(t,dt,n){n=n||new Date();if(dt!==dk(n))return false;if(day(dt).items[t.id]&&day(dt).items[t.id].done)return false;var m=mins(n);if(t.b<360)return m>t.b+G&&m<360;return m>t.b+G;}
function isNow(t,dt,n){n=n||new Date();if(dt!==dk(n))return false;if(day(dt).items[t.id]&&day(dt).items[t.id].done)return false;var m=mins(n);return m>=t.a-15&&m<=t.b+10;}
function toggle(id){var d=day(date),c=d.items[id]||{done:false},done=!c.done;d.items[id]={done:done,doneAt:done?new Date().toISOString():undefined};save();render();}
function setMeal(m,p){var d=day(date);d.meals[m]=Object.assign({},d.meals[m],p);save();}
function setJournal(v){day(date).journal=v;save();}
function doneAt(iso){if(!iso)return"";try{return new Intl.DateTimeFormat("de-DE",{timeZone:TZ,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date(iso));}catch(e){return "";}}
function esc(s){return String(s).split("&").join("&").split("<").join("<").split(">").join(">").split('"').join(""");}
function attr(s){return esc(s).split("'").join("&#39;");}
function renderTask(t){
var d=day(date),it=d.items[t.id]||{},done=!!it.done,od=overdue(t,date),nw=isNow(t,date),meal=t.m?d.meals[t.m]:null;
var sw=t.c?'<span class="swatch" style="background:'+t.c+'"></span>':"";
var bd="";if(od)bd+='<span class="badge overdue">Überfällig</span>';else if(nw)bd+='<span class="badge now">Jetzt</span>';if(done&&it.doneAt)bd+='<span class="badge done-at">um '+doneAt(it.doneAt)+'</span>';
var notes="";
if(t.k==="food"&&meal){
var opts=APP.map(function(o){return '<option value="'+o.id+'"'+(meal.appetite===o.id?" selected":"")+">"+o.label+"</option>";}).join("");
notes='<div class="notes"><div class="row"><input data-meal="'+t.m+'" data-field="food" value="'+attr(meal.food)+'" placeholder="Welches Futter?" /><select data-meal="'+t.m+'" data-field="appetite">'+opts+'</select></div><input data-meal="'+t.m+'" data-field="note" value="'+attr(meal.note)+'" placeholder="Notiz" /></div>';
}
return '<article class="task '+(done?"done":"")+" "+(nw?"now":"")+" "+(od?"overdue":"")+'"><button type="button" class="task-main" data-toggle="'+t.id+'" aria-pressed="'+done+'"><span class="check">OK</span><span><span class="task-title">'+esc(t.t)+" "+bd+'</span><span class="meta">'+(t.d?"<span>"+esc(t.d)+"</span>":"")+sw+"<span>"+esc(t.tl)+"</span></span>"+(t.w&&!done?'<div class="warn-text">'+esc(t.w)+"</div>":"")+"</span></button>"+notes+"</article>";
}
function render(){
var ts=tasks(date),today=dk();
document.getElementById("titleDate").textContent=date===today?("Heute - "+long(date)):long(date);
var doneC=ts.filter(function(t){return day(date).items[t.id]&&day(date).items[t.id].done;}).length;
var pct=ts.length?Math.round(doneC/ts.length*100):0;
document.getElementById("progressBar").innerHTML="<span>"+doneC+" / "+ts.length+'</span><div class="bar"><span style="width:'+pct+'%"></span></div><span>'+pct+"%</span>";
var od=ts.filter(function(t){return overdue(t,date);}),b=document.getElementById("overdueBanner");
if(od.length&&date===today){b.hidden=false;b.innerHTML="<div>Noch offen / überfällig</div><ul>"+od.map(function(t){return "<li>"+esc(t.t)+" ("+esc(t.tl)+")</li>";}).join("")+"</ul>";}else{b.hidden=true;b.innerHTML="";}
document.getElementById("board").innerHTML=SEC.map(function(sec){var list=ts.filter(function(t){return t.s===sec.id;});if(!list.length)return"";return '<section class="col"><h2>'+sec.title+'</h2><p class="hint">'+sec.hint+"</p>"+list.map(renderTask).join("")+"</section>";}).join("");
document.getElementById("journal").value=day(date).journal||"";
}
document.getElementById("btnPrev").onclick=function(){date=shift(date,-1);render();};
document.getElementById("btnNext").onclick=function(){date=shift(date,1);render();};
document.getElementById("btnToday").onclick=function(){date=dk();render();};
document.getElementById("btnNotify").onclick=async function(){if(!("Notification"in window)){alert("Nicht verfügbar");return;}var p=await Notification.requestPermission();document.getElementById("btnNotify").textContent=p==="granted"?"Erinnerungen an":"Erinnerungen erlauben";};
if("Notification"in window&&Notification.permission==="granted")document.getElementById("btnNotify").textContent="Erinnerungen an";
document.getElementById("board").addEventListener("click",function(e){var b=e.target.closest("[data-toggle]");if(b)toggle(b.getAttribute("data-toggle"));});
document.getElementById("board").addEventListener("input",function(e){var el=e.target;if(el.matches("[data-meal][data-field]")){var o={};o[el.getAttribute("data-field")]=el.value;setMeal(el.getAttribute("data-meal"),o);}});
document.getElementById("journal").addEventListener("input",function(e){setJournal(e.target.value);});
render();
setInterval(render,60000);
if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js").catch(function(){});
})();
