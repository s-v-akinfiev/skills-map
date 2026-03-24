export const STATUS_META = {
  STRONG: {
    label: "Strong",
    className: "status-strong",
    description: "Deep, production-tested capability used with high confidence.",
  },
  CONFIDENT: {
    label: "Confident",
    className: "status-confident",
    description: "Reliable practical capability used comfortably in real work.",
  },
  BASIC: {
    label: "Basic",
    className: "status-basic",
    description: "Foundational working knowledge with limited depth or breadth.",
  },
  LEARNING: {
    label: "Learning",
    className: "status-learning",
    description: "In active growth with hands-on practice and exploration.",
  },
  PLANNED: {
    label: "Planned",
    className: "status-planned",
    description: "Intended focus area, not yet part of hands-on experience.",
  },
};

export function getStatusMeta(status) {
  return STATUS_META[status] ?? {
    label: status,
    className: "status-basic",
    description: "",
  };
}
