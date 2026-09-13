const stages = {
  school: { alt: 'Young clay schoolboy with schoolbooks and backpack', symbols: ['A', 'B', 'C'] },
  teen: { alt: 'Teenage clay student reading a science book in full-length school uniform', symbols: ['π', '∑', '⚛'] },
  student: { alt: 'Young adult clay college student sitting with a laptop in casual clothes', symbols: ['&lt;/&gt;', '{ }', '01'] },
  graduate: { alt: 'Clay postgraduate in an academic gown holding a diploma', symbols: ['✦', '✧', '✦'] },
};

export function educationCharacter(stage) {
  const key = Object.hasOwn(stages, stage) ? stage : 'school';
  const { alt, symbols } = stages[key];
  return `<figure class="education-character education-character--${key}">
    <div class="education-orbit" aria-hidden="true"></div>
    <div class="education-actor"><img src="/images/education/${key}-800.webp" srcset="/images/education/${key}-400.webp 400w, /images/education/${key}-800.webp 800w" sizes="(max-width: 759px) 240px, 400px" width="800" height="800" loading="lazy" decoding="async" alt="${alt}" /></div>
    <div class="education-sparks" aria-hidden="true">${symbols.map((symbol, i) => `<span style="--spark:${i}">${symbol}</span>`).join('')}</div>
  </figure>`;
}
