# Boss-auto-harness 安装指南 (INSTALL)

> **版本**: v2.1 | **更新日期**: 2026-04-30  
> **适用平台**: Windows 10/11, macOS 12+, Ubuntu 20.04+

---

## 📋 目录

1. [系统环境要求](#1-系统环境要求)
2. [安装前检查](#2-安装前检查)
3. [安装方式选择](#3-安装方式选择)
4. [方式一：全局安装（推荐）](#4-方式一全局安装推荐)
5. [方式二：单项目安装](#5-方式二单项目安装)
6. [方式三：手动配置](#6-方式三手动配置)
7. [验证安装](#7-验证安装)
8. [常见问题解答](#8-常见问题解答)

---

## 1. 系统环境要求

### 必须满足的最低要求

| 组件 | 最低版本 | 推荐版本 | 用途 |
|------|---------|---------|------|
| **操作系统** | Windows 10 / macOS 12 / Ubuntu 20.04 | 最新稳定版 | 运行环境 |
| **Node.js** | 18 LTS | 20 LTS | JavaScript运行时（如项目需要） |
| **Git** | 2.30+ | 2.40+ | 版本控制和自动提交 |
| **IDE** | TRAE IDE v1.0+ | 最新版 | AI编程环境 |
| **Bun** | 1.0+ | 1.1+ | 快速包管理器（替代npm） |

### 可选依赖

| 组件 | 用途 | 是否必须 |
|------|------|---------|
| **PowerShell 7+** (Windows) | 执行安装脚本 | 推荐 |
| **curl** | 网络请求测试 | 可选 |
| **MiniMax API Key** | AI图片生成功能 | 仅需图片生成时 |

---

## 2. 安装前检查

在开始安装之前，请确认以下工具已正确安装：

### Windows 系统

打开 **PowerShell**（推荐以管理员身份），依次执行：

```powershell
# 检查 Node.js
node --version
# 期望输出: v18.x.x 或更高

# 检查 Git
git --version
# 期望输出: git version 2.40+

# 检查 Bun（如果使用）
bun --version
# 期望输出: 1.x.x

# 检查 PowerShell版本
$PSVersionTable.PSVersion.ToString()
# 期望输出: 7.x.x 或更高
```

### macOS / Linux 系统

打开 **终端**，依次执行：

```bash
# 检查 Node.js
node --version

# 检查 Git
git --version

# 检查 Bun
bun --version

# 检查 Shell类型
echo $SHELL
```

### 如果缺少依赖

#### 安装 Node.js

**Windows**: 从 https://nodejs.org 下载 LTS 版本安装包

**macOS**:
```bash
brew install node@18
```

**Linux (Ubuntu)**:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 安装 Git

**Windows**: 从 https://git-scm.com 下载安装

**macOS**:
```bash
brew install git
```

**Linux (Ubuntu)**:
```bash
sudo apt-get update && sudo apt-get install git
```

#### 安装 Bun

```powershell
# Windows (PowerShell)
irm bun.sh/install.ps1 | iex

# macOS/Linux
curl -fsSL https://bun.sh/install | bash
```

---

## 3. 安装方式选择

根据你的需求选择合适的安装方式：

| 安装方式 | 适用场景 | 影响范围 | 难度 |
|---------|---------|---------|------|
| **方式一：全局安装** ⭐ | 所有项目都需要Boss Mode | 全局（所有TRAE项目） | 简单 |
| **方式二：单项目安装** | 只想在特定项目中使用 | 当前项目 | 简单 |
| **方式三：手动配置** | 需要深度自定义 | 自定义范围 | 中等 |

**推荐首次使用者选择「方式一：全局安装」**

---

## 4. 方式一：全局安装（推荐）

全局安装后，**任何TRAE项目都可以直接调用Boss Mode**，无需在每个项目中单独配置。

### Step 1: 获取源码

#### 方式A: Git克隆（推荐）

```bash
# GitHub
git clone https://github.com/woshiboss666/Boss-auto-harness.git

# Gitee（国内用户推荐）
git clone https://gitee.com/woshiboss666/Boss-auto-harness.git
```

#### 方式B: 下载ZIP压缩包

从以下地址下载最新版本的 `boss-auto-harness.zip`：
- GitHub: https://github.com/woshiboss666/Boss-auto-harness/releases
- Gitee: https://gitee.com/woshiboss666/Boss-auto-harness/releases

下载后解压到任意目录。

### Step 2: 执行安装脚本

#### Windows 系统

```powershell
# 以管理员身份打开 PowerShell

# 进入解压后的目录
cd Boss-auto-harness

# 执行安装脚本
.\install\install.ps1
```

安装脚本会自动完成以下操作：
1. ✅ 检测并创建全局配置目录 `~/.boss-harness/`
2. ✅ 复制核心配置文件到全局路径
3. ✅ 复制所有Skill定义到全局路径
4. ✅ 配置TRAE IDE的全局Agent规则
5. ✅ 注册关键词触发器
6. ✅ 创建桌面快捷方式（可选）

#### macOS / Linux 系统

```bash
# 进入解压后的目录
cd Boss-auto-harness

# 赋予执行权限
chmod +x install/install.sh

# 执行安装脚本
./install/install.sh
```

### Step 3: 重启IDE

安装完成后，**重启TRAE IDE**以确保所有配置生效。

### Step 4: 验证安装

在TRAE IDE的聊天框中输入：

```
boss 你好
```

如果看到AI回复包含"Boss Mode已激活"或类似提示，说明安装成功！

---

## 5. 方式二：单项目安装

如果你只想在特定项目中使用Boss Mode：

### 方法A: 使用激活脚本

```powershell
# 在目标项目目录中执行
cd "你的项目路径"

# 运行激活脚本（指定Boss-harness的安装路径）
& "k:\chanbpin4.0\120.产品经理技能包 4.0\activate-in-project.ps1"
```

### 方法B: 手动复制文件

```bash
# 假设Boss-auto-harness解压在 ~/Boss-auto-harness
# 目标项目在 ~/my-project

# 1. 复制主配置文件
cp ~/Boss-auto-harness/CLAUDE.md ~/my-project/.claude/

# 2. 复制所有Skill定义
cp -r ~/Boss-auto-harness/skills/* ~/my-project/.claude/skills/

# 3. 复制Agent定义（可选）
cp -r ~/Boss-auto-harness/agents/* ~/my-project/.claude/agents/

# 4. 复制TRAE Agent配置（可选）
cp -r ~/Boss-auto-harness/trae-agents/* ~/my-project/.trae/agents/
```

---

## 6. 方式三：手动配置

如果需要更精细的控制，可以手动配置每个组件。

### 6.1 配置CLAUDE.md

将 `CLAUDE.md` 的内容复制到项目的 `.claude/` 目录下。

关键配置项说明：

```markdown
[Boss Mode 规则]

# 触发关键词（可自定义）
触发方式：
  - boss
  - boss模式
  - boss-harness
  - boss开发
  - 全自动开发

# 功能开关
启用竞品分析: true        # 是否自动执行竞品分析
启用市场扫描: true        # 是否进行市场环境分析
启用用户画像: true        # 是否构建用户画像
严格审查模式: true        # 是否启用五维强制审查
自动Git提交: true         # 是否自动执行Git操作
垃圾箱静默模式: true      # 临时文件全自动移动（不询问）

# 问题处理配置
必须回答数量: 12          # 🔴类问题数量
建议回答数量: 16          # 🟡类问题数量
AI决策阈值: 3             # 🟡类问题几次不答后AI自主决策
```

### 6.2 配置Skills

将 `skills/` 目录下的所有子目录复制到 `.claude/skills/` 下。

必需的Skills列表：
- product-spec-builder/
- dev-planner/
- dev-builder/
- code-review/
- test-runner/
- quality-gate/
- bug-fixer/
- pipeline-engine/
- record-keeper/
- git-committer/
- deploy-engine/
- release-builder/
- image-generator/
- compatibility-checker/
- monitor-setup/
- skill-builder/
- evolution-engine/
- feedback-writer/
- design-brief-builder/
- design-maker/

### 6.3 配置Agents

将 `agents/` 目录下的文件复制到 `.claude/agents/` 下。

必需的Agents列表：
- implementer.md
- code-reviewer.md
- feedback-observer.md
- evolution-runner.md
- agent-orchestrator.md

### 6.4 配置TRAE Agents（可选）

将 `trae-agents/` 目录下的文件复制到 `.trae/agents/` 下。

---

## 7. 验证安装

### 基础验证清单

安装完成后，请逐项检查：

- [ ] CLAUDE.md 文件存在于 `.claude/` 目录
- [ ] skills/ 目录下有 17+ 个Skill子目录
- [ ] agents/ 目录下有 5 个Agent文件
- [ ] 输入 `boss` 能触发Boss Mode响应
- [ ] 输入 `boss模式` 能触发Boss Mode响应
- [ ] 输入 `boss开发` 能触发Boss Mode响应
- [ ] 输入 `boss-harness` 能触发Boss Mode响应

### 功能测试

在TRAE IDE中输入以下命令进行完整功能测试：

```
boss 帮我做一个Hello World页面
```

预期行为：
1. ✅ AI识别到Boss Mode触发词
2. ✅ 开始需求收集流程（询问问题）
3. ✅ 进行市场调研和竞品分析
4. ✅ 生成Product-Spec.md
5. ✅ 请求PRD确认
6. ✅ （确认后）进入自主开发模式

---

## 8. 常见问题解答

### Q1: 安装后输入"boss"没有反应？

**可能原因及解决方案**：

| 原因 | 解决方案 |
|------|---------|
| CLAUDE.md未放置在正确位置 | 确认文件在 `.claude/CLAUDE.md` |
| IDE未重启 | 完全关闭TRAE IDE后重新打开 |
| 关键词未匹配 | 检查CLAUDE.md中[触发方式]章节的关键词列表 |
| 缺少必要Skill | 确认skills/目录完整 |

### Q2: 全局安装后新项目不生效？

```powershell
# 检查全局配置是否存在
Test-Path "$env:USERPROFILE\.boss-harness"

# 如果不存在，重新运行安装脚本
.\install\install.ps1
```

### Q3: 如何卸载？

```powershell
# Windows
.\install\uninstall.ps1

# Linux/macOS
./install/uninstall.sh
```

或手动删除：
```bash
# 删除全局配置
rm -rf ~/.boss-harness

# 删除项目级配置
rm -rf .claude/skills .claude/agents .claude/CLAUDE.md
```

### Q4: 如何更新到最新版本？

```bash
# 进入安装目录
cd Boss-auto-harness

# 拉取最新代码
git pull origin main

# 重新运行安装脚本
./install/install.sh   # Linux/macOS
.\install\install.ps1  # Windows
```

### Q5: 图片生成功能不工作？

确保已配置MiniMax API Key：

```bash
# 创建.env文件
echo "MINIMAX_API_KEY=your_key_here" > .env
```

获取API Key: https://platform.minimaxi.com

### Q6: Git自动提交不工作？

检查：
1. Git是否已正确安装：`git --version`
2. 项目是否已初始化Git仓库：`git status`
3. 远程仓库是否已配置：`git remote -v`

### Q7: 多个项目同时使用会有冲突吗？

不会。每个项目维护独立的：
- Product-Spec.md（项目规格）
- DEV-PLAN.md（开发计划）
- docs/（记录归档）
- 垃圾箱/（临时文件）

全局共享的是：
- Skill定义（只读）
- Agent能力模型（只读）
- Boss Mode规则（可自定义覆盖）

### Q8: 支持哪些AI编程工具？

| 工具 | 支持程度 | 说明 |
|------|---------|------|
| **TRAE IDE** | ✅ 完全支持 | 主要开发和测试平台 |
| **VSCode + Claude** | ✅ 支持 | 需要手动配置.claude/目录 |
| **Cursor** | ✅ 支持 | 兼容Claude扩展 |
| **Windsurf** | ⚠️ 部分支持 | 可能需要调整配置格式 |
| **其他AI IDE** | 🔄 待适配 | 欢迎提交Issue反馈 |

---

## 📞 获取帮助

如果在安装过程中遇到问题：

1. 查看 [使用手册](USER-GUIDE.md) 获取详细操作指南
2. 搜索 [Issues](https://github.com/woshiboss666/Boss-auto-harness/issues) 是否已有解决方案
3. 提交新的 Issue，请包含：
   - 操作系统及版本
   - IDE名称及版本
   - 执行的具体操作
   - 错误信息或截图
   - 已尝试的解决方法

---

**祝安装顺利！如有问题，欢迎随时反馈 💪**
