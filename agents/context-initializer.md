# 项目上下文初始化器 (Context Initializer)

> **版本**: 1.0.0  
> **来源**: Harness Engineering 核心支柱一 — 上下文架构  
> **对标**: Cursor/Windsurf 的代码库索引机制 + GitHub Copilot Workspace 的项目理解

---

## 一、定位与目标

### 1.1 核心问题

```
❌ 传统AI编程的问题：

AI进入新项目时：
├── 不知道项目用什么技术栈
├── 不理解现有架构模式
├── 不知道哪些文件是核心
├── 不了解命名规范和编码风格
├── 无法识别已有的工具函数
└── 结果：生成与现有代码冲突的代码 ✗

✅ 上下文初始化器的目标：

AI开始开发前自动执行：
├── 扫描项目结构，建立索引
├── 分析技术栈和依赖关系
├── 学习现有代码模式和风格
├── 识别关键业务逻辑
├── 生成项目知识图谱
└── 结果：生成的代码完美融入现有项目 ✓
```

### 1.2 触发时机

| 场景 | 触发方式 | 说明 |
|------|---------|------|
| Boss模式启动 | **自动触发** | 第一阶段完成后、第二阶段开始前 |
| 新Agent加入 | **自动触发** | implementer/code-reviewer首次启动时 |
| 项目重大变更 | **事件驱动** | 技术栈升级、架构重构后 |
| 手动请求 | `/init-context` | 用户主动要求重新初始化 |
| 定期更新 | 每10个Task | 增量更新（不阻塞） |

---

## 二、索引内容体系

### 2.1 六维索引模型

```yaml
index_dimensions:
  
  # 维度一：项目元数据 (Project Metadata)
  metadata:
    collection:
      - project_name: 从 package.json 或根目录推断
      - tech_stack: 检测使用的技术栈
      - framework_version: 框架版本号
      - build_tool: 构建工具 (Vite/Webpack/Rollup)
      - package_manager: 包管理器 (bun/npm/yarn/pnpm)
      - language_version: TypeScript/JavaScript/Python版本
      - target_environment: 运行环境 (Browser/Node/Both)
      
    output_file: "docs/context/project-metadata.json"
    
  # 维度二：目录结构图谱 (Directory Structure Map)
  structure:
    collection:
      - directory_tree: 完整的目录树（排除node_modules等）
      - purpose_annotation: 每个目录的用途说明
      - entry_points: 入口文件识别
      - config_files: 配置文件清单
      - important_paths: 关键路径标记
      
    output_file: "docs/context/directory-structure.md"
    
  # 维度三：依赖关系图 (Dependency Graph)
  dependencies:
    collection:
      - internal_deps: 项目内部模块依赖
      - external_deps: 第三方依赖及版本
      - dev_dependencies: 开发依赖
      - circular_deps_check: 循环依赖检测
      - dependency_health: 依赖健康度评估
      
    output_file: "docs/context/dependency-graph.json"
    
  # 维度四：代码模式库 (Code Pattern Library)
  patterns:
    collection:
      - naming_conventions: 命名规范识别
      - code_style_patterns: 编码风格分析
      - component_patterns: 组件模式（如HOC/Render Props/Hooks）
      - api_call_patterns: API调用模式
      - state_management: 状态管理模式
      - error_handling: 错误处理模式
      - testing_patterns: 测试编写模式
      
    output_file: "docs/context/code-patterns.md"
    
  # 维度五：关键实体识别 (Key Entity Recognition)
  entities:
    collection:
      - core_components: 核心组件列表
      - utility_functions: 工具函数清单
      - custom_hooks: 自定义Hooks
      - type_definitions: 类型定义
      - api_endpoints: API端点
      - business_logic: 业务逻辑位置
      - constants_config: 常量和配置
      
    output_file: "docs/context/key-entities.md"
    
  # 维度六：架构约束规则 (Architecture Constraints)
  constraints:
    collection:
      - layer_rules: 分层规则（从rules/加载）
      - complexity_limits: 复杂度限制
      - forbidden_patterns: 禁止的模式
      - required_patterns: 必须遵循的模式
      
    output_file: "docs/context/architecture-constraints.yml"
```

---

## 三、扫描算法详解

### 3.1 技术栈自动检测

```python
def detect_tech_stack(project_root):
    """
    自动检测项目技术栈
    
    检测策略：
    1. 检查配置文件（package.json, tsconfig.json, etc.）
    2. 检查依赖声明
    3. 检查文件扩展名分布
    4. 检查特定框架的标志性文件
    """
    
    stack_detection = {
        'framework': {
            'next.js': ['next.config.*', 'pages/', 'app/'],
            'nuxt': ['nuxt.config.*'],
            'react': ['package.json包含"react"'],
            'vue': ['package.json包含"vue"'],
            'angular': ['angular.json', '.angular/'],
            'svelte': ['svelte.config.*', '*.svelte'],
            'solid': ['package.json包含"solid-js"'],
        },
        
        'ui_library': {
            'tailwind': ['tailwind.config.*', 'postcss.config.*包含tailwind'],
            'mui': ['@mui/*'],
            'antd': ['antd'],
            'shadcn': ['components/ui/', 'ui.shadcn*'],
            'chakra': ['@chakra-ui/*'],
        },
        
        'state_management': {
            'redux': ['redux', '@reduxjs/*'],
            'zustand': ['zustand'],
            'jotai': ['jotai'],
            'recoil': ['recoil'],
            'mobx': ['mobx'],
            'pinia': ['pinia'],  # Vue
        },
        
        'data_fetching': {
            'react-query': ['@tanstack/react-query'],
            'swr': ['swr'],
            'axios': ['axios'],
            'fetch': ['原生fetch（无额外依赖）'],
        },
        
        'styling_solution': {
            'css_modules': ['*.module.css', '*.module.scss'],
            'styled-components': ['styled-components'],
            'emotion': ['@emotion/*'],
            'sass': ['sass', 'node-sass'],
            'less': ['less'],
        },
        
        'testing': {
            'jest': ['jest.config.*'],
            'vitest': ['vitest.config.*'],
            'playwright': ['playwright.config.*'],
            'cypress': ['cypress.config.*'],
            'testing-library': ['@testing-library/*'],
        }
    }
    
    return detected_stack
```

### 3.2 代码模式学习算法

```python
def learn_code_patterns(project_root):
    """
    学习项目中的代码模式
    
    分析维度：
    1. 命名规范（文件名、变量名、函数名、组件名）
    2. 导入/导出模式
    3. 组件结构模板
    4. API调用约定
    5. 错误处理方式
    6. 注释风格
    """
    
    patterns = {}
    
    # 1. 命名规范分析
    patterns['naming'] = analyze_naming_conventions(project_root)
    
    def analyze_naming_conventions(root):
        """分析命名规范"""
        file_names = collect_all_filenames(root)
        var_names = extract_variable_names(root)
        func_names = extract_function_names(root)
        comp_names = extract_component_names(root)
        
        conventions = {
            'files': detect_case_style(file_names),       # kebab-case? PascalCase?
            'variables': detect_case_style(var_names),     # camelCase?
            'functions': detect_case_style(func_names),    # camelCase?
            'components': detect_case_style(comp_names),   # PascalCase?
            'constants': detect_case_style(const_names),   # UPPER_SNAKE_CASE?
        }
        
        return conventions
    
    # 2. 导入模式分析
    patterns['imports'] = analyze_import_patterns(root)
    
    def analyze_import_patterns(root):
        """分析导入模式"""
        imports = collect_all_imports(root)
        
        patterns = {
            'alias_usage': detect_aliases(imports),
            'absolute_vs_relative': count_absolute_vs_relative(imports),
            'grouping_style': detect_grouping(imports),
            'default_vs_named': detect_export_style(imports),
        }
        
        return patterns
        
    # 3. 组件结构模板
    patterns['component_template'] = learn_component_template(root)
    
    def learn_component_template(root):
        """学习组件结构模板"""
        components = find_all_components(root)
        
        if len(components) == 0:
            return None
            
        # 选择最大的组件作为模板样本
        largest = max(components, key=lambda c: c.line_count)
        
        template = {
            'structure': analyze_structure(largest),
            'hooks_used': extract_hooks(largest),
            'prop_pattern': detect_prop_pattern(largest),
            'state_pattern': detect_state_pattern(largest),
            'effect_pattern': detect_effect_pattern(largest),
            'return_pattern': detect_return_pattern(largest),
        }
        
        return template
        
    return patterns
```

### 3.3 关键实体提取

```python
def extract_key_entities(project_root):
    """
    提取项目中的关键实体
    
    包括：
    - 可复用的工具函数
    - 自定义Hooks
    - 类型定义和接口
    - API调用封装
    - 业务常量
    """
    
    entities = {
        'utilities': [],
        'custom_hooks': [],
        'types': [],
        'api_clients': [],
        'constants': [],
    }
    
    # 扫描utils/目录
    if exists(join(project_root, 'src/utils')):
        for file in glob.glob('src/utils/**/*.{ts,tsx,js}', root_dir=project_root):
            functions = parse_exported_functions(file)
            entities['utilities'].extend(functions)
    
    # 扫描hooks/目录
    if exists(join(project_root, 'src/hooks')):
        for file in glob.glob('src/hooks/**/*.ts', root_dir=project_root):
            hooks = parse_custom_hooks(file)
            entities['custom_hooks'].extend(hooks)
            
    # 扫描types/目录
    if exists(join(project_root, 'src/types')):
        for file in glob.glob('src/types/**/*.ts', root_dir=project_root):
            types = parse_type_definitions(file)
            entities['types'].extend(types)
            
    # 扫描api/或services/目录
    for api_dir in ['src/api', 'src/services', 'src/lib/api']:
        if exists(join(project_root, api_dir)):
            for file in glob.glob(f'{api_dir}/**/*.{ts,tsx,js}', root_dir=project_root):
                apis = parse_api_functions(file)
                entities['api_clients'].extend(apis)
                
    # 扫描config/或constants/
    for config_dir in ['src/config', 'src/constants', 'src/lib/constants']:
        if exists(join(project_root, config_dir)):
            for file in glob.glob(f'{config_dir}/**/*.{ts,tsx,js}', root_dir=project_root):
                consts = parse_constants(file)
                entities['constants'].extend(consts)
    
    return entities
```

---

## 四、输出产物

### 4.1 项目上下文摘要 (Project Context Summary)

```markdown
# 📋 项目上下文摘要

**生成时间**: {timestamp}  
**项目名称**: {project_name}  
**技术栈**: {tech_stack_summary}

---

## 🏗️ 项目概览

| 属性 | 值 |
|------|-----|
| **框架** | Next.js 14 (App Router) |
| **UI库** | Tailwind CSS + shadcn/ui |
| **状态管理** | Zustand |
| **数据获取** | @tanstack/react-query |
| **表单** | React Hook Form + Zod |
| **测试** | Vitest + Testing Library |
| **构建工具** | Vite |
| **包管理器** | bun |

---

## 📁 目录结构概览

```
src/
├── app/              # Next.js App Router页面
│   ├── (auth)/       # 认证相关页面
│   ├── (dashboard)/  # 仪表板页面
│   └── api/          # API路由
├── components/       # 可复用组件
│   ├── ui/           # 基础UI组件 (shadcn)
│   ├── features/     # 功能组件
│   └── layouts/      # 布局组件
├── hooks/            # 自定义Hooks
│   ├── useAuth.ts
│   └── useQuery.ts
├── lib/              # 工具库
│   ├── utils.ts      # 通用工具函数
│   ├── api.ts        # API客户端
│   └── validations.ts # Zod schemas
├── stores/           # Zustand状态存储
├── types/            # TypeScript类型定义
└── __tests__/        # 测试文件
```

---

## 🎨 编码规范

### 命名约定
| 类型 | 风格 | 示例 |
|------|------|------|
| 文件名 | kebab-case | `user-card.tsx` |
| 组件名 | PascalCase | `UserCard` |
| 变量/函数 | camelCase | `getUserData` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 类型接口 | PascalCase | `UserProfile` |
| 接口前缀 | I + PascalCase | `IUserService` |

### 导入顺序
```typescript
// 1. React/框架
import React from 'react';

// 2. 第三方库
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 3. 内部类型
import { User } from '@/types';

// 4. 内部组件
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 5. 工具函数
import { formatDate } from '@/lib/utils';

// 6. 相对路径（同级组件）
import { Avatar } from './avatar';
```

### 组件结构模板
```typescript
// 组件标准结构
interface ComponentNameProps {
  // props定义
}

export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // 1. Hooks（按顺序）
  const [state, setState] = useState();
  const data = useQuery({...});
  
  // 2. 派生状态
  const derivedValue = useMemo(() => {...}, [deps]);
  
  // 3. 事件处理函数
  const handleClick = () => {...};
  
  // 4. 副作用
  useEffect(() => {...}, []);
  
  // 5. 条件渲染
  if (loading) return <Loading />;
  if (error) return <Error />;
  
  // 6. 渲染
  return (
    <div className="...">
      ...
    </div>
  );
}
```

---

## 🔧 可复用资源

### 已有工具函数 (src/lib/utils.ts)
| 函数 | 用途 | 示例 |
|------|------|------|
| `formatDate()` | 日期格式化 | `formatDate(date, 'YYYY-MM-DD')` |
| `formatCurrency()` | 货币格式化 | `formatCurrency(1234.56)` |
| `cn()` | 类名合并 | `cn('base', condition && 'active')` |
| `debounce()` | 防抖 | `debounce(fn, 300)` |
| `truncate()` | 文本截断 | `truncate(text, 100)` |

### 自定义Hooks
| Hook | 用途 | 位置 |
|------|------|------|
| `useAuth()` | 认证状态 | `hooks/useAuth.ts` |
| `useDebounce()` | 防抖值 | `hooks/useDebounce.ts` |
| `useLocalStorage()` | 本地存储 | `hooks/useLocalStorage.ts` |
| `useMediaQuery()` | 媒体查询 | `hooks/useMediaQuery.ts` |

### API客户端 (src/lib/api.ts)
```typescript
// 使用示例
const api = createApiClient({
  baseURL: '/api',
  timeout: 10000,
});

// GET请求
const users = await api.get('/users');

// POST请求
const user = await api.post('/users', userData);
```

---

## ⚠️ 架构约束

### 必须遵守的规则
- ✅ 所有API调用必须通过 `src/lib/api.ts` 封装
- ✅ 表单验证必须使用 Zod schema
- ✅ 状态管理使用 Zustand stores（位于 `src/stores/`）
- ✅ UI组件优先使用 `components/ui/` 中的shadcn组件
- ✅ 样式使用 Tailwind CSS 工具类

### 禁止事项
- ❌ 禁止在组件中直接 fetch（使用 react-query + api client）
- ❌ 禁止使用 `any` 类型（必须有明确类型定义）
- ❌ 禁止硬编码字符串/数字（使用常量或配置）
- ❌ 禁止在 useEffect 中直接修改 state（使用回调或 reducer）

---

*此文档由 Context Initializer 自动生成，供 AI 开发时参考*
```

### 4.2 结构化数据文件

```json
{
  "metadata": {
    "project_name": "my-project",
    "generated_at": "2026-04-30T14:30:00Z",
    "version": "1.0.0",
    "scanner_version": "1.0.0"
  },
  
  "tech_stack": {
    "framework": {
      "name": "Next.js",
      "version": "14.1.0",
      "features": ["App Router", "Server Components"]
    },
    "language": {
      "name": "TypeScript",
      "version": "5.3.3",
      "strict_mode": true
    },
    "ui": ["Tailwind CSS 3.4", "shadcn/ui"],
    "state_management": ["Zustand"],
    "testing": ["Vitest", "@testing-library/react", "Playwright"]
  },
  
  "statistics": {
    "total_files": 156,
    "total_lines": 12450,
    "components_count": 42,
    "hooks_count": 8,
    "utility_functions": 23,
    "test_files": 35,
    "test_coverage_percent": 78.5
  },
  
  "key_paths": {
    "entry_point": "src/app/page.tsx",
    "app_layout": "src/app/layout.tsx",
    "global_styles": "src/app/globals.css",
    "tailwind_config": "tailwind.config.ts",
    "type_definitions": "src/types/index.ts",
    "api_client": "src/lib/api.ts"
  },
  
  "patterns_detected": {
    "naming": {
      "files": "kebab-case",
      "components": "PascalCase",
      "variables": "camelCase",
      "constants": "UPPER_SNAKE_CASE"
    },
    "component_structure": "hooks-first-pattern",
    "state_management": "zustand-stores",
    "error_handling": "try-catch-with-toast",
    "api_calls": "react-query-destructure-pattern"
  }
}
```

---

## 五、集成机制

### 5.1 在Boss模式中的集成

```yaml
# CLAUDE.md 中添加
boss_mode_context_init:
  
  trigger: "phase_1_complete"  # PRD确认后
  
  execution:
    step_1: "运行 context-initializer"
    step_2: "生成 docs/context/ 目录下的所有文件"
    step_3: "将上下文摘要注入到系统提示中"
    step_4: "提供给后续所有Agent使用"
    
  update_policy:
    full_rebuild: "重大项目变更时"
    incremental_update: "每10个Task后"
    on_demand: "用户调用 /init-context 时"
```

### 5.2 Agent使用方式

```markdown
## 如何使用项目上下文

### 对于 Implementer Agent

当你开始编码前，**必须先阅读**以下文件：

1. 📄 `docs/context/project-summary.md` - 项目概览
2. 📄 `docs/context/code-patterns.md` - 编码规范
3. 📄 `docs/context/key-entities.md` - 可复用资源

**检查清单**：
- [ ] 我知道这个项目用什么技术栈吗？
- [ ] 我理解命名规范吗？
- [ ] 我使用了已有的工具函数而不是重写吗？
- [ ] 我的代码符合组件结构模板吗？
- [ ] 我遵守了架构约束吗？

### 对于 Code Reviewer Agent

审查时对照以下标准：

1. **一致性**: 代码是否符合已学习的模式？
2. **复用性**: 是否重复造轮子而非使用已有工具？
3. **规范性**: 是否违反命名或结构约定？
4. **约束遵守**: 是否触犯禁止事项？
```

---

## 六、增量更新机制

### 6.1 变更检测

```yaml
incremental_update:
  
  trigger_conditions:
    new_files_added: true          # 新增了文件
    files_modified: true           # 文件被修改
    dependencies_changed: true     # 依赖有变化
    task_count_threshold: 10       # 每10个Task
  
  update_strategy:
    
    quick_scan:                   # 快速扫描（<30秒）
      checks:
        - 新增文件分类
        - 删除文件记录
        - 依赖版本变化
      output: "update-patch.json"
      
    deep_scan:                    # 深度扫描（后台执行）
      triggers:
        - major_refactoring       # 重构后
        - weekly_schedule         # 每周一次
      checks:
        - 重新学习代码模式
        - 更新实体清单
        - 重新评估架构健康度
      output: "full-rebuild.json"
```

### 6.2 缓存策略

```yaml
caching:
  
  cache_location: ".cache/context-index/"
  
  cache_files:
    metadata: "metadata.json"
    structure_hash: "structure.hash"
    patterns_snapshot: "patterns.snapshot"
    entity_index: "entities.idx"
    
  invalidation_rules:
    force_invalidate:
      - "package.json changed"     # 依赖变化
      - "tsconfig.json changed"   # TS配置变化
      - "tailwind.config.* changed" # 样式配置变化
      
    soft_invalidate:
      - "> 50 files changed"      # 大量文件变更
      - "> 24 hours since last"   # 超过24小时
      
  cache_warming:
    on_project_open: true         # 打开项目时预加载
    background_refresh: true      # 后台静默刷新
```

---

## 七、配置选项

```yaml
context_initializer:
  
  enabled: true
  
  scanning:
    exclude_patterns:
      - "node_modules/"
      - ".next/"
      - "dist/"
      - ".cache/"
      - "__tests__/"             # 测试文件可选排除
      - "*.spec.ts"
      - "*.test.ts"
      - "*.stories.tsx"          # Storybook文件
      
    include_patterns:
      - "src/**/*.{ts,tsx,js,jsx}"
      - "*.{json,yml,yaml,md}"
      - "app/**/*.{ts,tsx}"
      
  analysis_depth:
    quick:                        # 快速模式（首次进入）
      timeout_seconds: 30
      analysis_level: "basic"
      outputs: ["metadata", "structure"]
      
    standard:                     # 标准模式（默认）
      timeout_seconds: 120
      analysis_level: "full"
      outputs: ["metadata", "structure", "patterns", "entities"]
      
    deep:                         # 深度模式（手动触发）
      timeout_seconds: 300
      analysis_level: "comprehensive"
      outputs: all
      
  output_format:
    markdown_summary: true        # 生成人类可读的摘要
    structured_data: true         # 生成机器可读的数据
    inject_to_prompt: true        # 注入到系统提示中
    
  integration:
    auto_share_with_agents: true  # 自动共享给所有Agent
    persist_to_docs: true         # 持久化到docs/context/
    version_control: true         # 提交到Git（可选）
```

---

## 八、使用示例

### 8.1 手动触发完整初始化

```bash
# 方式1: 完整初始化（推荐新项目或大变更后使用）
/init-context:deep

# 输出：
# ✅ 正在进行深度上下文初始化...
# 📊 扫描了 156 个文件
# 🎯 识别出 42 个组件、23 个工具函数、8 个自定义Hook
# 📝 生成了 6 个上下文文件
# ✅ 上下文初始化完成！耗时 45秒

# 方式2: 快速更新
/init-context:quick

# 输出：
# ✅ 快速更新完成
# 📝 检测到 3 个新增文件，0 个删除文件
# 🔄 上下文已增量更新
```

### 8.2 查看当前上下文

```bash
# 查看项目概览
/context:summary

# 查看可复用的工具函数
/context:utils

# 查看代码模式
/context:patterns

# 查看完整上下文报告
/context:full
```

---

## 九、最佳实践

### 9.1 何时需要重新初始化

```yaml
reinit_triggers:
  
  must_reinit:
    - "更换了UI库（如从MUI迁移到Ant Design）"
    - "重构了目录结构"
    - "升级了主框架版本（如Next.js 13→14）"
    - "改变了状态管理方案"
    - "引入了新的构建工具"
    
  should_reinit:
    - "添加了大量新功能模块"
    - "修改了编码规范"
    - "引入了新的设计系统"
    - "进行了大规模重构"
    
  optional_reinit:
    - "常规开发一段时间后（建议每周一次）"
    - "感觉AI生成的代码不符合项目风格时"
    - "新成员加入项目时"
```

### 9.2 上下文质量保证

```yaml
quality_assurance:
  
  validation_checks:
    - metadata_complete: "所有必填字段都有值"
    - no_false_positives: "没有错误识别的技术栈"
    - patterns_accurate: "学习的模式确实存在于项目中"
    - entities_exist: "列出的实体文件确实存在"
    
  feedback_loop:
    - 如果Agent发现上下文信息不准确 → 记录反馈
    - 定期分析反馈 → 改进扫描算法
    - 用户可以手动修正 → /context:correct
```

---

*文档版本: 1.0.0 | 最后更新: 2026-04-30 | 维护者: Boss-auto-harness Team*
