import React, { useState } from "react";
import "./ProjectOrbitShowcase.css";

const PROJECT_ORDER = ["clansure", "sattam-ai", "srk-erp", "gt-companion"];

const PROJECT_ACCENTS = {
  clansure: "#70dfa1",
  "sattam-ai": "#b7a2ff",
  "srk-erp": "#f0c36b",
  "gt-companion": "#76d9eb",
};

const PROJECT_MARKS = {
  clansure: "C",
  "sattam-ai": "SA",
  "srk-erp": "SRK",
  "gt-companion": "GT",
};

const ORBIT_DURATIONS = [31, 39, 47, 57];

export function ProjectOrbitShowcase({ projects = [] }) {
  const orderedProjects = PROJECT_ORDER
    .map((id) => projects.find((project) => project.id === id))
    .filter(Boolean);

  const [activeProjectId, setActiveProjectId] = useState("clansure");
  const activeIndex = Math.max(0, orderedProjects.findIndex((project) => project.id === activeProjectId));
  const activeProject = orderedProjects[activeIndex] || orderedProjects[0];

  if (!activeProject) return null;

  const accent = PROJECT_ACCENTS[activeProject.id] || "#70dfa1";
  const sourceUrl = activeProject.githubUrl || activeProject.sourceUrl;
  const technologies = (activeProject.technologies || []).slice(0, 6);

  return (
    <div className="project-orbit-showcase" style={{ "--active-project-accent": accent }}>
      <div className="project-orbit-visual-column">
        <div className="project-orbit-heading">
          <span className="project-orbit-eyebrow">PROJECT ORBIT</span>
          <span className="project-orbit-live"><i aria-hidden="true" /> INTERACTIVE SHOWCASE</span>
        </div>

        <div className="project-orbit-stage" role="group" aria-label="Choose a project orbit">
          <div className="project-orbit-nebula" aria-hidden="true" />
          <div className="project-orbit-core" aria-hidden="true">
            <span className="project-orbit-core-halo" />
            <span className="project-orbit-core-mark">PS</span>
            <span className="project-orbit-core-rule" />
            <span className="project-orbit-core-label">PROJECT CORE</span>
          </div>

          {orderedProjects.map((project, index) => {
            const projectAccent = PROJECT_ACCENTS[project.id] || "#70dfa1";
            const selected = activeProject.id === project.id;
            const direction = index % 2 === 0 ? "normal" : "reverse";
            const counterDirection = direction === "normal" ? "reverse" : "normal";

            return (
              <div
                key={project.id}
                className={`project-orbit-track project-orbit-track--${index + 1}`}
                aria-hidden="false"
                style={{
                  "--orbit-duration": `${ORBIT_DURATIONS[index] || 45}s`,
                  "--orbit-accent": projectAccent,
                  "--orbit-direction": direction,
                  "--orbit-counter-direction": counterDirection,
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
                  <span className="project-orbit-node-mark" aria-hidden="true">{PROJECT_MARKS[project.id] || project.title.slice(0, 2)}</span>
                  <span className="project-orbit-node-name">{project.title}</span>
                </button>
              </div>
            );
          })}
        </div>

        <p className="project-orbit-instruction">
          <span className="project-orbit-instruction-dot" aria-hidden="true" />
          SELECT A PLANET TO EXPLORE
        </p>
        <div className="project-orbit-project-index" aria-label="Project selection">
          {orderedProjects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              className={`project-orbit-index-item${activeProject.id === project.id ? " is-active" : ""}`}
              onClick={() => setActiveProjectId(project.id)}
              aria-pressed={activeProject.id === project.id}
              style={{ "--node-accent": PROJECT_ACCENTS[project.id] || "#70dfa1" }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {project.title}
            </button>
          ))}
        </div>
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
          <h4>BUILT WITH</h4>
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
