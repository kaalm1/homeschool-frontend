// .prettierrc.js
export default {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  tabWidth: 2,
  bracketSpacing: true,
  arrowParens: 'always',
  plugins: [import('prettier-plugin-tailwindcss')],
};
