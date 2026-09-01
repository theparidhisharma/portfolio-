import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Magnetic } from "./Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

const NAME = "PARIDHI".split("");
const SLATS = 7;

const MANIFEST = [
  "Unpacking the crate",
  "Levelling the walls",
  "Hanging Feature_01",
  "Hanging Feature_02",
  "Hanging Feature_03",
  "Dimming the room",
] as const;

export function Overture({ onEnter }: { onEnter: () => void }) {
  const [revealed, setRevealed] = useState(false);
  const [enterVisible, setEnterVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [count, setCount] = useState(0);

  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const tx = useSpring(px, {
    stiffness: 55,
    damping: 20,
    mass: 0.9,
  });

  const ty = useSpring(py, {
    stiffness: 55,
    damping: 20,
    mass: 0.9,
  });

  useEffect(() => {
    const t1 = setTimeout(() => setRevealed(true), 700);
    const t2 = setTimeout(() => setEnterVisible(true), 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const start = performance.now();
    const duration = 4000;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);

      setCount(Math.round(eased * 100));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth - 0.5) * 26);
      py.set((e.clientY / window.innerHeight - 0.5) * 14);
    };

    window.addEventListener("pointermove", move);

    return () => window.removeEventListener("pointermove", move);
  }, [px, py]);

  const done = useMemo(
    () =>
      MANIFEST.map(
        (_, i) =>
          count >= Math.round(((i + 1) / MANIFEST.length) * 96),
      ),
    [count],
  );

  const enter = () => {
    if (leaving) return;

    setLeaving(true);

    setTimeout(() => {
      onEnter();
    }, 1500);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[80] overflow-hidden bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{
        duration: 0.6,
        ease: EASE,
        delay: leaving ? 0.9 : 0,
      }}
    >
      {/* ── the plate ─────────────────────────────────────────────────── */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
        <div className="relative flex h-[46svh] items-center justify-center overflow-hidden bg-foreground">

          {/* ── portrait atmosphere ──────────────────────────────────── */}
          <motion.img
            src="/paridhi-night.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover grayscale"
            style={{
              objectPosition: "50% 70%",
            }}
            initial={{
              opacity: 0,
              scale: 1.04,
            }}
            animate={{
              opacity: revealed ? 0.52 : 0,
              scale: leaving ? 1.08 : 1,
            }}
            transition={{
              opacity: {
                duration: 1.8,
                ease: EASE,
              },
              scale: {
                duration: 1.8,
                ease: EASE,
              },
            }}
          />

          {/* Keeps the photograph atmospheric without washing it out */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-foreground/25"
            initial={{ opacity: 0 }}
            animate={{
              opacity: revealed ? 1 : 0,
            }}
            transition={{
              duration: 1.4,
              ease: EASE,
            }}
          />

          {/* Slight vignette around the edges */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_65%,transparent_0%,transparent_38%,rgba(0,0,0,0.32)_100%)]"
            initial={{ opacity: 0 }}
            animate={{
              opacity: revealed ? 1 : 0,
            }}
            transition={{
              duration: 1.6,
              ease: EASE,
            }}
          />

          {/* ── name ─────────────────────────────────────────────────── */}
          <motion.h1
            className="display relative z-10 flex select-none justify-center text-[19vw] leading-none text-background md:text-[13vw]"
            style={{
              x: tx,
              y: ty,
            }}
            animate={{
              scale: leaving ? 1.06 : 1,
            }}
            transition={{
              duration: 1.4,
              ease: EASE,
            }}
          >
            {NAME.map((ch, i) => (
              <motion.span
                key={`${ch}-${i}`}
                className="inline-block"
                initial={{
                  y: "18%",
                  opacity: 0,
                }}
                animate={{
                  y: revealed ? "0%" : "18%",
                  opacity: revealed ? 1 : 0,
                }}
                transition={{
                  duration: 1.4,
                  ease: EASE,
                  delay: 0.5 + 0.07 * i,
                }}
              >
                {ch}
              </motion.span>
            ))}
          </motion.h1>

          {/* subtle portrait label */}
          <motion.span
            aria-hidden
            className="marker absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-background/60"
            initial={{
              opacity: 0,
              y: 6,
            }}
            animate={{
              opacity: revealed ? 0.75 : 0,
              y: revealed ? 0 : 6,
            }}
            transition={{
              duration: 1,
              ease: EASE,
              delay: 1.5,
            }}
          >
            FIG_00 · THE BUILDER
          </motion.span>

          {/* running hairline across the plate */}
          <motion.span
            aria-hidden
            className="absolute inset-x-0 bottom-0 z-20 block h-[1px] origin-left bg-background/50"
            initial={{
              scaleX: 0,
            }}
            animate={{
              scaleX: count / 100,
            }}
            transition={{
              duration: 0.2,
              ease: "linear",
            }}
          />
        </div>

        {/* plate caption */}
        <motion.div
          className="mt-4 flex items-baseline justify-between px-[6vw]"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: revealed && !leaving ? 1 : 0,
          }}
          transition={{
            duration: 1.4,
            ease: EASE,
            delay: 1.2,
          }}
        >
          <span className="marker"></span>

          <span className="marker hidden md:block">
            Gelatin ink on paper stock
          </span>
        </motion.div>
      </div>

      {/* ── slats ─────────────────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex"
      >
        {Array.from({ length: SLATS }).map((_, i) => (
          <motion.span
            key={i}
            className="block h-full flex-1 origin-top bg-background"
            style={{
              boxShadow:
                "0 0 0 0.5px var(--color-border)",
            }}
            initial={{
              scaleY: 1,
            }}
            animate={{
              scaleY: leaving ? 1 : revealed ? 0 : 1,
            }}
            transition={{
              duration: leaving ? 0.75 : 1.5,
              ease: EASE,
              delay: leaving
                ? 0.05 * (SLATS - 1 - i)
                : 0.09 * i,
            }}
          />
        ))}
      </div>

      {/* ── corner metadata ───────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-x-[6vw] top-[6vh] flex items-start justify-between">
        <motion.span
          className="eyebrow"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: leaving ? 0 : 1,
          }}
          transition={{
            duration: 1.2,
            ease: EASE,
            delay: 0.2,
          }}
        >
          Exhibition MMXXVI
        </motion.span>

        <motion.span
          className="eyebrow hidden md:block"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: leaving ? 0 : 1,
          }}
          transition={{
            duration: 1.2,
            ease: EASE,
            delay: 0.35,
          }}
        >
          Delhi, India
        </motion.span>
      </div>

      {/* ── manifest ──────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute bottom-[5vh] left-[6vw] hidden w-[20rem] md:block">
        {MANIFEST.map((line, i) => (
          <motion.div
            key={line}
            className="flex items-baseline gap-3 py-[0.35rem]"
            initial={{
              opacity: 0,
              y: 6,
            }}
            animate={{
              opacity: leaving ? 0 : done[i] ? 1 : 0.35,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              ease: EASE,
              delay: 0.2 * i,
            }}
          >
            <span className="marker whitespace-nowrap">
              {line}
            </span>

            <span className="h-[1px] flex-1 translate-y-[-0.2rem] bg-border" />

            <motion.span
              className="marker tabular-nums"
              animate={{
                opacity: done[i] ? 1 : 0.4,
              }}
              transition={{
                duration: 0.4,
              }}
            >
              {done[i] ? "HUNG" : "····"}
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* ── oversized counter ─────────────────────────────────────────── */}
      <div className="pointer-events-none absolute bottom-[4vh] right-[6vw] flex items-end gap-4">
        <span className="marker mb-4 hidden md:block">
          {count >= 100
            ? "The room is ready"
            : "Preparing the room"}
        </span>

        <span className="display text-[18vw] leading-[0.8] tabular-nums md:text-[9vw]">
          {String(count).padStart(2, "0")}
        </span>
      </div>

      {/* ── enter ─────────────────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-x-0 top-[calc(50%+23svh+5.5rem)] flex justify-center"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: enterVisible && !leaving ? 1 : 0,
        }}
        transition={{
          duration: 1.4,
          ease: EASE,
        }}
      >
        <Magnetic
          onClick={enter}
          className="eyebrow border border-border px-12 py-4 text-foreground transition-opacity duration-700 hover:opacity-60"
        >
          Enter
        </Magnetic>
      </motion.div>
    </motion.div>
  );
}
