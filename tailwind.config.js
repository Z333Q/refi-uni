/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ReFi.trading color system
        'midnight-canvas': '#0F181F',
        'neon-green': '#43D4A0',
        'snow-white': '#F5F7FA',
        'blue-gray': '#A8B8C5',
        'alert-red': '#FF4C4C',
        'card-bg': '#121821',
        'card-stroke': '#1E2B3A',
        'modal-bg': '#1A2433',
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        'base-grid': '8px',
        'gutter': '24px',
      },
      borderRadius: {
        'default': '8px',
      },
      boxShadow: {
        'card': '0 1px 2px rgba(0, 0, 0, 0.5)',
        'neon-glow': '0 0 140px rgba(67, 212, 160, 0.2)',
      },
      transitionTimingFunction: {
        'refi': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};