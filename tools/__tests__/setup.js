/**
 * Vitest setup file
 * Configures MSW (Mock Service Worker) for API mocking
 */
import { beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './__mocks__/handlers.js';

// Create MSW server with default handlers
export const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

// Reset handlers after each test (removes any runtime handlers)
afterEach(() => {
  server.resetHandlers();
});

// Close server after all tests
afterAll(() => {
  server.close();
});

// Export server for use in individual test files
export { handlers };
