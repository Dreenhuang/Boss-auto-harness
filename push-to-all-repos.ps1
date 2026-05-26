# Boss-auto-harness 一键推送脚本
# 用途：自动创建GitHub/Gitee仓库并推送代码
# 首次使用：修改下面的Token配置即可
# 以后只需运行此脚本即可一键推送

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# ============================================================
# 配置区（首次使用时填入你的Token）
# ============================================================
$GITHUB_TOKEN = ""  # GitHub Classic PAT（不是Fine-grained）
$GITEE_TOKEN = "95c89c0b21a16e02c48a0f7aa2ee81a2"  # Gitee Private Token
$REPO_NAME = "Boss-auto-harness"
$REPO_DESCRIPTION = "AI全自动开发模式 - 从想法到产品的端到端解决方案"
$IS_PRIVATE = $false  # true=私有仓库, false=公开仓库

# ============================================================
# 颜色输出函数
# ============================================================
function Write-Info { param($msg) Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-OK { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Warn { param($msg) Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err { param($msg) Write-Host "[ERROR] $msg" -ForegroundColor Red }

# ============================================================
# 获取项目根目录
# ============================================================
$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
cd $ProjectDir

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Boss-auto-harness 一键推送脚本" -ForegroundColor Cyan
Write-Host "  自动创建仓库 + 推送代码到 GitHub/Gitee" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================
# 1. Git初始化
# ============================================================
Write-Info "初始化Git仓库..."
if (-not (Test-Path ".git")) {
    git init
    git config user.name "woshiboss666"
    git config user.email "woshiboss666@gmail.com"
    Write-OK "Git仓库已初始化"
} else {
    Write-OK "Git仓库已存在"
}

Write-Info "添加文件并提交..."
git add .
$hasChanges = (git status --porcelain | Measure-Object).Count -gt 0
if ($hasChanges) {
    git commit -m "feat: Boss-auto-harness update | $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    Write-OK "代码已提交"
} else {
    Write-Info "没有新的代码变更"
}

git branch -M main

# ============================================================
# 2. 创建GitHub仓库并推送
# ============================================================
Write-Host ""
Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
Write-Host "  GitHub 推送" -ForegroundColor Cyan
Write-Host "--------------------------------------------------------" -ForegroundColor Cyan

if ($GITHUB_TOKEN -eq "") {
    Write-Warn "GitHub Token未配置，跳过GitHub推送"
    Write-Info "获取Token: https://github.com/settings/tokens/new （选Classic，勾选repo权限）"
} else {
    $headers = @{ 
        "Authorization" = "token $GITHUB_TOKEN"
        "Accept" = "application/vnd.github+json"
    }
    $body = @{
        name = $REPO_NAME
        description = $REPO_DESCRIPTION
        private = $IS_PRIVATE
        auto_init = $false
    } | ConvertTo-Json

    try {
        # 尝试创建仓库
        $result = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json" -ErrorAction Stop
        Start-Sleep -Seconds 3  # 等API创建完成
        Write-OK "GitHub仓库创建成功: $($result.html_url)"
    } catch {
        if ($_.Exception.Response.StatusCode -eq 422) {
            Write-Info "GitHub仓库已存在"
        } else {
            Write-Err "创建失败: $($_.Exception.Message)"
            Write-Warn "请检查Token权限（需要Classic PAT，不是Fine-grained）"
        }
    }

    # 推送到GitHub
    $githubUrl = "https://$GITHUB_TOKEN@github.com/woshiboss666/$REPO_NAME.git"
    $existingRemote = git remote get-url github 2>$null
    if ($existingRemote -ne $githubUrl) {
        git remote remove github 2>$null
        git remote add github $githubUrl
    }
    
    try {
        git push github main --force
        Write-OK "GitHub推送成功"
    } catch {
        Write-Err "GitHub推送失败: $_"
    }
}

# ============================================================
# 3. 创建Gitee仓库并推送
# ============================================================
Write-Host ""
Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
Write-Host "  Gitee 推送" -ForegroundColor Cyan
Write-Host "--------------------------------------------------------" -ForegroundColor Cyan

if ($GITEE_TOKEN -eq "") {
    Write-Warn "Gitee Token未配置，跳过Gitee推送"
} else {
    $body = @{
        access_token = $GITEE_TOKEN
        name = $REPO_NAME
        description = $REPO_DESCRIPTION
        auto_init = $false
        private = $IS_PRIVATE
    } | ConvertTo-Json -Compress

    try {
        $result = Invoke-RestMethod -Uri "https://gitee.com/api/v5/user/repos" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
        Start-Sleep -Seconds 2
        Write-OK "Gitee仓库创建成功: $($result.html_url)"
    } catch {
        Write-Info "Gitee仓库已存在或创建跳过"
    }

    # 推送到Gitee
    $giteeUrl = "https://oauth2:$GITEE_TOKEN@gitee.com/woshiboss666/$REPO_NAME.git"
    $existingRemote = git remote get-url origin 2>$null
    if ($existingRemote -ne $giteeUrl) {
        git remote remove origin 2>$null
        git remote add origin $giteeUrl
    }

    try {
        git push origin main --force
        Write-OK "Gitee推送成功"
    } catch {
        Write-Err "Gitee推送失败: $_"
    }
}

# ============================================================
# 4. 完成
# ============================================================
Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  推送完成！" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "仓库地址:" -ForegroundColor White
Write-Host "  GitHub: https://github.com/woshiboss666/$REPO_NAME" -ForegroundColor Gray
Write-Host "  Gitee:  https://gitee.com/woshiboss666/$REPO_NAME" -ForegroundColor Gray
Write-Host ""
Write-Host "下次更新只需重新运行此脚本即可。" -ForegroundColor Cyan
Write-Host ""
