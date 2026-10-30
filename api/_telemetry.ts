/**
 * Shared by api/telemetry.ts (records a visit) and api/stats.ts (reads the
 * last week). Files starting with "_" aren't routes on Vercel.
 *
 * A visit's numbers are only ever added to per-day bucket counts in Upstash
 * Redis: nothing per visitor is stored (no IP address, no browser string,
 * no cookie or ID), and days older than two weeks expire.
 */

// Upper edges of each metric's buckets; a value past the last edge counts as "over".
export const BUCKETS: Record<string, { edges: number[]; max: number }> = {
  lcp: { edges: [100, 200, 300, 500, 800, 1200, 1800, 2500, 4000, 6000, 10000], max: 60000 },
  inp: { edges: [16, 32, 50, 100, 200, 300, 500, 800, 1200], max: 60000 },
  cls: { edges: [0.01, 0.025, 0.05, 0.1, 0.15, 0.25, 0.5, 1], max: 10 },
  asleep: { edges: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100], max: 100 },
};
const STAGES = new Set(["3d", "lite", "none"]);
const KEEP_SECONDS = 14 * 24 * 3600;

/** The bits of Upstash's client used here, so tests can pass a stand-in. */
export interface Store {
  hincrby(key: string, field: string, by: number): Promise<unknown>;
  incr(key: string): Promise<unknown>;
  expire(key: string, seconds: number): Promise<unknown>;
  hgetall(key: string): Promise<Record<string, unknown> | null>;
  get(key: string): Promise<unknown>;
}

const key = (day: string, name: string) => `telemetry:${day}:${name}`;
export const dayOf = (date: Date) => date.toISOString().slice(0, 10);

const bucketOf = (edges: number[], value: number) => {
  const i = edges.findIndex((edge) => value <= edge);
  return i === -1 ? "over" : String(i);
};

/** Adds one visit's numbers to the day's buckets; ignores anything malformed. Returns what was counted. */
export const record = async (store: Store, body: unknown, day: string) => {
  if (!body || typeof body !== "object") return [];
  const input = body as Record<string, unknown>;
  const counted: string[] = [];
  const writes: Promise<unknown>[] = [];
  for (const [name, { edges, max }] of Object.entries(BUCKETS)) {
    const value = input[name];
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > max) continue;
    writes.push(store.hincrby(key(day, name), bucketOf(edges, value), 1), store.expire(key(day, name), KEEP_SECONDS));
    counted.push(name);
  }
  const stage = typeof input.stage === "string" && STAGES.has(input.stage) ? input.stage : null;
  if (stage) writes.push(store.hincrby(key(day, "stage"), stage, 1), store.expire(key(day, "stage"), KEEP_SECONDS));
  if (counted.length || stage) writes.push(store.incr(key(day, "n")), store.expire(key(day, "n"), KEEP_SECONDS));
  await Promise.all(writes);
  return counted;
};

/** The last `days` days: visits, and for each metric the 75th percentile as a bucket's upper edge (null past the last edge). */
export const summarize = async (store: Store, today: Date, days = 7) => {
  const dates = Array.from({ length: days }, (_, i) => dayOf(new Date(today.getTime() - i * 86400000)));
  let n = 0;
  for (const day of dates) n += Number(await store.get(key(day, "n"))) || 0;
  const metrics: Record<string, { p75: number | null; count: number }> = {};
  for (const [name, { edges }] of Object.entries(BUCKETS)) {
    const counts = new Array(edges.length + 1).fill(0);
    for (const day of dates) {
      const hash = (await store.hgetall(key(day, name))) ?? {};
      for (const [field, value] of Object.entries(hash)) counts[field === "over" ? edges.length : Number(field)] += Number(value) || 0;
    }
    const count = counts.reduce((a, b) => a + b, 0);
    let p75: number | null = null;
    if (count) {
      let seen = 0;
      const i = counts.findIndex((c) => (seen += c) >= count * 0.75);
      p75 = i < edges.length ? edges[i] : null;
    }
    metrics[name] = { p75, count };
  }
  return { days, n, metrics };
};
