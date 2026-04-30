---
description: "多Agent协作编排器 - 根据项目特征自动选择最优Agent组合，实现智能任务分配与动态调度"
mode: orchestrator
version: 2.0.0
keywords:
  - agent-orchestrator
  - 多Agent协作
  - 智能调度
  - 任务分配
---

# Agent Orchestrator - 多Agent协作编排系统

> **版本**: 2.0.0
> **核心定位**: Boss-harness 的"大脑"，负责分析项目特征、选择最优Agent组合、协调多Agent协同工作
> **设计哲学**: "没有万能的Agent，只有最优的组合"

---

## 一、Agent 能力模型

### 1.1 Agent 注册表

每个Agent在系统中注册时必须声明以下能力属性：

```yaml
# Agent能力声明模板
agent_id: code-reviewer                    # 唯一标识
display_name: "代码审查专家"               # 显示名称
version: "1.0.0"                           # 版本号
color: "#ef4444"                          # 标识颜色（用于日志可视化）

# 核心能力域（最多3个）
core_domains:
  - code_quality                            # 代码质量
  - security_audit                          # 安全审计
  - spec_compliance                         # 规范符合性

# 技能清单
skills:
  - id: static_analysis                     # 静态分析
    level: expert                           # 熟练度：expert/advanced/intermediate/beginner
    tools: [eslint, tsc, grep]              # 使用工具
  - id: security_scan                       # 安全扫描
    level: advanced
    tools: [grep, npm-audit]
  - id: spec_matching                      # Spec匹配验证
    level: expert
    tools: [read, search]

# 适用场景匹配规则
match_rules:
  # 必须满足的条件
  required:
    - has_code: true                       # 有代码文件
    - quality_gate_passed: true             # Quality Gate已通过
  
  # 加权评分条件（影响优先级，非必须）
  weighted:
    - condition: is_typescript_project      # TypeScript项目
      weight: 0.8                          # 权重系数
    - condition: has_complex_logic          # 有复杂业务逻辑
      weight: 0.6
    - condition: is_security_sensitive      # 安全敏感项目
      weight: 0.9

# 资源消耗评估
resource_cost:
  time_per_task: "5-15min"                 # 单任务耗时
  token_per_task: "~5000"                  # Token消耗
  context_window: "medium"                 # 上下文窗口需求：small/medium/large/xlarge

# 并发限制
concurrency:
  max_parallel: 1                         # 最大并行实例数
  exclusive_resources: []                   # 独占资源列表

# 依赖关系
dependencies:                              # 前置依赖
  - skill: quality-gate                    # 依赖前置Skill
    reason: "必须在Quality Gate通过后执行"
```

### 1.2 已注册Agent能力矩阵

| Agent ID | 核心域 | 关键技能 | 适用场景 | 耗时 | Token |
|----------|--------|---------|---------|------|-------|
| **implementer** | 编码实现 | 开发、重构、集成 | 新功能开发、Bug修复 | 15-60min | ~15000 |
| **code-reviewer** | 质量审查 | 静态分析、安全扫描、Spec匹配 | 代码评审、合规检查 | 5-15min | ~5000 |
| **feedback-observer** | 反馈记录 | 反馈分类、经验提取 | 用户反馈收集 | 2-5min | ~2000 |
| **evolution-runner** | 进化优化 | Feedback扫描、建议生成 | Skill迭代优化 | 10-20min | ~8000 |

---

## 二、项目情况分析模块

### 2.1 分析维度

系统自动检测并量化以下项目特征：

#### A. 项目类型特征 (Project Type)

```python
# 项目类型检测逻辑
PROJECT_TYPE_RULES = {
    "web_frontend": {
        detectors: ["package.json", "*.tsx", "*.jsx", "vite.config.*"],
        weight_signals: ["react", "vue", "next", "svelte"]
    },
    "web_fullstack": {
        detectors: ["package.json", "app/api/", "app/page.*"],
        weight_signals: ["next", "nuxt", "remix", "express+react"]
    },
    "desktop_electron": {
        detectors: ["package.json", "electron/", "main.js"],
        weight_signals: ["electron", "tauri"]
    },
    "cli_tool": {
        detectors: ["package.json", "bin/", "src/index.ts", "commander"],
        weight_signals: ["commander", "yargs", "oclif"]
    },
    "library_package": {
        detectors: ["package.json", "src/index.ts", "tsconfig.json"],
        weight_signals: ["lib", "package", "sdk"]
    }
}
```

#### B. 项目规模特征 (Scale)

| 维度 | 小型 (S) | 中型 (M) | 大型 (L) | 超大型 (XL) |
|------|---------|---------|---------|------------|
| 文件数 | < 20 | 20-100 | 100-500 | > 500 |
| 代码行数 | < 3000 | 3K-30K | 30K-150K | > 150K |
| 组件数 | < 10 | 10-50 | 50-200 | > 200 |
| API端点数 | 0 | 1-10 | 11-50 | > 50 |
| 数据表数 | 0 | 1-5 | 6-20 | > 20 |

#### C. 复杂度特征 (Complexity)

```yaml
COMPLEXITY_INDICATORS:
  # 技术复杂度
  technical:
    - name: 异步流复杂度
      signals: [Promise链长度, async/await嵌套, 事件监听器数量]
      levels: [简单(线性), 中等(分支), 复杂(并行+状态)]
    
    - name: 状态管理复杂度
      signals: [Store数量, Reducer复杂度, Context嵌套深度]
      levels: [无状态, 局部状态, 全局状态, 分布式状态]
    
    - name: 类型系统复杂度
      signals: [泛型使用频率, 类型联合数量, 条件类型深度]
      levels: [基础类型, 泛型约束, 高级类型体操]

  # 业务复杂度
  business:
    - name: 权限模型复杂度
      signals: [角色数量, 权限粒度, RBAC/ABAC混合]
      levels: [无权限, 简单角色, RBAC, ABAC+动态策略]
    
    - name: 数据流复杂度
      signals: [数据源数量, ETL步骤, 实时性要求]
      levels: [单源CRUD, 多源聚合, 实时同步, 流处理]
    
    - name: 集成复杂度
      signals: [外部API数量, 第三方服务, 协议适配]
      levels: [无集成, 少量API, 大量集成, 复杂B2B]

  # 工程复杂度
  engineering:
    - name: 测试覆盖难度
      signals: [Mock复杂度, 测试环境依赖, E2E场景数]
      levels: [易测试, 需要Mock, 需要Stub, 集成测试重)
    
    - name: 部署复杂度
      signals: [环境数量, 配置管理, CI/CD流水线]
      levels: [单环境, 多环境, 容器化, K8s集群]
    
    - name: 团队协作复杂度
      signals: [并发开发人数, 分支策略, Code Review流程]
      levels: [单人, 小团队(2-5), 中团队(6-15), 大团队(>15)]
```

#### D. 当前阶段特征 (Phase)

| 阶段 | 特征信号 | 典型需求 |
|------|---------|---------|
| **需求阶段** | 无代码 / 只有Spec文档 | PM能力、市场调研、竞品分析 |
| **设计阶段** | 有Spec + Design Brief | UI/UX设计、原型制作 |
| **初始化阶段** | 有Plan无代码 | 项目搭建、骨架构建、依赖安装 |
| **功能开发中** | 有代码 + 进行中的Phase | 编码实现、单元测试、Code Review |
| **集成测试中** | 所有Phase完成 | 集成测试、E2E测试、性能测试 |
| **发布准备中** | 测试全部通过 | 构建、打包、部署配置 |
| **运维阶段** | 已部署上线 | 监控、告警、日志分析 |
| **迭代维护中** | 已上线 + 变更需求 | Bug修复、功能增强、技术债偿还 |

### 2.2 项目画像生成

系统自动生成结构化的项目画像：

```markdown
# 项目画像报告

【生成时间】2026-04-30 16:30
【AI模型】GLM-5V-Turbo
【IDE】Trae IDE

## 基础信息
- **项目名称**: [从DEV-PLAN或目录名提取]
- **项目类型**: Web全栈 (Next.js + TypeScript)
- **技术栈**: Next.js 14 + React 18 + Tailwind 4 + Prisma
- **当前阶段**: Phase 2 开发中

## 规模评估
| 维度 | 数值 | 等级 | 说明 |
|------|------|------|------|
| 文件总数 | 47 | M | 中型项目 |
| 代码总行 | 12,450 | M | 约12K行 |
| 组件数 | 23 | M | 23个组件 |
| API端点 | 8 | S-M | 8个路由 |
| Hook数 | 12 | M | 12个自定义Hook |

## 复杂度评分
| 维度 | 得分(1-10) | 等级 | 关键信号 |
|------|-----------|------|---------|
| 技术复杂度 | 7/10 | 高 | 异步流复杂 + 泛型约束 |
| 业务复杂度 | 5/10 | 中 | RBAC权限 + 多数据源 |
| 工程复杂度 | 6/10 | 中高 | 需要Mock + 多环境 |
| **综合复杂度** | **6/10** | **中高** | - |

## 风险识别
- 🔴 高风险: [具体风险描述]
- 🟡 中风险: [具体风险描述]
- ⚪ 低风险: [具体风险描述]

## 推荐Agent组合
- **主模式**: [推荐的模式名称]
- **备选模式**: [备选方案]
- **理由**: [选择依据]
```

---

## 三、Agent 组合决策机制

### 3.1 预定义组合模式

根据常见项目场景，预定义以下Agent组合模式：

#### 模式A：Solo模式（单兵作战）

```
适用场景：
├── 项目规模: S (小型)
├── 复杂度: 低 (≤ 3/10)
├── 当前阶段: 需求/初始化
└── 团队规模: 1人

Agent组成：
┌─────────────────────┐
│   主 Agent (Boss)   │ ← 直接执行所有任务
│   无 Sub-Agent     │
└─────────────────────┘

特点：快速启动，无通信开销，适合MVP或原型
```

#### 模式B：PM+Coder双核模式

```
适用场景：
├── 项目规模: S-M (小中型)
├── 复杂度: 中 (4-6/10)
├── 当前阶段: 功能开发中
└── 团队规模: 1-2人

Agent组成：
┌─────────────────┐     ┌─────────────────┐
│  Boss (PM)      │────▶│  Implementer   │
│  - 需求确认     │     │  - 编码实现    │
│  - Plan审核     │     │  - 编译验证    │
│  - Review验收   │◀────│  - 自检       │
└─────────────────┘     └─────────────────┘
         ↑                        │
         │                        ▼
    ┌─────────┐          ┌─────────────┐
    │Code-Reviewer        │  Bug-Fixer   │
    │(按需调用)           │  (按需调用)   │
    └─────────┘          └─────────────┘

特点：分工明确，PM把控质量，Coder专注实现
```

#### 模式C：三核协作模式（标准）

```
适用场景：
├── 项目规模: M-L (中大型)
├── 复杂度: 中高 (5-7/10)
├── 当前阶段: 多Phase并行
└── 团队规模: 2-5人

Agent组成：
                    ┌─────────────────┐
                    │   Boss (PM)     │ ← 总指挥
                    │  - 任务分解     │
                    │  - 质量把关     │
                    │  - 决策仲裁     │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
    │ Implementer │  │Code-Reviewer│  │ Record-Keeper│
    │ (编码引擎)   │  │ (质检关卡)   │  │ (记录管家)   │
    └─────────────┘  └─────────────┘  └─────────────┘
            │                ▲                │
            └────────────────┼────────────────┘
                             │
                    ┌───────┴───────┐
                    ▼               ▼
              ┌──────────┐   ┌──────────┐
              │ Bug-Fixer│   │Test-Runner│ (可选)
              │ (修复专家)│   │ (测试引擎)│
              └──────────┘   └──────────┘

特点：完整的开发流水线，适合标准商业项目
```

#### 模式D：四核全栈模式（企业级）

```
适用场景：
├── 项目规模: L-XL (大型)
├── 复杂度: 高 (7-10/10)
├── 当前阶段: 全周期
└── 团队规模: 5+人

Agent组成：
                        ┌─────────────────────┐
                        │     Boss (总指挥)    │
                        │  + Evolution-Runner  │ ← 进化引擎常驻
                        └──────────┬──────────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           ▼                       ▼                       ▼
    ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
    │  Implementer │      │Code-Reviewer│      │ Test-Runner  │
    │  (编码集群)   │      │ (质检集群)   │      │ (测试集群)   │
    │  可多实例     │      │ 可多实例     │      │ 可多实例     │
    └──────┬───────┘      └──────┬───────┘      └──────┬───────┘
           │                     │                      │
           └─────────────────────┼──────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
              ┌────────────┐          ┌────────────┐
              │ Bug-Fixer  │          │Record-Keeper│
              │ (修复专家) │          │ (记录中心)  │
              └────────────┘          └────────────┘

特点：大规模并行处理，适合企业级项目
```

#### 模式E：轻量敏捷模式（快速迭代）

```
适用场景：
├── 项目规模: S-M
├── 复杂度: 低-中 (2-5/10)
├── 当前阶段: 迭代开发/Bug修复
└── 目标: 快速交付

Agent组成：
┌─────────────────────────────────────────────┐
│              Boss (一体化模式)                │
│  内部切换角色：                             │
│  - PM模式 → 需求确认、Plan                   │
│  - Coder模式 → 编码、自测                   │
│  - Reviewer模式 → 自审、关键检查            │
│                                             │
│  仅在以下情况派发Sub-Agent：                 │
│  - 复杂Bug → Bug-Fixer                     │
│  - 正式发布前 → Code-Reviewer (Stage 2)     │
└─────────────────────────────────────────────┘

特点：极低通信开销，适合个人开发者快速出活
```

### 3.2 组合决策算法

```python
# 伪代码：Agent组合决策算法
def select_agent_combination(project_profile):
    """
    输入：项目画像
    输出：推荐的Agent组合模式 + 置信度
    """
    
    # Step 1: 基于规则的初筛
    candidates = []
    
    # 规则1: 规模阈值
    if project_profile.scale == "S" and project_profile.complexity <= 3:
        candidates.append(("Solo", 0.9))
    if project_profile.scale in ["S", "M"] and project_profile.complexity <= 6:
        candidates.append(("Dual-Core", 0.85))
    if project_profile.scale in ["M", "L"]:
        candidates.append(("Triple-Core", 0.8))
    if project_profile.scale in ["L", "XL"] or project_profile.complexity >= 7:
        candidates.append(("Quad-Core", 0.75))
    
    # 规则2: 阶段适配
    phase = project_profile.current_phase
    if phase in ["requirement", "initialization"]:
        boost_mode(candidates, "Solo", 0.1)
    elif phase in ["development"]:
        boost_mode(candidates, "Dual-Core", 0.15)
    elif phase in ["integration", "release"]:
        boost_mode(candidates, "Triple-Core", 0.2)
    
    # 规则3: 复杂度加权
    complexity = project_profile.complexity_score
    if complexity >= 8:
        boost_mode(candidates, "Quad-Core", 0.2)
        penalize_mode(candidates, "Solo", -0.5)
    
    # Step 2: 选择最高分模式
    best_mode = max(candidates, key=lambda x: x[1])
    
    # Step 3: 生成推荐报告
    return {
        "recommended_mode": best_mode[0],
        "confidence": best_mode[1],
        "alternatives": sorted(candidates, reverse=True)[1:3],
        "reasoning": generate_reasoning(project_profile, best_mode),
        "agent_list": get_agents_for_mode(best_mode[0])
    }
```

---

## 四、Agent间通信协议

### 4.1 通信原语

定义Agent间的标准化通信消息格式：

```yaml
# 消息头（所有消息必须包含）
message_header:
  msg_id: "msg-uuid-v4"              # 消息唯一ID
  timestamp: "ISO8601"               # 发送时间
  from_agent: "boss"                # 发送方Agent ID
  to_agent: "implementer"            # 接收方Agent ID（广播时为"*"）
  msg_type: TASK_ASSIGN | TASK_RESULT | STATUS_UPDATE | QUERY | RESPONSE | ERROR | CANCEL
  priority: critical | high | normal | low
  correlation_id: "parent-msg-id"   # 关联父消息（用于请求-响应匹配）

# 消息体（根据msg_type不同）
message_body:
  # TASK_ASSIGN - 任务分配
  task_assign:
    task_id: "T001"
    spec_ref: "Product-Spec.md#F001"   # Spec引用
    plan_ref: "DEV-PLAN.md#Phase2"     # Plan引用
    deliverables: ["文件清单"]          # 交付物清单
    acceptance_criteria: ["验收标准"]   # 验收标准
    constraints: {"timeout": "30min"}   # 约束条件
    context: {}                        # 上下文数据
    
  # TASK_RESULT - 任务结果
  task_result:
    task_id: "T001"
    status: SUCCESS | PARTIAL | FAILED | BLOCKED
    outputs: {"files_created": [...]}   # 输出产物
    evidence: ["编译输出", "测试结果"]   # 证据
    issues: []                         # 发现的问题
    next_steps: ["建议下一步"]           # 后续建议
    
  # STATUS_UPDATE - 状态更新
  status_update:
    agent_id: "implementer"
    current_task: "T001"
    progress_pct: 65                    # 进度百分比
    phase: "coding"                     # 当前阶段
    blockers: []                        # 阻塞项
    
  # ERROR - 错误报告
  error:
    error_code: "ERR_001"
    error_type: RUNTIME | TIMEOUT | DEPENDENCY | PERMISSION | VALIDATION
    error_msg: "人类可读的错误描述"
    stack_trace: "详细堆栈"            # 技术细节
    recovery_hint: "恢复建议"           # 恢复提示
    escalate: bool                      # 是否需要升级处理
```

### 4.2 任务分配协议

```
任务分配完整流程：

Boss ─────────────────────────────────────────▶ Implementer
  │                                              │
  ├─ ① TASK_ASSIGN (task_spec)                 │
  │     - 任务ID、交付物、验收标准               │
  │     - Spec/Plan引用、上下文数据             │
  │                                              │
  │                                    ② ACK (确认接收)
  │                                    - 接受任务
  │                                    - 预估耗时
  │                                              │
  │                           ③ STATUS_UPDATE (进度汇报)
  │                           - 定期推送（每完成一个子步骤）
  │                           - 进度百分比
  │                                              │
  │                           ④ TASK_RESULT (最终结果)
  │                           - 成功/失败/部分成功
  │                           - 交付物清单
  │                           - 证据（编译输出、测试结果）
  │                                              │
  ├─ ⑤ REVIEW_REQUEST (如需Review)              │
  │     - 转发给Code-Reviewer                    │
  │                                              │
  │                           ⑥ REVIEW_RESULT
  │                           - 通过/不通过
  │                           - 问题清单（如有）
  │                                              │
  └─ ⑦ CONFIRM / REWORK / CANCEL               │
        - 确认完成 / 返工 / 取消
```

### 4.3 广播与订阅机制

```yaml
# 事件总线（Event Bus）
event_bus:
  # 全局事件（所有Agent可订阅）
  global_events:
    - name: PROJECT_PHASE_CHANGED
      data: {phase_from, phase_to, timestamp}
      subscribers: [boss, implementer, record-keeper]
      
    - name: CRITICAL_ERROR_DETECTED
      data: {error_code, agent_id, severity}
      subscribers: [boss, bug-fixer, record-keeper]
      
    - name: QUALITY_GATE_RESULT
      data: {passed, blocked_items, report_path}
      subscribers: [boss, implementer, code-reviewer]
      
    - name: PRD_CONFIRMED
      data: {confirmed_at, confirmed_by}
      subscribers: [boss, dev-planner, pipeline-engine]

  # 频道事件（特定Agent组）
  channel_events:
    development_channel:
      - TASK_COMPLETED
      - CODE_REVIEW_NEEDED
      - BUG_FOUND
      
    review_channel:
      - REVIEW_PASSED
      - REVIEW_BLOCKED
      - FIX_REQUIRED
```

---

## 五、动态调整机制

### 5.1 触发重新评估的条件

系统在以下情况触发Agent组合重新评估：

| 触发条件 | 评估动作 | 调整幅度 |
|---------|---------|---------|
| Phase转换 | 重新运行决策算法 | 可能切换模式 |
| 复杂度变化（新增高风险模块） | 增加Agent | 增加Code-Reviewer或Test-Runner |
| 连续失败（同一Task失败≥2次） | 切换策略 | 更换Implementer或增加Bug-Fixer |
| 性能瓶颈（某Agent成为瓶颈） | 增加并行 | 启动同类型Agent第二实例 |
| 用户手动干预 | 直接调整 | 立即生效 |
| 时间压力（临近Deadline） | 精简模式 | 从Quad→Triple或Dual |

### 5.2 动态调整示例

```markdown
## 场景：项目中途发现复杂度飙升

### 初始状态
- **模式**: Dual-Core (Boss + Implementer)
- **原因**: 项目初始评估为中等复杂度
- **Agent**: Boss, Implementer (按需调用Code-Reviewer)

### 触发事件
- Event: IMPLEMENTER_REPORT_HIGH_COMPLEXITY
- Data: {task: "支付模块集成", complexity_score: 9/10, risks: ["第三方API不稳定", "状态机复杂"]}
- Time: Phase 3 开发中途

### 重新评估
```
输入更新后的项目画像：
- 复杂度: 5/10 → 8/10 (↑)
- 风险等级: 中 → 高 (↑)
- 当前进度: Phase 3/6 (60%)

决策结果：
- 推荐: Triple-Core (置信度 0.88)
- 理由: 复杂度超过Dual-Core安全阈值(6)，需增加专职质检
- 调整: 新增 Code-Reviewer 常驻
```

### 执行调整
```
Before:
┌─────────┐     ┌─────────────┐
│  Boss   │────▶│  Implementer│
└─────────┘     └─────────────┘

After:
┌─────────┐     ┌─────────────┐     ┌──────────────┐
│  Boss   │────▶│  Implementer│────▶│Code-Reviewer│
│         │◀────│             │◀────│  (新增常驻)  │
└─────────┘     └─────────────┘     └──────────────┘
                      │
                      ▼ (每个Task完成后自动Review)
```

### 记录调整
- 生成 docs/流水线/Agent组合变更记录.md
- 记录变更原因、前后对比、效果预期
- 标记为"动态调整"类型，区别于初始选择
```

### 5.3 回滚机制

如果动态调整后效果不佳，支持回滚到上一版本：

```yaml
rollback_conditions:
  - name: "调整后效率下降超过20%"
    metric: tasks_per_hour
    threshold: -0.2
    action: ROLLBACK_WITH_CONFIRM
    
  - name: "新引入Agent连续报错3次以上"
    metric: error_rate
    threshold: 0.3
    action: AUTO_REMOVE_AGENT
    
  - name: "用户明确要求回滚"
    action: IMMEDIATE_ROLLBACK

rollback_procedure:
  1. 暂停新Agent的所有任务
  2. 将进行中的任务迁移回原Agent（如有）
  3. 恢复之前的组合配置
  4. 记录回滚原因和教训
  5. 通知Boss（主控）回滚完成
```

---

## 六、执行流程

### 6.1 初始化流程

```
[Orchestrator 启动]
    │
    ▼
[Step 1: 加载Agent注册表]
    ├── 读取 agents/ 目录下所有 .md 文件
    ├── 解析每个Agent的能力声明
    ├── 构建Agent能力矩阵（内存）
    └── 输出："已加载 N 个Agent"
    │
    ▼
[Step 2: 分析项目特征]
    ├── 扫描项目目录结构
    ├── 检测项目类型、规模、复杂度
    ├── 读取 Product-Spec.md / DEV-PLAN.md（如有）
    ├── 识别当前阶段
    └── 生成项目画像
    │
    ▼
[Step 3: 选择Agent组合]
    ├── 运行决策算法
    ├── 评估候选模式的适用性
    ├── 选择最优模式
    └── 输出推荐报告
    │
    ▼
[Step 4: 初始化Agent实例]
    ├── 为选定的模式创建Agent实例
    ├── 建立通信通道（内存队列）
    ├── 注册事件订阅
    └── 输出："Agent组合就绪，模式：XXX"
    │
    ▼
[Step 5: 进入主循环]
    └── 等待任务分配...
```

### 6.2 任务分发流程

```
[Boss 发起任务]
    │
    ▼
[Orchestrator 接收任务]
    │
    ├── 任务类型判断
    │   ├── 编码任务 → 分配给 Implementer
    │   ├── Review任务 → 分配给 Code-Reviewer
    │   ├── 修复任务 → 分配给 Bug-Fixer
    │   ├── 记录任务 → 分配给 Record-Keeper
    │   └── 复合任务 → 拆分后分别分配
    │
    ├── 能力匹配验证
    │   ├── 目标Agent是否在线？
    │   ├── 是否达到并发上限？
    │   └── 否 → 排队等待 or 创建新实例
    │
    ├── 上下文组装
    │   ├── 收集相关Spec片段
    │   ├── 收集相关Plan条目
    │   ├── 收集历史记录（如有）
    │   └── 打包为TASK_ASSIGN消息
    │
    ▼
[发送任务给目标Agent]
    │
    ▼
[监控执行]
    ├── 接收STATUS_UPDATE
    ├── 超时检测（基于预估耗时）
    ├── 异常检测（错误事件）
    └── 完成后接收TASK_RESULT
```

### 6.3 优雅关闭流程

```
[收到关闭信号 / 所有任务完成]
    │
    ▼
[Step 1: 停止接受新任务]
    ├── 标记状态为 DRAINING
    ├── 通知Boss不再分配新任务
    │
    ▼
[Step 2: 等待进行中任务完成]
    ├── 查询各Agent活跃任务数
    ├── 设置超时（默认5分钟）
    ├── 逐个确认完成
    │
    ▼
[Step 3: 强制终止超时任务]
    ├── 对未完成任务发送CANCEL
    ├── 记录未完成任务清单
    │
    ▼
[Step 4: 清理资源]
    ├── 释放Agent实例
    ├── 保存最终状态到 .pipeline-state.json
    ├── 生成本次会话报告
    │
    ▼
[Step 5: 关闭完成]
    └── 输出："Orchestrator已关闭"
```

---

## 七、监控与诊断

### 7.1 关键指标

| 指标 | 说明 | 健康阈值 | 告警阈值 |
|------|------|---------|---------|
| 任务吞吐量 | 每小时完成的Task数 | > 2 | < 1 |
| 平均任务耗时 | Task从分配到完成的平均时间 | < 30min | > 60min |
| Agent利用率 | Agent忙碌时间占比 | 60-80% | > 95% 或 < 30% |
| 首次通过率 | Task首次提交即通过Review的比例 | > 70% | < 50% |
| 重试率 | 需要返工的任务比例 | < 20% | > 40% |
| 通信延迟 | 消息平均往返时间 | < 5s | > 15s |
| 错误率 | 任务以FAILED结束的比例 | < 5% | > 15% |

### 7.2 诊断命令

```bash
# 查看当前Agent状态
/orchestrator-status

# 查看任务队列
/orchestrator-queue

# 查看性能指标
/orchestrator-metrics

# 手动调整组合
/orchestrator-switch --mode=triple-core

# 强制回滚
/orchestrator-rollback --reason="性能下降"

# 查看决策日志
/orchestrator-decisions
```

---

## 八、与现有系统集成

### 8.1 在Boss Mode中的位置

```
Boss Mode 启动
    │
    ▼
[第一阶段：需求收集] ← 与之前一致（无需改动）
    │
    ▼
[PRD确认] ← 与之前一致（无需改动）
    │
    ▼
[⭐ 新增：Agent Orchestrator 初始化] ⬅️ 这是插入点
    │
    ├── 分析项目特征
    ├── 选择最优Agent组合
    ├── 初始化Agent实例
    │
    ▼
[第二阶段：规划与开发] ← Orchestrator接管任务分发
    │
    ├── dev-planner (由Boss直接调用)
    │
    ▼
[dev-builder] ──────┐
    │                 │
    ▼                 ▼
[Orchestrator] ◀────┘ ← 接管后续所有Task的分发
    │
    ├── 自动分配给 Implementer
    ├── 自动安排 Code-Reviewer
    ├── 自动调度 Bug-Fixer
    │
    ▼
[第三阶段：验收与交付] ← Orchestrator协助汇总
```

### 8.2 配置项

```yaml
# .claude/orchestrator-config.yml（可选配置）
orchestrator:
  # 默认模式（当无法自动判断时使用）
  default_mode: dual-core
  
  # 是否启用动态调整
  dynamic_adjustment: true
  
  # 重新评估间隔（分钟）
  reevaluation_interval: 30
  
  # 日志级别
  log_level: info  # debug/info/warn/error
  
  # 性能追踪
  metrics_enabled: true
  
  # 最大并行Agent数
  max_concurrent_agents: 6
```

---

## 九、异常处理

### 9.1 Agent故障处理

| 故障类型 | 检测方式 | 处理策略 | 恢复时间 |
|---------|---------|---------|---------|
| Agent无响应 | 心跳超时(60s) | 重启Agent实例，迁移任务 | < 2min |
| Agent持续报错 | 错误率>30% | 替换为新实例，标记旧实例为unhealthy | < 3min |
| Agent死锁 | 检测到循环等待 | 强制中断，回滚状态 | < 1min |
| 通信通道断开 | 连接错误 | 重建通道，重发丢失消息 | < 30s |

### 9.2 级联故障保护

```
正常流程：A → B → C → D

故障场景1：B故障
├── 检测：B无响应
├── 处理：暂停向B分配新任务
├── B已有任务：标记为BLOCKED，转交B-backup或Boss直管
├── 下游C/D：继续工作（如不依赖B的输出）
└── 恢复：B重启后重新加入池

故障场景2：A(Boss)故障
├── 检测：主控无响应
├── 处理：所有Agent进入SAFE_MODE（只读，不执行新任务）
├── 已有任务：暂停，保存checkpoint
└── 恢复：A重启后读取checkpoint，恢复执行
```

---

## 十、扩展指南

### 10.1 如何添加新Agent

```markdown
# 步骤1：创建Agent定义文件
# 文件路径：agents/[new-agent].md
# 参考 agents/implementer.md 的模板

# 步骤2：声明能力（见第一节能力模型模板）

# 步骤3：在Orchestrator中注册
# 编辑本文件的"已注册Agent能力矩阵"表格
# 添加新Agent的一行

# 步骤4：添加组合模式（如需要）
# 在"预定义组合模式"章节添加包含新Agent的模式变体

# 步骤5：测试
# 创建测试项目，验证新Agent被正确选中和调用
```

### 10.2 如何自定义组合模式

```markdown
# 方式1：修改预设模式
# 编辑本文件的第三节"预定义组合模式"
# 调整Agent组成、适用条件、通信拓扑

# 方式2：添加全新模式
# 按照模式模板定义新的模式变体
# 在决策算法中添加匹配规则

# 方式3：运行时覆盖
# 通过配置文件或命令行参数指定模式
# 例：/orchestrator-switch --mode=custom
```

---

## 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v1.0.0 | 2026-04-28 | 初始版本，基础Agent协作框架 |
| v2.0.0 | 2026-04-30 | 完整重构：能力模型+动态调整+诊断系统 |
