// Tiffin Tap demo configuration. Replace these sample settings after the pilot model is confirmed.
const SETTINGS = {
  normalOrderCutoff: "09:00", // local browser time
  lateOrderCutoff: "10:00",   // after normal cutoff, before this time
  lateFee: 10,                // illustrative demo surcharge per order
  demoBasePrice: 80,          // illustrative price only; not a confirmed business price
  currency: "₹"
};
const MENU = [
 {day:"Monday",name:"Roti, Seasonal Sabzi & Dal",desc:"A familiar, balanced everyday meal.",category:"regular",price:80,img:"https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",allergens:"Wheat; ask kitchen partner about other allergens."},
 {day:"Tuesday",name:"Vegetable Pulao & Raita",desc:"Mildly spiced rice with a cooling side.",category:"regular",price:80,img:"https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80",allergens:"Dairy; confirm ingredients."},
 {day:"Wednesday",name:"Paneer Roll & Fruit",desc:"A filling roll with a seasonal fruit portion.",category:"regular",price:85,img:"https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80",allergens:"Wheat, dairy; confirm ingredients."},
 {day:"Thursday",name:"Vegetable Paratha & Curd",desc:"A comforting school-day favourite.",category:"regular",price:80,img:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",allergens:"Wheat, dairy; confirm ingredients."},
 {day:"Friday",name:"Rice, Dal & Mixed Vegetables",desc:"A simple meal with variety in every bite.",category:"regular",price:80,img:"https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",allergens:"Ask kitchen partner to confirm."},
 {day:"Saturday",name:"Healthy Veg Wrap",desc:"A handy special for a shorter school day.",category:"special",price:90,img:"https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80",allergens:"Wheat; confirm sauces and fillings."}
];
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const toast = message => { const el=$("#toast"); el.textContent=message; el.classList.add("show"); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove("show"),2600); };
const money = n => SETTINGS.currency + Number(n).toFixed(0);
function saveLocal(key,value){const list=JSON.parse(localStorage.getItem(key)||"[]");list.push(value);localStorage.setItem(key,JSON.stringify(list));}
function makeId(prefix){return prefix+"-"+Date.now().toString(36).toUpperCase().slice(-6)+"-"+Math.random().toString(36).slice(2,5).toUpperCase();}

// Simple hash-based multi-page navigation; every navigation item is a real route.
function navigate(){let route=location.hash.replace("#","")||"home";if(!$("#"+route)||!$("#"+route).classList.contains("page"))route="home";$$(".page").forEach(p=>p.classList.toggle("active",p.id===route));$$(".main-nav a").forEach(a=>a.classList.toggle("current",a.getAttribute("href")==="#"+route));$("#mainNav").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false");window.scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});setTimeout(initReveal,80);}
window.addEventListener("hashchange",navigate);
$("#menuToggle").addEventListener("click",()=>{const open=$("#mainNav").classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",String(open));});
function imageCard(item,compact=false){return `<article class="${compact?"preview-card":"meal-card"}"><img src="${item.img}" alt="${item.name}" loading="lazy" onerror="this.style.opacity='.15'"><div class="${compact?"preview-card-body":"meal-card-body"}"><div class="meal-meta"><span>${item.day.toUpperCase()}</span><span>● VEG</span></div><h3>${item.name}</h3><p>${item.desc}</p>${compact?"":`<div class="meal-tags"><span>Allergens: see details</span><span>Sample menu</span></div><div class="meal-footer"><b>${money(item.price)}*</b><button type="button" data-order="${item.name}">Order this meal ↗</button></div>`}</div></article>`;}
$("#homeMenuPreview").innerHTML=MENU.slice(0,3).map(m=>imageCard(m,true)).join("");
let selectedDay="Monday", selectedFilter="all";
function renderMenu(){const dayItems=MENU.filter(m=>m.day===selectedDay);const filtered=dayItems.filter(m=>selectedFilter==="all"||m.category===selectedFilter);$("#menuGrid").innerHTML=filtered.length?filtered.map(m=>imageCard(m)).join(""):`<div class="info-strip">No meals in this filter for ${selectedDay}.</div>`;$$("[data-order]").forEach(b=>b.addEventListener("click",()=>{location.hash="order";setTimeout(()=>{const select=$("#orderMeal");select.value=b.dataset.order;updateSummary();},150);}));}
$("#dayTabs").innerHTML=MENU.map(m=>`<button class="day-tab ${m.day===selectedDay?"active":""}" data-day="${m.day}">${m.day.slice(0,3)}</button>`).join("");
$$("[data-day]").forEach(b=>b.addEventListener("click",()=>{selectedDay=b.dataset.day;$$("[data-day]").forEach(x=>x.classList.toggle("active",x===b));renderMenu();}));
$$("[data-filter]").forEach(b=>b.addEventListener("click",()=>{selectedFilter=b.dataset.filter;$$("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));renderMenu();}));
renderMenu();

$("#orderMeal").innerHTML=MENU.map(m=>`<option value="${m.name}" data-price="${m.price}">${m.day}: ${m.name}</option>`).join("");
const today=new Date();$("#orderDate").min=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);
function getOrderState(){const now=new Date(),[nh,nm]=SETTINGS.normalOrderCutoff.split(":").map(Number),[lh,lm]=SETTINGS.lateOrderCutoff.split(":").map(Number);const mins=now.getHours()*60+now.getMinutes(),normal=nh*60+nm,late=lh*60+lm;if(mins<normal)return "normal";if(mins<late)return "late";return "closed";}
function updateDeadline(){const state=getOrderState(),card=$("#deadlineCard");card.dataset.state=state;$("#closingTime").textContent=formatTime(SETTINGS.lateOrderCutoff);if(state==="normal"){$("#deadlineTitle").textContent="Standard ordering is open";$("#deadlineText").textContent=`Place an order before ${formatTime(SETTINGS.normalOrderCutoff)} for the standard demo price.`;$("#submitOrder").disabled=false;}else if(state==="late"){$("#deadlineTitle").textContent="Late ordering window";$("#deadlineText").textContent=`A demo late fee of ${money(SETTINGS.lateFee)} applies until ${formatTime(SETTINGS.lateOrderCutoff)}.`;$("#submitOrder").disabled=false;}else{$("#deadlineTitle").textContent="Today's demo ordering is closed";$("#deadlineText").textContent=`New demo orders are disabled after ${formatTime(SETTINGS.lateOrderCutoff)}. These are configurable sample times.`;$("#submitOrder").disabled=true;}}
function formatTime(t){let [h,m]=t.split(":").map(Number);return new Date(2000,0,1,h,m).toLocaleTimeString("en-IN",{hour:"numeric",minute:"2-digit"});}
function updateSummary(){const opt=$("#orderMeal").selectedOptions[0],qty=Math.max(1,Number($("#quantity").value)||1),state=getOrderState(),price=Number(opt?.dataset.price||SETTINGS.demoBasePrice),fee=state==="late"?SETTINGS.lateFee:0;$("#summaryMeal").textContent=opt?`${qty} × ${opt.value}${fee?` + late fee ${money(fee)}`:""}`:"Select a meal";$("#summaryTotal").textContent=opt?money(price*qty+fee):"₹—";}
$("#orderMeal").addEventListener("change",updateSummary);$("#quantity").addEventListener("input",updateSummary);updateDeadline();updateSummary();setInterval(()=>{updateDeadline();updateSummary();},30000);
$("#orderType").addEventListener("change",e=>{if(e.target.value!=="Individual Meal")toast("Subscription selection is a demo. Plan details are not finalised.");});
$("#orderForm").addEventListener("submit",e=>{e.preventDefault();if(!e.target.reportValidity())return;const state=getOrderState();if(state==="closed"){toast("The demo ordering window is closed.");return;}const data=Object.fromEntries(new FormData(e.target));const opt=$("#orderMeal").selectedOptions[0],qty=Number(data.quantity),price=Number(opt.dataset.price),fee=state==="late"?SETTINGS.lateFee:0;const order={id:makeId("TT"),...data,price,lateFee:fee,total:price*qty+fee,status:"Demo order created locally",createdAt:new Date().toISOString()};saveLocal("tiffinTapOrders",order);$("#orderConfirmation").classList.remove("hidden");$("#orderConfirmation").innerHTML=`<div class="eyebrow">DEMO ORDER CREATED</div><h2>You're all set for the demo.</h2><p>Your reference ID is <b>${order.id}</b>.</p><p><b>${order.student}</b> · ${order.school} · ${order.meal}</p><p>Illustrative total: <b>${money(order.total)}</b>. This order is saved only in this browser. It has <b>not</b> been sent to a kitchen and no payment has been taken.</p><button class="btn btn-outline" onclick="window.print()">Print demo confirmation</button>`;$("#orderConfirmation").scrollIntoView({behavior:"smooth",block:"center"});toast("Demo order saved in this browser.");});

$$(".subscribe-btn").forEach(b=>b.addEventListener("click",()=>{location.hash="order";setTimeout(()=>{$("#orderType").value=b.dataset.plan;toast(`${b.dataset.plan} selected. Complete the demo form.`);},120);}));
function handleLocalForm(formId,key,success){const form=$("#"+formId);if(!form)return;form.addEventListener("submit",e=>{e.preventDefault();if(!form.reportValidity())return;const data=Object.fromEntries(new FormData(form));data.id=makeId(key.toUpperCase());data.createdAt=new Date().toISOString();saveLocal(key,data);const feedback=form.querySelector(".form-feedback");if(feedback)feedback.textContent=`✓ ${success} Reference: ${data.id}. Saved locally in this browser.`;form.reset();toast("Demo submission saved locally.");});}
handleLocalForm("schoolForm","tiffinTapSchoolEnquiries","Enquiry created.");
handleLocalForm("contactForm","tiffinTapMessages","Message saved.");
handleLocalForm("pickupForm","tiffinTapPickupRequests","Pickup request created.");
$("#pickupForm").addEventListener("submit",e=>{if(!e.target.reportValidity())return;setTimeout(()=>{const list=JSON.parse(localStorage.getItem("tiffinTapPickupRequests")||"[]"),last=list[list.length-1];if(last){const box=$("#pickupStatus");box.classList.remove("hidden");box.innerHTML=`<b>Demo request status: Received</b><p>Reference: ${last.id}</p><p>This is only a local demo record. No pickup has been scheduled and no driver has been assigned.</p>`;}},30);});
function initReveal(){const els=$$(".reveal");if(!("IntersectionObserver"in window)){els.forEach(e=>e.classList.add("visible"));return;}const io=new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add("visible");io.unobserve(en.target);}}),{threshold:.12});els.forEach(e=>{if(!e.classList.contains("visible"))io.observe(e);});}
initReveal();
window.addEventListener("scroll",()=>{const max=document.documentElement.scrollHeight-innerHeight;$("#scrollProgress").style.width=(max>0?scrollY/max*100:0)+"%";$("#backTop").classList.toggle("show",scrollY>450);});
$("#backTop").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
navigate();
