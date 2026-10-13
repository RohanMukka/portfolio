export type Theme = "light" | "dark";

// The site opens dark. The key is new with the dark-first design, so a choice
// saved on the old light-first site doesn't carry over. index.html applies the
// saved theme before the first paint, so the page never flashes the other one.
const KEY = "color-theme";

export const currentTheme = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

export const setTheme = (theme: Theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  // Phones tint their browser bar to match the page.
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0a0a0d" : "#f4f1ea");
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // storage blocked: the choice lasts until the page closes
  }
};
