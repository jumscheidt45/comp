// Market reference data: Thelander and Radford compensation benchmarks
// These are illustrative reference ranges for a biotech/life sciences context

export const THELANDER_BANDS = ["< $15M", "$15–90M", "None"];
export const RADFORD_TIERS = ["Tier 1", "Tier 2", "Tier 3", "US Other", "None"];

// Thelander data keyed by grade, then band
// Fields: p50TotalCash, p25TotalCash, p75TotalCash, equityPct
export const THELANDER = {
  1: {
    "< $15M":   { p50TotalCash: 62000,  p25TotalCash: 55000,  p75TotalCash: 70000,  equityPct: 0.02 },
    "$15–90M":  { p50TotalCash: 68000,  p25TotalCash: 60000,  p75TotalCash: 76000,  equityPct: 0.01 }
  },
  2: {
    "< $15M":   { p50TotalCash: 78000,  p25TotalCash: 70000,  p75TotalCash: 88000,  equityPct: 0.03 },
    "$15–90M":  { p50TotalCash: 85000,  p25TotalCash: 76000,  p75TotalCash: 95000,  equityPct: 0.02 }
  },
  3: {
    "< $15M":   { p50TotalCash: 98000,  p25TotalCash: 88000,  p75TotalCash: 112000, equityPct: 0.05 },
    "$15–90M":  { p50TotalCash: 108000, p25TotalCash: 96000,  p75TotalCash: 122000, equityPct: 0.04 }
  },
  4: {
    "< $15M":   { p50TotalCash: 125000, p25TotalCash: 112000, p75TotalCash: 140000, equityPct: 0.08 },
    "$15–90M":  { p50TotalCash: 138000, p25TotalCash: 124000, p75TotalCash: 155000, equityPct: 0.06 }
  },
  5: {
    "< $15M":   { p50TotalCash: 162000, p25TotalCash: 145000, p75TotalCash: 182000, equityPct: 0.12 },
    "$15–90M":  { p50TotalCash: 178000, p25TotalCash: 160000, p75TotalCash: 200000, equityPct: 0.10 }
  },
  6: {
    "< $15M":   { p50TotalCash: 205000, p25TotalCash: 185000, p75TotalCash: 230000, equityPct: 0.18 },
    "$15–90M":  { p50TotalCash: 225000, p25TotalCash: 202000, p75TotalCash: 252000, equityPct: 0.15 }
  },
  7: {
    "< $15M":   { p50TotalCash: 268000, p25TotalCash: 240000, p75TotalCash: 300000, equityPct: 0.25 },
    "$15–90M":  { p50TotalCash: 295000, p25TotalCash: 265000, p75TotalCash: 330000, equityPct: 0.20 }
  },
  8: {
    "< $15M":   { p50TotalCash: 365000, p25TotalCash: 325000, p75TotalCash: 420000, equityPct: 0.40 },
    "$15–90M":  { p50TotalCash: 405000, p25TotalCash: 360000, p75TotalCash: 460000, equityPct: 0.30 }
  }
};

// Radford data keyed by grade, then tier
// Fields: p50TotalCash, p25TotalCash, p75TotalCash, p50Base, sampleSize
export const RADFORD = {
  1: {
    "Tier 1":   { p50TotalCash: 72000,  p25TotalCash: 64000,  p75TotalCash: 80000,  p50Base: 68000,  sampleSize: 1240 },
    "Tier 2":   { p50TotalCash: 66000,  p25TotalCash: 58000,  p75TotalCash: 74000,  p50Base: 63000,  sampleSize: 890 },
    "Tier 3":   { p50TotalCash: 60000,  p25TotalCash: 53000,  p75TotalCash: 68000,  p50Base: 57000,  sampleSize: 620 },
    "US Other": { p50TotalCash: 56000,  p25TotalCash: 50000,  p75TotalCash: 64000,  p50Base: 54000,  sampleSize: 430 }
  },
  2: {
    "Tier 1":   { p50TotalCash: 92000,  p25TotalCash: 82000,  p75TotalCash: 102000, p50Base: 85000,  sampleSize: 1580 },
    "Tier 2":   { p50TotalCash: 84000,  p25TotalCash: 75000,  p75TotalCash: 94000,  p50Base: 78000,  sampleSize: 1120 },
    "Tier 3":   { p50TotalCash: 77000,  p25TotalCash: 68000,  p75TotalCash: 86000,  p50Base: 72000,  sampleSize: 780 },
    "US Other": { p50TotalCash: 72000,  p25TotalCash: 64000,  p75TotalCash: 80000,  p50Base: 68000,  sampleSize: 540 }
  },
  3: {
    "Tier 1":   { p50TotalCash: 118000, p25TotalCash: 105000, p75TotalCash: 132000, p50Base: 108000, sampleSize: 2100 },
    "Tier 2":   { p50TotalCash: 108000, p25TotalCash: 96000,  p75TotalCash: 120000, p50Base: 99000,  sampleSize: 1480 },
    "Tier 3":   { p50TotalCash: 98000,  p25TotalCash: 87000,  p75TotalCash: 110000, p50Base: 90000,  sampleSize: 1020 },
    "US Other": { p50TotalCash: 92000,  p25TotalCash: 82000,  p75TotalCash: 103000, p50Base: 85000,  sampleSize: 710 }
  },
  4: {
    "Tier 1":   { p50TotalCash: 148000, p25TotalCash: 132000, p75TotalCash: 168000, p50Base: 135000, sampleSize: 1860 },
    "Tier 2":   { p50TotalCash: 136000, p25TotalCash: 120000, p75TotalCash: 152000, p50Base: 124000, sampleSize: 1320 },
    "Tier 3":   { p50TotalCash: 124000, p25TotalCash: 110000, p75TotalCash: 140000, p50Base: 114000, sampleSize: 920 },
    "US Other": { p50TotalCash: 116000, p25TotalCash: 103000, p75TotalCash: 130000, p50Base: 106000, sampleSize: 640 }
  },
  5: {
    "Tier 1":   { p50TotalCash: 195000, p25TotalCash: 175000, p75TotalCash: 220000, p50Base: 172000, sampleSize: 1540 },
    "Tier 2":   { p50TotalCash: 178000, p25TotalCash: 158000, p75TotalCash: 198000, p50Base: 158000, sampleSize: 1080 },
    "Tier 3":   { p50TotalCash: 162000, p25TotalCash: 144000, p75TotalCash: 182000, p50Base: 145000, sampleSize: 760 },
    "US Other": { p50TotalCash: 152000, p25TotalCash: 135000, p75TotalCash: 170000, p50Base: 136000, sampleSize: 520 }
  },
  6: {
    "Tier 1":   { p50TotalCash: 248000, p25TotalCash: 222000, p75TotalCash: 278000, p50Base: 210000, sampleSize: 1180 },
    "Tier 2":   { p50TotalCash: 225000, p25TotalCash: 200000, p75TotalCash: 252000, p50Base: 192000, sampleSize: 840 },
    "Tier 3":   { p50TotalCash: 205000, p25TotalCash: 182000, p75TotalCash: 230000, p50Base: 176000, sampleSize: 580 },
    "US Other": { p50TotalCash: 192000, p25TotalCash: 170000, p75TotalCash: 215000, p50Base: 165000, sampleSize: 400 }
  },
  7: {
    "Tier 1":   { p50TotalCash: 325000, p25TotalCash: 290000, p75TotalCash: 365000, p50Base: 265000, sampleSize: 820 },
    "Tier 2":   { p50TotalCash: 295000, p25TotalCash: 262000, p75TotalCash: 330000, p50Base: 242000, sampleSize: 580 },
    "Tier 3":   { p50TotalCash: 268000, p25TotalCash: 238000, p75TotalCash: 300000, p50Base: 222000, sampleSize: 400 },
    "US Other": { p50TotalCash: 250000, p25TotalCash: 222000, p75TotalCash: 280000, p50Base: 208000, sampleSize: 280 }
  },
  8: {
    "Tier 1":   { p50TotalCash: 445000, p25TotalCash: 395000, p75TotalCash: 505000, p50Base: 340000, sampleSize: 540 },
    "Tier 2":   { p50TotalCash: 405000, p25TotalCash: 358000, p75TotalCash: 458000, p50Base: 312000, sampleSize: 380 },
    "Tier 3":   { p50TotalCash: 368000, p25TotalCash: 325000, p75TotalCash: 418000, p50Base: 285000, sampleSize: 260 },
    "US Other": { p50TotalCash: 342000, p25TotalCash: 302000, p75TotalCash: 388000, p50Base: 268000, sampleSize: 180 }
  }
};
