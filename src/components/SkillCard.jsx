import { getStatusMeta } from "../utils/presentation.js";

export default function SkillCard({ selectedNodeId, skill }) {
  if (!selectedNodeId || !skill) {
    return (
      <div className="empty-state-inline">
        <h3>No skill selected</h3>
        <p>Select a skill from the tree to view its details.</p>
      </div>
    );
  }

  const statusMeta = getStatusMeta(skill.status);

  return (
    <article className={`skill-card ${skill.status === "PLANNED" ? "is-future" : ""}`}>
      <section className="skill-card-block">
        <h4>Summary</h4>
        <p className="detail-copy">{skill.summary}</p>
      </section>

      <section className="skill-card-block">
        <h4>Highlights</h4>
        <ul>
          {skill.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="skill-card-block">
        <h4>Status</h4>
        <p className="detail-copy">
          {statusMeta.description || "No additional status description."}
        </p>
      </section>

    </article>
  );
}
