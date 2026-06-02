/* ========= Page: Batch Download ========= */
async function PageBatch({params}){
  const app = document.getElementById("app");
  document.title = "Batch Download | LENZ ANIME NONTON";
  app.innerHTML = `<div class="state"><div class="emoji">⬇</div><h3>Memuat data batch…</h3></div>`;
  try{
    const data = await LenzAPI.batch(params.slug);
    const b = data.data || data;
    const title = b.title || b.batch_title || params.slug;
    document.title = `${title} | BATCH DOWNLOAD - LENZ ANIME`;

    // ========================================================
    // ENGINE DEEP CRAWLER BATCH (Menggantikan extractList)
    // ========================================================
    function extractBatchLinks(obj) {
      let groups = {}; // Format: { "360p": [ {server, url}, ... ] }
      
      function scan(curr, currentQuality = "Unknown") {
        if (!curr) return;

        // 1. Jika mendeteksi objek link download langsung
        if (typeof curr === "object" && !Array.isArray(curr)) {
          let link = curr.link || curr.url || curr.download || curr.src || curr.href;
          let server = curr.server || curr.host || curr.name || curr.label || curr.provider || "Download";
          let qual = curr.quality || curr.resolution || currentQuality;
          
          if (link && typeof link === "string" && (link.startsWith("http") || link.startsWith("//"))) {
            // Standarisasi penamaan resolusi video
            if (qual.toLowerCase().includes("360")) qual = "360p";
            else if (qual.toLowerCase().includes("480")) qual = "480p";
            else if (qual.toLowerCase().includes("720")) qual = "720p";
            else if (qual.toLowerCase().includes("1080")) qual = "1080p";

            if (!groups[qual]) groups[qual] = [];
            if (!groups[qual].some(item => item.url === link)) {
              groups[qual].push({ server: server, url: link });
            }
            return;
          }
        }

        // 2. Jika mendeteksi objek biasa, telusuri key di dalamnya secara rekursif
        if (typeof curr === "object" && !Array.isArray(curr)) {
          for (let k in curr) {
            let nextQuality = currentQuality;
            if (k.toLowerCase().includes("360")) nextQuality = "360p";
            else if (k.toLowerCase().includes("480")) nextQuality = "480p";
            else if (k.toLowerCase().includes("720")) nextQuality = "720p";
            else if (k.toLowerCase().includes("1080")) nextQuality = "1080p";
            
            scan(curr[k], nextQuality);
          }
          return;
        }

        // 3. Jika mendeteksi struktur Array
        if (Array.isArray(curr)) {
          curr.forEach(item => scan(item, currentQuality));
        }
      }

      scan(obj);
      return groups;
    }

    // Jalankan pemindaian data batch
    const batchGroups = extractBatchLinks(b);
    const qualities = Object.keys(batchGroups);

    // Validasi jika tidak ditemukan link sama sekali
    if(!qualities.length){ 
      app.innerHTML = LenzUI.emptyHTML("Belum ada link batch untuk anime ini."); 
      return; 
    }

    // Render HTML menggunakan class css asli bawaanmu (.batch-grid & .batch-card)
    app.innerHTML = `
      <section class="section">
        <div class="section-head"><h2>⬇ Batch ${LenzUI.escapeHTML(title)}</h2></div>
        <div class="batch-grid">
          ${qualities.map(q => {
            const links = batchGroups[q];
            return `<div class="batch-card">
              <h4>${LenzUI.escapeHTML(q)}</h4>
              <div class="links">
                ${links.map(l => `
                  <a href="${LenzUI.escapeHTML(l.url)}" target="_blank" rel="noopener">
                    ${LenzUI.escapeHTML(l.server)} →
                  </a>
                `).join("")}
              </div>
            </div>`;
          }).join("")}
        </div>
      </section>`;
  }catch(err){ LenzError.show(err); }
}
