/* ========= Page: Search ========= */
async function PageSearch({query}){
  document.title = `Cari "${query.q||''}" | LENZ ANIME NONTON`;
  const app = document.getElementById("app");
  app.innerHTML = `
    <section class="section">
      <div class="section-head"><h2>🔍 Pencarian: "${LenzUI.escapeHTML(query.q||'')}"</h2></div>
      <div id="search-grid">${query.q?LenzUI.skeletonGrid(8):''}</div>
    </section>`;
  if(!query.q){
    document.getElementById("search-grid").innerHTML = `<div class="state"><div class="emoji">🔎</div><h3>Mulai mencari anime</h3><p>Ketik judul anime di kolom pencarian.</p></div>`;
    return;
  }
  try{
    const data = await LenzAPI.search(query.q);
    const items = LenzAPI.extractList(data,"animeList","results","data","anime");
    const grid = document.getElementById("search-grid");
    if(!items.length){ grid.innerHTML = LenzUI.emptyHTML(); return; }
    grid.innerHTML = LenzUI.gridHTML(items);
    LenzImg.scan(grid); LenzUI.upgradePosters(grid);
  }catch(err){ LenzError.show(err); }
}
