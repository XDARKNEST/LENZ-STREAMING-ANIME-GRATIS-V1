
/* ===== LENZ V5.1 ADDON - Non destructive ===== */
(function(){
const STORE="lenz_watch_progress";

/* route transition */
window.addEventListener("hashchange",()=>{
 const app=document.getElementById("app");
 if(app){app.classList.remove("route-transition");void app.offsetWidth;app.classList.add("route-transition");}
});

/* search history */
const input=document.getElementById("search-input");
if(input){
 const history=JSON.parse(localStorage.getItem("lenz_search_history")||"[]");
 input.addEventListener("change",()=>{
   const v=input.value.trim();
   if(!v) return;
   const next=[v,...history.filter(x=>x!==v)].slice(0,8);
   localStorage.setItem("lenz_search_history",JSON.stringify(next));
 });
}

/* continue watching persistence */
function saveVideoProgress(){
 const video=document.querySelector("video");
 if(!video) return;
 const key=location.hash;
 video.addEventListener("timeupdate",()=>{
   const data=JSON.parse(localStorage.getItem(STORE)||"{}");
   data[key]={time:video.currentTime, duration:video.duration||0};
   localStorage.setItem(STORE,JSON.stringify(data));
 });
 video.addEventListener("loadedmetadata",()=>{
   const data=JSON.parse(localStorage.getItem(STORE)||"{}");
   if(data[key] && data[key].time > 15){
      video.currentTime=data[key].time;
   }
 });
}
setInterval(saveVideoProgress,1500);

/* pull refresh mobile */
let sy=0;
window.addEventListener("touchstart",e=>sy=e.touches[0].clientY,{passive:true});
window.addEventListener("touchend",e=>{
 const dy=e.changedTouches[0].clientY-sy;
 if(window.scrollY===0 && dy>130) location.reload();
},{passive:true});

/* floating shortcut */
const fab=document.createElement("button");
fab.className="floating-fab-v51";
fab.innerHTML="▶";
fab.title="Continue";
fab.onclick=()=>window.scrollTo({top:0,behavior:"smooth"});
document.body.appendChild(fab);
})();
