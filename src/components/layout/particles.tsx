/**
 * Floating portal motes. Values are derived deterministically from the
 * index (never Math.random) so server and client render identical markup —
 * no hydration mismatch. Negative animation delays mean the field is
 * already populated on first paint instead of everything starting at the
 * bottom. Pure CSS transform/opacity animation; hidden under
 * prefers-reduced-motion (see globals.css).
 */

const PARTICLES = Array.from({ length: 18 }, (_, i) => {
  const seed = (n: number) => ((i + 1) * n) % 100;
  return {
    left: seed(37),
    size: 2 + (seed(13) % 4),
    duration: 14 + (seed(29) % 12),
    delay: -(seed(17) % 20),
    drift: (seed(23) % 60) - 30,
    glow: 0.2 + (seed(7) % 30) / 100,
    blue: seed(11) % 3 === 0,
  };
});

export function Particles() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {PARTICLES.map((p, i) => {
        const color = p.blue ? "56 189 248" : "74 222 128";
        return (
          <span
            key={i}
            className="particle"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: `rgb(${color} / 0.8)`,
              boxShadow: `0 0 ${p.size * 2}px rgb(${color} / 0.5)`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              ["--drift" as string]: `${p.drift}px`,
              ["--glow" as string]: `${p.glow}`,
            }}
          />
        );
      })}
    </div>
  );
}
