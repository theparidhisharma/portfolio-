import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, useInView, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Fade, SplitLine } from "@/components/exhibition/Reveal";
import {
  CodePlate,
  DiagramPlate,
  FieldTexture,
  Hairlines,
} from "@/components/exhibition/Plates";
import { WORKS, getWork, SOCIALS, type Work } from "@/lib/works";
import { getFeature, type Feature } from "@/lib/features";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const work = getWork(params.slug);
    const feature = getFeature(params.slug);
    if (!work || !feature) throw notFound();
    return { work, feature };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Unavailable — PARIDHI" }, { name: "robots", content: "noindex" }],
      };
    }
    const { work, feature } = loaderData;
    const title = `Feature_${feature.number} · ${work.title} — PARIDHI`;
    return {
      meta: [
        { title },
        { name: "description", content: feature.standfirst },
        { property: "og:title", content: title },
        { property: "og:description", content: feature.standfirst },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: FeaturePage,
});

const EASE = [0.16, 1, 0.3, 1] as const;

function FeaturePage() {
  const { work, feature } = Route.useLoaderData() as { work: Work; feature: Feature };
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const heroFade = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  const { scrollYProgress: pageProgress } = useScroll();
  const bar = useSpring(pageProgress, { stiffness: 60, damping: 30, mass: 0.6 });

  const i = WORKS.findIndex((w) => w.slug === work.slug);
  const next = WORKS[(i + 1) % WORKS.length]!;
  const prev = WORKS[(i - 1 + WORKS.length) % WORKS.length]!;
  const nextFeature = getFeature(next.slug);
  const prevFeature = getFeature(prev.slug);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.9, ease: EASE }}
    >
      <motion.div
        className="fixed inset-x-0 top-0 z-[65] h-[1px] origin-left bg-primary"
        style={{ scaleX: bar }}
      />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-[8vw] py-8 mix-blend-difference">
        <Link
          to="/"
          className="eyebrow pointer-events-auto text-foreground transition-opacity duration-700 hover:opacity-60"
        >
          ← Exhibition
        </Link>
        <span className="marker text-foreground">Feature_{feature.number}</span>
      </div>

      {/* Full-screen editorial hero */}
      <header ref={heroRef} className="relative flex h-[105svh] items-end overflow-hidden">
        <motion.span
          aria-hidden
          className="display absolute right-[4vw] top-[8vh] select-none text-[46vw] leading-none text-foreground/[0.07] md:text-[28vw]"
          style={{ y: heroY, opacity: heroFade }}
        >
          {feature.number}
        </motion.span>
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{ y: heroY, opacity: heroFade }}
        >
          <Hairlines columns={12} rows={8} />
        </motion.div>
        <div className="relative w-full px-[8vw] pb-[14vh]">
          <p className="eyebrow mb-12">
            Feature_{feature.number} — {feature.section}
          </p>
          <h1 className="display text-[12vw] leading-[0.88] md:text-[6.6vw]">
            {feature.opener.map((line, li) => (
              <span key={line} className="block">
                <SplitLine text={line} stagger={0.09} delay={0.25 + li * 0.4} />
              </span>
            ))}
          </h1>
          <Fade delay={1.1}>
            <span className="divider mt-16 max-w-[46rem]" />
            <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-3">
              <span className="marker">{work.title}</span>
              <span className="marker">{feature.published}</span>
              <span className="marker">{feature.readingTime}</span>
              <span className="marker">{work.role}</span>
            </div>
          </Fade>
        </div>
      </header>

      {/* Standfirst + colophon */}
      <section className="grid gap-16 spread md:grid-cols-12">
        <div className="md:col-span-4">
          <Fade>
            <dl className="space-y-8 text-sm text-muted-foreground">
              <div className="rule-t pt-5">
                <dt className="eyebrow">Role</dt>
                <dd className="mt-3">{work.role}</dd>
              </div>
              <div className="rule-t pt-5">
                <dt className="eyebrow">Stack</dt>
                <dd className="mt-3 leading-relaxed">{work.stack.join(" · ")}</dd>
              </div>
              <div className="rule-t pt-5">
                <dt className="eyebrow">Elsewhere</dt>
                <dd className="mt-3 space-y-2">
                  {work.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-foreground transition-opacity duration-700 hover:opacity-60"
                    >
                      <span className="story-link">{l.label} ↗</span>
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
          </Fade>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <Fade>
            <p className="lede max-w-[34em]">{feature.standfirst}</p>
          </Fade>
          <Fade delay={0.2}>
            <p className="copy mt-12">{work.summary}</p>
          </Fade>
        </div>
      </section>

      {/* Narrative chapters */}
      {work.chapters.map((chapter, ci) => (
        <section key={chapter.heading} className="grid gap-12 spread md:grid-cols-12">
          <div className="md:col-span-3">
            <Fade>
              <p className="marker">{String(ci + 1).padStart(2, "0")}</p>
              <p className="eyebrow mt-5">{chapter.heading}</p>
            </Fade>
          </div>
          <div className="md:col-span-8 md:col-start-5">
            <h2 className="display text-[7vw] leading-[1.05] md:text-[3.1vw]">
              <SplitLine text={chapter.heading} stagger={0.08} />
            </h2>
            <Fade delay={0.2}>
              <p className="copy mt-10">{chapter.body}</p>
            </Fade>
          </div>
        </section>
      ))}

      {/* Pull quote */}
      <section className="spread">
        <Fade>
          <span className="divider mb-[9vh]" />
        </Fade>
        <blockquote className="display max-w-[64rem] text-[8vw] leading-[1.04] md:text-[4vw]">
          <SplitLine text={`“${work.pullQuote}”`} stagger={0.07} />
        </blockquote>
        <Fade delay={0.4}>
          <span className="divider mt-[9vh]" />
        </Fade>
      </section>

      {/* Architecture */}
      <section className="grid gap-16 spread md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="eyebrow mb-6">Architecture</p>
          <p className="caption mb-14">The topology, read top to bottom.</p>
          <div className="flex flex-col">
            {work.architecture.map((node, ni) => (
              <Fade key={node} delay={ni * 0.08}>
                <div className="grid grid-cols-12 items-baseline gap-4 rule-t py-9">
                  <span className="marker col-span-2">
                    {String(ni + 1).padStart(2, "0")}
                  </span>
                  <span className="display col-span-10 text-[6vw] leading-none md:text-[2.5vw]">
                    {node}
                  </span>
                </div>
              </Fade>
            ))}
            <div className="rule-t" />
          </div>
        </div>
        <div className="md:col-span-4 md:col-start-9 md:self-end">
          <DiagramPlate
            nodes={work.architecture}
            caption={`Fig. ${feature.number}a — topology`}
          />
        </div>
      </section>

      {/* Engineering decisions */}
      <section className="spread">
        <Fade>
          <div className="flex items-baseline justify-between rule-t pt-6">
            <p className="eyebrow">Engineering Decisions</p>
            <span className="marker">{feature.decisions.length} entries</span>
          </div>
        </Fade>
        <div className="mt-[10vh] grid gap-y-16 md:grid-cols-12 md:gap-x-16">
          {feature.decisions.map((d, di) => (
            <Fade key={d.title} delay={di * 0.1} className="md:col-span-4">
              <p className="marker">{String(di + 1).padStart(2, "0")}</p>
              <h3 className="display mt-6 text-[6vw] leading-[1.08] md:text-[1.9vw]">
                {d.title}
              </h3>
              <p className="copy mt-6">{d.body}</p>
            </Fade>
          ))}
        </div>
      </section>

      {/* Challenges */}
      <section className="grid gap-14 spread md:grid-cols-12">
        <div className="md:col-span-3">
          <Fade>
            <p className="eyebrow">Challenges</p>
            <p className="caption mt-6">What resisted.</p>
          </Fade>
        </div>
        <div className="md:col-span-8 md:col-start-5">
          {feature.challenges.map((c, ci) => (
            <Fade key={c.title} delay={ci * 0.1}>
              <div className="rule-t py-12">
                <h3 className="display text-[7vw] leading-[1.05] md:text-[2.4vw]">
                  {c.title}
                </h3>
                <p className="copy mt-6">{c.body}</p>
              </div>
            </Fade>
          ))}
          <div className="rule-t" />
        </div>
      </section>

      {/* Trade-offs */}
      <section className="spread">
        <Fade>
          <p className="eyebrow rule-t pt-6">Trade-offs</p>
        </Fade>
        <div className="mt-[10vh] grid gap-x-16 gap-y-14 md:grid-cols-2">
          {feature.tradeoffs.map((t, ti) => (
            <Fade key={t.chosen} delay={ti * 0.1}>
              <div className="grid grid-cols-12 items-baseline gap-4">
                <span className="marker col-span-12">Chosen</span>
                <h3 className="display col-span-12 mt-2 text-[7vw] leading-[1.02] md:text-[2.6vw]">
                  {t.chosen}
                </h3>
                <span className="marker col-span-12 mt-6">Against — {t.against}</span>
              </div>
              <p className="copy mt-6">{t.body}</p>
            </Fade>
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section className="grid gap-16 spread md:grid-cols-3">
        {work.stats.map((stat) => (
          <Counter key={stat.label} {...stat} />
        ))}
      </section>

      {/* Timeline */}
      <section className="spread">
        <Fade>
          <p className="eyebrow rule-t pt-6">Timeline</p>
        </Fade>
        <div className="mt-[8vh]">
          {feature.timeline.map((t, ti) => (
            <Fade key={t.phase} delay={ti * 0.08}>
              <div className="grid grid-cols-12 items-baseline gap-6 rule-t py-10">
                <span className="marker col-span-12 md:col-span-2">{t.period}</span>
                <h3 className="display col-span-12 text-[7vw] leading-none md:col-span-4 md:text-[2.4vw]">
                  {t.phase}
                </h3>
                <p className="col-span-12 text-sm leading-relaxed text-muted-foreground md:col-span-5 md:col-start-8">
                  {t.body}
                </p>
              </div>
            </Fade>
          ))}
          <div className="rule-t" />
        </div>
      </section>

      {/* Gallery */}
      <section className="spread">
        <Fade>
          <p className="eyebrow rule-t pt-6">Gallery</p>
        </Fade>
        <div className="mt-[10vh] grid gap-x-16 gap-y-[12vh] md:grid-cols-12">
          {feature.gallery.map((plate, gi) => (
            <CodePlate
              key={plate.label}
              className={gi % 2 === 0 ? "md:col-span-7" : "md:col-span-5 md:col-start-8 md:self-end"}
              label={plate.label}
              lines={plate.lines}
              caption={plate.caption}
              ratio={gi % 2 === 0 ? "aspect-[16/10]" : "aspect-[4/3]"}
            />
          ))}
          <div className="md:col-span-4">
            <FieldTexture className="opacity-[0.35]" />
            <p className="caption mt-6">Fig. {feature.number}c — signal field</p>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="spread">
        <Fade>
          <p className="eyebrow rule-t pt-6">Results</p>
        </Fade>
        <div className="mt-[10vh] grid gap-16 md:grid-cols-3">
          {feature.results.map((r, ri) => (
            <Fade key={r.label} delay={ri * 0.1}>
              <h3 className="display text-[8vw] leading-[1.02] md:text-[2.4vw]">{r.label}</h3>
              <p className="copy mt-6">{r.body}</p>
            </Fade>
          ))}
        </div>
      </section>

      {/* Previous / Next */}
      <section className="chapter justify-end">
        <Fade>
          <div className="flex items-baseline justify-between rule-t pt-6">
            <span className="marker">Previous</span>
            <span className="marker">Next</span>
          </div>
        </Fade>
        <div className="mt-[8vh] grid gap-16 md:grid-cols-2">
          <Link to="/work/$slug" params={{ slug: prev.slug }} className="group block">
            <p className="marker">Feature_{prevFeature?.number}</p>
            <h2 className="display mt-5 text-[10vw] leading-[0.9] transition-opacity duration-1000 group-hover:opacity-60 md:text-[4vw]">
              {prev.title}
            </h2>
            <p className="caption mt-5">{prevFeature?.section}</p>
          </Link>
          <Link
            to="/work/$slug"
            params={{ slug: next.slug }}
            className="group block md:text-right"
          >
            <p className="marker">Feature_{nextFeature?.number}</p>
            <h2 className="display mt-5 text-[10vw] leading-[0.9] transition-opacity duration-1000 group-hover:opacity-60 md:text-[4vw]">
              {next.title}
            </h2>
            <p className="caption mt-5">{nextFeature?.section}</p>
          </Link>
        </div>
        <div className="mt-[12vh] flex flex-wrap gap-x-14 gap-y-4 rule-t pt-8">
          <Link to="/" className="eyebrow text-foreground">
            <span className="story-link">Return to exhibition</span>
          </Link>
          <a href={`mailto:${SOCIALS.email}`} className="eyebrow text-foreground">
            <span className="story-link">Contact</span>
          </a>
          <span className="marker ml-auto">
            Feature_{feature.number} — {feature.published}
          </span>
        </div>
      </section>
    </motion.article>
  );
}

function Counter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2400;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <div ref={ref} className="rule-t pt-10">
      <p className="display text-[14vw] leading-none md:text-[5.6vw]">
        {display}
        {suffix}
      </p>
      <p className="eyebrow mt-7">{label}</p>
    </div>
  );
}
