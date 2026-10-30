import { Redis } from "@upstash/redis";
import { summarize } from "./_telemetry";

/**
 * The last seven days of visits, for X-Ray (src/xray/XRay.tsx):
 *
 *   GET /api/stats -> { days, n, metrics: { lcp, inp, cls, asleep: { p75, count } } }
 *
 * p75 is the upper edge of the bucket holding the 75th percentile (null when
 * it's past the last edge). Cached at the edge for five minutes.
 */

interface ApiResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
}

export default async function handler(_req: unknown, res: ApiResponse) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    res.setHeader("Cache-Control", "no-store");
    res.status(500).json({ error: "Telemetry storage is not configured." });
    return;
  }
  try {
    const summary = await summarize(new Redis({ url, token }), new Date());
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    res.status(200).json(summary);
  } catch (error) {
    console.error("stats failed", error);
    res.setHeader("Cache-Control", "no-store");
    res.status(502).json({ error: "Telemetry storage unavailable." });
  }
}
