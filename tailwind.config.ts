import type { Config } from "tailwindcss";
import scrollbar from "tailwind-scrollbar";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  plugins: [scrollbar({ nocompatible: true })],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },

    fontFamily: {
      lora: ["Lora"],
      rethinkSans: ["RethinkSans"],
    },
    extend: {
      /* Colors */
      colors: {
        primary: "rgb(var(--primary))",
        secondary: "rgb(var(--secondary))",
        tertiary: "rgb(var(--tertiary))",
        active: "rgb(var(--active))",
        success: "rgb(var(--success))",
        fail: "rgb(var(--fail))",
        muted: "rgb(var(--muted))",
        "box-border": "var(--box-border)",
        "card-background": "var(--card-background)",
      },
      /* Background */
      backgroundImage: {
        "input-fields": "var(--input-fields)",
        "primary-buttons": "var(--primary-buttons)",
        "highlighed-components": "var(--highlighed-components)",
        "background-dark": "var(--background-dark)",
        "shapes-background": "var(--shapes-background)",
        "card-background": "var(--card-background)",
        "box-background": "var(--box-background)",
        "highlighted-card": "var(--highlighted-card)",
        "input-fields-hover": "var(--input-fields-hover)",
      },
      /* Box Shadow */
      boxShadow: {
        "appic-shadow": "4px 4px 0px 0px #00000040",
      },

      /* Keyframes */
      keyframes: {
        slideInFromRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInFromLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInFromTop: {
          "0%": { transform: "translateY(-10%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in": {
          "0%": {
            opacity: "0",
            transform: "translateX(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        slideInFromTopWithHeight: {
          "0%": {
            transform: "translateY(-10%)",
            opacity: "0",
            maxHeight: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
            maxHeight: "700px",
          },
        },
        "border-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },

      /* Animation */
      animation: {
        "slide-in-from-right": "slideInFromRight 0.5s ease-in-out",
        "slide-in-from-left": "slideInFromLeft 0.5s ease-in-out",
        "slide-in": "slide-in 0.3s ease-out 0.1s forwards",
        "slide-in-from-top": "slideInFromTop 0.2s ease-out",
        "slide-in-with-height":
          "slideInFromTopWithHeight 0.3s ease-out forwards",
        "border-spin": "border-spin 2s linear infinite",
      },
    },
  },
};
export default config;
