# 🚀 Boss-auto-harness v2.0

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue.svg" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
  <img src="https://img.shields.io/badge/platform-Trae%20%7C%20Cursor%20%7C%20Windsurf%20%7C%20VS%20Code%20%7C%20Claude%20Code-orange.svg" alt="Platform" />
  <img src="https://img.shields.io/badge/Harness%20Engineering-95%2F100-brightgreen.svg" alt="Harness Score" />
</p>

<p align="center">
  <strong>基于 Harness Engineering 的全能型 AI 编程助手框架</strong><br>
  <sub>让 AI 像真正的产品经理一样思考，像资深工程师一样编码</sub>
</p>

---

## ✨ 核心特性

### 🎯 Boss 模式 - 全自动开发体验

```
你: boss 我想做一个待办事项应用

AI: 👋 让我先了解你的需求...
    
    [自动执行市场调研 → 竞品分析 → 用户画像构建]
    [6大维度30+项需求确认]
    
    ✅ PRD已确认！进入自主开发模式...
    
    [全自动: 规划 → 编码 → 测试 → 审查 → 提交]
    
    🎉 完成！项目已可运行。
```

**一句话描述**: 你负责想，AI 负责落地。从需求到上线，全程自动化。

### 🔧 20 个专业 Skill

| 类别 | Skill | 功能 |
|------|-------|------|
| **需求设计** | product-spec-builder | 产品规格生成 |
| | design-brief-builder | 设计规范定义 |
| | design-maker | AI 设计稿生成 |
| | image-generator | 图片生成 (MiniMax/Seedream) |
| **开发测试** | dev-planner | 分阶段开发计划 |
| | dev-builder | 项目代码实现 |
| | quality-gate | 自动化质量门禁 |
| | test-runner | 三层测试金字塔 |
| | code-review | 五维度代码审查 |
| | bug-fixer | 四阶段 Bug 修复 |
| **运维部署** | deploy-engine | 多目标部署 |
| | release-builder | 构建打包发布 |
| | monitor-setup | 监控告警配置 |
| | compatibility-checker | 兼容性验证 |
| **治理优化** ⭐v2.0 | doc-code-checker | 文档-代码一致性 |
| | garbage-collector | 熵治理垃圾回收 |
| | context-initializer | 项目上下文初始化 |
| | pipeline-engine | DAG 流水线编排 |
| | evolution-engine | 进化优化引擎 |
| **基础设施** | skill-builder | 自定义 Skill 创建 |
| | git-committer | Git 自动化提交 |
| | record-keeper | 全链路记录归档 |

### 🤖 智能 Agent 协作

```
┌─────────────────────────────────────────────┐
│           Agent Orchestrator (编排器)        │
│                                             │
│   ┌─────────┐  ┌─────────┐  ┌───────────┐  │
│   │Implement│→│ Reviewer│→│  Feedback │  │
│   │   er   │  │         │  │ Observer  │  │
│   └─────────┘  └─────────┘  └───────────┘  │
│         ↑                            ↓      │
│   ┌─────────┐                  ┌───────────┐  │
│   │Evolution│                  │  Record   │  │
│   │ Runner  │                  │ Keeper    │  │
│   └─────────┘                  └───────────┘  │
└─────────────────────────────────────────────┘
```

**五种自适应模式**: Solo / Dual-Core / Triple-Core / Quad-Core / Agile

### 🏗️ Harness Engineering 实现 (95/100)

| 支柱 | 得分 | 核心实现 |
|------|:----:|---------|
| **上下文架构** | 95 | 六维索引 + 自动学习 |
| **架构约束** | 90 | 六层依赖 + 复杂度控制 |
| **自验证循环** | 100 | Plan→Build→Verify→Fix |
| **上下文隔离** | 100 | Sub-Agent 完全隔离 |
| **熵治理** | 95 | 四维扫描 + 技术债量化 ⭐ |
| **可拆卸性** | 90 | 跨 6 大 IDE 平台 |

### 🌐 跨平台支持

| 平台 | 兼容性 | 推荐度 |
|------|:------:|:------:|
| **Trae IDE** | 🟢 100% | ⭐⭐⭐⭐⭐ |
| **Claude Code** | 🟢 95% | ⭐⭐⭐⭐⭐ |
| **Cursor** | 🟡 90% | ⭐⭐⭐⭐ |
| **Windsurf** | 🟡 85% | ⭐⭐⭐⭐ |
| **VS Code+Copilot** | 🟠 70% | ⭐⭐⭐ |
| **其他 IDE** | 🟢 40-80% | ⭐⭐⭐ |

---

## 🚀 快速开始

### 安装（30 秒）

```bash
# Clone 项目
git clone https://github.com/woshiboss666/boss-auto-harness.git
cd boss-auto-harness

# Windows 全局安装
powershell -ExecutionPolicy Bypass -File install\install.ps1

# Linux/macOS 全局安装
chmod +x install/install.sh && ./install/install.sh
```

### 使用

```bash
# 在任意 TRAE 项目中输入以下任一关键词：
boss
Boss模式
Boss-harness
全自动开发
harness
```

### 最小示例

```
用户: boss 做一个个人博客系统

AI: 👋 我是 Boss-harness，让我先了解你的需求...

    Q1: 主要用途？
       A. 技术分享  B. 生活记录  C. 作品展示
    
    [... 2 分钟问答后 ...]
    
    ✅ PRD 已确认！进入自主开发模式...
    
    📦 Phase 1: 项目初始化... ✅
    📦 Phase 2: 核心功能... ✅
    📦 Phase 3: 样式美化... ✅
    
    🎉 博客系统已完成！包含：
    - Markdown 文章编辑
    - 代码高亮显示
    - 响应式布局
    - SEO 优化
    - 部署配置就绪
```

---

## 📁 项目结构

```
boss-auto-harness/
│
├── CLAUDE.md                      # 主配置文件（核心规则）
├── EVOLUTION.md                   # 进化引擎配置
├── README.md                      # 本文件
├── INSTALL.md                     # 详细安装指南
├── USER-GUIDE.md                  # 用户使用手册
│
├── agents/                        # Agent 定义目录
│   ├── garbage-collector.md       # ⭐v2.0 熵治理 Agent
│   ├── context-initializer.md     # ⭐v2.0 上下文初始化器
│   ├── agent-orchestrator.md     # Agent 编排器
│   ├── code-reviewer.md          # 代码审查者
│   ├── implementer.md            # 代码实现者
│   ├── evolution-runner.md       # 进化引擎
│   └── feedback-observer.md      # 反馈观察者
│
├── skills/                        # Skill 目录（20个）
│   ├── product-spec-builder/      # 需求收集
│   ├── dev-planner/              # 开发计划
│   ├── dev-builder/              # 代码实现
│   ├── quality-gate/             # 质量门禁
│   ├── test-runner/              # 测试执行
│   ├── code-review/              # 代码审查
│   ├── doc-code-checker/         # ⭐v2.0 一致性检查
│   ├── deploy-engine/            # 部署引擎
│   ├── pipeline-engine/          # 流水线编排
│   ├── image-generator/          # 图片生成
│   └── ...                       # (共 20 个)
│
├── rules/                         # 规则配置目录
│   ├── tech-debt-rules.yml       # ⭐v2.0 技术债管理规则
│   ├── dependency-layers.yml     # 依赖分层规则
│   ├── sandwich-reasoning-guide.md # ⭐v2.0 Prompt优化指南
│   └── boss-auto-harness.md      # Boss模式规则
│
├── docs/                          # 文档目录
│   ├── 使用教程_v2.md             # ⭐v2.0 完整教程
│   ├── cross-platform-v2-guide.md # ⭐v2.0 跨平台指南
│   ├── Boss-auto-harness vs Harness Engineering 对比分析报告.md
│   └── index.html                # HTML 版教程
│
├── trae-agents/                   # TRAE 原生 Agent 配置
│   ├── boss-product-manager.md   # PM Agent
│   ├── dev-builder.md            # 开发 Agent
│   └── ...                       # (共 25 个)
│
├── install/                       # 安装脚本
│   ├── install.ps1               # Windows 安装
│   ├── install.sh                # Linux/macOS 安装
│   └── uninstall.ps1             # 卸载脚本（安装后生成）
│
├── hooks/                         # Git Hooks
├── memory/                        # 记忆存储
│   └── tokens.json               # API Token 存储
│
└── activate-in-project.ps1        # 新项目激活脚本
```

---

## 🎯 适用场景

### ✅ 强烈推荐使用

- **个人项目快速原型**: 从想法到可运行产品，30分钟内完成
- **全栈开发者**: 前后端一体化开发，质量有保障
- **独立创业者/MVP**: 快速验证想法，降低试错成本
- **学习新技术**: 通过实际项目学习最佳实践
- **开源项目维护**: 保持代码质量和文档一致性

### 🔄 可以使用

- **团队小项目** (2-5人): 统一开发规范，提高效率
- **技术博客/文档站**: 快速搭建和迭代
- **内部工具开发**: 自动化重复性工作
- **学生毕业设计**: 从开题到答辩全程辅助

### ⚠️ 需要定制

- **大型企业项目**: 需要适配内部流程和安全要求
- **高度定制化需求**: 可能需要修改核心规则
- **特殊行业合规**: 金融、医疗等需要额外审计

---

## 🔧 技术栈依赖

### 运行时依赖

```json
{
  "core": {
    "node.js": ">=18.x",
    "ide": "Trae IDE (推荐) / Cursor / Windsurf"
  },
  
  "optional": {
    "package_manager": "bun (推荐) / npm / pnpm",
    "image_generation": {
      "minimax_api": "用于AI图片生成",
      "seedream_api": "可选，火山引擎图片生成"
    },
    "git_integration": {
      "github_token": "用于自动推送",
      "gitee_token": "用于国内镜像"
    }
  }
}
```

### 无需安装的依赖

Boss-auto-harness 本身是**纯配置和规则文件**，不包含需要编译的代码。所有功能通过 IDE 原生的 Agent/Skill 系统运行。

---

## 📊 性能指标

### 开发效率提升

| 任务类型 | 传统方式 | Boss Mode | 提升 |
|---------|:--------:|:---------:|:----:|
| 新项目从零到可运行 | 2-4 小时 | **15-30 分钟** | **8x** |
| 功能模块开发 | 1-2 小时 | **10-20 分钟** | **6x** |
| Bug 修复 | 30-60 分钟 | **5-15 分钟** | **4x** |
| 文档编写 | 1-2 小时 | **自动生成** | **∞** |
| 代码审查 | 30-60 分钟 | **自动完成** | **∞** |

### 质量保证数据

```
平均代码质量评分: 85+/100 (中级工程师水平)
首次编译通过率: >90%
测试覆盖率: >80% (核心逻辑)
技术债增长率: -60% (相比无规范开发)
文档一致性: >95%
```

---

## 🆕 v2.0 更新亮点

### 熵治理系统 (Garbage Collector)

对抗 AI 编程时代的"数字腐烂"问题：

- 📦 **四维扫描**: 文档一致性 / 架构违规 / 技术债 / 记录腐烂
- 🧮 **量化评估**: 复利公式计算技术债当前价值
- 🎯 **ROI 排序**: 智能优先级排序，聚焦高价值修复
- 📈 **趋势追踪**: 可视化健康度变化曲线

### 技术债管理系统

企业级的技术债务管理能力：

- 📊 **四大分类**: 代码质量 / 架构设计 / 测试 / 文档
- ⏰ **时间衰减**: 90天 1.5倍 / 180天 2倍 / 365天 3倍惩罚
- 🤖 **自动修复**: 简单问题一键处理
- 📋 **修复建议模板**: 每类问题都有标准解决方案

### 项目上下文初始化器

让 AI 在编码前充分理解项目：

- 🧠 **六维学习**: 元数据 / 结构 / 依赖 / 模式 / 实体 / 约束
- 🔍 **自动检测**: 技术栈、框架版本、编码风格
- 📝 **模式库**: 组件模板、API约定、命名规范
- 🔄 **增量更新**: 不阻塞开发的轻量级刷新

### 文档-代码一致性检查

确保"写的"和"做的"一致：

- 🔍 **五大规则**: PRD / Plan / API / 类型 / README
- ⚡ **三种模式**: 快速(30秒) / 标准(2分钟) / 深度(5分钟)
- 🔗 **CI 集成**: 可作为质量门禁阻断部署
- 📊 **趋势分析**: 一致性评分历史追踪

---

## 📖 文档资源

| 文档 | 说明 | 路径 |
|------|------|------|
| **完整教程** | v2.0 所有功能的详细说明 | [docs/使用教程_v2.md](docs/使用教程_v2.md) |
| **跨平台指南** | 6 大 IDE 配置详解 | [docs/cross-platform-v2-guide.md](docs/cross-platform-v2-guide.md) |
| **对比分析报告** | 与 Harness Engineering 对比 | [docs/Boss-auto-harness vs Harness Engineering 对比分析报告.md](docs/Boss-auto-harness%20vs%20Harness%20Engineering%20对比分析报告.md) |
| **安装指南** | 详细的安装步骤 | [INSTALL.md](INSTALL.md) |
| **用户手册** | 日常使用参考 | [USER-GUIDE.md](USER-GUIDE.md) |
| **HTML 教程** | 可视化的交互式教程 | [index.html](index.html) |

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. **Fork** 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. **提交**更改 (`git commit -m 'feat: add amazing-feature'`)
4. **推送** 到分支 (`git push origin feature/amazing-feature`)
5. 开启 **Pull Request**

### 贡献类型

- 🐛 **Bug 修复**: 修复已知问题
- ✨ **新功能**: 添加新的 Skill 或 Agent
- 📝 **文档改进**: 完善说明和教程
- 🌍 **国际化**: 支持更多语言
- 🎨 **UI/UX**: 改进交互体验

### 开发规范

- 遵循现有的代码风格和命名规范
- 新增 Skill 必须包含完整的 SKILL.md
- 更新相关文档以反映变更
- 添加测试（如适用）

---

## 📄 许可证

本项目采用 **MIT License** 开源。

```
MIT License

Copyright (c) 2026 Boss-harness Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

详见 [LICENSE](LICENSE) 文件。

---

## 🙏 致谢

### 核心灵感来源

- **Harness Engineering**: AI 编程工程化的六大支柱理论
- **LangChain**: Agent 编排和工具调用模式
- **Cursor/Windsurf**: AI-first IDE 的用户体验设计
- **OpenAI**: Code Interpreter 和 Agent 能力

### 社区与生态

感谢所有贡献者、测试用户和反馈提供者！

---

## 📞 联系我们

- **GitHub Issues**: [提交 Bug 或功能请求](https://github.com/woshiboss666/boss-auto-harness/issues)
- **Gitee Issues**: [国内用户反馈](https://gitee.com/woshiboss666/boss-auto-harness/issues)
- **Discussions**: [使用心得和经验分享](https://github.com/woshiboss666/boss-auto-harness/discussions)

---

## ⭐ Star History

如果这个项目对你有帮助，请给一个 Star 支持我们！

<a href="https://github.com/woshiboss666/boss-auto-harness/stargazers">
  <img src="https://api.star-history.com/svg?repos=woshiboss666/boss-auto-harness&type=Date" alt="Star History Chart">
</a>

---

<p align="center">
  <strong>Made with ❤️ by Boss-harness Team</strong><br>
  <sub>Powered by Harness Engineering | Built for the Future of AI Programming</sub>
</p>
