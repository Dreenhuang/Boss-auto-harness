# 跨平台兼容方案 (Cross-Platform Compatibility Guide)

> **版本**: 2.0.0  
> **目标**: 让 Boss-auto-harness 在所有主流 AI 编程 IDE 中可用  
> **覆盖**: Trae / Cursor / Windsurf / VS Code+Copilot / Claude Code / 其他

---

## 一、平台生态概览

### 1.1 主流 AI 编程 IDE 对比

```yaml
ide_comparison:
  
  trae:
    full_name: "Trae IDE (字节跳动)"
    type: "专用AI IDE"
    agent_system: "原生支持 (.claude/agents/)"
    skill_system: "原生支持 (Skills/)"
    custom_rules: "CLAUDE.md"
    strengths:
      - 原生Agent编排
      - 完整的Skill系统
      - 中文优化
      - Sub-Agent隔离
    limitations:
      - 相对较新，生态较小
      - 主要面向中国市场
    compatibility_level: "🟢 原生支持 (100%)"
    
  cursor:
    full_name: "Cursor (Anysphere)"
    type: "VS Code Fork + AI"
    agent_system: ".cursor/rules/ 或 .cursorrules"
    custom_rules: ".cursorrules (类似CLAUDE.md)"
    strengths:
      - 庞大的用户群
      - 强大的代码补全
      - Tab补全功能
      - 活跃的插件生态
    limitations:
      - 无原生Sub-Agent概念
      - Skill系统需适配
      - 规则格式略有不同
    compatibility_level: "🟡 高度兼容 (90%)"
    
  windsurf:
    full_name: "Windsurf (Codeium)"
    type: "VS Code Fork + AI"
    agent_system: ".windsurf/rules/"
    custom_rules: ".windsurfrules"
    strengths:
      - Codeium模型强大
      - 良好的上下文理解
      - Cascade模式
    limitations:
      - 较新，文档较少
      - Agent概念较弱
    compatibility_level: "🟡 高度兼容 (85%)"
    
  vscode_copilot:
    full_name: "VS Code + GitHub Copilot"
    type: "传统IDE + AI插件"
    agent_system: "无 (仅Chat界面)"
    custom_rules: ".github/copilot-instructions.md"
    strengths:
      - 用户基数最大
      - GitHub集成
      - Copilot Workspace
    limitations:
      - 无原生规则文件
      - Agent能力有限
      - 需要手动配置
    compatibility_level: "🟠 中等兼容 (70%)"
    
  claude_code:
    full_name: "Claude Code (Anthropic CLI)"
    type: "命令行AI工具"
    agent_system: "CLAUDE.md (原生支持!)"
    custom_rules: "CLAUDE.md"
    strengths:
      - 原生CLAUDE.md支持
      - 强大的CLI能力
      - 与Claude API深度整合
    limitations:
      - 无GUI
      - 需要命令行操作
      - 无内置IDE功能
    compatibility_level: "🟢 高度兼容 (95%)"
    
  other_tools:
    list:
      - name: "Continue.dev"
        compat: "🟡 80%"
        notes: "支持自定义指令"
        
      - name: "Aider"
        compat: "🟠 65%"
        notes: "命令行工具，可配置"
        
      - name: "Devin/Cognition"
        compat: "🔴 40%"
        notes: "云端IDE，难以本地配置"
        
      - name: "Replit Agent"
        compat: "🟡 75%"
        notes: "支持.replit配置"
```

---

## 二、兼容性架构设计

### 2.1 核心抽象层

```
┌─────────────────────────────────────────────────────┐
│                  Boss-auto-harness Core              │
│            (平台无关的核心逻辑和规则)                   │
├─────────────────────────────────────────────────────┤
│                  适配层 (Adapters)                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ Trae    │ │ Cursor  │ │Windsurf │ │ Claude  │   │
│  │ Adapter │ │ Adapter │ │ Adapter │ │ Adapter │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
│  ┌─────────┐ ┌─────────┐                              │
│  │VS Code  │ │ Other   │                              │
│  │ Adapter │ │Adapter  │                              │
│  └─────────┘ └─────────┘                              │
├─────────────────────────────────────────────────────┤
│               平台特定层 (Platform)                    │
│         各IDE的原生API、规则系统、UI组件              │
└─────────────────────────────────────────────────────┘
```

### 2.2 文件结构适配

```yaml
file_mapping:
  
  # 核心规则文件
  core_files:
    source: "CLAUDE.md"
    targets:
      trae: ".claude/CLAUDE.md"           # 原生支持
      cursor: ".cursor/rules/boss-mode.md" # 需转换
      windsurf: ".windsurf/rules/boss-mode.md"
      vscode: ".vscode/instructions.md"
      claude_code: "CLAUDE.md"             # 原生支持!
      
  # Agent定义
  agent_files:
    source_dir: "agents/"
    targets:
      trae: ".claude/agents/"              # 原生支持
      cursor: ".cursor/agents/"            # 需模拟
      others: ".boss/agents/"             # 通用位置
      
  # Skill定义
  skill_files:
    source_dir: "skills/"
    targets:
      trae: "Skills/"                      # 原生支持
      cursor: ".cursor/skills/"            # 需适配
      others: ".boss/skills/"             # 通用位置
      
  # 配置文件
  config_files:
    rules: "rules/"
    docs: "docs/"
    memory: "memory/"
```

---

## 三、各平台详细适配方案

### 3.1 Trae IDE（原生平台）

```yaml
trae_adapter:
  
  status: "✅ 完全原生支持"
  
  installation:
    method: "复制到项目根目录"
    steps:
      - "复制 CLAUDE.md 到项目根目录"
      - "复制 .claude/ 目录到项目根目录"
      - "复制 Skills/ 目录到项目根目录"
      - "(可选) 复制 rules/, docs/, memory/"
      
  features_supported:
    agents: "✅ 原生Sub-Agent"
    skills: "✅ 原生Skill调用"
    custom_commands: "✅ 支持"
    hooks: "✅ 支持"
    multi_file_context: "✅ 支持"
    browser_tools: "✅ 支持"
    
  configuration:
    # 在 settings.json 中添加
    boss_mode_activation:
      trigger_keywords:
        - "boss"
        - "Boss模式"
        - "全自动开发"
        - "Boss-harness"
        
  tips:
    - "这是最佳体验平台，所有功能开箱即用"
    - "建议使用最新版本以获得完整支持"
```

### 3.2 Cursor IDE

```yaml
cursor_adapter:
  
  status: "🟡 高度兼容 (90%)"
  
  installation:
    method: "转换并复制"
    steps:
      - "运行转换脚本: npm run adapt:cursor"
      - "或手动: 复制 .cursor/ 目录内容"
      
  file_conversions:
    
    # CLAUDE.md → .cursorrules
    main_rules:
      source: "CLAUDE.md"
      target: ".cursorrules"
      conversion_rules:
        - "移除 Trae 特有的语法"
        - "调整触发关键词格式"
        - "简化Agent相关描述（Cursor无原生Agent）"
        - "保留核心Boss Mode逻辑"
        
    sample_cursorrules: |
      # Boss-auto-harness for Cursor
      # Converted from CLAUDE.md
      
      ## 你是谁
      你是Boss-harness，一位资深产品经理兼全栈开发搭档。
      你负责引导用户完成产品开发的完整旅程。
      
      ## Boss模式触发
      当用户说以下任一关键词时，激活Boss模式：
      - "boss" / "Boss模式" / "全自动开发" / "Boss-harness"
      
      ## Boss模式规则
      ### 第一阶段：需求收集
      - 必须与用户充分沟通，问清所有不确定的问题
      - 进行市场调研和竞品分析
      - 生成完整的PRD并请求确认
      
      ### 第二阶段：自主开发
      - PRD确认后进入自主开发模式
      - 基于已确认的需求推进开发
      - 仅在关键异常时中断用户
      
      [... 其他核心规则 ...]
      
  features_mapping:
    agents: "⚠️ 用Rules模拟（无法真正隔离）"
    skills: "⚠️ 用Instructions模拟"
    custom_commands: "✅ 支持"
    hooks: "❌ 不支持"
    tab_completion: "✅ 可利用"
    
  workarounds:
    agent_simulation: |
      # Cursor没有原生Agent，用规则模拟：
      
      ## Code Reviewer 模式
      当被要求code review时：
      1. 切换到严格审查角色
      2. 使用五大维度检查清单
      3. 输出结构化评审报告
      
      ## Implementer 模式
      当被要求实现功能时：
      1. 先阅读PRD和Plan
      2. 遵循编码规范
      3. 执行自检清单
      
  limitations:
    - "无法真正的Sub-Agent隔离"
    - "Skill调用机制不同"
    - "部分高级Hook不支持"
    - "但核心Boss Mode流程完全可用！"
    
  recommended_usage:
    - "使用Composer模式进行长任务"
    - "利用Tab补全加速编码"
    - "使用Cmd+K进行快速修改"
    - "配合.rules/目录中的详细规则"
```

### 3.3 Windsurf IDE

```yaml
windsurf_adapter:
  
  status: "🟡 高度兼容 (85%)"
  
  installation:
    method: "转换并复制"
    steps:
      - "运行转换脚本: npm run adapt:windsurf"
      - "或手动复制 .windsurf/ 目录"
      
  file_conversions:
    
    main_rules:
      source: "CLAUDE.md"
      target: ".windsurfrules"
      
  unique_features_to_leverage:
    cascade_mode: |
      # Windsurf的Cascade模式非常适合Boss Mode！
      
      ## 利用Cascade实现多步骤开发
      
      Step 1 (需求):
      > 我要做一个[项目描述]
      > 请帮我分析需求，询问关键问题
      
      Step 2 (确认):
      > 以上需求确认，请开始规划开发计划
      
      Step 3 (开发):
      > 按照计划开始实现第一个功能
      
      Step 4 (审查):
      > 请审查刚才实现的代码
      
  features_mapping:
    agents: "⚠️ 用Cascade模拟"
    skills: "⚠️ 用Rules模拟"
    cascade_mode: "✅ 核心优势！"
    context_awareness: "✅ 强大"
    
  tips:
    - "充分利用Cascade模式的连续对话能力"
    - "Windsurf的上下文理解很好，适合复杂任务"
```

### 3.4 VS Code + GitHub Copilot

```yaml
vscode_copilot_adapter:
  
  status: "🟠 中等兼容 (70%)"
  
  installation:
    method: "手动配置"
    steps:
      - "安装Copilot扩展"
      - "创建 .github/copilot-instructions.md"
      - "添加Workspace Instructions"
      
  configuration:
    
    copilot_instructions_md: |
      # Boss-auto-harness Instructions for Copilot
      
      ## 角色定义
      你是Boss-harness，产品经理兼全栈开发搭档。
      
      ## Boss模式
      触发词: "boss", "Boss模式", "全自动开发"
      
      ## 核心工作流
      1. 需求收集 → 充分沟通
      2. PRD确认 → 用户明确同意
      3. 自主开发 → 基于确认的需求
      4. 质量保证 → 自检+验证
      
      ## 编码规范
      [从rules/导入]
      
      [... 简化版规则 ...]
      
    workspace_settings:
      # .vscode/settings.json
      {
        "github.copilot.enable": {
          "*": true,
          "yaml": true,
          "markdown": true
        },
        "github.copilot.editor.enableAutoCompletions": true,
        "github.copilot.inlineSuggest.enable": true
      }
      
  features_mapping:
    chat_interface: "✅ 主要交互方式"
    inline_completion: "✅ 代码补全"
    copilot_workspace: "🆕 新功能，适合完整任务"
    agents: "❌ 不支持"
    custom_commands: "⚠️ 有限支持"
    
  usage_recommendations:
    primary: "使用Copilot Chat进行Boss模式对话"
    secondary: "使用Copilot Workspace处理完整项目"
    tips:
      - "在Chat中明确说明'Boss模式'"
      - "提供足够的上下文信息"
      - "分步骤执行复杂任务"
      - "使用@提及文件来提供上下文"
      
  limitations:
    - "无原生规则文件强制力"
    - "需要更多手动指导"
    - "Agent能力有限"
    - "但Chat功能足够支撑Boss Mode核心流程"
```

### 3.5 Claude Code (CLI)

```yaml
claude_code_adapter:
  
  status: "🟢 高度兼容 (95%)"
  
  installation:
    method: "几乎原生！"
    steps:
      - "安装Claude Code: npm install -g @anthropic-ai/claude-code"
      - "复制 CLAUDE.md 到项目目录"
      - "复制 .claude/ 目录（如果使用）"
      - "运行: claude"
      
  why_compatible: |
    Claude Code 原生支持 CLAUDE.md！
    这是除Trae外兼容性最好的平台。
    
  configuration:
    claude_md: |
      # 直接使用原始 CLAUDE.md 内容
      # 几乎无需修改！
      
    settings: |
      # ~/.claude/settings.json
      {
        "permissions": {
          "allow": ["Bash(*)", "Read(*)", "Write(*)", "Edit(*)"],
          "deny": []
        }
      }
      
  features_mapping:
    claude_md_support: "✅ 原生支持"
    tool_use: "✅ 支持Bash/Read/Write/Edit"
    agents: "⚠️ 可用MCP模拟"
    memory: "✅ 支持--memory模式"
    long_context: "✅ 200K上下文窗口"
    
  workflow_example: |
    $ claude
    > 进入Boss模式，我要做一个电商网站
    
    Claude: 好的！让我先了解你的需求...
    [第一阶段：需求收集开始]
    
    > 确认PRD
    
    Claude: ✅ PRD已确认！现在进入自主开发模式...
    [第二阶段：自主开发开始]
    
  advantages:
    - "原生CLAUDE.md支持"
    - "强大的工具使用能力"
    - "长上下文窗口"
    - "适合自动化脚本"
    
  disadvantages:
    - "无GUI界面"
    - "需要命令行操作"
    - "无实时预览"
```

---

## 四、通用安装工具

### 4.1 自动适配脚本

```bash
#!/bin/bash
# install-boss.sh - 跨平台安装脚本

#!/bin/bash

echo "🚀 Boss-auto-harness 跨平台安装器"
echo "================================"

# 检测当前环境
detect_environment() {
    if [ -f ".trae/config.json" ] || [ -f "CLAUDE.md" ]; then
        echo "trae"
    elif [ -f ".cursor/rules/" ]; then
        echo "cursor"
    elif [ -f ".windsurf/" ]; then
        echo "windsurf"
    elif [ -f ".vscode/" ]; then
        echo "vscode"
    elif command -v claude &> /dev/null; then
        echo "claude_code"
    else
        echo "unknown"
    fi
}

ENV=$(detect_environment)
echo "检测到环境: $ENV"

# 复制核心文件
copy_core_files() {
    echo "📁 复制核心文件..."
    cp CLAUDE.md ./ 2>/dev/null || true
    cp -r rules/ ./ 2>/dev/null || true
    cp -r docs/ ./ 2>/dev/null || true
    cp -r memory/ ./ 2>/dev/null || true
}

# 平台特定安装
case $ENV in
    trae)
        echo "✅ Trae 环境 - 原生安装"
        cp -r .claude/ ./ 2>/dev/null || true
        cp -r Skills/ ./ 2>/dev/null || true
        copy_core_files
        echo "🎉 安装完成！在Trae中输入 'boss' 启动Boss模式"
        ;;
        
    cursor)
        echo "🔄 Cursor 环境 - 转换安装"
        mkdir -p .cursor/rules
        mkdir -p .cursor/agents
        # 转换CLAUDE.md为.cursorrules
        python3 scripts/convert-for-cursor.py CLAUDE.md > .cursorrules
        copy_core_files
        echo "🎉 安装完成！在Cursor中输入 'boss' 启动Boss模式"
        echo "⚠️  注意: 部分高级功能可能受限"
        ;;
        
    windsurf)
        echo "🔄 Windsurf 环境 - 转换安装"
        mkdir -p .windsurf/rules
        python3 scripts/convert-for-windsurf.py CLAUDE.md > .windsurfrules
        copy_core_files
        echo "🎉 安装完成！在Windsurf中输入 'boss' 启动Boss模式"
        ;;
        
    vscode)
        echo "🔄 VS Code 环境 - 基础安装"
        mkdir -p .github
        python3 scripts/convert-for-copilot.py CLAUDE.md > .github/copilot-instructions.md
        copy_core_files
        echo "🎉 安装完成！在Copilot Chat中输入 'boss' 启动Boss模式"
        echo "⚠️  注意: VS Code兼容性有限，建议使用Trae或Cursor获得最佳体验"
        ;;
        
    claude_code)
        echo "✅ Claude Code 环境 - 原生安装"
        copy_core_files
        echo "🎉 安装完成！运行 'claude' 后输入 'boss' 启动Boss模式"
        ;;
        
    unknown)
        echo "⚠️  未识别的环境，执行通用安装..."
        mkdir -p .boss
        cp -r CLAUDE.md .boss/
        cp -r rules/ .boss/ 2>/dev/null || true
        cp -r agents/ .boss/ 2>/dev/null || true
        cp -r skills/ .boss/ 2>/dev/null || true
        copy_core_files
        echo "🎉 通用安装完成！请查看 .boss/ 目录"
        echo "💡 提示: 推荐使用 Trae IDE 获得完整功能支持"
        ;;
esac

echo ""
echo "📖 使用说明:"
echo "  - 启动Boss模式: 输入 'boss' 或 'Boss模式'"
echo "  - 查看教程: docs/使用教程.md"
echo "  - 问题反馈: GitHub Issues"
echo ""
echo "感谢使用 Boss-auto-harness! 🚀"
```

### 4.2 PowerShell 版本（Windows）

```powershell
# install-boss.ps1 - Windows跨平台安装脚本

param(
    [ValidateSet("auto", "trae", "cursor", "windsurf", "vscode", "claude")]
    $Target = "auto"
)

Write-Host "🚀 Boss-auto-harness 跨平台安装器 (Windows)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

function Detect-Environment {
    if (Test-Path ".trae") { return "trae" }
    if (Test-Path ".cursor") { return "cursor" }
    if (Test-Path ".windsurf") { return "windsurf" }
    if (Test-Path ".vscode") { return "vscode" }
    if (Get-Command claude -ErrorAction SilentlyContinue) { return "claude" }
    return "unknown"
}

if ($Target -eq "auto") {
    $env = Detect-Environment
} else {
    $env = $Target
}

Write-Host "检测到环境: $env" -ForegroundColor Yellow

# 复制核心文件
Copy-CoreFiles {
    Write-Host "📁 复制核心文件..." -ForegroundColor Green
    Copy-Item -Path "CLAUDE.md" -Destination "." -Force -ErrorAction SilentlyContinue
    if (Test-Path "rules") { Copy-Item -Path "rules" -Destination "." -Recurse -Force }
    if (Test-Path "docs") { Copy-Item -Path "docs" -Destination "." -Recurse -Force }
}

switch ($env) {
    "trae" {
        Write-Host "✅ Trae 环境 - 原生安装" -ForegroundColor Green
        if (Test-Path ".claude") { Copy-Item -Path ".claude" -Destination "." -Recurse -Force }
        if (Test-Path "Skills") { Copy-Item -Path "Skills" -Destination "." -Recurse -Force }
        Copy-CoreFiles
        Write-Host "`n🎉 安装完成！" -ForegroundColor Cyan
        Write-Host "在Trae中输入 'boss' 启动Boss模式" -ForegroundColor White
    }
    
    "cursor" {
        Write-Host "🔄 Cursor 环境 - 转换安装" -ForegroundColor Yellow
        New-Item -ItemType Directory -Force -Path ".cursor\rules" | Out-Null
        # 转换逻辑...
        Copy-CoreFiles
        Write-Host "`n🎉 安装完成！" -ForegroundColor Cyan
        Write-Host "⚠️  部分高级功能可能受限" -ForegroundColor Yellow
    }
    
    default {
        Write-Host "⚠️  通用安装模式" -ForegroundColor Yellow
        New-Item -ItemType Directory -Force -Path ".boss" | Out-Null
        Copy-CoreFiles
        Write-Host "`n🎉 安装完成！请查看 .boss/ 目录" -ForegroundColor Cyan
    }
}
```

---

## 五、功能兼容性矩阵

### 5.1 完整功能对比表

| 功能模块 | Trae | Cursor | Windsurf | VS Code | Claude Code | 其他 |
|---------|:----:|:------:|:--------:|:-------:|:-----------:|:----:|
| **Boss模式核心** | | | | | | |
| 需求收集流程 | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ |
| PRD生成 | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ |
| 自主开发 | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| 质量门禁 | ✅ | ⚠️ | ⚠️ | ❌ | ⚠️ | ❌ |
| **Agent系统** | | | | | | |
| Implementer | ✅ | ⚠️ | ⚠️ | ❌ | ⚠️ | ❌ |
| Code Reviewer | ✅ | ⚠️ | ⚠️ | ❌ | ⚠️ | ❌ |
| Feedback Observer | ✅ | ❌ | ❌ | ❌ | ⚠️ | ❌ |
| Evolution Runner | ✅ | ❌ | ❌ | ❌ | ⚠️ | ❌ |
| **Skill系统** | | | | | | |
| Product Spec Builder | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ |
| Dev Planner | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ |
| Dev Builder | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ |
| Quality Gate | ✅ | ⚠️ | ⚠️ | ❌ | ⚠️ | ❌ |
| Test Runner | ✅ | ⚠️ | ⚠️ | ❌ | ⚠️ | ❌ |
| Code Review | ✅ | ⚠️ | ⚠️ | ❌ | ⚠️ | ❌ |
| Image Generator | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ |
| Deploy Engine | ✅ | ⚠️ | ⚠️ | ❌ | ⚠️ | ❌ |
| **高级功能** | | | | | | |
| Pipeline Engine | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Garbage Collector | ✅ | ⚠️ | ⚠️ | ❌ | ⚠️ | ❌ |
| Context Initializer | ✅ | ⚠️ | ⚠️ | ❌ | ⚠️ | ❌ |
| Loop Detection | ✅ | ⚠️ | ⚠️ | ❌ | ⚠️ | ❌ |
| **基础设施** | | | | | | |
| CLAUDE.md规则 | ✅ | ⚠️* | ⚠️* | ⚠️** | ✅ | ⚠️ |
| 自定义命令 | ✅ | ✅ | ✅ | ❌ | ✅ | ⚠️ |
| Hooks | ✅ | ❌ | ❌ | ❌ | ⚠️ | ❌ |
| 多文件上下文 | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ |
| 浏览器工具 | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

**图例**: 
- ✅ = 完全支持
- ⚠️ = 部分支持/需适配
- ❌ = 不支持
- \* = 使用.cursorrules替代
- \*\* = 使用copilot-instructions.md替代

---

## 六、迁移指南

### 6.1 从其他平台迁移到Trae

```yaml
migration_to_trae:
  
  from_cursor:
    steps:
      - "备份 .cursorrules 为 .cursorrules.bak"
      - "运行: npm run migrate:cursor-to-trae"
      - "验证: 检查CLAUDE.md是否正确生成"
      - "测试: 在Trae中触发Boss模式"
    benefits_gained:
      - "原生Agent支持"
      - "完整Skill系统"
      - "更强大的编排能力"
      - "更好的中文支持"
      
  from_vscode:
    steps:
      - "导出Copilot Instructions"
      - "转换为CLAUDE.md格式"
      - "补充缺失的高级规则"
      - "安装Trae并导入"
    benefits_gained:
      - "全部功能解锁"
      - "自动化程度大幅提升"
      - "真正的多Agent协作"
```

### 6.2 最佳平台推荐

```yaml
recommendations:
  
  for_full_experience:
    platform: "Trae IDE"
    reason: "唯一完全原生支持所有功能的平台"
    use_case: "生产环境、重要项目、团队协作"
    
  for_individual_developer:
    platform: "Cursor 或 Windsurf"
    reason: "良好的平衡，有活跃社区"
    use_case: "个人项目、快速原型、学习探索"
    
  for_cli_lovers:
    platform: "Claude Code"
    reason: "强大的CLI能力，原生CLAUDE.md支持"
    use_case: "自动化脚本、服务器操作、CI/CD集成"
    
  for_enterprise:
    platform: "VS Code + Copilot"
    reason: "企业标准化、GitHub集成"
    use_case: "大型团队、合规要求、现有工具链"
```

---

## 七、已知限制与解决方案

### 7.1 平台限制及Workaround

```yaml
limitations_and_workarounds:
  
  no_native_agents:
    platforms: ["Cursor", "Windsurf", "VS Code"]
    limitation: "无法实现真正的Sub-Agent隔离"
    workaround: |
      使用规则切换模拟Agent角色：
      "你现在扮演Code Reviewer角色，请按照以下标准审查..."
      "切换回Implementer模式，根据审查意见修复..."
      
  no_skill_system:
    platforms: ["Cursor", "Windsurf", "VS Code"]
    limitation: "无法直接调用Skill"
    workaround: |
      将Skill内容内联到规则文件中：
      ## Product Spec Builder 流程
      [将SKILL.md的核心内容嵌入]
      
  no_hooks:
    platforms: ["非Trae"]
    limitation: "无法自动触发事件"
    workaround: |
      手动触发或在规则中提醒：
      "注意：每次Task完成后应手动运行质量检查"
      
  limited_context:
    platforms: ["VS Code Copilot"]
    limitation: "上下文窗口较小"
    workaround: |
      - 分解为更小的任务
      - 使用@提及聚焦关键文件
      - 提供精简版的规则
```

### 7.2 功能降级策略

```yaml
graceful_degradation:
  
  tier1_full_features:
    required: "Trae IDE with complete setup"
    experience: "100% 功能"
    
  tier2_core_boss_mode:
    available_on: "Cursor, Windsurf, Claude Code"
    missing: "Pipeline Engine, Advanced Hooks, Multi-Agent"
    experience: "80% 功能 (核心Boss Mode完整)"
    recommendation: "足够用于大多数项目"
    
  tier3_basic_workflow:
    available_on: "VS Code + Copilot, Continue.dev"
    missing: "Agents, Skills, Automation"
    experience: "60% 功能 (需更多手动操作)"
    recommendation: "可用于简单项目或学习"
    
  tier4_manual_assist:
    available_on: "Any IDE with AI plugin"
    missing: "Most automation"
    experience: "40% 功能 (作为参考指南)"
    recommendation: "可作为最佳实践参考"
```

---

## 八、未来路线图

### 8.0 短期计划（1-2月）

```yaml
short_term_roadmap:
  
  v2.1:
    - "完善Cursor适配器的自动转换脚本"
    - "创建Windsurf Cascade模板库"
    - "编写VS Code Copilot Workspace配置"
    - "增加更多平台的测试覆盖"
    
  v2.2:
    - "开发通用适配层SDK"
    - "支持用户自定义平台适配"
    - "创建平台特性检测工具"
    - "建立兼容性测试套件"
```

### 8.1 中期计划（3-6月）

```yaml
mid_term_roadmap:
  
  v3.0:
    - "实现MCP协议支持（Model Context Protocol）"
    - "开发Web版配置界面"
    - "支持更多新兴AI IDE"
    - "建立社区贡献的平台适配器库"
    
  cloud_sync:
    - "云端同步配置"
    - "跨设备使用记录"
    - "团队共享规则库"
```

---

## 九、快速开始卡片

### 9.1 按平台快速安装

```markdown
## 🚀 快速安装指南

### Trae 用户（推荐）
```bash
# 1. 下载项目
git clone https://github.com/your-repo/boss-auto-harness.git

# 2. 进入项目目录
cd boss-auto-harness

# 3. 运行安装
./install/install.sh

# 4. 完成！在Trae中输入 'boss'
```

### Cursor 用户
```bash
# 1. 下载项目
git clone https://github.com/your-repo/boss-auto-harness.git

# 2. 运行Cursor适配安装
npm run install:cursor

# 3. 重启Cursor，输入 'boss'
```

### VS Code + Copilot 用户
```bash
# 1. 下载项目
git clone https://github.com/your-repo/boss-auto-harness.git

# 2. 复制指令文件
cp .github/copilot-instructions.md your-project/

# 3. 在Copilot Chat中输入 'boss'
```

### Claude Code 用户
```bash
# 1. 全局安装
npm install -g boss-auto-harness

# 2. 在任何项目中
cd your-project
boss-init

# 3. 运行Claude Code
claude
# 输入 'boss'
```
```

---

*文档版本: 2.0.0 | 最后更新: 2026-04-30 | 维备者: Boss-auto-harness Team*
