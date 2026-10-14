#!/usr/bin/env bash
# Installs MCP servers and the REA skill at Claude Code USER scope,
# so they are available in every project on this machine.
#
# Usage:  bash scripts/setup-claude-mcp.sh
# Re-running is safe: existing entries are replaced.
set -euo pipefail

command -v claude >/dev/null 2>&1 || { echo "error: 'claude' CLI not found. Install Claude Code first."; exit 1; }
command -v npx    >/dev/null 2>&1 || { echo "error: 'npx' not found. Install Node.js 22+ first."; exit 1; }

read -rp "Perplexity API key (leave blank to read \$PERPLEXITY_API_KEY from your shell env): " PPLX_KEY
read -rp "Firecrawl API key  (leave blank to read \$FIRECRAWL_API_KEY from your shell env): " FC_KEY
PPLX_KEY=${PPLX_KEY:-'${PERPLEXITY_API_KEY}'}
FC_KEY=${FC_KEY:-'${FIRECRAWL_API_KEY}'}

add_json() {  # name json
  claude mcp remove -s user "$1" >/dev/null 2>&1 || true
  claude mcp add-json -s user "$1" "$2"
}

echo "==> Perplexity"
add_json perplexity "{\"type\":\"stdio\",\"command\":\"npx\",\"args\":[\"-y\",\"@perplexity-ai/mcp-server\"],\"env\":{\"PERPLEXITY_API_KEY\":\"$PPLX_KEY\"}}"

echo "==> Playwright"
add_json playwright '{"type":"stdio","command":"npx","args":["-y","@playwright/mcp@latest"]}'

echo "==> Firecrawl"
add_json firecrawl "{\"type\":\"stdio\",\"command\":\"npx\",\"args\":[\"-y\",\"firecrawl-mcp\"],\"env\":{\"FIRECRAWL_API_KEY\":\"$FC_KEY\"}}"

echo "==> Chrome DevTools"
add_json chrome-devtools '{"type":"stdio","command":"npx","args":["-y","chrome-devtools-mcp@latest"]}'

echo "==> Higgsfield (hosted; OAuth login happens inside Claude Code via /mcp)"
claude mcp remove -s user higgsfield >/dev/null 2>&1 || true
claude mcp add --transport http --scope user higgsfield https://mcp.higgsfield.ai/mcp

echo "==> REA (Reverse Engineer Anything): MCP server + skill in ~/.claude/skills"
npx -y rea-agents@latest setup --client claude_code --yes

echo
echo "Done. Current user-scope servers:"
claude mcp list
echo
echo "Next: start 'claude', run /mcp, and complete the Higgsfield OAuth login once."
