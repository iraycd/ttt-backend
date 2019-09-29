module.exports = {
    roots: ["<rootDir>"],
    transform: {
      "^.+\\.ts?$": "ts-jest"
    },
    collectCoverageFrom: [
      "/**/*.{js,jsx,ts,tsx}",
      "!<rootDir>/node_modules/",
      "!<rootDir>/path/to/dir/"
    ],
    coverageThreshold: {
      global: {
        branches: 60,
        functions: 60,
        lines: 60,
        statements: 60
      }
    },
    coverageReporters: ["text"]
};