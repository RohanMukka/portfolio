import { vitals } from "./vitals";
import { isSoftwareRendering } from "./rendering";
import { stageState, stageStats } from "../stage/store";

// When a visit ends, sends its numbers to api/telemetry.ts, which only adds
// them to weekly bucket counts (X-Ray's "all visits" section reads those).
// Nothing identifies the visitor: no cookies, no IDs, and the server keeps
// neither the address nor the browser it came from. Production only.
export const startTelemetry = () => {
  if (!import.meta.env.PROD || location.hostname === "localhost" || location.hostname === "127.0.0.1") return;
  let sent = false;
  const send = () => {
    if (sent || document.visibilityState !== "hidden") return;
    sent = true;
    const modeMs = { ...stageStats.modeMs };
    if (stageStats.modeSince) modeMs[stageStats.mode] += performance.now() - stageStats.modeSince;
    const total = Object.values(modeMs).reduce((a, b) => a + b, 0);
    const body = {
      lcp: vitals.lcp,
      cls: vitals.cls,
      inp: vitals.inp,
      asleep: stageState.chapter >= 0 && total > 0 ? Math.round(((modeMs.asleep + modeMs.covered) / total) * 100) : null,
      stage: isSoftwareRendering() ? "lite" : stageState.chapter >= 0 ? "3d" : "none",
    };
    navigator.sendBeacon?.("/api/telemetry", new Blob([JSON.stringify(body)], { type: "application/json" }));
  };
  document.addEventListener("visibilitychange", send);
  window.addEventListener("pagehide", send);
};
