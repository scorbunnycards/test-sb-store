/* ═══════════════════════════════════════════════════════
   ⚠️ EDIT THIS: your email for order notifications — every
   new order sends a detailed notification here, in addition
   to the confirmation email the customer gets.
═══════════════════════════════════════════════════════ */
const ORDER_EMAIL = "scorbunnycards@gmail.com";

/* EmailJS — same account/template as the admin page. If you ever change
   these in admin.html, update them here too so both stay in sync. */
const EMAILJS_PUBLIC_KEY  = "laDCIJJMVDDHJxJsz";
const EMAILJS_SERVICE_ID  = "service_7a2n73j";
const EMAILJS_TEMPLATE_ID = "template_4n5dg0y";
emailjs.init(EMAILJS_PUBLIC_KEY);

async function sendMail(to, subject, body){
    return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: to,
        subject: subject,
        message: body,
        cc_email: ''
    });
}

/* ═══════════════════════════════════════════════════════
   ⚠️ EDIT THIS: the IBAN payment details shown to the
   customer right after they place an order, and included
   in your order notification email.
═══════════════════════════════════════════════════════ */
const IBAN_ACCOUNT_NAME = "Karol Palášthy";
const IBAN_NUMBER = "LT953250090812341975";

/* ⚠️ EDIT THIS: flat-rate shipping fee (in EUR) added to every order. */
const SHIPPING_FLAT = 3.60;

/* ─── DATA ───
   ⚠️ EDIT THIS: set the `price` (number, in EUR) for each size,
   and set `images` to the photo(s) of that extension size.
   Leave price as null to show "Quote on request" instead.

   📸 MULTIPLE PHOTOS (Instagram-style slideshow): `images` is an array —
   add as many filenames as you like and they'll show as a swipeable
   carousel with dots, e.g.:
   images: ["assets/images/15x20.jpg", "15x20-angle.jpg", "15x20-lifestyle.jpg"] */
const extensionItems = [
    { id:"ext-15x20", name:"15×20 Extension", images:["assets/images/15x20.jpg", "assets/images/15x20_1.jpg", "assets/images/15x20_2.jpg", "assets/images/15x20_3.jpg"], price: 25, desc:"A compact, elegant extension — perfect for a single card display on a shelf or desk." },
    { id:"ext-20x20", name:"20×20 Extension", images:["assets/images/20x20.jpg", "assets/images/20x20_2.jpg"], price: 30, desc:"A square format extension for a bold, symmetric, gallery-style presentation." },
    { id:"ext-10x15", name:"10×15 Extension", images:["assets/images/10x15.jpg", "assets/images/10x15_2.jpg", "assets/images/10x15_3.jpg"], price: 15,  desc:"Our smallest size — sleek and minimal, ideal for a subtle everyday display." },
    { id:"ext-a4",    name:"A4 Extension",    images:["assets/images/A4.jpg"],    price: 40, desc:"Our largest format — a true statement piece for your favorite card." },
];

/* ─── GALLERY DATA ───
   ⚠️ EDIT THIS: this is your Gallery page. Add one entry per photo you
   want to show off — finished orders, close-ups, behind-the-scenes, etc.
   `caption` is optional (shown on hover / in the lightbox). Just keep
   adding objects to this array as you take new photos. */
const galleryItems = [
    { id:"g1", file:"assets/images/t shirt.jpg", caption:"some fantastic T shirt" },
    { id:"g2", file:"assets/images/charmander1.jpg", caption:"Gotta catch em all" },
    { id:"g3", file:"assets/images/Scorbunny.jpg", caption:"this guy" },
    { id:"g4", file:"assets/images/waterfall.jpg", caption:"Enjoying outside" },
    { id:"g5", file:"assets/images/pokemon stairs.jpg", caption:"well look what I found" },
    { id:"g6", file:"assets/images/stranka foto.jpg", caption:"Mini Extension's" },

];

/* ⚠️ EDIT THIS: adjust labels/options for frame colors and card cases. */
const FRAME_COLORS = [ { id:"black", label:"Black" }, { id:"white", label:"White" }, { id:"wood", label:"Wood" } ];
const CASE_TYPES = [ { id:"big-magnetic", label:"Big Magnetic" }, { id:"small-minimalist", label:"Small Minimalist" } ];

/* ⚠️ Card-count option — ONLY shown for the A4 Extension (id: "ext-a4"). Sets the price. */
const CARD_COUNTS = [ { id:"2-cards", label:"2 Cards", price:40 }, { id:"3-cards", label:"3 Cards", price:50 } ];

/* ─── AMBIENT MOTES (soft drifting light particles) ─── */
const motesCanvas = document.getElementById('motes');
const mCtx = motesCanvas.getContext('2d');
let motes = [];
const moteColors = ['227,189,130', '216,136,166', '180,142,224'];
function initMotes(){
    motesCanvas.width = window.innerWidth; motesCanvas.height = window.innerHeight;
    motes = [];
    for(let i=0;i<50;i++) motes.push({
        x: Math.random()*motesCanvas.width,
        y: Math.random()*motesCanvas.height,
        r: Math.random()*2.2+0.8,
        spd: Math.random()*0.35+0.08,
        sway: Math.random()*0.6+0.2,
        phase: Math.random()*Math.PI*2,
        o: Math.random()*0.5+0.15,
        c: moteColors[Math.floor(Math.random()*moteColors.length)]
    });
}
function drawMotes(t){
    mCtx.clearRect(0,0,motesCanvas.width,motesCanvas.height);
    motes.forEach(m=>{
        m.y -= m.spd;
        if(m.y < -10){ m.y = motesCanvas.height+10; m.x = Math.random()*motesCanvas.width; }
        const x = m.x + Math.sin(t*0.0007 + m.phase)*m.sway*20;
        mCtx.beginPath();
        mCtx.fillStyle = `rgba(${m.c},${m.o})`;
        mCtx.arc(x, m.y, m.r, 0, Math.PI*2);
        mCtx.fill();
    });
    requestAnimationFrame(drawMotes);
}
window.addEventListener('resize', initMotes);
initMotes(); requestAnimationFrame(drawMotes);

/* ─── HERO CARD 3D ─── */
const heroScene = document.getElementById('cardScene');
const heroCard  = document.getElementById('heroCard3d');
heroScene.addEventListener('mousemove', e=>{
    const r = heroCard.getBoundingClientRect();
    const x = e.clientX-r.left, y = e.clientY-r.top;
    const rx_ = ((y-r.height/2)/r.height)*-16;
    const ry_ = ((x-r.width/2)/r.width)*16;
    heroCard.style.transform = `rotateX(${rx_}deg) rotateY(${ry_}deg) scale(1.03) translateZ(10px)`;
});
heroScene.addEventListener('mouseleave', ()=>{ heroCard.style.transform = 'rotateX(0) rotateY(0) scale(1)'; });

/* ─── SCROLL REVEAL ─── */
const revealObs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); revealObs.unobserve(e.target); } });
},{threshold:0.15});
document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el));

/* ─── LOADER ─── */
const loader = document.getElementById('loader');
function showLoader(){ loader.classList.add('active'); }
function hideLoader(){ setTimeout(()=>loader.classList.remove('active'), 380); }

/* ─── PAGE SWITCHING ─── */
const homePage = document.getElementById('homePage');
const extPage  = document.getElementById('extensionsPage');
const galleryPage = document.getElementById('galleryPage');
const infoPage = document.getElementById('infoPage');
const navHomeLinks = [document.getElementById('navHome'), document.getElementById('navHome2')];
const navExtLink = document.getElementById('navExtensions');
const navGalleryLink = document.getElementById('navGallery');
const navHomeMobile = document.getElementById('navHomeMobile');
const navExtMobile = document.getElementById('navExtMobile');
const navGalleryMobile = document.getElementById('navGalleryMobile');

function setActiveNav(page){
    document.getElementById('navHome').classList.toggle('active', page==='home');
    navExtLink.classList.toggle('active', page==='ext');
    navGalleryLink.classList.toggle('active', page==='gallery');
    navHomeMobile.classList.toggle('active', page==='home');
    navExtMobile.classList.toggle('active', page==='ext');
    navGalleryMobile.classList.toggle('active', page==='gallery');
}

function showPage(page){
    showLoader();
    homePage.style.display = 'none';
    extPage.style.display = 'none'; extPage.classList.remove('visible');
    galleryPage.style.display = 'none'; galleryPage.classList.remove('visible');
    infoPage.style.display = 'none'; infoPage.classList.remove('visible');
    setTimeout(()=>{
        if(page==='home'){ homePage.style.display='flex'; }
        else if(page==='ext'){ extPage.style.display='flex'; extPage.classList.add('visible'); buildGrid(); }
        else if(page==='gallery'){ galleryPage.style.display='flex'; galleryPage.classList.add('visible'); buildGallery(); }
        else if(page==='info'){ infoPage.style.display='flex'; infoPage.classList.add('visible'); }
        setActiveNav(page);
        window.scrollTo({top:0, behavior:'instant'});
        hideLoader();
    },420);
}
navHomeLinks.forEach(a=>a.addEventListener('click', e=>{ e.preventDefault(); showPage('home'); }));
navExtLink.addEventListener('click', e=>{ e.preventDefault(); showPage('ext'); });
navGalleryLink.addEventListener('click', e=>{ e.preventDefault(); showPage('gallery'); });
document.getElementById('heroShopBtn').addEventListener('click', e=>{ e.preventDefault(); showPage('ext'); });

/* ─── INFO PAGE: sub-nav + deep links from footer ─── */
function goToInfoSection(target){
    showPage('info');
    setTimeout(()=>{
        const el = target ? document.getElementById(target) : null;
        if(el){
            el.scrollIntoView({behavior:'smooth', block:'start'});
            document.querySelectorAll('.info-subnav button').forEach(b=>b.classList.toggle('active', b.dataset.target===target));
        }
    }, 480);
}
document.querySelectorAll('.info-subnav button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
        document.querySelectorAll('.info-subnav button').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).scrollIntoView({behavior:'smooth', block:'start'});
    });
});
document.querySelectorAll('.global-footer .gf-link').forEach(link=>{
    link.addEventListener('click', e=>{
        e.preventDefault();
        const nav = link.dataset.nav;
        if(nav === 'info'){ goToInfoSection(link.dataset.target); }
        else { showPage(nav); }
    });
});

/* ─── Mobile hamburger menu ─── */
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
function openMobileMenu(){
    menuToggle.classList.add('open'); menuToggle.setAttribute('aria-expanded','true');
    mobileMenu.classList.add('open'); mobileMenuOverlay.classList.add('open');
}
function closeMobileMenu(){
    menuToggle.classList.remove('open'); menuToggle.setAttribute('aria-expanded','false');
    mobileMenu.classList.remove('open'); mobileMenuOverlay.classList.remove('open');
}
menuToggle.addEventListener('click', ()=> mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu());
mobileMenuOverlay.addEventListener('click', closeMobileMenu);
window.addEventListener('resize', ()=>{ if(window.innerWidth>960) closeMobileMenu(); });
navHomeMobile.addEventListener('click', e=>{ e.preventDefault(); closeMobileMenu(); showPage('home'); });
navExtMobile.addEventListener('click', e=>{ e.preventDefault(); closeMobileMenu(); showPage('ext'); });
navGalleryMobile.addEventListener('click', e=>{ e.preventDefault(); closeMobileMenu(); showPage('gallery'); });


/* ─── BUILD SHOP GRID ─── */
const productPhotoFiles = new Set([
    '10x15.jpg', '10x15_2.jpg', '10x15_3.jpg', '15x20.jpg', '15x20_1.jpg',
    '15x20_2.jpg', '15x20_3.jpg', '20x20.jpg', '20x20_2.jpg', 'A4.jpg'
]);

function productPhotoSource(src){
    const filename = src.split('/').pop();
    return productPhotoFiles.has(filename)
        ? `assets/images/optimized/1600/${filename.replace(/\.jpg$/i, '.webp')}`
        : src;
}

function productPhotoElement(src, alt){
    const optimizedSrc = productPhotoSource(src);
    const productClass = optimizedSrc !== src ? ' class="product-photo"' : '';
    return `<img${productClass} src="${optimizedSrc}" alt="${alt}" loading="lazy" decoding="async">`;
}

function buildGrid(){
    const grid = document.getElementById('extensionsGrid');
    if(grid.childElementCount>0) return;
    grid.innerHTML = '';

    extensionItems.forEach((item,i)=>{
        const imgs = (item.images && item.images.length ? item.images : [item.file]);
        const slot = document.createElement('div');
        slot.className = 'slot';
        const hasProductPhotos = imgs.some(src=>productPhotoSource(src)!==src);
        if(hasProductPhotos) slot.classList.add('product-photo-slot');
        slot.style.animationDelay = `${i*0.06}s`;
        slot.innerHTML = `
            <div class="slot-card" data-id="${item.id}">
                <div class="slot-carousel">
                    <div class="slot-carousel-track">
                        ${imgs.map(src=>productPhotoElement(src, item.name)).join('')}
                    </div>
                    ${imgs.length>1 ? `
                        <button type="button" class="slot-carousel-arrow prev">‹</button>
                        <button type="button" class="slot-carousel-arrow next">›</button>
                        <div class="slot-carousel-dots">${imgs.map((_,d)=>`<button type="button" data-i="${d}" class="${d===0?'active':''}"></button>`).join('')}</div>
                        <div class="slot-carousel-count">1/${imgs.length}</div>
                    ` : ''}
                </div>
            </div>
            <div class="slot-name">${item.name}</div>
            <div class="slot-price">${item.price!=null ? '€'+item.price.toFixed(2) : 'Quote on request'}</div>
            <div class="slot-actions">
                <button class="add-btn">Customize & Add →</button>
            </div>
        `;
        grid.appendChild(slot);
        if(!hasProductPhotos) setupSlotCard(slot.querySelector('.slot-card'));
        if(imgs.length>1) setupSlotCarousel(slot.querySelector('.slot-carousel'), imgs.length);
        slot.querySelector('.slot-card').addEventListener('click', ()=> openProductModal(item));
        slot.querySelector('.add-btn').addEventListener('click', ()=> openProductModal(item));
    });
}

/* ─── Instagram-style carousel behaviour for shop grid cards ─── */
function setupSlotCarousel(carousel, count){
    const track = carousel.querySelector('.slot-carousel-track');
    const dots = carousel.querySelectorAll('.slot-carousel-dots button');
    const countLabel = carousel.querySelector('.slot-carousel-count');
    let i = 0;
    function go(n){
        i = (n+count)%count;
        track.style.transform = `translateX(-${i*100}%)`;
        dots.forEach((d,idx)=>d.classList.toggle('active', idx===i));
        if(countLabel) countLabel.textContent = `${i+1}/${count}`;
    }
    carousel.querySelector('.prev')?.addEventListener('click', e=>{ e.stopPropagation(); go(i-1); });
    carousel.querySelector('.next')?.addEventListener('click', e=>{ e.stopPropagation(); go(i+1); });
    dots.forEach(d=>d.addEventListener('click', e=>{ e.stopPropagation(); go(parseInt(d.dataset.i)); }));

    /* swipe support */
    let startX = null;
    carousel.addEventListener('touchstart', e=>{ startX = e.touches[0].clientX; }, {passive:true});
    carousel.addEventListener('touchend', e=>{
        if(startX===null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if(Math.abs(dx) > 40){ dx < 0 ? go(i+1) : go(i-1); }
        startX = null;
    }, {passive:true});
}

/* ─── GALLERY PAGE ─── */
function buildGallery(){
    const grid = document.getElementById('galleryGrid');
    if(grid.dataset.built) return;
    if(!galleryItems.length){
        grid.innerHTML = `<div class="gallery-empty"><div class="empty-state-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="m21 15-5-5L5 21"></path></svg></div><p>No photos yet — add entries to the <code>galleryItems</code> list in the code to start filling this page.</p></div>`;
        grid.dataset.built = '1';
        return;
    }
    grid.innerHTML = galleryItems.map((g,i)=>`
        <div class="gallery-item" data-i="${i}" style="animation-delay:${i*0.05}s">
            <img src="${g.file}" alt="${g.caption||''}" loading="lazy">
            ${g.caption ? `<div class="gallery-caption"><p>${g.caption}</p></div>` : ''}
        </div>
    `).join('');
    grid.querySelectorAll('.gallery-item').forEach(el=>{
        el.addEventListener('click', ()=> openLightbox(parseInt(el.dataset.i)));
    });
    grid.dataset.built = '1';
}

/* ─── LIGHTBOX ─── */
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
function openLightbox(i){
    const g = galleryItems[i];
    if(!g) return;
    lightboxImg.src = g.file;
    lightboxImg.alt = g.caption || '';
    lightboxCaption.textContent = g.caption || '';
    lightboxOverlay.classList.add('open');
}
function closeLightbox(){ lightboxOverlay.classList.remove('open'); }
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightboxOverlay.addEventListener('click', e=>{ if(e.target===lightboxOverlay) closeLightbox(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeLightbox(); });

function setupSlotCard(card){
    card.addEventListener('mousemove', e=>{
        const r = card.getBoundingClientRect();
        const x = e.clientX-r.left, y = e.clientY-r.top;
        const rx_ = ((y-r.height/2)/r.height)*-8;
        const ry_ = ((x-r.width/2)/r.width)*8;
        card.style.transform = `perspective(900px) rotateX(${rx_}deg) rotateY(${ry_}deg) scale(1.03)`;
        card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', ()=>{
        card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
        card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
    });
}

/* ─── SEARCH ─── */
document.getElementById('extSearchInput').addEventListener('input', function(){
    const q = this.value.toLowerCase();
    document.querySelectorAll('#extensionsGrid .slot').forEach(s=>{
        s.style.display = s.querySelector('.slot-name').textContent.toLowerCase().includes(q) ? '' : 'none';
    });
});

/* ─── SOLD COUNTER ─── */
const SOLD_ORDERS_INITIAL = 30;
function countUp(el, target){
    let c = 0;
    const inc = Math.max(1, Math.ceil(target/60));
    const t = setInterval(()=>{ c+=inc; if(c>=target){c=target;clearInterval(t);} el.textContent=c+'+'; }, 28);
}
function renderSoldOrders(count, animate=true){
    [document.getElementById('soldCounter'), document.getElementById('soldCounter2')].forEach(el=>{
        if(animate) countUp(el, count);
        else el.textContent = count+'+';
    });
}
renderSoldOrders(SOLD_ORDERS_INITIAL);

/* ─── PARTICLE BURST ─── */
function spawnParticles(e, color='#d888a6'){
    const rect = e.target.getBoundingClientRect();
    const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
    for(let i=0;i<12;i++){
        const p = document.createElement('div');
        p.className = 'particle';
        const angle = Math.random()*Math.PI*2;
        const dist = Math.random()*70+20;
        p.style.cssText = `left:${cx}px;top:${cy}px;background:${color};--dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px;`;
        document.body.appendChild(p);
        setTimeout(()=>p.remove(), 700);
    }
}

/* ═══════════════════════════════════════
   BASKET
═══════════════════════════════════════ */
let basket = [];
try { basket = JSON.parse(localStorage.getItem('sb_basket') || '[]'); } catch(e){ basket = []; }

/* ─── Discount codes: SB10EC1 through SB10EC200, each worth €10 off ─── */
const DISCOUNT_CODE_PATTERN = /^SB10EC(\d{1,3})$/i;
const DISCOUNT_CODE_MAX = 200;
const DISCOUNT_AMOUNT = 10;

/* Reusable promo codes (NOT single-use): { CODE: euros off }.
   To retire one, just delete its line here and re-upload the file. */
const REUSABLE_CODES = {
    'SBCARDS5': 5
};
function isReusableCode(code){ return Object.prototype.hasOwnProperty.call(REUSABLE_CODES, code); }
function codeValue(code){ return isReusableCode(code) ? REUSABLE_CODES[code] : DISCOUNT_AMOUNT; }

/* Returns the canonical form (e.g. "sb10ec007" -> "SB10EC7") or null if invalid.
   Canonical form matters: it's the key used to mark a code as used, so
   "SB10EC7" and "SB10EC007" must count as the same code. */
function normalizeDiscountCode(code){
    const upper = (code||'').trim().toUpperCase();
    if(isReusableCode(upper)) return upper;
    const match = DISCOUNT_CODE_PATTERN.exec((code||'').trim());
    if(!match) return null;
    const n = parseInt(match[1], 10);
    return (n>=1 && n<=DISCOUNT_CODE_MAX) ? 'SB10EC'+n : null;
}
function isValidDiscountCode(code){ return normalizeDiscountCode(code) !== null; }

/* ═══════════════════════════════════════════════════════
   ⚠️ EDIT THIS: single-use codes are tracked in a free Firebase
   Realtime Database so every visitor/device sees the same list of
   used codes. Paste your database URL here (no trailing slash),
   e.g. "https://scorbunny-cards-default-rtdb.europe-west1.firebasedatabase.app"
═══════════════════════════════════════════════════════ */
const FIREBASE_DB_URL = "https://YOUR-PROJECT-default-rtdb.firebaseio.com";

function codeUrl(code){ return `${FIREBASE_DB_URL}/usedCodes/${code}.json`; }

function soldOrdersCountUrl(){ return `${FIREBASE_DB_URL}/sold_orders_count.json`; }
function soldOrderEventUrl(orderNumber){ return `${FIREBASE_DB_URL}/sold_order_events/${encodeURIComponent(orderNumber)}.json`; }
function firebaseConfigured(){ return !FIREBASE_DB_URL.includes('YOUR-PROJECT'); }

async function loadSoldOrdersCount(){
    if(!firebaseConfigured()) return;
    try{
        const [countRes, eventsRes] = await Promise.all([
            fetch(soldOrdersCountUrl(), {cache:'no-store'}),
            fetch(`${FIREBASE_DB_URL}/sold_order_events.json?shallow=true`, {cache:'no-store'})
        ]);
        if(!countRes.ok || !eventsRes.ok) throw new Error('sold orders lookup failed');
        const storedCount = await countRes.json();
        const events = await eventsRes.json();
        const count = (Number.isFinite(Number(storedCount)) ? Number(storedCount) : SOLD_ORDERS_INITIAL) + (events ? Object.keys(events).length : 0);
        renderSoldOrders(count, false);
    } catch(error){
        console.warn('Sold orders count could not be loaded.', error);
    }
}

/* A unique RTDB event key makes the increment idempotent. The null ETag
   allows only the first request for an order number to create the event. */
async function recordSoldOrder(orderNumber){
    if(!firebaseConfigured()) return;
    const response = await fetch(soldOrderEventUrl(orderNumber), {
        method:'PUT',
        headers:{'if-match':'null_etag'},
        body:JSON.stringify({ countedAt: new Date().toISOString() })
    });
    if(response.ok || response.status===412) return;
    throw new Error('sold order event could not be recorded: '+response.status);
}

loadSoldOrdersCount();

/* true = already used, false = still available. Throws if it can't be checked. */
async function isCodeUsed(code){
    const res = await fetch(codeUrl(code), { cache:'no-store' });
    if(!res.ok) throw new Error('lookup failed: '+res.status);
    return (await res.json()) !== null;
}

/* Atomically marks the code as used. The database rules only allow the write
   if the code has never been written before, so if two people try at the same
   moment, exactly one wins. Returns 'claimed' or 'used'. Throws on other errors. */
async function claimDiscountCode(code, orderNumber){
    const res = await fetch(codeUrl(code), { method:'PUT', body: JSON.stringify(orderNumber) });
    if(res.ok) return 'claimed';
    if(res.status===401 || res.status===403){
        // rejected by the rules: confirm it's because the code is taken
        if(await isCodeUsed(code)) return 'used';
    }
    throw new Error('claim failed: '+res.status);
}

let appliedDiscountCode = null;
try { appliedDiscountCode = localStorage.getItem('sb_discount') || null; } catch(e){ appliedDiscountCode = null; }
appliedDiscountCode = normalizeDiscountCode(appliedDiscountCode);

function discountAmount(){ return (appliedDiscountCode && basket.length>0) ? codeValue(appliedDiscountCode) : 0; }

const basketDrawer = document.getElementById('basketDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const basketBtn = document.getElementById('basketBtn');
const basketCountEl = document.getElementById('basketCount');
const basketList = document.getElementById('basketList');
const subtotalValue = document.getElementById('subtotalValue');
const cartStep = document.getElementById('cartStep');
const checkoutStep = document.getElementById('checkoutStep');
const paymentStep = document.getElementById('paymentStep');

function saveBasket(){ localStorage.setItem('sb_basket', JSON.stringify(basket)); renderBasket(); updateBasketCount(); }

function addToBasket(item){
    const existing = basket.find(b=>b.id===item.id && !item.id.startsWith('custom-'));
    if(existing){ existing.qty++; }
    else { basket.push({ ...item, qty:1 }); }
    saveBasket();
    openDrawer();
    basketBtn.classList.remove('bump'); void basketBtn.offsetWidth; basketBtn.classList.add('bump');
}
function removeFromBasket(id){ basket = basket.filter(b=>b.id!==id); saveBasket(); }
function changeQty(id, delta){
    const it = basket.find(b=>b.id===id);
    if(!it) return;
    it.qty += delta;
    if(it.qty<=0){ removeFromBasket(id); return; }
    saveBasket();
}
function basketSubtotal(){ return basket.reduce((s,i)=> i.price!=null ? s + i.price*i.qty : s, 0); }
function basketShipping(){ return basket.length>0 ? SHIPPING_FLAT : 0; }
function basketTotal(){ return Math.max(basketSubtotal() + basketShipping() - discountAmount(), 0); }
function updateBasketCount(){
    const count = basket.reduce((s,i)=>s+i.qty,0);
    basketCountEl.textContent = count;
    basketCountEl.style.display = count>0 ? 'flex' : 'none';
}
function renderBasket(){
    if(basket.length===0){
        basketList.innerHTML = `<div class="basket-empty"><div class="empty-state-icon basket-empty-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 11-1 9"></path><path d="m19 11-1 9"></path><path d="M2 11h20"></path><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.6-7.4"></path><path d="M7 11V6a5 5 0 0 1 10 0v5"></path></svg></div>Your basket is empty.<br>Add an extension to get started.</div>`;
    } else {
        basketList.innerHTML = basket.map(i=>`
            <div class="basket-item">
                ${i.image ? `<img src="${i.image}" alt="${i.name}">` : `<div class="basket-item-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5 4 4"></path><path d="M13 7 3 17v4h4L17 11"></path><path d="m17 3 4 4"></path><path d="m3 21 3-3"></path></svg></div>`}
                <div class="basket-item-info">
                    <div class="basket-item-name">${i.name}</div>
                    ${i.note ? `<div class="basket-item-note">${i.note}</div>` : ''}
                    <div class="basket-item-price">${i.price!=null ? '€'+i.price.toFixed(2) : 'Quote on request'}</div>
                    <div class="basket-item-qty">
                        <button class="qty-btn" onclick="changeQty('${i.id}',-1)">−</button>
                        <span>${i.qty}</span>
                        <button class="qty-btn" onclick="changeQty('${i.id}',1)">+</button>
                        <button class="basket-item-remove" onclick="removeFromBasket('${i.id}')">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    subtotalValue.textContent = '€'+basketSubtotal().toFixed(2);
    document.getElementById('shippingValue').textContent = '€'+basketShipping().toFixed(2);
    document.getElementById('totalValue').textContent = '€'+basketTotal().toFixed(2);
    document.getElementById('checkoutBtn').disabled = basket.length===0;
    updateDiscountUI();
}

/* ─── Discount code UI ─── */
function updateDiscountUI(){
    const input = document.getElementById('discountInput');
    const applyBtn = document.getElementById('discountApplyBtn');
    const msg = document.getElementById('discountMsg');
    const row = document.getElementById('discountRow');
    const valueEl = document.getElementById('discountValue');

    if(appliedDiscountCode){
        input.value = appliedDiscountCode;
        input.disabled = true;
        applyBtn.textContent = 'Remove';
        applyBtn.dataset.mode = 'remove';
        msg.textContent = `Code ${appliedDiscountCode} applied — €${codeValue(appliedDiscountCode).toFixed(2)} off your order.`;
        msg.className = 'discount-msg success';
        row.style.display = basket.length>0 ? 'flex' : 'none';
        valueEl.textContent = '−€'+discountAmount().toFixed(2);
    } else {
        input.disabled = false;
        applyBtn.textContent = 'Apply';
        applyBtn.dataset.mode = 'apply';
        row.style.display = 'none';
    }
}

async function applyDiscountCode(){
    const input = document.getElementById('discountInput');
    const applyBtn = document.getElementById('discountApplyBtn');
    const msg = document.getElementById('discountMsg');
    if(!input.value.trim()){
        msg.textContent = 'Enter a code.';
        msg.className = 'discount-msg error';
        return;
    }
    const code = normalizeDiscountCode(input.value);
    if(!code){
        msg.textContent = "That code isn't valid.";
        msg.className = 'discount-msg error';
        return;
    }
    applyBtn.disabled = true;
    msg.textContent = 'Checking code…';
    msg.className = 'discount-msg';
    try {
        if(!isReusableCode(code) && await isCodeUsed(code)){
            msg.textContent = 'That code has already been used.';
            msg.className = 'discount-msg error';
            return;
        }
    } catch(err){
        msg.textContent = "Couldn't check the code right now — please try again.";
        msg.className = 'discount-msg error';
        return;
    } finally {
        applyBtn.disabled = false;
    }
    appliedDiscountCode = code;
    try { localStorage.setItem('sb_discount', appliedDiscountCode); } catch(e){}
    renderBasket();
}

function removeDiscountCode(){
    appliedDiscountCode = null;
    try { localStorage.removeItem('sb_discount'); } catch(e){}
    document.getElementById('discountMsg').textContent = '';
    document.getElementById('discountMsg').className = 'discount-msg';
    renderBasket();
}

document.getElementById('discountApplyBtn').addEventListener('click', ()=>{
    if(document.getElementById('discountApplyBtn').dataset.mode === 'remove'){ removeDiscountCode(); }
    else { applyDiscountCode(); }
});
document.getElementById('discountInput').addEventListener('keydown', e=>{
    if(e.key === 'Enter'){ e.preventDefault(); applyDiscountCode(); }
});

let previousBodyOverflow = '';
function openDrawer(){
    if(!basketDrawer.classList.contains('open')) previousBodyOverflow = document.body.style.overflow;
    basketDrawer.classList.add('open'); drawerOverlay.classList.add('open'); document.body.style.overflow='hidden'; showCartStep();
}
function closeDrawer(){
    basketDrawer.classList.remove('open'); drawerOverlay.classList.remove('open'); document.body.style.overflow=previousBodyOverflow;
}
function showCartStep(){ cartStep.style.display='flex'; cartStep.style.flexDirection='column'; cartStep.style.height='100%'; checkoutStep.style.display='none'; paymentStep.style.display='none'; }
function showCheckoutStep(){ cartStep.style.display='none'; checkoutStep.style.display='flex'; paymentStep.style.display='none'; }
function generateOrderNumber(){
    const d = new Date();
    const datePart = d.getFullYear().toString().slice(2) + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0');
    const randPart = Math.floor(1000 + Math.random()*9000);
    return `SB-${datePart}-${randPart}`;
}
function showPaymentStep(orderNumber, amount, subtotal, discount){
    document.getElementById('payOrderNumber').textContent = orderNumber;
    document.getElementById('payNoteOrderNumber').textContent = orderNumber;
    document.getElementById('payAmount').textContent = '€'+amount.toFixed(2);
    document.getElementById('paySubtotal').textContent = '€'+subtotal.toFixed(2);
    document.getElementById('payShipping').textContent = '€'+SHIPPING_FLAT.toFixed(2);
    document.getElementById('payAccountName').textContent = IBAN_ACCOUNT_NAME;
    document.getElementById('payIban').textContent = IBAN_NUMBER;
    const discountRow = document.getElementById('payDiscountRow');
    if(discount>0){
        document.getElementById('payDiscount').textContent = '−€'+discount.toFixed(2);
        discountRow.style.display = 'flex';
    } else {
        discountRow.style.display = 'none';
    }
    cartStep.style.display='none'; checkoutStep.style.display='none'; paymentStep.style.display='flex';
}

function toggleDrawer(){
    if(basketDrawer.classList.contains('open')){ closeDrawer(); }
    else { openDrawer(); }
}
basketBtn.addEventListener('click', toggleDrawer);
drawerOverlay.addEventListener('click', closeDrawer);
document.getElementById('drawerClose1').addEventListener('click', closeDrawer);
document.getElementById('drawerClose2').addEventListener('click', closeDrawer);
document.getElementById('drawerClose3').addEventListener('click', closeDrawer);
document.addEventListener('keydown', e=>{ if(e.key==='Escape' && basketDrawer.classList.contains('open')) closeDrawer(); });
document.getElementById('checkoutBtn').addEventListener('click', showCheckoutStep);
document.getElementById('backToCart').addEventListener('click', showCartStep);
document.getElementById('agreeTermsLink').addEventListener('click', e=>{
    e.preventDefault();
    e.stopPropagation();
    closeDrawer();
    goToInfoSection('terms-conditions');
});

/* ─── CHECKOUT SUBMIT → EMAIL ─── */
const checkoutForm = document.getElementById('checkoutForm');
const placeOrderBtn = document.getElementById('placeOrderBtn');

checkoutForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    if(basket.length===0) return;

    const orderNumber = generateOrderNumber();
    const orderSubtotal = basketSubtotal();
    const orderTotal = basketTotal();
    const orderDiscount = discountAmount();
    const orderDiscountCode = orderDiscount>0 ? appliedDiscountCode : null;
    const discountLine = orderDiscountCode ? `Discount (${orderDiscountCode}): −€${orderDiscount.toFixed(2)}\n` : '';

    const itemsSummary = basket.map(i=>
        `${i.qty}x ${i.name}${i.price!=null ? ' — €'+(i.price*i.qty).toFixed(2) : ' — quote on request'}${i.note ? ' | Note: '+i.note : ''}`
    ).join('\n');

    const custName = document.getElementById('custName').value;
    const custEmail = document.getElementById('custEmail').value;
    const countryCode = document.getElementById('countryCode').value;
    const localPhone = document.getElementById('custPhone').value.replace(/\D/g, '').replace(/^0/, '');
    const fullPhoneNumber = countryCode + localPhone;

    const autoMessage =
`Hi ${custName},

Thanks for your order at Scorbunny Cards! This confirms we've received it and it's now being processed.

ORDER NUMBER: ${orderNumber}
(use this as your payment reference)

ORDER SUMMARY
${itemsSummary}

Subtotal: €${orderSubtotal.toFixed(2)}
Shipping: €${SHIPPING_FLAT.toFixed(2)}
${discountLine}TOTAL DUE: €${orderTotal.toFixed(2)}

NEXT STEP — PAYMENT
Your order will only move into production once payment is received. Please pay the total above by IBAN bank transfer:

Account holder: ${IBAN_ACCOUNT_NAME}
IBAN: ${IBAN_NUMBER}
Reference: ${orderNumber}

Once we've confirmed your payment, you'll get a follow-up email letting you know your order is being prepared.

Thanks again!
Scorbunny Cards`;

    const ownerMessage =
`New order received!

ORDER NUMBER: ${orderNumber}

CUSTOMER
Name: ${custName}
Email: ${custEmail}
Phone: ${fullPhoneNumber}
Shipping Address: ${document.getElementById('custAddress').value}
Notes: ${document.getElementById('custNotes').value || '—'}
Agreed to Terms & Policies: ${document.getElementById('custAgree').checked ? 'Yes' : 'No'}
Agreed to Pay: ${document.getElementById('custAgreePay').checked ? 'Yes' : 'No'}

ORDER ITEMS
${itemsSummary}

Subtotal: €${orderSubtotal.toFixed(2)}
Shipping: €${SHIPPING_FLAT.toFixed(2)}
${discountLine}TOTAL: €${orderTotal.toFixed(2)}

Payment Method: IBAN Bank Transfer
Payment Reference To Watch For: ${orderNumber}

— Add this order to the admin page once you see it. —`;

    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = 'Sending...';

    // Reserve the discount code BEFORE sending anything. The database only
    // lets one order claim a given code, so it can never be used twice.
    if(orderDiscountCode && !isReusableCode(orderDiscountCode)){
        try{
            if(await claimDiscountCode(orderDiscountCode, orderNumber) === 'used'){
                removeDiscountCode();
                alert(`Sorry — the code ${orderDiscountCode} has just been used, so it was removed from your basket. Please review your total and place the order again.`);
                placeOrderBtn.disabled = false;
                placeOrderBtn.textContent = 'Place Order';
                return;
            }
        } catch(err){
            alert("We couldn't verify your discount code right now. Please try again in a moment.");
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = 'Place Order';
            return;
        }
    }

    try{
        // send the customer's confirmation + the owner's notification as two
        // separate real emails — this replaces FormSubmit, which was silently
        // failing to email the customer whenever its CAPTCHA was disabled.
        await sendMail(custEmail, `Order #${orderNumber} confirmed — payment needed`, autoMessage);
        await sendMail(ORDER_EMAIL, `New order #${orderNumber} — Scorbunny Extensions`, ownerMessage);
        try { await recordSoldOrder(orderNumber); } catch(error) { console.warn('Sold order event could not be recorded.', error); }

        showPaymentStep(orderNumber, orderTotal, orderSubtotal, orderDiscount);
        basket = [];
        saveBasket();
        if(orderDiscountCode) removeDiscountCode();
        checkoutForm.reset();
    } catch(err){
        alert("We couldn't send your order automatically. Please email us directly and we'll take care of it — sorry about that!" + (orderDiscountCode && !isReusableCode(orderDiscountCode) ? ` Your code ${orderDiscountCode} has been reserved for this order, so please mention it in your email.` : ''));
    } finally {
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Place Order';
    }
});

/* ─── COPY-TO-CLIPBOARD (payment step) ─── */
document.querySelectorAll('.pay-copy-btn').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
        const text = document.getElementById(btn.dataset.copyTarget).textContent;
        try{
            await navigator.clipboard.writeText(text);
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            setTimeout(()=>{ btn.textContent = original; btn.classList.remove('copied'); }, 1600);
        } catch(err){ /* clipboard unavailable — silently ignore */ }
    });
});

/* ═══════════════════════════════════════
   PRODUCT QUICK-VIEW MODAL
═══════════════════════════════════════ */
const productOverlay = document.getElementById('productOverlay');
const productForm = document.getElementById('productForm');
let currentProduct = null;
let selectedFrame = FRAME_COLORS[0].id;
let selectedCase = CASE_TYPES[0].id;
let selectedCardCount = CARD_COUNTS[0].id;

function renderPills(containerId, options, selectedId, onSelect){
    const c = document.getElementById(containerId);
    c.innerHTML = options.map(o=>`<button type="button" class="pill${o.id===selectedId?' selected':''}" data-id="${o.id}">${o.label}</button>`).join('');
    c.querySelectorAll('.pill').forEach(btn=>{
        btn.addEventListener('click', ()=>{
            c.querySelectorAll('.pill').forEach(b=>b.classList.remove('selected'));
            btn.classList.add('selected');
            onSelect(btn.dataset.id);
        });
    });
}

function currentPrice(){
    if(currentProduct && currentProduct.id === 'ext-a4'){
        return CARD_COUNTS.find(c=>c.id===selectedCardCount).price;
    }
    return currentProduct ? currentProduct.price : null;
}
function updatePriceDisplay(){
    const p = currentPrice();
    document.getElementById('productPrice').textContent = p!=null ? '€'+p.toFixed(2) : 'Quote on request';
}
/* ─── Product modal photo carousel ─── */
let productCarouselIndex = 0;
function buildProductCarousel(item){
    const imgs = (item.images && item.images.length ? item.images : [item.file]);
    const track = document.getElementById('productCarouselTrack');
    const dotsWrap = document.getElementById('productCarouselDots');
    const prevBtn = document.getElementById('productCarouselPrev');
    const nextBtn = document.getElementById('productCarouselNext');
    productCarouselIndex = 0;

    track.innerHTML = imgs.map(src=>productPhotoElement(src, item.name)).join('');
    dotsWrap.innerHTML = imgs.length>1 ? imgs.map((_,d)=>`<button type="button" data-i="${d}" class="${d===0?'active':''}"></button>`).join('') : '';
    const showControls = imgs.length>1;
    dotsWrap.style.display = showControls ? 'flex' : 'none';
    prevBtn.style.display = showControls ? 'flex' : 'none';
    nextBtn.style.display = showControls ? 'flex' : 'none';
    const gallery = track.parentElement;

    function updateSlideBackground(){
        const backgroundSrc = new URL(productPhotoSource(imgs[productCarouselIndex]), document.baseURI).href;
        gallery.style.setProperty('--product-slide-background', `url("${backgroundSrc}")`);
    }

    function go(n){
        productCarouselIndex = (n+imgs.length)%imgs.length;
        track.style.transform = `translateX(-${productCarouselIndex*100}%)`;
        dotsWrap.querySelectorAll('button').forEach((d,idx)=>d.classList.toggle('active', idx===productCarouselIndex));
        updateSlideBackground();
    }
    prevBtn.onclick = ()=> go(productCarouselIndex-1);
    nextBtn.onclick = ()=> go(productCarouselIndex+1);
    dotsWrap.querySelectorAll('button').forEach(d=>d.addEventListener('click', ()=> go(parseInt(d.dataset.i))));
    go(0);

    let startX = null;
    track.parentElement.ontouchstart = e=>{ startX = e.touches[0].clientX; };
    track.parentElement.ontouchend = e=>{
        if(startX===null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if(Math.abs(dx) > 40){ dx < 0 ? go(productCarouselIndex+1) : go(productCarouselIndex-1); }
        startX = null;
    };
}

function openProductModal(item){
    currentProduct = item;
    selectedFrame = FRAME_COLORS[0].id;
    selectedCase = CASE_TYPES[0].id;
    selectedCardCount = CARD_COUNTS[0].id;
    buildProductCarousel(item);
    document.getElementById('productName').textContent = item.name;
    document.getElementById('productDesc').textContent = item.desc || '';
    renderPills('frameColorPills', FRAME_COLORS, selectedFrame, id=>{ selectedFrame=id; });
    renderPills('caseTypePills', CASE_TYPES, selectedCase, id=>{ selectedCase=id; });
    const cardCountField = document.getElementById('cardCountField');
    if(item.id === 'ext-a4'){
        cardCountField.classList.remove('initially-hidden');
        renderPills('cardCountPills', CARD_COUNTS, selectedCardCount, id=>{ selectedCardCount=id; updatePriceDisplay(); });
    } else {
        cardCountField.classList.add('initially-hidden');
    }
    updatePriceDisplay();
    document.getElementById('productCardName').value = '';
    productOverlay.classList.add('open');
}
function closeProductModal(){ productOverlay.classList.remove('open'); }
document.getElementById('productClose').addEventListener('click', closeProductModal);
productOverlay.addEventListener('click', e=>{ if(e.target===productOverlay) closeProductModal(); });

productForm.addEventListener('submit', e=>{
    e.preventDefault();
    const cardName = document.getElementById('productCardName').value.trim();
    const frameLabel = FRAME_COLORS.find(f=>f.id===selectedFrame).label;
    const caseLabel = CASE_TYPES.find(c=>c.id===selectedCase).label;
    const isA4 = currentProduct.id === 'ext-a4';
    const cardCountLabel = isA4 ? CARD_COUNTS.find(c=>c.id===selectedCardCount).label : null;
    addToBasket({
        id: currentProduct.id + '-' + Date.now(),
        name: currentProduct.name,
        price: currentPrice(),
        image: (currentProduct.images && currentProduct.images[0]) || currentProduct.file,
        note: `Frame: ${frameLabel} · Case: ${caseLabel}${isA4 ? ' · Cards: ' + cardCountLabel : ''} · Card: ${cardName}`
    });
    closeProductModal();
});

/* ─── INIT ─── */
renderBasket();
updateBasketCount();