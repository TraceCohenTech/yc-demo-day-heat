import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "-apple-system", "BlinkMacSystemFont", "SF Pro Text", "Inter", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "SF Mono", "Menlo", "monospace"],
      },
      colors: {
        yc: {
          orange: '#FF6600',
          'orange-light': '#FFF3EB',
          'orange-mid': '#FFE0CC',
          dark: '#1a1a1a',
          cream: '#faf8f5',
          'warm-gray': '#f0ece6',
        },
      },
      transitionTimingFunction: {
        'geist': 'cubic-bezier(0.175, 0.885, 0.32, 1.1)',
      },
    },
  },
  plugins: [],
};
export default config;
