import { PORTFOLIO_DATA as profile } from "../data/portfolioData.js";
import { FEATURED_PROJECTS as projects } from "../data/projectsData.js";
import { SPACE_CHAPTERS as chapters } from "../data/spaceJourneyData.js";
import { escapeHtml as html } from "../utils/helpers.js";

const CINEMATIC_INTRO_URL = "https://cdn.openart.ai/openart-uploads/production/attachment-transfers/3fb0ffbecbcacd99557a930ae90175c5e809a24a5e9666bab642d3433dddfafe.mp4";

const icon = kind => {
  const map = {
    projects: '<svg viewBox="0 0 24 24"><path d="M3 6.5h7l2 2h9v9.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.5Z"/><path d="M3 9h18"/></svg>',
    experience: '<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M7 11h10M7 15h6"/></svg>',
    skills: '<svg viewBox="0 0 24 24"><path d="M4 18V8m5 10V4m5 14v-7m5 7V6"/><path d="M2 20h20"/></svg>',
    ai: '<svg viewBox="0 0 24 24"><path d="M9 4a3 3 0 0 1 6 0v1a3 3 0 0 1 3 3v1a3 3 0 0 1 0 6v1a3 3 0 0 1-3 3v1a3 3 0 0 1-6 0v-1a3 3 0 0 1-3-3v-1a3 3 0 0 1 0-6V8a3 3 0 0 1 3-3V4Z"/></svg>',
    education: '<svg viewBox="0 0 24 24"><path d="m3 9 9-5 9 5-9 5-9-5Z"/><path d="M7 12v5c3 2 7 2 10 0v-5"/></svg>',
    achievements: '<svg viewBox="0 0 24 24"><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M6 5H4v2a4 4 0 0 0 4 4M18 5h2v2a4 4 0 0 1-4 4M12 13v4M8 21h8"/></svg>',
    contact: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
    about: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg>',
    journey: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="9" ry="4"/><ellipse cx="12" cy="12" rx="4" ry="9" transform="rotate(45 12 12)"/></svg>',
    terminal: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M12 15h5"/></svg>',
    dawn: '<svg viewBox="0 0 24 24"><path d="M4 12c2.4-4.5 5-6.8 8-6.8s5.6 2.3 8 6.8c-2.4 4.5-5 6.8-8 6.8S6.4 16.5 4 12Z"/><circle cx="12" cy="12" r="2.6"/></svg>'
  };
  return map[kind] || map.projects;
};

const folderDefs = [
  ["projects", "Projects"], ["experience", "Experience"], ["skills", "Tech Stack"],
  ["ai", "AI & RAG"], ["education", "Education"], ["achievements", "Achievements"],
  ["about", "About Me"], ["contact", "Contact"]
];

export class POVWorkstation {
  constructor(options = {}) {
    this.dialogs = options.dialogs;
    this.journey = options.journey;
    this.stage = "sleep";
    this.events = new AbortController();
    this.root = document.createElement("section");
    this.root.className = "pov-workstation";
    this.root.setAttribute("aria-label", "Pavithran workstation portfolio");
    this.root.innerHTML = this.template();
    document.body.appendChild(this.root);
    this.returnButton = document.createElement("button");
    this.returnButton.className = "pov-return-button";
    this.returnButton.type = "button";
    this.returnButton.textContent = "← Workstation";
    this.returnButton.hidden = true;
    document.body.appendChild(this.returnButton);
    document.documentElement.classList.add("pov-active");
    this.bind();
  }

  template() {
    const folderHtml = folderDefs.map(item => {
      return '<button class="ubuntu-folder" type="button" data-pov-folder="' + item[0] + '" aria-label="Open ' + item[1] + '"><span class="ubuntu-folder-icon">' + icon(item[0]) + '</span><span class="ubuntu-folder-label">' + item[1] + '</span></button>';
    }).join("");

    return '<video class="pov-cinematic-intro" id="pov-cinematic-intro" playsinline preload="auto" src="' + CINEMATIC_INTRO_URL + '"></video><button class="pov-skip-intro" id="pov-skip-intro" type="button">Skip intro →</button><div class="pov-room" aria-hidden="true">' +
      '<div class="pov-wall-glow"></div><div class="pov-window"><i></i><i></i><i></i></div>' +
      '<div class="pov-desk-rig">' +
        '<div class="pov-monitor pov-monitor--left"><div class="pov-monitor-screen"><span class="pov-side-kicker">SYS.MONITOR</span><div class="pov-side-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div></div>' +
        '<div class="pov-monitor pov-monitor--center"><div class="pov-monitor-screen" id="pov-physical-screen"><div class="pov-screen-off"></div><div class="pov-boot-mark"><span class="pov-ubuntu-logo">◉</span><strong>ubuntu</strong><small>Starting Pavithran workspace…</small></div></div><button class="pov-power-button" id="pov-power-button" type="button" aria-label="Turn on workstation"><span></span></button></div>' +
        '<div class="pov-monitor pov-monitor--right"><div class="pov-monitor-screen"><span class="pov-side-kicker">DEV.ACTIVITY</span><div class="pov-code-lines"><i></i><i></i><i></i><i></i><i></i><i></i></div></div></div>' +
        '<div class="pov-keyboard"></div><div class="pov-mouse"></div><div class="pov-mug"><i></i></div>' +
      '</div><div class="pov-hand pov-hand--left"></div><div class="pov-hand pov-hand--right"></div></div>' +
      '<button class="pov-wake" id="pov-wake" type="button"><span>Click to wake</span><small>Enter Pavithran workstation</small></button>' +
      '<div class="pov-eyelid pov-eyelid--top"></div><div class="pov-eyelid pov-eyelid--bottom"></div>' +
      '<div class="ubuntu-shell" id="ubuntu-shell" aria-hidden="true">' +
        '<div class="ubuntu-wallpaper"><div class="ubuntu-wallpaper-orbit ubuntu-wallpaper-orbit--1"></div><div class="ubuntu-wallpaper-orbit ubuntu-wallpaper-orbit--2"></div><div class="ubuntu-wallpaper-core">PS</div></div>' +
        '<header class="ubuntu-topbar"><div class="ubuntu-activities">Activities</div><div class="ubuntu-title">Pavithran S. · Workstation</div><div class="ubuntu-status"><span id="pov-clock">18:08</span><span>⌁</span><span>▮▮▮</span><span>⏻</span></div></header>' +
        '<main class="ubuntu-desktop"><div class="ubuntu-desktop-intro"><span>pavithran@workstation</span><strong>From Interface to Intelligence.</strong><small>Double-click a folder to explore · tap once on touch devices</small></div><div class="ubuntu-folders">' + folderHtml + '</div></main>' +
        '<aside class="ubuntu-dock">' +
          '<button type="button" data-pov-folder="projects" aria-label="Projects">' + icon("projects") + '</button>' +
          '<button type="button" data-pov-folder="skills" aria-label="Tech stack">' + icon("skills") + '</button>' +
          '<button type="button" data-pov-action="terminal" aria-label="Terminal">' + icon("terminal") + '</button>' +
          '<button type="button" data-pov-action="dawn" aria-label="DAWN AI">' + icon("dawn") + '</button>' +
          '<button type="button" data-pov-action="journey" aria-label="Cinematic journey">' + icon("journey") + '</button>' +
        '</aside>' +
        '<section class="ubuntu-window" id="ubuntu-window" hidden><header class="ubuntu-window-bar"><div class="ubuntu-window-dots"><i></i><i></i><i></i></div><strong id="ubuntu-window-title">Workspace</strong><button id="ubuntu-window-close" type="button" aria-label="Close window">×</button></header><div class="ubuntu-window-body" id="ubuntu-window-body"></div></section>' +
      '</div>';
  }

  bind() {
    const signal = this.events.signal;
    const on = (target, type, handler, options = {}) => target && target.addEventListener(type, handler, Object.assign({}, options, { signal }));
    this.wakeButton = this.root.querySelector("#pov-wake");
    this.powerButton = this.root.querySelector("#pov-power-button");
    this.cinematicVideo = this.root.querySelector("#pov-cinematic-intro");
    this.skipIntroButton = this.root.querySelector("#pov-skip-intro");
    this.shell = this.root.querySelector("#ubuntu-shell");
    this.window = this.root.querySelector("#ubuntu-window");
    this.windowTitle = this.root.querySelector("#ubuntu-window-title");
    this.windowBody = this.root.querySelector("#ubuntu-window-body");

    on(this.wakeButton, "click", () => this.wake());
    on(this.powerButton, "click", () => this.powerOn());
    on(this.skipIntroButton, "click", () => this.finishCinematic());
    on(this.cinematicVideo, "timeupdate", () => {
      if (this.stage === "cinematic" && this.cinematicVideo.currentTime >= 7.35) this.finishCinematic();
    });
    on(this.cinematicVideo, "ended", () => this.finishCinematic());
    on(this.cinematicVideo, "error", () => this.fallbackWake());
    on(this.root, "dblclick", event => {
      const folder = event.target.closest("[data-pov-folder]");
      if (folder) this.openFolder(folder.dataset.povFolder);
    });
    on(this.root, "click", event => {
      const folder = event.target.closest("[data-pov-folder]");
      if (folder) {
        this.selectedFolder = folder.dataset.povFolder;
        this.root.querySelectorAll(".ubuntu-folder").forEach(item => item.classList.toggle("is-selected", item === folder));
        if (window.matchMedia("(pointer: coarse)").matches || folder.closest(".ubuntu-dock")) this.openFolder(folder.dataset.povFolder);
        return;
      }
      const action = event.target.closest("[data-pov-action]");
      if (action) this.runAction(action.dataset.povAction);
    });
    on(this.root.querySelector("#ubuntu-window-close"), "click", () => this.closeWindow());
    on(this.returnButton, "click", () => this.restoreDesktop());
    on(document, "keydown", event => {
      if (!document.documentElement.classList.contains("pov-active")) return;
      if (event.key === "Escape" && !this.window.hidden) this.closeWindow();
      if (event.key === "Enter" && this.selectedFolder) this.openFolder(this.selectedFolder);
    });

    const tick = () => {
      const clock = this.root.querySelector("#pov-clock");
      if (clock) clock.textContent = new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit" }).format(new Date());
    };
    tick();
    this.clockTimer = window.setInterval(tick, 30000);
  }

  wake() {
    if (this.stage !== "sleep") return;
    this.stage = "cinematic";
    this.root.classList.add("is-cinematic");
    this.wakeButton.disabled = true;
    this.cinematicVideo.currentTime = 0;
    this.cinematicVideo.muted = false;
    this.cinematicVideo.volume = 0.42;

    const playback = this.cinematicVideo.play();
    if (playback && typeof playback.catch === "function") {
      playback.catch(() => {
        this.cinematicVideo.muted = true;
        this.cinematicVideo.play().catch(() => this.fallbackWake());
      });
    }
  }

  fallbackWake() {
    if (this.stage === "desktop") return;
    this.stage = "wake";
    this.root.classList.remove("is-cinematic");
    this.root.classList.add("is-awake");
    window.setTimeout(() => this.root.classList.add("is-approaching"), 450);
    window.setTimeout(() => {
      if (this.stage !== "wake") return;
      this.stage = "desk";
      this.root.classList.add("is-at-desk");
      this.powerButton.focus({ preventScroll: true });
    }, 1450);
  }

  finishCinematic() {
    if (this.stage === "desktop") return;
    this.stage = "desktop";
    this.root.classList.add("is-cinematic-handoff", "is-desktop");
    this.shell.setAttribute("aria-hidden", "false");
    if (this.cinematicVideo) {
      window.setTimeout(() => {
        this.cinematicVideo.pause();
        this.cinematicVideo.currentTime = 0;
      }, 850);
    }
  }

  powerOn() {
    if (this.stage !== "desk") return;
    this.stage = "boot";
    this.root.classList.add("is-powering");
    this.powerButton.disabled = true;
    window.setTimeout(() => this.root.classList.add("is-booting"), 450);
    window.setTimeout(() => {
      this.stage = "desktop";
      this.root.classList.add("is-desktop");
      this.shell.setAttribute("aria-hidden", "false");
    }, 2500);
  }

  runAction(action) {
    if (action === "terminal") return this.dialogs && this.dialogs.openTerminal && this.dialogs.openTerminal();
    if (action === "dawn") return this.dialogs && this.dialogs.openDawn && this.dialogs.openDawn();
    if (action === "journey") return this.enterJourney();
  }

  enterJourney() {
    document.documentElement.classList.remove("pov-active");
    document.documentElement.classList.add("pov-journey-mode");
    this.root.classList.add("is-exiting");
    window.setTimeout(() => {
      this.root.hidden = true;
      this.returnButton.hidden = false;
      if (this.journey && this.journey.flyTo) this.journey.flyTo("#top", { updateHistory: false });
    }, 520);
  }

  restoreDesktop() {
    this.root.hidden = false;
    this.returnButton.hidden = true;
    document.documentElement.classList.remove("pov-journey-mode");
    document.documentElement.classList.add("pov-active");
    requestAnimationFrame(() => this.root.classList.remove("is-exiting"));
  }

  openFolder(id) {
    const map = {
      projects: () => this.renderProjects(),
      experience: () => this.renderExperience(),
      skills: () => this.renderSkills(),
      ai: () => this.renderAI(),
      education: () => this.renderEducation(),
      achievements: () => this.renderAchievements(),
      about: () => this.renderAbout(),
      contact: () => this.renderContact()
    };
    if (!map[id]) return;
    const data = map[id]();
    this.window.className = "ubuntu-window workspace--" + id;
    this.windowTitle.textContent = data.title;
    this.windowBody.innerHTML = data.body;
    this.window.hidden = false;
    requestAnimationFrame(() => this.window.classList.add("is-open"));
  }

  closeWindow() {
    this.window.classList.remove("is-open");
    window.setTimeout(() => { this.window.hidden = true; }, 220);
  }

  renderProjects() {
    const cards = projects.map(project => {
      const tags = project.technologies.slice(0, 4).map(t => "<span>" + html(t) + "</span>").join("");
      const live = project.liveUrl ? '<a href="' + html(project.liveUrl) + '" target="_blank" rel="noopener noreferrer">Live ↗</a>' : "";
      return '<article class="workspace-project-card"><span class="workspace-file-type">' + html(project.category) + '</span><h3>' + html(project.title) + '</h3><p>' + html(project.tagline) + '</p><div class="workspace-tags">' + tags + '</div><div class="workspace-card-actions"><button type="button" data-project="' + project.id + '">Open case study</button>' + live + '</div></article>';
    }).join("");
    return { title: "Projects · Files", body: '<div class="workspace-heading"><span>~/Portfolio/Projects</span><h2>Things I shipped.</h2><p>Four working products across insurance, learning, ERP and legal AI.</p></div><div class="workspace-project-grid">' + cards + '</div>' };
  }

  renderExperience() {
    const rows = profile.experience.map((job, index) => '<article><time>' + html(job.period) + '</time><div><span>0' + (index + 1) + '</span><h3>' + html(job.role) + '</h3><strong>' + html(job.company) + '</strong><p>' + html(job.responsibilities[0]) + '</p></div></article>').join("");
    return { title: "Experience · Work Log", body: '<div class="workspace-heading"><span>journalctl --career</span><h2>Production history.</h2><p>A chronological system log of roles, responsibilities and shipped work.</p></div><div class="workspace-log">' + rows + '</div>' };
  }

  renderSkills() {
    const loads = [88, 92, 84, 86];
    const cards = chapters.map((chapter, index) => {
      const tags = chapter.tools.map(tool => "<span>" + html(tool.name) + "</span>").join("");
      return '<article><div class="workspace-meter"><i style="--load:' + loads[index] + '%"></i></div><span>' + html(chapter.orbit) + '</span><h3>' + html(chapter.headline) + '</h3><div class="workspace-tags">' + tags + '</div></article>';
    }).join("");
    return { title: "Tech Stack · System Monitor", body: '<div class="workspace-heading"><span>system resources</span><h2>Engineering layers.</h2><p>Every layer is part of the same delivery path — interface to intelligence.</p></div><div class="workspace-metrics">' + cards + '</div>' };
  }

  renderAI() {
    const ai = chapters.find(chapter => chapter.id === "ai") || chapters[chapters.length - 1];
    const tags = ai.tools.map(tool => "<span>" + html(tool.name) + "</span>").join("");
    const nodes = Array.from({ length: 18 }, (_, i) => '<i style="--x:' + ((i * 37) % 91) + '%;--y:' + ((i * 53) % 84) + '%;--d:' + (i % 5) + '"></i>').join("");
    return { title: "AI & RAG · Neural Lab", body: '<div class="ai-neural-field">' + nodes + '</div><div class="workspace-heading workspace-heading--ai"><span>rag://knowledge.engine</span><h2>Applied intelligence.</h2><p>Retrieval, embeddings and LLM orchestration designed around useful product behavior.</p></div><div class="workspace-ai-grid"><article><span>PIPELINE</span><strong>Retrieve → Ground → Generate</strong><p>Context-first responses using vector search and structured prompts.</p></article><article><span>MODELS</span><strong>Gemini · OpenAI · Hugging Face</strong><p>Model choice follows cost, latency and task quality.</p></article><article><span>MEMORY</span><strong>PostgreSQL · pgvector</strong><p>Application data and vector knowledge stay close to the product.</p></article><article><span>TOOLS</span><div class="workspace-tags">' + tags + '</div></article></div><button class="workspace-dawn-launch" type="button" data-pov-action="dawn">Open DAWN AI ↗</button>' };
  }

  renderEducation() {
    const rows = profile.education.map((item, index) => '<article><span class="workspace-paper-index">0' + (index + 1) + '</span><div><time>' + html(item.period) + '</time><h3>' + html(item.degree) + '</h3><strong>' + html(item.institution) + '</strong><p>' + html(item.highlights) + '</p></div></article>').join("");
    return { title: "Education · Archive", body: '<div class="workspace-heading"><span>~/Archive/Education</span><h2>Learning, layer by layer.</h2></div><div class="workspace-education">' + rows + '</div>' };
  }

  renderAchievements() {
    const items = profile.achievements.concat(profile.training).slice(0, 8);
    const cards = items.map((item, index) => '<article><span class="workspace-medal">' + String(index + 1).padStart(2, "0") + '</span><div><time>' + html(item.date || "") + '</time><h3>' + html(item.title) + '</h3><p>' + html(item.organization || item.description || "") + '</p></div></article>').join("");
    return { title: "Achievements · Trophy Cabinet", body: '<div class="workspace-heading"><span>milestones.db</span><h2>Signals of progress.</h2><p>Recognition, competitions and focused training.</p></div><div class="workspace-trophies">' + cards + '</div>' };
  }

  renderAbout() {
    return { title: "About Me · README.md", body: '<div class="workspace-readme"><span># pavithran-s</span><h2>' + html(profile.role) + '</h2><p>' + html(profile.summary) + '</p><div class="workspace-readme-grid"><article><small>LOCATION</small><strong>' + html(profile.location) + '</strong></article><article><small>CURRENT</small><strong>' + html(profile.company) + '</strong></article><article><small>FOCUS</small><strong>Backend · AI/RAG · Interactive Systems</strong></article><article><small>MODE</small><strong>Build → Ship → Learn</strong></article></div><button type="button" data-pov-action="journey">Open cinematic story ↗</button></div>' };
  }

  renderContact() {
    return { title: "Contact · Mail", body: '<div class="workspace-mail"><aside><span>Inbox</span><span>Drafts</span><span>Sent</span><span>Archive</span></aside><article><span class="workspace-mail-kicker">NEW CONNECTION</span><h2>Let us build something useful.</h2><p>If you want to talk about product engineering, backend systems, AI/RAG or interactive web experiences, this is the fastest route.</p><a class="workspace-mail-primary" href="mailto:' + html(profile.email) + '">' + html(profile.email) + ' ↗</a><div class="workspace-mail-links"><a href="' + profile.links.github + '" target="_blank" rel="noopener noreferrer">GitHub</a><a href="' + profile.links.linkedin + '" target="_blank" rel="noopener noreferrer">LinkedIn</a></div></article></div>' };
  }

  destroy() {
    this.events.abort();
    if (this.cinematicVideo) this.cinematicVideo.pause();
    window.clearInterval(this.clockTimer);
    this.root.remove();
    this.returnButton && this.returnButton.remove();
    document.documentElement.classList.remove("pov-active", "pov-journey-mode");
  }
}
