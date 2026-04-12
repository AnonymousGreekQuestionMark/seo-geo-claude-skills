import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      '__tests__/**/*.test.js',
    ],
    exclude: ['**/node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['shared/**/*.js', 'mcp-servers/**/*.js'],
      exclude: ['**/__tests__/**', '**/__mocks__/**', '**/__fixtures__/**'],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80
      }
    },
    setupFiles: ['./__tests__/setup.js'],
    testTimeout: 10000,
    hookTimeout: 10000,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    },
    // Workspace projects for targeted test runs
    workspace: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['__tests__/shared/**/*.test.js', '__tests__/mcp-servers/**/*.test.js']
        }
      },
      {
        extends: true,
        test: {
          name: 'contracts',
          include: ['__tests__/contracts/**/*.test.js']
        }
      },
      {
        extends: true,
        test: {
          name: 'orchestration',
          include: ['__tests__/orchestration/**/*.test.js']
        }
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          include: ['__tests__/e2e/**/*.test.js'],
          testTimeout: 120000
        }
      }
    ]
  }
});
