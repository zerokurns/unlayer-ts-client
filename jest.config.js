/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest', // Use the ts-jest preset
  testEnvironment: 'node', // Specify the test environment (Node.js for this library)
  roots: ['<rootDir>/src', '<rootDir>/tests'], // Look for tests in src and tests folders
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ], // Standard Jest test file patterns
  transform: {
    // Use ts-jest to transform TypeScript files
    '^.+\.(ts|tsx)$': ['ts-jest', {
      // ts-jest configuration options go here
      // For example, specify tsconfig if not automatically detected:
      // tsconfig: 'tsconfig.json',
    }]
  },
  collectCoverage: true, // Enable coverage collection
  coverageDirectory: "coverage", // Output directory for coverage reports
  coverageProvider: "v8", // Use V8 for coverage collection (usually faster)
  // Optional: Add module name mapping if needed (e.g., for path aliases)
  // moduleNameMapper: {
  //   '^@/(.*)$': '<rootDir>/src/$1',
  // },
  verbose: true, // Display individual test results with the test suite hierarchy.
}; 