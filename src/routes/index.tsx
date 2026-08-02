import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Overture } from "@/components/exhibition/Overture";
import { Fade, SplitLine } from "@/components/exhibition/Reveal";
import { Magnetic } from "@/components/exhibition/Magnetic";
import { GlyphPlate, FieldTexture } from "@/components/exhibition/Plates";
import { WORKS, RECORD, HONOURS, DISCIPLINES, SOCIALS } from "@/lib/works";
import { getFeature } from "@/lib/features";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PARIDHI — Engineer. Designer. Builder." },
      {
        name: "description",
        content:
          "An exhibition of systems by Paridhi Sharma — distributed architecture, predictive intelligence, and interfaces built to be remembered.",
      },
      { property: "og:title", content: "PARIDHI — Engineer. Designer. Builder." },
      {
        property: "og:description",
        content:
          "An exhibition of systems by Paridhi Sharma — distributed architecture, predictive intelligence, and interfaces built to be remembered.",
      },
    ],
  }),
  component: Exhibition,
});

const EASE = [0.16, 1, 0.3, 1] as const;

function Exhibition() {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("paridhi-entered") === "1") setEntered(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [entered]);

  const handleEnter = () => {
    sessionStorage.setItem("paridhi-entered", "1");
    setEntered(true);
  };

  return (
    <>
      {!entered && <Overture onEnter={handleEnter} />}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: entered ? 1 : 0 }}
        transition={{ duration: 1.8, ease: EASE }}
      >
        <Colophon />
        <ChapterOne />
        <Manifesto />
        <WorksIntro />
        {WORKS.map((work, i) => (
          <WorkPlate key={work.slug} work={work} position={i} />
        ))}
        <Record />
        <Closing />
      </motion.main>
    </>
  );
}

function Colophon() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-[6vw] py-8 mix-blend-difference">
      <span className="eyebrow text-foreground">Paridhi Sharma</span>
      <span className="eyebrow hidden text-foreground md:block">Exhibition MMXXVI</span>
      <a
        className="eyebrow pointer-events-auto text-foreground transition-opacity duration-500 hover:opacity-50"
        href={`mailto:${SOCIALS.email}`}
      >
        Contact
      </a>
    </div>
  );
}

function ChapterOne() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.15], [0, -80]);

  return (
    <section className="chapter justify-end">
      <motion.div style={{ y }}>
        <p className="eyebrow mb-16">Chapter One — The Name</p>
        <h1 className="display text-[19vw] leading-[0.8] md:text-[15vw]">
          <SplitLine text="PARIDHI" delay={0.3} stagger={0} />
        </h1>
        <div className="mt-16 grid grid-cols-1 gap-4 rule-t pt-8 md:grid-cols-3">
          {["Engineer.", "Designer.", "Builder."].map((word, i) => (
            <Fade key={word} delay={0.8 + i * 0.35}>
              <p className="display text-[7vw] leading-none md:text-[3.4vw]">{word}</p>
            </Fade>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="chapter">
      <p className="eyebrow mb-20">Chapter Two — Manifesto</p>
      <div className="max-w-[62rem]">
        <h2 className="display text-[8vw] leading-[0.95] md:text-[4.6vw]">
          <SplitLine text="I don't build software to fill portfolios." />
        </h2>
        <h2 className="display mt-[6vh] text-[8vw] leading-[0.95] text-muted-foreground md:text-[4.6vw]">
          <SplitLine text="I build systems that people remember." delay={0.35} />
        </h2>
      </div>
      <div className="mt-[14vh] grid gap-12 rule-t pt-10 md:grid-cols-12">
        <Fade className="md:col-span-4" delay={0.1}>
          <p className="eyebrow">Position</p>
          <p className="copy mt-8">
            Computer Science at IGDTUW. Software engineering at Flipkart, previously Deutsche
            Telekom Digital Labs. President of the Microsoft Student Chapter.
          </p>
        </Fade>
        <Fade className="md:col-span-4" delay={0.2}>
          <p className="eyebrow">Preoccupation</p>
          <p className="copy mt-8">
            Distributed systems, event logs, and the quiet discipline of observability —
            the parts of software nobody photographs.
          </p>
        </Fade>
        <Fade className="md:col-span-4" delay={0.3}>
          <p className="eyebrow">Instruments</p>
          <p className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
            {DISCIPLINES.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </p>
        </Fade>
      </div>
    </section>
  );
}

function WorksIntro() {
  return (
    <section className="relative flex min-h-[90svh] items-center justify-center overflow-hidden px-[8vw]">
      <FieldTexture className="absolute inset-x-[8vw] top-1/2 -translate-y-1/2 opacity-[0.16]" />
      <div className="relative text-center">
        <p className="eyebrow mb-14">Chapter Three</p>
        <h2 className="display text-[13vw] leading-none md:text-[8vw]">
          <SplitLine text="The Features" stagger={0.14} />
        </h2>
        <Fade delay={0.5}>
          <span className="divider mx-auto mt-16 max-w-[26rem]" />
          <p className="caption mt-8">
            Three systems, read as features rather than entries in a list.
          </p>
        </Fade>
      </div>
    </section>
  );
}

function WorkPlate({ work, position }: { work: (typeof WORKS)[number]; position: number }) {
  const alignRight = position % 2 === 1;
  const feature = getFeature(work.slug);
  const number = feature?.number ?? String(position + 1).padStart(2, "0");

  return (
    <section className="relative flex min-h-[115svh] flex-col justify-center overflow-hidden px-[8vw] py-[18vh]">
      <Fade>
        <div className="mb-[9vh] flex items-baseline justify-between rule-t pt-6">
          <span className="marker">Feature_{number}</span>
          <span className="marker hidden md:block">{feature?.published ?? work.year}</span>
          <span className="marker">{feature?.readingTime ?? work.year}</span>
        </div>
      </Fade>
      <div className="grid gap-14 md:grid-cols-12 md:items-end">
        <Fade
          className={`md:col-span-7 ${alignRight ? "md:order-2 md:col-start-6" : ""}`}
        >
          <Link
            to="/work/$slug"
            params={{ slug: work.slug }}
            className="group block transition-opacity duration-1000 hover:opacity-75"
          >
            <GlyphPlate
              glyph={work.glyph}
              label={`Feature_${number}`}
              caption={work.plateCaption}
              ratio="aspect-[4/3] md:aspect-[16/11]"
            />
          </Link>
        </Fade>

        <div className={`md:col-span-5 ${alignRight ? "md:order-1 md:col-start-1 md:row-start-1" : ""}`}>
          <Fade delay={0.1}>
            <p className="eyebrow">{work.discipline}</p>
          </Fade>
          <h3 className="display mt-8 text-[11vw] leading-[0.85] md:text-[5vw]">
            <SplitLine text={work.title} stagger={0.12} />
          </h3>
          <Fade delay={0.25}>
            <p className="lede mt-10 max-w-[30rem]">{work.line}</p>
            <p className="copy mt-8">{work.summary}</p>
            <dl className="mt-14 grid grid-cols-2 gap-y-5 rule-t pt-8 text-sm text-muted-foreground">
              <dt className="eyebrow">Year</dt>
              <dd className="text-right">{work.year}</dd>
              <dt className="eyebrow">Role</dt>
              <dd className="text-right">{work.role}</dd>
              <dt className="eyebrow">Stack</dt>
              <dd className="text-right">{work.stack.slice(0, 3).join(" · ")}</dd>
            </dl>
            <div className="mt-14">
              <Link
                to="/work/$slug"
                params={{ slug: work.slug }}
                className="eyebrow inline-block text-foreground"
              >
                <span className="story-link">Read Feature_{number}</span>
              </Link>
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
}


function Record() {
  return (
    <section className="chapter">
      <p className="eyebrow mb-20">Chapter Four — Record</p>
      <div>
        {RECORD.map((item, i) => (
          <Fade key={item.title} delay={i * 0.08}>
            <div className="grid grid-cols-12 items-baseline gap-4 rule-t py-10">
              <span className="marker col-span-3 md:col-span-2">
                {item.year}
              </span>
              <h3 className="display col-span-9 text-[7vw] leading-none md:col-span-6 md:text-[3vw]">
                {item.title}
              </h3>
              <p className="col-span-12 text-sm text-muted-foreground md:col-span-4 md:text-right">
                {item.detail}
              </p>
            </div>
          </Fade>
        ))}
      </div>
      <div className="mt-24 grid gap-8 md:grid-cols-3">
        {HONOURS.map((h, i) => (
          <Fade key={h} delay={i * 0.1}>
            <p className="copy rule-t pt-8">{h}</p>
          </Fade>
        ))}
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="chapter items-center justify-center text-center">
      <Fade>
        <p className="eyebrow mb-14">Chapter Five — Correspondence</p>
      </Fade>
      <h2 className="display text-[12vw] leading-[0.85] md:text-[7vw]">
        <SplitLine text="Say something" stagger={0.14} />
      </h2>
      <Fade delay={0.4}>
        <Magnetic
          href={`mailto:${SOCIALS.email}`}
          className="eyebrow mt-14 inline-block px-8 py-4 text-foreground"
        >
          {SOCIALS.email}
        </Magnetic>
      </Fade>
      <Fade delay={0.5}>
        <div className="mt-24 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {[
            { label: "LinkedIn", href: SOCIALS.linkedin },
            { label: "GitHub", href: SOCIALS.github },
            { label: "LeetCode", href: SOCIALS.leetcode },
            { label: "Résumé", href: SOCIALS.resume },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="eyebrow text-foreground transition-opacity duration-500 hover:opacity-50"
            >
              {link.label}
            </a>
          ))}
        </div>
      </Fade>
      <p className="eyebrow mt-24">Delhi, India</p>
    </section>
  );
}
