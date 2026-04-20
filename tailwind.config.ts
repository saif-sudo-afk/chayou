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
        bg: "#f3ecdc",
        brand: "#4e0200",
        gold: "#C9A84C",
        "gold-light": "#e8d5a3",
        text: "#2a1a0e",
        muted: "#7a5c4a",
        border: "#d4c4a8",
        surface: "#faf7f0",
        background: "#f3ecdc",
        foreground: "#2a1a0e",
        card: "#faf7f0",
        panel: "#faf7f0",
        success: "#6f7b45",
        warning: "#e8d5a3",
        danger: "#8f2c1f",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        sans: ["Jost", "sans-serif"],
      },
      backgroundImage: {
        parchment:
          "radial-gradient(circle at 20% 0%, rgba(232,213,163,0.42), transparent 32%), linear-gradient(180deg, #f3ecdc, #efe3cd)",
        "bordeaux-soft":
          "linear-gradient(135deg, rgba(78,2,0,0.95), rgba(42,26,14,0.96))",
        "gold-radial":
          "radial-gradient(circle at center, rgba(201,168,76,0.18), transparent 60%)",
        "card-glow":
          "linear-gradient(180deg, rgba(232,213,163,0.45), rgba(250,247,240,0) 42%)",
      },
      boxShadow: {
        glow: "0 20px 60px rgba(78, 2, 0, 0.12)",
        editorial: "0 24px 80px rgba(42, 26, 14, 0.18)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseCart: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.12)" },
        },
      },
      animation: {
        marquee: "marquee 24s linear infinite",
        float: "float 6s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease-out both",
        "pulse-cart": "pulseCart 0.45s ease-out",
      },
    },
  },
  plugins: [animate],
};
export default config;
