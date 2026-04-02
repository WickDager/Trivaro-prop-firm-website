/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Trivaro Brand Colors
        primary: {
          DEFAULT: '#0A1628', // Deep Navy Blue
          light: '#1A2A40',
          dark: '#050B14',
        },
        secondary: {
          DEFAULT: '#00D9FF', // Bright Teal/Cyan
          light: '#33E3FF',
          dark: '#00B8D9',
        },
        accent: {
          DEFAULT: '#00FF88', // Electric Green
          light: '#33FF99',
          dark: '#00CC6A',
        },
        error: {
          DEFAULT: '#FF3B57', // Vibrant Red
          light: '#FF5C73',
          dark: '#CC2F46',
        },
        background: {
          DEFAULT: '#0F1419', // Dark charcoal
          light: '#1A1F2E',
          dark: '#0A0D12',
        },
        card: {
          DEFAULT: '#1A1F2E', // Semi-transparent dark
          hover: '#23293A',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A0AEC0',
          muted: '#718096',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(to bottom, rgba(10, 22, 40, 0.9), rgba(15, 20, 25, 0.95)), url("/images/hero-background.jpg")',
        'card-gradient': 'linear-gradient(145deg, rgba(26, 31, 46, 0.9), rgba(15, 20, 25, 0.95))',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 217, 255, 0.3)',
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.3)',
        'glow-red': '0 0 20px rgba(255, 59, 87, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
