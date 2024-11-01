import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
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

      /* Box Shadow */
      boxShadow: {
        "appic-shadow": "4px 4px 0px 0px #00000040",
      },
    },
  },
  plugins: [],
}
export default config
