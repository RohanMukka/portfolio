import React, { useEffect, useRef, useState } from "react";
import Background from "../components/Background";
import { isSoftwareRendering } from "../lib/rendering";
import type { Stage as StageApi, Theme } from "./scene";

export const loadStage = () => import("./scene");

const currentTheme = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

// Fixed WebGL canvas behind the whole page (see scene.ts). Without WebGL the
// page keeps its CSS background instead.
const WebGLStage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let stage: StageApi | null = null;
    let cancelled = false;
    const cleanups: (() => void)[] = [];

    loadStage()
      .then(({ createStage }) => {
        if (cancelled) return;
        try {
          stage = createStage(canvas, { theme: currentTheme(), mobile: window.matchMedia("(max-width: 767px)").matches });
        } catch {
          setFailed(true);
          return;
        }
        const s = stage;

        const resize = () => s.resize(window.innerWidth, window.innerHeight);
        resize();
        window.addEventListener("resize", resize);
        cleanups.push(() => window.removeEventListener("resize", resize));

        const themeWatch = new MutationObserver(() => s.setTheme(currentTheme()));
        themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        cleanups.push(() => themeWatch.disconnect());

        const onMove = (e: PointerEvent) => {
          if (e.pointerType === "touch") return;
          s.setPointer({ x: (e.clientX / window.innerWidth) * 2 - 1, y: -((e.clientY / window.innerHeight) * 2 - 1) });
        };
        const onOut = (e: PointerEvent) => {
          if (!e.relatedTarget) s.setPointer(null);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        document.addEventListener("pointerout", onOut);
        cleanups.push(() => {
          window.removeEventListener("pointermove", onMove);
          document.removeEventListener("pointerout", onOut);
        });

        s.start();
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
      stage?.dispose();
    };
  }, []);

  if (failed) return <Background />;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 -z-50 w-full h-full pointer-events-none transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
    />
  );
};

// In lite mode (no graphics card) the 3D floor gives way to the same soft
// glows painted once, which cost nothing to scroll past.
const Stage = () =>
  isSoftwareRendering() ? (
    <div className="lite-backdrop fixed inset-0 -z-50 pointer-events-none" aria-hidden="true" />
  ) : (
    <WebGLStage />
  );

export default Stage;
