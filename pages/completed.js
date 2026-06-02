/* ========= Page: Completed ========= */
async function PageCompleted({query}){
  document.title = "Anime Completed | LENZ ANIME NONTON";
  const app = document.getElementById("app");
  app.innerHTML = `
    <section class="section">
      <div class="section-head"><h2>✅ Completed Anime</h2></div>
      <div id="completed-grid">${LenzUI.skeletonGrid(12)}</div>
      <div class="load-more"><button class="btn btn-primary" id="load-more">Muat Lebih Banyak</button></div>
    </section>`;
  let page = parseInt(query.page||1,10);
  let html = "";
  const container = document.getElementById("completed-grid");
  async function load(){
    try{
      const data = await LenzAPI.completed(page);
      const items = LenzAPI.extractList(data,"animeList","completed","data");
      if(!items.length && page===1){ container.innerHTML = LenzUI.emptyHTML(); return; }
      html += items.map(LenzUI.cardHTML).join("");
      container.innerHTML = `<div class="grid">${html}</div>`;
      LenzImg.scan(container); LenzUI.upgradePosters(container);
    }catch(err){ LenzError.show(err); }
  }
  await load();
  document.getElementById("load-more").onclick = ()=>{ page++; load(); };
}
