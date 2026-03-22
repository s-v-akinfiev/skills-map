export const LEVEL_META = {
  STRONG: {
    label: "Strong",
    className: "level-strong",
  },
  CONFIDENT: {
    label: "Confident",
    className: "level-confident",
  },
  WORKING: {
    label: "Working",
    className: "level-working",
  },
  BASIC: {
    label: "Basic",
    className: "level-basic",
  },
  LEARNING: {
    label: "Learning",
    className: "level-learning",
  },
  PLANNED: {
    label: "Planned",
    className: "level-planned",
  },
};

export const STATUS_META = {
  current: {
    label: "Current",
    className: "status-current",
    description: "Actively used in current or recent production work.",
  },
  learning: {
    label: "Learning",
    className: "status-learning",
    description: "In active growth with practical hands-on usage.",
  },
  future: {
    label: "Future",
    className: "status-future",
    description: "Planned focus area, not yet counted as production experience.",
  },
};

export function getLevelMeta(level) {
  return LEVEL_META[level] ?? {
    label: level,
    className: "level-basic",
  };
}

export function getStatusMeta(status) {
  return STATUS_META[status] ?? {
    label: status,
    className: "status-current",
    description: "",
  };
}

