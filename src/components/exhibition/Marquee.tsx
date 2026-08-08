import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
} from "motion/react";

/**
 * Kinetic marquee band. Drifts continuously and accelerates — and reverses —
 * with scroll velocity. One long editorial sentence, treated as a physical object.
 */
export function Marquee({
  text,
  baseSpeed = 26,
  className = "",
}: {
  text: string;
  baseSpeed?: number;
  className?: string;
}) {
  const x = useMotionValue(0);
  const direction = useRef(1);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 320 });
  const factor = useTransform(smooth, [-1600, 0, 1600], [-4, 1, 4], { clamp: false });

  useAnimationFrame((_, delta) => {
    const f = factor.get();
    direction.current = f < 0 ? -1 : 1;
    const moveBy = direction.current * baseSpeed * (delta / 1000) * Math.abs(f || 1);
    let next = x.get() - moveBy;
    // one repetition is 25% of the track (4 copies)
    if (next <= -25) next += 25;
    if (next > 0) next -= 25;
    x.set(next);
  });

  return (
    <div
      aria-hidden
      className={`relative w-full overflow-hidden whitespace-nowrap ${className}`}
    >
      <motion.div className="flex w-max" style={{ x: useTransform(x, (v) => `${v}%`) }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="display shrink-0 pr-[6vw] text-[13vw] leading-[1] md:text-[8vw]">
            {text}
            <span className="px-[3vw] align-middle text-[0.4em] text-muted-foreground">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
