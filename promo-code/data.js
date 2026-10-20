// Örnek veri. Gerçek sitede bu kısım bir veritabanından / admin panelinden gelir.
// Mağazalar ve kodlar tamamen hayalidir; kendi anlaşmalı mağazalarınla değiştir.
// `url` alanına mağazanın affiliate (ortaklık) linkini koyarsın — gelir buradan gelir.

const CATEGORIES = [
  { slug: "giyim", name: "Giyim", icon: "👕" },
  { slug: "bebek-cocuk", name: "Bebek & Çocuk", icon: "🍼" },
  { slug: "ev-bahce", name: "Ev & Bahçe", icon: "🏡" },
  { slug: "spor-outdoor", name: "Spor & Outdoor", icon: "⛺" },
  { slug: "seyahat", name: "Seyahat", icon: "✈️" },
  { slug: "saglik", name: "Sağlık & Wellness", icon: "💊" },
  { slug: "kozmetik", name: "Kozmetik & Bakım", icon: "💄" },
  { slug: "taki-saat", name: "Takı & Saat", icon: "⌚" },
  { slug: "market", name: "Yemek & Market", icon: "🛒" },
  { slug: "elektronik", name: "Elektronik & Yazılım", icon: "💻" },
  { slug: "evcil-hayvan", name: "Evcil Hayvan", icon: "🐾" },
  { slug: "hediye", name: "Hediye", icon: "🎁" },
];

const STORES = [
  { slug: "modapark", name: "ModaPark", category: "giyim", color: "#e85d4a", url: "https://example.com/?ref=modapark", about: "Kadın, erkek ve çocuk giyiminde sezon trendleri." },
  { slug: "ayakkabicim", name: "Ayakkabıcım", category: "giyim", color: "#8b5cf6", url: "https://example.com/?ref=ayakkabicim", about: "Spor, klasik ve günlük ayakkabı modelleri." },
  { slug: "miniadim", name: "MiniAdım", category: "bebek-cocuk", color: "#f59e0b", url: "https://example.com/?ref=miniadim", about: "Bebek bakım ürünleri, oyuncak ve çocuk giyimi." },
  { slug: "evsepeti", name: "EvSepeti", category: "ev-bahce", color: "#10b981", url: "https://example.com/?ref=evsepeti", about: "Ev tekstili, mutfak ve dekorasyon ürünleri." },
  { slug: "zirvespor", name: "ZirveSpor", category: "spor-outdoor", color: "#0ea5e9", url: "https://example.com/?ref=zirvespor", about: "Koşu, fitness ve outdoor ekipmanları." },
  { slug: "kampkur", name: "KampKur", category: "spor-outdoor", color: "#65a30d", url: "https://example.com/?ref=kampkur", about: "Çadır, uyku tulumu ve kamp malzemeleri." },
  { slug: "ucusnet", name: "UçuşNet", category: "seyahat", color: "#2563eb", url: "https://example.com/?ref=ucusnet", about: "Yurt içi ve yurt dışı uçak bileti." },
  { slug: "otelbul", name: "OtelBul", category: "seyahat", color: "#db2777", url: "https://example.com/?ref=otelbul", about: "Binlerce otelde en uygun konaklama fiyatları." },
  { slug: "vitaminkutusu", name: "VitaminKutusu", category: "saglik", color: "#16a34a", url: "https://example.com/?ref=vitaminkutusu", about: "Takviye gıda, vitamin ve sporcu besinleri." },
  { slug: "guzellab", name: "GüzelLab", category: "kozmetik", color: "#c026d3", url: "https://example.com/?ref=guzellab", about: "Cilt bakımı, makyaj ve parfüm." },
  { slug: "altinca", name: "Altınça", category: "taki-saat", color: "#ca8a04", url: "https://example.com/?ref=altinca", about: "Altın, gümüş takı ve kol saatleri." },
  { slug: "tazemarket", name: "TazeMarket", category: "market", color: "#ea580c", url: "https://example.com/?ref=tazemarket", about: "Kapına gelen online market alışverişi." },
  { slug: "teknobahce", name: "TeknoBahçe", category: "elektronik", color: "#475569", url: "https://example.com/?ref=teknobahce", about: "Telefon, bilgisayar ve akıllı ev cihazları." },
  { slug: "yazilimplus", name: "YazılımPlus", category: "elektronik", color: "#7c3aed", url: "https://example.com/?ref=yazilimplus", about: "Antivirüs, VPN ve ofis yazılımı lisansları." },
  { slug: "patidostu", name: "PatiDostu", category: "evcil-hayvan", color: "#b45309", url: "https://example.com/?ref=patidostu", about: "Kedi ve köpek maması, aksesuar ve bakım." },
  { slug: "hediyeatolyesi", name: "Hediye Atölyesi", category: "hediye", color: "#e11d48", url: "https://example.com/?ref=hediyeatolyesi", about: "Kişiye özel hediyeler ve çiçek gönderimi." },
];

// type: "code" = kod gösterilir, "deal" = kod yok, direkt mağazaya gider
// value: kartta büyük yazan kısım. prefix: "EN FAZLA" gibi küçük üst yazı
const COUPONS = [
  { id: 1, store: "patidostu", type: "code", value: "%32", title: "Sitemize özel! Bu kodla PatiDostu'nda tüm siparişlerde %32 indirim.", code: "PATI32", exclusive: true, top: true, featured: true, expires: "2026-12-31", uses: 1240 },
  { id: 2, store: "yazilimplus", type: "code", value: "%10", title: "YazılımPlus Aile Paketi'nde %10 indirim kazan.", code: "PLUS10", top: true, featured: true, expires: "2026-11-30", uses: 532 },
  { id: 3, store: "ucusnet", type: "code", value: "250 ₺", title: "Uçak bileti hizmet bedelinde 250 ₺'ye varan indirim.", code: "UCUS250", top: true, expires: "2026-11-15", uses: 2190 },
  { id: 4, store: "teknobahce", type: "code", value: "%50", title: "Sitemize özel! Akıllı ev ürünlerinde %50 indirim.", code: "TEKNO50", exclusive: true, top: true, featured: true, expires: "2026-11-10", uses: 874 },
  { id: 5, store: "modapark", type: "code", value: "%25", title: "Sitemize özel! Sınırlı süre, tüm sepette %25 indirim.", code: "MODA25X", exclusive: true, top: true, featured: true, expires: "2026-11-05", uses: 3021 },
  { id: 6, store: "zirvespor", type: "deal", value: "%20", prefix: "EN FAZLA", title: "Bültene kaydol, ilk siparişte %20'ye varan indirim.", featured: true, expires: "2026-12-31", uses: 410 },
  { id: 7, store: "kampkur", type: "deal", value: "%50", prefix: "EN FAZLA", title: "İndirimli ürünlerde %50'ye varan fırsat + 750 ₺ üzeri ücretsiz kargo.", featured: true, expires: "2026-11-20", uses: 965 },
  { id: 8, store: "ayakkabicim", type: "code", value: "%12", title: "Sitemize özel! İndirimli ürünlerde ekstra %12 indirim.", code: "ADIM12", exclusive: true, featured: true, expires: "2026-11-25", uses: 688 },
  { id: 9, store: "otelbul", type: "deal", value: "%25", prefix: "EN FAZLA", title: "2027 tatil planları için otel rezervasyonunda %25'e varan indirim.", featured: true, expires: "2027-01-31", uses: 1502 },
  { id: 10, store: "teknobahce", type: "deal", value: "%10", title: "Üye ol, ilk alışverişinde %10 indirim kazan.", featured: true, expires: "2026-12-31", uses: 345 },
  { id: 11, store: "vitaminkutusu", type: "code", value: "%10", title: "Tüm sepette geçerli %10 indirim kodu.", code: "VITA10", featured: true, expires: "2026-11-30", uses: 289 },
  { id: 12, store: "modapark", type: "deal", value: "%65", prefix: "EN FAZLA", title: "Outlet ürünlerinde %65'e varan indirim.", featured: true, expires: "2026-11-12", uses: 4410 },
  { id: 13, store: "ucusnet", type: "code", value: "500 ₺", prefix: "EN FAZLA", title: "Sonbahar uçuşlarında 500 ₺'ye varan indirim.", code: "SONBAHAR500", featured: true, expires: "2026-11-30", uses: 1120 },
  { id: 14, store: "evsepeti", type: "code", value: "3.500 ₺", title: "40.000 ₺ ve üzeri siparişlerde 3.500 ₺ indirim.", code: "EV3500", featured: true, expires: "2026-12-15", uses: 98 },
  { id: 15, store: "guzellab", type: "code", value: "%15", title: "Üyelikle tüm siparişlerde %15 indirim.", code: "GUZEL15", featured: true, expires: "2026-11-30", uses: 1777 },
  { id: 16, store: "altinca", type: "code", value: "%20", title: "Sadece bugün! Tüm gümüş takılarda %20 indirim.", code: "GUMUS20", featured: true, expires: "2026-10-31", uses: 233 },
  { id: 17, store: "miniadim", type: "code", value: "%15", title: "Organik bambu bebek kıyafetlerinde ekstra %15 indirim.", code: "BEBEK15", featured: true, expires: "2026-11-30", uses: 640 },
  { id: 18, store: "tazemarket", type: "code", value: "150 ₺", title: "1.000 ₺ üzeri ilk siparişte 150 ₺ indirim.", code: "TAZE150", featured: true, expires: "2026-12-31", uses: 5012 },
  { id: 19, store: "hediyeatolyesi", type: "code", value: "%20", title: "Sitemize özel! Kişiye özel hediyelerde %20 indirim.", code: "HEDIYE20", exclusive: true, featured: true, expires: "2026-12-31", uses: 402 },
  { id: 20, store: "zirvespor", type: "code", value: "%15", title: "Tüm koşu ayakkabılarında %15 indirim kodu.", code: "KOS15", expires: "2026-12-01", uses: 377 },
  { id: 21, store: "kampkur", type: "code", value: "%10", title: "Çadır ve uyku tulumlarında %10 indirim.", code: "KAMP10", expires: "2026-11-30", uses: 154 },
  { id: 22, store: "otelbul", type: "code", value: "%8", title: "Mobil uygulamadan ilk rezervasyonda %8 indirim.", code: "MOBIL8", expires: "2026-12-31", uses: 801 },
  { id: 23, store: "vitaminkutusu", type: "deal", value: "1+1", title: "Seçili vitaminlerde 1 alana 1 bedava.", expires: "2026-11-15", uses: 512 },
  { id: 24, store: "guzellab", type: "deal", value: "%40", prefix: "EN FAZLA", title: "Parfüm ve cilt bakımında %40'a varan indirim.", expires: "2026-11-20", uses: 920 },
  { id: 25, store: "altinca", type: "deal", value: "ÜCRETSİZ", label: "KARGO", title: "Tüm siparişlerde ücretsiz ve sigortalı kargo.", expires: "2026-12-31", uses: 140 },
  { id: 26, store: "tazemarket", type: "deal", value: "%30", prefix: "EN FAZLA", title: "Meyve ve sebzede haftanın fırsatları.", expires: "2026-10-27", uses: 2210 },
  { id: 27, store: "miniadim", type: "deal", value: "%35", prefix: "EN FAZLA", title: "Oyuncaklarda sezon sonu indirimi.", expires: "2026-11-30", uses: 330 },
  { id: 28, store: "evsepeti", type: "deal", value: "%45", prefix: "EN FAZLA", title: "Nevresim takımlarında %45'e varan indirim.", expires: "2026-11-10", uses: 760 },
  { id: 29, store: "yazilimplus", type: "deal", value: "%50", title: "VPN yıllık planında ilk 3 ay %50 indirim.", expires: "2026-12-31", uses: 1290 },
  { id: 30, store: "patidostu", type: "deal", value: "ÜCRETSİZ", label: "KARGO", title: "500 ₺ üzeri mama siparişlerinde ücretsiz kargo.", expires: "2026-12-31", uses: 1840 },
  { id: 31, store: "hediyeatolyesi", type: "deal", value: "%25", prefix: "EN FAZLA", title: "Yılbaşı hediye kutularında erken alım indirimi.", expires: "2026-12-20", uses: 210 },
  { id: 32, store: "ayakkabicim", type: "deal", value: "2. ÜRÜN", label: "%50", title: "İkinci çiftte %50 indirim.", expires: "2026-11-30", uses: 1450 },
];

const SEASONS = [
  { slug: "black-friday", name: "Black Friday", icon: "🖤" },
  { slug: "11-11", name: "11.11 İndirimleri", icon: "🛍️" },
  { slug: "yilbasi", name: "Yılbaşı", icon: "🎄" },
];
