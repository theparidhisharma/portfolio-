import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Overture } from "@/components/exhibition/Overture";
import { Navbar } from "@/components/exhibition/Navbar";
import { ThemeToggle, useTheme } from "@/components/exhibition/Theme";
import {
  Fade,
  SplitLine,
  ScrollText,
} from "@/components/exhibition/Reveal";
import { Magnetic } from "@/components/exhibition/Magnetic";
import {
  GlyphPlate,
  FieldTexture,
  ImagePlate,
  Hairlines,
} from "@/components/exhibition/Plates";
import { FunFacts } from "@/components/exhibition/FunFacts";
import { CollageGallery } from "@/components/exhibition/CollageGallery";
import { LinkedInWall } from "@/components/exhibition/LinkedInWall";
import { ContributionBelt } from "@/components/exhibition/ContributionBelt";
import { BLOG_POSTS } from "@/lib/blog";
import {
  WORKS,
  RECORD,
  HONOURS,
  DISCIPLINES,
  SOCIALS,
} from "@/lib/works";
import { getFeature } from "@/lib/features";
import { getFeatureImage } from "@/lib/feature-images";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "PARIDHI: Engineer. Designer. Builder.",
      },
      {
        name: "description",
        content:
          "An exhibition of systems by Paridhi Sharma: distributed architecture, predictive intelligence, and interfaces built to be remembered.",
      },
      {
        property: "og:title",
        content: "PARIDHI: Engineer. Designer. Builder.",
      },
      {
        property: "og:description",
        content:
          "An exhibition of systems by Paridhi Sharma: distributed architecture, predictive intelligence, and interfaces built to be remembered.",
      },
    ],
  }),
  component: Exhibition,
});

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV_LINKS = [
  { label: "Manifesto", href: "#manifesto" },
  { label: "Features", href: "#features" },
  { label: "Record", href: "#record" },
  { label: "Journal", href: "#journal" },
  { label: "Dispatches", href: "#dispatches" },
  { label: "Contact", href: "#contact" },
];

function Exhibition() {
  const [entered, setEntered] = useState(false);

  /*
   * Overture now appears on EVERY fresh page load.
   *
   * Previously this checked sessionStorage and skipped the
   * landing page after the user had entered once during that
   * browser session.
   */

  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [entered]);

  const handleEnter = () => {
    setEntered(true);
  };

  return (
    <>
      {!entered && <Overture onEnter={handleEnter} />}

      <Navbar links={NAV_LINKS} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: entered ? 1 : 0 }}
        transition={{
          duration: 1.8,
          ease: EASE,
        }}
      >
        <Colophon />
        <ChapterOne />
        <MarqueeBand />
        <Manifesto />
        <WorksIntro />

        {WORKS.map((work, i) => (
          <WorkPlate
            key={work.slug}
            work={work}
            position={i}
          />
        ))}

        <Record />
        <Journal />
        <Dispatches />
        <FunFacts />
        <Closing />
      </motion.main>
    </>
  );
}

function Colophon() {
  const { scrollYProgress } = useScroll();

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.04],
    [1, 0],
  );

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-[6vw] py-8 mix-blend-difference light:mix-blend-normal"
    >
      <span className="eyebrow text-foreground">
        Paridhi Sharma
      </span>

      <span className="eyebrow hidden text-foreground md:block">
        Exhibition MMXXVI
      </span>

      <div className="flex items-center gap-8">
        <a
          className="eyebrow pointer-events-auto text-foreground transition-opacity duration-500 hover:opacity-50"
          href={`mailto:${SOCIALS.email}`}
        >
          Contact
        </a>

        <ThemeToggle className="pointer-events-auto" />
      </div>
    </motion.div>
  );
}

function ChapterOne() {
  const { scrollYProgress } = useScroll();

  const y = useTransform(
    scrollYProgress,
    [0, 0.15],
    [0, -80],
  );

  const ghostY = useTransform(
    scrollYProgress,
    [0, 0.2],
    [0, 160],
  );

  const ghostRotate = useTransform(
    scrollYProgress,
    [0, 0.2],
    [0, 8],
  );

  const veil = useTransform(
    scrollYProgress,
    [0, 0.12],
    [1, 0],
  );

  return (
    <section className="chapter relative justify-end overflow-hidden">
      {/* layered ghost name: the type behind the type */}
      <motion.span
        aria-hidden
        className="display pointer-events-none absolute left-[-6vw] top-[6vh] select-none text-[38vw] leading-none text-foreground/[0.045] md:text-[26vw]"
        style={{
          y: ghostY,
          rotate: ghostRotate,
        }}
      >
        PARIDHI
      </motion.span>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-[8vw] inset-y-[12vh] opacity-40"
        style={{ opacity: veil }}
      >
        <Hairlines columns={10} rows={6} />
      </motion.div>

      <motion.div
        className="relative"
        style={{ y }}
      >
        <div className="mb-16 flex items-baseline justify-between rule-t pt-6">
          <p className="eyebrow">
            Chapter One: The Name
          </p>

          <span className="marker hidden md:block">
            Private view · Delhi · By invitation
          </span>
        </div>

        <h1 className="display text-[19vw] leading-[0.8] md:text-[15vw]">
          <SplitLine
            text="PARIDHI"
            delay={0.3}
            stagger={0}
          />
        </h1>

        <div className="mt-16 grid grid-cols-1 gap-4 rule-t pt-8 md:grid-cols-3">
          {[
            "Engineer.",
            "Designer.",
            "Builder.",
          ].map((word, i) => (
            <Fade
              key={word}
              delay={0.8 + i * 0.35}
            >
              <motion.p
                className="display cursor-default text-[7vw] leading-none md:text-[3.4vw]"
                whileHover={{
                  x: 14,
                  opacity: 0.65,
                }}
                transition={{
                  duration: 1.1,
                  ease: EASE,
                }}
              >
                {word}
              </motion.p>
            </Fade>
          ))}
        </div>

        <Fade delay={1.3}>
          <p className="lede mt-12 max-w-[36rem]">
            Software engineer building distributed
            systems, predictive intelligence, and
            interfaces built to be remembered.
          </p>
        </Fade>

        <Fade delay={1.5}>
          <dl className="mt-12 grid grid-cols-2 gap-y-4 rule-t pt-8 text-sm text-muted-foreground md:grid-cols-4">
            <div>
              <dt className="eyebrow">Based in</dt>
              <dd className="mt-2">
                Delhi, India
              </dd>
            </div>

            <div>
              <dt className="eyebrow">Currently</dt>
              <dd className="mt-2">
                Flipkart
              </dd>
            </div>

            <div>
              <dt className="eyebrow">Focus</dt>
              <dd className="mt-2">
                Distributed systems
              </dd>
            </div>

            <div>
              <dt className="eyebrow">Features</dt>
              <dd className="mt-2">
                {String(WORKS.length).padStart(2, "0")}
              </dd>
            </div>
          </dl>
        </Fade>

        <Fade delay={1.7}>
          <div className="mt-[8vh] flex items-center gap-6">
            <motion.span
              aria-hidden
              className="block h-14 w-[1px] origin-top bg-border"
              animate={{
                scaleY: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 3.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <span className="marker">
              Scroll to begin
            </span>
          </div>
        </Fade>
      </motion.div>
    </section>
  );
}

function MarqueeBand() {
  return (
    <section className="relative overflow-hidden rule-t rule-b py-[7vh]">
      <div className="mt-[6vh] px-[6vw]">
        <ContributionBelt />
      </div>
    </section>
  );
}

function Journal() {
  return (
    <section
      id="journal"
      className="scroll-mt-24 px-[6vw] py-[16vh]"
    >
      <div className="mb-14 flex items-baseline justify-between rule-t pt-6">
        <p className="eyebrow">
          Chapter Five: Journal
        </p>

        <span className="marker">
          {String(BLOG_POSTS.length).padStart(2, "0")}{" "}
          entries · hover to read
        </span>
      </div>

      <h2 className="display mb-[8vh] max-w-[24ch] text-[11vw] leading-[0.88] md:text-[5.4vw]">
        <SplitLine
          text="Notes from the workshop"
          stagger={0.1}
        />
      </h2>

      <CollageGallery posts={BLOG_POSTS} />
    </section>
  );
}

function Dispatches() {
  return (
    <section
      id="dispatches"
      className="scroll-mt-24 px-[6vw] py-[14vh]"
    >
      <div className="mb-14 flex items-baseline justify-between rule-t pt-6">
        <p className="eyebrow">
          Chapter Six: Dispatches
        </p>

        <span className="marker hidden md:block">
          Recent activity · LinkedIn
        </span>
      </div>

      <h2 className="display mb-[7vh] text-[11vw] leading-[0.88] md:text-[5vw]">
        <SplitLine
          text="Said elsewhere"
          stagger={0.12}
        />
      </h2>

      <LinkedInWall />
    </section>
  );
}

function Manifesto() {
  return (
    <section
      id="manifesto"
      className="chapter scroll-mt-24"
    >
      <p className="eyebrow mb-20">
        Chapter Two: Manifesto
      </p>

      <div className="max-w-[62rem]">
        <h2 className="display text-[8vw] leading-[0.95] md:text-[4.6vw]">
          <SplitLine text="Portfolios are easy. Systems are not." />
        </h2>

        <ScrollText
          text="I build the ones people actually remember."
          className="display mt-[6vh] text-[8vw] leading-[0.95] md:text-[4.6vw]"
        />
      </div>

      <div className="mt-[14vh] grid gap-12 rule-t pt-10 md:grid-cols-12">
        <Fade
          className="md:col-span-4"
          delay={0.1}
        >
          <p className="eyebrow">
            Position
          </p>

          <p className="copy mt-8">
            Computer Science at IGDTUW. Software
            engineering at Flipkart, previously Deutsche
            Telekom Digital Labs. President of the
            Microsoft Student Chapter.
          </p>
        </Fade>

        <Fade
          className="md:col-span-4"
          delay={0.2}
        >
          <p className="eyebrow">
            Preoccupation
          </p>

          <p className="copy mt-8">
            Distributed systems, event logs, and the quiet
            discipline of observability — the parts of
            software nobody photographs.
          </p>
        </Fade>

        <Fade
          className="md:col-span-4"
          delay={0.3}
        >
          <p className="eyebrow">
            Instruments
          </p>

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
    <section
      id="features"
      className="relative flex min-h-[90svh] scroll-mt-24 items-center justify-center overflow-hidden px-[8vw]"
    >
      <FieldTexture className="absolute inset-x-[8vw] top-1/2 -translate-y-1/2 opacity-[0.16]" />

      <div className="relative text-center">
        <p className="eyebrow mb-14">
          Chapter Three
        </p>

        <h2 className="display text-[13vw] leading-none md:text-[8vw]">
          <SplitLine
            text="The Features"
            stagger={0.14}
          />
        </h2>

        <Fade delay={0.5}>
          <span className="divider mx-auto mt-16 max-w-[26rem]" />

          <p className="caption mt-8">
            Three systems, documented as they were built.
          </p>
        </Fade>
      </div>
    </section>
  );
}

function WorkPlate({
  work,
  position,
}: {
  work: (typeof WORKS)[number];
  position: number;
}) {
  const alignRight = position % 2 === 1;

  const feature = getFeature(work.slug);

  const number =
    feature?.number ??
    String(position + 1).padStart(2, "0");

  const { mode } = useTheme();

  const image = getFeatureImage(
    work.slug,
    mode,
  );

  return (
    <section className="relative flex min-h-[115svh] flex-col justify-center overflow-hidden px-[8vw] py-[18vh]">
      <Fade>
        <div className="mb-[9vh] flex items-baseline justify-between rule-t pt-6">
          <span className="marker">
            Feature_{number}
          </span>

          <span className="marker hidden md:block">
            {feature?.published ?? work.year}
          </span>

          <span className="marker">
            {feature?.readingTime ?? work.year}
          </span>
        </div>
      </Fade>

      <div className="grid gap-14 md:grid-cols-12 md:items-end">
        <Fade
          className={`md:col-span-7 ${
            alignRight
              ? "md:order-2 md:col-start-6"
              : ""
          }`}
        >
          <Link
            to="/work/$slug"
            params={{ slug: work.slug }}
            className="group block transition-opacity duration-1000 hover:opacity-75"
          >
            {image ? (
              <ImagePlate
                src={image}
                alt={`${work.title}: ${work.discipline}`}
                glyph={work.glyph}
                label={`Feature_${number}`}
                caption={work.plateCaption}
                ratio="aspect-[4/3] md:aspect-[16/11]"
              />
            ) : (
              <GlyphPlate
                glyph={work.glyph}
                label={`Feature_${number}`}
                caption={work.plateCaption}
                ratio="aspect-[4/3] md:aspect-[16/11]"
              />
            )}
          </Link>
        </Fade>

        <div
          className={`md:col-span-5 ${
            alignRight
              ? "md:order-1 md:col-start-1 md:row-start-1"
              : ""
          }`}
        >
          <Fade delay={0.1}>
            <p className="eyebrow">
              {work.discipline}
            </p>
          </Fade>

          <h3 className="display mt-8 text-[11vw] leading-[0.85] md:text-[5vw]">
            <SplitLine
              text={work.title}
              stagger={0.12}
            />
          </h3>

          <Fade delay={0.25}>
            <p className="lede mt-10 max-w-[30rem]">
              {work.line}
            </p>

            <p className="copy mt-8">
              {work.summary}
            </p>

            <dl className="mt-14 grid grid-cols-2 gap-y-5 rule-t pt-8 text-sm text-muted-foreground">
              <dt className="eyebrow">
                Year
              </dt>

              <dd className="text-right">
                {work.year}
              </dd>

              <dt className="eyebrow">
                Role
              </dt>

              <dd className="text-right">
                {work.role}
              </dd>

              <dt className="eyebrow">
                Stack
              </dt>

              <dd className="text-right">
                {work.stack
                  .slice(0, 3)
                  .join(" · ")}
              </dd>
            </dl>

            <div className="mt-14">
              <Link
                to="/work/$slug"
                params={{ slug: work.slug }}
                className="eyebrow inline-block text-foreground"
              >
                <span className="story-link">
                  Read Feature_{number}
                </span>
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
    <section
      id="record"
      className="chapter scroll-mt-24"
    >
      <p className="eyebrow mb-20">
        Chapter Four: Record
      </p>

      <div>
        {RECORD.map((item, i) => (
          <Fade
            key={item.title}
            delay={i * 0.08}
          >
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
          <Fade
            key={h}
            delay={i * 0.1}
          >
            <p className="copy rule-t pt-8">
              {h}
            </p>
          </Fade>
        ))}
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section
      id="contact"
      className="chapter scroll-mt-24 items-center justify-center text-center"
    >
      <Fade>
        <p className="eyebrow mb-14">
          Chapter Seven: Correspondence
        </p>
      </Fade>

      <h2 className="display text-[12vw] leading-[0.85] md:text-[7vw]">
        <SplitLine
          text="Do you wanna build a snowman? (let me know)"
          stagger={0.14}
        />
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
            {
              label: "LinkedIn",
              href: SOCIALS.linkedin,
            },
            {
              label: "GitHub",
              href: SOCIALS.github,
            },
            {
              label: "LeetCode",
              href: SOCIALS.leetcode,
            },
            {
              label: "Résumé",
              href: SOCIALS.resume,
            },
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

      <p className="eyebrow mt-24">
        Delhi, India
      </p>
    </section>
  );
}
