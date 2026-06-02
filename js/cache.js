/* ========= LENZ Cache — Sistem Cache localStorage =========
 * Menyimpan response API dengan TTL.
 * Mengurangi request berulang, mempercepat loading.
 */
(function(){
  const PREFIX = "lenz_cache:";

  const Cache = {
    get(key){
      try{
        const raw = localStorage.getItem(PREFIX+key);
        if(!raw) return null;
        const {v,e} = JSON.parse(raw);
        if(e && Date.now() > e){ localStorage.removeItem(PREFIX+key); return null; }
        return v;
      }catch(_){ return null; }
    },
    set(key,value,ttl){
      try{
        const payload = {v:value, e: ttl ? Date.now()+ttl : 0};
        localStorage.setItem(PREFIX+key, JSON.stringify(payload));
      }catch(_){
        // Kuota penuh -> bersihkan
        Cache.clear();
      }
    },
    remove(key){ try{localStorage.removeItem(PREFIX+key)}catch(_){} },
    clear(){
      try{
        Object.keys(localStorage)
          .filter(k=>k.startsWith(PREFIX))
          .forEach(k=>localStorage.removeItem(k));
      }catch(_){}
    }
  };
  window.LenzCache = Cache;
})();
