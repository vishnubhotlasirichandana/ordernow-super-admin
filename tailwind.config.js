/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- Enables toggleable dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { 
          DEFAULT: '#FF7A18', 
          hover: '#e06912',
          50: '#fff7ed',
          100: '#ffedd5',
          600: '#ea580c'
        },
        surface: '#F1F5F9',
        card: '#FFFFFF',
        // Dark mode specific colors (optional, but good for reference)
        dark: {
          surface: '#0F172A',
          card: '#1E293B',
          border: '#334155'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}