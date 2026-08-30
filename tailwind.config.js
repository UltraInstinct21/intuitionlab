/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "cream-paper": "#fdfbf9",
        "charcoal": "#171717",
        "cocoa-ink": "#2b1a07",
        "true-black": "#000000",
        "dew-drop": "#f7efe9",
        "marker-orange": "#ff6f1e",
        "burnt-sienna": "#ce500a",
        "sky-sticker": "#3b82f6",
        "bubblegum-sticker": "#ff66cf",
        "sprout-sticker": "#22c55e",
        "shadow-mist": "#bebcbb",
        
        // Semantic Superr tokens
        "surface": "#fdfbf9",
        "surface-dim": "#dcd9d9",
        "surface-bright": "#fcf9f8",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f6f3f2",
        "surface-container": "#f0eded",
        "surface-container-high": "#eae7e7",
        "surface-container-highest": "#e5e2e1",
        "on-surface": "#1c1b1b",
        "on-surface-variant": "#594137",
        "inverse-surface": "#231f1d",
        "inverse-on-surface": "#f3f0ef",
        "outline": "#8d7165",
        "outline-variant": "#e1bfb2",
        "primary": "#a23f00",
        "on-primary": "#ffffff",
        "primary-container": "#ff6f1e",
        "on-primary-container": "#5b2000",
        "primary-fixed": "#ffdbcc",
        "primary-fixed-dim": "#ffb595",
        "on-primary-fixed": "#351000",
        "secondary": "#725a42",
        "secondary-container": "#fbdabb",
        "on-secondary-container": "#775e46",
        "tertiary": "#625d59",
        "tertiary-fixed": "#e9e1db",
        "tertiary-fixed-dim": "#ccc5c0",
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'gelica', 'Recoleta', 'system-ui', 'sans-serif'],
        sans: ['Geist', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Geist Mono"', '"Fira Code"', '"JetBrains Mono"', 'Consolas', 'monospace'],
        handwriting: ['"Caveat"', '"Kalam"', 'cursive'],
      },
      borderRadius: {
        'DEFAULT': '0.5rem',
        'sm': '0.25rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '1.25rem',
        'pill': '20px',
        'footer': '56px',
        'full': '9999px',
      },
      boxShadow: {
        'hard': '2px 2px 0px 0px rgba(41,24,6,0.15)',
        'hard-hover': '3px 3px 0px 0px rgba(41,24,6,0.25)',
        'hard-lg': '4px 4px 0px 0px rgba(41,24,6,0.2)',
        'hard-xl': '6px 6px 0px 0px rgba(41,24,6,0.25)',
        'paper': 'rgba(0, 0, 0, 0.06) 0px 2px 20px 0px',
        'subtle': 'rgba(0, 0, 0, 0.25) 0px 1px 2px 0px',
      },
      animation: {
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
