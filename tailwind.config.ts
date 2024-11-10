import type { Config } from "tailwindcss";
import scrollbar from "tailwind-scrollbar";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  corePlugins: {
    container: false,
  },
  plugins: [scrollbar({ nocompatible: true })],
  theme: {
    fontFamily: {
      lora: ["Lora"],
      rethinkSans: ["RethinkSans"],
    },

    /* Radius */
    borderRadius: {
      sharp: "0px",
      xxs: "2px",
      xs: "2px",
      s: "4px",
      sm: "6px",
      m: "10px",
      ml: "16px",
      lg: "24px",
      xl: "36px",
      "2xl": "46px",
      round: "999px",
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
      },
      /* Box Shadow */
      boxShadow: {
        "appic-shadow": "4px 4px 0px 0px #00000040",
      },
    },
  },
};
export default config;
