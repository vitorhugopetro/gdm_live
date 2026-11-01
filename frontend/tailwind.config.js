/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gdm: {
          bg: '#07070D',
          dark: '#07070D',
          deep: '#0B0B16',
          card: '#0E1020',
          'card-glass': 'rgba(14, 16, 32, 0.75)',
          border: '#1C223A',
          'border-neon': 'rgba(112, 0, 255, 0.4)',
          'border-gold': 'rgba(255, 201, 40, 0.4)',
          purple: '#7000FF',
          'purple-light': '#9B4DFF',
          'purple-dark': '#5200BA',
          gold: '#FFC928',
          'gold-light': '#FFE58F',
          'gold-dark': '#B38600',
          emerald: '#10B981',
          'emerald-light': '#34D399',
          'text-primary': '#FFFFFF',
          'text-secondary': '#C9C9D4',
          'text-muted': '#7A839E',
          // Aliases for backwards compatibility
          text: '#FFFFFF',
          secondary: '#C9C9D4',
          muted: '#7A839E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        cursive: ['"Brush Script MT"', 'cursive', 'Georgia'],
      },
      backgroundImage: {
        'gdm-gradient': 'linear-gradient(135deg, rgba(112,0,255,0.18) 0%, rgba(255,201,40,0.08) 50%, rgba(16,185,129,0.1) 100%)',
        'gdm-hero': 'radial-gradient(ellipse at top right, rgba(112,0,255,0.25) 0%, #07070D 70%)',
        'purple-glow': 'radial-gradient(ellipse at center, rgba(112,0,255,0.35) 0%, transparent 70%)',
        'gold-glow': 'radial-gradient(ellipse at center, rgba(255,201,40,0.3) 0%, transparent 70%)',
        'gold-gradient': 'linear-gradient(135deg, #FFE066 0%, #FFC928 50%, #B38600 100%)',
      },
      animation: {
        'bar1': 'bar 1.2s ease-in-out infinite',
        'bar2': 'bar 1.2s ease-in-out 0.2s infinite',
        'bar3': 'bar 1.2s ease-in-out 0.4s infinite',
        'bar4': 'bar 1.2s ease-in-out 0.6s infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        bar: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'gdm': '0 4px 24px rgba(112,0,255,0.25)',
        'gdm-lg': '0 12px 48px rgba(112,0,255,0.35)',
        'gdm-gold': '0 4px 24px rgba(255,201,40,0.3)',
        'neon-purple': '0 0 20px rgba(112,0,255,0.6)',
        'card': '0 4px 20px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};
