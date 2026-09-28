import '../styles/native-motion.css';

const BOOK_PAGES = [
 { id: 'cover', kicker: 'FIELD NOTES', title: 'Pavithran S.', meta: 'From interface to intelligence.' },
 { id: 'work', kicker: 'CHAPTER 01', title: 'Selected work.', meta: 'Different problems. The same curiosity.' },
 { id: 'about', kicker: 'CHAPTER 02', title: 'Always curious.', meta: 'Still building.' },
 { id: 'frontend', kicker: 'CHAPTER 03', title: 'Frontend systems.', meta: 'Interfaces with intent.' },
 { id: 'backend', kicker: 'CHAPTER 04', title: 'Backend systems.', meta: 'Dependable foundations.' },
 { id: 'databases', kicker: 'CHAPTER 05', title: 'Structured data.', meta: 'Information in motion.' },
 { id: 'ai', kicker: 'CHAPTER 06', title: 'Applied intelligence.', meta: 'Useful, not ornamental.' },
 { id: 'education', kicker: 'CHAPTER 07', title: 'Learning, layer by layer.', meta: 'The foundations.' },
 { id: 'contact', kicker: 'LAST PAGE', title: 'Something that matters.', meta: 'The next chapter starts here.' },
];

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
  this.events=new AbortController();
  this.createBook();
  this.updateBook();
  window.addEventListener('scroll',()=>this.updateBook(),{passive:true,signal:this.events.signal});
 }

 createBook(){
  const book=document.createElement('aside'); book.className='native-book';
  book.setAttribute('aria-label','Portfolio chapter navigator');
  book.innerHTML='<div class="native-book-shadow"></div><div class="native-book-cover"><span class="native-book-mark">PS</span><span class="native-book-kicker">FIELD NOTES</span><strong>Pavithran<br><em>S.</em></strong><small>FROM INTERFACE<br>TO INTELLIGENCE</small><i>Scroll to open</i></div><div class="native-book-pages"><div class="native-book-page native-book-page-left"><span class="native-book-page-no">01</span><span class="native-book-page-kicker"></span><strong class="native-book-page-title"></strong><small class="native-book-page-meta"></small></div><div class="native-book-page native-book-page-right"><span class="native-book-page-rule"></span><span class="native-book-page-copy">A portfolio in chapters.<br>Built with curiosity.</span></div></div>';
  document.body.append(book); this.book=book;
  this.bookCover=book.querySelector('.native-book-cover'); this.bookPages=book.querySelector('.native-book-pages');
  this.pageNo=book.querySelector('.native-book-page-no'); this.pageKicker=book.querySelector('.native-book-page-kicker');
  this.pageTitle=book.querySelector('.native-book-page-title'); this.pageMeta=book.querySelector('.native-book-page-meta');
 }

 updateBook(){
  if(!this.book) return;
  const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
  const progress=Math.max(0,Math.min(1,window.scrollY/max));
  const raw=progress*(BOOK_PAGES.length-1);
  const index=Math.min(BOOK_PAGES.length-1,Math.floor(raw));
  const page=BOOK_PAGES[index];
  const pageProgress=raw-index;
  this.book.style.setProperty('--book-progress',progress.toFixed(3));
  this.book.style.setProperty('--book-turn',pageProgress.toFixed(3));
  this.book.classList.toggle('is-open',progress>.015);
  this.book.classList.toggle('is-finished',progress>.96);
  if(this.activePage!==index){
   this.activePage=index; this.book.classList.remove('page-changed'); void this.book.offsetWidth; this.book.classList.add('page-changed');
   this.pageNo.textContent=String(index+1).padStart(2,'0'); this.pageKicker.textContent=page.kicker; this.pageTitle.textContent=page.title; this.pageMeta.textContent=page.meta;
  }
 }

 dispose(){this.events?.abort();this.book?.remove();this.observer.disconnect();this.sceneObserver.disconnect();}
}
