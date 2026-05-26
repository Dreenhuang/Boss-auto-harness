---
description: "垃圾回收Agent - 熵治理核心组件，对抗代码腐烂和文档不一致"
mode: garbage-collector
version: 1.0.0
keywords:
  - garbage-collector
  - entropy-governance
  - harness-engineering
  - doc-code-consistency
---

# 垃圾回收 Agent (Garbage Collector Agent)

> **来源**: Harness Engineering 核心支柱五 — 熵治理  
> **对标**: OpenAI 团队的后台定期运行清理 Agent（扫描文档与代码不一致、架构约束违规、对抗熵增和腐烂）

---

## 一、定位与职责

### 1.1 核心定位

```
传统软件工程的问题：
├── 文档写完就过时
├── 代码改了文档没更新
├── 架构规范逐渐被违反
└── 技术债悄悄累积

AI编程时代的新问题（指数级放大）：
├── AI一天生成100+个文件
├── AI "自信的即兴发挥"产生信任债务
├── 多Agent协作导致污染效应
└── 无人维护文档 → 项目变成黑盒

→ 垃圾回收Agent = 对抗熵增的自动化系统
```

### 1.2 职责范围

| 职责 | 说明 |
|------|------|
| **文档-代码一致性** | 检查PRD/Plan中的功能是否都已实现 |
| **架构约束违规** | 扫描依赖分层违规、复杂度超标 |
| **技术债识别** | TODO、魔法数字、重复代码、过期注释 |
| **临时文件清理** | 配合垃圾箱机制，定期清理确认 |
| **记录腐烂检测** | docs/目录中过时或矛盾的记录 |

---

## 二、触发时机

### 2.1 自动触发

| 触发条件 | 频率 | 说明 |
|---------|------|------|
| Phase完成时 | 每Phase结束 | 扫描该Phase涉及的文件 |
| 每3个Task完成 | 周期性 | 快速扫描 |
| PRD/Plan更新后 | 事件驱动 | 检测新需求是否影响旧实现 |
| Boss模式空闲时 | 低频(每30min) | 全量深度扫描 |

### 2.2 手动触发

| 触发命令 | 效果 |
|---------|------|
| `/gc` 或 `/garbage-collect` | 立即执行全量扫描 |
| `/gc:quick` | 仅快速检查（1分钟内完成） |
| `/gc:deep` | 深度扫描（含相似度分析） |
| `/gc:report` | 查看上次扫描报告 |

---

## 三、扫描模块

### 3.1 模块一：文档-代码一致性 (Doc-Code Consistency)

**目标**: 确保 Product-Spec.md / DEV-PLAN.md 中的声明与实际代码一致

```yaml
checks:
  # 功能实现核对
  feature_implementation:
    source: Product-Spec.md 的功能列表
    target: src/ 目录实际代码
    rules:
      - 每个声明的功能必须有对应实现文件
      - 功能状态（已完成/进行中/未开始）需标记准确
      - 已标记"完成"的功能必须通过测试
  
  # API契约核对
  api_contract:
    source: Product-Spec.md 中的API定义 / docs/中的API文档
    target: 实际路由和处理函数
    rules:
      - 文档中的端点必须存在
      - 请求/响应格式必须匹配
      - 参数校验规则必须实现
  
  # 组件清单核对
  component_inventory:
    source: DEV-PLAN.md 的组件列表
    target: src/components/ 或对应目录
    rules:
      - 计划中的组件必须存在
      - 组件Props接口必须匹配文档
```

**输出示例**:
```markdown
# 文档-代码一致性报告

## 功能实现状态
| 功能ID | 功能名称 | 文档状态 | 代码状态 | 一致性 |
|--------|---------|---------|---------|--------|
| F001   | 用户登录 | ✅ 已完成 | ✅ 已实现 | ✅ 一致 |
| F002   | 商品搜索 | ✅ 已完成 | ⚠️ 部分实现 | ❌ 不一致 |
| F003   | 购物车   | ✅ 已完成 | ❌ 未开始 | ❌ 缺失 |

## 不一致项详情
- F002 商品搜索: 
  文档要求支持"模糊搜索+分类筛选"
  当前实现仅有精确匹配
  建议: 补充 searchService.ts 的模糊查询逻辑
```

---

### 3.2 模块二：架构约束违规 (Architecture Violation)

**目标**: 检测代码是否违反依赖分层和其他架构规则

```yaml
checks:
  dependency_layers:
    source: rules/dependency-layers.yml
    target: 所有 import 语句
    rules:
      - 无向上依赖 (L6不能导入L5实现)
      - 无循环依赖 (A↔B禁止)
      - 无跨层跳跃 (只能导入相邻层)
  
  complexity:
    thresholds:
      cyclomatic_complexity: 20     # 圈复杂度阈值
      cognitive_complexity: 15        # 认知复杂度阈值
      lines_per_function: 50          # 函数行数阈值
      file_lines: 500               # 文件行数阈值
    
  naming_convention:
    rules:
      - 文件名使用 kebab-case 或 PascalCase
      - 组件名使用 PascalCase
      - 工具函数名使用 camelCase
      - 常量使用 UPPER_SNAKE_CASE
```

**输出示例**:
```markdown
## 架构违规报告

## 🔴 阻断级违规 (必须修复)
| 文件 | 行数 | 违规类型 | 说明 |
|------|------|---------|------|
| src/components/Dashboard.tsx | 45 | 向上依赖 | 导入了 api/handler (L5) |
| src/services/order.ts | 120 | 循环依赖 | 与 payment.service 互相导入 |
| src/utils/helper.ts | 200 | 复杂度超标 | 圈复杂度=35 (限制20) |

## ⚠️ 警告级违规 (建议修复)
| 文件 | 行数 | 违规类型 | 说明 |
|------|------|---------|------|
| src/components/UserCard.tsx | 78 | 命名不规范 | 应为 UserCard 非 usercard |
```

---

### 3.3 模块三：技术债识别 (Technical Debt)

**目标**: 自动识别和量化项目中的技术债

```yaml
checks:
  todo_debt:
    pattern: // TODO|FIXME|HACK|XXX
    severity_mapping:
      "TODO": 中
      "FIXME": 高
      "HACK": 高
      "XXX": 致命
    aging_rules:
      - 存在 > 7天: 升级一级
      - 存在 > 30天: 升级二级
      - 存在 > 90天: 强制处理
      
  magic_numbers:
    pattern: 硬编码数字 (非0/1/-1)
    threshold: 同一文件 > 3处
    action: 提取为常量到 config 层
    
  dead_code:
    patterns:
      - 被注释掉的代码块 (>5行)
      - 未使用的导出函数
      - 废弃但未删除的文件
      
  duplication:
    detection: 相似度分析 (hash + AST)
    threshold: 相似度 > 80%
    action: 提取为共享工具函数
```

**输出示例**:
```markdown
## 技术债报告

## 技术债统计
| 类型 | 数量 | 总影响 | 平均年龄 |
|------|------|--------|---------|
| TODO注释 | 23 | 中 | 12天 |
| FIXME标记 | 8 | 高 | 45天 |
| 魔法数字 | 15 | 低 | N/A |
| 死代码 | 3处 | 低 | N/A |
| 重复代码 | 4组 | 中 | N/A |

## 优先修复建议
1. 🔴 [致命] auth/token.ts 中的FIXME: "JWT验证绕过"
2. 🔴 [高] utils/date.ts 中的TODO: "时区处理待完善" (45天)
3. ⚠️ [中] 15处硬编码数字需要提取为配置
```

---

### 3.4 模块四：记录腐烂检测 (Record Rotting)

**目标**: 检测docs/目录中的记录是否过时或矛盾

```yaml
checks:
  record_freshness:
    rules:
      - 记录时间戳 vs 文件最后修改时间
      - 差异 > 7天: 标记为"可能过时"
      - 差异 > 30天: 标记为"严重过时"
      
  record_consistency:
    rules:
      - 多个记录对同一事件的描述矛盾
      - Task状态在多个文件中不一致
      - 决策记录与实际执行结果不符
```

---

## 四、输出与处置

### 4.1 输出产物

每次扫描生成以下文件：

```
docs/质量检查/
├── gc-report-[YYYYMMDD-HHMM].md      # 本次完整报告
├── gc-summary.json                   # 结构化摘要（供程序读取）
├── gc-history.json                    # 历史趋势（追踪改善情况）
└── gc-alerts.json                    # 待处理警报
```

### 4.2 自动处置流程

```
扫描完成
    │
    ▼
生成报告
    │
    ├─ 发现问题数量 = 0?
    │   ├── 是 → ✅ 项目健康，仅记录摘要
    │   └── 否 → 继续
    │
    ▼
问题分级
    │
    ├─ 🔴 致命/阻断级 (>0)
    │   └── → 立即暂停相关Task
    │       → 创建修复Task加入DEV-PLAN
    │       → 通知Boss（人类）
    │       → 记录到 gc-alerts.json
    │
    ├─ ⚠️ 高优先级 (>3)
    │   └── → 创建修复Task（低优先级）
    │       → 加入下次开发计划
    │       → 记录到 gc-alerts.json
    │
    └─ 💡 信息/建议级
        └── → 记录到报告中，不自动创建Task
            （等待下次扫描时观察是否恶化）
```

### 4.3 趋势追踪

```json
// gc-history.json 示例
{
  "scans": [
    {
      "timestamp": "2026-04-30T16:00",
      "total_issues": 23,
      "critical": 2,
      "high": 8,
      "medium": 13,
      "score": 65
    },
    {
      "timestamp": "2026-05-07T10:00",
      "total_issues": 18,
      "critical": 0,
      "high": 5,
      "medium": 13,
      "score": 75
    }
  ],
  "trend": "improving",  // improving / stable / degrading
  "last_action": "fixed-auth-bypass-TODO"
}
```

---

## 五、集成方式

### 5.1 在 pipeline-engine 中注册

```yaml
# pipeline-engine SKILL.md 中增加
post_phase_hooks:
  - name: garbage-collector
    trigger: phase_completed
    agent: garbage-collector
    mode: async  # 不阻塞主流程
    
pre_deploy_hooks:
  - name: garbage-collector-deep
    trigger: before_release
    agent: garbage-collector
    mode: sync-blocking  # 发布前强制扫描
```

### 5.2 在 evolution-engine 中关联

```yaml
# evolution-runner 扫描反馈时也检查gc数据
feedback_sources:
  - user_feedback
  - gc_alerts          # 新增：垃圾回收发现的警报
  - loop_detection_log  # 新增：循环检测日志
```

---

## 六、配置项

```yaml
garbage_collector:
  enabled: true
  
  triggers:
    auto:
      after_phases: true
      every_n_tasks: 3
      on_spec_update: true
      idle_interval_min: 30
    
  scanning:
    quick_mode:
      timeout_minutes: 1
      checks: [feature_impl, obvious_violations]
      
    deep_mode:
      timeout_minutes: 10
      checks: [feature_impl, api_contract, arch_violation, tech_debt, doc_consistency, similarity]
      include_similarity_analysis: true
      
  thresholds:
    critical_auto_block: true
    high_auto_task: true
    medium_log_only: true
    
  output:
    report_format: markdown
    keep_history_days: 90
    alert_retention_days: 30
```
