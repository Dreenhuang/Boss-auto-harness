# Boss-auto-harness 新项目激活脚本
# 用途：在任意项目中激活Boss模式功能
# 用法：在新项目目录运行此脚本

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 源项目路径（Boss-auto-harness安装目录）
$SourceDir = "k:\chanbpin4.0\120.产品经理技能包 4.0"
$TargetDir = Get-Location

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Boss-auto-harness 新项目激活" -ForegroundColor Cyan
Write-Host "  当前项目: $TargetDir" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================
# 1. 复制CLAUDE.md到目标项目
# ============================================================
$claudeSource = Join-Path $SourceDir "CLAUDE.md"
$claudeTarget = Join-Path $TargetDir "CLAUDE.md"

if (Test-Path $claudeSource) {
    if (Test-Path $claudeTarget) {
        Write-Host "CLAUDE.md 已存在，是否覆盖？" -ForegroundColor Yellow
        $confirm = Read-Host "覆盖？(y/N)"
        if ($confirm -ne "y" -and $confirm -ne "Y") {
            Write-Host "跳过CLAUDE.md" -ForegroundColor Gray
        } else {
            Copy-Item -Path $claudeSource -Destination $claudeTarget -Force
            Write-Host "✅ CLAUDE.md 已更新" -ForegroundColor Green
        }
    } else {
        Copy-Item -Path $claudeSource -Destination $claudeTarget -Force
        Write-Host "✅ CLAUDE.md 已创建" -ForegroundColor Green
    }
} else {
    Write-Host "❌ 源CLAUDE.md不存在: $claudeSource" -ForegroundColor Red
    exit 1
}

# ============================================================
# 2. 复制skills/目录到目标项目（如果需要项目级Skills）
# ============================================================
$skillsSource = Join-Path $SourceDir "skills"
$skillsTarget = Join-Path $TargetDir "skills"

if (Test-Path $skillsSource) {
    if (-not (Test-Path $skillsTarget)) {
        # 创建符号链接到全局skills（节省空间）
        New-Item -ItemType Junction -Path $skillsTarget -Target "$env:USERPROFILE\.trae-cn\skills" -Force | Out-Null
        Write-Host "✅ Skills符号链接已创建（指向全局安装）" -ForegroundColor Green
    } else {
        Write-Host "✅ Skills目录已存在" -ForegroundColor Green
    }
}

# ============================================================
# 3. 创建agents/目录（如果需要）
# ============================================================
$agentsSource = Join-Path $SourceDir "trae-agents"
$agentsTarget = Join-Path $TargetDir "agents"

if (Test-Path $agentsSource) {
    if (-not (Test-Path $agentsTarget)) {
        New-Item -ItemType Directory -Path $agentsTarget -Force | Out-Null
        # 复制关键agent文件
        Copy-Item -Path (Join-Path $agentsSource "boss-product-manager.md") -Destination $agentsTarget -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Agents目录已创建" -ForegroundColor Green
    }
}

# ============================================================
# 4. 创建初始化Git仓库（可选）
# ============================================================
if (-not (Test-Path (Join-Path $TargetDir ".git"))) {
    Write-Host ""
    $initGit = Read-Host "是否初始化Git仓库？(y/N)"
    if ($initGit -eq "y" -or $initGit -eq "Y") {
        git init
        git config user.name "woshiboss666"
        git config user.email "woshiboss666@gmail.com"
        Write-Host "✅ Git仓库已初始化" -ForegroundColor Green
    }
}

# ============================================================
# 5. 完成
# ============================================================
Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  ✅ Boss模式已激活！" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "现在可以在此项目中使用Boss模式了：" -ForegroundColor White
Write-Host ""
Write-Host "  输入 'Boss' 或 'boss模式' 或 '全自动开发'" -ForegroundColor Cyan
Write-Host ""
Write-Host "Boss模式将自动执行：" -ForegroundColor White
Write-Host "  1. 竞品分析 → 搜索3-5个竞品并生成对比矩阵" -ForegroundColor Gray
Write-Host "  2. 市场扫描 → 行业现状分析+趋势洞察" -ForegroundColor Gray
Write-Host "  3. 用户画像 → 目标用户特征+痛点挖掘" -ForegroundColor Gray
Write-Host "  4. 需求收集 → 6大维度30+确认项" -ForegroundColor Gray
Write-Host "  5. 技术风险预判 → 复杂度评估+风险识别" -ForegroundColor Gray
Write-Host ""
