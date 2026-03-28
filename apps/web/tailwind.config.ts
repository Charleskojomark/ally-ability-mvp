import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          amber: {
            DEFAULT: "#E8820C",
            50: "#FEF3E2",
            100: "#FDE4BF",
            200: "#FBC67A",
            300: "#F9A83E",
            400: "#F09015",
            500: "#E8820C",
            600: "#C06B0A",
            700: "#985508",
            800: "#703E06",
            900: "#482804",
          },
          green: {
            DEFAULT: "#1B5E38",
            50: "#E8F5EE",
            100: "#C6E7D5",
            200: "#8ECFAA",
            300: "#56B780",
            400: "#2D8F56",
            500: "#1B5E38",
            600: "#164E2E",
            700: "#113E25",
            800: "#0C2E1B",
            900: "#071E11",
          },
          gold: {
            DEFAULT: "#F5C842",
            50: "#FEF9E7",
            100: "#FCF0C3",
            200: "#FAE28B",
            300: "#F7D463",
            400: "#F5C842",
            500: "#DDAD1F",
            600: "#B58E19",
            700: "#8C6E13",
            800: "#634F0D",
            900: "#3A2F08",
          },
        },
        ivory: {
          DEFAULT: "#FDF8F0",
          50: "#FFFDFB",
          100: "#FDF8F0",
          200: "#F9EED9",
          300: "#F5E4C2",
        },
        charcoal: {
          DEFAULT: "#1A1A2E",
          50: "#2E2E48",
          100: "#252540",
          200: "#1F1F38",
          300: "#1A1A2E",
          400: "#151524",
          500: "#10101A",
          600: "#0A0A12",
        },
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        body: ["var(--font-source-serif)", "Source Serif 4", "Georgia", "serif"],
        dyslexia: ["Atkinson Hyperlegible", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "slide-in-left": "slideInLeft 0.5s ease-out forwards",
        "slide-in-right": "slideInRight 0.5s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "stagger-1": "fadeUp 0.6s ease-out 0.1s forwards",
        "stagger-2": "fadeUp 0.6s ease-out 0.2s forwards",
        "stagger-3": "fadeUp 0.6s ease-out 0.3s forwards",
        "stagger-4": "fadeUp 0.6s ease-out 0.4s forwards",
        "stagger-5": "fadeUp 0.6s ease-out 0.5s forwards",
        "stagger-6": "fadeUp 0.6s ease-out 0.6s forwards",
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
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.05)" },
        },
      },
      lineHeight: {
        relaxed: "1.7",
        loose: "1.85",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
