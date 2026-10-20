// KodAvı — istemci tarafı uygulama (hash router + kupon gösterme akışı)

// "modal": kod aynı sekmede açılan pencerede gösterilir (varsayılan).
// "popunder": promocodes.com'un yaptığı gibi — kod yeni sekmede gösterilir,
// mevcut sekme mağazanın affiliate linkine yönlenir (tıklama komisyona sayılır).
const REVEAL_MODE = "modal";

const $ = (sel, root = document) => root.querySelector(sel);
const app = $("#app");
const storeBySlug = Object.fromEntries(STORES.map((s) => [s.slug, s]));
const catBySlug = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));
const TODAY = new Date("2026-10-20");

// ---------- Yardımcılar ----------
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const norm = (s) => s.toLocaleLowerCase("tr").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i");
const initials = (name) => name.replace(/[^A-Za-zÇĞİÖŞÜçğıöşü ]/g, "").split(/(?=[A-ZÇĞİÖŞÜ])| /).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
const daysLeft = (d) => Math.ceil((new Date(d) - TODAY) / 86400000);
const fmtDate = (d) => new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
const couponsOf = (slug) => COUPONS.filter((c) => c.store === slug);
const monthName = TODAY.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });

function store(slug) { return storeBySlug[slug]; }

function logo(s, size = "") {
  return `<span class="store-logo ${size}" style="background:${s.color}">${esc(initials(s.name))}</span>`;
}

function discount(c) {
  return `<div class="discount">
    ${c.prefix ? `<span class="prefix">${esc(c.prefix)}</span>` : ""}
    <span class="value">${esc(c.value)}</span><span class="label">${esc(c.label || (c.value.match(/^[%\d]/) || c.value.includes("₺") ? "İNDİRİM" : ""))}</span>
  </div>`;
}

function badges(c) {
  const d = daysLeft(c.expires);
  return `<div class="badges">
    ${c.exclusive ? `<span class="badge badge-exclusive">Sitemize Özel</span>` : ""}
    ${c.type === "code" ? `<span class="badge badge-verified">✓ Doğrulandı</span>` : ""}
    ${d <= 7 ? `<span class="badge badge-soon">⏳ ${d <= 0 ? "Bugün bitiyor" : d + " gün kaldı"}</span>` : ""}
  </div>`;
}

function actionBtn(c) {
  if (c.type === "code") {
    return `<button class="reveal" data-reveal="${c.id}" aria-label="${esc(store(c.store).name)} kodunu göster">
      <span class="peek">${esc(c.code.slice(-3))}</span><span class="cover">KODU GÖSTER</span></button>`;
  }
  return `<button class="btn btn-outline deal-btn" data-reveal="${c.id}">FIRSATI KULLAN →</button>`;
}

function getUses(c) {
  try { return c.uses + Number(localStorage.getItem("uses-" + c.id) || 0); } catch { return c.uses; }
}
function addUse(c) {
  try { localStorage.setItem("uses-" + c.id, Number(localStorage.getItem("uses-" + c.id) || 0) + 1); } catch {}
}

// ---------- Kartlar ----------
function card(c, withBanner = false) {
  const s = store(c.store);
  return `<article class="card">
    ${withBanner ? `<div class="card-banner" style="background:linear-gradient(135deg, ${s.color}, ${s.color}cc)"><span class="store-mark">${esc(s.name)}</span></div>` : ""}
    <div class="card-body">
      ${withBanner ? "" : `<a class="card-store" href="#/magaza/${s.slug}">${logo(s)}<span class="name">${esc(s.name)}</span></a>`}
      ${discount(c)}
      <p class="card-title">${esc(c.title)}</p>
      ${badges(c)}
      <div class="meta"><a href="#/magaza/${s.slug}">${esc(s.name)} kuponları</a><span>${getUses(c).toLocaleString("tr-TR")} kullanım</span></div>
      ${actionBtn(c)}
    </div>
  </article>`;
}

function row(c) {
  const s = store(c.store);
  return `<article class="row">
    <div class="discount-box">${discount(c)}<div class="muted" style="font-size:12px;margin-top:6px">${c.type === "code" ? "KOD" : "FIRSAT"}</div></div>
    <div>
      <h3>${esc(c.title)}</h3>
      ${badges(c)}
      <div class="meta" style="margin-top:8px;justify-content:flex-start;gap:16px">
        <span>Son gün: ${fmtDate(c.expires)}</span><span>${getUses(c).toLocaleString("tr-TR")} kullanım</span>
      </div>
    </div>
    <div class="row-action">${actionBtn(c)}</div>
  </article>`;
}

// ---------- Sayfalar ----------
function homePage() {
  const top = COUPONS.filter((c) => c.top).slice(0, 5);
  const featured = COUPONS.filter((c) => c.featured && !c.top);
  const rest = COUPONS.filter((c) => !c.featured);
  document.title = "KodAvı — İndirim Kodları, Kuponlar ve Fırsatlar";
  return `
  <section class="section">
    <div class="section-head"><h1>🎟️ Bugünün En İyi İndirim Kodları</h1></div>
    <p class="section-lead">Tasarruf ekibimiz haftanın en iyi kupon ve indirim kodlarını senin için seçti. Anlaşmalı mağazalarımız sayesinde başka yerde bulamayacağın özel kodlar da burada.</p>
    <div class="grid grid-top">${top.map((c) => card(c, true)).join("")}</div>
  </section>

  <section class="section">
    <div class="section-head"><h2>🔥 ${monthName} Trend Kuponlar</h2><a class="link-more" href="#/magazalar">Tüm mağazalar →</a></div>
    <p class="section-lead">İndirim kodu, ödeme adımında girdiğin ve sepetine indirim ya da avantaj sağlayan harf-rakam dizisidir. Kupon kodu, promosyon kodu veya çek kodu olarak da bilinir.</p>
    <div class="grid">${featured.map((c) => card(c)).join("")}</div>
  </section>

  <section class="section">
    <div class="section-head"><h2>Kategorilere Göz At</h2><a class="link-more" href="#/kategoriler">Tümü →</a></div>
    <div class="tiles" style="margin-top:14px">${CATEGORIES.map(catTile).join("")}</div>
  </section>

  <section class="section">
    <div class="section-head"><h2>Daha Fazla Fırsat</h2></div>
    <div class="grid" style="margin-top:14px">${rest.map((c) => card(c)).join("")}</div>
  </section>

  <section class="section">${howItWorks()}</section>

  <section class="section">
    <div class="section-head"><h2>Popüler Mağazalar</h2><a class="link-more" href="#/magazalar">A-Z →</a></div>
    <div class="tiles" style="margin-top:14px">${STORES.slice(0, 12).map(storeTile).join("")}</div>
  </section>`;
}

function howItWorks() {
  return `<div class="info">
    <h2>KodAvı nasıl çalışır?</h2>
    <p>Mağazalarla kurduğumuz ortaklıklar sayesinde güncel indirim kodlarını tek yerde topluyoruz. Kullanmak tamamen ücretsiz.</p>
    <div class="steps">
      <div class="step"><b>1</b><h4>Mağazanı bul</h4><p>Arama kutusundan ya da kategorilerden alışveriş yapacağın mağazayı seç.</p></div>
      <div class="step"><b>2</b><h4>Kodu göster ve kopyala</h4><p>“Kodu Göster”e tıkla, kod otomatik olarak kopyalanır ve mağaza açılır.</p></div>
      <div class="step"><b>3</b><h4>Ödemede yapıştır</h4><p>Sepette indirim kodu alanına yapıştır, indirimin anında uygulanır.</p></div>
    </div>
  </div>`;
}

function storeTile(s) {
  const n = couponsOf(s.slug).length;
  return `<a class="tile" href="#/magaza/${s.slug}">${logo(s)}<div><div class="t-name">${esc(s.name)}</div><div class="t-sub">${n} kupon</div></div></a>`;
}

function catTile(c) {
  const n = COUPONS.filter((k) => store(k.store).category === c.slug).length;
  return `<a class="tile" href="#/kategori/${c.slug}"><span class="emoji">${c.icon}</span><div><div class="t-name">${esc(c.name)}</div><div class="t-sub">${n} kupon</div></div></a>`;
}

function storePage(slug, filter = "all") {
  const s = store(slug);
  if (!s) return notFound();
  const all = couponsOf(slug);
  const list = all.filter((c) => filter === "all" || c.type === filter);
  const cat = catBySlug[s.category];
  const similar = STORES.filter((x) => x.category === s.category && x.slug !== slug);
  const others = similar.length ? similar : STORES.filter((x) => x.slug !== slug).slice(0, 5);
  const best = all.reduce((a, c) => (parseInt(c.value.replace(/\D/g, "")) > parseInt((a?.value || "0").replace(/\D/g, "")) && c.value.includes("%") ? c : a), null);
  document.title = `${s.name} İndirim Kodu ve Kuponları (${monthName}) — KodAvı`;
  return `
  <div class="crumbs"><a href="#/">Ana Sayfa</a> › <a href="#/kategori/${cat.slug}">${esc(cat.name)}</a> › ${esc(s.name)}</div>
  <div class="store-hero">
    ${logo(s, "lg")}
    <div>
      <h1>${esc(s.name)} İndirim Kodları</h1>
      <p>${esc(s.about)} ${all.length} aktif kupon · ${monthName}</p>
    </div>
    <div class="actions"><a class="btn btn-primary" href="${esc(s.url)}" target="_blank" rel="nofollow sponsored noopener">Mağazaya Git ↗</a></div>
  </div>
  <div class="layout-2">
    <div>
      <div class="tabs">
        ${[["all", `Tümü (${all.length})`], ["code", `Kodlar (${all.filter((c) => c.type === "code").length})`], ["deal", `Fırsatlar (${all.filter((c) => c.type === "deal").length})`]]
          .map(([k, l]) => `<a class="tab ${filter === k ? "active" : ""}" href="#/magaza/${slug}${k === "all" ? "" : "/" + k}">${l}</a>`).join("")}
      </div>
      <div class="list">${list.length ? list.map(row).join("") : emptyState("Bu filtrede kupon yok.")}</div>
      <div class="info" style="margin-top:24px">
        <h2>${esc(s.name)} indirim kodu nasıl kullanılır?</h2>
        <p>1. Yukarıdan bir kupon seç ve “Kodu Göster”e tıkla. 2. Kod panoya kopyalanır, ${esc(s.name)} yeni sekmede açılır. 3. Ürünleri sepete ekle ve ödeme sayfasındaki “İndirim kodu” alanına yapıştır.</p>
      </div>
    </div>
    <aside>
      <div class="side-card">
        <h3>${esc(s.name)} Özeti</h3>
        <div class="stat"><span>Toplam kupon</span><b>${all.length}</b></div>
        <div class="stat"><span>İndirim kodu</span><b>${all.filter((c) => c.type === "code").length}</b></div>
        <div class="stat"><span>En iyi indirim</span><b>${best ? esc(best.value) : "—"}</b></div>
        <div class="stat"><span>Son güncelleme</span><b>${TODAY.toLocaleDateString("tr-TR")}</b></div>
      </div>
      <div class="side-card">
        <h3>Benzer Mağazalar</h3>
        <ul>${others.map((x) => `<li><a href="#/magaza/${x.slug}">${logo(x)}${esc(x.name)}</a></li>`).join("")}</ul>
      </div>
    </aside>
  </div>`;
}

function categoryPage(slug) {
  const c = catBySlug[slug];
  if (!c) return notFound();
  const stores = STORES.filter((s) => s.category === slug);
  const list = COUPONS.filter((k) => store(k.store).category === slug);
  document.title = `${c.name} İndirim Kodları — KodAvı`;
  return `
  <div class="crumbs"><a href="#/">Ana Sayfa</a> › <a href="#/kategoriler">Kategoriler</a> › ${esc(c.name)}</div>
  <section class="section">
    <div class="section-head"><h1>${c.icon} ${esc(c.name)} Kuponları</h1></div>
    <p class="section-lead">${esc(c.name)} kategorisindeki ${stores.length} mağazadan ${list.length} güncel indirim kodu ve fırsat.</p>
    <div class="tiles" style="margin-bottom:24px">${stores.map(storeTile).join("")}</div>
    <div class="grid">${list.map((k) => card(k)).join("") || emptyState("Bu kategoride henüz kupon yok.")}</div>
  </section>`;
}

function seasonPage(slug) {
  const s = SEASONS.find((x) => x.slug === slug);
  if (!s) return notFound();
  const list = COUPONS.filter((c) => c.exclusive || parseInt(c.value.replace(/\D/g, "")) >= 25);
  document.title = `${s.name} İndirim Kodları — KodAvı`;
  return `<section class="section">
    <div class="section-head"><h1>${s.icon} ${esc(s.name)} Fırsatları</h1></div>
    <p class="section-lead">${esc(s.name)} döneminin en güçlü indirimleri ve sitemize özel kodlar.</p>
    <div class="grid">${list.map((c) => card(c)).join("")}</div>
  </section>`;
}

function allStoresPage() {
  const groups = {};
  [...STORES].sort((a, b) => a.name.localeCompare(b.name, "tr")).forEach((s) => {
    const l = s.name[0].toLocaleUpperCase("tr");
    (groups[l] ||= []).push(s);
  });
  document.title = "Tüm Mağazalar A-Z — KodAvı";
  return `<section class="section">
    <div class="section-head"><h1>Tüm Mağazalar</h1></div>
    <p class="section-lead">${STORES.length} mağazada ${COUPONS.length} aktif kupon.</p>
    <div class="az">${Object.keys(groups).map((l) => `<a href="#az-${l}" data-scroll>${l}</a>`).join("")}</div>
    ${Object.entries(groups).map(([l, ss]) => `<div class="az-group" id="az-${l}"><h3>${l}</h3><div class="tiles">${ss.map(storeTile).join("")}</div></div>`).join("")}
  </section>`;
}

function allCategoriesPage() {
  document.title = "Tüm Kategoriler — KodAvı";
  return `<section class="section">
    <div class="section-head"><h1>Tüm Kategoriler</h1></div>
    <div class="tiles" style="margin-top:18px">${CATEGORIES.map(catTile).join("")}</div>
  </section>`;
}

const STATIC_PAGES = {
  "hakkimizda": ["Hakkımızda", "KodAvı, online alışverişte herkesin daha az ödemesi için kuruldu. Ekibimiz her gün yüzlerce mağazanın kampanyalarını takip eder, kodları test eder ve çalışmayanları kaldırır."],
  "nasil-calisir": ["Nasıl Çalışır?", "Mağazalarla affiliate (ortaklık) anlaşmaları yapıyoruz. Sitemizdeki bir bağlantı üzerinden alışveriş yaptığında mağaza bize küçük bir komisyon öder. Sen aynı fiyatı — hatta indirimli fiyatı — ödersin."],
  "magaza-ekle": ["Mağazanı Ekle", "Mağazanın kuponlarını KodAvı'nda yayınlamak ve özel kod kampanyaları yapmak için bizimle iletişime geç: iletisim@ornek.com"],
  "rehber": ["Kupon Rehberi", "Kodu ödeme adımında gir, büyük/küçük harfe dikkat et, minimum sepet tutarını kontrol et ve birden fazla kodun birleştirilip birleştirilemeyeceğini mağazanın koşullarından oku."],
  "gizlilik": ["Gizlilik Politikası", "Bu sayfa örnek metindir. Yayına almadan önce KVKK'ya uygun gizlilik ve çerez politikanı buraya ekle."],
  "kullanim": ["Kullanım Koşulları", "Bu sayfa örnek metindir. Yayına almadan önce kullanım koşullarını buraya ekle."],
};

function staticPage(slug) {
  const p = STATIC_PAGES[slug];
  if (!p) return notFound();
  document.title = `${p[0]} — KodAvı`;
  return `<section class="section"><div class="info"><h2>${esc(p[0])}</h2><p>${esc(p[1])}</p></div></section>
  ${slug === "nasil-calisir" ? `<section class="section">${howItWorks()}</section>` : ""}`;
}

function searchPage(q) {
  const n = norm(q);
  const stores = STORES.filter((s) => norm(s.name).includes(n));
  const list = COUPONS.filter((c) => norm(c.title).includes(n) || norm(store(c.store).name).includes(n));
  document.title = `“${q}” araması — KodAvı`;
  return `<section class="section">
    <div class="section-head"><h1>“${esc(q)}” için sonuçlar</h1></div>
    ${stores.length ? `<div class="tiles" style="margin:18px 0 24px">${stores.map(storeTile).join("")}</div>` : ""}
    <div class="grid">${list.map((c) => card(c)).join("")}</div>
    ${!stores.length && !list.length ? emptyState("Sonuç bulunamadı. Başka bir mağaza adı dene.") : ""}
  </section>`;
}

function emptyState(msg) {
  return `<div class="empty-state"><div class="big">🔍</div><p>${esc(msg)}</p></div>`;
}

function notFound() {
  document.title = "Sayfa bulunamadı — KodAvı";
  return emptyState("Aradığın sayfa bulunamadı.") + `<p style="text-align:center"><a class="btn btn-primary" href="#/">Ana sayfaya dön</a></p>`;
}

// ---------- Router ----------
function route() {
  const hash = location.hash.replace(/^#\/?/, "");
  if (hash.startsWith("az-")) return; // sayfa içi A-Z bağlantıları
  const [path, query] = hash.split("?");
  const parts = path.split("/").filter(Boolean).map(decodeURIComponent);
  let html;
  switch (parts[0]) {
    case undefined: html = homePage(); break;
    case "magaza": html = storePage(parts[1], parts[2] || "all"); break;
    case "kategori": html = categoryPage(parts[1]); break;
    case "sezon": html = seasonPage(parts[1]); break;
    case "magazalar": html = allStoresPage(); break;
    case "kategoriler": html = allCategoriesPage(); break;
    case "sayfa": html = staticPage(parts[1]); break;
    case "ara": html = searchPage(new URLSearchParams(query).get("q") || ""); break;
    default: html = notFound();
  }
  app.innerHTML = html;
  document.querySelectorAll("#cat-links a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#/" + path));
  $("#cat-bar").classList.remove("open");
  window.scrollTo(0, 0);
}

// ---------- Kupon gösterme ----------
function openCoupon(id, { openStore = true } = {}) {
  const c = COUPONS.find((x) => x.id === Number(id));
  if (!c) return;
  const s = store(c.store);
  addUse(c);

  if (REVEAL_MODE === "popunder" && openStore) {
    const u = new URL(location.href);
    u.searchParams.set("kupon", c.id);
    window.open(u.toString(), "_blank");
    location.href = s.url;
    return;
  }

  if (c.type === "code") navigator.clipboard?.writeText(c.code).catch(() => {});
  $("#modal-body").innerHTML = `
    ${logo(s, "lg")}
    <h3 id="modal-title">${esc(s.name)}: ${esc(c.value)} ${c.type === "code" ? "indirim kodu" : "fırsat"}</h3>
    <p class="desc">${esc(c.title)}</p>
    ${c.type === "code" ? `
      <div class="code-box"><span class="code">${esc(c.code)}</span><button class="btn btn-primary" data-copy="${esc(c.code)}">Kopyala</button></div>
      <p class="desc" style="margin-bottom:14px">Kod panoya kopyalandı. ${esc(s.name)} sitesinde ödeme adımında yapıştır.</p>` : `
      <p class="desc">Bu fırsat için kod gerekmez, indirim mağazada otomatik uygulanır.</p>`}
    <a class="btn ${c.type === "code" ? "btn-outline" : "btn-primary"} go" href="${esc(s.url)}" target="_blank" rel="nofollow sponsored noopener">${esc(s.name)} sitesine git ↗</a>
    <div class="feedback">Kod çalıştı mı? <button data-vote="yes">👍 Evet</button><button data-vote="no">👎 Hayır</button></div>
    <p class="desc" style="margin:12px 0 0;font-size:12px">Son geçerlilik: ${fmtDate(c.expires)}</p>`;
  $("#modal").hidden = false;
  document.body.style.overflow = "hidden";
  $(".modal-x").focus();
  if (openStore && c.type === "deal") window.open(s.url, "_blank", "noopener");
}

function closeModal() {
  $("#modal").hidden = true;
  document.body.style.overflow = "";
  const u = new URL(location.href);
  if (u.searchParams.has("kupon")) { u.searchParams.delete("kupon"); history.replaceState(null, "", u); }
  route();
}

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => (t.hidden = true), 2200);
}

// ---------- Arama (anlık öneri) ----------
const searchInput = $("#search");
const searchBox = $("#search-results");
let activeIdx = -1;

function renderSuggestions() {
  const q = norm(searchInput.value.trim());
  activeIdx = -1;
  if (!q) { searchBox.hidden = true; return; }
  const hits = STORES.filter((s) => norm(s.name).includes(q) || norm(catBySlug[s.category].name).includes(q)).slice(0, 6);
  searchBox.innerHTML = hits.length
    ? hits.map((s) => `<a href="#/magaza/${s.slug}">${logo(s)}<span><b>${esc(s.name)}</b><br><span class="muted">${couponsOf(s.slug).length} kupon</span></span></a>`).join("")
    : `<div class="empty">Mağaza bulunamadı — Enter ile kuponlarda ara</div>`;
  searchBox.hidden = false;
}

searchInput.addEventListener("input", renderSuggestions);
searchInput.addEventListener("keydown", (e) => {
  const items = [...searchBox.querySelectorAll("a")];
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    activeIdx = (activeIdx + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    items.forEach((a, i) => a.classList.toggle("active", i === activeIdx));
  } else if (e.key === "Enter") {
    if (items[activeIdx]) location.hash = items[activeIdx].getAttribute("href");
    else if (searchInput.value.trim()) location.hash = "#/ara?q=" + encodeURIComponent(searchInput.value.trim());
    searchBox.hidden = true;
    searchInput.blur();
  } else if (e.key === "Escape") {
    searchBox.hidden = true;
  }
});
searchBox.addEventListener("click", () => { searchBox.hidden = true; searchInput.value = ""; });
document.addEventListener("click", (e) => { if (!e.target.closest(".search")) searchBox.hidden = true; });

// ---------- Genel olaylar ----------
document.addEventListener("click", (e) => {
  const reveal = e.target.closest("[data-reveal]");
  if (reveal) return openCoupon(reveal.dataset.reveal);
  if (e.target.closest("[data-close]")) return closeModal();
  const copy = e.target.closest("[data-copy]");
  if (copy) {
    navigator.clipboard?.writeText(copy.dataset.copy).then(() => toast("Kod kopyalandı ✓"), () => toast("Kodu elle kopyala: " + copy.dataset.copy));
    copy.textContent = "Kopyalandı ✓";
    return;
  }
  const vote = e.target.closest("[data-vote]");
  if (vote) {
    vote.parentElement.textContent = vote.dataset.vote === "yes" ? "Teşekkürler! 🎉" : "Bildirdiğin için teşekkürler, kodu kontrol edeceğiz.";
    return;
  }
  const scroll = e.target.closest("[data-scroll]");
  if (scroll) {
    e.preventDefault();
    document.querySelector(scroll.getAttribute("href"))?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#modal").hidden) closeModal(); });

$("#menu-btn").addEventListener("click", () => {
  const open = $("#cat-bar").classList.toggle("open");
  $("#menu-btn").setAttribute("aria-expanded", open);
});

$("#newsletter-form").addEventListener("submit", (e) => {
  e.preventDefault();
  // Gerçek sitede burada e-posta servisine (Mailchimp, Brevo vb.) gönderilir.
  e.target.reset();
  toast("Abone oldun! İlk bülten yakında gelecek 📬");
});

// ---------- Başlat ----------
$("#seasons").innerHTML = SEASONS.map((s) => `<a href="#/sezon/${s.slug}">${s.icon} ${esc(s.name)}</a>`).join("");
$("#cat-links").innerHTML = CATEGORIES.map((c) => `<a href="#/kategori/${c.slug}">${esc(c.name)}</a>`).join("") + `<a class="all" href="#/kategoriler">Tüm Kategoriler</a>`;
$("#year").textContent = TODAY.getFullYear();

window.addEventListener("hashchange", route);
route();

// popunder modunda yeni sekme ?kupon=ID ile açılır ve kodu gösterir
const initialCoupon = new URLSearchParams(location.search).get("kupon");
if (initialCoupon) openCoupon(initialCoupon, { openStore: false });
