import Anthropic from "@anthropic-ai/sdk";

interface BOMLineItem {
  part_number: string;
  description: string;
  qty: number;
  current_supplier?: string;
  current_unit_cost?: number;
}

interface RawAlternative {
  supplier: string;
  unit_price: number;
  source_url: string;
  notes: string;
}

interface Alternative extends RawAlternative {
  total_price: number;
  is_approved_supplier: boolean;
}

interface LineItemResult {
  part_number: string;
  description: string;
  qty: number;
  current_supplier: string;
  current_unit_cost: number;
  current_total_cost: number;
  alternatives: Alternative[];
  cheapest_approved: Alternative | null;
  cheapest_overall: Alternative | null;
  potential_savings: number;
  error?: string;
}

interface Env {
  ANTHROPIC_API_KEY?: string;
  MOCK_MODE?: string;
}

const SYSTEM_PROMPT = `You are a procurement research agent. For each part you're given, you search the web to find current online prices from multiple suppliers (distributors, marketplaces, manufacturer direct).

Rules:
- Always cite a real, working URL for each price you report.
- Prefer USD; if a result is in another currency, convert and note the original.
- Look for at least one option from the user's approved-supplier list and at least one option NOT on the list.
- Quote unit price (price per single unit), not bulk-pack price, unless the part is sold only in packs (note that explicitly).
- If you cannot find a confident price, return zero alternatives rather than guess.
- Skip second-hand listings and obviously unreliable sellers.

Return 2 to 5 alternatives. Each must have: supplier name, unit price (USD number), source URL, and a brief note (e.g. "stock available", "min order qty 10", "ships from EU").`;

const ALTERNATIVES_SCHEMA = {
  type: "object",
  properties: {
    alternatives: {
      type: "array",
      items: {
        type: "object",
        properties: {
          supplier: { type: "string", description: "Supplier or merchant name" },
          unit_price: { type: "number", description: "Price per single unit in USD" },
          source_url: { type: "string", description: "URL where this price was found" },
          notes: { type: "string", description: "Short note: stock, MOQ, ship-from, etc." },
        },
        required: ["supplier", "unit_price", "source_url", "notes"],
        additionalProperties: false,
      },
    },
  },
  required: ["alternatives"],
  additionalProperties: false,
};

function isApproved(supplier: string, approved: string[]): boolean {
  const s = supplier.toLowerCase();
  return approved.some((a) => {
    const norm = a.toLowerCase().trim();
    return norm.length > 0 && (s.includes(norm) || norm.includes(s));
  });
}

function summarize(
  item: BOMLineItem,
  rawAlts: RawAlternative[],
  approved: string[],
): LineItemResult {
  const qty = item.qty || 1;
  const currentUnit = item.current_unit_cost ?? 0;
  const currentTotal = currentUnit * qty;

  const alternatives: Alternative[] = rawAlts
    .filter((a) => a && typeof a.unit_price === "number" && a.unit_price > 0)
    .map((a) => ({
      ...a,
      total_price: a.unit_price * qty,
      is_approved_supplier: isApproved(a.supplier, approved),
    }))
    .sort((a, b) => a.unit_price - b.unit_price);

  const cheapestApproved =
    alternatives.find((a) => a.is_approved_supplier) ?? null;
  const cheapestOverall = alternatives[0] ?? null;
  const benchmark = cheapestApproved ?? cheapestOverall;
  const potentialSavings =
    benchmark && currentTotal > 0
      ? Math.max(0, currentTotal - benchmark.total_price)
      : 0;

  return {
    part_number: item.part_number,
    description: item.description,
    qty,
    current_supplier: item.current_supplier ?? "(none)",
    current_unit_cost: currentUnit,
    current_total_cost: currentTotal,
    alternatives,
    cheapest_approved: cheapestApproved,
    cheapest_overall: cheapestOverall,
    potential_savings: potentialSavings,
  };
}

function mockAlternatives(item: BOMLineItem, approved: string[]): RawAlternative[] {
  const baseline = item.current_unit_cost ?? 10;
  const sample: RawAlternative[] = [
    {
      supplier: approved[0] ?? "Digi-Key",
      unit_price: +(baseline * 0.92).toFixed(2),
      source_url: `https://www.example.com/search?q=${encodeURIComponent(item.part_number)}`,
      notes: "In stock, ships in 2 days (mock data)",
    },
    {
      supplier: approved[1] ?? "Mouser",
      unit_price: +(baseline * 0.97).toFixed(2),
      source_url: `https://www.example.com/p/${encodeURIComponent(item.part_number)}`,
      notes: "Stock 1200 units (mock data)",
    },
    {
      supplier: "AliExpress (off-list)",
      unit_price: +(baseline * 0.78).toFixed(2),
      source_url: `https://www.example.com/aliexpress/${encodeURIComponent(item.part_number)}`,
      notes: "MOQ 50, ~14 day shipping (mock data)",
    },
  ];
  return sample;
}

async function analyzeOne(
  client: Anthropic,
  item: BOMLineItem,
  approved: string[],
): Promise<LineItemResult> {
  const userMessage =
    `Part: ${item.part_number}\n` +
    `Description: ${item.description}\n` +
    `Quantity needed: ${item.qty}\n` +
    `Current supplier: ${item.current_supplier ?? "(none on file)"}\n` +
    `Current unit cost (USD): ${item.current_unit_cost ?? "(unknown)"}\n\n` +
    `Approved supplier list: ${approved.length ? approved.join(", ") : "(none provided)"}\n\n` +
    `Find current online prices. Include at least one approved-supplier option and at least one off-list option.`;

  try {
    const stream = client.messages.stream({
      model: "claude-opus-4-7",
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      tools: [
        { type: "web_search_20260209", name: "web_search", max_uses: 5 },
      ],
      output_config: {
        format: { type: "json_schema", schema: ALTERNATIVES_SCHEMA },
      },
      messages: [{ role: "user", content: userMessage }],
    });

    const message = await stream.finalMessage();
    const textBlock = message.content.find(
      (b): b is Anthropic.TextBlock => b.type === "text",
    );
    if (!textBlock) {
      return {
        ...summarize(item, [], approved),
        error: "No text block in response",
      };
    }
    const parsed = JSON.parse(textBlock.text) as { alternatives: RawAlternative[] };
    return summarize(item, parsed.alternatives ?? [], approved);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      ...summarize(item, [], approved),
      error: msg,
    };
  }
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  let payload: { bom?: BOMLineItem[]; approvedSuppliers?: string[] };
  try {
    payload = await ctx.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const bom = Array.isArray(payload.bom) ? payload.bom : [];
  const approved = Array.isArray(payload.approvedSuppliers)
    ? payload.approvedSuppliers.filter((s) => typeof s === "string" && s.trim())
    : [];

  if (bom.length === 0) {
    return new Response(JSON.stringify({ error: "Empty BOM" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const useMock =
    !ctx.env.ANTHROPIC_API_KEY || ctx.env.MOCK_MODE === "true";

  if (useMock) {
    const results = bom.map((item) =>
      summarize(item, mockAlternatives(item, approved), approved),
    );
    return Response.json({ mode: "mock", results });
  }

  const client = new Anthropic({ apiKey: ctx.env.ANTHROPIC_API_KEY });
  const results = await Promise.all(
    bom.map((item) => analyzeOne(client, item, approved)),
  );
  return Response.json({ mode: "live", results });
};
