---
name: compatibility-checker
description: 当项目开发完成、部署前，自动检查跨浏览器兼容性、响应式设计、无障碍访问和性能基准。确保项目在不同设备和浏览器上都能正常工作。
---

[任务]
    在项目部署前，自动检查兼容性问题。包括跨浏览器兼容性、响应式布局、无障碍访问（WCAG）和性能基准。
    发现问题按严重度分级，阻断级问题必须修复才能部署。

[依赖检测]
    Skill 启动时第一步自动执行。

    必需：
    - 项目代码已存在
    - quality-gate 已通过
    - test-runner 已通过

    可选：
    - Playwright → 有则可自动执行跨浏览器测试
    - Lighthouse CLI → 有则可自动执行性能审计
    - axe-core → 有则可自动执行无障碍审计

[第一性原则]
    **兼容性不是可选项**：用户用什么设备和浏览器不是我们能决定的。产品必须在主流环境下可用。
    **渐进增强**：先保证核心功能在所有目标环境可用，再在高级环境上增强体验。
    **自动检测优先**：能用工具检测的不用人看。工具检测不了的才需要手动验证。
    **数据驱动**：兼容性判断基于真实数据（浏览器市场份额），不基于猜测。

[输出风格]
    **语态**：
    - 像QA测试工程师：逐项检查，逐项结果，附截图或数据
    - 通过就是通过，不通过就是不通过，附具体表现

    **原则**：
    - × 绝不说"应该兼容"——测过才算
    - × 绝不只测 Chrome——要覆盖主流浏览器
    - × 绝不忽略移动端——移动流量可能超过桌面
    - ✓ 每项检查附工具和结果
    - ✓ 不通过项附具体表现和修复建议
    - ✓ 汇总报告一目了然

[文件结构]
    ```
    compatibility-checker/
    └── SKILL.md                           # 主 Skill 定义（本文件）
    ```

[检查维度]

    [跨浏览器兼容性]
        **目标浏览器**（基于市场份额）：
        | 浏览器 | 最低版本 | 优先级 |
        |--------|---------|--------|
        | Chrome | 最近2个主版本 | 🔴 必须 |
        | Safari | 最近2个主版本 | 🔴 必须 |
        | Firefox | 最近2个主版本 | 🟡 重要 |
        | Edge | 最近2个主版本 | 🟡 重要 |
        | iOS Safari | 最近2个主版本 | 🔴 必须 |
        | Android Chrome | 最近2个主版本 | 🟡 重要 |

        **检查方式**：
        - 有 Playwright → 自动在 Chromium / Firefox / WebKit 上运行 E2E 测试
        - 无 Playwright → 手动检查以下常见兼容性问题：
          - CSS 兼容性：检查是否使用了实验性 CSS 属性
          - JS 兼容性：检查是否使用了新 API（如 structuredClone、temporal）
          - Web API 兼容性：检查是否使用了非标准 API

        **CSS 兼容性检查**（使用 Grep tool 搜索）：
        - `container-type:` → CSS Container Queries（Safari 16+）
        - `:has(` → CSS :has() 选择器（Safari 15.4+）
        - `subgrid` → CSS Subgrid（Safari 16+）
        - `color-mix(` → CSS color-mix()（Safari 16.2+）
        - `@layer` → CSS @layer（Safari 15.4+）
        - `accent-color` → CSS accent-color（Safari 15.4+）
        - `dialog::backdrop` → Dialog 元素（Safari 15.4+）

        **JS 兼容性检查**（使用 Grep tool 搜索）：
        - `structuredClone` → 需要检查目标浏览器支持
        - `Temporal.` → Temporal API（尚未广泛支持）
        - `navigator.` → 检查是否使用了非标准 Navigator API
        - `window.showOpenFilePicker` → File System Access API（仅 Chromium）

    [响应式设计]
        **目标断点**：
        | 设备 | 宽度范围 | 优先级 |
        |------|---------|--------|
        | 手机竖屏 | 320px - 480px | 🔴 必须 |
        | 手机横屏 | 481px - 767px | 🟡 重要 |
        | 平板 | 768px - 1024px | 🟡 重要 |
        | 桌面 | 1025px - 1440px | 🔴 必须 |
        | 大屏 | 1441px+ | 🟢 可选 |

        **检查方式**：
        - 有 Playwright → 使用 devices 配置在不同视口下截图对比
        - 无 Playwright → 检查代码中的响应式实现：
          - 检查是否使用了 Tailwind 响应式前缀（sm:、md:、lg:、xl:）
          - 检查是否有固定宽度导致溢出
          - 检查触摸目标大小（最小 44x44px）
          - 检查字体大小是否在小屏上可读

        **代码级检查**（使用 Grep tool 搜索）：
        - `width:\s*\d{4,}px` → 固定宽度可能溢出
        - `min-width:\s*[89]\d{2}px` → 最小宽度可能排除移动端
        - `overflow:\s*hidden` → 可能隐藏了溢出内容
        - `position:\s*fixed` → 可能在移动端有问题

    [无障碍访问（WCAG）]
        **检查级别**：WCAG 2.1 AA 级

        **自动检查项**（使用 Grep tool 搜索）：
        - `<img` 无 `alt` → 图片缺少替代文本
        - `<button` 无文字内容且无 `aria-label` → 按钮缺少可访问名称
        - `<a` 无文字内容且无 `aria-label` → 链接缺少可访问名称
        - `<input` 无 `label` 或 `aria-label` → 表单控件缺少标签
        - `role=` → 检查 ARIA role 使用是否正确
        - `tabindex=` → 检查 tabindex 使用是否合理
        - `color:` → 检查颜色对比度（需工具辅助）

        **手动检查提醒**：
        - 键盘导航：所有交互元素可通过 Tab 访问
        - 焦点顺序：Tab 顺序符合逻辑
        - 焦点可见：焦点状态清晰可见
        - 屏幕阅读器：关键信息可通过屏幕阅读器获取

    [性能基准]
        **目标指标**（基于 Lighthouse）：
        | 指标 | 目标值 | 最低值 |
        |------|--------|--------|
        | Performance | ≥ 90 | ≥ 70 |
        | First Contentful Paint | ≤ 1.8s | ≤ 3.0s |
        | Largest Contentful Paint | ≤ 2.5s | ≤ 4.0s |
        | Total Blocking Time | ≤ 200ms | ≤ 600ms |
        | Cumulative Layout Shift | ≤ 0.1 | ≤ 0.25 |
        | Lighthouse Accessibility | ≥ 90 | ≥ 80 |

        **检查方式**：
        - 有 Lighthouse CLI → 自动运行审计
        - 无 Lighthouse CLI → 代码级性能检查：
          - 检查图片是否使用了 next/image 或优化格式
          - 检查是否有大包导入（如 import lodash）
          - 检查是否有未使用的 CSS
          - 检查字体加载策略

        **代码级检查**（使用 Grep tool 搜索）：
        - `import.*lodash` → 大包导入，建议按需导入
        - `import.*moment` → Moment.js 体积大，建议用 date-fns
        - `<img` → 未使用 next/image（Next.js 项目）
        - `document\.fonts` → 字体加载可能阻塞渲染

[工作流程]
    [第一步：环境检测]
        检查可用的测试工具
        有 Playwright → 配置跨浏览器测试
        有 Lighthouse → 配置性能审计
        都没有 → 使用代码级检查

    [第二步：跨浏览器兼容性检查]
        执行 [跨浏览器兼容性] 的检查项
        记录每个浏览器的兼容性状态

    [第三步：响应式设计检查]
        执行 [响应式设计] 的检查项
        记录每个断点的适配状态

    [第四步：无障碍访问检查]
        执行 [无障碍访问（WCAG）] 的检查项
        记录每个检查项的通过状态

    [第五步：性能基准检查]
        执行 [性能基准] 的检查项
        记录各项指标数据

    [第六步：输出兼容性报告]
        格式：
        "🌐 **兼容性报告**

         **项目**：[项目名]
         **检查时间**：[时间]

         ---

         **跨浏览器兼容性**
         | 浏览器 | 状态 | 问题 |
         |--------|------|------|
         | Chrome | ✅ | 无 |
         | Safari | ⚠️ | CSS :has() 需回退方案 |
         | Firefox | ✅ | 无 |
         | iOS Safari | ❌ | Dialog 元素不支持 |

         **响应式设计**
         | 断点 | 状态 | 问题 |
         |------|------|------|
         | 手机竖屏 | ✅ | 无 |
         | 平板 | ⚠️ | 侧边栏溢出 |
         | 桌面 | ✅ | 无 |

         **无障碍访问（WCAG 2.1 AA）**
         - 图片替代文本: ✅ 全部有 alt
         - 按钮可访问名称: ⚠️ 2 个图标按钮缺少 aria-label
         - 表单标签: ✅ 全部有 label
         - 键盘导航: ⚠️ 需手动验证

         **性能基准**
         | 指标 | 实际值 | 目标值 | 状态 |
         |------|--------|--------|------|
         | FCP | 1.5s | ≤ 1.8s | ✅ |
         | LCP | 2.8s | ≤ 2.5s | ⚠️ |
         | TBT | 150ms | ≤ 200ms | ✅ |
         | CLS | 0.05 | ≤ 0.1 | ✅ |

         ---

         **结果**：[✅ 全部通过 / ⚠️ N 项警告 / ❌ N 项阻断]

         **阻断项**（必须修复才能部署）：
         - [列表]

         **警告项**（建议修复）：
         - [列表]"

[门禁集成]
    | 检查维度 | 门禁级别 | Boss Mode 行为 |
    |---------|---------|---------------|
    | Chrome/Safari/iOS 兼容 | 🔴 阻断 | 必须修复 |
    | Firefox/Edge 兼容 | 🟡 警告 | 记录，不阻断 |
    | 手机竖屏适配 | 🔴 阻断 | 必须修复 |
    | 平板适配 | 🟡 警告 | 记录 |
    | WCAG AA 关键项 | 🔴 阻断 | 必须修复 |
    | WCAG AA 次要项 | 🟡 警告 | 记录 |
    | 性能低于最低值 | 🔴 阻断 | 必须修复 |
    | 性能低于目标值 | 🟡 警告 | 记录 |

[初始化]
    执行 [第一步：环境检测]
