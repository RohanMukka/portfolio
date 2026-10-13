const probe = (attributes?: WebGLContextAttributes) =>
  document.createElement("canvas").getContext("webgl", attributes);

const release = (gl: WebGLRenderingContext | null) => gl?.getExtension("WEBGL_lose_context")?.loseContext();

const detect = (): boolean => {
  try {
    const fast = probe({ failIfMajorPerformanceCaveat: true });
    if (!fast) {
      const any = probe();
      release(any);
      return !!any;
    }
    const info = fast.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(fast.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    release(fast);
    return /SwiftShader|Basic Render|llvmpipe|Software/i.test(renderer);
  } catch {
    return false;
  }
};

// `?full` or `?lite` in the address forces a mode for the rest of the tab's
// visit, e.g. to check the full site on a machine without a graphics card.
const forced = (): boolean | undefined => {
  try {
    const query = new URLSearchParams(location.search);
    if (query.has("full")) sessionStorage.setItem("render-mode", "full");
    if (query.has("lite")) sessionStorage.setItem("render-mode", "lite");
    const mode = sessionStorage.getItem("render-mode");
    return mode === "full" ? false : mode === "lite" ? true : undefined;
  } catch {
    return undefined;
  }
};

let softwareRendering: boolean | undefined;

// True when the browser is drawing without a graphics card (software
// rendering, e.g. hardware acceleration switched off or a missing driver),
// where the page's heavier effects stutter; the page then runs in lite mode
// (see index.tsx). A WebGL context that refuses to start under
// `failIfMajorPerformanceCaveat` is the browser's own signal for that; the
// renderer's name catches the cases it lets through. Checked once.
export const isSoftwareRendering = (): boolean => (softwareRendering ??= forced() ?? detect());
