# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 5.x     | Yes       |
| 4.x     | Security fixes only |
| < 4.0   | No        |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please email: **hello@zhuhe.io**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 5 business days
- **Fix or mitigation**: Within 30 days for critical issues

## Scope

This project consists of markdown-based skill files with no runtime dependencies. The primary security concerns are:

- **Prompt injection**: Skill files that could be manipulated to produce harmful outputs
- **MCP server configuration**: Misconfigured connectors in `.mcp.json` that could expose credentials
- **Placeholder misuse**: `~~tool` placeholders resolving to unintended targets

## Security Design Principles

- **Zero runtime dependencies**: No packages to compromise via supply chain attacks
- **No credential storage**: Skills never store API keys; credentials live in user-managed `.mcp.json`
- **Tool-agnostic placeholders**: Skills reference tools by category (`~~SEO tool`), never by hardcoded API endpoints
- **Apache 2.0 license**: Full source available for security review

## Acknowledgments

We thank the security community for responsible disclosure. Contributors who report valid vulnerabilities will be credited in release notes (with permission).
