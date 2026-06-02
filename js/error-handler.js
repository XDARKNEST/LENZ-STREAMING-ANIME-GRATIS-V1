/* ========= LENZ Error Handler =========
 * Pesan error standar + helper UI.
 */
(function(){
  const messages = {
    NETWORK: "Periksa koneksi internet Anda.",
    FETCH:   "Gagal mengambil data.",
    EMPTY:   "Data tidak ditemukan.",
    VIDEO:   "Video tidak dapat diputar.",
    POSTER:  "Poster tidak tersedia.",
    GENERIC: "Oops! LENZ ANIME NONTON gagal mengambil data. Silakan coba beberapa saat lagi."
  };

  function classify(err){
    if(!navigator.onLine) return "NETWORK";
    if(err && err.name === "AbortError") return "NETWORK";
    if(err && err.status === 404) return "EMPTY";
    return "FETCH";
  }

  const ErrorHandler = {
    msg: messages,
    classify,
    show(err, mountId="app"){
      const code = classify(err);
      console.error("[LENZ Error]", code, err);
      const el = document.getElementById(mountId);
      if(!el) return;
      el.innerHTML = `
        <div class="state">
          <div class="emoji">😿</div>
          <h3>${messages[code] || messages.GENERIC}</h3>
          <p>${messages.GENERIC}</p>
          <button class="btn btn-primary" onclick="location.reload()">Muat Ulang</button>
        </div>`;
    },
    toast(text){
      const t = document.getElementById("toast");
      if(!t) return;
      t.textContent = text;
      t.hidden = false;
      clearTimeout(t._tm);
      t._tm = setTimeout(()=>{t.hidden=true},2500);
    }
  };
  window.LenzError = ErrorHandler;

  window.addEventListener("offline",()=>ErrorHandler.toast("Koneksi internet terputus"));
  window.addEventListener("online", ()=>ErrorHandler.toast("Koneksi internet kembali"));
})();
