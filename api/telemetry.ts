import { Redis } from "@upstash/redis";
import { dayOf, record } from "./_telemetry";

/**
 * One visit's numbers, sent by the page as it closes (src/lib/telemetry.ts):
 *
 *   POST /api/telemetry  { lcp, cls, inp, asleep, stage }  -> 204
 *
 * Only bucket counts are kept (see _telemetry.ts). Always answers 204, so a
 * bad or blocked request costs the page nothing.
 */

interface ApiRequest {
  method?: string;
  body?: unknown;
}

interface ApiResponse {
  status(code: number): ApiResponse;
  end(): void;
  setHeader(name: string, value: string): void;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end();
    return;
  }
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    try {
      const body = typeof req.body === "string" && req.body.length < 2048 ? JSON.parse(req.body) : req.body;
      await record(new Redis({ url, token }), body, dayOf(new Date()));
    } catch (error) {
      console.error("telemetry not recorded", error);
    }
  }
  res.status(204).end();
}
