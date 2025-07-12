module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/apps/dashboard'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/apps/dashboard/$1'
  },
};
