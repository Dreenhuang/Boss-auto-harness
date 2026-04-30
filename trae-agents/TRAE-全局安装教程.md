# Boss-harness产品经理 AGENT 包 - TRAE 全局安装教程

> **版本**: 1.0.0  
> **适用平台**: TRAE IDE  
> **更新时间**: 2026-04-29

---

## 🎯 概述

本教程将指导你将**Boss-harness产品经理 AGENT 包**安装到 TRAE 的全局目录，使其在所有项目中可用。

---

## 📍 TRAE 全局目录位置

### Windows 系统
```
C:\Users\<用户名>\.trae\agents\
```

示例：
```
C:\Users\Administrator\.trae\agents\
```

### macOS / Linux 系统
```
~/.trae/agents/
```

---

## 🔧 安装步骤

### 方法一：手动复制（推荐）

#### 第一步：打开文件资源管理器

1. 按 `Win + E` 打开文件资源管理器
2. 地址栏输入：`C:\Users\Administrator\.trae\agents`（替换为你的用户名）
3. 按 Enter 进入目录

#### 第二步：复制 AGENT 文件

1. 打开源文件夹：
   ```
   K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents
   ```
2. 全选所有文件（Ctrl + A）
3. 复制（Ctrl + C）
4. 切换到目标目录 `C:\Users\Administrator\.trae\agents`
5. 粘贴（Ctrl + V）

#### 第三步：验证安装

在目标目录中，你应该看到以下 13 个文件：

```
C:\Users\Administrator\.trae\agents\
├── README.md                     # 索引文档
├── INSTALL.md                    # 安装指南
├── product-manager-demand.md     # 需求收集
├── design-brief-builder.md       # 设计规范
├── design-maker.md               # 设计稿
├── dev-planner.md                # 开发计划
├── dev-builder.md                # 开发执行
├── code-reviewer.md              # 代码审查
├── bug-fixer.md                  # Bug 修复
├── release-builder.md            # 发布
├── feedback-writer.md            # 反馈记录
├── evolution-engine.md           # 进化引擎
└── skill-builder.md              # 技能创建
```

---

### 方法二：使用命令提示符（CMD）

#### 第一步：打开 CMD（管理员模式）

1. 按 `Win + X`，选择"终端(管理员)"或"命令提示符(管理员)"
2. 如果提示"用户账户控制"，点击"是"

#### 第二步：执行复制命令

```cmd
xcopy "K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents\*" "C:\Users\Administrator\.trae\agents\" /E /I /H /Y
```

#### 第三步：验证安装

```cmd
dir "C:\Users\Administrator\.trae\agents"
```

你应该看到 13 个文件。

---

### 方法三：使用 PowerShell

#### 第一步：打开 PowerShell（管理员模式）

1. 右键点击开始菜单
2. 选择"终端(管理员)"或"Windows PowerShell(管理员)"

#### 第二步：执行复制命令

```powershell
Copy-Item -Path "K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents\*" -Destination "C:\Users\Administrator\.trae\agents\" -Recurse -Force
```

#### 第三步：验证安装

```powershell
Get-ChildItem "C:\Users\Administrator\.trae\agents" -Filter "*.md"
```

---

## ✅ 验证全局有效性

### 检查文件是否存在

在任意项目的 TRAE 对话中，输入：

```
请读取 C:\Users\Administrator\.trae\agents\README.md 文件内容
```

如果能正常读取，说明安装成功。

### 检查不同项目访问

1. 打开项目 A
2. 在 TRAE 对话中调用 AGENT：
   ```
   请使用 product-manager-demand.md 中的角色开始工作
   ```
3. 打开项目 B
4. 重复上述调用，确认可以正常使用

---

## 🎮 在 TRAE 中使用 AGENT

### 方式一：对话中直接引用

在 TRAE 对话中，直接指定使用某个 AGENT 文件：

```
请使用 C:\Users\Administrator\.trae\agents\product-manager-demand.md 中定义的角色和流程，帮我收集产品需求。
```

### 方式二：复制内容作为系统提示

1. 打开 `C:\Users\Administrator\.trae\agents\product-manager-demand.md`
2. 复制全部内容
3. 在 TRAE 对话中粘贴作为系统提示
4. 开始对话

### 方式三：设置 AGENT 快捷方式

在 TRAE 设置中配置 AGENT 路径：
1. 打开 TRAE 设置
2. 找到 AGENT 相关配置
3. 添加路径：`C:\Users\Administrator\.trae\agents`
4. 保存设置

---

## 📖 11 个 AGENT 详细使用说明

### 1️⃣ product-manager-demand.md（需求收集）

**功能**：通过深入对话收集产品需求，生成 Product-Spec.md

**使用场景**：
- 用户想做产品、应用、工具
- 用户要加功能、改需求、调 UI

**使用方式**：
```
请使用 product-manager-demand.md 开始收集我的产品需求。
我的想法是：[描述你的想法]
```

**核心流程**：
1. AI 追问产品定位、目标用户、核心功能
2. 确定 AI 能力需求
3. 确定产品类型（Web/Desktop/CLI/Mobile）
4. 生成 Product-Spec.md

---

### 2️⃣ design-brief-builder.md（设计规范）

**功能**：确定视觉方向，生成 Design-Brief.md

**使用场景**：
- 需要确定设计风格
- 需要明确视觉方向

**使用方式**：
```
请使用 design-brief-builder.md 引导我确定视觉方向。
产品类型是：[Web/Desktop/CLI]
目标用户是：[描述]
```

**核心流程**：
1. AI 用真实产品做锚点提问
2. 确定情绪方向、色彩、信息密度
3. 确认核心功能视觉表现
4. 生成 Design-Brief.md

---

### 3️⃣ design-maker.md（设计稿）

**功能**：通过设计工具生成完整设计稿

**使用场景**：
- Design Brief 已完成
- 需要生成设计稿

**使用方式**：
```
请使用 design-maker.md 生成设计稿。
设计工具：[Pencil/Figma]
```

**前置条件**：
- Product-Spec.md
- Design-Brief.md
- 设计工具 MCP 连接

---

### 4️⃣ dev-planner.md（开发计划）

**功能**：分析功能依赖，生成 DEV-PLAN.md

**使用场景**：
- Product-Spec.md 已完成
- 需要制定开发计划

**使用方式**：
```
请使用 dev-planner.md 生成开发计划。
参考文档：Product-Spec.md
```

**核心流程**：
1. 分析功能依赖关系
2. 确定技术栈（WebSearch 验证）
3. 拆分 Phase
4. 生成 DEV-PLAN.md

---

### 5️⃣ dev-builder.md（开发执行）

**功能**：按 Phase 开发代码

**使用场景**：
- DEV-PLAN.md 已就绪
- 开始写代码或继续开发

**使用方式**：
```
请使用 dev-builder.md 按 Phase 开发。
当前 Phase：[Phase 编号]
```

**核心流程**：
1. Plan Mode 规划实现
2. 编码实现
3. Code Review 验证
4. Phase 四步走验证
5. 用户确认

---

### 6️⃣ code-reviewer.md（代码审查）

**功能**：审查代码质量，输出结构化报告

**使用场景**：
- 需要审查代码完整性
- 需要检查代码质量
- Phase 完成验证

**使用方式**：
```
请使用 code-reviewer.md 审查代码。
对照文档：Product-Spec.md
审查范围：[全部/Phase N/Task N]
```

**审查阶段**：
- Stage 1：Spec Compliance（功能完整性）
- Stage 2：Code Quality（代码质量）

---

### 7️⃣ bug-fixer.md（Bug 修复）

**功能**：系统性调试定位根因并修复

**使用场景**：
- 功能坏了、报错、不正常
- 编译错误、运行时异常

**使用方式**：
```
请使用 bug-fixer.md 修复问题。
错误信息：[粘贴错误信息]
复现步骤：[描述如何复现]
```

**调试流程**：
1. 收集证据
2. 分析模式
3. 假设验证
4. 实施修复

---

### 8️⃣ release-builder.md（构建发布）

**功能**：打包、部署、发布

**使用场景**：
- 项目开发完成，准备发布
- 需要打包、部署

**使用方式**：
```
请使用 release-builder.md 发布项目。
项目类型：[Web/Desktop/CLI]
发布目标：[Vercel/npm/GitHub Release]
```

**发布检查**：
- 版本管理
- 构建验证
- 隐私审计（绝对底线）
- 冒烟测试

---

### 9️⃣ feedback-writer.md（反馈记录）

**功能**：记录用户反馈和改进意见

**使用场景**：
- 用户修正 AI 行为
- 提出改进意见
- Skill 执行后评估

**使用方式**：
通常由主 Agent 自动调用，不需要手动触发。

---

### 🔟 evolution-engine.md（进化引擎）

**功能**：扫描反馈，生成进化建议

**使用场景**：
- Session 初始化时自动触发
- 手动检查进化建议

**使用方式**：
```
请使用 evolution-engine.md 检查进化建议。
```

**进化信号**：
- 规则毕业（feedback 重复 3+ 次）
- Skill 优化（评分持续偏低）
- 新 Skill 提议（操作模式反复出现）

---

### 1️⃣1️⃣ skill-builder.md（技能创建）

**功能**：创建新的 Skill

**使用场景**：
- 需要创建新的 Skill
- EVOLUTION.md 提议自动生成新 Skill

**使用方式**：
```
请使用 skill-builder.md 创建新 Skill。
需求：[描述需要什么 Skill]
触发条件：[自动/手动]
```

---

## 💡 常见问题解决方案

### Q1：安装后找不到文件？

**解决方案**：
1. 确认文件已复制到正确目录
2. 检查路径是否正确（注意用户名）
3. 尝试重新复制

### Q2：TRAE 无法读取 AGENT 文件？

**解决方案**：
1. 确认文件路径正确
2. 检查文件是否损坏
3. 尝试复制文件内容到对话中

### Q3：如何在不同项目间共享？

**解决方案**：
1. 所有项目使用同一个全局目录
2. 或在每个项目中复制一份
3. 或使用符号链接（高级用户）

### Q4：如何更新 AGENT 版本？

**解决方案**：
1. 备份当前的 AGENT 文件
2. 删除旧版本
3. 复制新版本到同一目录
4. 验证新版本

### Q5：权限不足无法复制？

**解决方案**：
1. 以管理员身份运行 CMD/PowerShell
2. 或先复制到用户目录，再移动到目标目录

---

## 🔄 卸载指南

如果需要卸载：

1. 删除 `C:\Users\Administrator\.trae\agents\` 目录中的所有文件
2. 或直接删除整个 `agents` 目录

---

## 📞 获取帮助

如果遇到问题：

1. 查看 [INSTALL.md](K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents\INSTALL.md)
2. 查看 [README.md](K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents\README.md)
3. 参考各个 AGENT 文件中的详细说明

---

## 📄 版本信息

- **版本**: 1.0.0
- **更新时间**: 2026-04-29
- **来源**: Boss-harness产品经理技能包 4.0
- **平台**: TRAE IDE

---

## 🎉 完成后

安装成功后，你可以在任何项目中：

1. **直接引用 AGENT 文件**
2. **复制内容作为系统提示**
3. **跨项目使用同一套工作流程**

---

*本教程由Boss-harness产品经理技能包 4.0 自动生成*  
*版本：1.0.0*  
*更新时间：2026-04-29*
