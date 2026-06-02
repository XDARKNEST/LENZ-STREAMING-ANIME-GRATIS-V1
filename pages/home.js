/* ========= Page: Home ========= */
async function PageHome(){
  const app = document.getElementById("app");
  document.title = "LENZ ANIME NONTON - Streaming Anime Subtitle Indonesia";

  app.innerHTML = `
    <section class="hero" id="hero">
      <div class="hero-slides" id="hero-slides"></div>
      <button class="hero-arrow prev" aria-label="Prev">‹</button>
      <button class="hero-arrow next" aria-label="Next">›</button>
      <div class="hero-dots" id="hero-dots"></div>
    </section>
    ${LenzUI.sectionHTML("Latest Update", `<div id="home-latest">${LenzUI.skeletonGrid(8)}</div>`)}
    ${LenzUI.sectionHTML("Ongoing Anime", `<div id="home-ongoing">${LenzUI.skeletonGrid(8)}</div>`, "#/ongoing")}
    ${LenzUI.sectionHTML("Completed Anime", `<div id="home-completed">${LenzUI.skeletonGrid(8)}</div>`, "#/completed")}
  `;

  try{
    const home = await LenzAPI.home();
    const root = home.data || home;

    // Pilih array untuk latest/ongoing/completed dari kemungkinan key
    const latest    = LenzAPI.extractList({data:root}, "latest", "latest_update", "ongoing", "animeList");
    const ongoing   = LenzAPI.extractList({data:root}, "ongoing", "animeList");
    const completed = LenzAPI.extractList({data:root}, "completed", "complete");

    // ===== Hero (pakai 5 ongoing pertama) =====
    const heroItems = (ongoing.length ? ongoing : latest).slice(0,5).map(LenzUI.normalize).filter(Boolean);
    renderHero(heroItems);

    document.getElementById("home-latest").innerHTML    = LenzUI.gridHTML(latest.slice(0,12));
    document.getElementById("home-ongoing").innerHTML   = LenzUI.gridHTML(ongoing.slice(0,12));
    document.getElementById("home-completed").innerHTML = LenzUI.gridHTML(completed.slice(0,12));

    LenzImg.scan(app);
    LenzUI.upgradePosters(app);
  }catch(err){
    LenzError.show(err);
  }
}

function renderHero(items){
  const slides = document.getElementById("hero-slides");
  const dots = document.getElementById("hero-dots");
  if(!items.length){
    slides.innerHTML = `<div class="hero-slide"><div style="height:100%;display:grid;place-items:center;background:linear-gradient(135deg,#6c5ce7,#00d4ff)"><div style="text-align:center;padding:20px"><h3 style="font-size:24px">Selamat Datang di LENZ ANIME NONTON</h3><p>Temukan anime favoritmu, tonton episode terbaru, dan ikuti jadwal rilis anime setiap hari.</p></div></div></div>`;
    return;
  }
  slides.innerHTML = items.map(it => `
    <a class="hero-slide" href="#/anime/${encodeURIComponent(it.slug)}">
      <img src="${it.poster||LenzImg.PLACEHOLDER}" alt="${LenzUI.escapeHTML(it.title)}" onerror="this.src='${LenzImg.PLACEHOLDER}'">
      <div class="info">
        <span class="badge">${it.type||"ANIME"}${it.episode?' • EP '+it.episode:''}</span>
        <h3>${LenzUI.escapeHTML(it.title)}</h3>
        <p>${LenzUI.escapeHTML(it.updated||"Update terbaru di LENZ ANIME NONTON")}</p>
      </div>
    </a>
  `).join("");
  dots.innerHTML = items.map((_,i)=>`<span class="${i===0?'active':''}" data-i="${i}"></span>`).join("");

  // Upgrade poster hero via Jikan
  items.forEach((it,i)=>{
    const img = slides.children[i].querySelector("img");
    LenzImg.upgradePoster(img, it.title, it.poster);
  });

  let idx = 0;
  const total = items.length;
  function go(n){
    idx = (n+total)%total;
    slides.style.transform = `translateX(-${idx*100}%)`;
    dots.querySelectorAll("span").forEach((d,i)=>d.classList.toggle("active",i===idx));
  }
  document.querySelector(".hero-arrow.prev").onclick = e=>{e.preventDefault();go(idx-1);};
  document.querySelector(".hero-arrow.next").onclick = e=>{e.preventDefault();go(idx+1);};
  dots.querySelectorAll("span").forEach(d=>d.onclick=()=>go(+d.dataset.i));

  let timer = setInterval(()=>go(idx+1),5000);
  slides.parentElement.addEventListener("mouseenter",()=>clearInterval(timer));
  slides.parentElement.addEventListener("mouseleave",()=>{timer=setInterval(()=>go(idx+1),5000);});

  // Swipe mobile
  let sx=0;
  slides.addEventListener("touchstart",e=>sx=e.touches[0].clientX,{passive:true});
  slides.addEventListener("touchend",e=>{
    const dx = e.changedTouches[0].clientX - sx;
    if(Math.abs(dx) > 50) go(idx + (dx<0?1:-1));
  });
}
