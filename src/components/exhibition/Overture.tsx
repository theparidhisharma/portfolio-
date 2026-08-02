import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Magnetic } from "./Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Overture({ onEnter }: { onEnter: () => void }) {
  const [nameVisible, setNameVisible] = useState(false);
  const [enterVisible, setEnterVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const tx = useSpring(px, { stiffness: 60, damping: 22, mass: 0.8 });
  const ty = useSpring(py, { stiffness: 60, damping: 22, mass: 0.8 });

  useEffect(() => {
    const t1 = setTimeout(() => setNameVisible(true), 1200);
    const t2 = setTimeout(() => setEnterVisible(true), 4200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth - 0.5) * 26);
      py.set((e.clientY / window.innerHeight - 0.5) * 14);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [px, py]);

  const enter = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onEnter, 1300);
  };

  return (
    <motion.div
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          animate={{ opacity: leaving ? 0 : 1 }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <motion.h1
            className="display select-none text-[18vw] leading-none md:text-[13vw]"
            style={{ x: tx, y: ty }}
            initial={{ opacity: 0, letterSpacing: "0.5em", filter: "blur(14px)" }}
            animate={
              nameVisible
                ? {
                    opacity: leaving ? 0 : 1,
                    letterSpacing: "0.18em",
                    filter: "blur(0px)",
                    scale: leaving ? 1.12 : 1,
                  }
                : { opacity: 0, letterSpacing: "0.5em", filter: "blur(14px)" }
            }
            transition={{ duration: 2.6, ease: EASE }}
          >
            PARIDHI
          </motion.h1>

          <motion.div
            className="mt-14 h-[1px] w-[42vw] origin-center bg-border"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: nameVisible ? 1 : 0 }}
            transition={{ duration: 2.2, ease: EASE, delay: 0.4 }}
          />

          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: enterVisible && !leaving ? 1 : 0 }}
            transition={{ duration: 1.6, ease: EASE }}
          >
            <Magnetic
              onClick={enter}
              className="eyebrow px-8 py-4 text-foreground transition-opacity duration-700 hover:opacity-60"
            >
              Enter
            </Magnetic>
          </motion.div>
    </motion.div>
  );
}
