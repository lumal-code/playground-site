import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        active_bg: "rgb(246, 245, 244)",
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(10px)' },  // Overshoot by 10px
          '75%': { transform: 'translateX(-5px)' },  // Bounce back past target
        }
      },
      animation: {
        bounce: 'bounce 0.5s ease-in-out'
      }
    },
  },
  plugins: [],
} satisfies Config;
