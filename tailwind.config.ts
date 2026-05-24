import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17201b",
        moss: "#53695f",
        leaf: "#1d6f54",
        mint: "#dff3e9",
        clay: "#a75d38",
        wheat: "#f4e2bf",
        paper: "#fbfaf6"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 32, 27, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
