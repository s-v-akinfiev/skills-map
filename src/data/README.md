# Data Model Notes

This folder contains the source JSON files described in the PRD.

## Files

- `skills.json`: skill records keyed by skill ID
- `tree.json`: tree structure used to organize categories and parent-child links

## Skill Record Shape

Required fields for standard skill records:

- `name`
- `icon`
- `level`
- `status`
- `summary`
- `highlights`

Conditionally required:

- `years`: required for `current` and `learning` skills, omitted for `future` skills

Optional fields:

- `targetDescription`: used for future/planned skills
- `motivation`: used for future/planned skills

## Supported Values

Supported `level` values:

- `STRONG`
- `CONFIDENT`
- `WORKING`
- `BASIC`
- `LEARNING`
- `PLANNED`

Supported `status` values:

- `current`
- `learning`
- `future`

## ID Rules

- Skill IDs are the top-level keys in `skills.json`.
- Skill IDs referenced in `tree.json` children should exist in `skills.json`.
- Root/category IDs in `tree.json` are structural nodes and do not need matching entries in `skills.json`.
## Seed Data Coverage

The initial dataset includes examples for:

- current skills
- learning skills
- future/planned skills

The sample content is intentionally written in a CV-oriented voice:

- category labels reflect engineering scope rather than generic buckets
- summaries are concise and recruiter-readable
- highlights capture high-signal achievements or ownership areas
