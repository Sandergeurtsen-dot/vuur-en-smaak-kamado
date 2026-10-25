'use strict';

// Extra hulpmiddelen voor inkopen, bewaren en koken. De bestaande lokale opslag blijft bruikbaar.
const AISLES=['Vlees & gevogelte','Vis & zeevruchten','Groente & fruit','Zuivel & eieren','Brood & deeg','Kruiden & specerijen','Sauzen & voorraad','Overig'];
const knownRecipe=id=>RECIPES.find(r=>r.id===id);
const formatNumber=(n,digits=2)=>new Intl.NumberFormat('nl-NL',{maximumFractionDigits:digits}).format(n);

function shoppingAisle(name){
  const n=name.toLocaleLowerCase('nl-NL');
  if(/aluminiumfolie|slagerspapier|rookhout|houten prikker|spiesje/.test(n))return 'Overig';
  if(/hamburgerbrood|tortilla|bloem voor|pizzadeeg|toast/.test(n))return 'Brood & deeg';
  if(/bloemkool|paddenstoel|venkel$|tomaten|broccoli|broccolini|bananen|peren/.test(n))return 'Groente & fruit';
  if(/appelsap|limoensap|citroensap|kokosmelk/.test(n))return 'Sauzen & voorraad';
  if(/^(rode|gele|groene) paprika$|^paprika$|chilipeper$/.test(n))return 'Groente & fruit';
  if(/kruiden|poeder|(^| )peper\b|zout|rub|komijn|kaneel|koriander|peterselie|rozemarijn|tijm|oregano|munt|basilicum|salie|bieslook|chilivlokken|laurier|nootmuskaat|garam masala|dille|ras el hanout|karwijzaad|venkelzaad|vanillestokje|piment/.test(n))return 'Kruiden & specerijen';
  if(/saus|olie|azijn|bouillon|honing|siroop|suiker|mosterd|ketjap|soja|miso|tomatenpuree|passata|bonen|mais uit blik|kappertjes|olijven|rozijnen|noten|sesamzaad|mayonaise|mirin|currypasta|wijn|havervlokken|amandelschaafsel|chocolade|augurk|macaroni|rum|espresso/.test(n))return 'Sauzen & voorraad';
  if(/zalm|forel|kabeljauw|dorade|gamba|garnaal|coquille|tonijn|makreel|makrelen|ansjovis|visfilet|zeevrucht/.test(n))return 'Vis & zeevruchten';
  if(/picanha|bavette|brisket|entrecote|rund|gehakt|rib|tomahawk|t-bone|varken|buikspek|spek|\bham\b|chorizo|salami|kip|kalkoen|lam|ibérico|secreto|karbonade|worst|procureur/.test(n))return 'Vlees & gevogelte';
  if(/yoghurt|melk|room|boter|kaas|mozzarella|feta|halloumi|mascarpone|parmezaan|cheddar|\bei\b|eieren|vanille-ijs|ricotta|crème fraîche/.test(n))return 'Zuivel & eieren';
  if(/tortilla|pitabrood|brood|bloem|meel|deeg|gist|paneermeel/.test(n))return 'Brood & deeg';
  if(/aardappel|ui|knoflook|paprika|tomaat|citroen|limoen|appel|peer|perzik|ananas|banaan|wortel|biet|bimi|asperge|kool|pompoen|aubergine|courgette|portobello|champignon|mais|komkommer|avocado|sla|spinazie|gember|jalapeño|chilipeper|lente-ui|sjalot/.test(n))return 'Groente & fruit';
  return 'Overig';
}
function normalizedShoppingUnit(unit){
  const u=String(unit).trim().toLocaleLowerCase('nl-NL');
  const aliases={kg:['g',1000],kilogram:['g',1000],gram:['g',1],l:['ml',1000],liter:['ml',1000],cl:['ml',10],stuks:['stuk',1],tenen:['teen',1],takjes:['takje',1],plakken:['plak',1],bollen:['bol',1]};
  const [canonical,factor]=aliases[u]||[u,1];
  return {canonical,factor};
}
amountText=function(qty,unit){
  if(qty===null)return unit;
  const forms={stuk:'stuks',teen:'tenen',takje:'takjes',plak:'plakken',bol:'bollen'};
  if(forms[unit]){const n=Math.ceil(qty);return formatNumber(n)+' '+(n===1?unit:forms[unit])}
  if(unit==='g'&&qty>=1000)return formatNumber(qty/1000,3)+' kg';
  if(unit==='ml'&&qty>=1000)return formatNumber(qty/1000,3)+' l';
  return formatNumber(qty)+' '+unit;
};
planItems=function(){
  const groups=new Map();
  for(const r of planRecipes())for(const i of r.ingredients){
    const {canonical,factor}=normalizedShoppingUnit(i.unit);
    const key=i.name.trim().toLocaleLowerCase('nl-NL')+'|'+canonical;
    if(!groups.has(key))groups.set(key,{key,name:i.name,unit:canonical,qty:i.qty===null?null:0,recipes:new Set(),aisle:shoppingAisle(i.name)});
    const item=groups.get(key);
    if(i.qty!==null)item.qty+=i.qty*factor*people(r)/r.base;
    item.recipes.add(r.title);
  }
  return [...groups.values()].sort((a,b)=>AISLES.indexOf(a.aisle)-AISLES.indexOf(b.aisle)||a.name.localeCompare(b.name,'nl'));
};
const aisleGroups=items=>AISLES.map(name=>({name,items:items.filter(i=>i.aisle===name)})).filter(group=>group.items.length);
planText=function(){
  const intro='Boodschappenlijst · Vuur & Smaak\n'+planRecipes().map(r=>r.title+' — '+people(r)+' personen').join('\n');
  return intro+'\n\n'+aisleGroups(planItems()).map(group=>group.name+'\n'+group.items.map(i=>'• '+amountText(i.qty,i.unit)+' '+i.name).join('\n')).join('\n\n');
};
async function copyForUser(value,message,heading='Tekst kopiëren'){
  try{await navigator.clipboard.writeText(value);toast(message)}
  catch{$('#copyDialog h2').textContent=heading;$('#copyText').value=value;$('#copyDialog').showModal();$('#copyText').select()}
}

function parseSharedPlan(){
  const encoded=new URL(location.href).searchParams.get('plan');
  if(!encoded||encoded.length>2500)return null;
  try{
    const bytes=atob(encoded.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-encoded.length%4)%4));
    const entries=JSON.parse(bytes);
    if(!Array.isArray(entries)||!entries.length||entries.length>RECIPES.length)return null;
    const seen=new Set();
    for(const entry of entries){
      if(!Array.isArray(entry)||entry.length!==2||!knownRecipe(entry[0])||!Number.isInteger(entry[1])||entry[1]<1||entry[1]>24||seen.has(entry[0]))return null;
      seen.add(entry[0]);
    }
    return entries;
  }catch{return null}
}
let incomingPlan=parseSharedPlan();
function sharePlanUrl(){
  const url=new URL(location.href);
  const content=btoa(JSON.stringify(planRecipes().map(r=>[r.id,people(r)]))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  url.searchParams.set('plan',content);url.hash='boodschappen';
  return url.toString();
}
async function sharePlan(){
  const url=sharePlanUrl();
  await copyForUser(url,'Deelbare link gekopieerd.','Planlink kopiëren');
}
function exportChoices(){
  const data={format:'vuur-en-smaak',version:1,exportedAt:new Date().toISOString(),favorites:state.favorites,plan:state.plan,people:state.people,checks:state.checks,planChecks:state.planChecks,cookSteps:state.cookSteps};
  const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download='vuur-en-smaak-mijn-recepten.json';document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
  toast('Je favorieten en kookplan zijn opgeslagen als bestand.');
}
function boolMap(value){
  if(!value||typeof value!=='object'||Array.isArray(value))return {};
  return Object.fromEntries(Object.entries(value).slice(0,2000).filter(([key,checked])=>key.length<=200&&checked===true));
}
function importChoices(data){
  if(!data||data.format!=='vuur-en-smaak'||data.version!==1)throw Error('Dit is geen Vuur & Smaak-bestand.');
  state.favorites=Array.isArray(data.favorites)?[...new Set(data.favorites.filter(id=>knownRecipe(id)))]:[];
  state.plan=Array.isArray(data.plan)?[...new Set(data.plan.filter(id=>knownRecipe(id)))]:[];
  state.people={};
  if(data.people&&typeof data.people==='object')for(const [id,value] of Object.entries(data.people))if(knownRecipe(id)&&Number.isInteger(value)&&value>=1&&value<=24)state.people[id]=value;
  state.checks=boolMap(data.checks);state.planChecks=boolMap(data.planChecks);
  state.cookSteps={};
  if(data.cookSteps&&typeof data.cookSteps==='object')for(const [id,value] of Object.entries(data.cookSteps)){const r=knownRecipe(id);if(r&&Number.isInteger(value)&&value>=0&&value<r.steps.length)state.cookSteps[id]=value}
  save();updatePlanCount();drawCards();drawPlan();if(!$('#recipe-view').hidden)drawRecipe();
  toast('Je favorieten, porties en kookplan zijn hersteld.');
}
async function handleImport(input){
  const file=input.files?.[0];if(!file)return;
  try{if(file.size>1024*1024)throw Error('Het bestand is te groot.');importChoices(JSON.parse(await file.text()))}
  catch(error){toast(error instanceof SyntaxError?'Het bestand is geen geldige JSON.':error.message||'Importeren is niet gelukt.')}
  input.value='';
}
function dataTools(){
  return '<section class="data-tools"><div><p class="eyebrow">MEENEMEN & BEWAREN</p><h3>Jouw kookboek blijft van jou.</h3><p>Download je favorieten, porties en kookplan als bestand. Op een ander toestel kun je dat bestand hier weer openen.</p></div><div class="data-buttons"><button id="exportChoices" class="outline" type="button">Bewaar mijn keuzes ↓</button><label class="outline import-label">Herstel mijn keuzes ↑<input id="importChoices" type="file" accept=".json,application/json" aria-label="Herstel eerder opgeslagen keuzes"></label></div></section>';
}
function sharedPlanBanner(){
  if(!incomingPlan)return '';
  const names=incomingPlan.slice(0,4).map(([id,n])=>esc(knownRecipe(id).title)+' ('+n+')').join(' · ');
  return '<div class="shared-plan"><div><p class="eyebrow">GEDEELD KOOKPLAN</p><strong>'+names+(incomingPlan.length>4?' en '+(incomingPlan.length-4)+' andere recepten':'')+'</strong><p>Neem deze gerechten en porties over op dit toestel.</p></div><button id="acceptSharedPlan" class="primary" type="button">Neem plan over →</button></div>';
}
drawPlan=function(){
  const recipes=planRecipes(),items=planItems();
  updatePlanCount();
  let body='';
  if(!recipes.length)body='<div class="plan-empty"><p class="eyebrow">BOODSCHAPPENLIJST</p><h2>Wat komt er op tafel?</h2><p>Open een recept en voeg het toe aan je kookplan. Ingrediënten van meerdere recepten worden hier samengevoegd.</p><a class="primary" href="#collection">Kies recepten →</a></div>';
  else body=`<div class="plan-heading"><div><p class="eyebrow">BOODSCHAPPENLIJST</p><h2>Alles voor jouw BBQ.</h2><p>${recipes.length} ${recipes.length===1?'recept':'recepten'} in je kookplan. Kies per gerecht het aantal personen; gelijke ingrediënten tellen automatisch op. Hele stuks zijn naar boven afgerond voor het inkopen.</p></div><div class="plan-heading-actions"><button id="copyPlan" class="primary" type="button">Kopieer lijst ↗</button><button id="sharePlan" class="outline" type="button">Kopieer planlink ↗</button></div></div><div class="plan-grid"><section class="plan-selection"><h3>Jouw gerechten</h3>${recipes.map(r=>`<div class="plan-recipe"><img src="${esc(PHOTOS[r.id]?.file||'')}" alt="" loading="lazy"><div><a href="#recept/${esc(r.id)}">${esc(r.title)}</a><label>Personen<input type="number" min="1" max="24" step="1" inputmode="numeric" value="${people(r)}" data-plan-people="${esc(r.id)}" aria-label="Personen voor ${esc(r.title)}"></label></div><button type="button" class="plan-remove" data-plan-remove="${esc(r.id)}" aria-label="Verwijder ${esc(r.title)} uit kookplan">×</button></div>`).join('')}<a class="plan-add" href="#collection">+ Nog een recept kiezen</a></section><section class="plan-shopping"><div class="plan-list-head"><h3>Dit heb je nodig</h3><span id="planProgress" class="muted"></span></div>${aisleGroups(items).map(group=>`<div class="plan-aisle"><h4>${esc(group.name)} <span>${group.items.length}</span></h4>${group.items.map(i=>`<label class="plan-item"><input type="checkbox" data-plan-check="${esc(i.key)}" ${state.planChecks[i.key]?'checked':''}><span class="plan-amount">${esc(amountText(i.qty,i.unit))}</span><span>${esc(i.name)}<small>${[...i.recipes].map(esc).join(' · ')}</small></span></label>`).join('')}</div>`).join('')}<button id="clearPlanChecks" class="textbtn" type="button">Vinkjes wissen</button></section></div>`;
  $('#planContent').innerHTML=sharedPlanBanner()+body+dataTools();
  $('#exportChoices').onclick=exportChoices;
  $('#importChoices').onchange=e=>handleImport(e.target);
  if(incomingPlan)$('#acceptSharedPlan').onclick=()=>{
    state.plan=incomingPlan.map(([id])=>id);
    for(const [id,n] of incomingPlan)state.people[id]=n;
    state.planChecks={};incomingPlan=null;save();
    const url=new URL(location.href);url.searchParams.delete('plan');history.replaceState(null,'',url);
    drawPlan();toast('Het gedeelde kookplan is overgenomen.');
  };
  if(!recipes.length)return;
  const progress=()=>{$('#planProgress').textContent=`${items.filter(i=>state.planChecks[i.key]).length} van ${items.length} in huis`};
  $('#copyPlan').onclick=()=>copyForUser(planText(),'Boodschappenlijst gekopieerd.','Boodschappenlijst kopiëren');
  $('#sharePlan').onclick=sharePlan;
  $('#clearPlanChecks').onclick=()=>{items.forEach(i=>delete state.planChecks[i.key]);save();drawPlan()};
  document.querySelectorAll('[data-plan-check]').forEach(input=>input.onchange=()=>{state.planChecks[input.dataset.planCheck]=input.checked;save();progress()});
  document.querySelectorAll('[data-plan-remove]').forEach(button=>button.onclick=()=>{state.plan=state.plan.filter(id=>id!==button.dataset.planRemove);save();drawPlan()});
  document.querySelectorAll('[data-plan-people]').forEach(input=>input.onchange=()=>{
    const n=Number(input.value);
    if(!Number.isInteger(n)||n<1||n>24){input.value=people(knownRecipe(input.dataset.planPeople));toast('Kies 1 tot 24 personen.');return}
    state.people[input.dataset.planPeople]=n;save();drawPlan();
  });
  progress();
};

// Kookstand: de voortgang en eindtijd van de timer staan lokaal opgeslagen.
const originalDrawRecipe=drawRecipe;
drawRecipe=function(){
  originalDrawRecipe();
  const r=recipe(),link=document.createElement('a');
  link.href='#kook/'+r.id;link.className='primary cook-entry';link.textContent='Open kookstand →';
  $('#recipe .facts').after(link);
};
let timerFinishedFor=null;
function currentCookRecipe(){const match=location.hash.match(/^#kook\/([a-z0-9-]+)$/);return match&&knownRecipe(match[1])}
function cookStep(r){const n=Number(state.cookSteps[r.id]);return Number.isInteger(n)&&n>=0&&n<r.steps.length?n:0}
function timeLeft(ms){
  const total=Math.max(0,Math.ceil(ms/1000));
  const h=Math.floor(total/3600),m=Math.floor(total%3600/60),s=total%60;
  return (h?h+':':'')+String(m).padStart(h?2:1,'0')+':'+String(s).padStart(2,'0');
}
function tickTimer(){
  if(state.timer&&Date.now()>=state.timer.deadline){
    timerFinishedFor=state.timer.recipeId;state.timer=null;save();toast('Timer klaar. Controleer het gerecht.');
  }
  const display=$('#cookTimerValue'),r=currentCookRecipe();
  if(!display||!r)return;
  if(state.timer&&state.timer.recipeId===r.id)display.textContent=timeLeft(state.timer.deadline-Date.now());
  else display.textContent=timerFinishedFor===r.id?'Timer klaar':'Geen timer actief';
  const stop=$('#stopCookTimer');if(stop)stop.hidden=!(state.timer&&state.timer.recipeId===r.id);
}
function startTimer(r,minutes){
  if(!Number.isInteger(minutes)||minutes<1||minutes>720){toast('Kies 1 tot 720 minuten.');return}
  timerFinishedFor=null;state.timer={recipeId:r.id,deadline:Date.now()+minutes*60000};save();tickTimer();toast('Timer gestart voor '+minutes+' minuten.');
}
function drawCook(){
  const r=currentCookRecipe();if(!r)return;
  const step=cookStep(r),count=r.steps.length;
  $('#cookContent').innerHTML=`<div class="cook-top"><p class="eyebrow">KOKEN MET VUUR & SMAAK</p><h1>${esc(r.title)}</h1><p class="cook-intro">${esc(r.prep)}</p><div class="cook-facts"><div><small>BBQ</small><strong>${esc(r.temp)}</strong></div><div><small>Kerntemperatuur</small><strong>${esc(r.core)}</strong></div><div><small>Opstelling</small><strong>${esc(r.mode)}</strong></div></div></div><div class="cook-layout"><section id="cookCard" class="cook-card"><div class="cook-step-head"><span>STAP ${step+1} VAN ${count}</span><span>${Math.round((step+1)/count*100)}%</span></div><div class="cook-progress"><span style="width:${(step+1)/count*100}%"></span></div><p class="cook-step-text">${esc(r.steps[step])}</p><div class="cook-nav"><button id="prevCook" class="outline" type="button" ${step===0?'disabled':''}>← Vorige</button><button id="nextCook" class="primary" type="button" ${step===count-1?'disabled':''}>${step===count-2?'Laatste stap →':'Volgende stap →'}</button></div>${step===count-1?'<p class="cook-done">Laatste stap. Controleer de kerntemperatuur en laat het gerecht rusten zoals beschreven.</p>':''}</section><aside class="cook-side"><div class="cook-timer"><p class="eyebrow">TIMER</p><strong id="cookTimerValue">Geen timer actief</strong><p>Stel zelf een tijd in. De eindtijd blijft bewaard als je de app sluit; een melding verschijnt wanneer je de app weer opent.</p><div class="timer-presets">${[5,10,15,30,60].map(n=>`<button type="button" data-timer="${n}">${n} min</button>`).join('')}</div><div class="timer-custom"><input id="customTimer" type="number" min="1" max="720" inputmode="numeric" aria-label="Zelf minuten kiezen" placeholder="Minuten"><button id="startCustomTimer" class="outline" type="button">Start</button></div><button id="stopCookTimer" class="textbtn" type="button" hidden>Stop timer</button></div><div class="cook-air"><h3>Luchtregeling</h3><p>${esc(air(r))}</p></div></aside></div>`;
  $('#prevCook').onclick=()=>{state.cookSteps[r.id]=Math.max(0,step-1);save();drawCook()};
  $('#nextCook').onclick=()=>{state.cookSteps[r.id]=Math.min(count-1,step+1);save();drawCook()};
  document.querySelectorAll('[data-timer]').forEach(button=>button.onclick=()=>startTimer(r,Number(button.dataset.timer)));
  $('#startCustomTimer').onclick=()=>startTimer(r,Number($('#customTimer').value));
  $('#stopCookTimer').onclick=()=>{state.timer=null;timerFinishedFor=null;save();tickTimer()};
  tickTimer();
}
function renderCookRoute(){
  const r=currentCookRecipe(),active=Boolean(r),main=document.querySelector('main');
  main.classList.toggle('cook-open',active);
  $('#cook-view').hidden=!active;
  if(active){$('#backToRecipe').href='#recept/'+r.id;document.title=r.title+' · Kookstand · Vuur & Smaak';drawCook();scrollTo(0,0)}
}
addEventListener('hashchange',renderCookRoute);
const originalSkip=$('.skip').onclick;
$('.skip').onclick=e=>{
  if(!currentCookRecipe())return originalSkip(e);
  e.preventDefault();$('#cook-view').scrollIntoView();$('#cook-view').focus({preventScroll:true});
};
if(location.hash==='#boodschappen')drawPlan();
if(location.hash.startsWith('#recept/'))drawRecipe();
renderCookRoute();
setInterval(tickTimer,1000);
addEventListener('visibilitychange',()=>{if(!document.hidden)tickTimer()});
