/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#060A1C',
        navy: '#0A1130',
        deep: '#13215A',
        ink: '#1A2550',
        violet: { DEFAULT: '#8B6CFF', soft: '#B9A6FF' },
        gold: { DEFAULT: '#E6B860', soft: '#F3D79E' },
        sand: '#EADCC0',
        mist: '#A9B2D6',
      },
      fontFamily: {
        display: ['"Reem Kufi"', '"IBM Plex Sans Arabic"', 'Tahoma', 'sans-serif'],
        body: ['"IBM Plex Sans Arabic"', 'Tahoma', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
