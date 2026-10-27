import React, { useState } from "react";
import {
  Activity,
  AudioLines,
  ChartBar,
  Code2,
  Droplets,
  Globe,
  GraduationCap,
  HeartPulse,
  Orbit,
  RadioTower,
  Scale,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sprout,
} from "lucide-react";
import "./ProjectOrbitShowcase.css";

const PROJECT_ORDER = [
  "clansure",
  "sattam-ai",
  "srk-erp",
  "gt-companion",
  "my-cow",
  "prismiq",
  "product-demand-forecast",
  "rf-detector",
  "road-accident-analysis",
  "screen-drawing",
  "upi-fraud-detection",
  "heart-disease-prediction",
  "pneumonia-detection",
  "speech-recognition",
  "save-water-game",
  "web-scraper",
  "healthsurance",
];

const PROJECT_ACCENTS = {
  clansure: "#70dfa1",
  "sattam-ai": "#b7a2ff",
  "srk-erp": "#f0c36b",
  "gt-companion": "#76d9eb",
  "my-cow": "#a9d978",
  prismiq: "#d4a6ff",
  "product-demand-forecast": "#f5a66b",
  "rf-detector": "#71c9ff",
  "road-accident-analysis": "#ff9c9c",
  "screen-drawing": "#ffbf70",
  "upi-fraud-detection": "#ff7e9e",
  "heart-disease-prediction": "#ff8d85",
  "pneumonia-detection": "#88b5ff",
  "speech-recognition": "#a8e5cc",
  "save-water-game": "#69d9e7",
  "web-scraper": "#c4d4ff",
  healthsurance: "#8ce1b2",
};

const PROJECT_ICONS = {
  clansure: ShieldCheck,
  "sattam-ai": Scale,
  "srk-erp": Sprout,
  "gt-companion": GraduationCap,
  "my-cow": Sprout,
  prismiq: Sparkles,
  "product-demand-forecast": ChartBar,
  "rf-detector": RadioTower,
  "road-accident-analysis": Activity,
  "screen-drawing": ScanLine,
  "upi-fraud-detection": ShieldAlert,
  "heart-disease-prediction": HeartPulse,
  "pneumonia-detection": HeartPulse,
  "speech-recognition": AudioLines,
  "save-water-game": Droplets,
  "web-scraper": Globe,
  healthsurance: ShieldCheck,
};

const ORBIT_CONFIGS = [
  { radius: "var(--project-orbit-radius-1)", duration: 25, baseOffset: 11 },
  { radius: "var(--project-orbit-radius-2)", duration: 32, baseOffset: 49 },
  { radius: "var(--project-orbit-radius-3)", duration: 40, baseOffset: 86 },
  { radius: "var(--project-orbit-radius-4)", duration: 48, baseOffset: 127 },
  { radius: "var(--project-orbit-radius-5)", duration: 56, baseOffset: 164 },
];

export function ProjectOrbitShowcase({ projects = [] }) {
  const orderedProjects = [
    ...PROJECT_ORDER.map((id) => projects.find((project) => project.id === id)).filter(Boolean),
    ...projects.filter((project) => !PROJECT_ORDER.includes(project.id)),
  ];

  const [activeProjectId, setActiveProjectId] = useState("clansure");
  const activeIndex = Math.max(0, orderedProjects.findIndex((project) => project.id === activeProjectId));
  const activeProject = orderedProjects[activeIndex] || orderedProjects[0];

  if (!activeProject) return null;

  const accent = PROJECT_ACCENTS[activeProject.id] || activeProject.accentColor || "#70dfa1";
  const sourceUrl = activeProject.githubUrl || activeProject.sourceUrl;
  const technologies = (activeProject.technologies || []).slice(0, 6);
  const orbitGroups = ORBIT_CONFIGS.map((_, ringIndex) =>
    orderedProjects
      .map((project, index) => ({ project, index }))
      .filter(({ index }) => index % ORBIT_CONFIGS.length === ringIndex)
  );

  return (
    <div className="project-orbit-showcase" style={{ "--active-project-accent": accent }}>
      <section className="project-orbit-universe" aria-label="Interactive solar system of all projects">
        <div className="project-orbit-heading">
          <span className="project-orbit-eyebrow">PROJECT ORBIT / {orderedProjects.length} PROJECTS</span>
          <span className="project-orbit-live"><i aria-hidden="true" /> SELECT A PLANET TO EXPLORE</span>
        </div>

        <div className="project-orbit-stage">
          <div className="project-orbit-nebula" aria-hidden="true" />
          <div className="project-orbit-stars" aria-hidden="true" />

          <div className="project-orbit-plane" role="group" aria-label="Choose a project planet">
            {ORBIT_CONFIGS.map((orbit, index) => (
              <div
                key={index}
                className={`project-orbit-ring project-orbit-ring--${index + 1}`}
                style={{ "--orbit-radius": orbit.radius }}
                aria-hidden="true"
              />
            ))}

            {orbitGroups.flatMap((group, ringIndex) => {
              const orbit = ORBIT_CONFIGS[ringIndex];
              const ringNodeCount = group.length;
              return group.map(({ project }, positionIndex) => {
                const projectAccent = PROJECT_ACCENTS[project.id] || project.accentColor || "#70dfa1";
                const selected = activeProject.id === project.id;
                const ProjectIcon = PROJECT_ICONS[project.id] || Orbit;
                const angle = (orbit.baseOffset + positionIndex * (360 / ringNodeCount)) % 360;
                const delay = -(orbit.duration * angle / 360);

                return (
                  <div
                    key={project.id}
                    className={`project-orbit-path project-orbit-path--${ringIndex + 1}`}
                    style={{
                      "--orbit-radius": orbit.radius,
                      "--orbit-duration": `${orbit.duration}s`,
                      "--orbit-delay": `${delay}s`,
                      "--orbit-accent": projectAccent,
                    }}
                  >
                    <button
                      type="button"
                      className={`project-orbit-node${selected ? " is-active" : ""}`}
                      onClick={() => setActiveProjectId(project.id)}
                      aria-pressed={selected}
                      aria-label={`Show ${project.title} project details`}
                      title={`Explore ${project.title}`}
                      style={{ "--node-accent": projectAccent }}
                    >
                      <span className="project-orbit-node-mark" aria-hidden="true">
                        <ProjectIcon size={16} strokeWidth={2.1} />
                      </span>
                      <span className="project-orbit-node-name">{project.title}</span>
                    </button>
                  </div>
                );
              });
            })}
          </div>

          <div className="project-orbit-core" aria-label="Pavithran project core">
            <span className="project-orbit-core-halo" />
            <span className="project-orbit-core-mark">PS</span>
            <span className="project-orbit-core-rule" />
            <span className="project-orbit-core-label">PROJECT CORE</span>
          </div>
        </div>
      </section>

      <div className="project-orbit-index-header">
        <span>EXPLORE EVERY PROJECT</span>
        <span>{String(orderedProjects.length).padStart(2, "0")} AVAILABLE</span>
      </div>

      <div className="project-orbit-project-index" aria-label="All projects">
        {orderedProjects.map((project, index) => (
          <button
            key={project.id}
            type="button"
            className={`project-orbit-index-item${activeProject.id === project.id ? " is-active" : ""}`}
            onClick={() => setActiveProjectId(project.id)}
            aria-pressed={activeProject.id === project.id}
            style={{ "--node-accent": PROJECT_ACCENTS[project.id] || project.accentColor || "#70dfa1" }}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span className="project-orbit-index-title">{project.title}</span>
          </button>
        ))}
      </div>

      <article className="project-orbit-detail" key={activeProject.id}>
        <div className="project-orbit-detail-topline">
          <span className="project-orbit-category"><i aria-hidden="true" />{activeProject.category}</span>
          <span className="project-orbit-counter">{String(activeIndex + 1).padStart(2, "0")} / {String(orderedProjects.length).padStart(2, "0")}</span>
        </div>

        <p className="project-orbit-detail-badge">{activeProject.badge || "SELECTED PROJECT"}</p>
        <h3>{activeProject.title}</h3>
        <p className="project-orbit-tagline">{activeProject.tagline}</p>
        <p className="project-orbit-overview">{activeProject.overview}</p>

        <div className="project-orbit-detail-grid">
          <section>
            <h4>THE CHALLENGE</h4>
            <p>{activeProject.challenge}</p>
          </section>
          <section>
            <h4>THE APPROACH</h4>
            <p>{activeProject.solution}</p>
          </section>
        </div>

        {activeProject.implementationNote ? (
          <p className="project-orbit-scope-note">{activeProject.implementationNote}</p>
        ) : null}

        {activeProject.highlights?.length ? (
          <div className="project-orbit-highlights">
            <h4>ENGINEERING HIGHLIGHTS</h4>
            <ul>
              {activeProject.highlights.slice(0, 2).map((highlight) => <li key={highlight}>{highlight}</li>)}
            </ul>
          </div>
        ) : null}

        <div className="project-orbit-tech-section">
          <h4>BUILT WITH / PROJECT FOCUS</h4>
          <div className="project-orbit-tech-list">
            {technologies.map((technology) => <span key={technology}>{technology}</span>)}
          </div>
        </div>

        <div className="project-orbit-actions">
          {activeProject.liveUrl ? (
            <a className="project-orbit-primary-action" href={activeProject.liveUrl} target="_blank" rel="noopener noreferrer">
              Visit live app <span aria-hidden="true">↗</span>
            </a>
          ) : null}
          {sourceUrl ? (
            <a className="project-orbit-secondary-action" href={sourceUrl} target="_blank" rel="noopener noreferrer">
              Source code <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </article>
    </div>
  );
}

export default ProjectOrbitShowcase;
