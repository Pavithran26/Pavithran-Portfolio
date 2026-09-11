import { escapeHtml as html } from '../utils/helpers.js';

// Match technology names, never their descriptions. Word boundaries keep Java
// distinct from JavaScript and Git distinct from GitHub Actions.
const definitions = [
  ['html5', /\bhtml(?:5)?\b/i, '#e34f26'],
  ['css3', /^css(?:3)?$/i, '#1572b6'],
  ['angular', /\bangular\b/i, '#dd0031'],
  ['firebase', /\bfirebase\b|\bfirestore\b/i, '#ffca28'],
  ['expo', /\bexpo\b/i, '#202b3d'],
  ['clerk', /\bclerk\b/i, '#6c47ff'],
  ['numpy', /\bnumpy\b/i, '#4dabcf'],
  ['keras', /\bkeras\b/i, '#d00000'],
  ['selenium', /\bselenium\b/i, '#43b02a'],
  ['vscode', /\bvs ?code\b/i, '#007acc'],
  ['apachespark', /\b(?:apache )?spark\b/i, '#e25a1c'],
  ['apachekafka', /\b(?:apache )?kafka\b/i, '#333333'],
  ['netlify', /\bnetlify\b/i, '#00c7b7'],
  ['cloudflare', /\bcloudflare\b/i, '#f38020'],
  ['axios', /\baxios\b/i, '#5a29e4'],
  ['react', /\breact\b/i, '#61dafb'],
  ['typescript', /\btypescript\b|\bts\b/i, '#3178c6'],
  ['javascript', /\bjavascript\b|\bes6\b/i, '#f7df1e'],
  ['python', /\bpython\b/i, '#ffd343'],
  ['java', /\bjava\b/i, '#ea2d2e'],
  ['csharp', /c#/i, '#b07bda'],
  ['cplusplus', /c\+\+/i, '#659ad2'],
  ['c', /(?:^|\s|\/)c(?=\s|\/|$)/i, '#a9bacd'],
  ['kotlin', /\bkotlin\b/i, '#b967ee'],
  ['r', /^r$/i, '#75aadb'],
  ['fastapi', /\bfastapi\b/i, '#009688'],
  ['dotnetcore', /asp\.net\b|\.net\b|\bdotnet\b/i, '#ab7cef'],
  ['django', /\bdjango\b|\bdrf\b/i, '#6cc69b'],
  ['nodejs', /\bnode\.?js\b/i, '#70b458'],
  ['express', /\bexpress\b/i, '#c6d3c0'],
  ['flask', /\bflask\b/i, '#b5c9b1'],
  ['spring', /\bspring\b/i, '#6db33f'],
  ['orm', /\bentity framework\b|\borm\b/i, '#9cbdd9'],
  ['auth', /\bjwt\b|\brbac\b|\bauth\b/i, '#8fd6e5'],
  ['langchain', /\blangchain\b|\blcel\b/i, '#b3d6bf'],
  ['googlegemini', /\bgemini\b/i, '#a797f8'],
  ['openai', /\bopenai\b|\bgpt[ -]?4o\b/i, '#b8d2cb'],
  ['postgresql', /\bpostgres(?:ql)?\b/i, '#8dbbdc'],
  ['vector', /\bpgvector\b|\bchroma(?:db)?\b|\bembeddings?\b|\bhnsw\b/i, '#8addd0'],
  ['rag', /\brag\b|retrieval.augmented generation/i, '#c7b5f0'],
  ['prompt', /\bprompt\b/i, '#c8bcf5'],
  ['huggingface', /\bhugging ?face\b/i, '#ffd21e'],
  ['pytorch', /\bpytorch\b/i, '#ee4c2c'],
  ['tensorflow', /\btensorflow\b/i, '#ff9d00'],
  ['scikitlearn', /\bscikit.learn\b/i, '#f89939'],
  ['pandas', /\bpandas\b/i, '#b1a5ed'],
  ['threejs', /\bthree\.?js\b|\bwebgl\b/i, '#c6d9d1'],
  ['nextjs', /\bnext\.?js\b/i, '#d8ded4'],
  ['vitejs', /\bvite\b/i, '#bd7eff'],
  ['tailwindcss', /\btailwind(?: ?css)?\b/i, '#38bdf8'],
  ['shadcnui', /\bshadcn\b/i, '#d4e3cc'],
  ['radixui', /\bradix\b/i, '#c9bbeb'],
  ['lucide', /\blucide\b/i, '#f7a6a6'],
  ['flutter', /\bflutter\b/i, '#54c5f8'],
  ['dart', /\bdart\b/i, '#35c1d6'],
  ['redis', /\bredis\b/i, '#ef6860'],
  ['mongodb', /\bmongodb\b/i, '#60bd61'],
  ['mysql', /\bmysql\b/i, '#eaa34f'],
  ['supabase', /\bsupabase\b/i, '#3ecf8e'],
  ['storage', /\bbucket\b|\bobject storage\b|\bs3\b/i, '#a8c7f2'],
  ['docker', /\bdocker\b/i, '#2496ed'],
  ['githubactions', /\bgithub actions\b/i, '#58a6ff'],
  ['git', /\bgit\b/i, '#f56b51'],
  ['github', /\bgithub\b(?!\s+actions\b)/i, '#d7ded3'],
  ['railway', /\brailway\b/i, '#d8d0f0'],
  ['vercel', /\bvercel\b/i, '#ced6c9'],
  ['postman', /\bpostman\b/i, '#ff8b69'],
  ['amazonwebservices', /\baws\b|\bamazon web services\b/i, '#ffb64a'],
  ['azure', /\bazure\b/i, '#53bbf5'],
  ['kubernetes', /\bkubernetes\b|\bk8s\b/i, '#7ca9f6'],
  ['figma', /\bfigma\b/i, '#ad8bff']
];

export function getTechnologyIcons(label) {
  return definitions.filter(([, pattern]) => pattern.test(label)).map(([id, , glow]) => ({ id, glow, src: `/icons/technologies/${id}.svg` }));
}

/** The adjacent technology name labels these decorative logo images. */
export function technologyIcons(label, { eager = false } = {}) {
  const icons = getTechnologyIcons(label);
  if (!icons.length) return '';
  return `<span class="tech-icons" aria-hidden="true">${icons.map(icon => `<span class="tech-icon-frame" data-icon="${icon.id}" style="--logo-glow:${icon.glow}"><img class="tech-logo" src="${html(icon.src)}" alt="" width="32" height="32" loading="${eager ? 'eager' : 'lazy'}" decoding="async" draggable="false"></span>`).join('')}</span>`;
}
