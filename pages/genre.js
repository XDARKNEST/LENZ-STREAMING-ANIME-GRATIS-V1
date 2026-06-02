/* ========= Page: Genres + Detail Genre ========= */
async function PageGenres(){
  document.title = "Genre Anime | LENZ ANIME NONTON";
  const app = document.getElementById("app");
  app.innerHTML = `<section class="section"><div class="section-head"><h2>🎭 Semua Genre</h2></div>
    <div id="genres" style="padding:0 16px;display:flex;flex-wrap:wrap;gap:8px">${'<div class="skel" style="width:90px;height:32px"></div>'.repeat(20)}</div></section>`;
  try{
    const data = await LenzAPI.genres();
    const items = LenzAPI.extractList(data,"genres","genreList","data");
    const root = document.getElementById("genres");
    if(!items.length){ root.innerHTML = LenzUI.emptyHTML(); return; }
    root.innerHTML = items.map(g=>{
      const name = g.name||g.title||g;
      const slug = g.slug||g.endpoint||name.toLowerCase();
      return `<a class="chip" href="#/genre/${encodeURIComponent(slug)}">${LenzUI.escapeHTML(name)}</a>`;
    }).join("");
  }catch(err){ LenzError.show(err); }
}

async function PageGenre({params, query}){
  document.title = `Genre ${params.slug} | LENZ ANIME NONTON`;
  const app = document.getElementById("app");
  app.innerHTML = `<section class="section"><div class="section-head"><h2>🎭 Genre: ${LenzUI.escapeHTML(params.slug)}</h2></div>
    <div id="grid">${LenzUI.skeletonGrid(12)}</div>
    <div class="load-more"><button class="btn btn-primary" id="more">Muat Lebih Banyak</button></div></section>`;

  let page = parseInt(query.page||1,10);
  let html = "";
  const grid = document.getElementById("grid");
  async function load(){
    try{
      const data = await LenzAPI.genre(params.slug, page);
      const items = LenzAPI.extractList(data,"animeList","anime","data");
      if(!items.length && page===1){ grid.innerHTML = LenzUI.emptyHTML(); return; }
      html += items.map(LenzUI.cardHTML).join("");
      grid.innerHTML = `<div class="grid">${html}</div>`;
      LenzImg.scan(grid); LenzUI.upgradePosters(grid);
    }catch(err){ LenzError.show(err); }
  }
  await load();
  document.getElementById("more").onclick = ()=>{ page++; load(); };
}
