/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gdm: {
          bg: '#0A0E1A',
          dark: '#0A0E1A',
          card: '#131929',
          border: '#1E2D45',
          purple: '#7C3AED',
          'purple-light': '#9D5CF0',
          'purple-dark': '#5B21B6',
          emerald: '#10B981',
          'emerald-light': '#34D399',
          'text-primary': '#F1F5F9',
          'text-secondary': '#94A3B8',
          'text-muted': '#64748B',
          // Aliases for consistency
          text: '#F1F5F9',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gdm-gradient': 'linear-gradient(135deg, rgba(124,58,237,0.13) 0%, rgba(16,185,129,0.13) 100%)',
        'gdm-hero': 'linear-gradient(135deg, #0A0E1A 0%, #131929 50%, #0A0E1A 100%)',
        'purple-glow': 'radial-gradient(ellipse at center, rgba(124,58,237,0.3) 0%, transparent 70%)',
      },
      animation: {
        'bar1': 'bar 1.2s ease-in-out infinite',
        'bar2': 'bar 1.2s ease-in-out 0.2s infinite',
        'bar3': 'bar 1.2s ease-in-out 0.4s infinite',
        'bar4': 'bar 1.2s ease-in-out 0.6s infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
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
        'gdm': '0 4px 24px rgba(124,58,237,0.15)',
        'gdm-lg': '0 8px 40px rgba(124,58,237,0.25)',
        'card': '0 2px 12px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
};
