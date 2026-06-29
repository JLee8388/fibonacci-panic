/** @type {import('tailwindcss').Config} */
export default {
  // Scan the markup and all source modules so every utility class — including
  // the color/shadow classes referenced as string literals in constants.js and
  // view.js — is emitted into the static stylesheet.
  content: ['./www/index.html', './src/**/*.js'],
  theme: {
    extend: {},
  },
  // Classes that are assembled dynamically; safelisted so the production build
  // never tree-shakes them away.
  safelist: [
    'bg-rose-500',
    'bg-blue-600',
    'bg-emerald-500',
    'bg-amber-400',
    'bg-rose-600',
    'bg-rose-950',
    'text-rose-500',
    'text-blue-600',
    'text-emerald-500',
    'text-amber-400',
    'shadow-rose-600',
    'shadow-blue-700',
    'shadow-emerald-600',
    'shadow-amber-500',
  ],
  plugins: [],
};
