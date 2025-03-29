module.exports = {
  root: true, // Prevent ESLint from looking further up the directory tree
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  plugins: [
    '@typescript-eslint', // Specifies the ESLint plugin
  ],
  extends: [
    'eslint:recommended', // Uses the recommended rules from @eslint-eslint/js
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
  ],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    // project: './tsconfig.json', // Optional: If you want rules requiring type information
  },
  env: {
    node: true, // Enable Node.js global variables and Node.js scoping.
    es2021: true, // Adds all ECMAScript 2021 globals and automatically sets the ecmaVersion parser option to 12.
    jest: true,   // Adds Jest global variables (useful when writing tests)
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "warn", // Warn instead of error for explicit any
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // Warn on unused vars, allow underscores
    // Add other custom rules or overrides here
  },
  ignorePatterns: [
      "dist/**/*", // Ignore the build output directory
      "node_modules/**/*" // Ignore node_modules
  ]
}; 