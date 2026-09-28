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
      [...education.querySelectorAll('.education-milestone')].forEach(node => add(node, node.querySelector('h3').textContent, '02 / The foundations'));
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
    this.paper = root.querySelector('.book-paper');
    this.select = root.querySelector('select');
    this.pages.forEach(({ node, title }, index) => {
      node.classList.add('book-leaf'); node.tabIndex = -1;
      this.paper.append(node);
      const option = new Option(`${String(index + 1).padStart(2, '0')} · ${title}`, String(index));
      this.select.add(option);
    });
    const on = (target, type, fn) => target.addEventListener(type, fn, { signal: this.events.signal });
    on(root, 'click', event => { const button = event.target.closest('[data-turn]'); if (button) this.go(this.index + Number(button.dataset.turn)); });
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
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); this.go(this.index + (event.key === 'ArrowRight' ? 1 : -1)); }
    });
    const start = this.find(location.hash.slice(1));
    this.index = -1; this.go(Math.max(0, start), false);
    document.body.classList.add('reading-book');
  }
  find(id) {
    if (id === 'education') return this.pages.findIndex(p => p.node.id.startsWith('education-'));
    if (id === 'work') return this.pages.findIndex(p => p.node.id.startsWith('project-'));
    return this.pages.findIndex(({node}) => node.id === id || [...node.querySelectorAll('[id]')].some(el => el.id === id));
  }
  go(index, updateHash = true) {
    if (index < 0 || index >= this.pages.length || index === this.index) return;
    this.animation?.cancel(); this.ghost?.remove();
    const previous = this.pages[this.index];
    if (previous && !this.reduced.matches) {
      const ghost = previous.node.cloneNode(true);
      ghost.removeAttribute('id'); ghost.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      ghost.classList.add('book-turning'); ghost.inert = true; ghost.setAttribute('aria-hidden', 'true');
      this.paper.append(ghost); this.ghost = ghost;
      const forward = index > this.index;
      this.animation = ghost.animate([{ transform: 'rotateY(0deg)', opacity: 1 }, { transform: `rotateY(${forward ? -105 : 75}deg)`, opacity: 0 }], { duration: 650, easing: 'cubic-bezier(.25,.65,.2,1)' });
      this.animation.onfinish = () => ghost.remove();
    }
    this.index = index;
    this.pages.forEach(({node}, i) => { node.hidden = i !== index; node.inert = i !== index; });
    const page = this.pages[index];
    this.root.querySelector('.book-chapter').textContent = page.title;
    this.root.querySelector('.book-category').textContent = page.category;
    this.root.querySelector('.book-position').textContent = `${String(index + 1).padStart(2, '0')} / ${String(this.pages.length).padStart(2, '0')}`;
    this.root.querySelector('[data-turn="-1"]').disabled = index === 0;
    this.root.querySelector('[data-turn="1"]').disabled = index === this.pages.length - 1;
    this.select.value = String(index);
    if (updateHash) { history.pushState(null, '', `#${page.node.id}`); page.node.focus({preventScroll:true}); }
  }
  dispose() { this.events.abort(); this.animation?.cancel(); this.ghost?.remove(); }
}
