const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Next.js アプリのパスを指定
  dir: './',
})

// Jest の設定をカスタマイズ
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/layout.tsx',
    '!src/app/globals.css',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!lucide-react/)'
  ],
}

// Next.jsの設定とマージして export
module.exports = createJestConfig(customJestConfig) 