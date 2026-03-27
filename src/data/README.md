# Data Model Notes

This folder contains the source JSON files described in the PRD.

## Files

- `skills.json`: skill records keyed by skill ID
- `tree.json`: tree structure used to organize categories and parent-child links

Optional tree fields:

- `collapsedByDefault`: array of node IDs that should start collapsed in the UI

## Skill Record Shape

Required fields for standard skill records:

- `name`
- `icon`
- `status`
- `summary`
- `highlights`

## Supported Status Values

- `STRONG`
- `CONFIDENT`
- `BASIC`
- `LEARNING`
- `PLANNED`

## ID Rules

- Skill IDs are the top-level keys in `skills.json`.
- Skill IDs referenced in `tree.json` children should exist in `skills.json`.
- Root/category IDs in `tree.json` are structural nodes and do not need matching entries in `skills.json`.
## Seed Data Coverage

The initial dataset includes examples for:

- strong skills
- confident skills
- learning skills
- planned skills

The sample content is intentionally written in a CV-oriented voice:

- category labels reflect engineering scope rather than generic buckets
- summaries are concise and recruiter-readable
- highlights capture high-signal achievements or ownership areas
