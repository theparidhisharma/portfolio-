import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Magnetic } from "./Magnetic";
import { Fade } from "./Reveal";
import { FACTS } from "@/lib/facts";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Renders a fact, turning any named links into clickable text. */
function FactBody({ text, links }: { text: string; links?: { label: string; href: string }[] | undefined }) {
  if (!links?.length) return <>{text}</>;

  const pattern = new RegExp(
    `(${links.map((l) => l.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "g",
  );

  return (
    <>
      {text.split(pattern).map((part, i) => {
        const link = links.find((l) => l.label === part);
        if (!link) return <span key={i}>{part}</span>;
        return (
          <a
            key={i}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="text-foreground transition-opacity duration-500 hover:opacity-60"
          >
            <span className="story-link">{link.label} ↗</span>
          </a>
        );
      })}
    </>
  );
}

export function FunFacts() {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const fact = FACTS[index]!;

  const shuffle = () => {
    if (FACTS.length < 2) return;
    let next = index;
    while (next === index) next = Math.floor(Math.random() * FACTS.length);
    setIndex(next);
    setCount((c) => c + 1);
  };

  return (
    <section className="spread">
      <Fade>
        <div className="flex items-baseline justify-between rule-t pt-6">
          <p className="eyebrow">Marginalia — Fun Facts</p>
          <span className="marker">{String(FACTS.length).padStart(2, "0")} entries</span>
        </div>
      </Fade>

      <div className="mt-[8vh] grid gap-12 md:grid-cols-12 md:items-start">
        <Fade className="md:col-span-4">
          <h2 className="display text-[11vw] leading-[0.9] md:text-[4vw]">Fun Facts</h2>
          <p className="caption mt-6 max-w-[22rem]">
            Think you know me from my code? Think again.
          </p>
          <div className="mt-10">
            <Magnetic
              onClick={shuffle}
              strength={0.18}
              className="eyebrow group inline-flex items-center gap-4 border border-border px-8 py-5 text-foreground transition-colors duration-700 hover:bg-foreground hover:text-background"
            >
              Tell me something random
              <span className="transition-transform duration-700 group-hover:translate-x-1">
                →
              </span>
            </Magnetic>
          </div>
        </Fade>

        <Fade className="md:col-span-7 md:col-start-6" delay={0.15}>
          <div className="relative min-h-[16rem] border border-border p-8 md:min-h-[15rem] md:p-12">
            <span
              aria-hidden
              className="display pointer-events-none absolute right-6 top-2 select-none text-[7rem] leading-none text-foreground/[0.06] md:text-[9rem]"
            >
              ?
            </span>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${fact.id}-${count}`}
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                transition={{ duration: 0.9, ease: EASE }}
                aria-live="polite"
              >
                <p className="marker">{fact.kicker}</p>
                <p className="lede mt-6 max-w-[30em]">
                  <FactBody text={fact.text} links={fact.links} />
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-10 flex items-baseline justify-between rule-t pt-5">
              <span className="marker">Fact_{String(index + 1).padStart(2, "0")}</span>
              <span className="marker">Drawn {count + 1}×</span>
            </div>
          </div>
        </Fade>
      </div>
    </section>
  );
}
