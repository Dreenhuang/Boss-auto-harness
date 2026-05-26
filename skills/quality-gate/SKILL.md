---
name: quality-gate
description: 当代码编写完成、code-review之前，自动运行质量检查流水线。包括lint检查、类型检查、安全扫描、复杂度控制、文件大小检查。全部通过后才允许进入code-review。
---

[任务]
    在代码编写完成后、code-review之前，自动运行质量检查流水线。
    不通过的项根据严重度自动修复或阻断流程。全部通过后输出质量报告，允许进入code-review。

[依赖检测]
    Skill 启动时第一步自动执行。

    必需：
    - 项目代码已存在 → 无代码则跳过
    - package.json 存在 → 无则提示先初始化项目

    可选：
    - ESLint 配置 → 无则自动生成基础配置
    - TypeScript 配置 → 无则跳过类型检查
    - .eslintrc.quality.js → 无则自动生成

[第一性原则]
    **机器能查的不用人查**：lint、类型检查、安全扫描这些机器能做的事，不让code-reviewer浪费时间。code-reviewer专注在逻辑正确性和架构合理性上。
    **阻断有标准**：不是所有问题都阻断。error级别阻断，warning级别记录。阻断意味着必须修复才能继续，记录意味着Phase完成时统一处理。
    **修复有路径**：每个阻断项都有对应的自动修复方案。quality-gate不只是报告问题，还要尝试自动修复。
    **证据即门禁**：每项检查必须输出命令和结果。没有输出结果的"通过"不算通过。

[输出风格]
    **语态**：
    - 像CI/CD流水线：逐项检查，逐项输出结果，最终汇总
    - 通过就是通过，失败就是失败，不含糊

    **原则**：
    - × 绝不说"大概没问题"——要么通过要么不通过
    - × 绝不跳过任何检查项
    - × 绝不手动声称通过——必须有命令输出
    - ✓ 每项检查附命令和输出
    - ✓ 阻断项明确标注修复建议
    - ✓ 汇总报告一目了然

    **典型表达**：
    - "ESLint: 0 errors, 2 warnings → ✅ 通过（warnings已记录）"
    - "TypeScript: tsc --noEmit → 3 errors → ❌ 阻断（自动修复中...）"
    - "安全扫描: 发现硬编码API Key → ❌ 阻断（建议移至环境变量）"

[文件结构]
    ```
    quality-gate/
    ├── SKILL.md                           # 主 Skill 定义（本文件）
    └── templates/
        └── eslintrc-quality.js            # ESLint 质量规则模板
    ```

[检查流水线]
    按顺序执行以下检查。任何 🔴 阻断级检查失败，停止后续检查，先修复再重来。

    [Level 1 — 代码规范检查]
        **ESLint 检查**
        命令：`npx eslint src/ --max-warnings=50`
        阻断条件：有 error 级别问题
        自动修复：`npx eslint src/ --fix`
        通过条件：0 errors（warnings 允许，但记录数量）

        **TypeScript 类型检查**
        命令：`npx tsc --noEmit`
        阻断条件：有任何类型错误
        自动修复：无法自动修复，输出错误列表供 bug-fixer 处理
        通过条件：0 errors

        **格式检查**（如项目配置了 Prettier）
        命令：`npx prettier --check src/`
        阻断条件：有格式不一致
        自动修复：`npx prettier --write src/`
        通过条件：全部文件格式一致

    [Level 2 — 安全扫描]
        **依赖漏洞扫描**
        命令：`npm audit --audit-level=high`
        阻断条件：有 critical 或 high 级别漏洞
        自动修复：`npm audit fix`（如可自动修复）
        通过条件：0 critical, 0 high

        **密钥泄露检测**
        检查模式（使用 Grep tool 搜索 src/ 目录）：
        - `sk-ant-|sk-proj-|sk-cp-` → API Key 泄露
        - `password\s*=\s*['"]` → 硬编码密码
        - `api_key\s*=\s*['"]|apiKey\s*=\s*['"]` → API Key 赋值
        - `secret\s*=\s*['"]` → 密钥赋值
        - `token\s*=\s*['"][^'"]{20,}` → 长字符串 Token
        - `VITE_.*KEY|VITE_.*SECRET|VITE_.*TOKEN|VITE_.*PASSWORD` → 环境变量泄露
        阻断条件：发现任何匹配
        自动修复：移至 .env.local，代码中改为 process.env.XXX
        通过条件：0 匹配

        **危险函数检测**
        检查模式：
        - `eval\(` → 动态代码执行
        - `dangerouslySetInnerHTML` → XSS 风险
        - `innerHTML\s*=` → DOM XSS
        - `document\.write\(` → DOM 注入
        阻断条件：发现匹配且无安全注释说明
        通过条件：0 匹配 或 有安全注释说明

        **SQL 注入检测**
        检查模式：
        - 字符串拼接 SQL：`\+\s*['"].*SELECT|INSERT|UPDATE|DELETE`
        - 模板字符串 SQL：`\$\{.*\}.*SELECT|INSERT|UPDATE|DELETE`
        阻断条件：发现字符串拼接的 SQL
        通过条件：使用参数化查询

    [Level 3 — 复杂度检查]
        **文件大小检查**
        命令：`find src/ -name "*.ts" -o -name "*.tsx" | xargs wc -l | sort -rn | head -20`
        阻断条件：单文件 > 500 行
        警告条件：单文件 > 300 行
        通过条件：所有文件 ≤ 300 行（或 ≤ 500 行且已标记待重构）

        **函数复杂度检查**（依赖 ESLint complexity 规则）
        通过 .eslintrc.quality.js 配置：
        - complexity: max 10（warn），超过 20 error
        - max-depth: max 4（error）
        - max-params: max 4（warn）
        - max-lines-per-function: max 50（warn）
        - max-nested-callbacks: max 3（warn）

        **依赖完整性检查**
        命令：`npm ls --depth=0`
        阻断条件：有 missing 或 extraneous 依赖
        自动修复：`npm install` / `npm prune`
        通过条件：0 missing, 0 extraneous

    [Level 4 — 构建验证]
        **编译验证**
        命令：`npx tsc --noEmit`（已在 Level 1 执行，此处确认无新增错误）
        阻断条件：有编译错误
        通过条件：0 errors

        **构建验证**
        命令：`npm run build`（或项目实际的构建命令）
        阻断条件：构建失败
        通过条件：构建成功，产物大小合理

[ESLint 质量配置模板]
    项目初始化时自动生成 .eslintrc.quality.js：

    ```javascript
    module.exports = {
      extends: ['next/core-web-vitals', 'next/typescript'],
      rules: {
        'complexity': ['warn', { max: 10 }],
        'max-depth': ['error', { max: 4 }],
        'max-params': ['warn', { max: 4 }],
        'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
        'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
        'max-nested-callbacks': ['warn', { max: 3 }],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'prefer-const': 'error',
        'no-var': 'error',
      },
      overrides: [
        {
          files: ['**/__tests__/**', '**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
          rules: {
            'max-lines': 'off',
            'max-lines-per-function': 'off',
          },
        },
      ],
    };
    ```

[门禁规则汇总]
    | 检查项 | 级别 | Boss Mode 行为 |
    |-------|------|---------------|
    | ESLint error | 🔴 阻断 | 自动 eslint --fix，修复不了调 bug-fixer |
    | TypeScript 类型错误 | 🔴 阻断 | 调 bug-fixer 修复 |
    | Prettier 格式不一致 | 🟡 自动修复 | 自动 prettier --write |
    | npm audit critical/high | 🔴 阻断 | 自动 npm audit fix |
    | 密钥泄露 | 🔴 阻断 | 自动移至 .env.local |
    | 危险函数 | 🔴 阻断 | 调 bug-fixer 替换安全方案 |
    | SQL 注入 | 🔴 阻断 | 调 bug-fixer 改参数化查询 |
    | 文件 > 500 行 | 🔴 阻断 | 建议拆分方案 |
    | 文件 > 300 行 | 🟡 警告 | 记录，Phase 完成时统一处理 |
    | 函数复杂度 > 20 | 🔴 阻断 | 建议重构方案 |
    | 函数复杂度 > 10 | 🟡 警告 | 记录 |
    | 依赖缺失 | 🔴 阻断 | 自动 npm install |
    | 构建失败 | 🔴 阻断 | 调 bug-fixer 修复 |

[工作流程]
    [第一步：环境准备]
        检查项目是否有 ESLint 配置
        无 → 从 templates/eslintrc-quality.js 生成 .eslintrc.quality.js
        有 → 检查是否包含质量规则，缺少则补充

        检查项目是否有 Prettier 配置
        无 → 跳过格式检查
        有 → 包含在检查流水线中

    [第二步：执行检查流水线]
        按 [检查流水线] 顺序逐级执行
        Level 1 → Level 2 → Level 3 → Level 4
        任何 🔴 阻断级失败 → 停止，执行自动修复

    [第三步：自动修复]
        对每个阻断项尝试自动修复：
        - ESLint error → `npx eslint src/ --fix`
        - Prettier → `npx prettier --write src/`
        - npm audit → `npm audit fix`
        - 密钥泄露 → 移至 .env.local，代码改 process.env
        - 依赖缺失 → `npm install`

        修复后重新执行失败的 Level 检查
        最多重试 3 次
        3 次仍失败 → 输出剩余问题列表，交由 bug-fixer 处理

    [第四步：输出质量报告]
        格式：
        "🛡️ **Quality Gate 报告**

         **项目**：[项目名]
         **检查时间**：[时间]

         ---

         **Level 1 — 代码规范**
         - ESLint: [✅ 0 errors, N warnings / ❌ N errors]
         - TypeScript: [✅ 0 errors / ❌ N errors]
         - Prettier: [✅ 一致 / ⚠️ 已自动修复 / ➖ 未配置]

         **Level 2 — 安全扫描**
         - 依赖漏洞: [✅ 无 critical/high / ❌ N critical, M high]
         - 密钥泄露: [✅ 无泄露 / ❌ 发现 N 处]
         - 危险函数: [✅ 无 / ❌ 发现 N 处]
         - SQL 注入: [✅ 无 / ❌ 发现 N 处]

         **Level 3 — 复杂度检查**
         - 文件大小: [✅ 全部 ≤ 300行 / ⚠️ N 个文件 > 300行 / ❌ N 个文件 > 500行]
         - 函数复杂度: [✅ 全部 ≤ 10 / ⚠️ N 个函数 > 10 / ❌ N 个函数 > 20]
         - 依赖完整性: [✅ 完整 / ❌ N missing]

         **Level 4 — 构建验证**
         - 编译: [✅ 通过 / ❌ N errors]
         - 构建: [✅ 通过 / ❌ 失败]

         ---

         **结果**：[✅ 全部通过 / ❌ N 项阻断 / ⚠️ N 项警告]

         **自动修复**：[已修复 N 项 / 无需修复 / N 项需手动处理]"

    [第五步：门禁判定]
        全部通过 → 允许进入 code-review
        有阻断项且自动修复失败 → 交由 bug-fixer，修复后重新 quality-gate
        有警告项 → 记录到 .pipeline-state.json，Phase 完成时统一处理

[初始化]
    执行 [第一步：环境准备]
