/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#001F3F',
          dark: '#00162d',
          light: '#002d5c',
        },
        'soft-white': {
          DEFAULT: '#FAFAFA',
          dark: '#F0F0F0',
        },
        /* Full sky-blue accent scale (100–900) — required by Design Rulebook §2.3a */
        'sky-blue': {
          50:  '#eff8ff',
          100: '#dbeefe',
          200: '#bfe3fe',
          300: '#93d2fd',
          400: '#60b8fa',
          500: '#3a9cf6',
          DEFAULT: '#0074D9',
          600: '#0074D9',
          700: '#0062b8',
          800: '#004f96',
          900: '#003d74',
          dark: '#0062b8',
          light: '#3a9cf6',
        },
        /* Semantic color tokens */
        success: {
          DEFAULT: '#16a34a',
          light: '#f0fdf4',
        },
        danger: {
          DEFAULT: '#dc2626',
          light: '#fef2f2',
        },
        warning: {
          DEFAULT: '#d97706',
          light: '#fffbeb',
        },
      },

      fontFamily: {
        /* Body font — highly readable */
        jakarta: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans:    ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        /* Display/heading font — for large UI text */
        outfit:  ['"Outfit"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      boxShadow: {
        /* Elevation system per Design Rulebook §5.1 */
        'level-1': '0 1px 3px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)',
        'level-2': '0 4px 16px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
        'level-3': '0 24px 64px rgba(0,0,0,0.18)',
        'navy':    '0 8px 32px rgba(0,31,63,0.2)',
        'accent':  '0 8px 24px rgba(0,116,217,0.25)',
        'lift':    '0 8px 32px rgba(0,0,0,0.12)',
      },

      borderRadius: {
        'sm':  '6px',
        'md':  '8px',
        'lg':  '12px',
        'xl':  '16px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
      },

      animation: {
        'shimmer':     'shimmer 1.5s infinite',
        'spring-pop':  'springPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1.0) forwards',
        'reveal-up':   'revealUp 0.45s cubic-bezier(0.0, 0.0, 0.2, 1.0) forwards',
        'toast-in':    'toastIn 0.35s cubic-bezier(0.0, 0.0, 0.2, 1.0) forwards',
        'toast-out':   'toastOut 0.25s cubic-bezier(0.4, 0.0, 1.0, 1.0) forwards',
        'pulse-ring':  'pulseRing 1.5s ease-out infinite',
      },

      keyframes: {
        shimmer: {
          'from': { backgroundPosition: '200% 0' },
          'to':   { backgroundPosition: '-200% 0' },
        },
        springPop: {
          '0%':   { opacity: '0', transform: 'scale(0.7) translateY(4px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        revealUp: {
          'from': { opacity: '0', transform: 'translateY(16px)' },
          'to':   { opacity: '1', transform: 'translateY(0)' },
        },
        toastIn: {
          'from': { opacity: '0', transform: 'translateY(16px) scale(0.96)' },
          'to':   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        toastOut: {
          'from': { opacity: '1', transform: 'translateY(0) scale(1)' },
          'to':   { opacity: '0', transform: 'translateY(-8px) scale(0.96)' },
        },
        pulseRing: {
          '0%':   { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)',   opacity: '0' },
        },
      },

      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1.0)',
        'out':    'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
        'in':     'cubic-bezier(0.4, 0.0, 1.0, 1.0)',
        'in-out': 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
      },
    },
  },
  plugins: [],
}
