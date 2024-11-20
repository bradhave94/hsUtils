import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF5C35',
          50: '#FFF1EE',
          100: '#FFE4DD',
          200: '#FFB8A3',
          300: '#FF8C69',
          400: '#FF743F',
          500: '#FF5C35',
          600: '#FF3D0D',
          700: '#E02C00',
          800: '#A82100',
          900: '#701600',
          950: '#550F00',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;