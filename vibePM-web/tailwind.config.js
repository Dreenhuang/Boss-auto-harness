/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff2442',
        'primary-light': '#ff4d6d',
        'primary-dark': '#e01e3c',
        accent: '#6366f1',
        'accent-light': '#818cf8',
        'accent-dark': '#4f46e5',
        'bg-primary': '#fafafa',
        'bg-secondary': '#ffffff',
        'text-primary': '#1a1a1a',
        'text-secondary': '#666666',
        'text-muted': '#999999',
        'border-light': '#eeeeee',
        'border-lighter': '#f5f5f5'
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      screens: {
        'mobile': '375px',
        'mobile-lg': '428px'
      }
    }
  },
  plugins: []
}
