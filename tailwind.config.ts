import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0D0D0D",
        foreground: "#FFFFFF",
        card: "#171717",
        panel: "#1A1A1A",
        border: "#2A2A2A",
        muted: "#9E9E9E",
        brand: "#8B0000",
        gold: "#C9A84C",
        success: "#2F7D5D",
        warning: "#A06B1A",
        danger: "#9F3A3A",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
      },
      backgroundImage: {
        "crimson-radial":
          "radial-gradient(circle at top, rgba(139,0,0,0.35), transparent 60%)",
        "gold-radial":
          "radial-gradient(circle at center, rgba(201,168,76,0.18), transparent 60%)",
        "card-glow":
          "linear-gradient(180deg, rgba(201,168,76,0.12), rgba(201,168,76,0) 42%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(201,168,76,0.08), 0 22px 60px rgba(0,0,0,0.35)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 6s linear infinite",
        float: "float 6s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [animate],
};
export default config;
