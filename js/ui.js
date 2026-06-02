/* ========= LENZ UI Components — Reusable =========
 * Kumpulan helper render UI.
 */
(function(){
  const escapeHTML = (s="") => String(s).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[m]);

  // Normalisasi item anime dari berbagai bentuk response
  function normalize(a){
    if(!a) return null;
    const title = a.title || a.judul || a.name || a.anime_title || "";
    const slug  = a.slug  || a.anime_slug || a.id || (a.endpoint||"").split("/").filter(Boolean).pop() || "";
    const poster= a.poster || a.thumb || a.thumbnail || a.image || a.cover || a.img || "";
    const episode = a.episode || a.current_episode || a.ep || a.latest_episode || "";
    const type  = a.type || a.tipe || "";
    const updated = a.updated_on || a.released_on || a.release_date || a.day || a.time || "";
    const score = a.score || a.rating || "";
    return { title, slug, poster, episode, type, updated, score };
  }

  function cardHTML(a){
    const it = normalize(a);
    if(!it || !it.slug) return "";
    const isEpisode = /episode/.test(window.location.hash) || /ep|episode/.test((a.endpoint||""));
    // Default link ke detail anime
    const href = `#/anime/${encodeURIComponent(it.slug)}`;
    return `
      <a class="card" href="${href}" data-title="${escapeHTML(it.title)}">
        <div class="card-poster">
          ${it.episode ? `<span class="card-ep">EP ${escapeHTML(it.episode)}</span>` : ""}
          ${it.type ? `<span class="card-type">${escapeHTML(it.type)}</span>` : ""}
          <img data-src="${escapeHTML(it.poster||window.LenzImg.PLACEHOLDER)}" alt="${escapeHTML(it.title)}">
        </div>
        <div class="card-body">
          <div class="card-title">${escapeHTML(it.title)}</div>
          <div class="card-meta">
            <span>${escapeHTML(it.updated||"")}</span>
            ${it.score ? `<span>⭐ ${escapeHTML(it.score)}</span>` : ""}
          </div>
        </div>
      </a>`;
  }

  function gridHTML(items, cls="grid"){
    if(!items || !items.length) return emptyHTML();
    return `<div class="${cls}">${items.map(cardHTML).join("")}</div>`;
  }

  function skeletonGrid(n=10){
    const card = `<div class="skel-card"><div class="p"></div><div class="l"></div><div class="l s"></div></div>`;
    return `<div class="grid">${card.repeat(n)}</div>`;
  }

  function skeletonDetail(){
    return `
      <div class="detail-banner"><div class="skel" style="width:100%;height:100%"></div></div>
      <div class="detail-head">
        <div class="detail-poster skel" style="height:270px"></div>
        <div class="detail-info">
          <div class="skel" style="height:24px;width:60%;margin:80px 0 10px"></div>
          <div class="skel" style="height:14px;width:40%;margin-bottom:20px"></div>
          <div class="skel" style="height:100px"></div>
        </div>
      </div>`;
  }

  function emptyHTML(text="Anime yang kamu cari belum ditemukan."){
    return `<div class="state"><div class="emoji">🔎</div><h3>Belum Ada Data</h3><p>${escapeHTML(text)}</p></div>`;
  }

  function sectionHTML(title, body, link){
    return `
      <section class="section">
        <div class="section-head">
          <h2>${escapeHTML(title)}</h2>
          ${link ? `<a href="${link}">Lihat semua →</a>` : ""}
        </div>
        ${body}
      </section>`;
  }

  function setActiveNav(){
    const hash = location.hash || "#/";
    document.querySelectorAll(".nav-desktop a, .bottom-nav a").forEach(a=>{
      a.classList.toggle("active", a.getAttribute("href") === hash || (a.dataset.route === "/" && hash === "#/"));
    });
  }

  // Upgrade semua poster pada container memakai Jikan (best effort)
  function upgradePosters(root){
    const cards = (root||document).querySelectorAll(".card[data-title]");
    cards.forEach(card=>{
      const img = card.querySelector("img");
      const title = card.dataset.title;
      // Tunggu sampai img masuk viewport agar tidak spam Jikan
      const obs = new IntersectionObserver(es=>{
        es.forEach(e=>{
          if(e.isIntersecting){
            window.LenzImg.upgradePoster(img, title, img.dataset.src || img.src);
            obs.disconnect();
          }
        });
      },{rootMargin:"100px"});
      obs.observe(img);
    });
  }

  window.LenzUI = {
    escapeHTML, normalize, cardHTML, gridHTML, sectionHTML,
    skeletonGrid, skeletonDetail, emptyHTML, setActiveNav, upgradePosters
  };
})();
