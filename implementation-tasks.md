# Implementation Tasks

This file breaks down the PRD in [prd.md](/home/akinfiev/misc/apps/skills-map/prd.md) into small implementation tasks. It is intended as a delivery backlog, not as implementation output.

## 1. Project Setup

- [ ] Initialize a React + Vite project structure for a static GitHub Pages deployment.
- [ ] Add a basic folder layout matching the PRD (`components`, `editor`, `data`, `utils`).
- [ ] Configure the app base path for GitHub Pages deployment.
- [ ] Add a single source of truth for `VITE_EDIT_MODE`.
- [ ] Add a basic README section describing local run, build, and deploy flow.

## 2. Data Files

- [ ] Create `skills.json` with a small representative seed dataset.
- [ ] Create `tree.json` with root nodes and parent-child relationships.
- [ ] Define the required fields for a skill record.
- [ ] Define which fields are optional for future/planned skills.
- [ ] Ensure node IDs are consistent between `skills.json` and `tree.json`.
- [ ] Add example entries for current, learning, and future skills.

## 3. Data Validation

- [ ] Implement validation for allowed skill levels.
- [ ] Implement validation for allowed skill statuses.
- [ ] Validate that every tree node exists in `skills.json` when applicable.
- [ ] Validate that tree roots exist in the node map.
- [ ] Validate that `years` is not required for `future` skills.
- [ ] Validate that parent-child references do not produce broken links.
- [ ] Add validation errors that are readable during local development.

## 4. App Shell

- [ ] Build the main two-column layout: tree on the left, details on the right.
- [ ] Add a top bar area for filters and search.
- [ ] Create shared app state for selected node, expanded nodes, filters, and search query.
- [ ] Load JSON data into the app on startup.
- [ ] Handle empty-state rendering when no skill is selected.
- [ ] Handle empty-state rendering when filters hide all results.

## 5. Skills Tree

- [ ] Create a tree container component.
- [ ] Create a recursive node component for rendering nested skills.
- [ ] Render categories, skills, and subskills from `tree.json`.
- [ ] Add expand/collapse behavior for nodes with children.
- [ ] Highlight the currently selected node.
- [ ] Add hover feedback for tree nodes.
- [ ] Add visual styling for future skills in the tree.
- [ ] Preserve expand/collapse state while interacting with filters and details.

## 6. Skill Details Panel

- [ ] Create a details card/panel component for the selected skill.
- [ ] Display skill name.
- [ ] Display icon placeholder or icon mapping.
- [ ] Display level badge.
- [ ] Display years of experience when available.
- [ ] Display summary text.
- [ ] Display detailed description text.
- [ ] Display highlights as bullet points.
- [ ] Display tags.
- [ ] Display related skills.
- [ ] Display status-specific messaging for learning and future skills.
- [ ] Handle missing optional fields gracefully.

## 7. Levels and Status Presentation

- [ ] Define a UI mapping for all supported levels: `STRONG`, `CONFIDENT`, `WORKING`, `BASIC`, `LEARNING`, `PLANNED`.
- [ ] Assign color tokens or style variants for each level.
- [ ] Create a reusable badge/label component for levels.
- [ ] Define visual treatment for statuses: `current`, `learning`, `future`.
- [ ] Apply muted or dashed styling to future skills.
- [ ] Ensure future skills do not display misleading years-of-experience values.

## 8. Filters and Search

- [ ] Add category filter UI.
- [ ] Add level filter UI.
- [ ] Add a quick filter for strong skills only.
- [ ] Add a quick filter for future skills only.
- [ ] Add a search input for skill name matching.
- [ ] Implement combined filtering behavior across all active filters.
- [ ] Update the visible tree dynamically based on filters.
- [ ] Decide and implement whether parent branches stay visible when a child matches search.
- [ ] Add a clear/reset filters action.

## 9. Tree Interaction Rules

- [ ] Define how selection behaves when a filtered-out node was previously selected.
- [ ] Define whether clicking a parent category without a skill record shows details or only expands the branch.
- [ ] Define default expansion behavior on first load.
- [ ] Define how search results affect automatic expansion of matching branches.

## 10. Local Edit Mode

- [ ] Gate edit functionality behind `VITE_EDIT_MODE=true`.
- [ ] Hide all edit controls when edit mode is disabled.
- [ ] Add an editor panel or controls for editing a selected skill.
- [ ] Add support for creating a new skill.
- [ ] Add support for deleting a skill.
- [ ] Add support for editing skill fields.
- [ ] Add support for moving a node within the tree.
- [ ] Add support for changing a node parent.
- [ ] Add support for modifying the tree structure safely.
- [ ] Add confirmation UX for destructive edit actions.
- [ ] Re-run validation after every structural edit.

## 11. Export JSON

- [ ] Add an export action for `skills.json`.
- [ ] Add an export action for `tree.json`.
- [ ] Generate downloadable files from current in-memory state.
- [ ] Ensure exported JSON is formatted consistently.
- [ ] Ensure export is available only in local edit mode if desired.
- [ ] Add a short UI hint that exported files are meant for manual commit.

## 12. Local Persistence

- [ ] Decide whether local persistence is included in the first version.
- [ ] If included, persist local edits to `localStorage`.
- [ ] Restore local edit session on reload.
- [ ] Add a way to clear local persisted draft data.
- [ ] Prevent stale local draft data from silently overriding source JSON without warning.

## 13. UX Polish

- [ ] Add loading-safe rendering even if JSON is temporarily unavailable or invalid.
- [ ] Ensure keyboard focus states are visible.
- [ ] Ensure clickable controls have usable hit areas.
- [ ] Ensure the layout works on narrower screens.
- [ ] Ensure long text in details panel remains readable.
- [ ] Add consistent empty, error, and no-results states.

## 14. Sample Content Preparation

- [ ] Prepare an initial category structure that reflects the CV narrative.
- [ ] Prepare concise summaries for top-level skills.
- [ ] Prepare detailed descriptions for strongest skills.
- [ ] Prepare highlights for high-signal achievements or responsibilities.
- [ ] Tag skills consistently for filtering and related-skill linking.
- [ ] Add a few planned/future skills with motivation text.

## 15. Testing and Verification

- [ ] Verify tree rendering with nested data.
- [ ] Verify selection and detail rendering.
- [ ] Verify each filter independently.
- [ ] Verify combined filters with search.
- [ ] Verify future skills render differently.
- [ ] Verify edit mode is hidden in production mode.
- [ ] Verify add, delete, and move operations update both state and structure correctly.
- [ ] Verify exported JSON can be reloaded by the app without manual fixes.
- [ ] Verify invalid JSON or broken references surface clear validation feedback.

## 16. Release Preparation

- [ ] Build the production bundle successfully.
- [ ] Verify the app works from the GitHub Pages base path.
- [ ] Confirm no local-only edit controls appear in production.
- [ ] Confirm source JSON is easy to update for future maintenance.
- [ ] Add a short maintenance note describing how to update data and redeploy.
