import '../styles/book-reader.css';

export class BookReader {
  constructor(root, { archive = false } = {}) {
    this.root = root;
    this.events = new AbortController();
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)');
    this.pages = [];
    const add = (node, title, category) => {
      if (!node.id) node.id = `leaf-${this.pages.length}`;
      this.pages.push({ node, title, category });
    };
    if (archive) {
      [...root.children].forEach(node => add(node, node.querySelector('h2')?.textContent.replace('↗', '').trim() || 'Project', 'The project archive'));
    } else {
      add(root.querySelector('#top'), 'The beginning', 'A portfolio in chapters');
      add(root.querySelector('#about'), 'The engineer', '01 / Behind the work');
      const education = root.querySelector('#education');
      [...education.querySelectorAll('.education-milestone')].reverse().forEach(node => add(node, node.querySelector('h3').textContent, '02 / The foundations'));
      add(education, 'Learning never stops', '03 / Training & recognition');
      const work = root.querySelector('#work');
      [...work.querySelectorAll('.project-destination')].forEach(node => add(node, node.querySelector('.space-project-title span').textContent, '04 / Selected work'));
      add(work, 'More to discover', '05 / Projects & experiments');
      [...root.querySelectorAll('.world-section')].forEach(node => add(node, node.querySelector('h2').textContent, '06 / Tools of the trade'));
      add(root.querySelector('#dawn'), 'A little intelligence', '07 / Meet DAWN');
      add(root.querySelector('#contact'), 'The next chapter', '08 / Let’s connect');
    }
    this.pages.forEach(({ node }) => node.remove());
    root.innerHTML = `<div class="book-toolbar"><span>PAVITHRAN S. / FIELD NOTES</span><label>Contents <select aria-label="Choose a chapter"></select></label></div><div class="book-volume"><aside class="book-frontispiece"><span class="book-edition">INTERFACE → INTELLIGENCE<br>THE COLLECTED WORKS</span><div><p class="book-category"></p><h2 class="book-chapter"></h2><p class="book-note">Built with curiosity.<br>Written through experience.</p></div><div class="book-seal" aria-hidden="true">P<span>✳</span>S</div><span class="book-signature">Pavithran S.</span></aside><div class="book-paper" aria-label="Portfolio pages"></div></div><nav class="book-controls" aria-label="Turn pages"><button type="button" data-turn="-1">← Previous</button><span role="status" aria-live="polite" class="book-position"></span><button type="button" data-turn="1">Next page →</button></nav>`;
    this.volume = root.querySelector('.book-volume');
    this.cover = document.createElement('div');
    this.cover.className = 'book-cover';
    this.cover.innerHTML = `<div class="cover-face"><span class="cover-edition">A LIFE IN IDEAS · VOL. 01</span><div class="cover-monogram" aria-hidden="true">PS</div><h1>Pavithran <em>S.</em></h1><p>FDE — Forward Deployed Engineer</p><span class="cover-rule"></span><p class="cover-subtitle">From Interface<br>to Intelligence</p><button type="button" class="cover-open">Scroll to open <span aria-hidden="true">↓</span></button></div><div class="cover-back" aria-hidden="true"></div>`;
    this.volume.append(this.cover);
    this.paper = root.querySelector('.book-paper');
    this.select = root.querySelector('select');
    this.pages.forEach(({ node, title }, index) => {
      node.classList.add('book-leaf'); node.tabIndex = -1;
      this.paper.append(node);
      const option = new Option(`${String(index + 1).padStart(2, '0')} · ${title}`, String(index));
      this.select.add(option);
    });
    const on = (target, type, fn) => target.addEventListener(type, fn, { signal: this.events.signal });
    on(root, 'click', event => { const button = event.target.closest('[data-turn]'); if (button) this.go(this.progress < 1 ? 0 : this.index + Number(button.dataset.turn)); });
    on(this.cover.querySelector('button'), 'click', () => this.go(0));
    on(this.select, 'change', () => this.go(Number(this.select.value)));
    on(document, 'click', event => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const id = link.hash.slice(1);
      const index = this.find(id);
      if (index >= 0) { event.preventDefault(); this.go(index); }
    });
    on(window, 'hashchange', () => { const i = this.find(location.hash.slice(1)); if (i >= 0) this.go(i, false); });
    on(document, 'keydown', event => {
      if (document.querySelector('dialog[open]') || event.target.closest('input,textarea,select,[contenteditable]') || event.altKey || event.ctrlKey || event.metaKey) return;
      if (['ArrowRight','ArrowLeft','PageDown','PageUp'].includes(event.key)) { event.preventDefault(); const forward = ['ArrowRight','PageDown'].includes(event.key); this.go(this.progress < 1 && forward ? 0 : this.index + (forward ? 1 : -1)); }
    });
    document.body.classList.add('reading-book', 'scroll-book');
    this.rail = document.createElement('div');
    this.rail.className = 'book-scroll-rail'; this.rail.setAttribute('aria-hidden', 'true');
    document.body.append(this.rail);
    this.index = -1; this.progress = 0;
    this.measure();
    on(window, 'scroll', () => this.schedule());
    on(window, 'resize', () => { this.measure(); this.schedule(); });
    root.querySelectorAll('img').forEach(image => on(image, 'load', () => { this.measure(); this.schedule(); }));
    const start = this.find(location.hash.slice(1));
    if (start > 0) this.go(start, false); else window.scrollTo(0, 0);
    this.render();
    document.fonts?.ready.then(() => { if (!this.events.signal.aborted) { this.measure(); this.schedule(); } });
  }
  measure() {
    this.unit = Math.max(500, window.innerHeight * .9);
    let offset = this.unit;
    this.segments = this.pages.map(({node}) => {
      const hidden = node.hidden; node.hidden = false;
      const read = Math.max(0, node.scrollHeight - node.clientHeight);
      node.hidden = hidden;
      const segment = { start: offset, read, turn: this.unit * .85 };
      offset += read + this.unit * .45 + segment.turn;
      return segment;
    });
    this.maxScroll = offset - this.unit * .85;
    this.rail.style.height = `${this.maxScroll + window.innerHeight}px`;
  }
  schedule() {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => { this.frame = 0; this.render(); });
  }

  find(id) {
    if (id === 'education') return this.pages.findIndex(p => p.node.id.startsWith('education-'));
    if (id === 'work') return this.pages.findIndex(p => p.node.id.startsWith('project-'));
    return this.pages.findIndex(({node}) => node.id === id || [...node.querySelectorAll('[id]')].some(el => el.id === id));
  }
  go(index, updateHash = true) {
    if (index < -1 || index >= this.pages.length) return;
    const top = index < 0 ? 0 : this.segments[index].start;
    window.scrollTo({ top, behavior: this.reduced.matches ? 'instant' : 'smooth' });
    if (updateHash) history.replaceState(null, '', index < 0 ? '#top' : `#${this.pages[index].node.id}`);
  }
  render() {
    const y = window.scrollY;
    const opening = Math.min(1, Math.max(0, y / this.unit));
    this.progress = opening;
    this.volume.style.setProperty('--open', opening);
    this.cover.style.transform = `rotateY(${-180 * (this.reduced.matches ? Math.round(opening) : opening)}deg)`;
    this.cover.style.visibility = opening >= 1 ? 'hidden' : 'visible';
    this.cover.inert = opening > .15;
    this.root.classList.toggle('book-is-closed', opening < .99);
    let index = 0;
    for (let i = 1; i < this.segments.length; i++) if (y >= this.segments[i].start) index = i;
    const segment = this.segments[index];
    const turnStart = segment.start + segment.read + this.unit * .45;
    const turn = index < this.pages.length - 1 ? Math.min(1, Math.max(0, (y - turnStart) / segment.turn)) : 0;
    this.pages.forEach(({node}, i) => {
      node.hidden = i !== index && !(turn > 0 && i === index + 1);
      node.inert = opening < 1 || i !== index || turn > 0;
      node.style.zIndex = i === index ? '2' : '1';
      node.style.transform = i === index && turn > 0 && !this.reduced.matches ? `rotateY(${-180 * turn}deg)` : '';
      node.style.opacity = i === index && turn > 0 && this.reduced.matches ? String(1 - turn) : '';
    });
    this.pages[index].node.scrollTop = Math.min(segment.read, Math.max(0, y - segment.start));
    if (turn > 0) this.pages[index + 1].node.scrollTop = 0;
    if (index !== this.index || this.lastOpening !== (opening < 1)) {
      this.index = index; this.lastOpening = opening < 1;
      const page = this.pages[index];
      this.root.querySelector('.book-chapter').textContent = page.title;
      this.root.querySelector('.book-category').textContent = page.category;
      this.root.querySelector('.book-position').textContent = opening < 1 ? 'SCROLL TO OPEN' : `${String(index + 1).padStart(2, '0')} / ${String(this.pages.length).padStart(2, '0')} · SCROLL TO TURN`;
      this.root.querySelector('[data-turn="-1"]').disabled = opening === 0;
      this.root.querySelector('[data-turn="1"]').disabled = index === this.pages.length - 1;
      this.select.value = String(index);
    }
  }
  dispose() { this.events.abort(); cancelAnimationFrame(this.frame); this.rail.remove(); document.body.classList.remove('scroll-book'); }
}
