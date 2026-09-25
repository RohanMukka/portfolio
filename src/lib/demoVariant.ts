import { useEffect, useState } from "react";

// Temporary: lets the owner compare design options locally. The choice lives
// in the URL (?certs=timeline) so a reload keeps it. Remove once chosen.
const EVENT = "demo-variant-change";

const read = (key: string, fallback: string) =>
  new URLSearchParams(window.location.search).get(key) ?? fallback;

export const setDemoVariant = (key: string, value: string) => {
  const params = new URLSearchParams(window.location.search);
  params.set(key, value);
  history.replaceState(null, "", `${window.location.pathname}?${params}${window.location.hash}`);
  window.dispatchEvent(new Event(EVENT));
};

export const useDemoVariant = <T extends string>(key: string, fallback: T): T => {
  const [value, setValue] = useState(() => read(key, fallback) as T);
  useEffect(() => {
    const onChange = () => setValue(read(key, fallback) as T);
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, [key, fallback]);
  return value;
};
