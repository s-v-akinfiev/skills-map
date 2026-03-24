import { useEffect, useRef, useState } from "react";
import SkillCard from "./components/SkillCard.jsx";
import SkillMap from "./components/SkillMap.jsx";
import skills from "./data/skills.json";
import tree from "./data/tree.json";
import EditPanel from "./editor/EditPanel.jsx";
import { EDIT_MODE } from "./config.js";
import { exportJsonFile } from "./utils/exportJson.js";
import { clearLocalDraft, loadLocalDraft, saveLocalDraft } from "./utils/localDraft.js";
import { getLevelMeta, getStatusMeta, LEVEL_META } from "./utils/presentation.js";
import { getSkillLogo } from "./utils/skillLogos.js";
import {
  addSkillToData,
  cloneData,
  deleteSkillFromData,
  findParentIds,
  getDescendantIds,
  moveNodeInParent,
  reparentNode,
  updateSkillInData,
} from "./utils/treeEditing.js";
import { logValidationResults, validateData } from "./utils/validation.js";

function normalizeListInput(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildNewSkillId(existingIds) {
  let index = 1;

  while (existingIds.includes(`skill-${index}`)) {
    index += 1;
  }

  return `skill-${index}`;
}

export default function App() {
  const [data, setData] = useState(null);
  const [bootError, setBootError] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState("");
  const [hasLocalDraft, setHasLocalDraft] = useState(false);
  const hasInitializedDraftPersistence = useRef(false);
  const detailsShellRef = useRef(null);
  const [filters, setFilters] = useState({
    category: "all",
    level: "all",
    strongOnly: false,
    futureOnly: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [detailsObstructionRect, setDetailsObstructionRect] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    try {
      const initialData = cloneData({
        skills,
        tree,
      });
      const draftData = EDIT_MODE ? loadLocalDraft() : null;
      const nextData = draftData ?? initialData;

      setData(nextData);
      setExpandedNodes(nextData.tree.roots);
      setHasLocalDraft(Boolean(draftData));
      setBootError("");
    } catch (error) {
      setBootError(
        error instanceof Error
          ? error.message
          : "Failed to load the local dataset.",
      );
    }
  }, []);

  useEffect(() => {
    if (!EDIT_MODE || !data) {
      return;
    }

    if (!hasInitializedDraftPersistence.current) {
      hasInitializedDraftPersistence.current = true;
      return;
    }

    saveLocalDraft(data);
    setHasLocalDraft(true);
  }, [data]);

  const validation = data ? validateData(data.skills, data.tree) : { errors: [], isValid: true };

  useEffect(() => {
    logValidationResults(validation);
  }, [data]);

  const skillEntries = data ? Object.entries(data.skills) : [];
  const categoryOptions = data
    ? data.tree.roots.map((rootId) => ({
        id: rootId,
        label: data.tree.labels?.[rootId] ?? rootId,
      }))
    : [];
  const visibleSkills = skillEntries.filter(([skillId, skill]) => {
    const matchesCategory =
      filters.category === "all" ||
      data.tree.nodes[filters.category]?.includes(skillId);
    const matchesLevel = filters.level === "all" || skill.level === filters.level;
    const matchesStrong = !filters.strongOnly || skill.level === "STRONG";
    const matchesFuture = !filters.futureOnly || skill.status === "future";
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchesSearch =
      normalizedQuery.length === 0 ||
      skill.name.toLowerCase().includes(normalizedQuery);

    return (
      matchesCategory &&
      matchesLevel &&
      matchesStrong &&
      matchesFuture &&
      matchesSearch
    );
  });

  const selectedSkill =
    data && selectedNodeId && data.skills[selectedNodeId]
      ? data.skills[selectedNodeId]
      : null;
  const selectedSkillLevelMeta = selectedSkill ? getLevelMeta(selectedSkill.level) : null;
  const selectedSkillStatusMeta = selectedSkill ? getStatusMeta(selectedSkill.status) : null;
  const selectedSkillLogo = selectedSkill ? getSkillLogo(selectedSkill.icon) : null;

  useEffect(() => {
    if (!selectedSkill || !detailsShellRef.current) {
      setDetailsObstructionRect(null);
      return;
    }

    const detailsElement = detailsShellRef.current;
    let frameId = 0;

    function updateObstructionRect() {
      const rect = detailsElement.getBoundingClientRect();

      setDetailsObstructionRect({
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        top: rect.top,
      });
    }

    updateObstructionRect();
    frameId = window.requestAnimationFrame(updateObstructionRect);
    window.addEventListener("resize", updateObstructionRect);

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            updateObstructionRect();
          });

    resizeObserver?.observe(detailsElement);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updateObstructionRect);
      resizeObserver?.disconnect();
    };
  }, [selectedSkill]);

  const visibleSkillIds = new Set(visibleSkills.map(([skillId]) => skillId));
  const currentParentId =
    data && selectedNodeId ? findParentIds(data.tree, selectedNodeId)[0] ?? "" : "";
  const parentOptions =
    data && selectedNodeId
      ? [
          ...data.tree.roots.map((rootId) => ({
            id: rootId,
            label: data.tree.labels?.[rootId] ?? rootId,
          })),
          ...Object.entries(data.skills)
            .filter(([skillId]) => {
              const descendants = getDescendantIds(data.tree, selectedNodeId);
              return skillId !== selectedNodeId && !descendants.has(skillId);
            })
            .map(([skillId, skill]) => ({
              id: skillId,
              label: skill.name,
            })),
        ]
      : [];

  useEffect(() => {
    if (!data) {
      return;
    }

    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return;
    }

    const nextExpanded = new Set(data.tree.roots);

    function expandMatchingAncestors(nodeId) {
      const childIds = data.tree.nodes[nodeId] ?? [];
      let shouldExpand = false;

      for (const childId of childIds) {
        const childSkill = data.skills[childId];
        const childMatches =
          Boolean(childSkill) &&
          visibleSkillIds.has(childId) &&
          childSkill.name.toLowerCase().includes(normalizedQuery);
        const descendantMatches = expandMatchingAncestors(childId);

        if (childMatches || descendantMatches) {
          nextExpanded.add(nodeId);
          shouldExpand = true;
        }
      }

      return shouldExpand;
    }

    for (const rootId of data.tree.roots) {
      expandMatchingAncestors(rootId);
    }

    setExpandedNodes((current) => Array.from(new Set([...current, ...nextExpanded])));
  }, [data, searchQuery, visibleSkillIds]);

  useEffect(() => {
    if (selectedNodeId && !visibleSkills.some(([skillId]) => skillId === selectedNodeId)) {
      setSelectedNodeId(null);
    }
  }, [selectedNodeId, visibleSkills]);

  useEffect(() => {
    setSelectedParentId(currentParentId);
  }, [currentParentId]);

  function updateFilter(key, value) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetFilters() {
    setFilters({
      category: "all",
      level: "all",
      strongOnly: false,
      futureOnly: false,
    });
    setSearchQuery("");
  }

  function toggleNode(nodeId) {
    setExpandedNodes((current) =>
      current.includes(nodeId)
        ? current.filter((entry) => entry !== nodeId)
        : [...current, nodeId],
    );
  }

  function updateSelectedSkillField(field, value) {
    if (!selectedNodeId || !data?.skills[selectedNodeId]) {
      return;
    }

    setData((current) =>
      updateSkillInData(current, selectedNodeId, (skill) => {
        const nextSkill = { ...skill };

        if (field === "highlights") {
          nextSkill[field] = normalizeListInput(value);
          return nextSkill;
        }

        if (field === "status") {
          nextSkill.status = value;

          if (value === "future") {
            delete nextSkill.years;
          } else if (typeof nextSkill.years !== "number") {
            nextSkill.years = 0;
          }

          return nextSkill;
        }

        nextSkill[field] = value;
        return nextSkill;
      }),
    );
  }

  function handleAddSkill() {
    if (!data) {
      return;
    }

    const parentId = selectedNodeId || data.tree.roots[0];
    const newSkillId = buildNewSkillId(Object.keys(data.skills));
    const nextData = addSkillToData(data, newSkillId, parentId, {
      name: "New Skill",
      icon: "spark",
      level: "BASIC",
      status: "learning",
      years: 0,
      summary: "Short summary",
      highlights: ["First highlight"],
    });

    setData(nextData);
    setExpandedNodes((current) => Array.from(new Set([...current, parentId])));
    setSelectedNodeId(newSkillId);
  }

  function handleDeleteSkill() {
    if (!selectedNodeId || !data?.skills[selectedNodeId]) {
      return;
    }

    if (!window.confirm(`Delete "${data.skills[selectedNodeId].name}" from local edit mode?`)) {
      return;
    }

    setData((current) => deleteSkillFromData(current, selectedNodeId));
    setSelectedNodeId(null);
  }

  function handleParentChange(nextParentId) {
    setSelectedParentId(nextParentId);

    if (!selectedNodeId || !nextParentId) {
      return;
    }

    setData((current) => reparentNode(current, selectedNodeId, nextParentId));
    setExpandedNodes((current) => Array.from(new Set([...current, nextParentId])));
  }

  function handleMoveNode(direction) {
    if (!selectedNodeId) {
      return;
    }

    setData((current) => moveNodeInParent(current, selectedNodeId, direction));
  }

  function handleExportSkills() {
    if (!EDIT_MODE || !data) {
      return;
    }

    exportJsonFile("skills.json", data.skills);
  }

  function handleExportTree() {
    if (!EDIT_MODE || !data) {
      return;
    }

    exportJsonFile("tree.json", data.tree);
  }

  function handleClearDraft() {
    clearLocalDraft();
    try {
      const initialData = cloneData({
        skills,
        tree,
      });

      setData(initialData);
      setExpandedNodes(initialData.tree.roots);
      setSelectedNodeId(null);
      setHasLocalDraft(false);
      setBootError("");
    } catch (error) {
      setBootError(
        error instanceof Error
          ? error.message
          : "Failed to restore the source dataset.",
      );
    }
  }

  return (
    <div className="app-shell">
      {data ? (
        <section className="map-shell map-shell-background">
          <div className="map-canvas">
            <SkillMap
              expandedNodes={expandedNodes}
              labels={data.tree.labels}
              nodes={data.tree.nodes}
              obstructionRect={detailsObstructionRect}
              onSelect={setSelectedNodeId}
              onToggle={toggleNode}
              roots={data.tree.roots}
              selectedNodeId={selectedNodeId}
              skills={data.skills}
              visibleSkillIds={visibleSkillIds}
            />
          </div>
        </section>
      ) : null}

      <div className="app-overlay">
        <header className="app-header">
          <p className="eyebrow">Serge Akinfiev | Skills Map</p>
        </header>

        <div className="toolbar-dock">
          {isFilterOpen ? (
            <section className="toolbar panel">
              <div className="toolbar-group">
                <label className="field">
                  <span>Category</span>
                  <select
                    value={filters.category}
                    onChange={(event) => updateFilter("category", event.target.value)}
                  >
                    <option value="all">All categories</option>
                    {categoryOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>Level</span>
                  <select
                    value={filters.level}
                    onChange={(event) => updateFilter("level", event.target.value)}
                  >
                    <option value="all">All levels</option>
                    {Object.entries(LEVEL_META).map(([level, meta]) => (
                      <option key={level} value={level}>
                        {meta.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field field-search">
                  <span>Search</span>
                  <input
                    type="search"
                    value={searchQuery}
                    placeholder="Search by name"
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </label>
              </div>

              <div className="toolbar-group toolbar-group-actions">
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={filters.strongOnly}
                    onChange={(event) => updateFilter("strongOnly", event.target.checked)}
                  />
                  <span>Strong only</span>
                </label>

                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={filters.futureOnly}
                    onChange={(event) => updateFilter("futureOnly", event.target.checked)}
                  />
                  <span>Future only</span>
                </label>

                <button className="ghost-button" type="button" onClick={resetFilters}>
                  Reset
                </button>
              </div>
            </section>
          ) : null}

          <button
            aria-expanded={isFilterOpen}
            className="ghost-button filter-toggle"
            type="button"
            onClick={() => setIsFilterOpen((current) => !current)}
          >
            Filter
          </button>
        </div>

        {bootError ? (
          <section className="panel error-state overlay-banner" role="alert">
            <h2>Unable to load data</h2>
            <p>{bootError}</p>
            <p>
              Check the source JSON files or clear any invalid local draft data in
              edit mode.
            </p>
          </section>
        ) : !data ? (
          <section className="panel empty-state overlay-banner">
            <h2>Loading data</h2>
            <p>The skills dataset is being loaded into the app state.</p>
          </section>
        ) : (
          <>
            {EDIT_MODE && hasLocalDraft ? (
              <section className="panel draft-banner overlay-banner">
                <h2>Local draft active</h2>
                <p>
                  The current session is using a locally persisted draft instead of the
                  source JSON files. Clear the draft to return to the repository data.
                </p>
              </section>
            ) : null}

            {!validation.isValid ? (
              <section className="panel validation-panel overlay-banner">
                <h2>Data validation</h2>
                <p>The current JSON data is invalid and should be fixed before feature work continues.</p>
                <ul>
                  {validation.errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {visibleSkills.length === 0 ? (
              <section className="panel empty-state overlay-banner">
                <h2>No matching skills</h2>
                <p>The current filters and search query hide all loaded skills.</p>
              </section>
            ) : null}

            <main className="app-layout">
              {selectedSkill ? (
                <aside className="details-shell" ref={detailsShellRef}>
                  <section className="panel details-panel">
                    <div className="panel-heading">
                      <div>
                        <p className="section-kicker">Skill Details</p>
                        <h2 className="details-title">
                          {selectedSkillLogo ? (
                            <img
                              alt={`${selectedSkill.name} logo`}
                              className="skill-logo skill-logo-title"
                              src={selectedSkillLogo}
                            />
                          ) : null}
                          <span>{selectedSkill.name}</span>
                        </h2>
                        <div className="badge-stack details-badge-stack">
                          <span className={`level-pill ${selectedSkillLevelMeta.className}`}>
                            {selectedSkillLevelMeta.label}
                          </span>
                          <span className={`level-pill status-pill ${selectedSkillStatusMeta.className}`}>
                            {selectedSkillStatusMeta.label}
                          </span>
                        </div>
                      </div>
                      <div className="details-actions">
                        <button
                          className="ghost-button details-close"
                          type="button"
                          onClick={() => setSelectedNodeId(null)}
                        >
                          Close
                        </button>
                      </div>
                    </div>

                    <SkillCard
                      selectedNodeId={selectedNodeId}
                      skill={selectedSkill}
                    />
                  </section>
                </aside>
              ) : null}
            </main>

            {EDIT_MODE ? (
              <EditPanel
                hasLocalDraft={hasLocalDraft}
                currentParentId={selectedParentId}
                onClearDraft={handleClearDraft}
                onAddSkill={handleAddSkill}
                onDeleteSkill={handleDeleteSkill}
                onExportSkills={handleExportSkills}
                onExportTree={handleExportTree}
                onFieldChange={updateSelectedSkillField}
                onMoveNode={handleMoveNode}
                onParentChange={handleParentChange}
                parentOptions={parentOptions}
                selectedNodeId={selectedNodeId}
                selectedSkill={selectedSkill}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
