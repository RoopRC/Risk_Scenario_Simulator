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
          950: '#1a1e25',
          900: '#222831',
          800: '#2b3039',
          700: '#393E46',
          600: '#4a5059',
          500: '#5c636c',
        },
        body: {
          DEFAULT: '#233D4D',
          light: '#2A4858',
          lighter: '#325566',
          dark: '#1B3040',
        },
        accent: {
          DEFAULT: '#948979',
          light: '#a89e8e',
          dark: '#7d7466',
        },
        teal: {
          DEFAULT: '#948979',
          light: '#a89e8e',
        },
        primary: '#393E46',
        secondary: '#948979',
        danger: '#E05A4A',
        warning: '#E8B84A',
        success: '#5CB87A',
        surface: {
          DEFAULT: '#233D4D',
          card: '#2A4858',
          dark: '#222831',
          muted: '#1B3040',
        },
        text: {
          primary: '#DFD0B8',
          secondary: '#A3B8C2',
          muted: '#6B8A9C',
          accent: '#948979',
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