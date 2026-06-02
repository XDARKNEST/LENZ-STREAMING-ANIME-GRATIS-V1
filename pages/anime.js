/* ========= Page: Anime Detail ========= */
async function PageAnime({params}){
  const app = document.getElementById("app");
  app.innerHTML = LenzUI.skeletonDetail();
  try{
    const data = await LenzAPI.anime(params.slug);
    const a = data.data || data;
    const title = a.title || a.judul || params.slug;
    document.title = `${title} | LENZ ANIME NONTON`;

    // Episode list normalize
    const episodes = LenzAPI.extractList({data:a}, "episode_list","episodeList","episodes");
    const apiRelated  = LenzAPI.extractList({data:a}, "recommendations","related","recommendation");
    const allAnime = await LenzAPI.list().catch(()=>({data:[]}));
    const pool = LenzAPI.extractList(allAnime,"data","animeList","list","animes");
    const safeTitle = (title||"").toLowerCase();
    const genresTxt = genres.map(g=>(g.name||g).toLowerCase());
    const related = [...apiRelated];
    if(!related.length){
      pool.forEach(x=>{
        const t=(x.title||x.judul||"").toLowerCase();
        if(x.slug===params.slug || !t) return;
        const series=safeTitle.split(":")[0];
        if(t.includes(series)||series.includes(t)) related.push(x);
      });
    }
    const recMap = new Map();
    pool.forEach(x=>{
      const slug=x.slug||x.id; if(!slug||slug===params.slug||recMap.has(slug)) return;
      let score=0;
      const g=(x.genre_list||x.genres||x.genre||[]).map(v=>String(v.name||v).toLowerCase());
      score += g.filter(v=>genresTxt.includes(v)).length*4;
      if((x.studio||'')=== (a.studio||'')) score +=3;
      if((x.season||'')=== (a.season||'')) score +=2;
      const t=(x.title||x.judul||"").toLowerCase();
      if(safeTitle.split(" ")[0] && t.includes(safeTitle.split(" ")[0])) score +=1;
      if(score>0) recMap.set(slug,{...x,_score:score});
    });
    const recommendations=[...recMap.values()].sort((a,b)=>(b._score||0)-(a._score||0)).slice(0,10);

    const poster = a.poster || a.thumbnail || a.thumb || a.image || LenzImg.PLACEHOLDER;
    const banner = a.cover || a.banner || poster;
    const genres = (a.genre_list || a.genres || a.genre || []).map(g=> typeof g==='string'?{name:g,slug:g.toLowerCase()}:g);
    const synopsis = a.synopsis || a.sinopsis || a.description || "-";

    app.innerHTML = `
      <div class="detail-banner"><img src="${banner}" alt="" onerror="this.src='${LenzImg.PLACEHOLDER}'"></div>
      <div class="detail-head">
        <div class="detail-poster"><img src="${poster}" alt="${LenzUI.escapeHTML(title)}" onerror="this.src='${LenzImg.PLACEHOLDER}'"></div>
        <div class="detail-info">
          <h1>${LenzUI.escapeHTML(title)}</h1>
          <div class="jp">${LenzUI.escapeHTML(a.japanese_title||a.judul_jepang||"")}</div>
          <div class="detail-genres">${genres.map(g=>`<a class="chip" href="#/genre/${encodeURIComponent(g.slug||g.name)}">${LenzUI.escapeHTML(g.name||g)}</a>`).join("")}</div>
          <div class="detail-meta">
            <div><strong>Skor</strong>${LenzUI.escapeHTML(a.score||a.rating||"-")}</div>
            <div><strong>Status</strong>${LenzUI.escapeHTML(a.status||"-")}</div>
            <div><strong>Tipe</strong>${LenzUI.escapeHTML(a.type||"-")}</div>
            <div><strong>Studio</strong>${LenzUI.escapeHTML(a.studio||"-")}</div>
            <div><strong>Producer</strong>${LenzUI.escapeHTML(a.producer||a.producers||"-")}</div>
            <div><strong>Season</strong>${LenzUI.escapeHTML(a.season||"-")}</div>
            <div><strong>Rilis</strong>${LenzUI.escapeHTML(a.release_date||a.released_on||"-")}</div>
            <div><strong>Durasi</strong>${LenzUI.escapeHTML(a.duration||"-")}</div>
            <div><strong>Episode</strong>${LenzUI.escapeHTML(a.total_episode||episodes.length||"-")}</div>
          </div>
          <div class="detail-actions">
            <button class="btn btn-ghost" id="favorite-btn">❤️ Tambah ke Favorit</button>
            ${episodes[0] ? `<a class="btn btn-primary" href="#/episode/${encodeURIComponent(episodes[0].slug||episodes[0].endpoint||'')}">▶ Tonton Sekarang</a>` : ""}
            <a class="btn btn-ghost" href="#/batch/${encodeURIComponent(params.slug)}">⬇ Batch Download</a>
          </div>
        </div>
      </div>

      <section class="detail-synopsis">
        <h2>Sinopsis</h2>
        <p>${LenzUI.escapeHTML(synopsis)}</p>
      </section>

      <section class="section">
        <div class="section-head"><h2>Daftar Episode</h2></div>
        <div class="episode-list">
          ${episodes.length ? episodes.map(ep=>{
            const s = ep.slug||ep.endpoint||"";
            const n = ep.episode||ep.title||ep.number||s;
            return `<a href="#/episode/${encodeURIComponent(s)}">Episode ${LenzUI.escapeHTML(String(n))}</a>`;
          }).join("") : `<div style="color:var(--muted);padding:14px">Belum ada episode.</div>`}
        </div>
      </section>

      ${recommendations.length ? LenzUI.sectionHTML("Rekomendasi Untuk Kamu", LenzUI.gridHTML(recommendations)) : ""}
      ${related.length ? LenzUI.sectionHTML("Anime Terkait", LenzUI.gridHTML(related.slice(0,12))) : ""}
    `;

    LenzImg.scan(app);
    LenzUI.upgradePosters(app);

    // Upgrade poster utama via Jikan
    const mainPoster = app.querySelector(".detail-poster img");
    LenzImg.upgradePoster(mainPoster, title, poster);
    const bannerImg = app.querySelector(".detail-banner img");
    LenzImg.upgradePoster(bannerImg, title, banner);
    const favBtn=document.getElementById("favorite-btn");
    if(favBtn && window.LenzFavorites){
      const update=()=> favBtn.textContent = window.LenzFavorites.has(params.slug) ? "💔 Hapus dari Favorit" : "❤️ Tambah ke Favorit";
      update();
      favBtn.onclick=()=>{window.LenzFavorites.toggle({...a,slug:params.slug,title,poster,type:a.type}); update();};
    }
  }catch(err){ LenzError.show(err); }
}
