import kafka from "@/assets/blog-kafka.jpg";
import interfaces from "@/assets/blog-interfaces.jpg";
import latency from "@/assets/blog-latency.jpg";
import teaching from "@/assets/blog-teaching.jpg";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tag: string;
  image: string;
  /** intrinsic dimensions — the collage algorithm packs by aspect ratio */
  width: number;
  height: number;
  href?: string;
};

/**
 * Add a blog by appending an entry here. The collage re-packs itself
 * automatically — no layout edits required.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "the-log-is-the-truth",
    title: "The log is the truth",
    excerpt:
      "Ten services, no shared database, and one append-only record everyone agrees on. Notes on designing an event log you can actually reason about.",
    date: "2026.03",
    readingTime: "8 min",
    tag: "Distributed Systems",
    image: kafka,
    width: 1200,
    height: 1500,
  },
  {
    slug: "interfaces-are-arguments",
    title: "Interfaces are arguments",
    excerpt:
      "Every screen makes a claim about what matters. On drawing before building, and why the paper stage is the cheapest place to be wrong.",
    date: "2026.01",
    readingTime: "6 min",
    tag: "Design",
    image: interfaces,
    width: 1600,
    height: 1000,
  },
  {
    slug: "a-budget-for-latency",
    title: "A budget for latency",
    excerpt:
      "Tail latency is a design decision, not an accident. How to spend milliseconds deliberately across a request path.",
    date: "2025.11",
    readingTime: "11 min",
    tag: "Performance",
    image: latency,
    width: 1400,
    height: 1400,
  },
  {
    slug: "teaching-what-you-build",
    title: "Teaching what you build",
    excerpt:
      "Running a student chapter taught me more about architecture than any design doc. On explaining systems to a room that will ask why.",
    date: "2025.09",
    readingTime: "5 min",
    tag: "Practice",
    image: teaching,
    width: 1600,
    height: 1100,
  },
];
