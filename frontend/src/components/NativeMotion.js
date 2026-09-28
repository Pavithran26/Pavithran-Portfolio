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
   const intro=document.createElement('div');intro.className='native-opening';intro.setAttribute('aria-hidden','true');
   intro.innerHTML='<div class="native-rings"><i></i><i></i><i></i></div><div class="native-signature">Pavithran <em>S.</em><small>FROM INTERFACE TO INTELLIGENCE</small></div>';
   document.body.append(intro);this.intro=intro;this.timer=setTimeout(()=>intro.remove(),1900);
  }
 }
 dispose(){clearTimeout(this.timer);this.intro?.remove();this.observer.disconnect();this.sceneObserver.disconnect();}
}
