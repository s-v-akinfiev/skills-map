const VALID_STATUSES = new Set([
  "STRONG",
  "CONFIDENT",
  "BASIC",
  "LEARNING",
  "PLANNED",
]);

function isObjectRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pushError(errors, message) {
  errors.push(message);
}

function validateSkillRecord(skillId, skill, errors) {
  if (!isObjectRecord(skill)) {
    pushError(errors, `Skill "${skillId}" must be an object record.`);
    return;
  }

  const requiredFields = [
    "name",
    "icon",
    "status",
    "summary",
    "highlights",
  ];

  for (const field of requiredFields) {
    if (!(field in skill)) {
      pushError(errors, `Skill "${skillId}" is missing required field "${field}".`);
    }
  }

  if (typeof skill.status !== "string" || !VALID_STATUSES.has(skill.status)) {
    pushError(
      errors,
      `Skill "${skillId}" has invalid status "${String(skill.status)}".`,
    );
  }

  if (skill.status === "PLANNED" && "years" in skill) {
    pushError(errors, `Skill "${skillId}" must not define "years" for planned status.`);
  }

  if (skill.status !== "PLANNED" && typeof skill.years !== "number") {
    pushError(
      errors,
      `Skill "${skillId}" must define numeric "years" for status "${skill.status}".`,
    );
  }

  if ("highlights" in skill && !Array.isArray(skill.highlights)) {
    pushError(errors, `Skill "${skillId}" field "highlights" must be an array.`);
  }
}

function validateTreeNodeList(nodeId, childIds, errors) {
  if (!Array.isArray(childIds)) {
    pushError(errors, `Tree node "${nodeId}" must map to an array of child IDs.`);
    return;
  }

  const seen = new Set();
  for (const childId of childIds) {
    if (typeof childId !== "string") {
      pushError(errors, `Tree node "${nodeId}" contains a non-string child ID.`);
      continue;
    }

    if (seen.has(childId)) {
      pushError(errors, `Tree node "${nodeId}" contains duplicate child "${childId}".`);
      continue;
    }

    seen.add(childId);
  }
}

function detectCycles(tree, errors) {
  const nodes = isObjectRecord(tree.nodes) ? tree.nodes : {};
  const visiting = new Set();
  const visited = new Set();

  function visit(nodeId, path) {
    if (visiting.has(nodeId)) {
      const cyclePath = [...path, nodeId].join(" -> ");
      pushError(errors, `Tree contains a cycle: ${cyclePath}.`);
      return;
    }

    if (visited.has(nodeId)) {
      return;
    }

    visiting.add(nodeId);
    const children = Array.isArray(nodes[nodeId]) ? nodes[nodeId] : [];

    for (const childId of children) {
      if (nodes[childId]) {
        visit(childId, [...path, nodeId]);
      }
    }

    visiting.delete(nodeId);
    visited.add(nodeId);
  }

  for (const rootId of Array.isArray(tree.roots) ? tree.roots : []) {
    visit(rootId, []);
  }
}

export function validateData(skills, tree) {
  const errors = [];

  if (!isObjectRecord(skills)) {
    pushError(errors, "skills.json must export an object keyed by skill IDs.");
    return { errors, isValid: false };
  }

  if (!isObjectRecord(tree)) {
    pushError(errors, "tree.json must export an object.");
    return { errors, isValid: false };
  }

  if (!Array.isArray(tree.roots)) {
    pushError(errors, 'tree.json field "roots" must be an array.');
  }

  if (!isObjectRecord(tree.nodes)) {
    pushError(errors, 'tree.json field "nodes" must be an object.');
  }

  for (const [skillId, skill] of Object.entries(skills)) {
    validateSkillRecord(skillId, skill, errors);
  }

  const nodeMap = isObjectRecord(tree.nodes) ? tree.nodes : {};

  for (const [nodeId, childIds] of Object.entries(nodeMap)) {
    validateTreeNodeList(nodeId, childIds, errors);
  }

  for (const rootId of Array.isArray(tree.roots) ? tree.roots : []) {
    if (!(rootId in nodeMap)) {
      pushError(errors, `Root "${rootId}" is missing from tree node map.`);
    }
  }

  for (const [nodeId, childIds] of Object.entries(nodeMap)) {
    if (!Array.isArray(childIds)) {
      continue;
    }

    for (const childId of childIds) {
      const childExistsAsSkill = childId in skills;
      const childExistsAsTreeNode = childId in nodeMap;

      if (!childExistsAsSkill && !childExistsAsTreeNode) {
        pushError(
          errors,
          `Tree reference "${nodeId}" -> "${childId}" points to a missing skill/node.`,
        );
      }
    }
  }

  detectCycles(tree, errors);

  return {
    errors,
    isValid: errors.length === 0,
  };
}

export function logValidationResults(result) {
  if (import.meta.env.PROD || result.isValid) {
    return;
  }

  console.group("Skills data validation errors");
  for (const error of result.errors) {
    console.error(`- ${error}`);
  }
  console.groupEnd();
}
