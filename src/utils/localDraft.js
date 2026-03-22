const DRAFT_STORAGE_KEY = "skills-map-local-draft";

export function loadLocalDraft() {
  const rawValue = window.localStorage.getItem(DRAFT_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

export function saveLocalDraft(data) {
  window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
}

export function clearLocalDraft() {
  window.localStorage.removeItem(DRAFT_STORAGE_KEY);
}

