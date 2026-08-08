import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./Theme";

const EASE = [0.16, 1, 0.3, 1] as const;

export type NavLink = { label: string; href: string };

/**
 * Scroll-summoned navigation. Hidden across the opening chapter, it slides
 * down as a hairline band once the first spread has been passed.
 */
export function Navbar({ links = [] }: { links?: NavLink[] }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShown(window.scrollY > window.innerHeight * 0.85);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AnimatePresence>
      {shown ? (
        <motion.header
          key="navbar"
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 1, ease: EASE }}
          className="fixed inset-x-0 top-0 z-[65] border-b border-border bg-background/80 backdrop-blur-xl"
        >
          <nav className="flex items-center justify-between gap-6 px-[6vw] py-4">
            <Link to="/" className="eyebrow text-foreground transition-opacity duration-500 hover:opacity-60">
              Paridhi
            </Link>

            <div className="hidden items-center gap-10 md:flex">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={go(link.href)}
                  className="marker text-foreground/70 transition-opacity duration-500 hover:opacity-100"
                >
                  <span className="story-link">{link.label}</span>
                </a>
              ))}
            </div>

            <ThemeToggle />
          </nav>
        </motion.header>
      ) : null}
    </AnimatePresence>
  );
}
