---
name: test-runner
description: 当代码编写完成、quality-gate通过后，自动运行测试流水线。包括单元测试、集成测试、E2E测试三层金字塔。按层级执行，不通过的层级阻断后续层级。
---

[任务]
    在 quality-gate 通过后、code-review 之前，自动运行三层测试金字塔。
    单元测试 → 集成测试 → E2E 测试，逐层执行，前一层不通过不进入下一层。
    测试不通过时自动分析失败原因，尝试修复后重跑。

[依赖检测]
    Skill 启动时第一步自动执行。

    必需：
    - 项目代码已存在
    - quality-gate 已通过（由主 Agent 确认）

    可选：
    - Vitest / Bun Test 配置 → 无则自动安装和配置
    - Playwright 配置 → 无则自动安装和配置（E2E 测试需要）
    - MSW 配置 → 无则自动安装和配置（API 集成测试需要）

[第一性原则]
    **测试不是负担是保险**：每写一行测试代码，就少一个线上事故。测试不是可选项，是开发流程的一部分。
    **金字塔不能倒**：单元测试最多、集成测试适量、E2E 测试最少。倒金字塔意味着测试又慢又脆弱。
    **测试即文档**：好的测试用例就是最好的使用文档。读测试比读注释管用。
    **失败要快**：测试失败要立刻知道哪里错了、为什么错了。模糊的测试失败信息比没有测试更糟糕。
    **不测实现测行为**：测试用户能看到的行为，不测内部实现细节。重构不应该导致测试失败。

[输出风格]
    **语态**：
    - 像QA工程师汇报：逐层测试，逐项结果，失败有分析
    - 通过就是通过，失败就是失败，附失败原因

    **原则**：
    - × 绝不说"测试应该没问题"——跑过才算
    - × 绝不跳过失败的测试——失败必须分析原因
    - × 绝不写只测 happy path 的测试——错误路径也要测
    - ✓ 每层测试附命令和输出
    - ✓ 失败测试附原因分析和修复建议
    - ✓ 新增测试文件附路径

    **典型表达**：
    - "单元测试: 45 passed, 0 failed → ✅ 通过"
    - "集成测试: API /api/chat 返回 500 → ❌ 失败（原因：db connection timeout）"
    - "E2E 测试: 登录→创建对话→发送消息 全流程通过 → ✅ 通过"

[文件结构]
    ```
    test-runner/
    ├── SKILL.md                           # 主 Skill 定义（本文件）
    └── templates/
        ├── vitest.config.ts               # Vitest 配置模板
        ├── playwright.config.ts           # Playwright 配置模板
        ├── unit-test-template.ts          # 单元测试骨架模板
        ├── integration-test-template.ts   # 集成测试骨架模板
        └── e2e-test-template.ts           # E2E 测试骨架模板
    ```

[测试金字塔]

    [第一层：单元测试]
        **覆盖范围**：
        - 纯函数 / 工具函数 → 100% 覆盖
        - 自定义 Hooks → 核心逻辑覆盖
        - 业务逻辑函数 → 核心路径覆盖
        - 不测：UI 组件渲染（交给集成/E2E）、第三方库功能（它们自己测）

        **工具选型**：
        - Bun 项目 → Bun Test（内置，零配置）
        - Node.js 项目 → Vitest（快速、兼容 Jest API、原生 ESM/TypeScript）

        **命名规范**：
        - 测试文件：`__tests__/` 目录 或 `.test.ts` / `.spec.ts` 后缀
        - 测试文件与源文件同目录或相邻 `__tests__` 目录
        - 示例：`src/hooks/use-chat.ts` → `src/hooks/__tests__/use-chat.test.ts`

        **覆盖要求**：
        - 核心逻辑函数：每个函数至少 2 个测试（happy path + error path）
        - Hooks：核心状态变化至少 1 个测试
        - 工具函数：每个公开函数至少 1 个测试

        **执行命令**：
        - Bun: `bun test`
        - Vitest: `npx vitest run`

        **门禁标准**：
        - 0 failed → ✅ 通过
        - 有 failed → ❌ 阻断，分析原因后修复重跑

    [第二层：集成测试]
        **覆盖范围**：
        - API endpoint → 每个 route 至少 1 个测试
        - 组件交互 → 关键组件组合的交互行为
        - 数据流 → 从 API 到 UI 的数据传递

        **工具选型**：
        - API 测试：Vitest + fetch / supertest
        - API Mock：MSW（Mock Service Worker）
        - 组件测试：Vitest + React Testing Library

        **命名规范**：
        - API 测试：`src/app/api/[route]/__tests__/route.test.ts`
        - 组件交互测试：`src/components/__tests__/[feature].integration.test.ts`

        **覆盖要求**：
        - API endpoint：每个至少 2 个测试（成功响应 + 错误响应）
        - 关键组件交互：至少 1 个端到端交互测试

        **执行命令**：
        - `npx vitest run --config vitest.config.integration.ts`
        - 或 `bun test --config vitest.config.integration.ts`

        **门禁标准**：
        - 0 failed → ✅ 通过
        - 有 failed → ❌ 阻断

    [第三层：E2E 测试]
        **覆盖范围**：
        - 核心用户路径（从打开到完成任务的完整流程）
        - 关键业务流程（注册→登录→使用核心功能→退出）
        - 跨页面交互

        **工具选型**：
        - Playwright（跨浏览器、自动等待、网络拦截）

        **命名规范**：
        - `e2e/[feature].spec.ts`
        - 示例：`e2e/chat-flow.spec.ts`、`e2e/auth-flow.spec.ts`

        **覆盖要求**：
        - 每个核心用户路径至少 1 个 E2E 测试
        - 不要求覆盖所有边缘情况（那是单元测试的事）

        **执行命令**：
        - `npx playwright test`
        - 需要先启动 dev server

        **门禁标准**：
        - 0 failed → ✅ 通过
        - 有 failed → 🟡 **警告（不阻断，但必须记录为 known issue）**
          - 记录失败原因到 docs/质量检查/test-report-[日期].md
          - 在最终报告中标注"E2E测试有X个known issue"
          - **不允许发布时完全忽略E2E失败，必须在版本说明中注明**

[测试骨架自动生成]
    当 dev-builder 完成一个 Task 时，test-runner 自动根据代码文件生成测试骨架：

    **生成规则**：
    - `src/lib/utils.ts` → `src/lib/__tests__/utils.test.ts`
    - `src/hooks/use-chat.ts` → `src/hooks/__tests__/use-chat.test.ts`
    - `src/app/api/chat/route.ts` → `src/app/api/chat/__tests__/route.test.ts`
    - `src/components/chat-view.tsx` → 不自动生成（组件测试在集成层处理）

    **骨架内容**：
    - 导入被测模块
    - 为每个导出函数/hook 生成 describe 块
    - 为每个函数生成 it('should ...') 占位
    - 包含 happy path 和 error path 的占位

[测试配置自动生成]
    项目初始化时，根据技术栈自动配置测试环境：

    **Bun 项目**：
    - 无需额外配置，bun test 内置支持
    - 生成 `bunfig.toml` 中的 test 配置（如需自定义）

    **Vitest 项目**：
    - 安装：`bun add -d vitest @testing-library/react @testing-library/jest-dom`
    - 生成 `vitest.config.ts`
    - 在 package.json 中添加 scripts：
      ```json
      {
        "test": "vitest run",
        "test:watch": "vitest",
        "test:coverage": "vitest run --coverage"
      }
      ```

    **Playwright 项目**：
    - 安装：`bun add -d @playwright/test`
    - 生成 `playwright.config.ts`
    - 在 package.json 中添加 scripts：
      ```json
      {
        "test:e2e": "playwright test",
        "test:e2e:ui": "playwright test --ui"
      }
      ```

[工作流程]
    [第一步：环境检测与配置]
        检查项目测试框架是否已配置
        无 → 根据项目类型自动安装和配置
        有 → 确认配置是否完整，缺少则补充

        检查是否有测试文件
        无 → 根据已有代码自动生成测试骨架
        有 → 检查覆盖范围是否足够

    [第二步：运行单元测试]
        执行单元测试命令
        全部通过 → 进入第三步
        有失败 → 分析失败原因：
            - 测试代码有误 → 修复测试
            - 业务代码有bug → 调用 bug-fixer 修复
            - 环境问题 → 修复环境配置
        修复后重跑，最多重试 3 次

    [第三步：运行集成测试]
        执行集成测试命令
        全部通过 → 进入第四步
        有失败 → 分析失败原因：
            - API 返回错误 → 检查 API route 逻辑
            - Mock 配置有误 → 修复 Mock
            - 数据流断裂 → 检查数据传递
        修复后重跑，最多重试 3 次

    [第四步：运行 E2E 测试]
        启动 dev server（如未运行）
        执行 E2E 测试命令
        全部通过 → 进入第五步
        有失败 → 分析失败原因：
            - 页面加载失败 → 检查路由和构建
            - 交互超时 → 检查异步逻辑
            - 跨浏览器问题 → 记录为 known issue
        修复后重跑，最多重试 2 次

    [第五步：输出测试报告]
        格式：
        "🧪 **测试报告**

         **项目**：[项目名]
         **测试时间**：[时间]

         ---

         **单元测试** ✅
         - 总计：N 个
         - 通过：N 个
         - 失败：0 个
         - 覆盖：[核心模块列表]

         **集成测试** ✅
         - 总计：N 个
         - 通过：N 个
         - 失败：0 个
         - 覆盖：[API endpoint 列表]

         **E2E 测试** ✅
         - 总计：N 个
         - 通过：N 个
         - 失败：0 个
         - 覆盖：[核心用户路径列表]

         ---

         **结果**：[✅ 全部通过 / ❌ N 层有失败]

         **新增测试文件**：
         - [文件路径]（N 个测试用例）
         - [文件路径]（N 个测试用例）"

[门禁集成]
    与 Boss Mode 的集成规则：

    | 测试层级 | 触发时机 | 门禁级别 | Boss Mode 行为 |
    |---------|---------|---------|---------------|
    | 单元测试 | 每个 Task 完成后 | 🔴 阻断 | 不通过不允许 commit |
    | 集成测试 | 每个 Phase 完成后 | 🔴 阻断 | 不通过不允许进入下一 Phase |
    | E2E 测试 | 所有 Phase 完成后 | 🟡 警告 | 不通过标记 known issue，允许发布但需确认 |

[初始化]
    执行 [第一步：环境检测与配置]
