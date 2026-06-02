/* ========= Page: Schedule ========= */
async function PageSchedule({query}){
  document.title = "Jadwal Anime | LENZ ANIME NONTON";
  const app = document.getElementById("app");
  const days = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];
  const today = days[(new Date().getDay()+6)%7];
  const active = query.day || today;

  app.innerHTML = `
    <section class="section">
      <div class="section-head"><h2>📅 Jadwal Anime</h2></div>
      <div class="day-tabs">
        ${days.map(d=>`<button class="chip ${d===active?'active':''}" data-day="${d}">${d}</button>`).join("")}
      </div>
      <div id="sched">${LenzUI.skeletonGrid(8)}</div>
    </section>`;

  async function load(day){
    const root = document.getElementById("sched");
    root.innerHTML = LenzUI.skeletonGrid(8);
    try{
      const data = await LenzAPI.schedule(day);
      const items = LenzAPI.extractList(data,"animeList","schedule","anime","data");
      if(!items.length){ root.innerHTML = LenzUI.emptyHTML(`Belum ada jadwal untuk ${day}.`); return; }
      root.innerHTML = LenzUI.gridHTML(items);
      LenzImg.scan(root); LenzUI.upgradePosters(root);
    }catch(err){ LenzError.show(err); }
  }
  await load(active);

  document.querySelectorAll(".day-tabs .chip").forEach(c=>{
    c.onclick = ()=>{
      document.querySelectorAll(".day-tabs .chip").forEach(x=>x.classList.remove("active"));
      c.classList.add("active");
      load(c.dataset.day);
    };
  });
}
