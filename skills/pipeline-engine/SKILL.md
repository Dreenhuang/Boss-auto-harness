---
name: pipeline-engine
description: 编排整个开发流程的自动化流水线。将 Spec→Plan→Build→QualityGate→Test→Review→Deploy 串联为 DAG，自动按依赖关系执行，支持断点续跑和并行执行。
---

[任务]
    将开发流程中的各个阶段串联为有向无环图（DAG），按依赖关系自动执行。
    支持断点续跑（从失败的节点继续）、并行执行（无依赖关系的节点同时执行）、条件跳过（已通过的节点不重复执行）。

[依赖检测]
    Skill 启动时第一步自动执行。

    必需：
    - 项目目录存在
    - 至少有 Product-Spec.md 或项目代码

    可选：
    - .pipeline-state.json → 有则读取上次执行状态，支持断点续跑

[第一性原则]
    **流水线是声明式的**：定义"做什么"和"依赖什么"，不定义"怎么做"。"怎么做"由对应的 Skill 负责。
    **失败要快，恢复要准**：任何节点失败，立刻停止后续节点。恢复时从失败节点继续，不从头开始。
    **状态是真相**：.pipeline-state.json 记录了每个节点的真实状态。不依赖记忆，不依赖假设，只看状态文件。
    **可观测性是底线**：每个节点的开始、结束、耗时、结果都必须记录。出了问题能回溯。
    **人工干预是安全阀**：关键节点（部署、发布）默认需要人工确认。Boss 模式下可跳过，但有安全护栏。

[输出风格]
    **语态**：
    - 像CI/CD流水线日志：节点→状态→耗时→结果
    - 每个节点开始和结束都有明确输出

    **原则**：
    - × 绝不跳过节点不记录
    - × 绝不在节点失败后继续执行下游节点
    - × 绝不修改历史状态记录
    - ✓ 每个节点输出开始时间和结束时间
    - ✓ 每个节点输出调用的是哪个 Skill
    - ✓ 汇总报告包含总耗时和各节点耗时

    **典型表达**：
    - "▶ [1/7] product-spec-builder → 开始"
    - "✅ [1/7] product-spec-builder → 完成 (2m 30s)"
    - "❌ [3/7] dev-builder → 失败 (5m 12s) → 原因: TypeScript 编译错误"

[文件结构]
    ```
    pipeline-engine/
    └── SKILL.md                           # 主 Skill 定义（本文件）
    ```

[Pipeline DAG 定义]
    标准开发流水线的 DAG 结构：

    ```
    product-spec-builder ──→ design-brief-builder ──→ design-maker
            │                        │
            ↓                        ↓
        dev-planner ──────────→ dev-builder
                                       │
                                       ↓
                                 quality-gate
                                       │
                                       ↓
                                  test-runner
                                       │
                                       ↓
                                 code-review
                                       │
                                       ↓
                                 deploy-engine
    ```

    **节点定义**：

    | 节点 ID | Skill | 依赖 | 必需 | 可跳过条件 |
    |---------|-------|------|------|-----------|
    | spec | product-spec-builder | 无 | 是 | 已有 Product-Spec.md |
    | design-brief | design-brief-builder | spec | 否 | 用户跳过设计 |
    | design-maker | design-maker | design-brief | 否 | 用户跳过设计稿 |
    | plan | dev-planner | spec | 是 | 已有 DEV-PLAN.md |
    | build | dev-builder | plan | 是 | 从不跳过 |
    | quality | quality-gate | build | 是 | 从不跳过 |
    | test | test-runner | quality | 是 | 从不跳过 |
    | review | code-review | test | 是 | 从不跳过 |
    | deploy | deploy-engine | review | 否 | 用户选择不部署 |

    **可并行节点**：
    - ⚠️ **默认串行执行**（推荐，因为Plan会参考设计稿信息）
    - ✅ **并行执行条件**（需用户明确要求或Boss模式下自动判断）：
      - 用户说"加快速度"或"并行执行"
      - Boss模式且设计阶段被跳过（design-brief和design-maker都skipped）
      - 已有Design-Brief.md且DEV-PLAN不需要参考新增的设计信息
    - 并行执行时必须分别记录各节点的开始/结束时间和状态

[Pipeline 状态文件]
    .pipeline-state.json 记录流水线执行状态：

    ```json
    {
      "pipeline_id": "proj-name-20260430-143000",
      "project": "项目名",
      "started_at": "2026-04-30T14:30:00Z",
      "updated_at": "2026-04-30T15:45:00Z",
      "current_phase": "build",
      "nodes": {
        "spec": {
          "status": "completed",
          "started_at": "2026-04-30T14:30:00Z",
          "completed_at": "2026-04-30T14:32:30Z",
          "duration_seconds": 150,
          "output_summary": "Product-Spec.md 已生成，3 个核心功能"
        },
        "design-brief": {
          "status": "skipped",
          "reason": "用户选择跳过设计阶段"
        },
        "plan": {
          "status": "completed",
          "started_at": "2026-04-30T14:33:00Z",
          "completed_at": "2026-04-30T14:35:00Z",
          "duration_seconds": 120,
          "output_summary": "DEV-PLAN.md 已生成，4 个 Phase"
        },
        "build": {
          "status": "in_progress",
          "started_at": "2026-04-30T14:36:00Z",
          "completed_at": null,
          "duration_seconds": null,
          "output_summary": null
        }
      },
      "warnings": [
        {
          "node": "quality",
          "level": "warning",
          "message": "2 个文件超过 300 行",
          "timestamp": "2026-04-30T15:00:00Z"
        }
      ]
    }
    ```

    **状态值**：
    - `pending`：未开始
    - `in_progress`：执行中
    - `completed`：已完成
    - `failed`：执行失败
    - `skipped`：已跳过（附原因）
    - `blocked`：被阻断（上游节点失败）

[工作流程]
    [第一步：初始化 Pipeline]
        检查 .pipeline-state.json 是否存在
        存在 → 读取上次状态，确定断点位置
        不存在 → 创建新的 pipeline state，所有节点设为 pending

        检查项目现有文件，自动跳过已完成的节点：
        - 有 Product-Spec.md → spec 标记 completed
        - 有 Design-Brief.md → design-brief 标记 completed
        - 有 DEV-PLAN.md → plan 标记 completed
        - 有项目代码且构建成功 → build 标记 completed（需确认）

    [第二步：确定执行计划]
        根据 DAG 依赖关系，确定当前可执行的节点
        可执行条件：所有依赖节点状态为 completed 或 skipped

        输出执行计划：
        "📋 **Pipeline 执行计划**

         已完成：[节点列表]
         待执行：[节点列表]（按顺序）
         跳过：[节点列表]（附原因）

         从 [当前节点] 开始执行。"

    [第三步：逐节点执行]
        对每个待执行节点：

        1. 更新状态为 in_progress
        2. 调用对应的 Skill
        3. 等待 Skill 完成
        4. 根据结果更新状态：
           - 成功 → completed，记录输出摘要
           - 失败 → failed，记录失败原因
           - 需要人工确认 → 暂停，等待用户输入
        5. 如果失败 → 标记所有下游节点为 blocked → 停止执行

        **Boss 模式特殊处理**：
        - build 节点内，每个 Task 完成后自动执行 quality-gate + test-runner
        - review 节点自动执行，不等待用户确认
        - deploy 节点需要用户确认（安全护栏）

    [第四步：输出 Pipeline 报告]
        所有节点执行完毕（或失败停止）后，输出汇总报告：

        "📊 **Pipeline 报告**

         **项目**：[项目名]
         **Pipeline ID**：[ID]
         **开始时间**：[时间]
         **结束时间**：[时间]
         **总耗时**：[Xm Ys]

         ---

         | 节点 | 状态 | 耗时 | 摘要 |
         |------|------|------|------|
         | spec | ✅ 完成 | 2m 30s | 3 个核心功能 |
         | design-brief | ⏭️ 跳过 | - | 用户选择跳过 |
         | plan | ✅ 完成 | 2m 00s | 4 个 Phase |
         | build | ✅ 完成 | 45m 00s | Phase 1-4 全部完成 |
         | quality | ✅ 完成 | 3m 15s | 0 阻断，2 警告 |
         | test | ✅ 完成 | 5m 30s | 45 单元，8 集成，3 E2E |
         | review | ✅ 完成 | 8m 00s | Stage 1+2 通过 |
         | deploy | ✅ 完成 | 2m 00s | Vercel 部署成功 |

         ---

         **结果**：[✅ 全部完成 / ❌ N 个节点失败 / ⚠️ N 个警告]

         **警告**：
         - [警告列表]

         **下一步**：
         - [根据最终状态给出建议]"

[断点续跑]
    当 Pipeline 因失败中断后，重新启动时：

    1. 读取 .pipeline-state.json
    2. 找到 failed 节点
    3. 询问用户：重试失败节点 / 跳过失败节点 / 从头开始
    4. 根据用户选择更新状态
    5. 从断点继续执行

    **Boss 模式下**：自动重试失败节点（最多 3 次），3 次仍失败则暂停报告。

[Pipeline 变体]
    根据不同场景，Pipeline 有几种变体：

    **完整流水线**（新项目）：
    spec → design-brief → design-maker → plan → build → quality → test → review → deploy

    **快速流水线**（跳过设计）：
    spec → plan → build → quality → test → review → deploy

    **增量流水线**（已有项目，修改功能）：
    spec(迭代) → plan(迭代) → build → quality → test → review → deploy

    **Bug 修复流水线**：
    bug-fixer → quality → test → review → deploy

    **仅部署流水线**：
    quality → deploy

[初始化]
    执行 [第一步：初始化 Pipeline]
