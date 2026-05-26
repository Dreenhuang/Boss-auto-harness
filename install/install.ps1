# Boss-auto-harness v2.0 - Global Installation Script (Windows PowerShell)
# Purpose: Install all Skills and configs to TRAE global directory
# After installation, all TRAE projects can directly use Boss mode features

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Write-Info { param($msg) Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-OK { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Warn { param($msg) Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err { param($msg) Write-Host "[ERROR] $msg" -ForegroundColor Red }

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SourceDir = if ($ScriptDir -match "install$") { Split-Path -Parent $ScriptDir } else { $ScriptDir }

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Boss-auto-harness v2.0 Global Installer" -ForegroundColor Cyan
Write-Host "  All TRAE projects can use Boss mode after installation" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Detect TRAE installation directory
$UserHome = [Environment]::GetFolderPath('UserProfile')
$TraeDirs = @(".trae", ".trae-cn")
$TraeDir = $null

foreach ($dir in $TraeDirs) {
    $testPath = Join-Path $UserHome $dir
    if (Test-Path $testPath) {
        $TraeDir = $testPath
        Write-OK "Detected TRAE config directory: $TraeDir"
        break
    }
}

if (-not $TraeDir) {
    $TraeDir = Join-Path $UserHome ".trae"
    Write-Warn "No TRAE config directory found, will create: $TraeDir"
}

# Create required directory structure
$SkillsDir = Join-Path $TraeDir "skills"
$AgentsDir = Join-Path $TraeDir "agents"
$RulesDir = Join-Path $TraeDir "rules"

Write-Info "Creating directory structure..."
foreach ($dir in @($TraeDir, $SkillsDir, $AgentsDir, $RulesDir)) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-OK "  Created: $dir"
    }
}

# Copy Skills
Write-Info "Copying Skills to global directory..."
$SourceSkillsDir = Join-Path $SourceDir "skills"
if (Test-Path $SourceSkillsDir) {
    Get-ChildItem -Path $SourceSkillsDir -Directory | ForEach-Object {
        $skillName = $_.Name
        $destSkillDir = Join-Path $SkillsDir $skillName
        if (Test-Path $destSkillDir) {
            Remove-Item -Path $destSkillDir -Recurse -Force
        }
        Copy-Item -Path $_.FullName -Destination $SkillsDir -Recurse -Force
        Write-OK "  Installed Skill: $skillName"
    }
} else {
    Write-Err "Skills directory not found: $SourceSkillsDir"
    exit 1
}

# Copy Agents
Write-Info "Copying Agents to global directory..."
$SourceAgentsDir = Join-Path $SourceDir "trae-agents"
if (Test-Path $SourceAgentsDir) {
    Get-ChildItem -Path $SourceAgentsDir -Filter "*.md" | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination $AgentsDir -Force
        Write-OK "  Installed Agent: $($_.Name)"
    }
}

# Copy CLAUDE.md (main configuration)
Write-Info "Copying main configuration..."
$SourceClaude = Join-Path $SourceDir "CLAUDE.md"
if (Test-Path $SourceClaude) {
    Copy-Item -Path $SourceClaude -Destination $TraeDir -Force
    Write-OK "  Installed: CLAUDE.md"
}

# Create global Rules file
Write-Info "Creating global trigger rules..."
$rulesContent = @"
# Boss-auto-harness Global Trigger Rules
# Version: 2.0.0
# Updated: 2026-04-30

## Trigger Keywords
When user input contains these keywords, automatically load Boss-auto-harness config:

### Primary Keywords
- "Boss" (capitalized)
- "boss" (lowercase)

### Chinese Keywords
- "boss模式"
- "boss moshi" (pinyin)
- "Boss-harness"
- "harness"
- "全自动开发"

### Shortcut Commands
- "/boss" - Quick activation
- "/harness" - Harness mode
- "/pm" - Product manager mode

## Configuration File Locations
- Main config: ~/.trae/CLAUDE.md
- Skills: ~/.trae/skills/
- Agents: ~/.trae/agents/

## Version Info
- Config Version: 2.0.0
- Last Updated: 2026-04-30
"@

$rulesFile = Join-Path $RulesDir "boss-auto-harness.rules"
Set-Content -Path $rulesFile -Value $rulesContent -Encoding UTF8
Write-OK "  Created: boss-auto-harness.rules"

# Create uninstall script
Write-Info "Creating uninstall script..."
$uninstallContent = @'
# Boss-auto-harness Global Uninstall Script (Windows PowerShell)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$UserHome = [Environment]::GetFolderPath('UserProfile')
$TraeDir = Join-Path $UserHome ".trae"

Write-Host "⚠️  Boss-auto-harness Uninstaller" -ForegroundColor Yellow
Write-Host "Will remove the following global configurations:" -ForegroundColor Yellow
Write-Host "  - Skills directory" -ForegroundColor Yellow
Write-Host "  - Agents directory" -ForegroundColor Yellow
Write-Host "  - CLAUDE.md (if exists)" -ForegroundColor Yellow
Write-Host "  - Rules files" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Confirm uninstall? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Uninstall cancelled" -ForegroundColor Cyan
    exit 0
}

$dirsToRemove = @(
    (Join-Path $TraeDir "skills"),
    (Join-Path $TraeDir "agents"),
    (Join-Path $TraeDir "rules")
)

foreach ($dir in $dirsToRemove) {
    if (Test-Path $dir) {
        Remove-Item -Path $dir -Recurse -Force
        Write-Host "✅ Removed: $dir" -ForegroundColor Green
    }
}

$filesToRemove = @(
    (Join-Path $TraeDir "CLAUDE.md"),
    (Join-Path $TraeDir "boss-auto-harness.rules")
)

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Force
        Write-Host "✅ Removed: $file" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "✅ Uninstall complete! Restart TRAE IDE to apply changes." -ForegroundColor Green
'@

$uninstallFile = Join-Path $TraeDir "uninstall-boss-auto-harness.ps1"
Set-Content -Path $uninstallFile -Value $uninstallContent -Encoding UTF8
Write-OK "  Created uninstall script: $uninstallFile"

# Verify installation
Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "                    ✅ Installation Complete!             " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Installation locations:" -ForegroundColor White
Write-Host "  Skills: $SkillsDir" -ForegroundColor Gray
Write-Host "  Agents: $AgentsDir" -ForegroundColor Gray
Write-Host "  Config: $TraeDir" -ForegroundColor Gray
Write-Host ""
Write-Host "Verify installation:" -ForegroundColor White
Write-Host "  1. Restart TRAE IDE" -ForegroundColor Gray
Write-Host "  2. Open any project" -ForegroundColor Gray
Write-Host "  3. Type 'Boss' or 'boss模式' to test" -ForegroundColor Gray
Write-Host ""
Write-Host "Uninstall:" -ForegroundColor White
Write-Host "  powershell -ExecutionPolicy Bypass -File $uninstallFile" -ForegroundColor Gray
Write-Host ""
