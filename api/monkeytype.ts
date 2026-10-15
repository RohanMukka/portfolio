/**
 * Typing stats for the footer's Monkeytype card.
 *
 * Monkeytype's API needs an ApeKey, which used to sit in the client bundle.
 * It now lives in a Vercel environment variable (MONKEYTYPE_APE_KEY) and is
 * only ever read here, on the server.
 *
 *   GET /api/monkeytype -> { pb, stats }
 *     pb:    personal bests in time mode, keyed by duration ("15", "30", ...)
 *     stats: started and completed test counts
 */

const API = "https://api.monkeytype.com";

interface ApiResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
}

export default async function handler(_req: unknown, res: ApiResponse) {
  const key = process.env.MONKEYTYPE_APE_KEY;

  if (!key) {
    res.setHeader("Cache-Control", "no-store");
    res.status(500).json({ error: "Monkeytype is not configured." });
    return;
  }

  const get = async (path: string) => {
    const r = await fetch(`${API}${path}`, { headers: { Authorization: `ApeKey ${key}` } });
    if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`);
    return (await r.json()).data;
  };

  try {
    const [pb, stats] = await Promise.all([get("/users/personalBests?mode=time"), get("/users/stats")]);

    // Stats change slowly and ApeKeys are rate limited, so let Vercel's edge
    // answer most visits from cache instead of calling Monkeytype each time.
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json({ pb, stats });
  } catch (error) {
    console.error("monkeytype stats failed", error);
    res.setHeader("Cache-Control", "no-store");
    res.status(502).json({ error: "Monkeytype unavailable." });
  }
}
