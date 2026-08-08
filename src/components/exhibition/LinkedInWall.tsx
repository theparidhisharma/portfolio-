import { motion } from "motion/react";
import { LINKEDIN_POSTS } from "@/lib/linkedin";
import { SOCIALS } from "@/lib/works";

const EASE = [0.16, 1, 0.3, 1] as const;

export function LinkedInWall() {
  return (
    <div className="grid gap-[1px] bg-border md:grid-cols-3">
      {LINKEDIN_POSTS.map((post, i) => (
        <motion.a
          key={post.id}
          href={post.href}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, delay: i * 0.1, ease: EASE }}
          className="group relative flex min-h-[34vh] flex-col justify-between bg-background p-8 transition-colors duration-700 hover:bg-muted/30"
        >
          <div className="flex items-baseline justify-between">
            <span className="marker">{post.kind}</span>
            <span className="marker">{post.date}</span>
          </div>

          <p className="copy mt-10 max-w-[26rem] text-[1.05rem] leading-relaxed">
            {post.excerpt}
          </p>

          <div className="mt-10 flex items-center justify-between rule-t pt-5">
            <span className="marker">
              {post.reactions ?? 0} reactions · {post.comments ?? 0} comments
            </span>
            <span className="eyebrow inline-flex items-center gap-2 text-foreground transition-transform duration-500 group-hover:translate-x-1">
              Open ↗
            </span>
          </div>
        </motion.a>
      ))}

      <div className="bg-background p-8 md:col-span-3">
        <a
          href={SOCIALS.linkedin}
          target="_blank"
          rel="noreferrer"
          className="eyebrow inline-block text-foreground"
        >
          <span className="story-link">All activity on LinkedIn</span>
        </a>
      </div>
    </div>
  );
}
