
/* ===== SAFE V5.5 ENHANCEMENTS ===== */
(function(){

/* scroll progress */
const p=document.createElement("div");
p.className="scroll-progress-v55";
document.body.appendChild(p);

document.addEventListener("scroll",()=>{
 const h=document.documentElement;
 const max=h.scrollHeight-innerHeight;
 p.style.width=((scrollY/max)*100||0)+"%";
});

/* lazy image */
const io=new IntersectionObserver(entries=>{
 entries.forEach(e=>{
   if(e.isIntersecting){
     const img=e.target;
     if(img.dataset.src){
       img.src=img.dataset.src;
       img.removeAttribute("data-src");
     }
     io.unobserve(img);
   }
 });
});

document.querySelectorAll("img[data-src]").forEach(x=>io.observe(x));

/* premium toast helper */
window.lenzToast=function(msg){
 const t=document.createElement("div");
 t.className="premium-toast-v55";
 t.textContent=msg;
 document.body.appendChild(t);
 setTimeout(()=>t.remove(),2400);
};

/* keyboard shortcuts */
document.addEventListener("keydown",(e)=>{
 const v=document.querySelector("video");
 if(!v) return;
 if(e.code==="Space"){e.preventDefault(); v.paused?v.play():v.pause();}
 if(e.key==="ArrowRight") v.currentTime+=10;
 if(e.key==="ArrowLeft") v.currentTime-=10;
});

/* service worker register */
if("serviceWorker" in navigator){
 navigator.serviceWorker.register("./sw.js").catch(()=>{});
}

})();
