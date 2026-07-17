import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          950: "#0B0F19",
          900: "#111827",
          800: "#1E293B",
        },
        portal: {
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
        },
        rick: {
          blue: "#38BDF8",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        logo: ["var(--font-logo)", "sans-serif"],
      },
      boxShadow: {
        "glow-sm": "0 0 12px 0 rgb(34 197 94 / 0.15)",
        "glow-md": "0 0 24px 2px rgb(34 197 94 / 0.2)",
      },
      borderRadius: {
        card: "1rem",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.85)" },
        },
        progress: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(400%)" },
        },
        aurora: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(30px, -20px) scale(1.12)" },
        },
        sheen: {
          "0%": { backgroundPosition: "0% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
      },
      animation: {
        shimmer: "shimmer 1.8s linear infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        progress: "progress 1s ease-in-out infinite",
        aurora: "aurora 16s ease-in-out infinite",
        "aurora-slow": "aurora 22s ease-in-out infinite reverse",
        sheen: "sheen 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
