# PRD — Interactive Skills Map (GitHub CV Page)

## 1. Overview

**Product name:** Skills Map  
**Type:** Static web app (GitHub Pages)  
**Goal:** Present a structured, interactive, and maintainable representation of personal technical skills as part of CV.

The system must:
- Visualize skills as a tree (domains → technologies → capabilities)
- Provide detailed descriptions per skill
- Distinguish skill levels and maturity
- Support future/planned skills
- Allow local editing and JSON export (no backend)

---

## 2. Objectives

### Primary
- Replace static CV skill section with structured interactive map
- Clearly communicate depth, not just list of technologies
- Show real-world experience and engineering scope

### Secondary
- Provide maintainable and extensible structure
- Enable easy updates via JSON
- Support future growth and planning

---

## 3. Non-Goals

- No backend / database
- No authentication system
- No real-time editing in production
- No multi-user collaboration
- No CMS

---

## 4. Users

### Primary user
- Owner (you): edits and maintains skills

### Secondary users
- Recruiters
- Hiring managers
- Technical leads

---

## 5. Core Features

### 5.1 Skills Tree View
- Hierarchical structure:
  - Categories → Skills → Subskills
- Expand/collapse nodes
- Click node to view details

### 5.2 Skill Details Panel
Displays:
- Name
- Icon
- Level
- Years of experience
- Summary
- Highlights (bullet points)
- Tags

---

### 5.3 Skill Levels

Supported values:
- STRONG
- CONFIDENT
- WORKING
- BASIC
- LEARNING
- PLANNED

Each level must have:
- Color coding
- Badge/label

---

### 5.4 Skill Status

Supported values:
- current
- learning
- future

Behavior:
- future skills styled differently (e.g. dashed, faded)
- no years required for future

---

### 5.5 Future Skills

Must support:
- target description
- reason / motivation
- visual differentiation

---

### 5.6 Filters & Search

- Filter by category
- Filter by level
- Show only strong skills
- Show future skills
- Search by name

---

### 5.7 Edit Mode (LOCAL ONLY)

Enabled via environment variable:

VITE_EDIT_MODE=true

Features:
- Edit skill fields
- Add skill
- Delete skill
- Move node
- Change parent
- Modify tree structure

---

### 5.8 Export JSON

- Export updated:
  - skills.json
  - tree.json
- Download as files
- Used for manual commit

---

### 5.9 Local Persistence

Optional:
- Store edits in localStorage
- Restore session after reload

---

## 6. Data Model

### 6.1 skills.json

```json
{
  "php": {
    "name": "PHP",
    "icon": "php",
    "level": "STRONG",
    "status": "current",
    "years": 10,
    "summary": "Main backend language",
    "highlights": ["Architecture", "Refactoring"],
    "tags": ["backend"]
  }
}
```

### 6.2 tree.json

```json
{
  "roots": ["backend", "frontend"],
  "nodes": {
    "backend": ["php", "mysql"],
    "php": ["symfony"]
  }
}
```

---

## 7. UI/UX Requirements

### Layout

Left:
- Tree navigation

Right:
- Skill details panel

Top:
- Filters + search

---

### Visual Indicators

- Level badge (color-coded)
- Future skills → dashed / muted
- Selected node highlighted

---

### Interactions

- Click node → show details
- Expand/collapse branches
- Hover → highlight
- Filter updates tree dynamically

---

## 8. Technical Architecture

### Stack

- React + Vite
- GitHub Pages (static hosting)
- JSON as data source

---

### Project Structure

```
src/
  components/
    SkillTree.jsx
    SkillNode.jsx
    SkillCard.jsx
  editor/
    EditPanel.jsx
  data/
    skills.json
    tree.json
  utils/
    exportJson.js
    validation.js
```

---

### State Management

- React state (primary)
- localStorage (optional backup)

---

### Environment Config

VITE_EDIT_MODE=true/false

---

## 9. Constraints

- Must work as static site
- No server-side logic
- Must be fast (<100ms interactions)
- Data must be version-controlled

---

## 10. Risks

| Risk | Mitigation |
|------|-----------|
| JSON becomes too large | Split by domain |
| Broken tree references | Add validation script |
| Edit mode exposed in prod | Use env + build guard |
| Data inconsistency | Use schema validation |

---

## 11. Validation Rules

- Every node in tree.json must exist in skills.json
- No cyclic dependencies
- Unique IDs
- Level must be valid enum
- Status must be valid enum

---

## 12. MVP Scope

### Must Have
- Tree view
- Skill details panel
- JSON-driven data
- Level badges
- Future skills
- GitHub Pages deploy

### Should Have
- Filters
- Search
- Edit mode
- Export JSON

### Nice to Have
- Timeline view
- PDF export
- Dark mode

---

## 13. Success Criteria

- Can visually navigate all skills
- Clearly understand experience depth
- Easy to update via JSON
- Works as standalone CV asset
- Impresses technical reviewers

---

## 14. Future Extensions

- AI-generated skill summaries
- Auto-import from GitHub repos
- Timeline of experience
- Project → skill mapping
- Public sharing link with filters

---

## 15. Definition of Done

- Deployed on GitHub Pages
- JSON structure finalized
- At least 20–30 skills populated
- Edit mode works locally
- Export functionality implemented
- UI usable and readable
