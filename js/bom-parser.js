// CSV/XLSX parsing for the BOM step.
// Exposes parseCSV(text) and parseFile(file) returning arrays of normalized rows.

const CANONICAL_HEADERS = {
  part_number: ["part_number", "part", "part #", "partnumber", "part no", "sku", "mpn"],
  description: ["description", "desc", "name", "product"],
  qty: ["qty", "quantity", "count"],
  current_supplier: ["current_supplier", "supplier", "vendor", "manufacturer"],
  current_unit_cost: ["current_unit_cost", "unit_cost", "unit cost", "price", "cost", "unit price"],
};

function normalizeHeader(raw) {
  const cleaned = String(raw || "").trim().toLowerCase().replace(/\s+/g, "_");
  for (const [canonical, aliases] of Object.entries(CANONICAL_HEADERS)) {
    if (aliases.includes(cleaned) || aliases.includes(raw.trim().toLowerCase())) {
      return canonical;
    }
  }
  return cleaned;
}

function parseCSVLine(line, delimiter) {
  const cells = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        cells.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
  }
  cells.push(cur);
  return cells.map((c) => c.trim());
}

function detectDelimiter(line) {
  const tabCount = (line.match(/\t/g) || []).length;
  const commaCount = (line.match(/,/g) || []).length;
  return tabCount > commaCount ? "\t" : ",";
}

export function parseCSV(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n").filter((l) => l.trim());
  if (lines.length < 2) return [];
  const delimiter = detectDelimiter(lines[0]);
  const headers = parseCSVLine(lines[0], delimiter).map(normalizeHeader);

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = parseCSVLine(lines[i], delimiter);
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = cells[idx] ?? "";
    });
    rows.push(normalizeRow(row));
  }
  return rows.filter((r) => r.part_number);
}

function normalizeRow(row) {
  return {
    part_number: String(row.part_number || "").trim(),
    description: String(row.description || "").trim(),
    qty: parseNumber(row.qty) || 1,
    current_supplier: String(row.current_supplier || "").trim(),
    current_unit_cost: parseNumber(row.current_unit_cost),
  };
}

function parseNumber(raw) {
  if (raw === null || raw === undefined || raw === "") return null;
  const cleaned = String(raw).replace(/[$,\s]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export async function parseFile(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".csv")) {
    const text = await file.text();
    return parseCSV(text);
  }
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    if (typeof XLSX === "undefined") {
      throw new Error("XLSX library not loaded");
    }
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    return json
      .map((row) => {
        const normalized = {};
        for (const [key, value] of Object.entries(row)) {
          normalized[normalizeHeader(key)] = value;
        }
        return normalizeRow(normalized);
      })
      .filter((r) => r.part_number);
  }
  throw new Error("Unsupported file type. Use .csv, .xlsx, or .xls.");
}
