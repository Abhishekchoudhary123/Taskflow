/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:  { DEFAULT: '#6366f1', dark: '#4f46e5', light: '#818cf8' },
        dark:     { DEFAULT: '#0f172a', card: '#1e293b', border: '#334155' },
        accent:   '#22d3ee',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-in-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: 0 },
                   '100%': { transform: 'translateY(0)', opacity: 1 } },
      },
    },
  },
  plugins: [],
};
