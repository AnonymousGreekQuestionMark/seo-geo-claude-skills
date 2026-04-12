#!/bin/bash
# Wrapper to ensure .env is loaded before running MCP server
cd "$(dirname "$0")/../.."
echo "[run-with-env] Loading .env from $(pwd)/.env" >&2
set -a
source .env 2>/dev/null || true
set +a
echo "[run-with-env] ANTHROPIC_API_KEY set: ${ANTHROPIC_API_KEY:+yes}" >&2
echo "[run-with-env] Starting node $@" >&2
exec node "$@"
