// DOM rendering, cards, badges, transitions
import { FACTORS, LEVEL_POINTS, LEVEL_LABELS, FUNCTIONS, DEFAULT_WEIGHTS, DESCRIPTIONS } from './data/factors.js';
import { GRADES, TRACK_COLORS, getGradeForPoints, getAdjacentGrades } from './data/grades.js';
import { THELANDER_BANDS, RADFORD_TIERS, THELANDER, RADFORD } from './data/market.js';
import { calculateTotal, getFactorBreakdown, analyzeCusp, sensitivityAnalysis } from './evaluation.js';
import { generateNarrative, generateGradeLogic } from './explainability.js';

// ── State ──
let state = {
  selectedFunction: null,
  weights: [...DEFAULT_WEIGHTS],
  selections: [-1, -1, -1, -1, -1], // -1 = not selected
  selectedTrack: null,
  thelBand: "< $15M",
  radTier: "Tier 1"
};

// ── Init ──
export function initUI() {
  renderFunctionButtons();
  renderWeightControls();
  renderFactorCards();
  renderResults();
}

// ── Step 1: Function Selection ──
function renderFunctionButtons() {
  const container = document.getElementById("function-buttons");
  container.innerHTML = "";
  FUNCTIONS.forEach(fn => {
    const btn = document.createElement("button");
    btn.className = `fn-btn${state.selectedFunction === fn.id ? " active" : ""}`;
    btn.style.setProperty("--fn-color", fn.color);
    btn.innerHTML = `<strong>${fn.name}</strong><span>${fn.subtitle}</span>`;
    btn.addEventListener("click", () => {
      state.selectedFunction = fn.id;
      state.selections = [-1, -1, -1, -1, -1];
      state.selectedTrack = null;
      renderFunctionButtons();
      renderFactorCards();
      renderResults();
      document.getElementById("step2").classList.remove("disabled");
      document.getElementById("step3").classList.remove("disabled");
    });
    container.appendChild(btn);
  });
}

// ── Step 2: Weights ──
function renderWeightControls() {
  const container = document.getElementById("weight-controls");
  container.innerHTML = "";

  FACTORS.forEach((f, i) => {
    const row = document.createElement("div");
    row.className = "weight-row";

    const label = document.createElement("label");
    label.textContent = f.shortName;

    const input = document.createElement("input");
    input.type = "number";
    input.min = 0;
    input.max = 100;
    input.value = state.weights[i];
    input.addEventListener("input", (e) => {
      state.weights[i] = parseInt(e.target.value) || 0;
      updateWeightTotal();
      renderResults();
    });

    const pct = document.createElement("span");
    pct.className = "weight-pct";
    pct.textContent = "%";

    row.appendChild(label);
    row.appendChild(input);
    row.appendChild(pct);
    container.appendChild(row);
  });

  // Total badge
  const totalRow = document.createElement("div");
  totalRow.className = "weight-total-row";
  totalRow.innerHTML = `<span>Total:</span> <span id="weight-total-badge" class="weight-badge">100%</span>`;
  container.appendChild(totalRow);

  // Reset button
  const resetBtn = document.createElement("button");
  resetBtn.className = "reset-btn";
  resetBtn.textContent = "Reset to defaults";
  resetBtn.addEventListener("click", () => {
    state.weights = [...DEFAULT_WEIGHTS];
    renderWeightControls();
    renderResults();
  });
  container.appendChild(resetBtn);

  updateWeightTotal();
}

function updateWeightTotal() {
  const total = state.weights.reduce((a, b) => a + b, 0);
  const badge = document.getElementById("weight-total-badge");
  if (badge) {
    badge.textContent = total + "%";
    badge.className = "weight-badge " + (total === 100 ? "valid" : "invalid");
  }
}

// ── Step 3: Factor Cards ──
function renderFactorCards() {
  const container = document.getElementById("factor-cards");
  container.innerHTML = "";

  if (!state.selectedFunction) {
    container.innerHTML = '<p class="placeholder-text">Select a function above to see factor descriptions.</p>';
    return;
  }

  FACTORS.forEach((factor, fi) => {
    const section = document.createElement("div");
    section.className = "factor-section";

    const header = document.createElement("div");
    header.className = "factor-header";
    header.innerHTML = `<h3>${factor.name}</h3><p>${factor.description}</p>`;
    section.appendChild(header);

    const cardsRow = document.createElement("div");
    cardsRow.className = "level-cards";

    for (let li = 0; li < 5; li++) {
      const card = document.createElement("div");
      card.className = `level-card${state.selections[fi] === li ? " selected" : ""}`;
      card.setAttribute("data-level", li);

      const desc = DESCRIPTIONS[state.selectedFunction]?.[factor.id]?.[li] || "";
      card.innerHTML = `
        <div class="level-card-header">
          <span class="level-label">${LEVEL_LABELS[li]}</span>
          <span class="level-pts">${LEVEL_POINTS[li]} pts</span>
        </div>
        <p class="level-desc">${desc}</p>
      `;

      card.addEventListener("click", () => {
        state.selections[fi] = li;
        state.selectedTrack = null;
        renderFactorCards();
        renderResults();
      });

      cardsRow.appendChild(card);
    }

    section.appendChild(cardsRow);
    container.appendChild(section);
  });
}

// ── Results ──
function renderResults() {
  const container = document.getElementById("results-panel");

  // Check if all factors are scored and weights are valid
  const allScored = state.selections.every(s => s >= 0);
  const weightsValid = state.weights.reduce((a, b) => a + b, 0) === 100;

  if (!allScored || !weightsValid || !state.selectedFunction) {
    container.innerHTML = '<p class="placeholder-text">Score all five factors to see results.</p>';
    return;
  }

  const total = calculateTotal(state.selections, state.weights);
  const grade = getGradeForPoints(total);
  const cusp = analyzeCusp(total);
  const sensitivity = sensitivityAnalysis(state.selections, state.weights);
  const breakdown = getFactorBreakdown(state.selections, state.weights);

  let html = "";

  // 1. Total weighted points
  html += renderTotalScore(total, grade);

  // 2. Cusp analysis
  if (cusp.isCusp) {
    html += renderCuspAnalysis(cusp, sensitivity);
  }

  // 3. Grade scale visualization
  html += renderGradeScale(total, grade, cusp);

  // 4. Track selection
  html += renderTrackSelection(grade);

  // 5. Explainability panel (only after track selection)
  if (state.selectedTrack) {
    html += renderExplainability(breakdown, total, grade);
  }

  // 6. Market reference data (only after track selection)
  if (state.selectedTrack) {
    html += renderMarketData(grade);
  }

  container.innerHTML = html;

  // Attach event listeners after DOM update
  attachTrackListeners(grade);
  if (state.selectedTrack) {
    attachMarketListeners(grade);
  }
}

function renderTotalScore(total, grade) {
  const pct = ((total - 100) / 400) * 100;
  return `
    <div class="result-card total-score-card" style="border-left: 5px solid ${grade.barColor}">
      <div class="total-score-header">
        <div>
          <div class="total-score-number">${total}</div>
          <div class="total-score-label">Total Weighted Points</div>
        </div>
        <div class="grade-badge" style="background:${grade.bgColor};color:${grade.textColor}">
          Grade ${grade.grade}
        </div>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar" style="width:${pct}%;background:${grade.barColor}"></div>
        <div class="progress-labels">
          <span>100</span><span>200</span><span>300</span><span>400</span><span>500</span>
        </div>
      </div>
      <div class="grade-family">${grade.family}</div>
    </div>
  `;
}

function renderCuspAnalysis(cusp, sensitivity) {
  let html = `<div class="result-card cusp-card">
    <h3>Cusp Analysis</h3>`;

  cusp.nearBoundaries.forEach(b => {
    const dirLabel = b.direction === "lower" ? "below" : "above";
    html += `<div class="cusp-warning">
      <strong>Within ${b.distance} points of Grade ${b.adjacentGrade.grade} boundary (${dirLabel})</strong>
      <p>This role is near the ${b.direction === "lower" ? "floor" : "ceiling"} of Grade ${cusp.grade.grade}.
      ${b.direction === "lower"
        ? `A small decrease could move it to Grade ${b.adjacentGrade.grade} (${b.adjacentGrade.family}).`
        : `A small increase could elevate it to Grade ${b.adjacentGrade.grade} (${b.adjacentGrade.family}).`}
      </p>
    </div>`;
  });

  // Sensitivity table
  html += `<h4>Sensitivity Analysis</h4>
    <table class="sensitivity-table">
      <thead>
        <tr><th>Factor</th><th>-1 Level</th><th>Current</th><th>+1 Level</th></tr>
      </thead><tbody>`;

  sensitivity.forEach(s => {
    const decCell = s.canDecrease
      ? `<td class="delta-neg">${s.decreasedTotal} (${s.decreaseDelta > 0 ? "+" : ""}${s.decreaseDelta}) → G${s.decreasedGrade.grade}</td>`
      : `<td class="delta-na">—</td>`;
    const incCell = s.canIncrease
      ? `<td class="delta-pos">${s.increasedTotal} (+${s.increaseDelta}) → G${s.increasedGrade.grade}</td>`
      : `<td class="delta-na">—</td>`;
    html += `<tr>${decCell}<td class="delta-current">${s.current}</td>${incCell}</tr>`;
    // prepend factor name
    html = html.replace(`<tr>${decCell}`, `<tr><td>${s.factor.shortName}</td>${decCell}`);
  });

  html += `</tbody></table>
    <p class="cusp-recommendation">Review the sensitivity results above. Factors with the largest impact should be carefully validated to ensure the grade assignment is robust.</p>
  </div>`;
  return html;
}

function renderGradeScale(total, matchedGrade, cusp) {
  const cuspGrades = new Set(cusp.nearBoundaries.map(b => b.adjacentGrade.grade));

  let html = `<div class="result-card"><h3>Grade Scale</h3><div class="grade-scale">`;
  GRADES.forEach(g => {
    const isMatched = g.grade === matchedGrade.grade;
    const isCusp = cuspGrades.has(g.grade);
    let cls = "grade-bar";
    if (isMatched) cls += " matched";
    if (isCusp) cls += " cusp-adjacent";

    html += `<div class="${cls}" style="background:${isMatched ? g.barColor : "#e5e7eb"};color:${isMatched ? "#fff" : "#6b7280"}">
      <span class="grade-bar-label">G${g.grade}</span>
      <span class="grade-bar-range">${g.min}–${g.max}</span>
    </div>`;
  });
  html += `</div></div>`;
  return html;
}

function renderTrackSelection(grade) {
  const tracks = grade.tracks;
  const available = Object.entries(tracks).filter(([, v]) => v !== null);

  let html = `<div class="result-card"><h3>Select Track</h3><div class="track-buttons">`;
  available.forEach(([key, label]) => {
    const tc = TRACK_COLORS[key];
    const isSelected = state.selectedTrack === key;
    html += `<button class="track-btn${isSelected ? " active" : ""}" data-track="${key}"
      style="--track-bg:${tc.bg};--track-text:${tc.text}">
      <span class="track-badge" style="background:${tc.bg};color:${tc.text}">${tc.label}</span>
      ${label}
    </button>`;
  });
  html += `</div></div>`;
  return html;
}

function attachTrackListeners(grade) {
  document.querySelectorAll(".track-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.selectedTrack = btn.dataset.track;
      renderResults();
    });
  });
}

function renderExplainability(breakdown, total, grade) {
  let html = `<div class="result-card explainability-card">
    <h3>Evaluation Breakdown</h3>
    <table class="breakdown-table">
      <thead><tr>
        <th>Factor</th><th>Level</th><th>Raw Pts</th><th>Weight</th><th>Contribution</th><th>% of Total</th>
      </tr></thead><tbody>`;

  breakdown.forEach(b => {
    html += `<tr>
      <td>${b.factor.shortName}</td>
      <td>${LEVEL_LABELS[b.levelIndex]}</td>
      <td>${b.rawPts}</td>
      <td>${b.weight}%</td>
      <td>${b.weightedContribution} pts</td>
      <td>${b.pctOfTotal.toFixed(1)}%</td>
    </tr>`;
  });

  html += `<tr class="breakdown-total">
    <td colspan="4"><strong>Total</strong></td>
    <td><strong>${total} pts</strong></td>
    <td><strong>100%</strong></td>
  </tr></tbody></table>`;

  // Per-factor descriptions
  html += `<div class="factor-details">`;
  breakdown.forEach(b => {
    const desc = DESCRIPTIONS[state.selectedFunction]?.[b.factor.id]?.[b.levelIndex] || "";
    html += `<div class="factor-detail-row">
      <strong>${b.factor.name}</strong> — ${LEVEL_LABELS[b.levelIndex]} (${b.rawPts} pts, ${b.weight}% weight → ${b.weightedContribution} pts)
      <p class="factor-detail-desc">${desc}</p>
    </div>`;
  });
  html += `</div>`;

  // Summary narrative
  const narrative = generateNarrative(state.selections, state.weights, state.selectedFunction, total, state.selectedTrack);
  html += `<div class="narrative-panel">
    <h4>Summary Determination</h4>
    <p>${narrative}</p>
  </div>`;

  // Grade logic
  const logic = generateGradeLogic(total);
  html += `<div class="grade-logic-panel">
    <h4>Grade Logic</h4>
    <p>${logic}</p>
  </div>`;

  html += `</div>`;
  return html;
}

function renderMarketData(grade) {
  let html = `<div class="result-card market-card">
    <h3>Market Reference Data</h3>
    <div class="market-panels">`;

  // Thelander panel
  html += `<div class="market-panel">
    <h4>Thelander</h4>
    <div class="pill-selector" id="thel-pills">`;
  THELANDER_BANDS.forEach(band => {
    html += `<button class="pill${state.thelBand === band ? " active" : ""}" data-thel="${band}">${band}</button>`;
  });
  html += `</div><div id="thel-table">${renderThelTable(grade)}</div></div>`;

  // Radford panel
  html += `<div class="market-panel">
    <h4>Radford</h4>
    <div class="pill-selector" id="rad-pills">`;
  RADFORD_TIERS.forEach(tier => {
    html += `<button class="pill${state.radTier === tier ? " active" : ""}" data-rad="${tier}">${tier}</button>`;
  });
  html += `</div><div id="rad-table">${renderRadTable(grade)}</div></div>`;

  html += `</div></div>`;
  return html;
}

function renderThelTable(grade) {
  if (state.thelBand === "None") return '<p class="market-none">No Thelander data selected.</p>';
  const data = THELANDER[grade.grade]?.[state.thelBand];
  if (!data) return '<p class="market-none">No data available for this band/grade.</p>';

  const trackLabel = state.selectedTrack ? TRACK_COLORS[state.selectedTrack]?.label : "";
  const trackColor = state.selectedTrack ? TRACK_COLORS[state.selectedTrack] : { bg: "#6b7280", text: "#fff" };

  return `<table class="market-table">
    <tbody>
      <tr><td>Role</td><td>Grade ${grade.grade} — <span class="track-badge-sm" style="background:${trackColor.bg};color:${trackColor.text}">${trackLabel}</span></td></tr>
      <tr class="market-highlight"><td>P50 Total Cash</td><td class="market-p50">${formatCurrency(data.p50TotalCash)}</td></tr>
      <tr><td>P25–P75 Range</td><td class="market-range">${formatCurrency(data.p25TotalCash)} – ${formatCurrency(data.p75TotalCash)}</td></tr>
      <tr><td>Equity %</td><td>${(data.equityPct * 100).toFixed(1)}%</td></tr>
    </tbody>
  </table>`;
}

function renderRadTable(grade) {
  if (state.radTier === "None") return '<p class="market-none">No Radford data selected.</p>';
  const data = RADFORD[grade.grade]?.[state.radTier];
  if (!data) return '<p class="market-none">No data available for this tier/grade.</p>';

  const trackLabel = state.selectedTrack ? TRACK_COLORS[state.selectedTrack]?.label : "";
  const trackColor = state.selectedTrack ? TRACK_COLORS[state.selectedTrack] : { bg: "#6b7280", text: "#fff" };

  return `<table class="market-table">
    <tbody>
      <tr><td>Role</td><td>Grade ${grade.grade} — <span class="track-badge-sm" style="background:${trackColor.bg};color:${trackColor.text}">${trackLabel}</span></td></tr>
      <tr class="market-highlight"><td>P50 Total Cash</td><td class="market-p50">${formatCurrency(data.p50TotalCash)}</td></tr>
      <tr><td>P25–P75 Range</td><td class="market-range">${formatCurrency(data.p25TotalCash)} – ${formatCurrency(data.p75TotalCash)}</td></tr>
      <tr><td>Base P50</td><td>${formatCurrency(data.p50Base)}</td></tr>
      <tr><td>Sample Size</td><td>n = ${data.sampleSize.toLocaleString()}</td></tr>
    </tbody>
  </table>`;
}

function attachMarketListeners(grade) {
  document.querySelectorAll("#thel-pills .pill").forEach(btn => {
    btn.addEventListener("click", () => {
      state.thelBand = btn.dataset.thel;
      renderResults();
    });
  });
  document.querySelectorAll("#rad-pills .pill").forEach(btn => {
    btn.addEventListener("click", () => {
      state.radTier = btn.dataset.rad;
      renderResults();
    });
  });
}

function formatCurrency(n) {
  return "$" + n.toLocaleString("en-US");
}
