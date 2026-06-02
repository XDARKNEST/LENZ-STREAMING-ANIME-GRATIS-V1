/* ========= LENZ Image Loader =========
 * Sistem fallback poster: Jikan -> API utama -> Placeholder lokal.
 * + Lazy loading dengan IntersectionObserver.
 */
(function(){
  const PLACEHOLDER = window.CONFIG.PLACEHOLDER_IMAGE;

  async function getAnimePoster(title, fallbackPoster){
    if(!title) return fallbackPoster || PLACEHOLDER;
    try{
      const data = await window.LenzAPI.jikan(title);
      const url = data?.data?.[0]?.images?.webp?.large_image_url
               || data?.data?.[0]?.images?.jpg?.large_image_url;
      if(url) return url;
    }catch(_){}
    return fallbackPoster || PLACEHOLDER;
  }

  // Lazy image: <img data-src="..." data-fallback="...">
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver(onIntersect,{rootMargin:"200px"})
    : null;

  function onIntersect(entries){
    entries.forEach(e=>{
      if(e.isIntersecting){
        loadImage(e.target);
        io.unobserve(e.target);
      }
    });
  }

  function loadImage(img){
    const src = img.dataset.src;
    if(!src) return;
    img.src = src;
    img.removeAttribute("data-src");
  }

  function bindImage(img){
    img.onerror = () => { img.onerror=null; img.src = PLACEHOLDER; };
    img.loading = "lazy";
    img.decoding = "async";
    if(io && img.dataset.src) io.observe(img);
    else if(img.dataset.src) loadImage(img);
  }

  function scan(root){
    (root||document).querySelectorAll("img[data-src]").forEach(bindImage);
  }

  // Upgrade poster di background: jika punya judul, coba Jikan
  async function upgradePoster(img, title, fallback){
    if(!title) return;
    try{
      const url = await getAnimePoster(title, fallback);
      if(url && url !== img.src){
        const tmp = new Image();
        tmp.onload = () => { img.src = url; };
        tmp.src = url;
      }
    }catch(_){}
  }

  window.LenzImg = { getAnimePoster, bindImage, scan, upgradePoster, PLACEHOLDER };
})();
