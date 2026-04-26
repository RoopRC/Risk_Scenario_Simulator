/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050a15',
          900: '#0a0e1a',
          800: '#0f1628',
          700: '#162d47',
          600: '#1e3a5f',
          500: '#264653',
        },
        body: {
          DEFAULT: '#0f1628',
          light: '#162d47',
          lighter: '#1e3a5f',
          dark: '#050a15',
        },
        accent: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        teal: {
          DEFAULT: '#06b6d4',
          light: '#22d3ee',
        },
        primary: '#10b981',
        secondary: '#a855f7',
        danger: '#ef4444',
        warning: '#f97316',
        success: '#10b981',
        surface: {
          DEFAULT: '#0f1628',
          card: '#162d47',
          dark: '#050a15',
          muted: '#0a0e1a',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#e2e8f0',
          muted: '#94a3b8',
          accent: '#06b6d4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.65rem',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'card': '0 1px 4px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.25)',
        'sidebar': '4px 0 24px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(148, 137, 121, 0.15)',
        'glow-lg': '0 0 40px rgba(148, 137, 121, 0.2)',
        'glow-accent': '0 4px 16px rgba(148, 137, 121, 0.25)',
      },
      spacing: {
        'sidebar': '220px',
      },
      screens: {
        'xs': '375px',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(148,137,121,0.15)' },
          '50%': { boxShadow: '0 0 20px rgba(148,137,121,0.3)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}