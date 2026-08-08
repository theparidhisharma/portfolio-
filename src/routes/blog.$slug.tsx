import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BLOG_POSTS } from "@/lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = BLOG_POSTS.find((post) => post.slug === params.slug);

    if (!post) {
      throw notFound();
    }

    return { post };
  },

  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();

  return (
    <main className="min-h-screen px-[6vw] py-[8vh]">
      {/* Back */}
      <Link
        to="/"
        hash="journal"
        className="eyebrow inline-block text-foreground transition-opacity hover:opacity-50"
      >
        ← Back to Journal
      </Link>

      {/* Header */}
      <article className="mx-auto max-w-[70rem] pt-[12vh]">
        <div className="mb-8 flex flex-wrap items-center gap-6 rule-t pt-6">
          <span className="eyebrow">{post.tag}</span>
          <span className="marker">{post.date}</span>
          <span className="marker">{post.readingTime}</span>
        </div>

        <h1 className="display max-w-[12ch] text-[13vw] leading-[0.85] md:text-[7vw]">
          {post.title}
        </h1>

        <p className="lede mt-12 max-w-[45rem]">
          {post.excerpt}
        </p>

        {/* Hero image */}
        <div className="mt-[10vh] overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="h-auto w-full object-cover"
          />
        </div>

        {/* Blog content */}
        <div className="mx-auto mt-[10vh] max-w-[45rem]">
          <BlogContent slug={post.slug} />
        </div>
      </article>
    </main>
  );
}

function BlogContent({ slug }: { slug: string }) {
  switch (slug) {
    case "the-log-is-the-truth":
      return (
        <div className="copy space-y-8">
          <p>
            Distributed systems become difficult to reason about when every
            service keeps its own version of what happened.
          </p>

          <p>
            An append-only event log gives the system a shared history — a
            record that services can consume, replay, and reason about
            independently.
          </p>

          <h2 className="display mt-16 text-4xl">
            One record. Many consumers.
          </h2>

          <p>
            The interesting part isn't simply storing events. It's deciding
            what belongs in the log, what guarantees consumers can rely on,
            and how the system behaves when something goes wrong.
          </p>
        </div>
      );

    case "interfaces-are-arguments":
      return (
        <div className="copy space-y-8">
          <p>
            Every interface makes an argument about what matters.
          </p>

          <p>
            Before writing the first component, I like to understand the
            hierarchy of information: what should be noticed first, what can
            wait, and what should disappear entirely.
          </p>

          <h2 className="display mt-16 text-4xl">
            Drawing before building
          </h2>

          <p>
            The paper stage is often the cheapest place to be wrong.
          </p>
        </div>
      );

    case "a-budget-for-latency":
      return (
        <div className="copy space-y-8">
          <p>
            Tail latency isn't something that happens after architecture.
            Architecture creates it.
          </p>

          <p>
            Every network hop, database query, serialization step, and
            downstream dependency consumes part of the request's latency
            budget.
          </p>

          <h2 className="display mt-16 text-4xl">
            Spend milliseconds deliberately
          </h2>

          <p>
            A useful latency budget makes those tradeoffs visible before they
            become production incidents.
          </p>
        </div>
      );

    case "teaching-what-you-build":
      return (
        <div className="copy space-y-8">
          <p>
            Teaching a system forces you to understand it differently.
          </p>

          <p>
            Someone asking why a component exists is often more useful than
            someone simply accepting the architecture.
          </p>

          <h2 className="display mt-16 text-4xl">
            Explain the why
          </h2>

          <p>
            The ability to explain a system clearly is part of building it
            well.
          </p>
        </div>
      );

    default:
      return null;
  }
}