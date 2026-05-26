# Boss-harness - TRAE Keyword Activation Setup
# Version: 2.0.0
# Updated: 2026-04-30

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Boss-harness - TRAE Keyword Activation Setup" -ForegroundColor Cyan
Write-Host "  Version: 2.0.0" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$UserProfile = [Environment]::GetFolderPath('UserProfile')
$TRAE_DIR = Join-Path $UserProfile ".trae"
$TRAE_AGENTS_DIR = Join-Path $TRAE_DIR "agents"
$TRAE_RULES_DIR = Join-Path $TRAE_DIR "rules"
$SOURCE_DIR = "K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents"

Write-Host "[1/4] Creating TRAE directories..." -ForegroundColor Yellow

# Create agents directory
if (-not (Test-Path $TRAE_AGENTS_DIR)) {
    New-Item -ItemType Directory -Path $TRAE_AGENTS_DIR -Force | Out-Null
    Write-Host "       Created: $TRAE_AGENTS_DIR" -ForegroundColor Green
}

# Create rules directory
if (-not (Test-Path $TRAE_RULES_DIR)) {
    New-Item -ItemType Directory -Path $TRAE_RULES_DIR -Force | Out-Null
    Write-Host "       Created: $TRAE_RULES_DIR" -ForegroundColor Green
}
Write-Host ""

Write-Host "[2/4] Copying AGENT files..." -ForegroundColor Yellow

if (Test-Path $SOURCE_DIR) {
    # Copy main agent file
    $mainAgent = Join-Path $SOURCE_DIR "boss-product-manager.md"
    if (Test-Path $mainAgent) {
        Copy-Item -Path $mainAgent -Destination $TRAE_AGENTS_DIR -Force
        Write-Host "       Copied: boss-product-manager.md" -ForegroundColor Green
    }

    # Copy all agent files
    Copy-Item -Path "$SOURCE_DIR\*.md" -Destination $TRAE_AGENTS_DIR -Force -ErrorAction SilentlyContinue
    Write-Host "       Copied all AGENT files" -ForegroundColor Green
} else {
    Write-Host "       [ERROR] Source directory not found" -ForegroundColor Red
}
Write-Host ""

Write-Host "[3/4] Creating keyword rules file..." -ForegroundColor Yellow

$rulesContent = @"
# Boss-harness - Keyword Activation Rules
# Version: 2.0.0
# Updated: 2026-04-30

## Keyword Triggers

When user input matches these keywords, automatically activate Boss-harness:

### Primary Keywords
- "boss" → Activate main agent
- "Boss" → Activate main agent

### Command Keywords
- "boss模式" → Activate Boss Mode (full automation)
- "boss moshi" → Activate Boss Mode
- "Boss-harness" → Activate with Boss-harness workflow
- "harness" → Activate harness mode

### Shortcut Commands
- "/boss" → Quick activation
- "/harness" → Harness mode activation
- "/pm" → Product manager mode

## Agent Configuration

### Main Agent: boss-product-manager
- File: boss-product-manager.md
- Mode: agent
- Temperature: 0.3
- Color: #3b82f6

### Available Sub-Agents (11 total)
1. product-manager-demand - Demand collection
2. design-brief-builder - Design brief
3. design-maker - Design creation
4. dev-planner - Development planning
5. dev-builder - Development execution
6. code-reviewer - Code review
7. bug-fixer - Bug fixing
8. release-builder - Release & deploy
9. feedback-writer - Feedback recording
10. evolution-engine - Evolution engine
11. skill-builder - Skill creation

## Activation Flow

### Keyword Detection
1. Monitor user input for keyword matches
2. Match found → Load boss-product-manager.md
3. Initialize agent with user context
4. Execute appropriate workflow

### Workflow Selection
- "boss模式" → dev-builder (full automation)
- "Boss-harness" → dev-planner (Boss-harness workflow)
- Other keywords → product-manager-demand (standard mode)

## Custom Instructions

When keywords are detected:
- Set agent role to "Boss-harness产品经理"
- Activate product development workflow
- Follow Boss-harness PM principles
- Enable all available skills

## File Locations
- Agent definitions: ~/.trae/agents/
- Rules config: ~/.trae/rules/boss.rules
- Main agent: ~/.trae/agents/boss-product-manager.md

## Version Info
- Config Version: 2.0.0
- Last Updated: 2026-04-30
"@

$rulesFile = Join-Path $TRAE_RULES_DIR "boss.rules"
Set-Content -Path $rulesFile -Value $rulesContent -Encoding UTF8
Write-Host "       Created: $rulesFile" -ForegroundColor Green
Write-Host ""

Write-Host "[4/4] Verifying installation..." -ForegroundColor Yellow

$agentFiles = Get-ChildItem "$TRAE_AGENTS_DIR\*.md" -ErrorAction SilentlyContinue
$agentCount = $agentFiles.Count

Write-Host "       Found $agentCount AGENT files" -ForegroundColor Cyan
Write-Host ""

# Display activation keywords
Write-Host "================================================" -ForegroundColor Green
Write-Host "  SUCCESS! Setup completed!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Available Keywords:" -ForegroundColor White
Write-Host "  - boss        → Activate main agent" -ForegroundColor Cyan
Write-Host "  - Boss        → Activate main agent" -ForegroundColor Cyan
Write-Host "  - boss模式    → Boss Mode (full automation)" -ForegroundColor Cyan
Write-Host "  - boss moshi  → Boss Mode" -ForegroundColor Cyan
Write-Host "  - Boss-harness → Boss-harness workflow" -ForegroundColor Cyan
Write-Host "  - harness     → Harness mode" -ForegroundColor Cyan
Write-Host ""
Write-Host "Shortcut Commands:" -ForegroundColor White
Write-Host "  - /boss       → Quick activation" -ForegroundColor Gray
Write-Host "  - /harness    → Harness mode" -ForegroundColor Gray
Write-Host "  - /pm         → Product manager mode" -ForegroundColor Gray
Write-Host ""
Write-Host "Files installed:" -ForegroundColor White
Write-Host "  - $TRAE_AGENTS_DIR\boss-product-manager.md" -ForegroundColor Gray
Write-Host "  - $TRAE_RULES_DIR\boss.rules" -ForegroundColor Gray
Write-Host "  - And $(($agentCount - 1)) other AGENT files" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Restart TRAE IDE" -ForegroundColor Gray
Write-Host "  2. Type any keyword to activate Boss-harness" -ForegroundColor Gray
Write-Host "  3. Enjoy AI-powered product development!" -ForegroundColor Gray
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Press Enter to exit..." -ForegroundColor Gray
Read-Host
