import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			border: "var(--border-color)",
  			input: "var(--input-color)",
  			ring: "var(--accent-focus)",
  			background: "var(--bg-color)",
  			foreground: "var(--text-color)",
  			primary: {
  				DEFAULT: "var(--primary-color)",
  				foreground: "var(--bg-color)",
  			},
  			secondary: {
  				DEFAULT: "var(--secondary-color)",
  				foreground: "var(--text-color)",
  			},
  			accent: {
  				DEFAULT: "var(--secondary-color)",
  				foreground: "var(--text-color)",
  			},
  			destructive: {
  				DEFAULT: "var(--accent-error)",
  				foreground: "var(--bg-color)",
  			},
  			success: {
  				DEFAULT: "var(--accent-success)",
  				foreground: "var(--bg-color)",
  			},
  			warning: {
  				DEFAULT: "var(--accent-warning)",
  				foreground: "var(--bg-color)",
  			},
  			ink: {
  				50: "var(--ink-50)",
  				100: "var(--ink-100)",
  				200: "var(--ink-200)",
  				300: "var(--ink-300)",
  				400: "var(--ink-400)",
  				500: "var(--ink-500)",
  				600: "var(--ink-600)",
  				700: "var(--ink-700)",
  				800: "var(--ink-800)",
  				900: "var(--ink-900)",
  			}
  		},
  		borderRadius: {
  			lg: "var(--r-lg)",
  			md: "var(--r-md)",
  			sm: "var(--r-sm)",
  		},
  		fontFamily: {
  			hebrew: ["var(--font-hebrew)", "sans-serif"],
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
