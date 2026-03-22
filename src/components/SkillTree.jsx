import SkillNode from "./SkillNode.jsx";

export default function SkillTree({
  expandedNodes,
  labels,
  nodes,
  onSelect,
  onToggle,
  roots,
  selectedNodeId,
  skills,
  visibleSkillIds,
}) {
  return (
    <ul className="tree-root">
      {roots.map((rootId) => (
        <SkillNode
          expandedNodes={expandedNodes}
          key={rootId}
          labels={labels}
          nodeId={rootId}
          nodes={nodes}
          onSelect={onSelect}
          onToggle={onToggle}
          selectedNodeId={selectedNodeId}
          skills={skills}
          visibleSkillIds={visibleSkillIds}
        />
      ))}
    </ul>
  );
}

