# Tech Skills Map

Static React + Vite app for presenting a structured technical skills map.

## Local development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Enable local edit mode when needed:

```bash
VITE_EDIT_MODE=true npm run dev
```

## Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deploy

The Vite base path is configured for GitHub Pages under `/skills-map/`.

Typical flow:

1. Run `npm run build`.
2. Publish the contents of `dist/` to the GitHub Pages branch or Pages publishing target.
3. Verify the deployed site loads correctly from the `/skills-map/` path.

## Maintenance

Skill data lives in [src/data/skills.json](/home/akinfiev/misc/apps/skills-map/src/data/skills.json) and [src/data/tree.json](/home/akinfiev/misc/apps/skills-map/src/data/tree.json).

Typical maintenance flow:

1. Update the JSON files directly, or run local edit mode with `VITE_EDIT_MODE=true npm run dev`.
2. If local edit mode was used, export fresh `skills.json` and `tree.json` from the editor and replace the source files.
3. Run `npm run build`.
4. Review the output and deploy `dist/`.

Current verification notes are recorded in [verification-notes.md](/home/akinfiev/misc/apps/skills-map/verification-notes.md).
