import { parseCSV, parseFile } from "./bom-parser.js";
import { analyzeBOM } from "./api.js";

const state = {
  bom: [],
  bomSource: null,
};

const $ = (sel) => document.querySelector(sel);

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initManualEntry();
  initPasteParser();
  initFileUpload();
  initRunButton();
});

function initTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      document.querySelectorAll(".tab").forEach((t) =>
        t.classList.toggle("active", t.dataset.tab === target),
      );
      document.querySelectorAll(".tab-panel").forEach((p) =>
        p.classList.toggle("active", p.dataset.panel === target),
      );
    });
  });
}

function initPasteParser() {
  $("#parse-paste").addEventListener("click", () => {
    const text = $("#paste-input").value;
    if (!text.trim()) {
      setBOM([], null);
      return;
    }
    try {
      const rows = parseCSV(text);
      setBOM(rows, "paste");
    } catch (err) {
      setStatus(`Parse error: ${err.message}`, true);
    }
  });
}

function initFileUpload() {
  $("#file-input").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const rows = await parseFile(file);
      setBOM(rows, `file: ${file.name}`);
    } catch (err) {
      setStatus(`File parse error: ${err.message}`, true);
    }
  });
}

function initManualEntry() {
  const tbody = $("#manual-body");
  const addRow = () => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input data-field="part_number" placeholder="ABC-123"></td>
      <td><input data-field="description" placeholder="Widget"></td>
      <td><input data-field="qty" type="number" placeholder="1" min="1"></td>
      <td><input data-field="current_supplier" placeholder="Digi-Key"></td>
      <td><input data-field="current_unit_cost" type="number" placeholder="0.00" step="0.01"></td>
      <td><button class="btn-icon" title="Remove row">×</button></td>
    `;
    tr.querySelector("button").addEventListener("click", () => {
      tr.remove();
      collectManual();
    });
    tr.querySelectorAll("input").forEach((input) =>
      input.addEventListener("input", collectManual),
    );
    tbody.appendChild(tr);
  };

  $("#add-row").addEventListener("click", addRow);
  addRow();
}

function collectManual() {
  const rows = [];
  document.querySelectorAll("#manual-body tr").forEach((tr) => {
    const row = {};
    tr.querySelectorAll("input").forEach((input) => {
      row[input.dataset.field] = input.value;
    });
    if (row.part_number && row.part_number.trim()) {
      rows.push({
        part_number: row.part_number.trim(),
        description: (row.description || "").trim(),
        qty: Number(row.qty) || 1,
        current_supplier: (row.current_supplier || "").trim(),
        current_unit_cost: row.current_unit_cost
          ? Number(row.current_unit_cost)
          : null,
      });
    }
  });
  if (rows.length > 0) {
    setBOM(rows, "manual");
  } else if (state.bomSource === "manual") {
    setBOM([], null);
  }
}

function setBOM(rows, source) {
  state.bom = rows;
  state.bomSource = source;
  const summary = $("#bom-summary");
  if (rows.length === 0) {
    summary.textContent = "No BOM loaded yet.";
    summary.classList.remove("ready");
  } else {
    const totalCost = rows.reduce(
      (sum, r) => sum + (r.current_unit_cost || 0) * (r.qty || 1),
      0,
    );
    summary.classList.add("ready");
    summary.textContent = `${rows.length} line item${rows.length === 1 ? "" : "s"} loaded from ${source}. Current total cost (where known): ${formatUSD(totalCost)}.`;
  }
  $("#run-btn").disabled = rows.length === 0;
}

function getApprovedSuppliers() {
  return $("#suppliers-input")
    .value.split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function initRunButton() {
  $("#run-btn").addEventListener("click", async () => {
    if (state.bom.length === 0) return;
    const btn = $("#run-btn");
    btn.disabled = true;
    setStatus(
      `Searching online prices for ${state.bom.length} part${state.bom.length === 1 ? "" : "s"}…`,
    );

    try {
      const result = await analyzeBOM({
        bom: state.bom,
        approvedSuppliers: getApprovedSuppliers(),
      });
      renderResults(result);
      setStatus(
        result.mode === "mock"
          ? "Done (mock data — set ANTHROPIC_API_KEY to run live searches)."
          : "Done.",
      );
      setModeBadge(result.mode);
    } catch (err) {
      setStatus(`Error: ${err.message}`, true);
    } finally {
      btn.disabled = false;
    }
  });
}

function setStatus(text, isError = false) {
  const el = $("#status");
  el.textContent = text;
  el.style.color = isError ? "var(--danger)" : "";
}

function setModeBadge(mode) {
  const badge = $("#mode-badge");
  badge.hidden = false;
  badge.textContent = mode === "live" ? "LIVE — Claude + web search" : "MOCK MODE";
  badge.classList.toggle("live", mode === "live");
}

function formatUSD(n) {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function renderResults({ results }) {
  $("#step-results").hidden = false;
  const totalCurrent = results.reduce((s, r) => s + (r.current_total_cost || 0), 0);
  const totalSavings = results.reduce((s, r) => s + (r.potential_savings || 0), 0);
  const totalBest = totalCurrent - totalSavings;

  $("#totals").innerHTML = `
    <div class="total-card">
      <div class="total-label">Current total</div>
      <div class="total-value">${formatUSD(totalCurrent)}</div>
    </div>
    <div class="total-card">
      <div class="total-label">Best sourcing total</div>
      <div class="total-value">${formatUSD(totalBest)}</div>
    </div>
    <div class="total-card">
      <div class="total-label">Potential savings</div>
      <div class="total-value savings">${formatUSD(totalSavings)}</div>
    </div>
  `;

  const panel = $("#results-panel");
  panel.innerHTML = "";
  results.forEach((item) => panel.appendChild(renderLineItem(item)));

  $("#step-results").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderLineItem(item) {
  const wrapper = document.createElement("div");
  wrapper.className = "line-item";

  const savingsLabel =
    item.potential_savings > 0
      ? `<span class="savings">Save ${formatUSD(item.potential_savings)}</span>`
      : `<span class="savings zero">No savings found</span>`;

  wrapper.innerHTML = `
    <div class="line-item-header">
      <div>
        <div><span class="part">${escapeHTML(item.part_number)}</span> <span class="desc">${escapeHTML(item.description || "")}</span></div>
        <div class="desc">Qty ${item.qty} · current: ${escapeHTML(item.current_supplier)} @ ${formatUSD(item.current_unit_cost)} = ${formatUSD(item.current_total_cost)}</div>
      </div>
      ${savingsLabel}
    </div>
  `;

  if (item.error) {
    const err = document.createElement("div");
    err.className = "line-item-error";
    err.textContent = `Search failed: ${item.error}`;
    wrapper.appendChild(err);
  }

  if (item.alternatives.length > 0) {
    wrapper.appendChild(renderAltsTable(item));
  } else if (!item.error) {
    const empty = document.createElement("div");
    empty.className = "line-item-error";
    empty.textContent = "No alternatives found.";
    wrapper.appendChild(empty);
  }

  return wrapper;
}

function renderAltsTable(item) {
  const cheapest = item.cheapest_overall;
  const table = document.createElement("table");
  table.className = "alts";
  table.innerHTML = `
    <thead>
      <tr>
        <th>Supplier</th>
        <th>Unit price</th>
        <th>Total (qty ${item.qty})</th>
        <th>Source</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
      ${item.alternatives
        .map((alt) => {
          const isBest = cheapest && alt === cheapest;
          const tag = alt.is_approved_supplier
            ? '<span class="tag approved">Approved</span>'
            : '<span class="tag off-list">Off-list</span>';
          const bestTag = isBest ? '<span class="tag best">Best price</span>' : "";
          return `
            <tr class="${isBest ? "alt-best" : ""}">
              <td><span class="alt-supplier">${escapeHTML(alt.supplier)}</span>${tag}${bestTag}</td>
              <td>${formatUSD(alt.unit_price)}</td>
              <td>${formatUSD(alt.total_price)}</td>
              <td><a class="alt-link" href="${escapeAttr(alt.source_url)}" target="_blank" rel="noopener">${escapeHTML(truncateURL(alt.source_url))}</a></td>
              <td class="alt-notes">${escapeHTML(alt.notes || "")}</td>
            </tr>
          `;
        })
        .join("")}
    </tbody>
  `;
  return table;
}

function truncateURL(url) {
  try {
    const u = new URL(url);
    return u.hostname + (u.pathname.length > 1 ? u.pathname.slice(0, 30) + "…" : "");
  } catch {
    return url.slice(0, 50);
  }
}

function escapeHTML(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}

function escapeAttr(s) {
  return escapeHTML(s);
}
