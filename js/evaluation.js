// Scoring engine, cusp analysis, sensitivity analysis
import { FACTORS, LEVEL_POINTS } from './data/factors.js';
import { GRADES, getGradeForPoints, getAdjacentGrades } from './data/grades.js';

/**
 * Calculate total weighted points.
 * Formula: total = sum(rawPts[i] * weight[i] / 100) * numberOfFactors
 * All Level 1 = 100 pts (Grade 1 min). All Level 5 = 500 pts (Grade 8 max).
 */
export function calculateTotal(selections, weights) {
  const n = FACTORS.length; // 5
  let weightedSum = 0;
  for (let i = 0; i < n; i++) {
    const rawPts = LEVEL_POINTS[selections[i]];
    weightedSum += rawPts * (weights[i] / 100);
  }
  return Math.round(weightedSum * n);
}

/**
 * Per-factor breakdown for explainability
 */
export function getFactorBreakdown(selections, weights) {
  const n = FACTORS.length;
  const total = calculateTotal(selections, weights);
  return FACTORS.map((factor, i) => {
    const rawPts = LEVEL_POINTS[selections[i]];
    const weightedContribution = rawPts * (weights[i] / 100) * n;
    return {
      factor,
      levelIndex: selections[i],
      rawPts,
      weight: weights[i],
      weightedContribution: Math.round(weightedContribution),
      pctOfTotal: total > 0 ? (weightedContribution / total * 100) : 0
    };
  });
}

/**
 * Cusp analysis: check if score is within threshold of a grade boundary
 */
export function analyzeCusp(total, threshold = 20) {
  const grade = getGradeForPoints(total);
  const { lower, upper } = getAdjacentGrades(grade);
  const results = { isCusp: false, nearBoundaries: [], grade };

  if (lower && (total - grade.min) < threshold) {
    results.isCusp = true;
    results.nearBoundaries.push({
      direction: "lower",
      adjacentGrade: lower,
      boundaryPoint: grade.min,
      distance: total - grade.min
    });
  }

  if (upper && (grade.max - total) < threshold) {
    results.isCusp = true;
    results.nearBoundaries.push({
      direction: "upper",
      adjacentGrade: upper,
      boundaryPoint: grade.max,
      distance: grade.max - total
    });
  }

  return results;
}

/**
 * Sensitivity analysis: for each factor, show impact of +/- one level
 */
export function sensitivityAnalysis(selections, weights) {
  const currentTotal = calculateTotal(selections, weights);
  return FACTORS.map((factor, i) => {
    const result = { factor, current: currentTotal, canDecrease: false, canIncrease: false };

    if (selections[i] > 0) {
      const modified = [...selections];
      modified[i] = selections[i] - 1;
      const newTotal = calculateTotal(modified, weights);
      result.canDecrease = true;
      result.decreasedTotal = newTotal;
      result.decreaseDelta = newTotal - currentTotal;
      result.decreasedGrade = getGradeForPoints(newTotal);
    }

    if (selections[i] < LEVEL_POINTS.length - 1) {
      const modified = [...selections];
      modified[i] = selections[i] + 1;
      const newTotal = calculateTotal(modified, weights);
      result.canIncrease = true;
      result.increasedTotal = newTotal;
      result.increaseDelta = newTotal - currentTotal;
      result.increasedGrade = getGradeForPoints(newTotal);
    }

    return result;
  });
}
