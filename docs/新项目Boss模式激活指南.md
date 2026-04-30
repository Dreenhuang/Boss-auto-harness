# 新项目Boss模式激活指南

## 问题原因

在其他项目输入"Boss"没有触发询问和调研，是因为：

1. **CLAUDE.md 是项目级配置**，只在当前项目生效
2. 其他项目没有CLAUDE.md，AI不知道"Boss"触发词的含义
3. Skills虽然全局安装了，但没有触发逻辑就不会自动调用

## 解决方案（3选1）

### 方案1：在每个新项目激活（推荐）

在新项目目录运行：

```powershell
cd "你的新项目路径"
powershell -ExecutionPolicy Bypass -File "k:\chanbpin4.0\120.产品经理技能包 4.0\activate-in-project.ps1"
```

这会自动复制CLAUDE.md到新项目，Boss模式立即生效。

### 方案2：手动复制CLAUDE.md

```powershell
# 在新项目目录执行
Copy-Item "k:\chanbpin4.0\120.产品经理技能包 4.0\CLAUDE.md" .
```

然后重启TRAE IDE。

### 方案3：在每个项目创建.claude目录

```powershell
# 在新项目目录执行
New-Item -ItemType Directory -Force -Path ".claude"
Copy-Item "k:\chanbpin4.0\120.产品经理技能包 4.0\CLAUDE.md" ".claude\CLAUDE.md"
```

## 快速命令（推荐保存到快捷方式）

创建桌面快捷方式或PowerShell别名：

```powershell
# 添加到PowerShell Profile
notepad $PROFILE

# 添加这行
function Activate-Boss { 
    $target = (Get-Location).Path
    Copy-Item "k:\chanbpin4.0\120.产品经理技能包 4.0\CLAUDE.md" "$target\CLAUDE.md" -Force
    Write-Host "✅ Boss模式已激活！重启TRAE生效。" -ForegroundColor Green
}
Set-Alias boss-on Activate-Boss
```

以后在任何项目只需运行：
```powershell
boss-on
```

## 验证是否生效

1. 重启TRAE IDE
2. 打开任意项目
3. 输入 `Boss` 或 `boss模式`
4. 如果看到Boss-harness的初始化消息（"我是Boss-harness，你的产品经理..."）说明激活成功
5. 如果AI开始问需求问题（"你的产品解决什么问题？"）说明完全正常

## 为什么不能全局自动触发？

TRAE的架构限制：
- CLAUDE.md 是**项目级别**的配置
- 没有**用户级别**的全局CLAUDE.md
- Skills可以全局安装，但触发逻辑需要CLAUDE.md定义

所以需要在每个项目"激活"一次（复制CLAUDE.md）。激活后该项目永久支持Boss模式。
