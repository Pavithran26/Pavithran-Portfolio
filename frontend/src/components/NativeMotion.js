import '../styles/native-motion.css';
export class NativeMotion {
 constructor(root=document) {
  this.root=root; this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
  this.items=[...root.querySelectorAll('.intro-identity > *, .world-copy > *, .archive-project, .space-contact .space-content > *')];
  this.observer=new IntersectionObserver(entries=>entries.forEach(e=>{
   if(e.isIntersecting){e.target.classList.add('motion-visible');this.observer.unobserve(e.target);}
  }),{threshold:.08});
  this.items.forEach((el,i)=>{el.classList.add('native-reveal');el.style.setProperty('--motion-delay',Math.min(i%4*60,180)+'ms');this.observer.observe(el);});
  this.scenes=[...root.querySelectorAll('.project-scene,.archive-project')];
  this.sceneObserver=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('native-active',e.isIntersecting)),{rootMargin:'80px'});
  this.scenes.forEach(el=>this.sceneObserver.observe(el));
  if(!this.reduced.matches && !location.hash){
   const intro=document.createElement('div');intro.className='native-opening native-video-opening';
   intro.innerHTML='<video class="native-opening-video" playsinline muted preload="metadata" src="/videos/realistic-power-on-slow.mp4"></video><div class="native-opening-shade"></div><div class="native-opening-caption"><span>PAVITHRAN S.</span><small>FROM INTERFACE TO INTELLIGENCE</small></div><button class="native-opening-skip" type="button">Skip intro <span aria-hidden="true">→</span></button>';
   document.body.append(intro);this.intro=intro;this.video=intro.querySelector('video');
   const finish=()=>{if(!this.intro)return;this.intro.classList.add('native-opening-done');this.video?.pause();this.timer=setTimeout(()=>this.intro?.remove(),500);};
   this.finishIntro=finish;
   intro.querySelector('.native-opening-skip').addEventListener('click',finish,{once:true});
   this.video.addEventListener('ended',finish,{once:true});
   this.video.addEventListener('error',finish,{once:true});
   const playback=this.video.play();
   playback?.catch(finish);
  }
 }
 dispose(){clearTimeout(this.timer);this.intro?.remove();this.observer.disconnect();this.sceneObserver.disconnect();}
}
