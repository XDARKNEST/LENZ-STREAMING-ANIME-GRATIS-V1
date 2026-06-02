/* ========= Page: Ongoing ========= */
async function PageOngoing({query}){
  document.title = "Anime Ongoing | LENZ ANIME NONTON";
  const app = document.getElementById("app");
  app.innerHTML = `
    <section class="section">
      <div class="section-head"><h2>🔥 Ongoing Anime</h2>
        <button class="btn btn-ghost" id="refresh">🔄 Refresh</button>
      </div>
      <div id="ongoing-grid">${LenzUI.skeletonGrid(12)}</div>
      <div class="load-more"><button class="btn btn-primary" id="load-more">Muat Lebih Banyak</button></div>
    </section>`;

  let page = parseInt(query.page||1,10);
  const container = document.getElementById("ongoing-grid");
  let html = "";

  async function load(reset=false){
    try{
      if(reset){ LenzCache.remove(`ongoing_${page}`); }
      const data = await LenzAPI.ongoing(page);
      const items = LenzAPI.extractList(data, "animeList","ongoing","data");
      if(!items.length && page === 1){ container.innerHTML = LenzUI.emptyHTML(); return; }
      html += items.map(LenzUI.cardHTML).join("");
      container.innerHTML = `<div class="grid">${html}</div>`;
      LenzImg.scan(container);
      LenzUI.upgradePosters(container);
    }catch(err){ LenzError.show(err); }
  }
  await load();

  document.getElementById("refresh").onclick = ()=>{ html=""; page=1; container.innerHTML=LenzUI.skeletonGrid(8); load(true); };
  document.getElementById("load-more").onclick = ()=>{ page++; load(); };

  // Infinite scroll
  const sentinel = document.createElement("div");
  sentinel.style.height = "1px";
  app.appendChild(sentinel);
  const io = new IntersectionObserver(es=>{
    if(es[0].isIntersecting){ page++; load(); }
  },{rootMargin:"500px"});
  io.observe(sentinel);
}
