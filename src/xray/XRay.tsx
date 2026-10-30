import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { setXRayOpen } from "../lib/xray";
import { vitals } from "../lib/vitals";
import { isSoftwareRendering } from "../lib/rendering";
import { stageState, stageStats } from "../stage/store";

// X-Ray: the page measuring itself, live. Every number comes from the page's
// own instruments (the stage's clock and counters in stage/store.ts, the
// browser's performance entries in lib/vitals.ts, the site's telemetry in
// api/stats.ts); where a browser doesn't expose something, it says so rather
// than guess. Loaded only when opened (?xray, the X key, or About's link).
// While open it refreshes four times a second, which is itself a little
// work the page wouldn't otherwise do.

const MODE_COLOURS: Record<string, string> = {
  active: "var(--accent)",
  ambient: "#3b6cff",
  dozing: "#e0457b",
  asleep: "var(--text-tertiary)",
  covered: "var(--text-tertiary)",
};
const MODE_NOTES: Record<string, string> = {
  active: "drawing: something is changing",
  ambient: "drawing: the shapes' drift",
  dozing: "the drift slowing to a stop",
  asleep: "not drawing at all",
  covered: "a case study covers it: nothing to draw",
};

type Fleet = { n: number; metrics: Record<string, { p75: number | null }> } | "none" | "unavailable" | null;

const ms = (v: number | null | undefined, digits = 1) => (v === null || v === undefined ? "—" : `${v.toFixed(digits)} ms`);
const mb = (bytes: number) => `${(bytes / 1048576).toFixed(1)} MB`;

const Row = ({ label, value, note }: { label: string; value: React.ReactNode; note?: string }) => (
  <div className="flex items-baseline justify-between gap-4 py-1">
    <span className="text-primary-secondary">{label}</span>
    <span className="text-right text-primary-text">
      {value}
      {note && <span className="block normal-case tracking-normal text-[10px] text-primary-tertiary">{note}</span>}
    </span>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="py-3 border-t border-primary-text/10">
    <h3 className="mb-1 font-mono font-medium tracking-[0.18em] text-accent">{title}</h3>
    {children}
  </section>
);

// The last minute of the clock's modes, as a strip of colour.
const ModeStrip = ({ now }: { now: number }) => {
  const from = now - 60000;
  const spans = stageStats.history.map((h, i) => {
    const start = Math.max(h.at, from);
    const end = stageStats.history[i + 1]?.at ?? now;
    return { mode: h.mode, left: ((start - from) / 60000) * 100, width: ((end - start) / 60000) * 100 };
  });
  return (
    <div className="relative h-2.5 mt-2 rounded-sm overflow-hidden bg-primary-text/10" aria-hidden="true">
      {spans.filter((s) => s.width > 0).map((s, i) => (
        <span key={i} className="absolute inset-y-0" style={{ left: `${s.left}%`, width: `${s.width}%`, background: MODE_COLOURS[s.mode] }} />
      ))}
    </div>
  );
};

// CPU time of the last frames drawn, newest on the right.
const Sparkline = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { cpuMs, frames } = stageStats;
    const n = Math.min(frames, cpuMs.length);
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const style = getComputedStyle(canvas);
    // Scaled to the slowest recent frame; a line marks 16.7 ms (one frame at
    // 60 fps) when it's in range.
    let top = 1;
    for (let i = 0; i < n; i++) top = Math.max(top, cpuMs[i] * 1.2);
    if (top >= 16.7) {
      ctx.strokeStyle = style.getPropertyValue("--text-tertiary");
      ctx.beginPath();
      ctx.moveTo(0, h - (16.7 / top) * h);
      ctx.lineTo(w, h - (16.7 / top) * h);
      ctx.stroke();
    }
    ctx.fillStyle = style.getPropertyValue("--accent");
    for (let i = 0; i < n; i++) {
      const v = cpuMs[(frames - n + i) % cpuMs.length];
      const bar = Math.min(h, (v / top) * h);
      ctx.fillRect((i / cpuMs.length) * w + (w - (n / cpuMs.length) * w), h - bar, Math.max(1, w / cpuMs.length - 0.5), bar);
    }
  });
  return <canvas ref={ref} width={560} height={72} className="mt-2 w-full h-9" aria-label="CPU time of recent frames, scaled to the slowest" role="img" />;
};

const XRay = () => {
  const [now, setNow] = useState(performance.now());
  const [fleet, setFleet] = useState<Fleet>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(performance.now()), 250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setXRayOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => (r.ok && r.headers.get("content-type")?.includes("json") ? r.json() : Promise.reject()))
      .then((data: { n: number; metrics: Record<string, { p75: number | null }> }) => setFleet(data.n ? data : "none"))
      .catch(() => setFleet("unavailable"));
  }, []);

  const hasStage = stageState.chapter >= 0;
  const recent = Array.from(stageStats.cpuMs.slice(0, Math.min(stageStats.frames, stageStats.cpuMs.length))).sort((a, b) => a - b);
  const cpuP50 = recent.length ? recent[Math.floor(recent.length * 0.5)] : null;
  const cpuP95 = recent.length ? recent[Math.floor(recent.length * 0.95)] : null;
  const modeMs = { ...stageStats.modeMs };
  if (stageStats.modeSince) modeMs[stageStats.mode] += now - stageStats.modeSince;
  const total = Object.values(modeMs).reduce((a, b) => a + b, 0);
  const asleep = total ? ((modeMs.asleep + modeMs.covered) / total) * 100 : 0;
  const heap = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize;

  return (
    <aside
      aria-label="X-Ray: live measurements of this page"
      className="fixed z-[90] top-20 right-4 bottom-4 w-[min(340px,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-2xl border border-primary-text/15 bg-background/92 backdrop-blur-xl shadow-2xl px-5 pb-4 hud text-[10px] md:text-[10px]"
      data-lenis-prevent
    >
      <header className="sticky top-0 -mx-5 px-5 pt-4 pb-3 bg-background/95 flex items-start justify-between gap-3">
        <div>
          <p className="text-primary-text text-xs">X-Ray</p>
          <p className="mt-1 normal-case tracking-normal font-sans text-[11px] text-primary-secondary">I don't trust a system I can't measure.</p>
        </div>
        <button type="button" onClick={() => setXRayOpen(false)} aria-label="Close X-Ray" className="grid place-items-center w-7 h-7 rounded-full border border-primary-text/15 text-primary-text hover:border-accent hover:text-accent">
          <X size={13} />
        </button>
      </header>

      <Section title="3D stage · clock">
        {hasStage ? (
          <>
            <Row
              label="Now"
              value={<span style={{ color: MODE_COLOURS[stageStats.mode] }}>● {stageStats.mode}</span>}
              note={MODE_NOTES[stageStats.mode]}
            />
            <Row label="Woken by" value={stageStats.reason || "—"} />
            <Row label="Time scale" value={stageStats.timeScale.toFixed(2)} note="how fast the shapes' own motion runs" />
            <Row label="Asleep this visit" value={`${asleep.toFixed(0)}%`} />
            <ModeStrip now={now} />
            <p className="mt-1 text-primary-tertiary">last 60 s</p>
          </>
        ) : (
          <p className="py-1 normal-case tracking-normal text-primary-secondary">
            {isSoftwareRendering() ? "No 3D stage: this browser draws without a graphics card, so the site runs its lite version." : "The 3D stage hasn't loaded yet."}
          </p>
        )}
      </Section>

      {hasStage && (
        <Section title="Frame">
          <Row label="CPU, median / p95" value={`${ms(cpuP50)} / ${ms(cpuP95)}`} note="preparing and sending each frame" />
          <Row label="GPU" value={stageStats.gpuTimers ? ms(stageStats.gpuMs, 2) : "not exposed"} note={stageStats.gpuTimers ? "last timed frame" : "this browser has no WebGL timer queries"} />
          <Row label="Draw calls" value={stageStats.drawCalls} note="in the last frame" />
          <Row label="Frames drawn" value={stageStats.frames.toLocaleString()} />
          <Sparkline />
        </Section>
      )}

      {hasStage && (
        <Section title="Pipeline">
          {stageStats.passes.map((p) => (
            <React.Fragment key={p.name}>
              <Row label={p.name} value={`${p.width}×${p.height}`} note={`${p.draws} draw${p.draws > 1 ? "s" : ""}`} />
            </React.Fragment>
          ))}
        </Section>
      )}

      <Section title="Memory">
        {hasStage && <Row label="GPU buffers" value={mb(stageStats.gpuBytes)} note="points and the lens's render targets" />}
        <Row label="JS heap" value={heap ? mb(heap) : "not exposed"} note={heap ? "Chromium only" : "this browser doesn't report it"} />
      </Section>

      <Section title="This visit">
        <Row label="LCP" value={ms(vitals.lcp, 0)} note="largest contentful paint" />
        <Row label="CLS" value={vitals.cls.toFixed(3)} note="layout shift" />
        <Row label="INP" value={vitals.inp === null ? "no interaction yet" : ms(vitals.inp, 0)} note="slowest interaction so far" />
      </Section>

      <Section title="All visits, last 7 days">
        {fleet === null && <p className="py-1 text-primary-tertiary">loading…</p>}
        {fleet === "unavailable" && <p className="py-1 normal-case tracking-normal text-primary-secondary">Not available here (it runs on the live site).</p>}
        {fleet === "none" && <p className="py-1 normal-case tracking-normal text-primary-secondary">No visits recorded yet.</p>}
        {typeof fleet === "object" && fleet !== null && (
          <>
            <Row label="Visits measured" value={fleet.n.toLocaleString()} />
            <Row label="LCP, p75" value={fleet.metrics.lcp?.p75 != null ? `≤ ${fleet.metrics.lcp.p75} ms` : "—"} />
            <Row label="INP, p75" value={fleet.metrics.inp?.p75 != null ? `≤ ${fleet.metrics.inp.p75} ms` : "—"} />
            <Row label="CLS, p75" value={fleet.metrics.cls?.p75 != null ? `≤ ${fleet.metrics.cls.p75}` : "—"} />
            <Row label="Stage asleep, p75" value={fleet.metrics.asleep?.p75 != null ? `≤ ${fleet.metrics.asleep.p75}%` : "—"} />
          </>
        )}
        <p className="mt-2 normal-case tracking-normal font-sans text-[10px] text-primary-tertiary">
          Counted in buckets, with nothing that identifies a visitor: no cookies, no IP addresses.
        </p>
      </Section>
    </aside>
  );
};

export default XRay;
