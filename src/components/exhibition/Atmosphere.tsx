import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function Atmosphere() {
  return (
    <>
      <div className="grain-layer" aria-hidden />
      <div className="vignette-layer" aria-hidden />
    </>
  );
}

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 220, damping: 30, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 30, mass: 0.4 });
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      setActive(Boolean(el?.closest("a,button,[data-cursor]")));
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden mix-blend-difference md:block"
      style={{ x: sx, y: sy }}
    >
      <motion.span
        className="block -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
        animate={{ width: active ? 44 : 8, height: active ? 44 : 8, opacity: active ? 0.35 : 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}
