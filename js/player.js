/* ========= LENZ Player =========
 * Mendukung MP4, M3U8 (native Safari, HLS lain perlu hls.js — fallback ke iframe), dan iframe.
 * Termasuk error handling + tombol refresh.
 */
(function(){
  function detectType(url=""){
    if(/\.m3u8(\?|$)/i.test(url)) return "hls";
    if(/\.mp4(\?|$)/i.test(url))  return "mp4";
    return "iframe";
  }

  function render(container, url, opts={}){
    if(!container) return;
    if(!url){
      renderError(container, "Sumber video tidak tersedia.");
      return;
    }
    const type = detectType(url);
    let html = "";
    if(type === "mp4"){
      html = `<video controls playsinline preload="metadata" src="${url}"></video>`;
    } else if(type === "hls"){
      // Safari mendukung HLS native; selain itu fallback iframe (server biasanya menyediakan player)
      const canNative = document.createElement("video").canPlayType("application/vnd.apple.mpegurl");
      html = canNative
        ? `<video controls playsinline preload="metadata" src="${url}"></video>`
        : `<iframe src="${url}" allowfullscreen allow="autoplay; picture-in-picture"></iframe>`;
    } else {
      html = `<iframe src="${url}" allowfullscreen allow="autoplay; picture-in-picture"></iframe>`;
    }
    container.innerHTML = html;

    const media = container.querySelector("video");
    if(media){
      media.addEventListener("error", ()=>renderError(container,"Video tidak dapat diputar.", url, opts));
    }
    const iframe = container.querySelector("iframe");
    if(iframe){
      iframe.addEventListener("error",()=>renderError(container,"Video tidak dapat diputar.", url, opts));
    }
  }

  function renderError(container, msg="Video tidak dapat diputar.", url, opts={}){
    container.innerHTML = `
      <div class="player-error">
        <div style="font-size:48px">⚠️</div>
        <h3>${msg}</h3>
        <p style="color:var(--muted);font-size:13px">Coba refresh player atau pilih server lain.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
          <button class="btn btn-primary" id="ply-refresh">🔄 Refresh Player</button>
          <button class="btn btn-ghost" id="ply-server">📺 Pilih Server Lain</button>
        </div>
      </div>`;
    container.querySelector("#ply-refresh").onclick = () => render(container, url, opts);
    container.querySelector("#ply-server").onclick = () => {
      const list = document.querySelector(".server-list");
      if(list) list.scrollIntoView({behavior:"smooth", block:"center"});
    };
  }

  function toggleTheater(wrap){
    wrap.classList.toggle("theater");
  }
  async function pip(wrap){
    const v = wrap.querySelector("video");
    if(!v) return window.LenzError.toast("PiP hanya untuk video MP4");
    try{
      if(document.pictureInPictureElement) await document.exitPictureInPicture();
      else await v.requestPictureInPicture();
    }catch(_){ window.LenzError.toast("PiP tidak didukung"); }
  }
  function fullscreen(wrap){
    if(document.fullscreenElement) document.exitFullscreen();
    else wrap.requestFullscreen?.();
  }

  window.LenzPlayer = { render, renderError, toggleTheater, pip, fullscreen };
})();
