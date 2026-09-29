const views=["home","people","reminders","payments"];
function applyView(v){
  if(!views.includes(v))v="home";
  document.body.dataset.view=v;
  document.body.classList.remove("splash-open");
  document.querySelectorAll(".tab[data-tab]").forEach(t=>t.classList.toggle("active",(t.dataset.tab==="overview"?"home":t.dataset.tab)===v));
  document.querySelectorAll(".top-links [data-tab]").forEach(t=>t.classList.toggle("active",t.dataset.tab===v));
  window.scrollTo(0,0);
}
function goView(v){if(location.hash==="#"+v)applyView(v);else location.hash=v}
window.addEventListener("hashchange",()=>applyView(location.hash.slice(1)));
document.addEventListener("click",e=>{
  const t=e.target.closest("[data-landing-target],.tab[data-tab],.top-links [data-tab],#homeBrand,#appHome,#enterApp,#landingReminder");
  if(!t)return;
  if(t.dataset.landingTarget)return goView(t.dataset.landingTarget);
  if(t.dataset.tab)return goView(t.dataset.tab==="overview"?"home":t.dataset.tab);
  if(t.id==="homeBrand"||t.id==="appHome")return goView("home");
  if(t.id==="enterApp")return goView("people");
  if(t.id==="landingReminder")return goView("reminders");
});
applyView(location.hash.slice(1));
const APP_VERSION = "2.0";
const KEY = "music-money-v1"; // Keep unchanged so v2.0 preserves all existing user data.
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const markerByMonth = {January:"🛁",February:"",March:"",April:"🛩️",May:"",June:"",July:"🎰",August:"🪽",September:"🐍",October:"🦉",November:"",December:""};
const defaultData = {
  accounts:[{id:"account-1",name:"Account 1",monthlyDefault:15},{id:"account-2",name:"Account 2",monthlyDefault:15}],
  members:[
    {id:"m1",name:"AARON",accountId:"account-1",monthlyPrice:15,marker:"🛩️",markerMonth:"April",markerYear:2026,monthsPaid:1,reminderTone:"male",paysFor:[]},
    {id:"m2",name:"DORCAS",accountId:"account-1",monthlyPrice:15,marker:"🪽",markerMonth:"August",markerYear:2026,monthsPaid:1,reminderTone:"female",paysFor:[]},
    {id:"m3",name:"AMA’S SISTER",accountId:"account-1",monthlyPrice:15,marker:"🐍",markerMonth:"September",markerYear:2026,monthsPaid:1,reminderTone:"female",paidBy:"m9",paysFor:[]},
    {id:"m4",name:"ASARE",accountId:"account-1",monthlyPrice:15,marker:"🦉",markerMonth:"October",markerYear:2026,monthsPaid:1,reminderTone:"male",paysFor:[]},
    {id:"m5",name:"BROBBEY",accountId:"account-1",monthlyPrice:15,marker:"🪽",markerMonth:"August",markerYear:2026,monthsPaid:1,reminderTone:"male",paysFor:[]},
    {id:"m6",name:"HEINRICH",accountId:"account-1",monthlyPrice:15,marker:"🪽",markerMonth:"August",markerYear:2026,monthsPaid:1,reminderTone:"male",paysFor:[]},
    {id:"m7",name:"MINE",accountId:"account-2",monthlyPrice:15,marker:"🦉",markerMonth:"October",markerYear:2026,monthsPaid:1,reminderTone:"male",paysFor:[]},
    {id:"m8",name:"BEN",accountId:"account-2",monthlyPrice:15,marker:"🦉",markerMonth:"October",markerYear:2026,monthsPaid:1,reminderTone:"male",paysFor:[]},
    {id:"m9",name:"AMA",accountId:"account-2",monthlyPrice:15,marker:"🐍",markerMonth:"September",markerYear:2026,monthsPaid:1,reminderTone:"female",paysFor:["m3"]},
    {id:"m10",name:"QUOLEGEO",accountId:"account-2",monthlyPrice:15,marker:"🪽",markerMonth:"August",markerYear:2026,monthsPaid:1,reminderTone:"male",paysFor:[]},
    {id:"m11",name:"JOSEPH",accountId:"account-2",monthlyPrice:15,marker:"🦉",markerMonth:"October",markerYear:2026,monthsPaid:1,reminderTone:"male",paysFor:[]},
    {id:"m12",name:"JUSTICE",accountId:"account-2",monthlyPrice:15,marker:"🦉",markerMonth:"October",markerYear:2026,monthsPaid:1,reminderTone:"male",paysFor:[]}
  ],payments:[]
};
const $=id=>document.getElementById(id);
const money=n=>`GH₵${Number(n||0).toLocaleString("en-GH",{minimumFractionDigits:0,maximumFractionDigits:2})}`;
const monthKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
const uid=p=>`${p}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
const monthIndex=(year,month0)=>Number(year)*12+Number(month0);
let viewedMonth=new Date(2026,9,1);

function loadData(){
  try{
    const saved=JSON.parse(localStorage.getItem(KEY));
    if(saved&&Array.isArray(saved.accounts)&&Array.isArray(saved.members)&&Array.isArray(saved.payments)){
      const merged=structuredClone(saved);
      defaultData.accounts.forEach(a=>{if(!merged.accounts.some(x=>x.id===a.id))merged.accounts.push(structuredClone(a))});
      const seen=new Set(merged.members.map(m=>String(m.name).toLowerCase()));
      defaultData.members.forEach(m=>{if(!merged.members.some(x=>x.id===m.id)&&!seen.has(m.name.toLowerCase()))merged.members.push(structuredClone(m))});
      merged.members.forEach(m=>{
        if(m.id==="m2"&&/^dorcas/i.test(m.name))m.name="DORCAS";
        if(m.id==="m12"&&/^justice/i.test(m.name))m.name="JUSTICE";
        m.name=String(m.name||"").trim().toUpperCase();
        const d=defaultData.members.find(x=>x.id===m.id)||{};
        m.accountId=m.accountId||d.accountId||merged.accounts[0].id;
        m.monthlyPrice=Number(m.monthlyPrice??d.monthlyPrice??15);
        m.markerMonth=m.markerMonth||d.markerMonth||"October";
        m.markerYear=Number(m.markerYear||2026);
        m.monthsPaid=Math.max(1,Number(m.monthsPaid||1));
        m.reminderTone=m.reminderTone||d.reminderTone||"male";
        m.paysFor=Array.isArray(m.paysFor)?m.paysFor:(d.paysFor||[]);
      });
      return merged;
    }
  }catch(e){console.error("Music Money: could not read saved data",e)}
  return structuredClone(defaultData);
}
let data=loadData();
function saveData(){localStorage.setItem(KEY,JSON.stringify(data));}
function member(id){return data.members.find(m=>m.id===id)}
function account(id){return data.accounts.find(a=>a.id===id)}
function markerForMonth(name){return markerByMonth[name]||""}
function monthLabelFromKey(k){if(!k)return "Not recorded";const [y,m]=k.split("-").map(Number);return `${monthNames[m-1]} ${y}`}
function lastPaidLabel(m){
  if(m.markerMonth)return `${m.markerMonth} ${m.markerYear||2026}`;
  const p=data.payments.filter(x=>x.memberId===m.id).sort((a,b)=>(b.date||"").localeCompare(a.date||""))[0];
  return p?.month?monthLabelFromKey(p.month):"Not recorded";
}
function lastPaidIndex(m){
  if(m.markerMonth)return monthIndex(Number(m.markerYear||2026),monthNames.indexOf(m.markerMonth));
  const p=data.payments.filter(x=>x.memberId===m.id).sort((a,b)=>(b.date||"").localeCompare(a.date||""))[0];
  if(!p?.month)return null;
  const [y,mo]=p.month.split("-").map(Number);return monthIndex(y,mo-1);
}
function unpaidMonthsFor(m,mk=monthKey(viewedMonth)){
  const [y,mo]=mk.split("-").map(Number);const end=monthIndex(y,mo-1);const last=lastPaidIndex(m);
  if(last===null)return [mk];
  const out=[];for(let idx=last+1;idx<=end;idx++){const yy=Math.floor(idx/12),mm=idx%12;out.push(`${yy}-${String(mm+1).padStart(2,"0")}`)}return out;
}
function settlementDebt(m,mk=monthKey(viewedMonth)){return unpaidMonthsFor(m,mk).length*Number(m.monthlyPrice||15)}
function totalDebtForMember(m,mk=monthKey(viewedMonth)){return settlementDebt(m,mk)}
function currentTotals(mk){
  let outstanding=0,collected=0,credit=0,paidCount=0,dueCount=0;
  data.members.forEach(m=>{const debt=totalDebtForMember(m,mk);outstanding+=debt;if(debt<=0)paidCount++;else dueCount++});
  data.payments.filter(p=>p.month===mk).forEach(p=>collected+=Number(p.amount||0));
  return {outstanding,collected,credit,paidCount,dueCount};
}

function initDuoGallery(){
  const photos=[...document.querySelectorAll(".duo-photo")],dots=[...document.querySelectorAll(".duo-photo-dots i")];
  if(!photos.length)return;
  let index=0;
  setInterval(()=>{
    photos[index].classList.remove("is-active");dots[index]?.classList.remove("active");
    index=(index+1)%photos.length;
    photos[index].classList.add("is-active");dots[index]?.classList.add("active");
  },4500);
}

function render(){
  const mk=monthKey(viewedMonth),t=currentTotals(mk);
  $("monthTitle").textContent=`${monthNames[viewedMonth.getMonth()]} ${viewedMonth.getFullYear()}`;
  $("outstandingTotal").textContent=money(t.outstanding);$("collectedTotal").textContent=money(t.collected);$("creditTotal").textContent=money(t.credit);$("memberTotal").textContent=data.members.length;
  $("paidCount").textContent=`${t.paidCount} paid`;$("dueCount").textContent=`${t.dueCount} outstanding`;
  const heroTotal=$("heroOutstanding");if(heroTotal)heroTotal.textContent=money(t.outstanding); // landing-page element; gone once the app is entered
  renderAccounts(mk);renderPeople(mk);renderPayments(mk);renderReminders(mk);populateMemberSelects();
}
function renderAccounts(mk){
  $("accountsList").innerHTML=data.accounts.map(a=>{const people=data.members.filter(m=>m.accountId===a.id),debt=people.reduce((s,m)=>s+totalDebtForMember(m,mk),0),paid=people.filter(m=>totalDebtForMember(m,mk)<=0).length;return `<button class="account-card" data-account="${a.id}"><div><h3>${escapeHtml(a.name)}</h3><div class="sub">${people.length} members · ${paid} settled</div></div><div class="account-right"><strong>${money(debt)}</strong><div class="sub">total debt</div></div><div class="chevron">›</div></button>`}).join("")||`<div class="empty">No accounts yet.</div>`;
  document.querySelectorAll("[data-account]").forEach(b=>b.onclick=()=>{$("searchInput").value="";renderPeople(mk,b.dataset.account);scrollToId("peopleSection")});
}
function renderPeople(mk,filter=null){
  const q=$("searchInput").value.trim().toLowerCase(),accounts=filter?data.accounts.filter(a=>a.id===filter):data.accounts;
  $("peopleList").innerHTML=accounts.map(a=>{const people=data.members.filter(m=>m.accountId===a.id&&(!q||m.name.toLowerCase().includes(q)));if(!people.length)return "";return `<div class="account-people"><div class="people-group-title"><span>${escapeHtml(a.name)}</span><small>${people.length} members</small></div>${people.map(m=>{const debt=totalDebtForMember(m,mk),settled=debt<=0;return `<button class="person-row ${settled?"is-settled":""}" data-member="${m.id}"><div class="person-main"><h3 class="person-name">${escapeHtml(m.name)}</h3><div class="sub">Last paid · ${escapeHtml(lastPaidLabel(m))}</div></div><div class="debt-badge"><small>${settled?"Settled":"Outstanding"}</small><strong>${money(debt)}</strong></div><div class="row-chevron">›</div></button>`}).join("")}</div>`}).join("")||`<div class="empty">No members found.</div>`;
  document.querySelectorAll("[data-member]").forEach(b=>b.onclick=()=>openMemberDetail(b.dataset.member));
}
function renderPayments(mk){
  const payments=data.payments.filter(p=>p.month===mk).sort((a,b)=>(b.date||"").localeCompare(a.date||""));
  $("paymentsList").innerHTML=payments.length?payments.map(p=>{const m=member(p.memberId);return `<div class="payment-row"><div><strong>${escapeHtml(m?.name||"Unknown")}</strong><div class="sub">${p.date||monthLabelFromKey(p.month)}${p.monthsPaid?` · ${p.monthsPaid} month${p.monthsPaid===1?"":"s"}`:""}</div></div><strong>${money(p.amount)}</strong></div>`}).join(""):`<div class="empty">No payments recorded for this month.</div>`;
}
function reminderGroup(payer,mk){
  const people=[payer,...(payer.paysFor||[]).map(member).filter(Boolean)];
  const duePeople=people.filter(m=>unpaidMonthsFor(m,mk).length);
  if(!duePeople.length)return null;
  const allMonths=[...new Set(duePeople.flatMap(m=>unpaidMonthsFor(m,mk)))].sort();
  const total=duePeople.reduce((sum,m)=>sum+unpaidMonthsFor(m,mk).length*Number(m.monthlyPrice||15),0);
  return {payer,people:duePeople,months:allMonths,total};
}
function formatMonthList(keys){
  const labels=keys.map(monthLabelFromKey).map(x=>x.replace(/ \d{4}$/,""));
  if(labels.length<=1)return labels[0]||"";if(labels.length===2)return `${labels[0]} and ${labels[1]}`;return `${labels.slice(0,-1).join(", ")} and ${labels.at(-1)}`;
}
function reminderMessage(group){
  const {payer,people,months,total}=group;const monthText=formatMonthList(months);const lastLabels=[...new Set(people.map(m=>lastPaidLabel(m).replace(/ \d{4}$/,"")))];
  const lastText=lastLabels.length===1?lastLabels[0]:lastLabels.join(" and ");
  const extras="";
  const polite=payer.reminderTone==="female";
  if(polite)return `Hello ${niceName(payer.name)}, please the Apple Music is up. Last payment was for ${lastText}, so it’ll be ${money(total)} for ${monthText}${extras}.`;
  return `Gee, the Apple Music is up. Last payment was for ${lastText}, so it’ll be ${money(total)} for ${monthText}${extras}.`;
}
function renderReminders(mk){
  const groups=data.members.filter(m=>!m.paidBy).map(m=>reminderGroup(m,mk)).filter(Boolean);
  $("reminderList").innerHTML=groups.length?groups.map((g,i)=>{const message=reminderMessage(g);const last=[...new Set(g.people.map(lastPaidLabel))].join(" · ");return `<article class="reminder-card" data-reminder-card><button type="button" class="reminder-summary" data-reminder-toggle aria-expanded="false"><div><div class="reminder-name">${escapeHtml(g.payer.name)}</div><div class="reminder-meta">Last paid · ${escapeHtml(last)}</div><div class="reminder-due">${escapeHtml(formatMonthList(g.months))}</div></div><div class="reminder-summary-right"><div class="reminder-amount">${money(g.total)}</div><span class="reminder-chevron">⌄</span></div></button><div class="reminder-details"><div class="reminder-message">${escapeHtml(message)}</div><button class="whatsapp-button" data-whatsapp="${encodeURIComponent(message)}">Send on WhatsApp</button><button class="save-button secondary mark-paid-button" data-markpaid="${g.payer.id}">Mark paid</button></div></article>`}).join(""):`<div class="empty">Everyone is up to date.</div>`;
  document.querySelectorAll("[data-reminder-toggle]").forEach(b=>b.onclick=()=>{const card=b.closest("[data-reminder-card]"),open=card.classList.toggle("is-expanded");b.setAttribute("aria-expanded",String(open))});
  document.querySelectorAll("[data-markpaid]").forEach(b=>b.onclick=()=>markGroupPaid(b.dataset.markpaid));
  document.querySelectorAll("[data-whatsapp]").forEach(b=>b.onclick=()=>{const message=decodeURIComponent(b.dataset.whatsapp);window.location.href=`https://wa.me/?text=${encodeURIComponent(message)}`});
}
function populateMemberSelects(){
  $("paymentMember").innerHTML=data.members.map(m=>`<option value="${m.id}">${escapeHtml(m.name)}</option>`).join("");
  $("memberAccount").innerHTML=data.accounts.map(a=>`<option value="${a.id}">${escapeHtml(a.name)}</option>`).join("");
}
function openSheet(id){$("backdrop").classList.add("show");$(id).classList.add("show");$(id).setAttribute("aria-hidden","false")}
function closeSheets(){document.querySelectorAll(".sheet.show").forEach(s=>{s.classList.remove("show");s.setAttribute("aria-hidden","true")});$("backdrop").classList.remove("show")}
function openPaymentSheet(memberId=null){$("paymentForm").reset();populateMemberSelects();$("paymentMember").value=memberId||data.members[0]?.id||"";$("paymentMonth").value=monthKey(viewedMonth);$("paymentDate").value=new Date().toISOString().slice(0,10);$("paymentMonthsPaid").value=1;$("paymentAmount").readOnly=true;updatePaymentAmount();openSheet("paymentSheet")}
function updatePaymentAmount(){const m=member($("paymentMember").value),n=Number($("paymentMonthsPaid").value||1);$("paymentAmount").value=(Number(m?.monthlyPrice||15)*n).toFixed(2)}
function openMemberSheet(id=null){$("memberForm").reset();$("memberForm").dataset.editing=id||"";$("memberSheetTitle").textContent=id?"Edit member":"Add member";populateMemberSelects();if(id){const m=member(id);$("memberName").value=m.name;$("memberAccount").value=m.accountId;$("memberPrice").value=m.monthlyPrice;$("memberMarker").value=m.marker||""}else $("memberPrice").value=15;openSheet("memberSheet")}
function openAccountsSheet(){renderAccountEditor();openSheet("accountsSheet")}
function renderAccountEditor(){
  $("accountEditor").innerHTML=data.accounts.map(a=>`<div class="editor-row"><input data-account-name="${a.id}" value="${escapeAttr(a.name)}" maxlength="40"><button class="danger" data-delete-account="${a.id}">Delete</button></div>`).join("");
  $("accountEditor").querySelectorAll("[data-account-name]").forEach(i=>i.onchange=()=>{const a=account(i.dataset.accountName);if(a){a.name=i.value.trim()||a.name;saveData();render()}});
  $("accountEditor").querySelectorAll("[data-delete-account]").forEach(b=>b.onclick=()=>{if(data.accounts.length<=1)return toast("Keep at least one account.");if(data.members.some(m=>m.accountId===b.dataset.deleteAccount))return toast("Move or delete its members first.");data.accounts=data.accounts.filter(a=>a.id!==b.dataset.deleteAccount);saveData();renderAccountEditor();render()});
}
function openMemberDetail(id){
  const m=member(id);if(!m)return;
  $("detailName").textContent=m.name;
  const mk=monthKey(viewedMonth),debt=totalDebtForMember(m,mk),paidCount=Math.max(1,Math.min(12,Number(m.monthsPaid||1))),paidYear=Number(m.markerYear||new Date().getFullYear());
  const years=[...new Set([paidYear-2,paidYear-1,paidYear,new Date().getFullYear(),new Date().getFullYear()+1,new Date().getFullYear()+2])].sort((a,b)=>a-b);
  $("memberDetail").innerHTML=`<div class="detail-summary"><div class="detail-box"><span>${monthNames[viewedMonth.getMonth()]} debt</span><strong>${money(debt)}</strong></div><div class="detail-box"><span>Last paid</span><strong>${escapeHtml(lastPaidLabel(m))}</strong></div></div><div class="control-card"><div class="control-title"><div><b>Payment status</b><small>Set how many months were paid and the month the payment covered through.</small></div><strong id="coverageAmount">${money(paidCount*Number(m.monthlyPrice||15))}</strong></div><div class="coverage-label">MONTHS PAID</div><div class="month-picker" id="monthPicker">${Array.from({length:12},(_,i)=>`<button type="button" class="month-choice ${i+1===paidCount?"selected":""}" data-months="${i+1}">${i+1}<small>${i===0?"month":"months"}</small></button>`).join("")}</div><div class="coverage-label">LAST PAID THROUGH</div><div class="date-picker-row"><label class="detail-label">Month<select id="lastPaidMonth">${monthNames.map((n,i)=>`<option value="${i}" ${n===m.markerMonth?"selected":""}>${n}</option>`).join("")}</select></label><label class="detail-label">Year<select id="lastPaidYear">${years.map(y=>`<option value="${y}" ${y===paidYear?"selected":""}>${y}</option>`).join("")}</select></label></div><button class="save-button" id="saveCoverage">Save payment status</button></div><button class="save-button secondary" id="detailEditMember">Edit member details</button><div class="detail-actions"><button class="text-button" id="detailAddPayment">Advanced payment entry</button></div><div class="eyebrow history-label">PAYMENT HISTORY</div><div>${data.payments.filter(p=>p.memberId===m.id).sort((a,b)=>(b.date||"").localeCompare(a.date||"")).map(p=>`<div class="history-row"><div><strong>${escapeHtml(p.date||monthLabelFromKey(p.month))}</strong><small>${escapeHtml(monthLabelFromKey(p.month||mk))}${p.monthsPaid?` · ${p.monthsPaid} month${p.monthsPaid===1?"":"s"}`:""}</small></div><strong>${money(p.amount)}</strong></div>`).join("")||`<div class="empty">No payment records yet.</div>`}</div>`;
  let selected=paidCount;
  const amountEl=$("coverageAmount");
  document.querySelectorAll(".month-choice").forEach(b=>b.onclick=()=>{selected=Number(b.dataset.months);document.querySelectorAll(".month-choice").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");amountEl.textContent=money(selected*Number(m.monthlyPrice||15))});
  $("saveCoverage").onclick=()=>{const idx=Number($("lastPaidMonth").value),year=Number($("lastPaidYear").value),name=monthNames[idx];m.monthsPaid=selected;m.markerMonth=name;m.markerYear=year;m.marker=markerForMonth(name);const target=`${year}-${String(idx+1).padStart(2,"0")}`;data.payments=data.payments.filter(p=>!(p.memberId===m.id&&p.coverage===true));data.payments.push({id:uid("pay"),memberId:m.id,amount:selected*Number(m.monthlyPrice||15),month:target,date:`${target}-01`,monthsPaid:selected,coverage:true,note:"Payment coverage"});saveData();closeSheets();render();toast(`${m.name} updated · ${selected} month${selected===1?"":"s"} paid through ${name} ${year}`)};
  $("detailEditMember").onclick=()=>{closeSheets();openMemberSheet(id)};$("detailAddPayment").onclick=()=>{closeSheets();openPaymentSheet(id)};openSheet("memberDetailSheet");
}
function niceName(name){return cleanName(name).toLowerCase().replace(/(^|[\s\u2019'-])(\p{L})/gu,(m,a,b)=>a+b.toUpperCase())}
function cleanName(name){return String(name||"").replace(/[-_].*$/g,"").trim().replace(/\b\d+(st|nd|rd|th)\b/gi,"").trim()}
function scrollToId(id){$(id)?.scrollIntoView({behavior:"smooth",block:"start"})}

$("paymentMember").addEventListener("change",updatePaymentAmount);$("paymentMonthsPaid").addEventListener("change",updatePaymentAmount);
$("paymentForm").addEventListener("submit",e=>{e.preventDefault();const memberId=$("paymentMember").value,amount=Number($("paymentAmount").value),months=Number($("paymentMonthsPaid").value||1);if(!memberId||amount<=0)return;const m=member(memberId);data.payments.push({id:uid("pay"),memberId,amount,month:$("paymentMonth").value,date:$("paymentDate").value,monthsPaid:months,note:$("paymentNote").value.trim()});m.monthsPaid=months;saveData();closeSheets();viewedMonth=new Date(Number($("paymentMonth").value.slice(0,4)),Number($("paymentMonth").value.slice(5,7))-1,1);render();toast(`${money(amount)} recorded for ${m.name}`)});
$("memberForm").addEventListener("submit",e=>{e.preventDefault();const editing=$("memberForm").dataset.editing,payload={name:$("memberName").value.trim().toUpperCase(),accountId:$("memberAccount").value,monthlyPrice:Number($("memberPrice").value),marker:$("memberMarker").value};if(!payload.name||payload.monthlyPrice<0)return;if(editing)Object.assign(member(editing),payload);else data.members.push({id:uid("member"),...payload,markerMonth:"October",markerYear:2026,monthsPaid:1,reminderTone:"male",paysFor:[]});saveData();closeSheets();render();toast(editing?"Member updated":"Member added")});
$("addAccountButton").onclick=()=>{data.accounts.push({id:uid("account"),name:`Account ${data.accounts.length+1}`,monthlyDefault:15});saveData();renderAccountEditor();render()};
$("searchInput").addEventListener("input",()=>renderPeople(monthKey(viewedMonth)));$("clearSearch").onclick=()=>{$("searchInput").value="";renderPeople(monthKey(viewedMonth));$("searchInput").focus()};
$("prevMonth").onclick=()=>{viewedMonth=new Date(viewedMonth.getFullYear(),viewedMonth.getMonth()-1,1);render()};$("nextMonth").onclick=()=>{viewedMonth=new Date(viewedMonth.getFullYear(),viewedMonth.getMonth()+1,1);render()};$("monthTitle").onclick=()=>{viewedMonth=new Date(2026,9,1);render()};
$("addMember").onclick=()=>openMemberSheet();$("manageAccounts").onclick=()=>openAccountsSheet();$("settingsTab").onclick=()=>openAccountsSheet();
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeSheets);$("backdrop").onclick=closeSheets;

function markGroupPaid(payerId){
  const mk=monthKey(viewedMonth),payer=member(payerId);if(!payer)return;
  const group=reminderGroup(payer,mk);if(!group)return toast("Already up to date");
  if(!confirm(`Mark ${group.people.map(p=>cleanName(p.name)||p.name).join(" & ")} as paid through ${monthLabelFromKey(mk)}? Total ${money(group.total)}.`))return;
  const [y,mo]=mk.split("-").map(Number),name=monthNames[mo-1],today=new Date().toISOString().slice(0,10);
  group.people.forEach(m=>{
    const n=unpaidMonthsFor(m,mk).length;if(!n)return;
    data.payments.push({id:uid("pay"),memberId:m.id,amount:n*Number(m.monthlyPrice||15),month:mk,date:today,monthsPaid:n,note:"Marked paid from reminder"});
    m.markerMonth=name;m.markerYear=y;m.marker=markerForMonth(name);m.monthsPaid=n;
  });
  saveData();render();toast(`Marked paid · ${money(group.total)}`);
}
function backupFileName(){return `music-money-backup-${new Date().toISOString().slice(0,10)}.json`}
async function exportBackup(){
  const payload=JSON.stringify({app:"music-money",storageKey:KEY,exportedAt:new Date().toISOString(),data},null,2);
  const file=new File([payload],backupFileName(),{type:"application/json"});
  try{
    if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:"Music Money backup"});return toast("Backup ready")}
  }catch(e){if(e&&e.name==="AbortError")return}
  const url=URL.createObjectURL(file),a=document.createElement("a");a.href=url;a.download=file.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);toast("Backup downloaded");
}
function validBackup(d){
  return d&&Array.isArray(d.accounts)&&Array.isArray(d.members)&&Array.isArray(d.payments)&&d.accounts.every(a=>a&&a.id&&a.name!==undefined)&&d.members.every(m=>m&&m.id&&m.name&&m.accountId);
}
function importBackup(file){
  const reader=new FileReader();
  reader.onerror=()=>toast("Could not read that file");
  reader.onload=()=>{
    let parsed;try{parsed=JSON.parse(reader.result)}catch(e){return toast("That is not a valid backup file")}
    const incoming=parsed&&parsed.data?parsed.data:parsed;
    if(!validBackup(incoming))return toast("That file is not a Music Money backup");
    if(!confirm(`Replace the data on this device with the backup?\n\nBackup: ${incoming.members.length} members, ${incoming.payments.length} payments.\nCurrent: ${data.members.length} members, ${data.payments.length} payments.\n\nYour current data is kept as a safety copy first.`))return;
    try{
      localStorage.setItem(KEY+"-before-import",JSON.stringify(data));
      localStorage.setItem(KEY,JSON.stringify(incoming));
      data=loadData();saveData();closeSheets();render();toast("Backup imported");
    }catch(e){console.error("Music Money import failed",e);toast("Import failed — nothing was changed")}
  };
  reader.readAsText(file);
}
$("exportData").onclick=exportBackup;
$("importData").onclick=()=>$("importFile").click();
$("importFile").onchange=e=>{const f=e.target.files&&e.target.files[0];if(f)importBackup(f);e.target.value=""};
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>el.classList.remove("show"),1800)}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}function escapeAttr(s){return escapeHtml(s)}
try{render()}catch(e){console.error("Music Money render",e)}
initDuoGallery();
