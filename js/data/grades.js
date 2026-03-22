// Grade structure: 8 grades, 100-500 point scale
export const GRADES = [
  {
    grade: 1,
    min: 100,
    max: 159,
    family: "Support / Early career",
    tracks: {
      professional: "P1 – IC I",
      support: "S2 – Technician",
      management: null,
      executive: null
    },
    bgColor: "#e8f0fe",
    textColor: "#1a3a5c",
    barColor: "#6b9bd2"
  },
  {
    grade: 2,
    min: 160,
    max: 219,
    family: "Support / Early career",
    tracks: {
      professional: "P2 – IC II",
      support: "S3 – Sr. Technician",
      management: null,
      executive: null
    },
    bgColor: "#d4e4f7",
    textColor: "#1a3a5c",
    barColor: "#5a8ec4"
  },
  {
    grade: 3,
    min: 220,
    max: 259,
    family: "Mid-career",
    tracks: {
      professional: "P3 – IC III",
      support: null,
      management: null,
      executive: null
    },
    bgColor: "#c0d8f0",
    textColor: "#1a3a5c",
    barColor: "#4a80b6"
  },
  {
    grade: 4,
    min: 260,
    max: 299,
    family: "Mid-career",
    tracks: {
      professional: "P4 – Senior IC",
      support: null,
      management: "M2 – Lead (reserved)",
      executive: null
    },
    bgColor: "#a8c8e8",
    textColor: "#1a3a5c",
    barColor: "#3b72a8"
  },
  {
    grade: 5,
    min: 300,
    max: 339,
    family: "Mid-career / Management",
    tracks: {
      professional: "P5 – Staff IC / Prog. Mgr.",
      support: null,
      management: "M3 – Manager",
      executive: null
    },
    bgColor: "#8ab4d8",
    textColor: "#ffffff",
    barColor: "#2c649a"
  },
  {
    grade: 6,
    min: 340,
    max: 369,
    family: "Management",
    tracks: {
      professional: "P6 – Principal",
      support: null,
      management: "M4 – Sr. Manager",
      executive: null
    },
    bgColor: "#6a9cc8",
    textColor: "#ffffff",
    barColor: "#1e568c"
  },
  {
    grade: 7,
    min: 370,
    max: 409,
    family: "Expertise / Management",
    tracks: {
      professional: "P7 – Fellow",
      support: null,
      management: "M5 – Director",
      executive: null
    },
    bgColor: "#4a84b8",
    textColor: "#ffffff",
    barColor: "#14487e"
  },
  {
    grade: 8,
    min: 410,
    max: 500,
    family: "Expertise / Executive",
    tracks: {
      professional: "P8 – Distinguished Fellow",
      support: null,
      management: "M6 – Sr. Director",
      executive: "E1 – VP / Consulting Inventor"
    },
    bgColor: "#1a3a5c",
    textColor: "#ffffff",
    barColor: "#0e2a46"
  }
];

export const TRACK_COLORS = {
  professional: { bg: "#7c3aed", text: "#ffffff", label: "Professional" },
  support:      { bg: "#3b82f6", text: "#ffffff", label: "Support" },
  management:   { bg: "#d97706", text: "#ffffff", label: "Management" },
  executive:    { bg: "#dc2626", text: "#ffffff", label: "Executive" }
};

export function getGradeForPoints(points) {
  for (const g of GRADES) {
    if (points >= g.min && points <= g.max) return g;
  }
  // Clamp
  if (points < 100) return GRADES[0];
  return GRADES[GRADES.length - 1];
}

export function getAdjacentGrades(grade) {
  const idx = GRADES.findIndex(g => g.grade === grade.grade);
  return {
    lower: idx > 0 ? GRADES[idx - 1] : null,
    upper: idx < GRADES.length - 1 ? GRADES[idx + 1] : null
  };
}
