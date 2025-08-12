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