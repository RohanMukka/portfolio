// The page-view count shown in the footer (api/views.ts). A browser's first
// visit adds one; later visits only read it.

const VISITED = "portfolioVisited";
const COUNT = "portfolioCount";

// The dev server answers /api/views with the live count (vite.config.ts); a
// production build opened on this machine has no /api at all.
const hasApi = () => import.meta.env.DEV || (location.hostname !== "localhost" && location.hostname !== "127.0.0.1");

// The count as of this browser's last visit, to show at once.
export const cachedViews = (): number | null => {
  try {
    const count = parseInt(localStorage.getItem(COUNT) ?? "", 10);
    return Number.isFinite(count) ? count : null;
  } catch {
    return null;
  }
};

// The current count, or null where it can't be read. Never invents one.
export const loadViews = async (): Promise<number | null> => {
  if (!hasApi()) return null;
  let visited = false;
  try {
    visited = localStorage.getItem(VISITED) !== null;
  } catch {
    // Storage is blocked: the visit counts, it just can't be remembered.
  }
  try {
    const res = await fetch("/api/views", { method: visited || import.meta.env.DEV ? "GET" : "POST" });
    if (!res.ok || !res.headers.get("content-type")?.includes("json")) return null;
    const data: { count?: unknown } = await res.json();
    if (typeof data.count !== "number") return null;
    try {
      localStorage.setItem(VISITED, "true");
      localStorage.setItem(COUNT, String(data.count));
    } catch {
      // as above
    }
    return data.count;
  } catch {
    return null;
  }
};
