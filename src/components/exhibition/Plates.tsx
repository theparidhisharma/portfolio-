import { useRef, type ReactNode } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Exhibition plates. No photography — every visual field is typography,
 * hairline geometry, or motion. A plate is a black rectangle that behaves
 * like a framed work on a gallery wall.
 */

export function Plate({
  children,
  className = "",
  label,
  caption,
  ratio = "aspect-[4/3]",
}: {
  children?: ReactNode;
  className?: string | undefined;
  label?: string | undefined;
  caption?: string | undefined;
  ratio?: string | undefined;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  return (
    <div ref={ref} className={className}>
      <div className={`relative w-full overflow-hidden bg-surface ${ratio}`}>
        {/* reveal curtain */}
        <motion.span
          aria-hidden
          className="absolute inset-0 z-20 origin-top bg-background"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: inView ? 0 : 1 }}
          transition={{ duration: 2.1, ease: EASE }}
        />
        <Hairlines />
        <CornerTicks />
        <div className="absolute inset-0 z-10 flex items-center justify-center px-[8%]">
          {children}
        </div>
        {label ? (
          <span className="eyebrow absolute left-5 top-5 z-10">{label}</span>
        ) : null}
      </div>
      {caption ? (
        <p className="eyebrow mt-5 flex items-center gap-4">
          <span className="inline-block h-[1px] w-10 bg-border" />
          {caption}
        </p>
      ) : null}
    </div>
  );
}

/** Hairline measuring grid — the drawing under the drawing. */
export function Hairlines({ columns = 8, rows = 6 }: { columns?: number; rows?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {Array.from({ length: columns - 1 }).map((_, i) => (
        <motion.span
          key={`c${i}`}
          className="absolute top-0 h-full w-[1px] bg-border"
          style={{ left: `${((i + 1) / columns) * 100}%` }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.9, delay: 0.35 + i * 0.07, ease: EASE }}
        />
      ))}
      {Array.from({ length: rows - 1 }).map((_, i) => (
        <motion.span
          key={`r${i}`}
          className="absolute left-0 h-[1px] w-full bg-border"
          style={{ top: `${((i + 1) / rows) * 100}%` }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.9, delay: 0.35 + i * 0.07, ease: EASE }}
        />
      ))}
    </div>
  );
}

function CornerTicks() {
  const base = "absolute h-4 w-4 border-foreground/40";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-4 z-10">
      <span className={`${base} left-0 top-0 border-l border-t`} />
      <span className={`${base} right-0 top-0 border-r border-t`} />
      <span className={`${base} bottom-0 left-0 border-b border-l`} />
      <span className={`${base} bottom-0 right-0 border-b border-r`} />
    </div>
  );
}

/** Oversized roman numeral / index glyph, drifting on scroll. */
export function GlyphPlate({
  glyph,
  label,
  caption,
  ratio,
  className,
}: {
  glyph: string;
  label?: string;
  caption?: string;
  ratio?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);

  return (
    <div ref={ref} className={className}>
      <Plate label={label} caption={caption} ratio={ratio}>
        <motion.span
          style={{ y }}
          className="display select-none text-[34vw] leading-none text-foreground/90 md:text-[16vw]"
        >
          {glyph}
        </motion.span>
      </Plate>
    </div>
  );
}

/** Monospaced fragment — code as image. */
export function CodePlate({
  lines,
  label = "Fragment",
  caption,
  ratio,
  className,
}: {
  lines: string[];
  label?: string;
  caption?: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <Plate label={label} caption={caption} ratio={ratio} className={className}>
      <pre className="w-full overflow-hidden font-mono text-[2.6vw] leading-[2] text-muted-foreground md:text-[0.72vw]">
        {lines.map((line, i) => (
          <motion.div
            key={`${line}-${i}`}
            className="flex gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, delay: 0.6 + i * 0.08, ease: EASE }}
          >
            <span className="w-6 shrink-0 text-right text-foreground/25">{i + 1}</span>
            <span className="whitespace-pre text-foreground/70">{line}</span>
          </motion.div>
        ))}
      </pre>
    </Plate>
  );
}

/** Architecture as a drawn flow, not a picture of one. */
export function DiagramPlate({
  nodes,
  label = "Topology",
  caption,
  className,
}: {
  nodes: string[];
  label?: string;
  caption?: string;
  className?: string;
}) {
  return (
    <Plate label={label} caption={caption} ratio="aspect-[4/3]" className={className}>
      <div className="flex w-full flex-col">
        {nodes.map((node, i) => (
          <motion.div
            key={node}
            className="flex items-center gap-5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.6 + i * 0.12, ease: EASE }}
          >
            <span className="h-[5px] w-[5px] shrink-0 bg-foreground" />
            <span className="text-[3vw] uppercase tracking-[0.28em] text-foreground/80 md:text-[0.78vw]">
              {node}
            </span>
            <span className="h-[1px] flex-1 bg-border" />
            <span className="font-mono text-[0.6rem] text-foreground/30">
              {String(i + 1).padStart(2, "0")}
            </span>
          </motion.div>
        )).flatMap((el, i) =>
          i < nodes.length - 1
            ? [el, <span key={`v${i}`} className="ml-[2px] h-[6%] w-[1px] bg-border" />]
            : [el],
        )}
      </div>
    </Plate>
  );
}

/** Slow-breathing field of ticks — used as an interstitial texture. */
export function FieldTexture({ className = "" }: { className?: string }) {
  const cells = Array.from({ length: 240 });
  return (
    <div
      aria-hidden
      className={`pointer-events-none grid grid-cols-[repeat(20,1fr)] gap-px ${className}`}
    >
      {cells.map((_, i) => (
        <motion.span
          key={i}
          className="aspect-square bg-foreground"
          initial={{ opacity: 0.04 }}
          animate={{ opacity: [0.04, 0.22, 0.04] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: (i % 20) * 0.11 + Math.floor(i / 20) * 0.07,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/** Photographic plate — image treated as a framed exhibition print. */
export function ImagePlate({
  src,
  alt,
  glyph,
  label,
  caption,
  ratio = "aspect-[4/3]",
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  glyph?: string;
  label?: string;
  caption?: string;
  ratio?: string;
  className?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.14, 1.02]);

  return (
    <div ref={ref} className={className}>
      <div className={`group relative w-full overflow-hidden bg-surface ${ratio}`}>
        <motion.img
          src={src}
          alt={alt}
          width={1600}
          height={1008}
          {...(priority ? {} : { loading: "lazy" as const })}
          style={{ y, scale }}
          className="absolute inset-0 h-[116%] w-full object-cover opacity-70 grayscale transition-opacity duration-[1400ms] group-hover:opacity-95 light:opacity-90 light:contrast-[1.08] light:group-hover:opacity-100"
        />
        <span aria-hidden className="absolute inset-0 bg-background/35 light:bg-background/15" />
        <motion.span
          aria-hidden
          className="absolute inset-0 z-20 origin-top bg-background"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: inView ? 0 : 1 }}
          transition={{ duration: 2.1, ease: EASE }}
        />
        <div className="absolute inset-0 opacity-60">
          <Hairlines columns={6} rows={4} />
        </div>
        <CornerTicks />
        {glyph ? (
          <span className="display pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-[30vw] leading-none text-foreground mix-blend-difference light:mix-blend-multiply light:text-foreground/15 md:text-[13vw]">
            {glyph}
          </span>
        ) : null}
        {label ? <span className="eyebrow absolute left-5 top-5 z-10">{label}</span> : null}
      </div>
      {caption ? (
        <p className="eyebrow mt-5 flex items-center gap-4">
          <span className="inline-block h-[1px] w-10 bg-border" />
          {caption}
        </p>
      ) : null}
    </div>
  );
}
