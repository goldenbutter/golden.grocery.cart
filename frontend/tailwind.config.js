/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f7f0',
          100: '#dceddc',
          200: '#bcdabc',
          300: '#8dbf8d',
          400: '#5a9e5a',
          500: '#3a7d3a',
          600: '#2d632d',
          700: '#254f25',
          800: '#1f401f',
          900: '#1a351a',
        },
        cream: {
          50: '#fdfcf8',
          100: '#faf7f0',
          200: '#f5ede0',
          300: '#ede0cc',
        },
        earth: {
          400: '#c4956a',
          500: '#b07d50',
          600: '#8f6340',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 28px rgba(0,0,0,0.14)',
      }
    }
  },
  plugins: []
}
