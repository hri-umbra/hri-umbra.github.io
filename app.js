document.documentElement.classList.add('js');
const $=s=>document.querySelector(s);
function lockVideoSpeed(video,rate){
 video.setAttribute('controlslist','noplaybackrate');
 const enforce=()=>{
  if(video.defaultPlaybackRate!==rate)video.defaultPlaybackRate=rate;
  if(video.playbackRate!==rate)video.playbackRate=rate;
 };
 video.addEventListener('loadedmetadata',enforce);
 video.addEventListener('ratechange',enforce);
 video.addEventListener('play',enforce);
 enforce();
}
function selectScenario(s){
 document.querySelectorAll('[data-results-scenario]').forEach(panel=>{panel.hidden=panel.dataset.resultsScenario!==s;});
 document.querySelectorAll('[data-scenario]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.scenario===s)));
}
document.querySelectorAll('[data-scenario]').forEach(button=>button.addEventListener('click',()=>selectScenario(button.dataset.scenario)));
document.querySelectorAll('[data-highlight]').forEach(button=>button.addEventListener('click',()=>{
 const active=button.getAttribute('aria-pressed')!=='true';
 document.querySelectorAll('[data-highlight]').forEach(b=>b.setAttribute('aria-pressed',String(active&&b===button)));
 document.querySelectorAll('[data-line]').forEach(g=>g.style.opacity=!active||g.dataset.line===button.dataset.highlight?'1':'.18');
}));
document.querySelectorAll('video').forEach(v=>lockVideoSpeed(v,v.id==='replay-player'?3:1));
let currentScene=1;
const player=$('#replay-player');
function showScene(id){
 currentScene=Number(id.slice(1));player.pause();
 player.poster=`assets/replays/${id}.webp`;player.src=`assets/replays/${id}.mp4`;player.load();
 $('#scene-title').textContent='Scene '+id;
 player.setAttribute('aria-label','Simulation trajectory visualization for scene '+id);
 document.querySelectorAll('[data-scene]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scene===id)));
 player.play().catch(()=>{});
}
document.querySelectorAll('[data-scene]').forEach(b=>b.addEventListener('click',()=>showScene(b.dataset.scene)));
$('#next-scene').addEventListener('click',()=>showScene('S'+String(currentScene%32+1).padStart(2,'0')));
document.querySelectorAll('video:not(#hero-video)').forEach(v=>v.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==v)other.pause();})));

function setupHeroVideo(){
 const film=document.querySelector('#hero-video'),toggle=document.querySelector('#hero-play-toggle');
 if(!film||!toggle)return;
 let manuallyPaused=matchMedia('(prefers-reduced-motion: reduce)').matches,visible=true;
 const sync=()=>{toggle.textContent=film.paused?'Play background':'Pause background';toggle.setAttribute('aria-label',toggle.textContent+' video');};
 const resume=()=>{if(!manuallyPaused&&visible&&!document.hidden&&![...document.querySelectorAll('video:not(#hero-video)')].some(v=>!v.paused))film.play().catch(sync);};
 film.addEventListener('play',sync);film.addEventListener('pause',sync);
 toggle.addEventListener('click',()=>{manuallyPaused=!film.paused;if(manuallyPaused)film.pause();else film.play().catch(sync);});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)film.pause();else resume();},{threshold:.15}).observe(film);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)film.pause();else resume();});
 resume();sync();
}
setupHeroVideo();
