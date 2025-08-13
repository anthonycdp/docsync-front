/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "transition-loader-spin": "transition-loader-spin 2s linear infinite",
        "transition-message-enter": "transition-message-enter 0.8s ease-out",
        "transition-message-exit": "transition-message-exit 0.6s ease-in",
        "transition-overlay-enter": "transition-overlay-enter 0.5s ease-out",
        "particle-float": "particle-float 4s ease-in-out infinite",
        "glassmorphism-pulse": "glassmorphism-pulse 3s ease-in-out infinite",
        "progress-shimmer": "progress-shimmer 2s ease-in-out infinite",
        "luma-spin": "luma-spin 2.5s infinite",
        "luma-spin-delay": "luma-spin 2.5s infinite -1.25s",
      },
      keyframes: {
        "transition-loader-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "transition-message-enter": {
          "0%": { 
            opacity: "0", 
            transform: "translateY(20px) scale(0.9)",
            filter: "blur(8px)"
          },
          "50%": { 
            opacity: "0.8", 
            transform: "translateY(10px) scale(0.95)",
            filter: "blur(4px)"
          },
          "100%": { 
            opacity: "1", 
            transform: "translateY(0) scale(1)",
            filter: "blur(0px)"
          },
        },
        "transition-message-exit": {
          "0%": { 
            opacity: "1", 
            transform: "translateY(0) scale(1)",
            filter: "blur(0px)"
          },
          "50%": { 
            opacity: "0.3", 
            transform: "translateY(-10px) scale(0.95)",
            filter: "blur(2px)"
          },
          "100%": { 
            opacity: "0", 
            transform: "translateY(-20px) scale(0.9)",
            filter: "blur(6px)"
          },
        },
        "transition-overlay-enter": {
          "0%": { 
            opacity: "0",
            backdropFilter: "blur(0px)"
          },
          "100%": { 
            opacity: "1",
            backdropFilter: "blur(12px)"
          },
        },
        "particle-float": {
          "0%, 100%": { 
            transform: "translateY(0px) rotate(0deg)",
            opacity: "0.6"
          },
          "50%": { 
            transform: "translateY(-20px) rotate(180deg)",
            opacity: "1"
          },
        },
        "glassmorphism-pulse": {
          "0%, 100%": { 
            background: "rgba(255, 255, 255, 0.1)",
            transform: "scale(1)"
          },
          "50%": { 
            background: "rgba(255, 255, 255, 0.2)",
            transform: "scale(1.02)"
          },
        },
        "progress-shimmer": {
          "0%": { 
            transform: "translateX(-100%)"
          },
          "100%": { 
            transform: "translateX(100%)"
          },
        },
        "luma-spin": {
          "0%": { inset: "0 35px 35px 0" },
          "12.5%": { inset: "0 35px 0 0" },
          "25%": { inset: "35px 35px 0 0" },
          "37.5%": { inset: "35px 0 0 0" },
          "50%": { inset: "35px 0 0 35px" },
          "62.5%": { inset: "0 0 0 35px" },
          "75%": { inset: "0 0 35px 35px" },
          "87.5%": { inset: "0 0 35px 0" },
          "100%": { inset: "0 35px 35px 0" },
        },
      },
      maxWidth: {
        'app-content': '1024px',
        'app-container': '80rem', // 1280px - padrão
        'app-container-xl': '90rem', // 1440px - telas grandes (≥1536px)
        'app-preview': '1200px',
        'app-main': '90vw',
        'app-sidebar': '16rem',
      },
      spacing: {
        'app-gap': '1rem',
        'app-gap-lg': '1.5rem',
        'app-bottom': '3rem',
        'app-bottom-lg': '4rem',
      },
      gridTemplateColumns: {
        'app-layout': 'minmax(300px, 1fr) minmax(240px, 16rem)',
        'app-layout-lg': 'minmax(400px, 1fr) minmax(280px, 18rem)',
        'app-layout-xl': 'minmax(500px, 1fr) minmax(320px, 20rem)',
      },
      screens: {
        '2xl': '1536px', // Garantir que 2xl seja exatamente 1536px
      },
    },
  },
  plugins: [],
}