
(function(){
 const KEY='lenz_favorites_v1';
 function read(){ try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return []} }
 function write(v){ try{localStorage.setItem(KEY,JSON.stringify(v||[]))}catch(e){} }
 function norm(a){
   return {slug:a.slug||a.id||'',title:a.title||a.judul||'Unknown',poster:a.poster||a.thumbnail||a.thumb||a.image||'',type:a.type||''}
 }
 window.LenzFavorites={
   all:()=>read(),
   has:(slug)=> !!slug && read().some(x=>x.slug===slug),
   toggle:(anime)=>{
      const slug=anime?.slug||anime?.id; if(!slug) return false;
      const arr=read(); const i=arr.findIndex(x=>x.slug===slug);
      if(i>-1){arr.splice(i,1); write(arr); return false;}
      arr.unshift(norm(anime)); write(arr); return true;
   }
 };
 async function PageFavorites(){
   const app=document.getElementById('app');
   const items=window.LenzFavorites.all();
   app.innerHTML=`<section class="section"><div class="section-head"><h2>Anime Favorit Saya</h2></div>${items.length?window.LenzUI.gridHTML(items):'<div style="padding:16px;color:var(--muted)">Belum ada favorit.</div>'}</section>`;
   document.title='Anime Favorit Saya | LENZ';
   window.LenzImg?.scan(app);
 }
 window.PageFavorites=PageFavorites;
})();
