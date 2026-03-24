function dedupe(items) {
  return [...new Set(items)];
}

export function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

export function findParentIds(tree, nodeId) {
  const parentIds = [];

  for (const [parentId, childIds] of Object.entries(tree.nodes)) {
    if (childIds.includes(nodeId)) {
      parentIds.push(parentId);
    }
  }

  return parentIds;
}

export function getDescendantIds(tree, nodeId, seen = new Set()) {
  const childIds = tree.nodes[nodeId] ?? [];

  for (const childId of childIds) {
    if (seen.has(childId)) {
      continue;
    }

    seen.add(childId);
    getDescendantIds(tree, childId, seen);
  }

  return seen;
}

export function addSkillToData(data, skillId, parentId, skillRecord) {
  const nextData = cloneData(data);
  nextData.skills[skillId] = skillRecord;

  if (!nextData.tree.nodes[parentId]) {
    nextData.tree.nodes[parentId] = [];
  }

  nextData.tree.nodes[parentId] = dedupe([...nextData.tree.nodes[parentId], skillId]);

  if (!nextData.tree.nodes[skillId]) {
    nextData.tree.nodes[skillId] = [];
  }

  return nextData;
}

export function updateSkillInData(data, skillId, updater) {
  const nextData = cloneData(data);
  nextData.skills[skillId] = updater(nextData.skills[skillId]);
  return nextData;
}

export function reparentNode(data, nodeId, nextParentId) {
  const nextData = cloneData(data);
  const descendants = getDescendantIds(nextData.tree, nodeId);

  if (nodeId === nextParentId || descendants.has(nextParentId)) {
    return nextData;
  }

  for (const [parentId, childIds] of Object.entries(nextData.tree.nodes)) {
    nextData.tree.nodes[parentId] = childIds.filter((childId) => childId !== nodeId);
  }

  if (!nextData.tree.nodes[nextParentId]) {
    nextData.tree.nodes[nextParentId] = [];
  }

  nextData.tree.nodes[nextParentId] = dedupe([...nextData.tree.nodes[nextParentId], nodeId]);
  return nextData;
}

export function moveNodeInParent(data, nodeId, direction) {
  const nextData = cloneData(data);
  const [parentId] = findParentIds(nextData.tree, nodeId);

  if (!parentId) {
    return nextData;
  }

  const siblings = [...nextData.tree.nodes[parentId]];
  const currentIndex = siblings.indexOf(nodeId);
  const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (currentIndex === -1 || swapIndex < 0 || swapIndex >= siblings.length) {
    return nextData;
  }

  [siblings[currentIndex], siblings[swapIndex]] = [siblings[swapIndex], siblings[currentIndex]];
  nextData.tree.nodes[parentId] = siblings;
  return nextData;
}

export function deleteSkillFromData(data, nodeId) {
  const nextData = cloneData(data);
  const childIds = nextData.tree.nodes[nodeId] ?? [];

  for (const [parentId, childIdsForParent] of Object.entries(nextData.tree.nodes)) {
    if (!childIdsForParent.includes(nodeId)) {
      continue;
    }

    const replacement = [];

    for (const childId of childIdsForParent) {
      if (childId === nodeId) {
        replacement.push(...childIds);
      } else {
        replacement.push(childId);
      }
    }

    nextData.tree.nodes[parentId] = dedupe(replacement);
  }

  delete nextData.tree.nodes[nodeId];
  delete nextData.skills[nodeId];
  return nextData;
}
