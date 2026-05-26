---
description: "文档-代码一致性检查器 - 确保项目文档与实际代码保持同步"
mode: doc-code-consistency-checker
version: 2.0.0
keywords:
  - doc-code-consistency
  - documentation-sync
  - spec-validation
  - api-contract-check
---

# 文档-代码一致性检查器 (Doc-Code Consistency Checker)

> **版本**: 2.0.0  
> **来源**: Harness Engineering 熵治理支柱 + 软件工程最佳实践  
> **集成**: garbage-collector Agent (模块一) + quality-gate Skill + pipeline-engine

---

## 一、定位与价值

### 1.1 核心问题

```
❌ AI编程时代的文档腐烂问题：

场景1：PRD说要做"用户搜索功能"
├── PRD中明确写了：支持模糊搜索 + 分类筛选 + 价格排序
├── 实际代码只实现了：精确匹配
└── 结果：功能不完整，测试通过但需求未满足 ✗

场景2：API文档过时
├── 文档写：POST /api/users 返回 {id, name, email}
├── 实际返回：{id, name, email, phone, createdAt}
└── 前端开发者依赖文档，遗漏字段处理 ✗

场景3：组件Props文档错误
├── 注释写：onClick: (id: string) => void
├── 实际类型：onClick: (id: number) => void
└── TypeScript编译通过但运行时报错 ✗

✅ 一致性检查器的价值：

自动化检测以上所有问题 → 确保文档 = 代码的真实反映
```

### 1.2 检查范围矩阵

| 文档类型 | 检查目标 | 检查方式 | 严重程度 |
|---------|---------|---------|---------|
| **Product-Spec.md** | 功能实现完整性 | 功能声明 vs 代码存在性 | 🔴 致命 |
| **DEV-PLAN.md** | 组件/任务完成度 | 计划项 vs 实际文件 | 🔴 高 |
| **API文档** | 接口契约匹配 | 文档定义 vs 路由/Handler | 🔴 高 |
| **JSDoc/TSDoc** | 类型签名准确性 | 注释类型 vs 实际类型 | 🟡 中 |
| **README.md** | 安装/使用说明 | 说明步骤 vs 实际配置 | 🟡 中 |
| **代码注释** | 逻辑描述正确性 | 注释内容 vs 代码行为 | 🟢 低 |

---

## 二、检查规则引擎

### 2.1 规则一：产品规格一致性 (Spec Compliance)

```yaml
rule_id: "SPEC-001"
name: "product_spec_compliance"
severity: "critical"
description: "检查 Product-Spec.md 中声明的所有功能是否都已实现"

source_document: "Product-Spec.md"
target_codebase: "src/"

extraction_strategy:
  
  # 从PRD提取功能列表
  feature_extraction:
    patterns:
      - regex: "(?:^|\n)#{1,3}\s*(.*?)(?:\n|$)"
        context: "功能标题"
      - regex: "-\s*\[.\]\s*(.*?)(?:\n|$)"
        context: "功能清单项"
      - regex: "`(.*?)`" 
        context: "技术术语/API名称"
        
    normalization:
      - 统一小写
      - 移除特殊字符
      - 提取关键词
      
  # 在代码库中验证实现
  verification_methods:
    
    file_existence:
      description: "检查功能对应的文件是否存在"
      strategy:
        - 将功能名转换为可能的文件名模式
        - 使用 glob 匹配 src/ 目录
        - 示例: "用户登录" → ["*login*", "*auth*", "*user*"]
        
    implementation_evidence:
      description: "检查是否有实质性的实现代码"
      indicators:
        - 函数/方法定义（>10行有效代码）
        - 组件渲染逻辑
        - API路由注册
        - 测试用例覆盖
        
    test_coverage:
      description: "检查是否有对应测试"
      requirement:
        - 标记为"已完成"的功能必须有至少1个测试
        - 测试文件名应包含功能关键词
        
output_format:
  consistent_items:
    - feature_name: "功能名称"
      status: "✅ 已实现"
      evidence: "src/features/user-login.tsx (156行)"
      test_coverage: "src/__tests__/login.test.tsx"
      
  inconsistent_items:
    - feature_name: "功能名称"
      status: "❌ 未实现 / ⚠️ 部分实现"
      expected: "PRD中的完整描述"
      actual: "当前实现的简述"
      gap_analysis: "差距详情"
      suggested_fix: "修复建议"
```

**输出示例**:
```markdown
# 产品规格一致性报告

## 📊 总览
- **总功能数**: 12
- **完全一致**: 8 (66.7%)
- **部分实现**: 3 (25.0%)
- **未实现**: 1 (8.3%)
- **一致性评分**: 78/100

## ✅ 完全一致的功能

| # | 功能名称 | 实现位置 | 测试覆盖 |
|---|---------|---------|---------|
| 1 | 用户注册 | `src/auth/register.tsx` | ✅ register.test.tsx |
| 2 | 用户登录 | `src/auth/login.tsx` | ✅ login.test.tsx |
| ... | ... | ... | ... |

## ⚠️ 部分实现的功能

| # | 功能名称 | PRD要求 | 当前实现 | 差距 |
|---|---------|---------|---------|------|
| 4 | 商品搜索 | 支持模糊搜索+分类筛选+价格排序 | 仅精确匹配 | ❌ 缺少模糊搜索和筛选 |
| 7 | 购物车 | 数量修改+删除+清空 | 数量修改+删除 | ⚠️ 缺少清空功能 |

## ❌ 未实现的功能

| # | 功能名称 | PRD描述 | 建议 |
|---|---------|---------|------|
| 10 | 消息通知 | 站内信+邮件通知+推送通知 | 创建 `src/notifications/` 模块
```

---

### 2.2 规则二：开发计划追踪 (Plan Tracking)

```yaml
rule_id: "PLAN-001"
name: "dev_plan_tracking"
severity: "high"
description: "追踪 DEV-PLAN.md 中的任务完成状态"

source_document: "DEV-PLAN.md"
tracking_dimension:
  
  phase_completion:
    check: "Phase 的 Task 是否全部标记为完成"
    evidence:
      - 所有 Task 对应的代码文件存在
      - Quality Gate 通过记录
      - Code Review 通过记录
      
  task_status_sync:
    check: "Task 状态是否与实际一致"
    status_mapping:
      "pending": "无对应代码文件"
      "in_progress": "有文件但不完整（<50%预期行数）"
      "completed": "文件完整且有测试"
      "blocked": "依赖的Task未完成"
      
  deliverable_verification:
    check: "每个 Task 的交付物是否存在"
    deliverable_types:
      - source_code: "源代码文件"
      - tests: "测试文件"
      - documentation: "相关文档更新"
      
output:
  plan_progress_report:
    format: markdown
    sections:
      - overall_progress: "总体进度百分比"
      - phase_details: "各Phase详情"
      - blocked_tasks: "被阻塞的任务"
      - at_risk_tasks: "有风险的Task（长时间in_progress）"
      - milestone_status: "里程碑达成情况"
```

---

### 2.3 规则三：API契约验证 (API Contract Validation)

```yaml
rule_id: "API-001"
name: "api_contract_validation"
severity: "critical"
description: "验证API文档与实际路由/Handler的一致性"

source_documents:
  - "docs/api/"           # API文档目录
  - "Product-Spec.md"     # PRD中的API定义
  - "src/**/route.ts"     # 路由定义文件中的注释
  
validation_checks:
  
  endpoint_existence:
    description: "文档中定义的端点必须存在"
    check:
      - 从文档提取所有端点路径 (GET/POST/PUT/DELETE /path)
      - 在代码中搜索路由注册
      - 报告: 存在于文档但不存在于代码
      
  request_schema_match:
    description: "请求参数定义必须匹配"
    check:
      - 文档定义的请求体字段
      - Handler 中的参数解构或验证
      - Zod/Joi/Yup schema 定义
      - 不匹配: 字段缺失、类型不同、必填vs可选
      
  response_schema_match:
    description: "响应格式必须匹配"
    check:
      - 文档定义的响应结构
      - Handler 实际返回的对象
      - TypeScript 类型定义
      - 不匹配: 多余字段、缺少字段、类型差异
      
  status_code_consistency:
    description: "HTTP状态码使用一致"
    check:
      - 文档说明的成功/失败状态码
      - 代码实际返回的状态码
      - RESTful 最佳实践合规性
      
  authentication_requirements:
    description: "认证要求一致"
    check:
      - 文档标注的需要认证的端点
      - 代码中的中间件或守卫
      - 未保护的端点应标注为公开
      
error_detection:
  false_positive_handling:
    - 动态路由参数 (/users/:id) 应正常匹配
    - 版本前缀 (/api/v1/) 应考虑
    - 中间件包装的路由需要深度分析
    
output_example:
  api_contract_report:
    endpoints_checked: 25
    fully_matched: 20
    partial_match: 3
    missing_in_code: 2
    
    issues:
      - endpoint: "POST /api/products"
        issue: "响应缺少 'createdAt' 字段"
        doc_says: "{ id, name, price, createdAt }"
        code_returns: "{ id, name, price }"
        severity: "high"
        fix: "在 Product 模型的 toJSON 中添加 createdAt"
        
      - endpoint: "GET /api/users/:id/orders"
        issue: "端点不存在于代码中"
        location_in_doc: "docs/api/users.md#orders"
        suggestion: "创建 GET /api/users/[id]/orders 路由"
```

---

### 2.4 规则四：类型文档准确性 (Type Documentation Accuracy)

```yaml
rule_id: "TYPE-001"
name: "type_doc_accuracy"
severity: "medium"
description: "检查 JSDoc/TSDoc 注释中的类型信息是否准确"

scan_targets:
  - "**/*.ts"
  - "**/*.tsx"
  - "*.js" (如果项目包含)

checks:
  
  param_type_match:
    description: "@param 类型与实际参数类型一致"
    example:
      # 文档写
      "@param {string} userId - 用户ID"
      # 实际是
      "function getUser(userId: number)"
    action: "警告 + 建议修正注释"
    
  return_type_match:
    description: "@returns 类型与实际返回类型一致"
    example:
      # 文档写
      "@returns {User} 用户对象"
      # 实际返回
      "Promise<User | null>"
    action: "警告 + 建议补充 Promise 和 nullable"
    
  generic_type_accuracy:
    description: "泛型参数文档准确"
    example:
      # 文档写
      "@template T"
      # 但函数没有泛型参数
    action: "移除错误的泛型文档"
    
  deprecated_marker:
    description: "@deprecated 标记准确"
    checks:
      - 标记为 deprecated 的不应被其他代码导入使用
      - 标记为 deprecated 的应有 @see 替代方案
      
  enum_member_docs:
    description: "枚举成员有完整文档"
    requirement:
      - 公开枚举的每个成员应有说明
      - 成员值的意义应清晰
      
auto_fix_capabilities:
  can_auto_fix:
    - 从 TypeScript 类型推断并更新 JSDoc
    - 补充缺失的 @param 或 @returns
    - 移除不准确的类型声明
    
  needs_manual_review:
    - 复杂的联合类型文档化
    - 泛型约束的说明
    - 回调函数签名的文档
```

---

### 2.5 规则五：README 准确性 (README Accuracy)

```yaml
rule_id: "README-001"
name: "readme_accuracy"
severity: "medium"
description: "验证 README.md 中的安装和使用说明是否准确"

checks:
  
  installation_steps:
    description: "安装步骤可执行"
    validation:
      - package.json 中的 dependencies 可安装
      - scripts 中的命令存在
      - 环境变量在 .env.example 中列出
      
  quick_start:
    description: "快速开始指南可运行"
    validation:
      - 启动命令正确
      - 默认端口配置正确
      - 初始页面路径正确
      
  configuration:
    description: "配置说明准确"
    validation:
      - 环境变量文档完整
      - 配置文件示例存在
      - 默认值说明正确
      
  badge_links:
    description: "徽章链接有效"
    validation:
      - 版本号与 package.json 一致
      - 构建状态链接可达
      - 许可证标识正确
```

---

## 三、执行引擎

### 3.1 扫描模式

```yaml
execution_modes:
  
  quick_scan:
    timeout_seconds: 30
    checks:
      - SPEC-001 (仅检查功能清单)
      - PLAN-001 (仅检查Phase状态)
    output: "摘要级报告"
    
  standard_scan:
    timeout_seconds: 120
    checks: all_basic_rules
    output: "完整报告 + 问题清单"
    
  deep_scan:
    timeout_seconds: 300
    checks: all_rules + advanced_analysis
    advanced:
      - 语义相似度分析
      - 跨文件引用追踪
      - 历史变更对比
    output: "完整报告 + 修复建议 + 变更脚本"
    
  targeted_scan:
    timeout_seconds: 60
    trigger: "/doc-check:<target>"
    examples:
      - "/doc-check:spec"       # 只检查PRD
      - "/doc-check:api"        # 只检查API
      - "/doc-check:file=xxx"   # 检查特定文件的一致性
```

### 3.2 执行流程

```
Step 1: 准备阶段
├── 识别项目中存在的文档类型
├── 加载对应的检查规则
├── 建立文档-代码映射索引
└── 初始化结果收集器

Step 2: 执行检查
├── 并行执行所有启用的规则
├── 收集每个规则的发现
├── 去重和关联分析
└── 生成原始发现列表

Step 3: 分析阶段
├── 计算一致性评分
├── 分类问题（致命/高/中/低）
├── 识别问题模式（如：某类文档普遍不准确）
└── 生成修复建议

Step 4: 报告生成
├── 生成人类可读的报告 (Markdown)
├── 生成机器可读的数据 (JSON)
├── 生成趋势数据（如果有历史）
└── 可选：生成修复补丁

Step 5: 后置动作
├── 保存报告到 docs/质量检查/
├── 更新一致性历史数据
├── 如果集成CI：设置退出码
└── 通知相关人员（如有阻塞问题）
```

---

## 四、报告模板

### 4.1 主报告模板

```markdown
# 📋 文档-代码一致性检查报告

**项目**: {project_name}  
**扫描时间**: {timestamp}  
**扫描模式**: {mode}  
**扫描版本**: {scanner_version}

---

## 📊 执行摘要

| 指标 | 值 |
|------|-----|
| **总检查项** | {total_checks} |
| **通过项** | {passed} ({passed_percent}%) |
| **问题项** | {issues} ({issue_percent}%) |
| **一致性评分** | {score}/100 ⭐{stars} |
| **耗时** | {duration} |

### 评分标准
- **90-100**: 🟢 优秀 - 文档与代码高度一致
- **70-89**: 🉑 良好 - 少量不一致，不影响使用
- **50-69**: ⚠️ 一般 - 部分重要文档需更新
- **<50**: 🔴 较差 - 文档严重滞后，急需整理

---

## 🔍 发现的问题

### 🔴 致命级 (必须立即修复)

| ID | 规则 | 位置 | 问题描述 | 影响 |
|----|------|------|---------|------|
| C001 | SPEC-001 | Product-Spec.md#F005 | "支付功能"未实现 | 阻塞发布 |

### 🟠 高优先级 (本周修复)

| ID | 规则 | 位置 | 问题描述 | 建议 |
|----|------|------|---------|------|
| H001 | API-001 | docs/api/users.md | 响应缺少phone字段 | 更新文档或添加字段 |

### 🟡 中优先级 (本迭代修复)

| ID | 规则 | 位置 | 问题描述 |
|----|------|------|---------|
| M001 | TYPE-001 | src/utils/format.ts | @param类型不准确 |

### 🢚 低优先级 (有空修复)

| ID | 规则 | 位置 | 问题描述 |
|----|------|------|---------|
| L001 | README-001 | README.md | 版本号过期 |

---

## 📈 详细分析

### 产品规格一致性
{spec_section}

### 开发计划追踪
{plan_section}

### API契约验证
{api_section}

### 其他检查
{other_sections}

---

## 🛠️ 修复建议

### 自动可修复 (3项)
- [ ] [Auto Fix] L001: 更新README版本号
- [ ] [Auto Fix] M002: 修正 JSDoc 类型
- [ ] [Auto Fix] L003: 补充缺失的 @param

### 需要手动修复 (2项)
- [ ] H001: 更新API文档或调整代码
- [ ] C001: 实现缺失的支付功能

### 需要讨论 (1项)
- [ ] ?001: PRD中的"消息推送"是否还做？

---

## 📊 趋势图表

```json
{
  "dates": ["04-24", "04-25", "04-26", "04-27", "04-28", "04-29", "04-30"],
  "scores": [65, 68, 72, 70, 75, 78, {current_score}],
  "issues": [15, 13, 11, 12, 9, 8, {current_issues}]
}
```

---

*报告由 Doc-Code Consistency Checker 自动生成*
```

### 4.2 JSON 数据格式

```json
{
  "report_metadata": {
    "project": "my-project",
    "timestamp": "2026-04-30T14:30:00Z",
    "scanner_version": "2.0.0",
    "mode": "standard",
    "duration_seconds": 45
  },
  
  "summary": {
    "total_checks": 48,
    "passed": 40,
    "failed": 8,
    "score": 83,
    "grade": "B"
  },
  
  "findings": [
    {
      "id": "C001",
      "rule_id": "SPEC-001",
      "severity": "critical",
      "category": "spec_compliance",
      "location": {
        "document": "Product-Spec.md",
        "line": 45,
        "section": "功能列表"
      },
      "description": "声明的'支付功能'未在代码中找到实现",
      "evidence": {
        "document_claim": "支持支付宝/微信支付",
        "code_search_result": "无 payment 相关文件"
      },
      "impact": "blocking_release",
      "suggested_fix": {
        "type": "implement_feature",
        "description": "创建 src/payments/ 模块",
        "estimated_effort": "4h"
      }
    }
  ],
  
  "trend_data": {
    "current_score": 83,
    "previous_score": 78,
    "change": "+5",
    "trend": "improving"
  }
}
```

---

## 五、集成配置

### 5.1 quality-gate 集成

```yaml
# quality-gate/SKILL.md 中添加
doc_code_check:
  enabled: true
  
  threshold:
    min_score: 70          # 最低70分才允许合并
    max_critical: 0        # 不允许致命问题
    max_high: 2            # 最多2个高级问题
    
  on_failure:
    block_merge: true
    generate_report: true
    suggest_fixes: true
    
  exceptions:
    allow_list:
      - "docs/draft/*"     # 草稿文档不检查
      - "*.md.bak"         # 备份文件不检查
```

### 5.2 pipeline-engine 集成

```yaml
# pipeline-engine SKILL.md 中添加
hooks:
  pre_phase:
    - name: doc-code-quick-check
      trigger: before_each_phase
      agent: doc-code-checker
      mode: quick
      blocking: false       # 不阻塞，仅报告
      
  post_phase:
    - name: doc-code-full-check
      trigger: after_each_phase
      agent: doc-code-checker
      mode: standard
      blocking: false
      
  pre_deploy:
    - name: doc-code-deep-check
      trigger: before_deploy
      agent: doc-code-checker
      mode: deep
      blocking: true        # 发布前必须通过！
```

### 5.3 Git Hook 集成

```bash
#!/bin/bash
# pre-commit-doc-check.sh

# 运行快速文档检查
RESULT=$(npx doc-code-checker --mode quick --format json)

# 解析结果
SCORE=$(echo $RESULT | jq '.summary.score')
CRITICAL=$(echo $RESULT | jq '.findings | map(select(.severity=="critical")) | length')

if [[ $SCORE -lt 70 ]] || [[ $CRITICAL -gt 0 ]]; then
  echo "❌ 文档一致性检查未通过!"
  echo "评分: $SCORE/100"
  echo "致命问题: $CRITICAL 个"
  echo ""
  echo "详细报告:"
  echo $RESULT | jq '.findings[]'
  exit 1
fi

echo "✅ 文档一致性检查通过 (评分: $SCORE/100)"
exit 0
```

---

## 六、使用指南

### 6.1 手动触发命令

```bash
# 快速检查（30秒内完成）
/doc-check:quick

# 标准检查（默认）
/doc-check

# 深度检查（含语义分析）
/doc-check:deep

# 只检查特定规则
/doc-check:spec          # 只检查PRD
/doc-check:api           # 只检查API文档
/doc-check:type           # 只检查类型注释
/doc-check:readme         # 只检查README

# 检查特定文件
/doc-check:file=src/components/UserCard.tsx

# 导出报告
/doc-check:export=json    # JSON格式
/doc-check:export=md      # Markdown格式
/doc-check:export=html    # HTML格式（可视化）
```

### 6.2 定期自动执行

```yaml
# 推荐的定期执行策略
schedule:
  
  on_every_commit:
    mode: quick
    scope: "changed_files_only"
    
  on_pr_created:
    mode: standard
    scope: "full_project"
    
  daily_at_midnight:
    mode: deep
    scope: "full_project"
    notify_on_issues: true
    
  weekly_report:
    mode: deep
    scope: "full_project"
    generate_trend_report: true
    send_to_team_channel: true
```

---

## 七、最佳实践

### 7.1 维护文档一致性的建议

```yaml
best_practices:
  
  writing_code:
    - "先更新文档再改代码（或同时更新）"
    - "每完成一个功能，检查对应的PRD条目"
    - "新增API时立即更新API文档"
    - "修改接口时同步更新调用方文档"
    
  code_review:
    - "Review时对照PRD检查功能完整性"
    - "关注新代码的注释是否准确"
    - "确保README中的命令仍可执行"
    
  team_process:
    - "每周安排15分钟清理文档债务"
    - "将文档一致性纳入Definition of Done"
    - "重大重构后强制运行deep scan"
```

### 7.2 常见问题解决

```yaml
faq:
  
  q: "检查太慢了怎么办？"
  a: "使用quick模式只检查关键规则，或在CI中只检查变更文件"
  
  q: "误报太多怎么办？"
  a: "配置exclude_patterns忽略特定文件，或调整规则灵敏度"
  
  q: "如何处理遗留项目的低分？"
  a: "设置baseline分数，只关注新增的不一致，渐进式改善"
  
  q: "文档应该多详细？"
  a: "平衡原则：足够让新人理解，不必过度详细。重点在准确性而非完备性"
```

---

## 八、扩展性设计

### 8.1 自定义规则

```typescript
// 用户可以编写自定义检查规则
import { DocCodeRule } from '@boss-harness/doc-code-checker';

const customRule: DocCodeRule = {
  id: 'CUSTOM-001',
  name: 'i18n_key_exists',
  severity: 'medium',
  description: '检查硬编码字符串是否有对应的i18n key',
  
  async check(context) {
    const hardcodedStrings = await findHardcodedStrings(context.files);
    const i18nKeys = await getI18nKeys();
    
    const missingKeys = hardcodedStrings.filter(
      str => !i18nKeys.has(str)
    );
    
    return missingKeys.map(str => ({
      location: str.file,
      description: `硬编码字符串 "${str.value}" 缺少i18n key`,
      suggestedFix: `添加 i18n.t('${str.key}')`
    }));
  }
};
```

### 8.2 与其他工具集成

```yaml
integrations:
  
  ide_plugins:
    vscode:
      - "问题面板显示不一致项"
      - "保存文件时自动检查当前文件"
      - "代码提示显示相关文档片段"
      
  ci_cd:
    github_actions:
      - "PR注释自动添加检查结果"
      - "Status Check阻止不合格的合并"
    gitlab_ci:
      - "Merge Request Widget显示评分"
      - "质量门禁集成"
      
  monitoring:
    metrics_export:
      - "consistency_score_gauge"
      - "issues_by_severity_counter"
      - "scan_duration_histogram"
```

---

*文档版本: 2.0.0 | 最后更新: 2026-04-30 | 维护者: Boss-auto-harness Team*
