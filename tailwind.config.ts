import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
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
      round: "999px",
    },

    fontSize: {
      // Desktop styles
      "display-1": "144px",
      "display-2": "96px",
      "display-3": "64px",
      "heading-1": "56px",
      "heading-2": "48px",
      "heading-3": "40px",
      "heading-4": "32px",
      // Desktop body styles
      "hero-bold": "28px",
      "hero-accent": "28px",
      "hero-emphasis": "28px",
      "hero-standard": "28px",
      "feature-bold": "24px",
      "feature-accent": "24px",
      "feature-emphasis": "24px",
      "feature-standard": "24px",
      "highlight-bold": "18px",
      "highlight-accent": "18px",
      "highlight-emphasis": "18px",
      "highlight-standard": "18px",
      "content-bold": "16px",
      "content-accent": "16px",
      "content-emphasis": "16px",
      "content-regular": "16px",
      "caption-bold": "14px",
      "caption-accent": "14px",
      "caption-emphasis": "14px",
      "caption-regular": "14px",

      // Mobile styles
      "mobile-display-1": "44px",
      "mobile-display-2": "40px",
      "mobile-display-3": "32px",
      "mobile-heading-1": "28px",
      "mobile-heading-2": "24px",
      "mobile-heading-3": "20px",
      "mobile-heading-4": "18px",
      // Mobile body styles
      "mobile-feature-bold": "18px",
      "mobile-feature-accent": "18px",
      "mobile-feature-emphasis": "18px",
      "mobile-feature-standard": "18px",
      "mobile-highlight-bold": "16px",
      "mobile-highlight-accent": "16px",
      "mobile-highlight-emphasis": "16px",
      "mobile-highlight-standard": "16px",
      "mobile-content-bold": "14px",
      "mobile-content-accent": "14px",
      "mobile-content-emphasis": "14px",
      "mobile-content-regular": "14px",
      "mobile-caption-accent": "12px",
      "mobile-caption-emphasis": "12px",
      "mobile-caption-regular": "12px",
      "mobile-footnote-accent": "10px",
      "mobile-footnote-emphasis": "10px",
      "mobile-footnote-regular": "10px",
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
      },

      /* Background */
      backgroundImage: {
        "input-fields": "var(--input-fields)",
        "primary-buttons": "var(--primary-buttons)",
        "highlighed-components": "var(--highlighed-components)",
        "background-main": "var(--background-main)",
      },

      /* Box Shadow */
      boxShadow: {
        "appic-shadow": "4px 4px 0px 0px #00000040",
      },
    },
  },
  plugins: [],
}
export default config
