import React, { useEffect, useState, useSyncExternalStore } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { currentTheme } from "../lib/theme";

// The live cards behind the footer's GitHub, LeetCode and Monkeytype links.
// This file (and the calendar library with it) is fetched the first time a
// visitor points at one of those links, and each card asks its own source
// only then, so none of it costs anything on page load.

export type CardKind = "github" | "leetcode" | "monkeytype";

const watchTheme = (fn: () => void) => {
  const seen = new MutationObserver(fn);
  seen.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => seen.disconnect();
};
const useTheme = () => useSyncExternalStore(watchTheme, currentTheme);

const Shell = ({ title, from, children }: { title: string; from: string; children: React.ReactNode }) => (
  <div className="p-4 rounded-2xl bg-bg-elevated border border-glass-border shadow-2xl">
    <p className="hud flex justify-between gap-4 mb-3">
      <span className="text-primary-text">{title}</span>
      <span className="text-primary-tertiary">{from}</span>
    </p>
    {children}
  </div>
);

// A year of contributions, in the brand's colours.
const GitHub = () => {
  const theme = useTheme();
  return (
    <Shell title="Contributions, last year" from="github.com/rohanmukka">
      <div className="flex justify-center text-primary-secondary">
        <GitHubCalendar
          username="rohanmukka"
          colorScheme={theme}
          theme={{ light: ["#e4e0d6", "#003399"], dark: ["#22222a", "#f97316"] }}
          fontSize={11}
          blockSize={5}
          blockMargin={2}
        />
      </div>
    </Shell>
  );
};

// LeetCode has no public API; this card is drawn by the open-source
// LeetCode-Stats-Card service from the public profile.
const LeetCode = () => {
  const theme = useTheme();
  return (
    <Shell title="Problems solved" from="leetcode.com/u/rohan_mukka">
      <img
        src={`https://leetcard.jacoblin.cool/rohan_mukka?theme=${theme}&font=Inter&ext=activity`}
        width={500}
        height={400}
        alt="LeetCode: problems solved by difficulty, and recent submissions"
        className="w-full h-auto rounded-xl"
      />
    </Shell>
  );
};

interface Best {
  wpm: number;
  acc: number;
}
interface Profile {
  personalBests: { time: Record<string, Best[] | undefined> };
  typingStats: { completedTests: number; timeTyping: number };
}

// Monkeytype's public profile endpoint: no key, and it allows any origin.
const MONKEYTYPE = "https://api.monkeytype.com/users/kunnu/profile";
const TIMES = ["15", "30", "60"];
const best = (runs: Best[] | undefined) => runs?.reduce<Best | null>((top, run) => (!top || run.wpm > top.wpm ? run : top), null) ?? null;

const Monkeytype = () => {
  const [profile, setProfile] = useState<Profile | "unavailable" | null>(null);
  useEffect(() => {
    fetch(MONKEYTYPE)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((body: { data?: Profile }) => setProfile(body.data?.personalBests?.time && body.data.typingStats ? body.data : "unavailable"))
      .catch(() => setProfile("unavailable"));
  }, []);

  return (
    <Shell title="Typing speed, personal bests" from="monkeytype.com/profile/kunnu">
      {profile === null && <p className="text-xs text-primary-tertiary">Asking Monkeytype…</p>}
      {profile === "unavailable" && <p className="text-xs text-primary-secondary">Monkeytype isn't answering right now.</p>}
      {profile && profile !== "unavailable" && (
        <>
          <div className="grid grid-cols-3 gap-2">
            {TIMES.map((time) => {
              const run = best(profile.personalBests.time[time]);
              return (
                <div key={time} className="rounded-xl border border-glass-border px-3 py-3 text-center">
                  <p className="hud text-primary-tertiary">{time} s</p>
                  <p className="mt-1 font-display font-bold text-2xl text-primary-text tabular-nums">
                    {run ? Math.round(run.wpm) : "—"}
                    <span className="ml-1 text-[10px] font-sans font-medium text-primary-tertiary">wpm</span>
                  </p>
                  <p className="text-[11px] text-primary-secondary tabular-nums">{run ? `${Math.round(run.acc)}% accurate` : "no test yet"}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-3 flex justify-between text-[11px] text-primary-secondary tabular-nums">
            <span>{profile.typingStats.completedTests.toLocaleString()} tests completed</span>
            <span>{Math.round(profile.typingStats.timeTyping / 3600)} hours typing</span>
          </p>
        </>
      )}
    </Shell>
  );
};

const CARDS: Record<CardKind, () => React.ReactElement> = { github: GitHub, leetcode: LeetCode, monkeytype: Monkeytype };

const FooterCard = ({ kind }: { kind: CardKind }) => {
  const Card = CARDS[kind];
  return <Card />;
};

export default FooterCard;
