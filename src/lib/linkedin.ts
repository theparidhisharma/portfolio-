export type LinkedInPost = {
  id: string;
  date: string;
  kind: "Post" | "Article" | "Repost";
  excerpt: string;
  href: string;
  reactions?: number;
  comments?: number;
};

/**
 * Recent LinkedIn posts. Paste the post permalink and a short excerpt —
 * the wall renders a preview card that opens the post on LinkedIn.
 */
export const LINKEDIN_POSTS: LinkedInPost[] = [
  {
    id: "li-1",
    date: "2026.04",
    kind: "Post",
    excerpt:
      "Shipped a change that cut p99 on the ranking path by a third. The fix wasn't clever — it was deleting a synchronous call nobody remembered adding.",
    href: "https://www.linkedin.com/in/theparidhisharma/recent-activity/all/",
    reactions: 412,
    comments: 37,
  },
  {
    id: "li-2",
    date: "2026.02",
    kind: "Article",
    excerpt:
      "Notes from building an event-driven platform across ten services: contracts first, dashboards second, opinions last.",
    href: "https://www.linkedin.com/in/theparidhisharma/recent-activity/all/",
    reactions: 968,
    comments: 84,
  },
  {
    id: "li-3",
    date: "2025.12",
    kind: "Post",
    excerpt:
      "Spoke to the Microsoft Student Chapter about observability — the part of software nobody photographs, and the first thing you miss at 3am.",
    href: "https://www.linkedin.com/in/theparidhisharma/recent-activity/all/",
    reactions: 233,
    comments: 19,
  },
];
