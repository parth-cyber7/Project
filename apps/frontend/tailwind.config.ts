import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefcfb',
          100: '#d4f6f3',
          200: '#acece7',
          300: '#75ded8',
          400: '#3bc5bf',
          500: '#19a9a5',
          600: '#128985',
          700: '#116d6b',
          800: '#125757',
          900: '#12494a'
        },
        accent: {
          100: '#fff4e8',
          300: '#ffcb94',
          500: '#f08a24',
          700: '#b75909'
        }
      },
      boxShadow: {
        card: '0 20px 45px -30px rgba(15, 23, 42, 0.35)'
      },
      animation: {
        'fade-up': 'fadeUp 0.45s ease-out both'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
