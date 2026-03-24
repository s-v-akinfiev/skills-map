import { STATUS_META } from "../utils/presentation.js";

function listValueToText(value) {
  return value.join(", ");
}

export default function EditPanel({
  hasLocalDraft,
  currentParentId,
  onClearDraft,
  onAddSkill,
  onDeleteSkill,
  onExportSkills,
  onExportTree,
  onFieldChange,
  onMoveNode,
  onParentChange,
  parentOptions,
  selectedNodeId,
  selectedSkill,
}) {
  return (
    <section className="panel editor-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">Local edit mode</p>
          <h2>Editor</h2>
        </div>
        <p className="muted-text">
          {hasLocalDraft ? "Draft restored from localStorage." : "Local-only controls are enabled."}
        </p>
      </div>

      <div className="editor-grid">
        <section className="editor-card">
          <h3>Add skill</h3>
          <p className="muted-text">
            Creates a new skill record under the selected node or the first root
            category if nothing is selected.
          </p>

          <div className="editor-actions">
            <button className="accent-button" type="button" onClick={onAddSkill}>
              Add skill
            </button>
            <button className="ghost-button" type="button" onClick={onExportSkills}>
              Export skills.json
            </button>
            <button className="ghost-button" type="button" onClick={onExportTree}>
              Export tree.json
            </button>
          </div>

          <p className="muted-text">
            Exported files are formatted for manual review and commit.
          </p>

          <button className="ghost-button" type="button" onClick={onClearDraft}>
            Clear local draft
          </button>
        </section>

        <section className="editor-card">
          <h3>Edit selected skill</h3>
          {!selectedNodeId || !selectedSkill ? (
            <p className="muted-text">
              Select a skill node to edit its fields and tree position.
            </p>
          ) : (
            <div className="editor-form">
              <label className="field">
                <span>Name</span>
                <input
                  type="text"
                  value={selectedSkill.name}
                  onChange={(event) => onFieldChange("name", event.target.value)}
                />
              </label>

              <label className="field">
                <span>Icon</span>
                <input
                  type="text"
                  value={selectedSkill.icon}
                  onChange={(event) => onFieldChange("icon", event.target.value)}
                />
              </label>

              <label className="field">
                <span>Status</span>
                <select
                  value={selectedSkill.status}
                  onChange={(event) => onFieldChange("status", event.target.value)}
                >
                  {Object.entries(STATUS_META).map(([status, meta]) => (
                    <option key={status} value={status}>
                      {meta.label}
                    </option>
                  ))}
                </select>
              </label>

              {selectedSkill.status !== "PLANNED" ? (
                <label className="field">
                  <span>Years</span>
                  <input
                    type="number"
                    min="0"
                    value={selectedSkill.years ?? 0}
                    onChange={(event) => onFieldChange("years", Number(event.target.value))}
                  />
                </label>
              ) : null}

              <label className="field field-full">
                <span>Summary</span>
                <input
                  type="text"
                  value={selectedSkill.summary}
                  onChange={(event) => onFieldChange("summary", event.target.value)}
                />
              </label>

              <label className="field field-full">
                <span>Highlights (comma-separated)</span>
                <textarea
                  rows="3"
                  value={listValueToText(selectedSkill.highlights)}
                  onChange={(event) => onFieldChange("highlights", event.target.value)}
                />
              </label>

              <label className="field">
                <span>Parent node</span>
                <select
                  value={currentParentId ?? ""}
                  onChange={(event) => onParentChange(event.target.value)}
                >
                  {parentOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="editor-actions">
                <button className="ghost-button" type="button" onClick={() => onMoveNode("up")}>
                  Move up
                </button>
                <button className="ghost-button" type="button" onClick={() => onMoveNode("down")}>
                  Move down
                </button>
                <button className="danger-button" type="button" onClick={onDeleteSkill}>
                  Delete skill
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
