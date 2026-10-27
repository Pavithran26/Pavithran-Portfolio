import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Activity,
  BarChart3,
  Code2,
  Mic,
  Droplets,
  Globe,
  GraduationCap,
  HeartPulse,
  Orbit,
  RadioTower,
  Scale,
  PenTool,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sprout,
  X,
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
  "product-demand-forecast": BarChart3,
  "rf-detector": RadioTower,
  "road-accident-analysis": Activity,
  "screen-drawing": PenTool,
  "upi-fraud-detection": ShieldAlert,
  "heart-disease-prediction": HeartPulse,
  "pneumonia-detection": HeartPulse,
  "speech-recognition": Mic,
  "save-water-game": Droplets,
  "web-scraper": Globe,
  healthsurance: ShieldCheck,
};

const ORBIT_CONFIGS = [
  { radius: "var(--project-orbit-radius-1)", duration: 31, baseOffset: 11 },
  { radius: "var(--project-orbit-radius-2)", duration: 37, baseOffset: 43 },
  { radius: "var(--project-orbit-radius-3)", duration: 44, baseOffset: 82 },
  { radius: "var(--project-orbit-radius-4)", duration: 52, baseOffset: 119 },
  { radius: "var(--project-orbit-radius-5)", duration: 59, baseOffset: 157 },
  { radius: "var(--project-orbit-radius-6)", duration: 67, baseOffset: 201 },
  { radius: "var(--project-orbit-radius-7)", duration: 74, baseOffset: 244 },
  { radius: "var(--project-orbit-radius-8)", duration: 83, baseOffset: 291 },
];

export function ProjectOrbitShowcase({ projects = [] }) {
  const orderedProjects = [
    ...PROJECT_ORDER.map((id) => projects.find((project) => project.id === id)).filter(Boolean),
    ...projects.filter((project) => !PROJECT_ORDER.includes(project.id)),
  ];

  const [activeProjectId, setActiveProjectId] = useState("clansure");
  const [openProjectId, setOpenProjectId] = useState(null);
  const closeButtonRef = useRef(null);
  const activeIndex = Math.max(0, orderedProjects.findIndex((project) => project.id === activeProjectId));
  const activeProject = orderedProjects[activeIndex] || orderedProjects[0];
  const openProject = orderedProjects.find((project) => project.id === openProjectId) || null;

  useEffect(() => {
    if (!openProject) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus({ preventScroll: true }));

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpenProjectId(null);
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openProject]);

  if (!activeProject) return null;

  const openProjectDetails = (project) => {
    setActiveProjectId(project.id);
    setOpenProjectId(project.id);
  };

  const sourceUrl = openProject?.githubUrl || openProject?.sourceUrl;
  const technologies = (openProject?.technologies || []).slice(0, 8);
  // Spread two projects across each ring; place any remaining projects on the outermost ring.
  // This avoids crowding the inner orbits when the project catalogue grows.
  const orbitGroups = ORBIT_CONFIGS.map((_, ringIndex) =>
    orderedProjects
      .map((project, index) => ({ project, index }))
      .filter(({ index }) => (index < ORBIT_CONFIGS.length * 2 ? index % ORBIT_CONFIGS.length : ORBIT_CONFIGS.length - 1) === ringIndex)
  );

  return (
    <div className="project-orbit-showcase" style={{ "--active-project-accent": PROJECT_ACCENTS[activeProject.id] || activeProject.accentColor || "#70dfa1" }}>
      <section className="project-orbit-universe" aria-label="Interactive solar system of all projects">
        <div className="project-orbit-heading">
          <span className="project-orbit-eyebrow">PROJECT ORBIT</span>
          <span className="project-orbit-live"><i aria-hidden="true" /> CLICK A PLANET TO EXPLORE</span>
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
                      "--orbit-duration": `${orbit.duration}s`,
                      "--orbit-delay": `${delay}s`,
                      "--orbit-accent": projectAccent,
                    }}
                  >
                    <button
                      type="button"
                      className={`project-orbit-node${selected ? " is-active" : ""}`}
                      onClick={() => openProjectDetails(project)}
                      aria-label={`Open ${project.title} project details`}
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

          <div className="project-orbit-core" aria-label="FDE software engineering core">
            <span className="project-orbit-core-halo" />
            <span className="project-orbit-core-mark" aria-hidden="true"><Code2 size={22} strokeWidth={2} /></span>
          </div>
        </div>
      </section>

      {openProject ? createPortal(
        <div
          className="project-orbit-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpenProjectId(null);
          }}
        >
          <section
            className="project-orbit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-orbit-modal-title"
            style={{ "--active-project-accent": PROJECT_ACCENTS[openProject.id] || openProject.accentColor || "#70dfa1" }}
          >
            <header className="project-orbit-modal-header">
              <div className="project-orbit-modal-eyebrow">
                <span className="project-orbit-modal-dot" aria-hidden="true" />
                SELECTED PROJECT / {String(orderedProjects.findIndex((project) => project.id === openProject.id) + 1).padStart(2, "0")} OF {String(orderedProjects.length).padStart(2, "0")}
              </div>
              <button ref={closeButtonRef} type="button" className="project-orbit-modal-close" onClick={() => setOpenProjectId(null)} aria-label="Close project details">
                <span>Close</span><X size={18} />
              </button>
            </header>

            <div className="project-orbit-modal-scroll">
              <p className="project-orbit-detail-badge">{openProject.badge || "SELECTED PROJECT"}</p>
              <h2 id="project-orbit-modal-title">{openProject.title}</h2>
              <p className="project-orbit-tagline">{openProject.tagline}</p>
              <p className="project-orbit-overview">{openProject.overview}</p>

              <div className="project-orbit-detail-grid">
                <section>
                  <h3>THE CHALLENGE</h3>
                  <p>{openProject.challenge}</p>
                </section>
                <section>
                  <h3>THE APPROACH</h3>
                  <p>{openProject.solution}</p>
                </section>
              </div>

              {openProject.implementationNote ? (
                <p className="project-orbit-scope-note">{openProject.implementationNote}</p>
              ) : null}

              {openProject.highlights?.length ? (
                <div className="project-orbit-highlights">
                  <h3>ENGINEERING HIGHLIGHTS</h3>
                  <ul>
                    {openProject.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                  </ul>
                </div>
              ) : null}

              <div className="project-orbit-tech-section">
                <h3>BUILT WITH</h3>
                <div className="project-orbit-tech-list">
                  {technologies.map((technology) => <span key={technology}>{technology}</span>)}
                </div>
              </div>

              <div className="project-orbit-actions">
                {openProject.liveUrl ? (
                  <a className="project-orbit-primary-action" href={openProject.liveUrl} target="_blank" rel="noopener noreferrer">
                    Visit live app <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
                {sourceUrl ? (
                  <a className="project-orbit-secondary-action" href={sourceUrl} target="_blank" rel="noopener noreferrer">
                    Source code <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
              </div>
            </div>
          </section>
        </div>,
        document.body
      ) : null}
    </div>
  );
}

export default ProjectOrbitShowcase;
