# Implementation Tasks

This file breaks down the PRD in [prd.md](/home/akinfiev/misc/apps/skills-map/prd.md) into small implementation tasks. It is intended as a delivery backlog, not as implementation output.

## 1. Project Setup

- [x] Initialize a React + Vite project structure for a static GitHub Pages deployment.
- [x] Add a basic folder layout matching the PRD (`components`, `editor`, `data`, `utils`).
- [x] Configure the app base path for GitHub Pages deployment.
- [x] Add a single source of truth for `VITE_EDIT_MODE`.
- [x] Add a basic README section describing local run, build, and deploy flow.

## 2. Data Files

- [x] Create `skills.json` with a small representative seed dataset.
- [x] Create `tree.json` with root nodes and parent-child relationships.
- [x] Define the required fields for a skill record.
- [x] Define which fields are optional for future/planned skills.
- [x] Ensure node IDs are consistent between `skills.json` and `tree.json`.
- [x] Add example entries for current, learning, and future skills.

## 3. Data Validation

- [x] Implement validation for allowed skill levels.
- [x] Implement validation for allowed skill statuses.
- [x] Validate that every tree node exists in `skills.json` when applicable.
- [x] Validate that tree roots exist in the node map.
- [x] Validate that parent-child references do not produce broken links.
- [x] Add validation errors that are readable during local development.

## 4. App Shell

- [x] Build the main two-column layout: tree on the left, details on the right.
- [x] Add a top bar area for filters and search.
- [x] Create shared app state for selected node, expanded nodes, filters, and search query.
- [x] Load JSON data into the app on startup.
- [x] Handle empty-state rendering when no skill is selected.
- [x] Handle empty-state rendering when filters hide all results.

## 5. Skills Tree

- [x] Create a tree container component.
- [x] Create a recursive node component for rendering nested skills.
- [x] Render categories, skills, and subskills from `tree.json`.
- [x] Add expand/collapse behavior for nodes with children.
- [x] Highlight the currently selected node.
- [x] Add hover feedback for tree nodes.
- [x] Add visual styling for future skills in the tree.
- [x] Preserve expand/collapse state while interacting with filters and details.

## 6. Skill Details Panel

- [x] Create a details card/panel component for the selected skill.
- [x] Display skill name.
- [x] Display icon placeholder or icon mapping.
- [x] Display level badge.
- [x] Display summary text.
- [x] Display detailed description text.
- [x] Display highlights as bullet points.
- [x] Display tags.
- [x] Display related skills.
- [x] Display status-specific messaging for learning and future skills.
- [x] Handle missing optional fields gracefully.

## 7. Levels and Status Presentation

- [x] Define a UI mapping for all supported levels: `STRONG`, `CONFIDENT`, `WORKING`, `BASIC`, `LEARNING`, `PLANNED`.
- [x] Assign color tokens or style variants for each level.
- [x] Create a reusable badge/label component for levels.
- [x] Define visual treatment for statuses: `current`, `learning`, `future`.
- [x] Apply muted or dashed styling to future skills.

## 8. Filters and Search

- [x] Add category filter UI.
- [x] Add level filter UI.
- [x] Add a quick filter for strong skills only.
- [x] Add a quick filter for future skills only.
- [x] Add a search input for skill name matching.
- [x] Implement combined filtering behavior across all active filters.
- [x] Update the visible tree dynamically based on filters.
- [x] Decide and implement whether parent branches stay visible when a child matches search.
- [x] Add a clear/reset filters action.

## 9. Tree Interaction Rules

- [x] Define how selection behaves when a filtered-out node was previously selected.
- [x] Define whether clicking a parent category without a skill record shows details or only expands the branch.
- [x] Define default expansion behavior on first load.
- [x] Define how search results affect automatic expansion of matching branches.

## 10. Local Edit Mode

- [x] Gate edit functionality behind `VITE_EDIT_MODE=true`.
- [x] Hide all edit controls when edit mode is disabled.
- [x] Add an editor panel or controls for editing a selected skill.
- [x] Add support for creating a new skill.
- [x] Add support for deleting a skill.
- [x] Add support for editing skill fields.
- [x] Add support for moving a node within the tree.
- [x] Add support for changing a node parent.
- [x] Add support for modifying the tree structure safely.
- [x] Add confirmation UX for destructive edit actions.
- [x] Re-run validation after every structural edit.

## 11. Export JSON

- [x] Add an export action for `skills.json`.
- [x] Add an export action for `tree.json`.
- [x] Generate downloadable files from current in-memory state.
- [x] Ensure exported JSON is formatted consistently.
- [x] Ensure export is available only in local edit mode if desired.
- [x] Add a short UI hint that exported files are meant for manual commit.

## 12. Local Persistence

- [x] Decide whether local persistence is included in the first version.
- [x] If included, persist local edits to `localStorage`.
- [x] Restore local edit session on reload.
- [x] Add a way to clear local persisted draft data.
- [x] Prevent stale local draft data from silently overriding source JSON without warning.

## 13. UX Polish

- [x] Add loading-safe rendering even if JSON is temporarily unavailable or invalid.
- [x] Ensure keyboard focus states are visible.
- [x] Ensure clickable controls have usable hit areas.
- [x] Ensure the layout works on narrower screens.
- [x] Ensure long text in details panel remains readable.
- [x] Add consistent empty, error, and no-results states.

## 14. Sample Content Preparation

- [x] Prepare an initial category structure that reflects the CV narrative.
- [x] Prepare concise summaries for top-level skills.
- [x] Prepare detailed descriptions for strongest skills.
- [x] Prepare highlights for high-signal achievements or responsibilities.
- [x] Tag skills consistently for filtering and related-skill linking.
- [x] Add a few planned/future skills with motivation text.

## 15. Testing and Verification

- [x] Verify tree rendering with nested data.
- [x] Verify selection and detail rendering.
- [x] Verify each filter independently.
- [x] Verify combined filters with search.
- [x] Verify future skills render differently.
- [x] Verify edit mode is hidden in production mode.
- [x] Verify add, delete, and move operations update both state and structure correctly.
- [x] Verify exported JSON can be reloaded by the app without manual fixes.
- [x] Verify invalid JSON or broken references surface clear validation feedback.

## 16. Release Preparation

- [x] Build the production bundle successfully.
- [x] Verify the app works from the GitHub Pages base path.
- [x] Confirm no local-only edit controls appear in production.
- [x] Confirm source JSON is easy to update for future maintenance.
- [x] Add a short maintenance note describing how to update data and redeploy.
