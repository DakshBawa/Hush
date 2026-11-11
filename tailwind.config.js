/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1E1B3A',
        paper: '#F4F1FF',
        mist: '#E3DDFF',
        violet: '#6C4CF1',
        coral: '#FF5C7A',
        sun: '#FFC94D',
        mint: '#2FD3A5',
        sky: '#5B8CFF',
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 0 #E3DDFF, 0 18px 36px -18px rgba(76, 52, 200, 0.35)',
      },
    },
  },
  plugins: [],
};
