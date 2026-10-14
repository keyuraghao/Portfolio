# Installs MCP servers and the REA skill at Claude Code USER scope on Windows,
# so they are available in every project on this machine.
#
# Usage (PowerShell):  .\scripts\setup-claude-mcp.ps1
# Re-running is safe: existing entries are replaced.
$ErrorActionPreference = "Stop"

if (-not (Get-Command claude -ErrorAction SilentlyContinue)) { throw "'claude' CLI not found. Install Claude Code first." }
if (-not (Get-Command npx    -ErrorAction SilentlyContinue)) { throw "'npx' not found. Install Node.js 22+ first." }

$pplx = Read-Host "Perplexity API key (leave blank to read PERPLEXITY_API_KEY from env)"
$fc   = Read-Host "Firecrawl API key  (leave blank to read FIRECRAWL_API_KEY from env)"
if (-not $pplx) { $pplx = '${PERPLEXITY_API_KEY}' }
if (-not $fc)   { $fc   = '${FIRECRAWL_API_KEY}' }

function Add-Server($name, $json) {
  claude mcp remove -s user $name 2>$null | Out-Null
  claude mcp add-json -s user $name $json
}

# On native Windows, stdio servers launched via npx must be wrapped in cmd.exe.
Write-Host "==> Perplexity"
Add-Server perplexity ("{""type"":""stdio"",""command"":""cmd"",""args"":[""/c"",""npx"",""-y"",""@perplexity-ai/mcp-server""],""env"":{""PERPLEXITY_API_KEY"":""$pplx""}}")

Write-Host "==> Playwright"
Add-Server playwright '{"type":"stdio","command":"cmd","args":["/c","npx","-y","@playwright/mcp@latest"]}'

Write-Host "==> Firecrawl"
Add-Server firecrawl ("{""type"":""stdio"",""command"":""cmd"",""args"":[""/c"",""npx"",""-y"",""firecrawl-mcp""],""env"":{""FIRECRAWL_API_KEY"":""$fc""}}")

Write-Host "==> Chrome DevTools"
Add-Server chrome-devtools '{"type":"stdio","command":"cmd","args":["/c","npx","-y","chrome-devtools-mcp@latest"]}'

Write-Host "==> Higgsfield (hosted; OAuth login happens inside Claude Code via /mcp)"
claude mcp remove -s user higgsfield 2>$null | Out-Null
claude mcp add --transport http --scope user higgsfield https://mcp.higgsfield.ai/mcp

Write-Host "==> REA (Reverse Engineer Anything): MCP server + skill in ~/.claude/skills"
npx -y rea-agents@latest setup --client claude_code --yes

Write-Host ""
Write-Host "Done. Current user-scope servers:"
claude mcp list
Write-Host ""
Write-Host "Next: start 'claude', run /mcp, and complete the Higgsfield OAuth login once."
