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
      borderRadius: {
        card: "0.375rem",
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
      },
      animation: {
        shimmer: "shimmer 1.8s linear infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        progress: "progress 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
