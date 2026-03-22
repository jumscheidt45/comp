// Narrative generation and explainability panel
import { FACTORS, LEVEL_LABELS, DESCRIPTIONS } from './data/factors.js';
import { getGradeForPoints, getAdjacentGrades } from './data/grades.js';

/**
 * Generate a natural-language summary determination
 */
export function generateNarrative(selections, weights, functionId, total, selectedTrack) {
  const grade = getGradeForPoints(total);
  const { lower, upper } = getAdjacentGrades(grade);
  const funcName = getFunctionDisplayName(functionId);

  // Identify elevated and conservative factors
  const avgLevel = selections.reduce((a, b) => a + b, 0) / selections.length;
  const elevated = [];
  const conservative = [];

  FACTORS.forEach((f, i) => {
    if (selections[i] >= avgLevel + 0.8) elevated.push(f.shortName);
    if (selections[i] <= avgLevel - 0.8) conservative.push(f.shortName);
  });

  let narrative = `This ${funcName} role scores ${total} total weighted points, `;
  narrative += `placing it in Grade ${grade.grade} (${grade.family}, ${grade.min}–${grade.max} points). `;

  if (elevated.length > 0) {
    narrative += `The role shows elevated strength in ${elevated.join(" and ")}, `;
    narrative += `reflecting ${elevated.length > 1 ? "demands" : "demand"} beyond the typical grade profile. `;
  }

  if (conservative.length > 0) {
    narrative += `Conversely, ${conservative.join(" and ")} ${conservative.length > 1 ? "are" : "is"} rated conservatively, `;
    narrative += `which is typical for roles that concentrate depth over breadth. `;
  }

  if (selectedTrack === "management" && selections[4] >= 2) {
    narrative += `The Management track assignment is supported by the People Leadership rating of ${LEVEL_LABELS[selections[4]]}, `;
    narrative += `indicating meaningful supervisory or organizational responsibility. `;
  } else if (selectedTrack === "management" && selections[4] < 2) {
    narrative += `Note: The Management track is selected, but the People Leadership rating of ${LEVEL_LABELS[selections[4]]} `;
    narrative += `may warrant further review to confirm supervisory scope. `;
  }

  // Distance from boundaries
  const distFromMin = total - grade.min;
  const distFromMax = grade.max - total;

  if (distFromMin < 15) {
    narrative += `The score sits near the lower boundary of Grade ${grade.grade} (${distFromMin} points above the floor). `;
    if (lower) {
      narrative += `A modest reduction in any factor could shift this role to Grade ${lower.grade}. `;
    }
  } else if (distFromMax < 15) {
    narrative += `The score approaches the upper boundary of Grade ${grade.grade} (${distFromMax} points below the ceiling). `;
    if (upper) {
      narrative += `Strengthening key factors could elevate this role to Grade ${upper.grade}. `;
    }
  } else {
    narrative += `The score is well-centered within Grade ${grade.grade}, providing confidence in the classification. `;
  }

  return narrative;
}

/**
 * Generate grade logic text
 */
export function generateGradeLogic(total) {
  const grade = getGradeForPoints(total);
  const { lower, upper } = getAdjacentGrades(grade);

  let logic = `Grade ${grade.grade} spans ${grade.min}–${grade.max} points (${grade.max - grade.min + 1}-point range). `;
  logic += `This score of ${total} sits at the ${getPositionDescription(total, grade.min, grade.max)} of the range. `;

  if (lower) {
    logic += `Below ${grade.min} would be Grade ${lower.grade} (${lower.family}). `;
  }
  if (upper) {
    logic += `Above ${grade.max} would be Grade ${upper.grade} (${upper.family}). `;
  }

  return logic;
}

function getPositionDescription(value, min, max) {
  const range = max - min;
  const position = (value - min) / range;
  if (position < 0.25) return "lower end";
  if (position < 0.5) return "lower-middle";
  if (position < 0.75) return "upper-middle";
  return "upper end";
}

function getFunctionDisplayName(id) {
  const map = {
    rnd: "R&D",
    scientific: "Scientific",
    clinical: "Clinical",
    business: "Business Operations",
    regulatory: "Regulatory"
  };
  return map[id] || id;
}
