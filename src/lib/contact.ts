// Where to reach Rohan, shared by the hero's link row and Contact.
export const EMAIL = "rohanmukka07@gmail.com";
export const GITHUB_URL = "https://github.com/rohanmukka";
export const LINKEDIN_URL = "https://linkedin.com/in/rohanmukka";

// Copies the address. False when the browser blocks the clipboard, so the
// caller can fall back to the mailto link.
export const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(EMAIL);
    return true;
  } catch {
    return false;
  }
};
