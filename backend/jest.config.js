{
  "testEnvironment": "node",
  "coverageDirectory": "coverage",
  "collectCoverageFrom": [
    "src/**/*.js",
    "!src/server.js",
    "!src/config/database.js"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 70,
      "functions": 75,
      "lines": 75,
      "statements": 75
    }
  },
  "coverageReporters": [
    "text",
    "text-summary",
    "html",
    "lcov"
  ],
  "testMatch": [
    "**/tests/**/*.test.js"
  ],
  "setupFilesAfterEnv": [
    "./tests/setup.js"
  ],
  "verbose": true,
  "silent": false,
  "testTimeout": 30000,
  "maxWorkers": "50%",
  "forceExit": true,
  "detectOpenHandles": true,
  "moduleNameMapper": {
    "^@/(.*)$": "<rootDir>/src/$1"
  }
}
