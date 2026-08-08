import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Contribution field — a live, playable belt.
 * A snake crawls the 53×7 contribution grid and eats the squares.
 * Arrow keys (or WASD) steer it; click a square to send it there.
 */

const W = 53;
const H = 7;
const TICK = 110;
const DAYS = ["Mon", "", "Wed", "", "Fri", "", ""];
const MONTHS = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

type Pt = { x: number; y: number };

function seedField() {
  const cells = new Uint8Array(W * H);
  let s = 20260808;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  for (let x = 0; x < W; x++) {
    const streak = 0.35 + 0.5 * Math.abs(Math.sin(x / 6.2));
    for (let y = 0; y < H; y++) {
      const weekend = y >= 5 ? 0.45 : 1;
      const r = rnd() * streak * weekend;
      cells[y * W + x] = r > 0.62 ? 4 : r > 0.44 ? 3 : r > 0.28 ? 2 : r > 0.13 ? 1 : 0;
    }
  }
  return cells;
}

export function ContributionBelt() {
  const [cells, setCells] = useState<Uint8Array>(() => seedField());
  const [snake, setSnake] = useState<Pt[]>([{ x: 4, y: 3 }]);
  const [score, setScore] = useState(0);
  const [manual, setManual] = useState(false);

  const cellsRef = useRef(cells);
  const snakeRef = useRef(snake);
  const dirRef = useRef<Pt>({ x: 1, y: 0 });
  const targetRef = useRef<Pt | null>(null);
  const lenRef = useRef(6);
  const manualUntil = useRef(0);
  cellsRef.current = cells;
  snakeRef.current = snake;

  const total = useRef(
    (() => {
      const f = seedField();
      let t = 0;
      for (let i = 0; i < f.length; i++) t += f[i] ?? 0;
      return t;
    })(),
  ).current;

  const pickTarget = useCallback(() => {
    const head = snakeRef.current[0];
    if (!head) return null;
    const field = cellsRef.current;
    let best: Pt | null = null;
    let bestScore = -Infinity;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const v = field[y * W + x] ?? 0;
        if (!v) continue;
        const d = Math.abs(x - head.x) + Math.abs(y - head.y);
        const sc = v * 2 - d * 0.35;
        if (sc > bestScore) {
          bestScore = sc;
          best = { x, y };
        }
      }
    }
    return best;
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      const body = snakeRef.current;
      const head = body[0];
      if (!head) return;

      const isManual = Date.now() < manualUntil.current;
      setManual(isManual);

      let dir = dirRef.current;
      if (!isManual) {
        let target = targetRef.current;
        const field = cellsRef.current;
        if (!target || !(field[target.y * W + target.x] ?? 0)) {
          target = pickTarget();
          targetRef.current = target;
        }
        if (target) {
          const dx = target.x - head.x;
          const dy = target.y - head.y;
          dir =
            Math.abs(dx) >= Math.abs(dy)
              ? { x: Math.sign(dx) || dir.x, y: 0 }
              : { x: 0, y: Math.sign(dy) };
          if (dir.x === 0 && dir.y === 0) dir = { x: 1, y: 0 };
        }
        dirRef.current = dir;
      }

      let nx = head.x + dir.x;
      let ny = head.y + dir.y;
      // wrap the belt — it never dies, it just keeps working
      nx = (nx + W) % W;
      ny = (ny + H) % H;

      const next: Pt[] = [{ x: nx, y: ny }, ...body].slice(0, lenRef.current);
      setSnake(next);

      const idx = ny * W + nx;
      const value = cellsRef.current[idx] ?? 0;
      if (value > 0) {
        const field = new Uint8Array(cellsRef.current);
        field[idx] = 0;
        setCells(field);
        setScore((s) => s + value);
        lenRef.current = Math.min(26, lenRef.current + 1);
      }
    }, TICK);
    return () => window.clearInterval(id);
  }, [pickTarget]);

  // regrowth — the field keeps filling back in
  useEffect(() => {
    const id = window.setInterval(() => {
      setCells((prev) => {
        const field = new Uint8Array(prev);
        for (let k = 0; k < 3; k++) {
          const i = Math.floor(Math.random() * field.length);
          const cur = field[i] ?? 0;
          if (cur < 4 && Math.random() > 0.45) field[i] = (cur + 1) as number;
        }
        return field;
      });
    }, 1400);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Pt> = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
      };
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      dirRef.current = dir;
      manualUntil.current = Date.now() + 6000;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const snakeIndex = new Map<number, number>();
  snake.forEach((p, i) => snakeIndex.set(p.y * W + p.x, i));

  const eaten = Math.max(0, total - sum(cells));

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between rule-b pb-4">
        <p className="eyebrow">Contribution field — playable</p>
        <p className="marker">
          {String(score).padStart(4, "0")} eaten · length {snake.length} ·{" "}
          {manual ? "manual" : "auto"}
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <div className="hidden flex-col justify-between py-[2px] md:flex">
          {DAYS.map((d, i) => (
            <span key={i} className="marker h-[calc((100%-6*2px)/7)] leading-none opacity-60">
              {d}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div
            className="grid gap-[2px]"
            style={{
              gridTemplateColumns: `repeat(${W}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${H}, minmax(0, 1fr))`,
              gridAutoFlow: "column",
            }}
          >
            {Array.from({ length: W * H }).map((_, i) => {
              const x = i % W;
              const y = Math.floor(i / W);
              const idx = y * W + x;
              const level = cells[idx] ?? 0;
              const onSnake = snakeIndex.get(idx);
              const isHead = onSnake === 0;
              return (
                <button
                  key={idx}
                  type="button"
                  aria-label={`week ${x + 1}, day ${y + 1}`}
                  onClick={() => {
                    targetRef.current = { x, y };
                    manualUntil.current = 0;
                  }}
                  style={{ gridColumn: x + 1, gridRow: y + 1 }}
                  className={[
                    "aspect-square w-full rounded-[1px] transition-colors duration-300",
                    isHead
                      ? "bg-foreground"
                      : onSnake !== undefined
                        ? "bg-foreground/70"
                        : level === 4
                          ? "bg-foreground/85"
                          : level === 3
                            ? "bg-foreground/60"
                            : level === 2
                              ? "bg-foreground/38"
                              : level === 1
                                ? "bg-foreground/20"
                                : "bg-foreground/[0.07]",
                  ].join(" ")}
                />
              );
            })}
          </div>

          <div className="mt-4 hidden justify-between md:flex">
            {MONTHS.map((m) => (
              <span key={m} className="marker opacity-60">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rule-t pt-5">
        <p className="marker">
          Arrow keys or WASD to steer · click a square to send it there · {eaten} squares cleared
        </p>
        <div className="flex items-center gap-2">
          <span className="marker mr-2 opacity-60">Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span
              key={l}
              className={[
                "h-3 w-3 rounded-[1px]",
                l === 4
                  ? "bg-foreground/85"
                  : l === 3
                    ? "bg-foreground/60"
                    : l === 2
                      ? "bg-foreground/38"
                      : l === 1
                        ? "bg-foreground/20"
                        : "bg-foreground/[0.07]",
              ].join(" ")}
            />
          ))}
          <span className="marker ml-2 opacity-60">More</span>
        </div>
      </div>
    </div>
  );
}

function sum(a: Uint8Array) {
  let t = 0;
  for (let i = 0; i < a.length; i++) t += a[i] ?? 0;
  return t;
}
