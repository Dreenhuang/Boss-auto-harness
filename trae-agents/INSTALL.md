# Boss-harness产品经理 AGENT 包 - 安装指南

> **版本**: 1.0.0  
> **适用平台**: Trae IDE  
> **更新时间**: 2026-04-29

---

## 📦 概述

本安装包包含 **11 个 AGENT**，将Boss-harness产品经理技能包 4.0 的完整工作流程转换为 Trae IDE 可用的 AGENT 格式。

### 包含内容

- ✅ 11 个 AGENT 定义文件（AGENT.md 格式）
- ✅ 完整的索引文档（README.md）
- ✅ 覆盖产品开发完整生命周期

---

## 🎯 11 个 AGENT 概览

| # | AGENT | 颜色 | 功能 |
|---|-------|------|------|
| 1 | product-manager-demand | 🔵 #3b82f6 | 需求收集与规范生成 |
| 2 | design-brief-builder | 🟣 #8b5cf6 | 设计规范确定 |
| 3 | design-maker | 🔵 #06b6d4 | 设计稿生成 |
| 4 | dev-planner | 🟢 #10b981 | 开发计划生成 |
| 5 | dev-builder | 🟠 #f59e0b | 项目开发执行 |
| 6 | code-reviewer | 🔴 #ef4444 | 代码质量审查 |
| 7 | bug-fixer | 🟠 #f97316 | Bug 修复 |
| 8 | release-builder | 🟢 #22c55e | 构建发布 |
| 9 | feedback-writer | 🟣 #a855f7 | 反馈记录 |
| 10 | evolution-engine | 🩷 #ec4899 | 进化引擎 |
| 11 | skill-builder | 🩵 #14b8a6 | 技能创建 |

---

## 🔧 安装方式

### 方式一：复制到项目（推荐）

#### Windows PowerShell

```powershell
# 1. 打开 PowerShell（管理员模式）

# 2. 复制 AGENTS 目录到你的项目
Copy-Item -Path "K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents" -Destination "D:\你的项目路径\agents" -Recurse

# 3. 验证复制成功
Get-ChildItem "D:\你的项目路径\agents"
```

#### Windows CMD

```cmd
# 1. 打开 CMD（管理员模式）

# 2. 复制 AGENTS 目录到你的项目
xcopy "K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents" "D:\你的项目路径\agents\" /E /I /H

# 3. 验证复制成功
dir "D:\你的项目路径\agents"
```

#### Git Bash

```bash
# 1. 打开 Git Bash

# 2. 复制 AGENTS 目录到你的项目
cp -r "/k/chanbpin4.0/120.产品经理技能包 4.0/trae-agents" "/d/你的项目路径/agents/"

# 3. 验证复制成功
ls -la "/d/你的项目路径/agents/"
```

### 方式二：符号链接（高级用户）

#### Windows PowerShell（管理员模式）

```powershell
# 创建符号链接（需要管理员权限）
New-Item -ItemType SymbolicLink -Path "D:\你的项目路径\agents" -Target "K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents"
```

#### Git Bash（管理员模式）

```bash
# 创建符号链接（需要管理员权限）
ln -s "/k/chanbpin4.0/120.产品经理技能包 4.0/trae-agents" "/d/你的项目路径/agents"
```

### 方式三：Git Submodule（团队协作）

```bash
# 1. 在项目根目录添加 submodule
git submodule add https://github.com/你的用户名/Boss-harness产品经理技能包.git trae-agents

# 2. 初始化 submodule
git submodule update --init --recursive

# 3. 更新 submodule
git submodule update --remote
```

---

## 📂 安装后目录结构

安装后，你的项目应该有以下结构：

```
你的项目/
├── agents/                           # AGENT 定义目录
│   ├── README.md                     # 索引文档
│   ├── product-manager-demand.md     # 需求收集
│   ├── design-brief-builder.md       # 设计规范
│   ├── design-maker.md               # 设计稿
│   ├── dev-planner.md                # 开发计划
│   ├── dev-builder.md                # 开发执行
│   ├── code-reviewer.md              # 代码审查
│   ├── bug-fixer.md                  # Bug 修复
│   ├── release-builder.md            # 发布
│   ├── feedback-writer.md            # 反馈记录
│   ├── evolution-engine.md           # 进化引擎
│   └── skill-builder.md              # 技能创建
├── src/                              # 项目代码
├── Product-Spec.md                   # 产品需求文档
├── DEV-PLAN.md                       # 开发计划
└── ...
```

---

## 🎨 在 Trae IDE 中使用

### 使用方法 1：对话中引用

在 Trae 对话中直接引用 AGENT 文件：

```
请以 product-manager-demand.md 中定义的角色开始，帮我收集产品需求。
```

### 使用方法 2：复制内容到对话

将 AGENT.md 文件的内容复制粘贴到 Trae 对话中作为系统提示。

### 使用方法 3：作为参考文档

在开发过程中，将相关 AGENT.md 作为参考文档打开，遵循其中的工作流程和原则。

---

## ✅ 验证安装

### 检查文件完整性

```powershell
# Windows PowerShell
Get-ChildItem "D:\你的项目路径\agents" -Filter "*.md" | Measure-Object
```

应该显示 **12 个 .md 文件**（11 个 AGENT + 1 个 README）。

### 检查文件大小

```powershell
# Windows PowerShell
Get-ChildItem "D:\你的项目路径\agents\*.md" | Select-Object Name, Length
```

每个文件应该有合理的大小（不是 0 字节）。

---

## 🚀 快速开始

### 1. 需求收集

```
使用 product-manager-demand.md 开始收集产品需求
```

### 2. 设计规范

```
使用 design-brief-builder.md 确定视觉方向
使用 design-maker.md 生成设计稿
```

### 3. 开发计划

```
使用 dev-planner.md 生成开发计划
```

### 4. 开发执行

```
使用 dev-builder.md 按 Phase 开发
使用 code-reviewer.md 审查代码
使用 bug-fixer.md 修复问题
```

### 5. 发布

```
使用 release-builder.md 构建和发布
```

### 6. 持续改进

```
使用 feedback-writer.md 记录反馈
使用 evolution-engine.md 分析进化建议
使用 skill-builder.md 创建新技能
```

---

## ⚙️ 配置（可选）

### 设置 Trae AGENT 路径

如果 Trae 支持自定义 AGENT 路径，在 Trae 设置中指定：

```
D:\你的项目路径\agents
```

### 环境变量（可选）

```powershell
# Windows PowerShell - 设置环境变量
$env:boss_AGENTS_PATH = "D:\你的项目路径\agents"
```

---

## 🔍 故障排除

### 问题 1：复制后文件不存在

**解决方法**：
```powershell
# 检查源文件是否存在
Test-Path "K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents"

# 使用绝对路径重新复制
Copy-Item -Path "\\?\K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents" -Destination "D:\你的项目路径\agents" -Recurse
```

### 问题 2：权限不足

**解决方法**：
1. 以管理员身份打开 PowerShell/CMD
2. 或者先复制到用户目录，再移动到目标位置

### 问题 3：文件损坏

**解决方法**：
```powershell
# 验证文件 MD5
Get-FileHash "D:\你的项目路径\agents\README.md" -Algorithm MD5

# 对比源文件 MD5
Get-FileHash "K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents\README.md" -Algorithm MD5

# 如果不一致，重新复制
Remove-Item "D:\你的项目路径\agents" -Recurse -Force
Copy-Item -Path "K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents" -Destination "D:\你的项目路径\agents" -Recurse
```

---

## 📚 相关资源

- **原始技能包**：`K:\chanbpin4.0\120.产品经理技能包 4.0\`
- **AGENT 索引**：`trae-agents\README.md`
- **完整文档**：请参考 `trae-agents\` 目录下的各个 AGENT 文件

---

## 🆘 获取帮助

如果遇到问题：

1. 检查本安装指南的故障排除部分
2. 查看 [README.md](trae-agents\README.md) 中的索引
3. 查看各个 AGENT 文件中的详细说明

---

## 📄 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0.0 | 2026-04-29 | 初始版本，包含 11 个 AGENT |

---

## 📜 许可证

本安装包继承自Boss-harness产品经理技能包 4.0 的许可证。

---

*安装指南由Boss-harness产品经理技能包 4.0 自动生成*  
*版本：1.0.0*  
*更新时间：2026-04-29*
