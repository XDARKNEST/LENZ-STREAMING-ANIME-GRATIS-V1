/* ========= LENZ Router — Hash Router =========
 * Mendukung pola: /, /ongoing, /completed, /anime/:slug, /episode/:slug,
 * /batch/:slug, /genre/:slug, /genres, /schedule, /search, /list
 */
(function(){
  const routes = [];

  function on(pattern, handler){
    const keys = [];
    const re = new RegExp("^"+pattern.replace(/:([\w]+)/g,(_,k)=>{keys.push(k);return "([^/?#]+)";})+"$");
    routes.push({re, keys, handler});
  }

  function parse(hash){
    const raw = (hash || "#/").replace(/^#/, "") || "/";
    const [path, qs] = raw.split("?");
    const query = {};
    if(qs){ qs.split("&").forEach(p=>{ const [k,v]=p.split("="); query[decodeURIComponent(k)] = decodeURIComponent(v||""); }); }
    return { path, query };
  }

  async function dispatch(){
    const { path, query } = parse(location.hash);
    for(const r of routes){
      const m = path.match(r.re);
      if(m){
        const params = {};
        r.keys.forEach((k,i)=>params[k]=decodeURIComponent(m[i+1]));
        window.scrollTo({top:0});
        try{
          await r.handler({ params, query });
        }catch(err){
          window.LenzError.show(err);
        }
        window.LenzUI.setActiveNav();
        return;
      }
    }
    // Not found -> 404 state
    document.getElementById("app").innerHTML =
      `<div class="state"><div class="emoji">🚧</div><h3>Halaman tidak ditemukan</h3><p>URL tidak dikenali.</p><a class="btn btn-primary" href="#/">Kembali ke Beranda</a></div>`;
  }

  function start(){
    window.addEventListener("hashchange", dispatch);
    window.addEventListener("load", dispatch);
    if(document.readyState !== "loading") dispatch();
  }

  window.LenzRouter = { on, start, parse };
})();
