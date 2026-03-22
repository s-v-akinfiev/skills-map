import { getLevelMeta, getStatusMeta } from "../utils/presentation.js";

function formatRelatedSkills(relatedSkills, skills) {
  return relatedSkills
    .map((skillId) => skills[skillId]?.name)
    .filter(Boolean)
    .join(", ");
}

export default function SkillCard({ selectedNodeId, skill, skills }) {
  if (!selectedNodeId || !skill) {
    return (
      <div className="empty-state-inline">
        <h3>No skill selected</h3>
        <p>Select a skill from the tree to view its details.</p>
      </div>
    );
  }

  const levelMeta = getLevelMeta(skill.level);
  const statusMeta = getStatusMeta(skill.status);

  return (
    <article className={`skill-card ${skill.status === "future" ? "is-future" : ""}`}>
      <header className="skill-card-header">
        <div>
          <p className="section-kicker">Skill details</p>
          <h3>{skill.name}</h3>
          <p className="detail-meta">
            Icon: {skill.icon}
            {typeof skill.years === "number" ? ` · ${skill.years} years` : ""}
          </p>
        </div>
        <div className="badge-stack">
          <span className={`level-pill ${levelMeta.className}`}>{levelMeta.label}</span>
          <span className={`level-pill status-pill ${statusMeta.className}`}>
            {statusMeta.label}
          </span>
        </div>
      </header>

      <section className="skill-card-block">
        <h4>Summary</h4>
        <p>{skill.summary}</p>
      </section>

      <section className="skill-card-block">
        <h4>Description</h4>
        <p className="detail-copy">{skill.details}</p>
      </section>

      <section className="skill-card-block">
        <h4>Highlights</h4>
        <ul>
          {skill.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="skill-card-grid">
        <div className="skill-card-block">
          <h4>Tags</h4>
          <div className="chip-row">
            {skill.tags.map((tag) => (
              <span className="chip" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="skill-card-block">
          <h4>Related skills</h4>
          <p className="detail-copy">
            {formatRelatedSkills(skill.relatedSkills, skills) || "None"}
          </p>
        </div>
      </section>

      <section className="skill-card-block">
        <h4>Status</h4>
        <p className="detail-copy">
          {statusMeta.description || "No additional status description."}
        </p>
      </section>

      {skill.status === "future" ? (
        <section className="skill-card-grid">
          <div className="skill-card-block">
            <h4>Target</h4>
            <p className="detail-copy">{skill.targetDescription ?? "Not specified."}</p>
          </div>

          <div className="skill-card-block">
            <h4>Motivation</h4>
            <p className="detail-copy">{skill.motivation ?? "Not specified."}</p>
          </div>
        </section>
      ) : null}
    </article>
  );
}
