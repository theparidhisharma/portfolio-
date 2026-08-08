import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import type { BlogPost } from "@/lib/blog";

/* ------------------------------------------------------------------ */
/*  Collage packer                                                     */
/*  Greedy row-packing by aspect ratio: every row is normalised to     */
/*  exactly `cols` tracks, and its height is derived from the average  */
/*  aspect of the plates in it. Add a post — the grid re-solves.       */
/* ------------------------------------------------------------------ */

type Cell = { post: BlogPost; colSpan: number; rowSpan: number };

const UNIT_VW = 1.2; // one grid row, in vw
const TRACK_VW = 88; // collage width, in vw

function baseSpan(ratio: number, cols: number) {
  if (cols <= 4) return ratio > 1.35 ? 4 : 2;
  if (ratio > 1.5) return 7;
  if (ratio > 1.1) return 6;
  if (ratio < 0.85) return 4;
  return 5;
}

export function packCollage(posts: BlogPost[], cols: number): Cell[][] {
  const rows: Cell[][] = [];
  let current: { post: BlogPost; span: number; ratio: number }[] = [];
  let used = 0;

  const flush = (isLast: boolean) => {
    if (!current.length) return;
    const total = current.reduce((s, c) => s + c.span, 0);
    // normalise the row to exactly `cols` tracks
    let diff = cols - total;
    if (isLast) {
      // the tail row always fills the measure
      const share = Math.floor(cols / current.length);
      current.forEach((c, i) => {
        c.span = i === current.length - 1 ? cols - share * (current.length - 1) : share;
      });
      diff = 0;
    }
    const order = [...current].sort((a, b) => b.span - a.span);
    let i = 0;
    while (diff !== 0 && order.length) {
      const target = order[i % order.length];
      if (!target) break;
      const step = diff > 0 ? 1 : -1;
      if (target.span + step >= 2) {
        target.span += step;
        diff -= step;
      }
      i += 1;
      if (i > 200) break;
    }
    // row height from the average plate aspect at its packed width
    const heights = current.map((c) => ((c.span / cols) * TRACK_VW) / c.ratio);
    const avg = heights.reduce((s, h) => s + h, 0) / heights.length;
    const rowSpan = Math.max(8, Math.min(34, Math.round(avg / UNIT_VW)));

    rows.push(
      current.map((c) => ({
        post: c.post,
        colSpan: Math.min(cols, c.span),
        rowSpan,
      })),
    );
    current = [];
    used = 0;
  };

  posts.forEach((post) => {
    const ratio = post.width / post.height;
    const span = Math.min(cols, baseSpan(ratio, cols));
    current.push({ post, span, ratio });
    used += span;
    if (used >= cols) flush(false);
  });
  flush(true);

  return rows;
}

/* ------------------------------------------------------------------ */

export function CollageGallery({ posts }: { posts: BlogPost[] }) {
  const [cols, setCols] = useState(12);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const apply = () => setCols(query.matches ? 12 : 4);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  const rows = useMemo(() => packCollage(posts, cols), [posts, cols]);
  const cells = rows.flat();

  return (
    <div
      className="grid gap-[2px]"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridAutoRows: `${UNIT_VW}vw`,
      }}
    >
      {cells.map((cell, i) => (
        <CollagePlate key={cell.post.slug} cell={cell} index={i} />
      ))}
    </div>
  );
}

function CollagePlate({ cell, index }: { cell: Cell; index: number }) {
  const { post } = cell;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.1, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ gridColumn: `span ${cell.colSpan}`, gridRow: `span ${cell.rowSpan}` }}
      className="group relative min-h-[120px] overflow-hidden bg-muted/30"
    >
      <a
        href={post.href ?? "#blog"}
        className="absolute inset-0 block"
        aria-label={`${post.title} — ${post.tag}`}
      >
        <img
          src={post.image}
          alt={post.title}
          width={post.width}
          height={post.height}
          loading="lazy"
          className="h-full w-full object-cover grayscale contrast-[1.08] transition-all duration-[900ms] ease-out will-change-transform group-hover:scale-[1.03] group-hover:grayscale-0 group-focus-visible:grayscale-0"
        />

        {/* index mark — always visible, quietly */}
        <span className="marker absolute left-4 top-4 z-10 text-background mix-blend-difference">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* translucent card — hover only */}
        <div className="pointer-events-none absolute inset-0 flex items-end opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/45 to-transparent" />
          <div className="relative w-full translate-y-3 p-5 transition-transform duration-700 ease-out group-hover:translate-y-0 md:p-7">
            <div className="rule-t pt-4">
              <p className="eyebrow">
                {post.tag} · {post.date} · {post.readingTime}
              </p>
              <h3 className="display mt-3 text-[6vw] leading-[0.95] md:text-[2.1vw]">
                {post.title}
              </h3>
              <p className="copy mt-3 line-clamp-3 max-w-[38rem] text-sm">{post.excerpt}</p>
            </div>
          </div>
        </div>
      </a>
    </motion.article>
  );
}
