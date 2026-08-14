import { Redis } from "@upstash/redis";

/**
 * Page view counter, backed by Upstash Redis.
 *
 * Replaces counterapi.dev, whose v1 API was retired and now returns 410 for
 * every request. The credentials live in Vercel environment variables and are
 * only ever read here, on the server, so nothing sensitive reaches the bundle.
 *
 *   GET  /api/views  -> read the count without changing it
 *   POST /api/views  -> increment, then return the new count
 */

const KEY = "portfolio:views";

/** Carried over from the retired counterapi counter, which last read 333. */
const SEED = 333;

interface ApiRequest {
  method?: string;
}

interface ApiResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  // Never cache: a cached response would freeze the counter at one value.
  res.setHeader("Cache-Control", "no-store");

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    res.status(500).json({ error: "Counter storage is not configured." });
    return;
  }

  const redis = new Redis({ url, token });

  try {
    // Seed on first use so the count continues from the old total instead of
    // restarting at zero. setnx only writes when the key is absent, so this is
    // a no-op on every request after the first.
    await redis.setnx(KEY, SEED);

    const count =
      req.method === "POST"
        ? await redis.incr(KEY)
        : Number(await redis.get<number>(KEY)) || SEED;

    res.status(200).json({ count });
  } catch (error) {
    console.error("views counter failed", error);
    res.status(502).json({ error: "Counter storage unavailable." });
  }
}
