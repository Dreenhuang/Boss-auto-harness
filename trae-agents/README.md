# Boss-harness产品经理 AGENT 包 - 索引

> **版本**: 1.0.0  
> **来源**: Boss-harness产品经理技能包 4.0  
> **适用平台**: Trae IDE

---

## 📦 包含的 AGENTS

本包包含 **11 个 AGENT**，覆盖产品开发的完整生命周期。

---

## 🎯 核心 AGENTS（产品开发流程）

### 1. [product-manager-demand.md](product-manager-demand.md)
**需求收集专家**

- 触发条件：用户想做产品、加功能、改需求、调 UI
- 功能：通过深入对话收集需求，生成 Product-Spec.md
- 模式：0-1 模式 / 迭代模式

### 2. [design-brief-builder.md](design-brief-builder.md)
**设计规范专家**

- 触发条件：确定设计风格、视觉方向
- 功能：引导用户确定视觉偏好，输出 Design-Brief.md
- 特点：用真实产品做锚点，不问像素级细节

### 3. [design-maker.md](design-maker.md)
**设计稿专家**

- 触发条件：Design Brief 完成后，需要生成设计稿
- 功能：通过设计工具 MCP 生成完整设计交付物
- 覆盖：组件、页面、状态变体、设计变量

### 4. [dev-planner.md](dev-planner.md)
**开发计划专家**

- 触发条件：Product-Spec.md 已完成，需要分阶段开发计划
- 功能：分析功能依赖，生成 DEV-PLAN.md
- 原则：可验证、依赖正序、无占位符

### 5. [dev-builder.md](dev-builder.md)
**开发执行专家**

- 触发条件：DEV-PLAN.md 就绪，开始写代码
- 功能：按 Phase 开发，编码 + review + 验证
- 模式：初始化模式 / 持续开发模式

---

## 🔍 质量保障 AGENTS

### 6. [code-reviewer.md](code-reviewer.md)
**代码审查专家**

- 触发条件：审查代码、检查质量、验证功能完整性
- 功能：对照 Spec 和设计稿审查，输出结构化报告
- 阶段：Stage 1（功能完整性）/ Stage 2（代码质量）

### 7. [bug-fixer.md](bug-fixer.md)
**Bug 修复专家**

- 触发条件：功能坏了、报错、不正常
- 功能：四阶段系统性调试定位根因并修复
- 原则：不猜不试、一次一个、修改纪律

### 8. [release-builder.md](release-builder.md)
**发布专家**

- 触发条件：打包、部署、发布、上线
- 功能：构建-打包-测试-发布流程
- 支持：Web / Desktop / CLI，内置隐私审计

---

## 🔄 持续进化 AGENTS

### 9. [feedback-writer.md](feedback-writer.md)
**反馈观察专家**

- 触发条件：用户修正 AI 行为、提出改进意见
- 功能：记录 feedback 到 .claude/feedback/ 目录
- 维度：用户修正、未覆盖场景、重复操作、质量问题、效能评估

### 10. [evolution-engine.md](evolution-engine.md)
**进化引擎**

- 触发条件：session 初始化时自动 / 手动调用
- 功能：扫描 feedback，生成进化建议
- 三层：规则毕业 / Skill 优化 / 新 Skill 提议

### 11. [skill-builder.md](skill-builder.md)
**技能创建专家**

- 触发条件：创建新 Skill
- 功能：按框架规范创建新 Skill
- 特点：模板优先、参照现有、最小必要

---

## 📋 使用方式

### Trae IDE 中使用

1. **手动调用**：在 Trae 对话中直接指定使用某个 AGENT
2. **工作流集成**：将 AGENT 集成到你的工作流程中

### 复制到项目

```powershell
# 将 trae-agents 目录复制到你的项目
Copy-Item -Path "K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents" -Destination "你的项目路径\agents" -Recurse
```

### 作为参考

这些 AGENT 定义可以作为：
- Trae 自定义 AGENT 的模板
- 产品开发流程的参考文档
- 团队协作的规范定义

---

## 🎨 AGENT 色彩标识

| 颜色 | AGENT |
|------|-------|
| 🔵 #3b82f6 | 需求收集 |
| 🟢 #10b981 | 开发计划 |
| 🟠 #f59e0b | 开发执行 |
| 🔴 #ef4444 | 代码审查 |
| 🟠 #f97316 | Bug 修复 |
| 🟢 #22c55e | 构建发布 |
| 🟣 #8b5cf6 | 设计规范 |
| 🔵 #06b6d4 | 设计稿 |
| 🟣 #a855f7 | 反馈记录 |
| 🩷 #ec4899 | 进化引擎 |
| 🩵 #14b8a6 | 技能创建 |

---

## 📞 版本信息

- **版本**: 1.0.0
- **更新时间**: 2026-04-29
- **来源**: Boss-harness产品经理技能包 4.0
- **平台**: Trae IDE

---

*本索引文件由Boss-harness产品经理技能包 4.0 自动生成*
