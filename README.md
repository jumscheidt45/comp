# BOM Price Agent

Claude-based agent that takes a Bill of Materials + your approved supplier list, searches the web, and surfaces the cheapest sourcing options — both on-list and off-list — alongside your current cost.

Built as a Cloudflare Pages app: static HTML/CSS/JS frontend, a Pages Function (`functions/api/analyze.ts`) that calls Claude with the web-search tool. Same code runs locally via `wrangler pages dev` and deploys to Cloudflare Pages with `wrangler pages deploy`.

## Local development

```sh
npm install
cp .dev.vars.example .dev.vars   # MOCK_MODE=true by default — no API key needed
npm run dev                       # http://localhost:8788
```

The app runs in **mock mode** out of the box: it returns realistic placeholder alternatives so you can iterate on the UI without an API key. To run real searches:

1. Get an API key at https://console.anthropic.com
2. Edit `.dev.vars` — set `ANTHROPIC_API_KEY=sk-ant-...` and `MOCK_MODE=false`
3. Restart `npm run dev`

## How it works

1. User pastes/uploads/enters a BOM and a list of approved suppliers.
2. Frontend POSTs to `/api/analyze`.
3. The Pages Function calls Claude (Opus 4.7) per line item with the `web_search` tool enabled and a JSON-schema-constrained output, asking for both approved and off-list alternatives.
4. The function tags each alternative as approved/off-list, computes potential savings vs the current supplier, and returns the result.
5. Frontend renders a per-line-item table with the cheapest option highlighted.

## Deploying to Cloudflare Pages

```sh
npx wrangler pages deploy .
npx wrangler pages secret put ANTHROPIC_API_KEY
```

Set `MOCK_MODE` to anything other than `true` (or omit it) for production.

## BOM input formats

CSV / XLSX / paste / manual entry, all with these columns (header aliases accepted):

| Canonical             | Aliases                                  |
| --------------------- | ---------------------------------------- |
| `part_number`         | `part`, `sku`, `mpn`, `partnumber`       |
| `description`         | `desc`, `name`, `product`                |
| `qty`                 | `quantity`, `count`                      |
| `current_supplier`    | `supplier`, `vendor`, `manufacturer`     |
| `current_unit_cost`   | `unit_cost`, `price`, `cost`             |
