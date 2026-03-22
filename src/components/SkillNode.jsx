import { getLevelMeta, getStatusMeta } from "../utils/presentation.js";

function getNodeLabel(nodeId, skills, labels) {
  if (skills[nodeId]) {
    return skills[nodeId].name;
  }

  return labels?.[nodeId] ?? nodeId;
}

function hasVisibleDescendant(nodeId, nodes, visibleSkillIds) {
  const childIds = nodes[nodeId] ?? [];

  for (const childId of childIds) {
    if (visibleSkillIds.has(childId) || hasVisibleDescendant(childId, nodes, visibleSkillIds)) {
      return true;
    }
  }

  return false;
}

export default function SkillNode({
  expandedNodes,
  labels,
  nodeId,
  nodes,
  onSelect,
  onToggle,
  selectedNodeId,
  skills,
  visibleSkillIds,
}) {
  const skill = skills[nodeId] ?? null;
  const childIds = nodes[nodeId] ?? [];
  const visibleChildren = childIds.filter(
    (childId) => visibleSkillIds.has(childId) || hasVisibleDescendant(childId, nodes, visibleSkillIds),
  );
  const isExpanded = expandedNodes.includes(nodeId);
  const isSelected = selectedNodeId === nodeId;
  const isFuture = skill?.status === "future";
  const isVisibleNode = skill ? visibleSkillIds.has(nodeId) : visibleChildren.length > 0;
  const levelMeta = skill ? getLevelMeta(skill.level) : null;
  const statusMeta = skill ? getStatusMeta(skill.status) : null;

  if (!isVisibleNode) {
    return null;
  }

  return (
    <li className="tree-node">
      <div
        className={[
          "tree-node-row",
          isSelected ? "is-selected" : "",
          isFuture ? "is-future" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {childIds.length > 0 ? (
          <button
            aria-label={isExpanded ? `Collapse ${nodeId}` : `Expand ${nodeId}`}
            className="tree-toggle"
            type="button"
            onClick={() => onToggle(nodeId)}
          >
            {isExpanded ? "−" : "+"}
          </button>
        ) : (
          <span className="tree-toggle-spacer" />
        )}

        <button
          className="tree-label"
          type="button"
          onClick={() => {
            if (skill) {
              onSelect(nodeId);
            } else if (childIds.length > 0) {
              onToggle(nodeId);
            }
          }}
        >
          <span>{getNodeLabel(nodeId, skills, labels)}</span>
          {skill ? (
            <span className="tree-badge-group">
              <span className={`tree-badge ${levelMeta.className}`}>
                {levelMeta.label}
              </span>
              <span className={`tree-badge status-badge ${statusMeta.className}`}>
                {statusMeta.label}
              </span>
            </span>
          ) : (
            <span className="tree-group-label">group</span>
          )}
        </button>
      </div>

      {childIds.length > 0 && isExpanded ? (
        <ul className="tree-children">
          {visibleChildren.map((childId) => (
            <SkillNode
              expandedNodes={expandedNodes}
              key={childId}
              labels={labels}
              nodeId={childId}
              nodes={nodes}
              onSelect={onSelect}
              onToggle={onToggle}
              selectedNodeId={selectedNodeId}
              skills={skills}
              visibleSkillIds={visibleSkillIds}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
