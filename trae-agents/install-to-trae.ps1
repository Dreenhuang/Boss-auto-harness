# Feicai Agent Package - TRAE Global Installation Script
# Version: 1.0.0
# Updated: 2026-04-29

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Feicai Agent Package - TRAE Global Install" -ForegroundColor Cyan
Write-Host "  Version: 1.0.0" -ForegroundColor Cyan
Write-Host "  Updated: 2026-04-29" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$UserProfile = [Environment]::GetFolderPath('UserProfile')
$TRAE_AGENTS_DIR = Join-Path $UserProfile ".trae\agents"
$SOURCE_DIR = "K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents"

Write-Host "[1/3] Creating TRAE agents directory..." -ForegroundColor Yellow

if (-not (Test-Path $TRAE_AGENTS_DIR)) {
    New-Item -ItemType Directory -Path $TRAE_AGENTS_DIR -Force | Out-Null
    Write-Host "       Directory created: $TRAE_AGENTS_DIR" -ForegroundColor Green
} else {
    Write-Host "       Directory exists: $TRAE_AGENTS_DIR" -ForegroundColor Green
}
Write-Host ""

Write-Host "[2/3] Copying agent files..." -ForegroundColor Yellow

if (Test-Path $SOURCE_DIR) {
    Copy-Item -Path "$SOURCE_DIR\*" -Destination "$TRAE_AGENTS_DIR\" -Recurse -Force
    Write-Host "       Files copied successfully" -ForegroundColor Green
} else {
    Write-Host "       [ERROR] Source directory not found: $SOURCE_DIR" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check if the path exists:" -ForegroundColor Yellow
    Write-Host "  $SOURCE_DIR" -ForegroundColor Gray
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

Write-Host "[3/3] Verifying installation..." -ForegroundColor Yellow
Write-Host "       Checking file count..." -ForegroundColor Gray

$files = Get-ChildItem "$TRAE_AGENTS_DIR\*.md" -ErrorAction SilentlyContinue
$count = $files.Count

Write-Host "       Installed $count agent files" -ForegroundColor Cyan
Write-Host ""

if ($count -ge 11) {
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Installation completed!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Installation path: $TRAE_AGENTS_DIR" -ForegroundColor White
    Write-Host ""
    Write-Host "Included AGENTS:" -ForegroundColor White
    Write-Host "  - product-manager-demand.md  (Demand Collection)" -ForegroundColor Gray
    Write-Host "  - design-brief-builder.md      (Design Brief)" -ForegroundColor Gray
    Write-Host "  - design-maker.md             (Design Maker)" -ForegroundColor Gray
    Write-Host "  - dev-planner.md              (Dev Planner)" -ForegroundColor Gray
    Write-Host "  - dev-builder.md              (Dev Builder)" -ForegroundColor Gray
    Write-Host "  - code-reviewer.md            (Code Review)" -ForegroundColor Gray
    Write-Host "  - bug-fixer.md                (Bug Fixer)" -ForegroundColor Gray
    Write-Host "  - release-builder.md           (Release Builder)" -ForegroundColor Gray
    Write-Host "  - feedback-writer.md          (Feedback Writer)" -ForegroundColor Gray
    Write-Host "  - evolution-engine.md         (Evolution Engine)" -ForegroundColor Gray
    Write-Host "  - skill-builder.md             (Skill Builder)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Usage in TRAE:" -ForegroundColor White
    Write-Host "  1. Open TRAE IDE" -ForegroundColor Gray
    Write-Host '  2. In chat, reference agent file:' -ForegroundColor Gray
    Write-Host "     e.g: Please use $TRAE_AGENTS_DIR\product-manager-demand.md" -ForegroundColor Gray
    Write-Host '  3. Or copy file content to chat as system prompt' -ForegroundColor Gray
    Write-Host ""
    Write-Host "For detailed tutorial, see:" -ForegroundColor White
    Write-Host "  $TRAE_AGENTS_DIR\TRAE-INSTALL-GUIDE.md" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "[ERROR] Installation incomplete, found only $count files" -ForegroundColor Red
    Write-Host "        Expected at least 11 files" -ForegroundColor Red
    Write-Host ""
}

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Press Enter to exit..." -ForegroundColor Gray
Read-Host
