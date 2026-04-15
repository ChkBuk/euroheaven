import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "2rem",
        lg: "3rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        // Dark-first surfaces (main app background is dark)
        ink: {
          950: "#0C131C",
          900: "#111A24",
          800: "#172231",
          700: "#1E2B3D",
          600: "#293A51",
          500: "#3A4D66",
        },
        // Blue accent (from reference)
        accent: {
          DEFAULT: "#2B6DFF",
          50: "#EEF3FF",
          100: "#D6E2FF",
          400: "#4F85FF",
          500: "#2B6DFF",
          600: "#1C56E0",
          700: "#1645B8",
        },
        // Light surfaces for contrast sections
        paper: "#F5F6F8",
        bone: "#ECEEF2",
        // Keep brand palette as semantic aliases
        brand: {
          navy: "#111A24",
          silver: "#A4AAAE",
          black: "#0A0A0A",
          red: "#2B6DFF", // alias now points to blue for legacy classes
          surface: "#FFFFFF",
          muted: "#F5F6F8",
          success: "#16A34A",
          warning: "#F59E0B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      boxShadow: {
        card: "0 10px 30px rgba(10,15,25,0.35)",
        cta: "0 10px 30px rgba(43,109,255,0.35)",
        light: "0 10px 30px rgba(10,15,25,0.08)",
      },
      borderRadius: {
        card: "14px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-up": "fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) forwards",
        "scale-in": "scaleIn 1s cubic-bezier(0.22,1,0.36,1) forwards",
        "slide-right": "slideRight 0.8s cubic-bezier(0.22,1,0.36,1) forwards",
        "marquee": "marquee 40s linear infinite",
        "pulse-ring": "pulseRing 2.2s ease-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(1.08)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        pulseRing: {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
