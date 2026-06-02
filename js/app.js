/* ========= LENZ App Bootstrap ========= */
(function(){
  // Mount semua route
  LenzRouter.on("/",            PageHome);
  LenzRouter.on("/ongoing",     PageOngoing);
  LenzRouter.on("/completed",   PageCompleted);
  LenzRouter.on("/anime/:slug", PageAnime);
  LenzRouter.on("/episode/:slug",PageEpisode);
  LenzRouter.on("/batch/:slug", PageBatch);
  LenzRouter.on("/genres",      PageGenres);
  LenzRouter.on("/genre/:slug", PageGenre);
  LenzRouter.on("/schedule",    PageSchedule);
  LenzRouter.on("/search",      PageSearch);
  LenzRouter.on("/list",        PageList);
  LenzRouter.on("/favorites", PageFavorites);

  LenzRouter.start();

  // Loading screen hide
  window.addEventListener("load",()=>{
    setTimeout(()=>{
      const ls = document.getElementById("loading-screen");
      if(ls){ ls.classList.add("hide"); setTimeout(()=>ls.remove(),500); }
    },300);
  });

  // Mobile drawer
  const drawer = document.getElementById("drawer");
  const backdrop = document.getElementById("drawer-backdrop");
  document.getElementById("menu-toggle").onclick = () => {
    drawer.classList.add("open"); backdrop.classList.add("show");
  };
  backdrop.onclick = () => { drawer.classList.remove("open"); backdrop.classList.remove("show"); };
  drawer.addEventListener("click", e => {
    if(e.target.tagName === "A"){ drawer.classList.remove("open"); backdrop.classList.remove("show"); }
  });

  // Search form (debounced suggestion)
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const suggest = document.getElementById("search-suggest");

  let tm = null;
  input.addEventListener("input", e => {
    const q = e.target.value.trim();
    clearTimeout(tm);
    if(!q){ suggest.hidden = true; suggest.innerHTML=""; return; }
    tm = setTimeout(async ()=>{
      try{
        const data = await LenzAPI.search(q);
        const items = LenzAPI.extractList(data,"animeList","results","data","anime").slice(0,6);
        if(!items.length){ suggest.innerHTML = `<div style="padding:14px;color:var(--muted);font-size:13px">Tidak ada hasil</div>`; suggest.hidden=false; return; }
        suggest.innerHTML = items.map(a=>{
          const n = LenzUI.normalize(a);
          return `<a href="#/anime/${encodeURIComponent(n.slug)}">
            <img src="${n.poster||LenzImg.PLACEHOLDER}" alt="" onerror="this.src='${LenzImg.PLACEHOLDER}'">
            <div><div class="t">${LenzUI.escapeHTML(n.title)}</div><div class="s">${LenzUI.escapeHTML(n.type||"")} ${n.episode?'• EP '+LenzUI.escapeHTML(n.episode):''}</div></div>
          </a>`;
        }).join("");
        suggest.hidden = false;
      }catch(_){ suggest.hidden = true; }
    }, CONFIG.DEBOUNCE_SEARCH);
  });
  form.addEventListener("submit", e => {
    e.preventDefault();
    const q = input.value.trim();
    if(q){ location.hash = `#/search?q=${encodeURIComponent(q)}`; suggest.hidden=true; }
  });
  document.addEventListener("click", e => {
    if(!form.contains(e.target)) suggest.hidden = true;
  });

  // Header shrink on scroll
  const header = document.getElementById("header");
  let lastY = 0;
  window.addEventListener("scroll",()=>{
    const y = window.scrollY;
    header.style.boxShadow = y > 10 ? "0 4px 20px rgba(0,0,0,.3)" : "none";
    lastY = y;
  },{passive:true});

  // Service worker (PWA ready — opsional, registrasi disengaja-tidak agar tanpa SW pun jalan)
})();
