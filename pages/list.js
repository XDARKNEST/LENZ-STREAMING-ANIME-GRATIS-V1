/* ========= Page: Anime List (A-Z) ========= */
async function PageList(){
  document.title = "Anime List | LENZ ANIME NONTON";
  const app = document.getElementById("app");
  app.innerHTML = `
    <section class="section">
      <div class="section-head"><h2>📚 Daftar Anime</h2></div>
      <div style="padding:0 16px 10px">
        <input id="list-search" placeholder="Cari di daftar…" style="width:100%;padding:12px 14px;border-radius:10px;background:var(--card);border:1px solid var(--border);outline:none">
      </div>
      <div class="az-bar" id="az-bar"></div>
      <div id="list-root"><div class="state"><div class="skel" style="height:80px"></div></div></div>
    </section>`;
  try{
    const data = await LenzAPI.list();
    // Bentuk yang umum: [{startWith:"A", animeList:[...]}] atau flat
    let groups = LenzAPI.extractList(data,"list","data");
    if(groups.length && !groups[0].startWith && !groups[0].animeList){
      // Flat -> group manual
      const flat = groups;
      const map = {};
      flat.forEach(a=>{
        const t = (a.title||a.judul||"#").trim();
        const letter = /[A-Z]/i.test(t[0]) ? t[0].toUpperCase() : "#";
        (map[letter]=map[letter]||[]).push(a);
      });
      groups = Object.keys(map).sort().map(k=>({startWith:k,animeList:map[k]}));
    }
    if(!groups.length){ document.getElementById("list-root").innerHTML = LenzUI.emptyHTML(); return; }

    const azBar = document.getElementById("az-bar");
    azBar.innerHTML = groups.map(g=>`<a class="chip" href="#az-${g.startWith}">${g.startWith}</a>`).join("");
    const root = document.getElementById("list-root");
    root.innerHTML = groups.map(g=>`
      <div class="list-group" id="az-${g.startWith}">
        <h3>${g.startWith}</h3>
        ${(g.animeList||[]).map(a=>{
          const n = LenzUI.normalize(a);
          return `<a href="#/anime/${encodeURIComponent(n.slug)}">${LenzUI.escapeHTML(n.title)}</a>`;
        }).join("")}
      </div>`).join("");

    const input = document.getElementById("list-search");
    input.addEventListener("input",()=>{
      const q = input.value.toLowerCase();
      root.querySelectorAll(".list-group a").forEach(a=>{
        a.style.display = a.textContent.toLowerCase().includes(q) ? "" : "none";
      });
    });
  }catch(err){ LenzError.show(err); }
}
