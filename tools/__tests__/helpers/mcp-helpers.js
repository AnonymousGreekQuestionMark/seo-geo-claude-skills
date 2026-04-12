/**
 * MCP SDK test helpers
 * Utilities for testing MCP server tool handlers in isolation
 */
import { vi } from 'vitest';

/**
 * Create a mock MCP server for testing
 * Captures request handlers and allows simulating tool calls
 */
export function createMockServer() {
  const handlers = new Map();
  let toolListHandler = null;
  let toolCallHandler = null;

  return {
    /**
     * Capture request handlers (called by MCP server setup)
     */
    setRequestHandler(schema, handler) {
      // Detect handler type by checking schema structure
      const schemaStr = JSON.stringify(schema);
      if (schemaStr.includes('ListTools') || schemaStr.includes('tools/list')) {
        toolListHandler = handler;
      } else if (schemaStr.includes('CallTool') || schemaStr.includes('tools/call')) {
        toolCallHandler = handler;
      }
      handlers.set(schema, handler);
    },

    /**
     * Simulate a tool call and return the result
     */
    async simulateToolCall(toolName, args = {}) {
      if (!toolCallHandler) {
        throw new Error('No tool call handler registered');
      }
      return toolCallHandler({
        params: {
          name: toolName,
          arguments: args
        }
      });
    },

    /**
     * Get the list of available tools
     */
    async listTools() {
      if (!toolListHandler) {
        throw new Error('No tool list handler registered');
      }
      return toolListHandler({});
    },

    /**
     * Mock connect method
     */
    connect: vi.fn().mockResolvedValue(undefined),

    /**
     * Get all registered handlers
     */
    getHandlers() {
      return handlers;
    }
  };
}

/**
 * Mock the MCP SDK modules
 * Call this in tests to replace real MCP SDK with mocks
 */
export function mockMcpSdk() {
  const mockServer = createMockServer();

  vi.mock('@modelcontextprotocol/sdk/server/index.js', () => ({
    Server: vi.fn(() => mockServer)
  }));

  vi.mock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
    StdioServerTransport: vi.fn()
  }));

  vi.mock('@modelcontextprotocol/sdk/types.js', () => ({
    CallToolRequestSchema: { description: 'CallToolRequest' },
    ListToolsRequestSchema: { description: 'ListToolsRequest' }
  }));

  return mockServer;
}

/**
 * Parse MCP tool response content
 * Extracts JSON data from the standard MCP response format
 */
export function parseToolResponse(response) {
  if (!response || !response.content || !response.content[0]) {
    return null;
  }
  const text = response.content[0].text;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Assert tool response is successful (not an error)
 */
export function assertSuccess(response) {
  if (response.isError) {
    const data = parseToolResponse(response);
    throw new Error(`Tool returned error: ${data?.error || 'Unknown error'}`);
  }
  return parseToolResponse(response);
}

/**
 * Assert tool response is an error
 */
export function assertError(response) {
  if (!response.isError) {
    throw new Error('Expected tool to return error, but it succeeded');
  }
  return parseToolResponse(response);
}

/**
 * Assert tool returned Tier 1 manual response
 */
export function assertTier1Manual(response) {
  const data = parseToolResponse(response);
  if (data.tier !== 1 || data.data_source !== 'manual_or_estimated') {
    throw new Error('Expected Tier 1 manual response');
  }
  return data;
}

/**
 * Assert CITE verdict matches expected value
 */
export function assertCiteVerdict(response, itemId, expectedVerdict) {
  const data = parseToolResponse(response);
  const verdictKey = `cite_${itemId}_verdict`;
  if (data[verdictKey] !== expectedVerdict) {
    throw new Error(`Expected ${verdictKey} to be ${expectedVerdict}, got ${data[verdictKey]}`);
  }
  return data;
}

/**
 * Create test tool call parameters
 */
export function createToolParams(toolName, args = {}) {
  return {
    params: {
      name: toolName,
      arguments: args
    }
  };
}

/**
 * Helper to test tier fallback behavior
 * Tests that a tool returns expected results at different tier levels
 */
export async function testTierFallback({
  toolName,
  args,
  tier2Env,
  tier1Env,
  noApiEnv,
  expectedTier2Source,
  expectedTier1Source,
  server
}) {
  const results = {};

  // Test Tier 2
  if (tier2Env) {
    Object.assign(process.env, tier2Env);
    vi.resetModules();
    // Re-import and test
    const response = await server.simulateToolCall(toolName, args);
    const data = parseToolResponse(response);
    results.tier2 = {
      source: data.source,
      tier: data.tier,
      data
    };
  }

  // Test Tier 1
  if (tier1Env) {
    Object.assign(process.env, tier1Env);
    vi.resetModules();
    const response = await server.simulateToolCall(toolName, args);
    const data = parseToolResponse(response);
    results.tier1 = {
      source: data.source,
      tier: data.tier,
      data
    };
  }

  // Test no API
  if (noApiEnv) {
    Object.assign(process.env, noApiEnv);
    vi.resetModules();
    const response = await server.simulateToolCall(toolName, args);
    const data = parseToolResponse(response);
    results.noApi = {
      tier: data.tier,
      isManual: data.data_source === 'manual_or_estimated',
      data
    };
  }

  return results;
}
