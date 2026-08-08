import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Mode = "dark" | "light";

const STORAGE_KEY = "paridhi-theme";

const ThemeContext = createContext<{ mode: Mode; toggle: () => void }>({
  mode: "dark",
  toggle: () => {},
});

/** Inline pre-paint script: applies the stored theme before first paint. */
export const themeBootstrapScript = `(function(){try{var m=localStorage.getItem('${STORAGE_KEY}');if(!m){m=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(m);document.documentElement.style.colorScheme=m;}catch(e){}})();`;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Mode | null;
    const initial: Mode =
      stored ?? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    setMode(initial);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(mode);
    root.style.colorScheme = mode;
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next: Mode = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  return <ThemeContext.Provider value={{ mode, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * Editorial theme switch — a hairline capsule with a travelling ink dot.
 * Labelled DARK / LIGHT in the same marker type used across the exhibition.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { mode, toggle } = useTheme();
  const isLight = mode === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      aria-pressed={isLight}
      className={`group inline-flex items-center gap-3 ${className}`}
    >
      <span className="marker hidden transition-opacity duration-500 group-hover:opacity-60 md:block">
        {isLight ? "Light" : "Dark"}
      </span>
      <span className="relative inline-flex h-[18px] w-[38px] items-center border border-border px-[3px] transition-colors duration-500 group-hover:border-foreground/50">
        <span
          className="block h-[10px] w-[10px] rounded-full bg-foreground transition-transform duration-700"
          style={{
            transform: isLight ? "translateX(18px)" : "translateX(0)",
            transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </span>
    </button>
  );
}
