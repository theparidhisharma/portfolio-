import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";

export function SmoothScroll() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const lenisRef = useRef<{
    scrollTo: (
      target: number | string,
      options?: {
        immediate?: boolean;
      },
    ) => void;
    raf: (time: number) => void;
    destroy: () => void;
  } | null>(null);

  // Create Lenis once
  useEffect(() => {
    let raf = 0;
    let cancelled = false;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

      const instance = new Lenis({
        duration: 1.5,
        easing: (t: number) =>
          Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      lenisRef.current = instance;

      const loop = (time: number) => {
        instance.raf(time);
        raf = requestAnimationFrame(loop);
      };

      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);

      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll whenever the route changes
  useEffect(() => {
    if (!lenisRef.current) return;

    // Don't interfere with hash navigation on the homepage.
    if (window.location.hash) return;

    lenisRef.current.scrollTo(0, {
      immediate: true,
    });
  }, [pathname]);

  return null;
}