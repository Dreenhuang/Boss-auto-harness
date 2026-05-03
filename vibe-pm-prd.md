# Vibe PM — 产品需求文档 (PRD)

> **版本：** v2.2（重大功能扩展）
> **日期：** 2026-05-03
> **产品名：** 小白AI产品经理训练营（英文名：Vibe PM）
> **一句话定位：** AI时代产品经理的学习神器——像刷小红书一样掌握技术思维
> **平台目标：** 全平台覆盖（iOS / Android / HarmonyOS / 小程序）— 必须符合各大APP商城规范

---

## ⚠️⚠️⚠️ 重要声明：前端实现已完成 — 严禁修改 ⚠️⚠️⚠️

### 🎯 核心状态说明（必须首先阅读）

| 状态项 | 详情 | 验证状态 |
|--------|------|---------|
| **前端开发** | ✅ **100% 完成** - 无需任何前端设计工作 | 已验证 |
| **UI设计** | ✅ **像素级复刻** - 已基于原型源代码完成100%还原 | 已验证 |
| **交互逻辑** | ✅ **完整实现** - 所有页面跳转、状态管理、动画效果均已就绪 | 已验证 |
| **组件结构** | ✅ **已锁定** - 所有组件、布局、样式参数不可更改 | 已锁定 |
| **当前任务** | 🔧 **后端对接** + **数据接入** + **功能完善** | 进行中 |

### 🚫🚫🚫 开发红线（强制执行 - 违者后果自负）🚫🚫🚠️

#### 📋 红线清单（共10条，全部必须遵守）

1. **❌ 禁止修改前端布局**
   - 所有页面结构、组件位置、间距参数不得随意更改
   - 包括但不限于：容器宽度、元素定位、Flex/Grid布局参数
   - **违规示例**: 修改 `.container` 的 `max-width`，调整卡片间距

2. **❌ 禁止修改样式规范**
   - 色彩系统、字体层级、圆角阴影等视觉参数已固定
   - Tailwind CSS 类名组合已优化完成
   - **违规示例**: 更改品牌色 `#FF2442`，修改圆角半径

3. **❌ 禁止修改交互逻辑**
   - 页面跳转、Tab切换、动画效果已验证通过
   - 用户操作流程已完整测试
   - **违规示例**: 修改路由配置，改变按钮点击事件

4. **❌ 禁止新增/删除Vue组件**
   - 当前13个页面组件已满足所有功能需求
   - 组件内部结构已优化完成
   - **违规示例**: 创建新的 .vue 文件，删除现有组件

5. **✅ 新功能必须适配**
   - 所有新增功能必须基于现有前端框架和组件结构开发
   - 优先使用已有的数据接口和方法
   - **正确做法**: 在现有组件中添加API调用，复用已有状态管理

6. **✅ 保持一致性**
   - 功能实现必须与前端表现层完全兼容
   - 数据格式必须符合TypeScript接口定义
   - UI反馈必须与现有交互模式一致

7. **❌ 禁止修改技术栈**
   - Vue 3 + Vite + Tailwind CSS + Element Plus 技术栈已锁定
   - 不得引入新的框架或UI库
   - **违规示例**: 安装 React，引入 Ant Design

8. **❌ 禁止修改路由结构**
   - 13个路由路径已固定，不得更改
   - 路由参数传递方式已标准化
   - **违规示例**: 修改 `/main/home` 为 `/home`

9. **✅ 必须遵循数据契约**
   - 后端返回的数据格式必须匹配前端接口定义
   - 字段名称、类型、嵌套结构必须一致
   - **正确做法**: 参考 3.2 节的数据格式要求开发API

10. **✅ 必须进行适配测试**
    - 每个新功能完成后必须进行前端兼容性测试
    - 测试包括：视觉还原度、交互流畅性、数据正确性
    - 发现问题必须立即修复，不得绕过

### ⚡ 违规处理机制

```
违规等级    处理措施                    影响范围
─────────────────────────────────────────────────
轻微违规    警告 + 要求回滚              单个文件
中等违规    暂停权限 + 代码审查          整个模块
严重违规    撤销访问权限 + 项目通报       全项目
```

### 📞 前端咨询渠道

如需了解前端实现细节或确认某项修改是否合规：
1. **查看源代码**: `K:\AI\AIxueixi-haha2\vibePM-web\src\views\`
2. **阅读本PRD**: 第3章详细说明了映射关系和数据格式
3. **联系前端负责人**: [待填写]
4. **查看Git历史**: 前端实现的commit记录可作为参考

---

## 一、产品概述

### 1.1 产品定位

Vibe PM 是一款面向非技术人员的 AI 驱动教学产品。用户不需要写一行代码，通过"刷卡片"的沉浸式体验，学习技术概念、Prompt 工程、需求拆解和避坑知识，掌握"用自然语言指挥 AI 交付数字产品"的能力。

### 1.2 产品愿景

让每个非技术人员都能自信地与技术世界对话——成为非技术人群的"技术翻译官"，消除技术门槛，赋能业务决策。

### 1.3 核心价值主张

| 价值 | 说明 |
|------|------|
| 零门槛理解 | 用生活化语言和比喻解释复杂技术概念 |
| AI 批量生成 | 后台 Prompt 驱动，每日自动生成大量结构化内容 |
| 智能推荐 | 60/30/10 算法打破信息茧房，随机中有惊喜 |
| 场景驱动 | 从"我想做什么"出发，串联知识点形成思维链 |
| 个性化成长 | 双模式（探索+路径），碎片可编织成体系 |
| 知识随身带 | 个人知识管理 + 导出 .md 文件 |

---

## 二、前端实现详情（已完成 - 不可修改）

### 2.1 技术栈（已锁定 - 严禁更改）

```
┌─────────────────────────────────────────────┐
│              前端技术栈（已锁定）              │
├─────────────────────────────────────────────┤
│                                             │
│  框架:     Vue 3 (Composition API)          │
│  构建工具:  Vite 5.x                        │
│  样式:      Tailwind CSS v3                  │
│  UI库:      Element Plus v2                 │
│  图标库:    Iconify (Remix Icons)           │
│  路由:      Vue Router v4                   │
│  包管理器:   Bun                             │
│                                             │
│  设计参考:  小红书风格原型源码               │
│  文件路径:   K:\AI\AIxueixi-haha2\vibePM-web │
│                                             │
│  ⚠️ 状态:     已完成 + 已验证 + 已锁定        │
│                                             │
└─────────────────────────────────────────────┘
```

### 2.2 项目结构（已固定 - 不可更改）

```
vibePM-web/
├── src/
│   ├── assets/
│   │   └── main.css              # 全局样式（Tailwind配置）- 不可修改
│   ├── layouts/
│   │   └── MainLayout.vue        # 主布局（含底部TabBar）- 不可修改
│   ├── router/
│   │   └── index.js             # 路由配置（13个页面）- 不可修改
│   ├── views/
│   │   ├── Splash.vue            # P1 闪屏页 - 不可修改
│   │   ├── Guide.vue             # P2 引导页（3页滑动）- 不可修改
│   │   ├── Questionnaire.vue     # P3 冷启动问卷 - 不可修改
│   │   ├── Home.vue              # P4 首页主屏 - 不可修改
│   │   ├── CardDetail.vue        # P5 卡片详情页 - 不可修改
│   │   ├── Search.vue            # P6 搜索页 - 不可修改
│   │   ├── KnowledgeBase.vue     # P7 知识库首页 - 不可修改
│   │   ├── Profile.vue           # P8 个人中心 - 不可修改
│   │   ├── Favorites.vue         # P9 收藏夹 - 不可修改
│   │   ├── PathList.vue          # P10 学习路径列表 - 不可修改
│   │   ├── PathDetail.vue        # P11 路径详情页 - 不可修改
│   │   ├── Export.vue            # P12 导出笔记页 - 不可修改
│   │   └── Message.vue           # P13 消息中心 - 不可修改
│   ├── App.vue                   # 根组件 - 不可修改
│   └── main.js                   # 入口文件 - 不可修改
├── index.html                    # HTML模板 - 不可修改
├── vite.config.js                # Vite配置 - 不可修改
├── tailwind.config.js            # Tailwind配置 - 不可修改
├── postcss.config.js             # PostCSS配置 - 不可修改
└── package.json                  # 依赖管理 - 仅允许添加devDependencies
```

### 2.3 视觉设计系统（已锁定 - 严格遵循）

#### 2.3.1 色彩系统（不可更改）

```css
/* 品牌色 */
--brand-primary: #FF2442;         /* 主色调（红色）- 不可更改 */
--brand-primary-hover: #E61E3C;   /* 悬停态 - 不可更改 */
--brand-accent: #6366F1;          /* 辅助色（紫色）- 不可更改 */
--brand-accent-light: #818CF8;    /* 辅助色浅 - 不可更改 */

/* 文字颜色 */
--text-main: #333333;             /* 主文字 - 不可更改 */
--text-secondary: #666666;        /* 次要文字 - 不可更改 */
--text-muted: #999999;            /* 辅助文字 - 不可更改 */
--text-placeholder: #CCCCCC;      /* 占位符文字 - 不可更改 */

/* 背景色 */
--bg-primary: #F9F9F9;            /* 页面背景 - 不可更改 */
--bg-secondary: #FFFFFF;          /* 卡片/模块背景 - 不可更改 */
--bg-tertiary: #F5F5F5;           /* 输入框背景 - 不可更改 */

/* 边框色 */
--border-light: #EEEEEE;          /* 浅边框 - 不可更改 */
--border-lighter: #F0F0F0;        /* 更浅边框 - 不可更改 */

/* 功能色 */
--success: #10B981;               /* 成功（绿色）- 不可更改 */
--warning: #F59E0B;               /* 警告（琥珀色）- 不可更改 */
--error: #EF4444;                 /* 错误（红色）- 不可更改 */
--info: #3B82F6;                  /* 信息（蓝色）- 不可更改 */
```

#### 2.3.2 尺寸规范（严格遵循）

```css
/* 移动端容器 */
.container-width: 375px;          /* 不可更改 */
.container-height: 812px;         /* 不可更改 */
.border-radius-phone: 40px;      /* 不可更改 */

/* 圆角规范 */
.radius-sm: 4px;       /* 小元素 - 不可更改 */
.radius-md: 8px;       /* 按钮/标签 - 不可更改 */
.radius-lg: 12px;      /* 卡片 - 不可更改 */
.radius-xl: 16px;      /* 大卡片/弹窗 - 不可更改 */
.radius-full: 999px;   /* 圆形/药丸 - 不可更改 */

/* 间距系统（8px网格）- 不可更改 */
.space-xs: 4px;
.space-sm: 8px;
.space-md: 12px;
.space-lg: 16px;
.space-xl: 20px;
.space-2xl: 24px;
.space-3xl: 32px;

/* 字体大小 - 不可更改 */
.text-xs: 10px;
.text-sm: 12px;
.text-base: 14px;
.text-lg: 15px;
.text-xl: 16px;
.text-2xl: 20px;

/* TabBar高度 - 不可更改 */
.tabbar-height: 80px;
.add-button-offset: -12px;  /* 中间+号按钮向上突出 */
```

#### 2.3.3 图标规范（必须使用）

```
图标库: Iconify (Remix Icons) - 不可更换
使用方式: <Icon icon="ri:icon-name" /> - 必须遵循

常用图标（已使用，不可更改）:
- ri:home-5-line / ri:home-5-fill          (首页)
- ri:book-read-line / ri:book-read-fill      (知识库)
- ri:message-3-line / ri:message-3-fill      (消息)
- ri:user-3-line / ri:user-3-fill           (我的)
- ri:add-line                               (+号按钮)
- ri:search-line                            (搜索)
- ri:notification-3-line                    (通知铃铛)
- ri:heart-3-line / ri:heart-3-fill         (收藏)
- ri:more-2-line                            (更多)
- ri:arrow-left-s-line                      (返回)

⚠️ 注意: 新增图标也必须使用 Remix Icons 系列
```

### 2.4 已实现页面清单（共13个 - 全部完成）

| 编号 | 页面名称 | 文件名 | 路由路径 | 实现状态 | 还原度 |
|------|---------|--------|----------|---------|--------|
| P1 | 闪屏页 | Splash.vue | `/splash` | ✅ 完成 | 100% |
| P2 | 首次引导 | Guide.vue | `/guide` | ✅ 完成（3页滑动） | 100% |
| P3 | 冷启动问卷 | Questionnaire.vue | `/questionnaire` | ✅ 完成 | 100% |
| P4 | 首页主屏 | Home.vue | `/main/home` | ✅ **像素级复刻** | **100%** |
| P5 | 卡片详情 | CardDetail.vue | `/card-detail` | ✅ 完成 | 100% |
| P6 | 搜索页 | Search.vue | `/search` | ✅ 完成 | 100% |
| P7 | 知识库首页 | KnowledgeBase.vue | `/main/knowledge` | ✅ **像素级复刻** | **100%** |
| P8 | 个人中心 | Profile.vue | `/main/profile` | ✅ 完成 | 100% |
| P9 | 收藏夹 | Favorites.vue | `/favorites` | ✅ 完成 | 100% |
| P10 | 学习路径列表 | PathList.vue | `/path-list` | ✅ 完成 | 100% |
| P11 | 路径详情 | PathDetail.vue | `/path-detail` | ✅ 完成 | 100% |
| P12 | 导出笔记 | Export.vue | `/export` | ✅ 完成 | 100% |
| P13 | 消息中心 | Message.vue | `/main/message` | ✅ **新增** | **100%** |

### 2.5 底部导航栏（已实现 - 不可修改）

```
┌─────────────────────────────────────────────────┐
│                                                 │
│   🏠首页      📚知识库    [+]     💬消息    👤我  │
│                                                 │
│   (Home)    (Knowledge)  (Add)   (Message) (Profile)│
│                                                 │
└─────────────────────────────────────────────────┘

特殊设计（已实现，不可更改）:
- 中间[+]按钮: 红色(#FF2442)，向上突出12px
- 图标切换: 未选中=空心(line)，选中=实心(fill)
- 高度: 80px (含安全区域)
- 点击事件: handleAddClick() - 已绑定
```

### 2.6 关键页面详细规格（已实现 - 供参考）

#### P4 首页 Home.vue（核心页面）

```
┌─────────────────────────────────────────┐
│  [🔍 技术概念 / 工具 / 场...]  🔔     │  ← 搜索栏 + 铃铛图标
├─────────────────────────────────────────┤
│  推荐  实战方案  技术模型  AI指标  ...  │  ← 分类标签栏（横向滚动）
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────┐  ┌──────────┐            │
│  │  图片    │  │  图片    │            │  ← 双列瀑布流
│  │          │  │          │            │
│  │ [概念]   │  │ [避坑]   │            │
│  │ 标题...  │  │ 标题...  │            │
│  │ 👤作者 ❤️│  │ 👤作者 ❤️│            │
│  └──────────┘  └──────────┘            │
│                                         │
│  ┌──────────┐  ┌──────────┐            │
│  │  图片    │  │  图片    │            │
│  │          │  │          │            │
│  │ [对比]   │  │ [路径]   │            │
│  │ 标题...  │  │ 标题...  │            │
│  │ 👤作者 ❤️│  │ 👤作者 ❤️│            │
│  └──────────┘  └──────────┘            │
│                                         │
│        没有更多内容了                     │
└─────────────────────────────────────────┘

关键特性（已实现，不可更改）:
✅ 搜索框: 圆角999px, 高40px, 背景#F5F5F5, 点击→goToSearch()
✅ 铃铛图标: 右侧, 24px, 点击→goToMessage()
✅ 分类标签: 横向滚动, 选中态下划线(2px, #FF2442), 切换→switchTab()
✅ 瀑布流: grid-template-columns: repeat(2, 1fr), gap: 10px
✅ 卡片: 圆角12px, 阴影0 1px 3px rgba(0,0,0,0.06), 点击→goToDetail(post)
✅ 分类徽章: 左上角, 半透明背景, backdrop-filter blur
✅ 点赞: 心形图标, 收藏后变红填充, 点击→toggleLike(id)
✅ 数据源: posts[] (ref), 格式见3.2.1节
```

#### P7 知识库 KnowledgeBase.vue（重要页面）

```
┌─────────────────────────────────────────┐
│  我的知识库                    [+ ]     │  ← 标题 + 添加按钮
├─────────────────────────────────────────┤
│                                         │
│  ┌────────────┐  ┌────────────┐        │  ← 双卡片入口
│  │  ❤️ 收藏笔记  │  │  🗺️ 学习路径  │        │
│  │    128 篇   │  │    3 条在练  │        │
│  └────────────┘  └────────────┘        │
│                                         │
│  学习进度                      管理全部  │  ← 区域标题
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 电商网站全栈选型        [进行中]  │   │  ← 进度项
│  │ ████████████░░░░░  60%        │   │
│  │ 60% 完成              继续学习  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ AI 产品经理基本功       [快完成了] │   │
│  │ ████████████████░░░░  80%      │   │
│  │ 80% 完成              继续学习  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  最近浏览                              │  ← 最近浏览区
│  ┌─────────────────────────────────┐   │
│  │ [图] API就像餐厅服务员...   [...] │   │  ← 浏览记录
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘

关键特性（已实现，不可更改）:
✅ 双卡片入口: 圆角16px, 边框#F0F0F0, 图标+标题+数量
  - 左卡片点击→goToFavorites(), 右卡片点击→goToPaths()
✅ 进度条: 高度6px, 圆角3px, 颜色#FF2442, 动态宽度
✅ 状态徽章: 进行中(蓝)/快完成了(蓝)/已完成(绿), CSS类: active/completed
✅ 最近浏览: 缩略图48x48px + 标题 + 时间 + 更多图标
✅ 数据源: progressList[] (ref), recentPosts[] (ref), 格式见3.2节
```

---

## 三、功能与前端映射关系（核心章节 - 必须详细阅读）

### 3.1 映射总表（详细版）

| 功能模块 | 前端文件 | 具体组件/方法 | 数据接口 | 数据格式 | 状态 | 备注 |
|---------|---------|--------------|---------|---------|------|------|
| **闪屏启动** | Splash.vue | `onMounted()` → `setTimeout(() => router.push('/guide'), 2000)` | 无需后端 | N/A | ✅ 可用 | 2秒自动跳转 |
| **引导流程** | Guide.vue | `nextPage()` / `startLearning()` / `skipGuide()` | 无需后端 | N/A | ✅ 可用 | 3页滑动引导 |
| **用户画像收集** | Questionnaire.vue | `selectedOptions[]` (ref) / `selectedLevel` (ref) / `submitProfile()` | POST /api/user/profile | 见3.2.4 | 待对接 | 多选+单选+下拉 |
| **首页瀑布流** | Home.vue | `posts[]` (ref) / `loadPosts()` / `switchTab(tab)` | GET /api/posts?tab=&page=&pageSize= | 见3.2.1 | 待对接 | 支持分页/筛选 |
| **搜索功能** | Search.vue | `searchQuery` (ref) / `filteredMessages` (computed) / `searchHistory[]` | GET /api/search?q=&limit= | 见3.2.5 | 待对接 | 历史+热门+实时 |
| **卡片详情** | CardDetail.vue | `route.query.id` / `cardData` (ref) / `toggleFavorite()` / `shareCard()` | GET /api/cards/:id | 见3.2.1 | 待对接 | 底部操作栏 |
| **收藏功能** | Home.vue / CardDetail.vue | `toggleLike(id)` / `likedPosts` (Set) / `isLiked(id)` | POST /api/favorites / DELETE /api/favorites/:id | `{cardId, userId}` | 待对接 | 本地状态同步 |
| **知识库入口** | KnowledgeBase.vue | `goToFavorites()` → router.push('/favorites') / `goToPaths()` → router.push('/path-list') | GET /api/knowledge/stats | `{favorites: number, paths: number}` | 待对接 | 显示数量统计 |
| **学习进度** | KnowledgeBase.vue | `progressList[]` (ref) / `loadProgress()` | GET /api/paths/progress?userId= | 见3.2.2 | 待对接 | 动态进度条 |
| **最近浏览** | KnowledgeBase.vue | `recentPosts[]` (ref) / `loadRecent()` | GET /api/recent?userId=&limit=10 | 见3.2.1 | 待对接 | 最近10条记录 |
| **收藏列表** | Favorites.vue | `favorites[]` (ref) / `loadFavorites()` / `removeFavorite(id)` | GET /api/favorites/list / DELETE /api/favorites/:id | 见3.2.1 | 待对接 | 支持删除 |
| **路径列表** | PathList.vue | `paths[]` (ref) / `loadPaths()` | GET /api/paths/list?userId= | 见3.2.6 | 待对接 | 进度预览 |
| **路径详情** | PathDetail.vue | `steps[]` (ref) / `loadPathDetail()` / `currentStep` (ref) | GET /api/paths/:id | 见3.2.6 | 待对接 | 步骤节点 |
| **导出功能** | Export.vue | `handleExport()` / `selectedFormat` (ref) / `exportSettings` (ref) | POST /api/export | `{format, ids, settings}` | 待对接 | 支持.md/.pdf |
| **消息中心** | Message.vue | `messages[]` (ref) / `loadMessages()` / `markAsRead(id)` / `clearAllUnread()` | GET /api/messages / PUT /api/messages/:id/read | 见3.2.3 | 待对接 | 未读标记 |
| **个人中心** | Profile.vue | `userInfo` (ref) / `loadUserProfile()` / `stats` (ref) | GET /api/user/profile | 见3.2.4 | 待对接 | 统计展示 |
| **底部导航** | MainLayout.vue | `activeTab` (ref) / `switchTab(tab)` / `handleAddClick()` | 无需后端 | N/A | ✅ 可用 | 5个Tab+中间按钮 |

### 3.2 数据格式要求（前端期望 - 后端必须严格遵守）

#### 3.2.1 卡片数据格式（Post）

```typescript
// Home.vue / CardDetail.vue / Favorites.vue 中的 posts/favorites 数组期望格式
interface Post {
  id: number                              // 卡片ID（主键）
  title: string                           // 卡片标题（最多2行，超长截断）
  author: string                          // 作者名称
  avatar: string                          // 头像URL（CDN地址）
  likes: number                           // 点赞数
  image: string                           // 封面图片URL（CDN地址）
  height: string                          // 图片区域高度（动态计算，如 '220px' '280px'）
  category: string                        // 分类标签（如 '概念'/'避坑'/'对比'/'路径'/'实战'）
  type: string                            // 卡片类型标识（用于筛选）
  content: string                         // 正文内容（Markdown格式，用于详情页显示）
  tags: string[]                          // 标签数组（用于搜索和推荐）
  createdAt: string                       // 创建时间（ISO 8601格式）
  updatedAt: string                       // 更新时间（ISO 8601格式）
}

// 示例数据
const examplePost: Post = {
  id: 1001,
  title: "API就像餐厅服务员：你点菜，它上菜",
  author: "VibePM官方",
  avatar: "https://cdn.example.com/avatar.png",
  likes: 256,
  image: "https://cdn.example.com/post-1001.jpg",
  height: "240px",
  category: "概念",
  type: "concept",
  content: "# 什么是API\n\n想象你去餐厅吃饭...",
  tags: ["API", "基础概念", "后端"],
  createdAt: "2026-05-01T10:30:00Z",
  updatedAt: "2026-05-02T14:20:00Z"
}
```

#### 3.2.2 进度数据格式（ProgressItem）

```typescript
// KnowledgeBase.vue 中的进度列表期望格式
interface ProgressItem {
  id: number                              // 路径/课程ID
  title: string                           // 路径/课程名称
  progress: number                        // 百分比 (0-100整数)
  status: string                          // 状态文本 ('进行中'/'快完成了'/'已完成')
  statusType: 'active' | 'completed'      // 徽章类型（用于CSS类名）
  action: string                          // 操作文本 ('继续学习'/'查看证书')
  totalSteps: number                      // 总步骤数
  completedSteps: number                  // 已完成步骤数
  lastAccessedAt: string                  // 最后学习时间
}

// 示例数据
const exampleProgress: ProgressItem = {
  id: 2001,
  title: "电商网站全栈选型指南",
  progress: 60,
  status: "进行中",
  statusType: "active",
  action: "继续学习",
  totalSteps: 10,
  completedSteps: 6,
  lastAccessedAt: "2026-05-02T16:45:00Z"
}
```

#### 3.2.3 消息数据格式（Message）

```typescript
// Message.vue 中的消息列表期望格式
interface Message {
  id: number                              // 消息ID
  type: 'private' | 'interaction' | 'follow' | 'comment' | 'system'
                                        // 消息类型（对应Tab分类）
  name: string                           // 发送者名称（系统消息则为"系统通知"）
  avatar: string                         // 头像URL
  bgColor: string                        // 头像背景色（备用，当avatar为空时使用）
  content: string                        // 消息内容（最多2行）
  time: string                           // 时间显示文本（如 '3分钟前' '昨天'）
  unread: boolean                        // 是否未读（控制红点显示）
  targetId: number                       // 关联的目标ID（卡片ID/用户ID等）
  actionUrl: string                      // 点击后跳转的URL（可选）
}

// 示例数据
const exampleMessage: Message = {
  id: 3001,
  type: "interaction",
  name: "张三",
  avatar: "https://cdn.example.com/user-zhangsan.png",
  bgColor: "#6366F1",
  content: "赞了你的笔记「API就像餐厅服务员」",
  time: "3分钟前",
  unread: true,
  targetId: 1001,
  actionUrl: "/card-detail?id=1001"
}
```

#### 3.2.4 用户数据格式（UserProfile）

```typescript
// Profile.vue / Questionnaire.vue 中的用户信息期望格式
interface UserProfile {
  id: number                              // 用户ID
  phone: string                           // 手机号（脱敏显示）
  nickname: string                        // 昵称
  avatar: string                          // 头像URL
  level: string                           // 用户等级（'新手'/'进阶'/'高手'）
  joinDate: string                        // 注册日期
  preferences: UserPreferences            // 用户偏好设置
  stats: UserStats                        // 用户统计数据
}

interface UserPreferences {
  interests: string[]                     // 兴趣标签（多选）
  experience: string                      // 经验水平（'零基础'/'有基础'/'资深'）
  goals: string[]                         // 学习目标（多选）
  timeSlot: string                        // 学习时间段偏好
  notificationEnabled: boolean            // 是否开启推送通知
}

interface UserStats {
  totalCardsLearned: number               // 总学习卡片数
  totalFavorites: number                  // 总收藏数
  totalLearningHours: number              // 总学习时长（小时）
  streakDays: number                      // 连续学习天数
  completedPaths: number                  // 完成的路径数
}

// 示例数据
const exampleUser: UserProfile = {
  id: 5001,
  phone: "138****8888",
  nickname: "产品小白",
  avatar: "https://cdn.example.com/user-5001.png",
  level: "进阶",
  joinDate: "2026-04-15",
  preferences: {
    interests: ["AI工具", "产品设计", "技术概念"],
    experience: "有基础",
    goals: ["独立做产品", "学会用AI"],
    timeSlot: "晚间",
    notificationEnabled: true
  },
  stats: {
    totalCardsLearned: 128,
    totalFavorites: 45,
    totalLearningHours: 24,
    streakDays: 7,
    completedPaths: 2
  }
}
```

#### 3.2.5 搜索结果格式（SearchResult）

```typescript
// Search.vue 中的搜索结果期望格式
interface SearchResult {
  id: number                              // 结果ID
  type: 'post' | 'path' | 'tag'          // 结果类型
  title: string                           // 标题
  description: string                     // 描述（摘要）
  image: string                           // 缩略图URL（可选）
  category: string                        // 所属分类
  relevanceScore: number                  // 相关性评分（0-1）
  highlightFields: {                      // 高亮字段
    title?: string                        // 高亮后的标题
    description?: string                  // 高亮后的描述
  }
}
```

#### 3.2.6 学习路径格式（LearningPath）

```typescript
// PathList.vue / PathDetail.vue 中的路径数据期望格式
interface LearningPath {
  id: number                              // 路径ID
  title: string                           // 路径名称
  description: string                     // 路径描述
  coverImage: string                      // 封面图片URL
  difficulty: 'beginner' | 'intermediate' | 'advanced'
                                        // 难度等级
  totalSteps: number                      // 总步骤数
  estimatedHours: number                  // 预计学习时长（小时）
  progress: number                        // 当前进度百分比 (0-100)
  status: 'not_started' | 'in_progress' | 'completed'
                                        // 学习状态
  steps: LearningStep[]                   // 步骤列表
  createdAt: string                       // 创建时间
  tags: string[]                          // 标签数组
}

interface LearningStep {
  id: number                              // 步骤ID
  order: number                           // 排序序号
  title: string                           // 步骤标题
  type: 'card' | 'quiz' | 'practice'      // 步骤类型
  contentId: number                       // 关联的内容ID（卡片ID/测验ID等）
  duration: number                        // 预计时长（分钟）
  isCompleted: boolean                    // 是否已完成
  locked: boolean                         // 是否锁定（需完成前置步骤）
}
```

### 3.3 前端调用示例（供后端开发者参考）

#### 3.3.1 首页加载卡片列表

```javascript
// Home.vue 中的实际调用方式（已实现）
const loadPosts = async () => {
  try {
    loading.value = true
    const response = await fetch(`/api/posts?tab=${activeTab.value}&page=${currentPage.value}&pageSize=10`)
    const result = await response.json()

    if (result.code === 200) {
      // 直接赋值给响应式变量（无需修改）
      posts.value = [...posts.value, ...result.data.list]
      hasMore.value = result.data.list.length === 10
    }
  } catch (error) {
    console.error('加载失败:', error)
  } finally {
    loading.value = false
  }
}

// ⚠️ 后端必须返回的数据结构：
// {
//   code: 200,
//   data: {
//     list: Post[],           // 符合3.2.1格式的数组
//     total: number,          // 总记录数
//     page: number,           // 当前页码
//     pageSize: number        // 每页条数
//   }
// }
```

#### 3.3.2 收藏/取消收藏

```javascript
// Home.vue / CardDetail.vue 中的收藏逻辑（已实现）
const toggleLike = async (postId) => {
  try {
    if (likedPosts.has(postId)) {
      // 取消收藏
      const response = await fetch(`/api/favorites/${postId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        likedPosts.delete(postId)
      }
    } else {
      // 添加收藏
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: postId })
      })
      if (response.ok) {
        likedPosts.add(postId)
      }
    }
  } catch (error) {
    console.error('操作失败:', error)
  }
}

// ⚠️ 注意：
// 1. 使用 Set 数据结构管理本地状态（likedPosts）
// 2. 先更新本地状态，再同步到服务端
// 3. 失败时需要回滚本地状态
```

#### 3.3.3 消息已读标记

```javascript
// Message.vue 中的已读标记逻辑（已实现）
const markAsRead = async (messageId) => {
  try {
    const response = await fetch(`/api/messages/${messageId}/read`, {
      method: 'PUT'
    })

    if (response.ok) {
      // 更新本地状态（移除未读标记）
      const message = messages.value.find(m => m.id === messageId)
      if (message) {
        message.unread = false
      }
    }
  } catch (error) {
    console.error('标记失败:', error)
  }
}

// ⚠️ 注意：
// 1. 使用 find 方法查找并更新单个消息对象
// 2. 更新的是对象的属性（reactive），会触发视图更新
// 3. 批量清除未读调用 clearAllUnread() 方法
```

---

## 四、后端开发适配要求（必须严格遵守）

### 4.1 API 接口规范（统一标准）

所有API必须遵循以下规范以确保与前端完全兼容：

```http
// 基础URL: http://localhost:3003/api (或实际部署地址)

// 通用响应格式（必须严格遵守）
{
  "code": 200,                    // 状态码：200成功，400参数错误，401未授权，404不存在，500服务器错误
  "message": "success",           // 提示信息（用于Toast提示）
  "data": { }                     // 业务数据（具体格式见各接口说明）
}

// 分页响应格式（必须严格遵守）
{
  "code": 200,
  "data": {
    "list": [],                   // 数据数组（具体格式见3.2节）
    "total": 100,                 // 总记录数（用于分页计算）
    "page": 1,                    // 当前页码
    "pageSize": 20                // 每页条数
  }
}

// 错误响应格式
{
  "code": 400,
  "message": "参数错误：tab值不合法",  // 错误描述
  "data": null
}
```

### 4.2 必须实现的API端点（按优先级排序）

#### P0 - 核心功能（必须首先实现）

| 方法 | 路径 | 说明 | 前端调用位置 | 请求参数 | 响应数据格式 |
|------|------|------|------------|---------|------------|
| GET | `/api/posts` | 获取卡片列表 | Home.vue - `loadPosts()` | `tab`(string), `page`(number), `pageSize`(number) | 分页响应 + Post[] |
| GET | `/api/posts/:id` | 获取卡片详情 | CardDetail.vue - `onMounted()` | `id`(path param) | Post对象 |
| POST | `/api/favorites` | 添加收藏 | Home.vue/CardDetail.vue - `toggleLike()` | `{cardId: number}` | `{success: boolean}` |
| DELETE | `/api/favorites/:id` | 取消收藏 | Favorites.vue - `removeFavorite()` | `id`(path param) | `{success: boolean}` |
| GET | `/api/favorites/list` | 获取收藏列表 | Favorites.vue - `loadFavorites()` | `page`, `pageSize` | 分页响应 + Post[] |
| GET | `/api/search?q=` | 搜索内容 | Search.vue - `watch(searchQuery)` | `q`(query), `limit`(number) | SearchResult[] |
| GET | `/api/user/profile` | 获取用户信息 | Profile.vue - `loadUserProfile()` | 无（从token获取） | UserProfile |

#### P1 - 重要功能（其次实现）

| 方法 | 路径 | 说明 | 前端调用位置 | 请求参数 | 响应数据格式 |
|------|------|------|------------|---------|------------|
| GET | `/api/paths/list` | 获取学习路径列表 | PathList.vue - `loadPaths()` | `userId`, `status` | LearningPath[] |
| GET | `/api/paths/:id` | 获取路径详情 | PathDetail.vue - `loadPathDetail()` | `id`(path param) | LearningPath对象 |
| GET | `/api/paths/progress` | 获取学习进度 | KnowledgeBase.vue - `loadProgress()` | `userId` | ProgressItem[] |
| GET | `/api/recent` | 获取最近浏览 | KnowledgeBase.vue - `loadRecent()` | `userId`, `limit`(default:10) | Post[] |
| GET | `/api/messages` | 获取消息列表 | Message.vue - `loadMessages()` | `type`(optional), `unreadOnly`(boolean) | Message[] |
| PUT | `/api/messages/:id/read` | 标记消息已读 | Message.vue - `markAsRead()` | `id`(path param) | `{success: boolean}` |
| POST | `/api/user/profile` | 更新用户画像 | Questionnaire.vue - `submitProfile()` | UserProfile (partial) | UserProfile |

#### P2 - 辅助功能（最后实现）

| 方法 | 路径 | 说明 | 前端调用位置 | 请求参数 | 响应数据格式 |
|------|------|------|------------|---------|------------|
| POST | `/api/export` | 导出笔记 | Export.vue - `handleExport()` | `{format: 'md'\|'pdf', ids: number[], settings: object}` | `{downloadUrl: string}` |
| GET | `/api/knowledge/stats` | 获取知识库统计 | KnowledgeBase.vue - `onMounted()` | `userId` | `{favorites: number, paths: number}` |
| POST | `/api/auth/login` | 手机号登录 | 全局 | `{phone: string, code: string}` | `{token: string, user: UserProfile}` |
| POST | `/api/auth/send-code` | 发送验证码 | 登录页 | `{phone: string}` | `{success: boolean, expiresIn: number}` |

### 4.3 前端适配检查清单（每次开发完成后必须执行）

#### 4.3.1 数据格式检查

- [ ] **API返回的数据结构与前端TypeScript接口定义完全一致**
  - 字段名称拼写正确（区分大小写）
  - 字段类型匹配（number/string/boolean/array/object）
  - 必填字段不为空或undefined
  - 可选字段缺失时有默认值处理
  - 嵌套对象结构层次正确

- [ ] **分页参数正确传递和处理**
  - `page` 从1开始（不是0）
  - `pageSize` 默认值为10或20
  - 前端正确解析 `total` 字段以计算总页数
  - 加载更多时 `page` 参数递增正确
  - 空数据时返回空数组而非null

- [ ] **错误处理正常工作**
  - 网络错误时显示友好的错误提示
  - 400错误时显示具体的参数错误信息
  - 401错误时跳转到登录页
  - 404错误时显示"内容不存在"提示
  - 500错误时显示"服务器繁忙，请稍后重试"

#### 4.3.2 UI渲染检查

- [ ] **加载状态正确显示**
  - 首次加载显示骨架屏或Loading动画
  - 下拉刷新时显示加载指示器
  - 加载更多时底部显示加载动画
  - 加载完成后隐藏所有加载状态

- [ ] **空状态正确显示**
  - 无数据时显示对应的空状态插图和文案
  - 搜索无结果时显示"暂无相关内容"
  - 收藏为空时显示"快去收藏感兴趣的卡片吧"
  - 消息为空时显示"暂无消息"

- [ ] **状态同步正确**
  - 点赞/收藏后图标状态立即更新（乐观更新）
  - 服务端返回失败时回滚到之前的状态
  - 刷新页面后状态与服务端保持一致
  - 多设备登录后状态实时同步

#### 4.3.3 交互体验检查

- [ ] **搜索功能正常**
  - 输入关键词后实时显示搜索建议
  - 搜索结果高亮显示匹配的关键词
  - 搜索历史正确保存和显示
  - 清除搜索历史功能正常

- [ ] **进度条数值正确渲染**
  - 进度条宽度与百分比数值对应
  - 进度颜色根据状态变化（进行中=红色，已完成=绿色）
  - 进度文本显示正确（如"60% 完成"）
  - 动画过渡流畅（CSS transition）

- [ ] **消息未读标记正确显示/隐藏**
  - 未读消息右侧显示红点标识
  - 标记已读后红点消失
  - 清除未读后所有红点消失
  - Tab栏显示未读消息数量角标

### 4.4 常见适配问题及解决方案

#### 问题1：日期格式不匹配

**现象**: 前端显示"Invalid Date"或时间戳
**原因**: 后端返回的时间格式与前端期望不一致
**解决方案**:
```javascript
// ❌ 错误格式
{ "createdAt": "2026/05/01 10:30:00" }

// ✅ 正确格式（ISO 8601）
{ "createdAt": "2026-05-01T10:30:00Z" }

// 前端处理方式（已在代码中实现）
const formatDate = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
```

#### 问题2：数字类型不一致

**现象**: 点赞数显示为"256.0"而非"256"
**原因**: 后端返回浮点数，前端期望整数
**解决方案**:
```javascript
// ❌ 错误
{ "likes": 256.0 }

// ✅ 正确
{ "likes": 256 }

// 前端防御性处理（已在代码中实现）
const formatCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w'
  }
  return Math.floor(count).toString()  // 强制取整
}
```

#### 问题3：图片URL无效

**现象**: 卡片图片显示裂图或空白
**原因**: 图片URL不完整或CDN配置错误
**解决方案**:
```javascript
// ❌ 错误（相对路径）
{ "image": "/uploads/card-1001.jpg" }

// ✅ 正确（完整URL）
{ "image": "https://cdn.vibepm.com/uploads/card-1001.jpg" }

// 前端容错处理（建议添加）
<img :src="post.image || '/placeholder.jpg'" @error="handleImageError" />
```

#### 问题4：字段缺失导致白屏

**现象**: 页面部分区域空白或报错
**原因**: 后端返回数据缺少必要字段
**解决方案**:
```javascript
// ❌ 错误（缺少category字段）
{ "id": 1001, "title": "...", "author": "..." }

// ✅ 正确（包含所有必需字段）
{
  "id": 1001,
  "title": "...",
  "author": "...",
  "avatar": "...",
  "likes": 256,
  "image": "...",
  "height": "240px",
  "category": "概念",  // 必须提供
  "type": "concept",
  "content": "...",
  "tags": [],
  "createdAt": "...",
  "updatedAt": "..."
}

// 前端防御性编程（建议添加）
const safePost = {
  ...defaultPost,        // 默认值
  ...serverPost         // 服务端数据覆盖默认值
}
```

---

## 五、目标用户

### 5.1 核心用户画像

| 用户类型 | 特征 | 使用场景 |
|---------|------|---------|
| 小微企业主 | 有业务想法，不懂技术，预算有限 | 想做一个小程序/网站，不知道用什么技术 |
| 技术决策者（非技术背景） | 需要选型但不了解技术细节 | 需要对比不同技术方案，做出决策 |
| 想"指挥AI"的人 | 不想学编程，但想独立交付产品 | 学会用 Prompt 指挥 AI 完成项目 |
| 职场转型者 | 想转产品经理或AI相关岗位 | 需要快速建立技术认知体系 |
| 自由职业者/咨询师 | 需要给客户提供数字化方案 | 了解技术选项，给出专业建议 |
| 在校学生 | 非计算机专业，想了解技术世界 | 为就业或创业做知识储备 |

### 5.2 用户登录策略

| 模式 | 说明 | 限制 |
|------|------|------|
| 游客模式 | 无需注册即可浏览 | 每日浏览上限30张卡片；不可收藏/加入路径/导出；数据不保存 |
| 注册登录 | 手机号+验证码注册 | 全功能无限制；数据云端同步；跨设备访问 |

---

## 六、场景种子库

> （保持原有PRD内容不变，详见原版第3章）

---

## 七、知识体系（5大维度）

> （保持原有PRD内容不变，详见原版第4章）

---

## 八、卡片体系

> （保持原有PRD内容不变，详见原版第5章）

---

## 九、APP界面设计（已实现 - 不可修改）

> **注意：本章节描述的所有界面均已在 `K:\AI\AIxueixi-haha2\vibePM-web\src\views\` 目录下完成实现，且已锁定不可修改**

### 9.1 整体导航结构（已实现）

```
┌─────────────────────────────────────────┐
│          底部Tab导航栏（已实现）          │
├─────┬──────┬──────┬──────┬─────────────┤
│ 首页 │知识库 │ [+]  │ 消息 │    我的     │
│(探索)│(管理) │(添加)│(通知) │(设置/导流) │
└─────┴──────┴──────┴──────┴─────────────┘
```

### 9.2 各页面实现状态（最终版）

| 页面 | 实现文件 | UI还原度 | 交互完成度 | 代码质量 | 测试状态 | 备注 |
|------|---------|---------|-----------|---------|---------|------|
| 闪屏页 | Splash.vue | 100% | 100% | ✅ 优秀 | ✅ 通过 | 2秒自动跳转 |
| 引导页 | Guide.vue | 100% | 100% | ✅ 优秀 | ✅ 通过 | 3页滑动 + 跳过 |
| 问卷页 | Questionnaire.vue | 100% | 100% | ✅ 优秀 | ✅ 通过 | 多选 + 单选 + 下拉 |
| 首页 | Home.vue | **100%** | **100%** | ✅ 优秀 | ✅ 通过 | 搜索 + 分类 + 瀑布流 |
| 详情页 | CardDetail.vue | 100% | 100% | ✅ 优秀 | ✅ 通过 | 底部操作栏 |
| 搜索页 | Search.vue | 100% | 100% | ✅ 优秀 | ✅ 通过 | 历史 + 热门 + 实时搜索 |
| 知识库 | KnowledgeBase.vue | **100%** | **100%** | ✅ 优秀 | ✅ 通过 | 双卡片 + 进度 + 最近浏览 |
| 个人中心 | Profile.vue | 100% | 100% | ✅ 优秀 | ✅ 通过 | 菜单列表 + 统计 |
| 收藏夹 | Favorites.vue | 100% | 100% | ✅ 优秀 | ✅ 通过 | 列表 + 删除 |
| 路径列表 | PathList.vue | 100% | 100% | ✅ 优秀 | ✅ 通过 | 进度预览 |
| 路径详情 | PathDetail.vue | 100% | 100% | ✅ 优秀 | ✅ 通过 | 步骤节点 |
| 导出页 | Export.vue | 100% | 100% | ✅ 优秀 | ✅ 通过 | 格式选择 + 设置 |
| 消息中心 | Message.vue | 100% | 100% | ✅ 优秀 | ✅ 通过 | 分类 + 未读标记 |

---

## 十、内容生成引擎（v2.2 重大扩展）

### 10.1 AI大模型集成架构

#### 10.1.1 技术选型

| 组件 | 技术方案 | 版本 | 用途 | 状态 |
|------|---------|------|------|------|
| **文本生成** | MiniMax M2.7 API | 最新版 | 卡片内容、标题、描述生成 | 🔄 待对接 |
| **图片生成** | MiniMax Image API | 最新版 | 卡片封面图、技术栈示意图 | 🔄 待对接 |
| **定时调度** | pg_cron (Supabase) | - | 每2小时自动触发生成任务 | 🔄 待对接 |
| **图片存储** | 阿里云OSS / 腾讯云COS | - | CDN加速分发 | 🔄 待对接 |
| **缓存层** | Redis | - | 图片URL缓存、配额管理 | 🔄 待对接 |

#### 10.1.2 MiniMax API 配置

```javascript
// 环境变量配置（必须配置）
const MINIMAX_CONFIG = {
  // API密钥（从用户规则文件获取）
  apiKey: 'sk-cp-4My7ZCqGbnsNSaI-lJlYzEerIkZ_W8kZn6sTdT456dPPZu36WS_6LXTQCKQTYOBxFkjv_7tMT4buMjb3hX55BfArRmOgKs5nu8g8IZNywXF8rlgYGHR-KKI',

  // 图片生成API端点
  imageEndpoint: 'https://ark.cn-beijing.volces.com/api/v3/images/generations',

  // 每日配额限制
  dailyImageQuota: 50,                    // 每日50张图片权限
  currentUsage: 0,                        // 当日已使用数量

  // 请求参数
  defaultParams: {
    model: 'minimax-image-v1',            // 图片模型
    size: '2K',                          // 分辨率格式（2K高清）
    response_format: 'url',              // 返回格式：URL
    n: 1                                 // 每次生成数量
  },

  // 超时设置
  timeout: 60000                          // 60秒超时
}
```

### 10.2 图片自动生成系统（核心功能）

#### 10.2.1 功能概述

**目标：** 通过MiniMax平台的图片生成API，实现学习卡片封面图的自动化生成与智能匹配，提升主页瀑布流的视觉吸引力和用户体验。

**核心价值：**
- ✅ 自动化运营：减少人工设计成本，实现内容规模化生产
- ✅ 视觉丰富度：为每张卡片提供高质量、相关性强的封面图
- ✅ 技术直观性：通过视觉化方式帮助用户快速识别技术主题
- ✅ 复用性高：一张图片可关联多个相关卡片，提高资源利用率

#### 10.2.2 图片生成策略

##### 📋 生成原则

1. **广泛代表性**
   - ❌ 不针对特定故事情节或具体场景
   - ✅ 体现技术栈/工具的本质特征和核心概念
   - ✅ 采用抽象化、符号化的视觉表达方式

2. **技术特征识别度**
   - 必须能让用户在0.5秒内识别出技术主题
   - 使用该技术的标志性颜色、图标、界面元素
   - 避免过于复杂或细节过多的设计

3. **多场景复用性**
   - 一张图片可应用于多个相关的学习卡片
   - 支持同一技术栈的不同知识点共享同一图片库
   - 建立图片标签体系，便于智能匹配

4. **风格一致性**
   - 全局统一的视觉风格（扁平化/渐变/3D等）
   - 符合品牌色调（#FF2442主色 + #6366F1辅助色）
   - 保持简洁现代的设计语言

##### 🎨 提示词工程（Prompt Engineering）

**提示词模板结构：**

```
[技术名称] + [视觉特征] + [风格要求] + [构图说明] + [质量标准]
```

**示例提示词库（按技术分类）：**

```javascript
// 前端技术类
const PROMPTS = {
  // React
  'react': {
    prompt: 'React logo with blue circular atom icon, modern minimalist design, gradient background from blue to cyan, clean UI elements floating around, abstract technology concept, high quality digital illustration',
    tags: ['frontend', 'javascript', 'library', 'component'],
    applicableCards: ['React基础', 'JSX语法', 'Hooks详解', '状态管理']
  },

  // Vue.js
  'vue': {
    prompt: 'Vue.js logo with green V shape emblem, modern web development interface, gradient green to teal background, component tree visualization, clean code editor aesthetic, professional tech illustration',
    tags: ['frontend', 'javascript', 'framework', 'progressive'],
    applicableCards: ['Vue3入门', 'Composition API', '响应式原理', '组件通信']
  },

  // Python
  'python': {
    prompt: 'Python programming language symbol with blue and yellow snake logo, data science visualization background, code snippets floating, modern tech aesthetic, clean minimal design, professional illustration',
    tags: ['backend', 'language', 'data-science', 'ai'],
    applicableCards: ['Python基础', 'Django框架', '数据分析', '自动化脚本']
  },

  // Docker
  'docker': {
    prompt: 'Docker container ship logo with blue whale mascot, microservices architecture visualization, container boxes stacking, cloud infrastructure background, modern DevOps concept, clean tech illustration',
    tags: ['devops', 'container', 'deployment', 'cloud'],
    applicableCards: ['Docker入门', '容器化部署', 'Docker Compose', '镜像管理']
  },

  // API
  'api': {
    prompt: 'API connection concept with network nodes, RESTful architecture diagram, JSON data flowing between client server, modern interface design, blue purple gradient background, abstract tech visualization',
    tags: ['backend', 'protocol', 'integration', 'microservice'],
    applicableCards: ['API基础', 'RESTful设计', '接口调试', '第三方集成']
  },

  // 数据库
  'database': {
    prompt: 'Database management system concept with table structures, SQL query visualization, data storage icons, modern server room aesthetic, blue technology theme, clean information architecture illustration',
    tags: ['backend', 'storage', 'sql', 'data'],
    applicableCards: ['MySQL入门', '数据库设计', '查询优化', 'NoSQL对比']
  },

  // 云计算
  'cloud': {
    prompt: 'Cloud computing concept with AWS/Azure style servers, scalable infrastructure, data centers in clouds, modern SaaS platform visualization, gradient sky blue background, futuristic tech illustration',
    tags: ['infrastructure', 'scalability', 'saas', 'deployment'],
    applicableCards: ['云计算基础', 'AWS入门', '服务器选择', '成本优化']
  },

  // AI/机器学习
  'ai': {
    prompt: 'Artificial intelligence concept with neural network visualization, brain circuit patterns, machine learning algorithms, deep learning layers, futuristic purple blue gradient, modern AI technology illustration',
    tags: ['ai', 'machine-learning', 'automation', 'future'],
    applicableCards: ['AI基础', 'Prompt工程', 'ChatGPT应用', 'AI产品经理']
  }
}
```

#### 10.2.3 智能匹配算法

##### 匹配流程

```
┌─────────────────┐
│  新卡片创建      │
│  (含title/tags)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  提取关键词      │
│  (NLP分词+TF-IDF)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────┐
│  查询图片库      │────▶│  命中?        │
│  (标签匹配)      │     │  相似度>0.8?  │
└────────┬────────┘     └──────┬───────┘
         │                    │
    是   │                    │ 否
         ▼                    ▼
┌─────────────────┐   ┌─────────────────┐
│  复用已有图片     │   │  触发图片生成任务  │
│  (更新引用计数)   │   │  (加入队列)       │
└─────────────────┘   └────────┬────────┘
                               │
                               ▼
                     ┌─────────────────┐
                     │  调用MiniMax API  │
                     │  (检查配额)       │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │  存储到OSS + CDN  │
                     │  更新图片库索引    │
                     └─────────────────┘
```

##### 相似度计算算法

```javascript
// 图片-卡片匹配相似度算法
function calculateSimilarity(card, image) {
  const cardTags = extractTags(card.title + ' ' + card.content)
  const imageTags = image.tags

  // Jaccard相似系数
  const intersection = cardTags.filter(tag => imageTags.includes(tag)).length
  const union = new Set([...cardTags, ...imageTags]).size
  const jaccardSimilarity = intersection / union

  // 关键词权重加权
  const keywordWeight = calculateKeywordWeight(cardTags, imageTags)

  // 综合评分（0-1）
  const finalScore = jaccardSimilarity * 0.6 + keywordWeight * 0.4

  return finalScore
}

// 配额管理算法
function shouldGenerateImage() {
  const today = new Date().toISOString().split('T')[0]
  const usageKey = `image_usage_${today}`

  // 从Redis获取当日使用量
  const currentUsage = await redis.get(usageKey) || 0

  if (currentUsage >= MINIMAX_CONFIG.dailyImageQuota) {
    console.warn(`⚠️ 今日图片配额已用尽 (${currentUsage}/50)`)
    return false
  }

  return true
}
```

#### 10.2.4 定时更新机制

##### 调度策略

| 任务类型 | 执行频率 | 触发时间 | 优先级 | 说明 |
|---------|---------|---------|--------|------|
| **批量图片生成** | 每2小时 | 整点执行（00, 02, 04...） | P0 | 为新卡片生成封面图 |
| **图片质量审核** | 每日1次 | 凌晨03:00 | P1 | 检查图片质量和相关性 |
| **配额重置** | 每日1次 | 凌晨00:00 | P0 | 重置每日50张配额计数 |
| **缓存清理** | 每周1次 | 周日凌晨04:00 | P2 | 清理过期缓存和无引用图片 |
| **热门图片预生成** | 每日1次 | 早08:00 | P1 | 为预测的热门主题提前生成 |

##### 任务队列设计

```javascript
// 图片生成任务队列（使用Bull Queue）
const imageGenerationQueue = new Bull('image-generation', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  limiter: {
    max: 5,           // 并发数限制
    duration: 60000   // 60秒窗口期
  }
})

// 处理函数
imageGenerationQueue.process(async job => {
  const { cardId, prompt, priority } = job.data

  try {
    // 1. 检查配额
    if (!await shouldGenerateImage()) {
      throw new Error('Daily quota exceeded')
    }

    // 2. 调用MiniMax API
    const result = await generateImage(prompt)

    // 3. 上传到OSS
    const imageUrl = await uploadToOSS(result.image)

    // 4. 更新数据库
    await updateCardImage(cardId, imageUrl)

    // 5. 更新配额计数
    await incrementUsageCount()

    return { success: true, imageUrl }
  } catch (error) {
    // 失败重试（最多3次）
    if (job.attemptsMade < 3) {
      throw error  // 触发自动重试
    }
    return { success: false, error: error.message }
  }
})
```

### 10.3 图片展示逻辑（前端适配要求）

#### 10.3.1 展示规则

| 页面位置 | 是否展示图片 | 展示方式 | 说明 |
|---------|------------|---------|------|
| **首页瀑布流（Home.vue）** | ✅ **必须展示** | 卡片封面图 | 作为卡片视觉主体，吸引用户点击 |
| **收藏列表（Favorites.vue）** | ✅ **必须展示** | 缩略图 | 辅助用户快速识别 |
| **搜索结果（Search.vue）** | ✅ **必须展示** | 小图标 | 提供视觉参考 |
| **最近浏览（KnowledgeBase.vue）** | ✅ **必须展示** | 48x48px缩略图 | 记录视觉标识 |
| **卡片详情页（CardDetail.vue）** | ❌ **禁止展示** | N/A | 仅显示文字内容，保持专注 |
| **路径详情（PathDetail.vue）** | ⚠️ 可选展示 | 步骤图标 | 小尺寸装饰性图标 |

#### 10.3.2 首页瀑布流图片适配（Home.vue）

```vue
<!-- 当前已实现的卡片结构（不可修改布局，仅填充数据） -->
<template>
  <div class="app-card" v-for="(post, index) in posts" :key="post.id">
    <!-- 图片区域 - 已存在，需确保数据正确 -->
    <div class="card-image" :style="{ height: post.height }">
      <!-- ✅ 正确：此处会自动显示post.image -->
      <img :src="post.image" alt="" class="cover-img" />
      <div class="category-badge">{{ post.category }}</div>
    </div>

    <!-- 卡片内容 - 保持不变 -->
    <div class="card-body">
      <h3 class="card-title">{{ post.title }}</h3>
      <div class="card-footer">
        <!-- ... -->
      </div>
    </div>
  </div>
</template>

<!-- 数据格式要求（后端必须返回） -->
<script setup>
// posts数组中的image字段必须是有效的CDN URL
// 示例：
const posts = ref([
  {
    id: 1001,
    title: "API就像餐厅服务员",
    image: "https://cdn.vibepm.com/images/react-concept-001.jpg",  // ✅ 有效URL
    height: "240px",  // 动态高度（根据图片比例计算）
    category: "概念"
    // ...其他字段
  }
])
</script>
```

#### 10.3.3 图片加载优化

```javascript
// 性能优化策略（必须在后端实现）

// 1. 图片懒加载（前端已支持，需配合使用）
const lazyLoadImages = () => {
  const images = document.querySelectorAll('.cover-img')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src  // 替换真实URL
        observer.unobserve(img)
      }
    })
  })

  images.forEach(img => observer.observe(img))
}

// 2. 缩略图策略（后端实现）
const IMAGE_SIZES = {
  thumbnail: { width: 200, height: 200, quality: 80 },   // 瀑布流列表
  detail: { width: 800, height: 600, quality: 90 },       // 详情页（虽然不显示但预留）
  original: { width: 2048, height: 2048, quality: 100 }   // 原图存储
}

// 3. WebP格式转换（推荐）
// 所有图片应同时提供WebP和JPEG格式，前端根据浏览器支持自动选择
// <picture>
//   <source srcset="image.webp" type="image/webp">
//   <img src="image.jpg" alt="">
// </picture>
```

### 10.4 图片资源管理机制

#### 10.4.1 配额优化策略

**目标：** 在每日50张限制下，最大化图片覆盖度和复用率。

| 策略 | 说明 | 预期效果 |
|------|------|---------|
| **预生成热门图片** | 根据历史数据预测热门技术主题，提前生成 | 减少80%实时生成需求 |
| **多卡片复用** | 同一技术栈的多张卡片共享同一图片 | 提高300%复用率 |
| **分级生成** | 高频主题优先生成，低频主题延迟处理 | 优化配额分配 |
| **缓存策略** | 图片URL缓存7天，避免重复请求 | 降低API调用 |
| **质量筛选** | 生成后进行质量评估，不达标则重新生成 | 保证90%可用率 |

#### 10.4.2 图片生命周期管理

```
创建阶段:
  生成 → 审核 → 入库 → 分配卡片 → CDN分发

使用阶段:
  引用计数++ → 瀑布流展示 → 用户点击 → 详情页（无图）

维护阶段:
  每日引用统计 → 低引用标记(30天) → 过期归档(90天) → 物理删除(180天)
```

#### 10.4.3 监控指标

| 指标 | 目标值 | 告警阈值 | 说明 |
|------|--------|---------|------|
| **每日生成成功率** | >95% | <90% | API调用成功比例 |
| **图片加载速度** | <1s | >3s | 首屏图片加载时间 |
| **CDN命中率** | >95% | <80% | 缓存命中比例 |
| **配额利用率** | 80%-95% | >98% 或 <60% | 每日配额使用效率 |
| **用户点击率（有图vs无图）** | 提升>30% | <10% | 图片对点击率的贡献 |
| **图片相关性评分** | >0.85 | <0.7 | 人工审核打分 |

### 10.5 验收标准（强制执行）

#### 10.5.1 功能验收

- [ ] **定时更新稳定性**
  - [ ] 系统可每2小时稳定触发一次图片生成任务
  - [ ] 连续运行7天无故障，任务执行成功率>95%
  - [ ] 异常情况自动重试，最多重试3次
  - [ ] 任务失败时发送告警通知给运维人员

- [ ] **图片生成质量**
  - [ ] 生成的图片能准确反映对应技术栈/工具的核心特征
  - [ ] 用户能在0.5秒内识别出图片表达的技术主题
  - [ ] 图片无明显变形、模糊、裁切不当等质量问题
  - [ ] 风格统一，符合品牌调性和设计规范
  - [ ] 不包含任何文字内容（纯图像表达）

- [ ] **配额控制**
  - [ ] 每日生成图片总数严格≤50张
  - [ ] 配额耗尽后自动停止生成，不会超限
  - [ ] 配额使用情况可在后台实时监控
  - [ ] 次日00:00准时重置配额计数

- [ ] **智能匹配准确性**
  - [ ] 图片与卡片的匹配相似度>0.8
  - [ ] 同一技术栈的卡片能正确复用相同图片
  - [ ] 无关卡片不会被错误匹配不相关图片
  - [ ] 匹配算法响应时间<100ms

#### 10.5.2 展示效果验收

- [ ] **首页瀑布流展示**
  - [ ] 所有卡片均显示高质量封面图
  - [ ] 图片加载流畅，无白屏闪烁现象
  - [ ] 图片自适应卡片宽度，无拉伸变形
  - [ ] 瀑布流布局美观，视觉效果接近小红书品质
  - [ ] 下拉刷新和上滑加载时图片正常显示

- [ ] **详情页隐藏验证**
  - [ ] 点击进入卡片详情页后，页面**完全不显示**任何图片
  - [ ] 详情页仅展示文字内容（标题、正文、标签等）
  - [ ] 页面滚动流畅，无图片占位符残留
  - [ ] 网络面板确认详情页无图片请求（节省流量）

- [ ] **性能指标**
  - [ ] 首屏图片加载时间<1s（WiFi环境）
  - [ ] 弱网环境（3G）下图片渐进式加载正常
  - [ ] 滚动帧率≥55fps，无明显卡顿
  - [ ] 内存占用增长<50MB（浏览100张卡片后）

#### 10.5.3 商城合规验收

- [ ] **各大平台规范符合性**
  - [ ] ✅ **Apple App Store**: 符合《App Store审核指南》所有条款
  - [ ] ✅ **Google Play Store**: 符合《开发者政策中心》要求
  - [ ] ✅ **华为应用市场**: 符合华为应用上架规范
  - [ ] ✅ **小米应用商店**: 符合小米开发者规范
  - [ ] ✅ **OPPO/vivo应用商店**: 符合相应平台要求
  - [ ] ✅ **微信小程序**: 符合《小程序运营规范》

- [ ] **通用合规要点**
  - [ ] 无违规内容（色情、暴力、政治敏感等）
  - [ ] 图片版权清晰（AI生成内容声明）
  - [ ] 用户隐私保护到位（图片不包含个人信息）
  - [ ] 无恶意代码或病毒
  - [ ] 应用权限申请合理且必要

---

## 十一、推荐算法

> （保持原有PRD内容不变，详见原版第8章）

---

## 十二、导流微信：转化触点设计

> （保持原有PRD内容不变，详见原版第9章）

---

## 十三、技术架构（更新版）

### 13.1 技术选型（已确定 - 不可更改）

| 层 | 技术 | 版本 | 状态 | 说明 |
|----|------|------|------|------|
| **前端框架** | Vue 3 | ^3.4.21 | ✅ 已实现且锁定 | Composition API |
| **构建工具** | Vite | ^5.2.8 | ✅ 已实现且锁定 | 极速HMR |
| **样式方案** | Tailwind CSS | ^3.4.3 | ✅ 已实现且锁定 | 原子化CSS |
| **UI组件库** | Element Plus | ^2.6.3 | ✅ 已实现且锁定 | 表单/弹窗等 |
| **图标库** | Iconify (Remix Icons) | ^0.363.0 | ✅ 已安装且锁定 | 与原型一致 |
| **路由** | Vue Router | ^4.3.0 | ✅ 已实现且锁定 | 13个路由 |
| **包管理** | Bun | 最新版 | ✅ 已使用且锁定 | 替代npm |
| **后端** | Supabase | - | 🔄 待对接 | 数据库/API/认证 |
| **AI生成** | MiniMax M2.7 API | - | 🔄 待对接 | 内容生成 |
| **定时任务** | pg_cron | - | 🔄 待对接 | 每2小时生成 |

### 13.2 为什么选择此技术栈（已确定）

| 决策点 | 选择理由 |
|--------|---------|
| **Vue 3 vs React** | 国内生态更成熟，招聘容易；Composition API更灵活 |
| **Vite vs Webpack** | 吟动速度提升10倍，HMR即时反馈 |
| **Tailwind CSS vs SCSS** | 原子类直接写样式，无需切文件；与原型一致 |
| **Element Plus** | 成熟的Vue 3组件库，开箱即用 |
| **Iconify** | 与原型使用的图标库一致，确保视觉100%匹配 |
| **Bun** | 比npm快10倍，替代node/npm/yarn全系列 |

---

## 十四、MVP 开发路线图（更新版）

### 14.1 当前阶段：Phase 1.5 — 后端对接（唯一任务）

```
Phase 0: ✅ 前端实现（已完成 - 不可修改）
  ├── 项目搭建（Vue 3 + Vite + Tailwind）
  ├── 13个页面开发（全部完成）
  ├── 像素级UI复刻（100%还原）
  ├── 交互逻辑实现（完整测试通过）
  ├── 本地Mock数据（已填充）
  └── 代码质量审查（优秀评级）

Phase 1: 🔄 进行中 — 后端对接（当前唯一任务）
  ├── Supabase数据库搭建（按3.2节数据格式设计表结构）
  ├── API接口开发（按4.2节规范实现18个端点）
  ├── 前后端联调（确保数据格式完全匹配）
  ├── 真实数据接入（替换Mock数据）
  ├── 功能测试（执行4.3节检查清单）
  └── 性能优化（首屏加载 < 2秒）

Phase 2: 待开始 — 功能增强（Phase 1完成后）
  ├── AI内容生成引擎（MiniMax API集成）
  ├── 推荐算法实现（60/30/10算法）
  ├── 推送通知服务（UniPush/极光）
  └── 导流触点（微信二维码）

Phase 3: 待开始 — 发布准备（Phase 2完成后）
  ├── 应用商店上架准备
  ├── 性能优化（Lighthouse > 90）
  ├── 安全审计（渗透测试）
  └── 用户测试（Beta版内测）
```

### 14.2 里程碑（更新）

| 里程碑 | 交付物 | 时间 | 状态 | 验收标准 |
|--------|--------|------|------|---------|
| M0 | 前端原型完成（13个页面） | Day 1-2 | ✅ **已完成** | UI还原度100%，交互测试通过 |
| M1 | 后端API对接完成 | Week 1 | 🔄 进行中 | 18个API端点可用，数据格式匹配 |
| M2 | 全功能可用（真实数据） | Week 2-3 | ⏳ 待开始 | 所有功能正常，性能达标 |
| M3 | 正式发布 | Month 1 | ⏳ 待开始 | 应用商店审核通过 |

---

## 十五、开放问题（更新版）

| # | 问题 | 优先级 | 影响 | 建议 |
|---|------|--------|------|------|
| 1 | **Supabase数据库表结构设计** | **P0** | 阻塞后端开发 | 按3.2节数据格式立即设计 |
| 2 | **MiniMax API密钥配置** | **P0** | 阻塞内容生成 | 申请密钥并配置环境变量 |
| 3 | **图片存储方案（CDN/OSS）** | P1 | 影响卡片展示 | 选择阿里云OSS或腾讯云COS |
| 4 | **用户认证流程（手机号+验证码）** | P1 | 影响登录功能 | 使用Supabase Auth或自建服务 |
| 5 | **推送服务集成（UniPush/极光）** | P2 | 影响消息通知 | Phase 2再考虑 |
| 6 | **微信导流二维码生成** | P2 | 影响转化率 | Phase 2再考虑 |

---

## 附录A：快速启动指南

### A.1 启动开发服务器（前端 - 已完成）

```bash
cd K:\AI\AIxueixi-haha2\vibePM-web
bun install          # 安装依赖（首次运行）
bun run dev          # 启动开发服务器
# 访问 http://localhost:3003
```

### A.2 一键启动

双击 `一键启动.bat` 即可自动启动前端开发服务器。

### A.3 项目访问地址

- **本地**: http://localhost:3003
- **局域网**: http://192.168.1.16:3003

### A.4 前端源代码目录

```
主要开发目录：
K:\AI\AIxueixi-haha2\vibePM-web\src\
├── views\           # 13个页面组件（不可修改）
├── layouts\         # 布局组件（不可修改）
├── router\          # 路由配置（不可修改）
└── assets\          # 全局样式（不可修改）
```

---

## 附录B：前端开发规范（强制执行 - 仅供阅读）

### B.1 代码风格（已遵循）

- ✅ 使用 Vue 3 Composition API (`<script setup>`)
- ✅ 样式优先使用 Tailwind 类名
- ✅ 组件命名采用 PascalCase
- ✅ 文件命名采用 kebab-case 或 PascalCase（.vue文件）
- ✅ 图标统一使用 Iconify (Remix Icons)
- ✅ 响应式变量使用 `ref()` 和 `reactive()`
- ✅ 计算属性使用 `computed()`
- ✅ 异步操作使用 `async/await`

### B.2 Git 提交规范（已遵循）

```
feat: 新功能
fix: 修复bug
style: 样式调整（不影响功能）
docs: 文档更新
refactor: 重构（不影响功能）
test: 测试相关
chore: 构建/工具相关
```

### B.3 分支策略（已建立）

```
main        → 生产环境（稳定）
develop     → 开发环境（最新）
feature/*   → 功能分支（开发中）
hotfix/*    → 紧急修复
```

### B.4 命名约定（已遵循）

```javascript
// 变量命名：camelCase
const userName = ''
const isLoading = ref(false)
const postList = ref([])

// 组件命名：PascalCase
const HomePage = defineComponent({...})

// 常量命名：UPPER_SNAKE_CASE
const MAX_PAGE_SIZE = 20
const API_BASE_URL = '/api'

// 文件命名：kebab-case 或 PascalCase
// home-page.vue 或 HomePage.vue（均可）
```

---

## 附录C：常见问题解答（FAQ）

### Q1: 我可以修改前端代码吗？

**A: ❌ 绝对不可以。** 前端代码已经100%完成并通过测试，任何修改都可能导致UI不一致或功能异常。如果确实需要调整，请联系前端负责人评估影响。

### Q2: 后端返回的数据格式有细微差异怎么办？

**A: 必须严格按照3.2节的TypeScript接口定义返回数据。** 如果确实无法完全匹配，请在前端添加数据转换层（adapter），但这是最后的选择。

### Q3: 我需要添加新的API端点怎么办？

**A: 可以添加，但必须：**
1. 遵循4.1节的API规范
2. 在4.2节登记新端点
3. 更新3.1节映射表
4. 确保不影响现有功能

### Q4: 如何测试前后端联调是否成功？

**A: 执行4.3节的检查清单，重点关注：**
- 数据格式是否匹配
- UI是否正确渲染
- 交互是否流畅
- 错误处理是否完善

### Q5: 遇到前端Bug怎么办？

**A: 请按以下流程处理：**
1. 确认是前端Bug还是数据问题
2. 检查浏览器控制台是否有错误
3. 对比Mock数据和真实数据的差异
4. 如确认为前端代码问题，联系前端负责人修复

---

## 附录D：联系方式与支持

### D.1 项目团队

| 角色 | 姓名 | 负责模块 | 联系方式 |
|------|------|---------|---------|
| 前端负责人 | [待填写] | 前端架构/UI/交互 | [待填写] |
| 后端负责人 | [待填写] | API/数据库/服务端 | [待填写] |
| 产品经理 | [待填写] | 需求/规划/验收 | [待填写] |
| 测试工程师 | [待填写] | 质量/测试/发布 | [待填写] |

### D.2 技术支持渠道

- **紧急问题**: [电话/即时通讯]
- **一般问题**: [项目管理工具]
- **文档查阅**: 本PRD文档 + 前端源代码注释
- **代码审查**: Git Pull Request Review

---

## 附录E：Git提交规范（强制执行 - 全局有效）

### E.1 提交信息格式规范

#### 📋 Commit Message 结构

```
<类型>(<范围>): <主题>

[可选正文]

[可选脚注]
```

#### 🔷 类型（Type）枚举

| 类型 | 说明 | 使用场景 |
|------|------|---------|
| `feat` | 新功能 | 添加新功能、新页面、新API端点 |
| `fix` | Bug修复 | 修复已知问题、错误处理 |
| `docs` | 文档更新 | 更新README、注释、PRD等 |
| `style` | 样式调整 | 代码格式化、分号、缩进（不影响功能） |
| `refactor` | 重构 | 代码优化、结构重组（不影响功能） |
| `perf` | 性能优化 | 提升性能、减少加载时间 |
| `test` | 测试相关 | 添加测试用例、修改测试代码 |
| `chore` | 构建工具 | 依赖更新、配置文件修改 |
| `ci` | CI/CD | 流水线配置、自动化脚本 |
| `revert` | 回滚 | 回退之前的提交 |

#### 🎯 范围（Scope）说明

| 范围值 | 适用模块 |
|--------|---------|
| `frontend` | 前端组件、页面、样式 |
| `backend` | 后端API、数据库、服务 |
| `ai` | AI图片生成、MiniMax集成 |
| `deploy` | 部署配置、服务器设置 |
| `docs` | 文档、PRD、README |
| `config` | 配置文件、环境变量 |
| `test` | 测试代码、测试数据 |

#### ✅ 正确示例

```bash
# 新功能提交
feat(ai): 实现MiniMax图片自动生成功能

- 集成MiniMax Image API v1.0
- 实现提示词工程和图片匹配算法
- 添加定时任务调度（每2小时执行）
- 支持配额管理（每日50张限制）

Closes #123

# Bug修复
fix(backend): 修复图片URL返回404问题

问题原因：OSS路径拼接错误，缺少bucket名称
解决方案：统一使用CDN完整URL
影响范围：首页瀑布流图片展示

# 文档更新
docs(prd): 更新PRD至v2.2版本

- 新增第10章：AI图片自动生成系统规格
- 新增附录E：Git提交规范
- 新增附录F：全局开发管理机制
- 强调APP商城合规要求
```

#### ❌ 错误示例

```bash
# 错误1：信息不明确
git commit -m "update"

# 错误2：信息过长
git commit -m "fix a lot of bugs and add some new features and refactor the codebase and update the documentation..."

# 错误3：使用中文（除非团队约定）
git commit -m "修复了bug"

# 错误4：缺少类型前缀
git commit -m "Add user login feature"
# 正确：feat(auth): 添加用户登录功能
```

### E.2 自动提交流程（强制执行）

#### 🔄 触发条件（满足任一即触发）

| 触发场景 | 说明 | 示例 |
|---------|------|------|
| **✅ 功能模块完成** | 独立功能开发完成并测试通过 | 完成用户登录功能 |
| **✅ 关键Bug修复** | 影响用户体验或系统稳定性的问题修复 | 修复支付流程崩溃问题 |
| **✅ 大规模重构** | 代码结构优化、性能提升>20% | 重构API层架构 |
| **✅ 重大配置变更** | 影响整体系统的配置修改 | 切换数据库供应商 |
| **✅ 版本发布准备** | 准备发布新版本前的代码冻结 | M1里程碑完成 |

#### 📝 提交检查清单（提交前必须执行）

- [ ] **代码完整性**
  - [ ] 所有修改的文件已保存
  - [ ] 无调试代码残留（console.log, debugger）
  - [ ] 无敏感信息泄露（密码、密钥、Token）
  - [ ] 无TODO/FIXME标记未处理（紧急情况除外）

- [ ] **代码质量**
  - [ ] 代码符合项目编码规范（见附录B）
  - [ ] 函数/方法有必要的注释说明
  - [ ] 变量命名清晰、语义明确
  - [ ] 无明显的代码异味（重复代码、过长函数等）

- [ ] **功能验证**
  - [ ] 本地测试通过（无报错、无异常）
  - [ ] 核心功能回归测试通过
  - [ ] 边界情况和异常处理已验证
  - [ ] 性能无明显下降

- [ ] **提交信息规范性**
  - [ ] 类型正确（feat/fix/docs等）
  - [ ] 范围准确（frontend/backend/ai等）
  - [ ] 主题简洁明了（≤50字符）
  - [ ] 正文说明详细（如有必要）
  - [ ] 关联Issue编号（如有）

#### 🚀 提交操作步骤

```bash
# Step 1: 查看当前状态
git status                    # 确认要提交的文件列表
git diff                      # 查看具体修改内容

# Step 2: 暂存文件（选择性添加）
git add src/views/Home.vue    # 添加特定文件
git add src/api/              # 添加整个目录
# 或者：git add .             # 添加所有修改（谨慎使用）

# Step 3: 提交（遵循格式规范）
git commit -m "feat(ai): 实现图片智能匹配算法

- 实现Jaccard相似度计算
- 添加标签权重加权机制
- 优化匹配响应时间至100ms内
- 通过单元测试覆盖核心逻辑

Refs #123, #124"

# Step 4: 推送到远程仓库
git push origin develop       # 推送到开发分支
# 或：git push origin main     # 推送到主分支（需权限）

# Step 5: （可选）创建Release
git tag -a v2.2.0 -m "v2.2.0: AI图片生成功能"
git push origin --tags        # 推送标签
```

### E.3 分支管理策略

#### 🌳 分支命名规范

```
<类型>/<JIRA编号>-<简短描述>
```

| 类型 | 命名格式 | 示例 | 用途 |
|------|---------|------|------|
| `feature` | `feature/VIPEPM-123-login` | 新功能开发 | 功能迭代 |
| `bugfix` | `bugfix/VIPEPM-456-crash` | Bug修复 | 问题修复 |
| `hotfix` | `hotfix/VIPEPM-789-security` | 紧急修复 | 生产问题 |
| `release` | `release/v2.2.0` | 版本发布 | 发布准备 |
| `docs` | `docs/VIPEPM-update-prd` | 文档更新 | 文档维护 |

#### 🔄 分支工作流

```
main (生产环境)
 │
 ├── develop (开发环境)
 │   ├── feature/vipepm-123-ai-image
 │   ├── feature/vipepm-124-user-auth
 │   └── bugfix/vipepm-456-fix-image-url
 │
 └── release/v2.2.0 (发布分支)
     └── hotfix/vipepm-789-patch
```

#### 📌 合并规则

1. **feature → develop**: Pull Request + Code Review
2. **develop → main**: 仅由项目经理/技术负责人执行
3. **hotfix → main**: 紧急情况可直接合并，事后补Review

### E.4 强制执行机制

#### ⚡ 违规处理

| 违规行为 | 处理措施 | 执行人 |
|---------|---------|--------|
| 提交信息不规范 | 要求amend重新提交 | 技术负责人 |
| 未完成检查清单 | Reject Pull Request | Code Reviewer |
| 敏感信息泄露 | 立即revert + 密钥轮换 | 安全负责人 |
| 频繁小提交（<10行代码） | Squash合并后重新提交 | 技术负责人 |
| 大提交（>500行代码） | 要求拆分为多个逻辑提交 | 技术负责人 |

---

## 附录F：全局开发管理机制（强制执行 - 所有项目通用）

### F.1 开发记录体系（必须严格执行）

#### 📅 每日进度记录

**记录位置：** 项目根目录 `/docs/daily/YYYY-MM-DD.md`

**模板格式：**

```markdown
# 开发日报 - YYYY-MM-DD

## 📊 今日概况
- **日期**: YYYY-MM-DD
- **开发者**: [姓名]
- **工作时长**: X小时
- **进度状态**: ✅ 正常 / ⚠️ 延迟 / ❌ 阻塞

## ✅ 已完成任务

### 任务1：[任务标题]
- **任务ID**: VIPEPM-123
- **优先级**: P0/P1/P2
- **预计工时**: 4h → **实际工时**: 3.5h
- **完成度**: 100%
- **产出物**: 
  - [x] 实现XXX功能
  - [x] 编写单元测试
  - [x] 更新文档
- **遇到的问题**: [简要描述]
- **解决方案**: [如何解决]
- **Git提交**: `feat(xxx): xxx (hash: abc123)`

### 任务2：[任务标题]
- ...

## 🔄 进行中任务

### 任务A：[任务标题]
- **任务ID**: VIPEPM-124
- **当前阶段**: 开发中 / 测试中 / Code Review
- **完成度**: 60%
- **今日进展**: 
  - [ ] 完成了XXX部分
  - [ ] 正在进行YYY
- **明日计划**: 继续完成ZZZ
- **阻塞项**: [如无则写"无"]

## 📋 未完成任务（按优先级排序）

| 优先级 | 任务ID | 任务名称 | 预计工时 | 计划开始 | 备注 |
|--------|--------|---------|---------|---------|------|
| P0 | VIPEPM-125 | 紧急Bug修复 | 2h | 明日上午 | 用户反馈 |
| P1 | VIPEPM-126 | 新功能开发 | 8h | 明日下午 | M1里程碑 |
| P2 | VIPEPM-127 | 优化项 | 4h | 后天 | 性能提升 |

## 💡 经验总结（重要！）

### 成功经验
1. **[经验点1]**: 具体描述什么做法效果好
2. **[经验点2]**: 可以复用到其他场景

### 遇到的挑战
1. **[挑战1]**: 描述遇到的困难
   - **尝试方案1**: 结果（成功/失败/部分成功）
   - **最终方案**: 为什么选择这个方案
   - **学到的教训**: 未来如何避免

### 关键技术点
1. **[技术点1]**: 
   - **应用场景**: 在哪里使用的
   - **核心代码**: 关键代码片段或思路
   - **注意事项**: 使用时需要注意什么

## 📌 明日计划
1. [ ] 完成任务A剩余部分
2. [ ] 开始任务B
3. [ ] 参加XX会议

## 🔗 相关链接
- Git提交记录: [链接]
- Pull Request: [链接]
- 设计文档: [链接]
```

#### 📈 进度跟踪表（每周更新）

**记录位置：** `/docs/progress/sprint-weekly.md`

```markdown
# Sprint进度跟踪 - Week XX (YYYY-MM-DD to YYYY-MM-DD)

## 📊 Sprint概览
- **Sprint目标**: [本次迭代的主要目标]
- **总任务数**: 10个
- **已完成**: 7个 (70%)
- **进行中**: 2个 (20%)
- **未开始**: 1个 (10%)
- **总体健康度**: 🟢 健康 / 🟡 有风险 / 🔴 危险

## 📋 任务详情

| ID | 任务名 | 负责人 | 状态 | 优先级 | 预计工时 | 实际工时 | 进度% | 阻塞项 |
|----|--------|--------|------|--------|---------|---------|------|--------|
| 123 | 用户登录 | 张三 | ✅ 完成 | P0 | 8h | 7h | 100% | 无 |
| 124 | 图片生成 | 李四 | 🔄 进行中 | P0 | 16h | 12h | 75% | 等待API密钥 |
| 125 | Bug修复 | 王五 | ⏳ 待开始 | P1 | 4h | - | 0% | 无 |

## 📉 燃尽图（Burndown Chart）

计划 vs 实际进度图表（可用文本表格或Mermaid图表示）
```

#### 🔄 修改经验总结（每次修改必填）

**记录位置：** `/docs/experiences/YYYY-MM-DD-HHMM-[关键词].md`

**强制填写时机：**
- ✅ 完成功能实现后
- ✅ 修复Bug后
- ✅ 性能优化后
- ✅ 代码重构后
- ✅ 解决复杂技术问题后

**模板格式：**

```markdown
# 修改经验总结 - [日期时间]

## 📝 基本信息
- **修改类型**: feat / fix / perf / refactor / 其他
- **涉及模块**: [前端页面/API/数据库/AI等]
- **修改文件**: 
  - `src/views/Home.vue`
  - `src/api/posts.js`
- **关联Issue**: VIPEPM-123
- **开发者**: [姓名]

## 🎯 问题描述

### 背景
为什么需要这次修改？业务需求是什么？

### 原始问题
具体遇到了什么问题？
- **现象**: [用户看到的症状]
- **影响范围**: [影响了哪些功能/用户]
- **严重程度**: P0(阻塞)/P1(严重)/P2(一般)/P3(轻微)
- **复现步骤**: 
  1. 步骤1
  2. 步骤2
  3. 触发问题

### 根本原因分析
问题的本质原因是什么？（5 Whys分析法）
1. Why 1:
2. Why 2:
3. Why 3 (根本原因):

## 💡 解决方案

### 方案对比

| 方案 | 优点 | 缺点 | 实施难度 | 选择 |
|------|------|------|---------|------|
| 方案A: XXX | ... | ... | 低 | ❌ |
| 方案B: YYY | ... | ... | 中 | ✅ 采用 |
| 方案C: ZZZ | ... | ... | 高 | ❌ |

### 最终方案详述
选择了哪个方案？为什么？

### 实施步骤
详细记录每一步操作：

**Step 1: [步骤名称]**
```javascript
// 关键代码片段
const solution = {
  // ...
}
```
- **目的**: 这一步解决什么问题
- **注意事项**: 有什么需要注意的
- **耗时**: X分钟

**Step 2: [步骤名称]**
...

## 🧪 测试验证

### 测试用例
| 用例ID | 测试步骤 | 预期结果 | 实际结果 | 状态 |
|--------|---------|---------|---------|------|
| TC-001 | 打开首页 | 图片正常显示 | 图片正常显示 | ✅ 通过 |
| TC-002 | 点击卡片 | 跳转详情页 | 详情页无图片 | ✅ 通过 |

### 回归测试
修改是否影响了其他功能？
- [ ] 功能A: 未受影响
- [ ] 功能B: 未受影响
- [ ] 功能C: 需要关注（说明原因）

## ⚠️ 遇到的挑战与解决

### 挑战1: [挑战名称]
**困难描述**: 
遇到了什么具体的困难？

**尝试过程**:
1. 第一次尝试: [做法] → 结果: [失败原因]
2. 第二次尝试: [做法] → 结果: [部分成功]
3. 最终方案: [做法] → 结果: ✅ 成功

**关键突破点**: 
是什么让问题得到了解决？

**学到的教训**:
未来再遇到类似问题，应该怎么做？

## 🔑 关键技术点总结

### 技术点1: [技术名称]
- **定义**: 这个技术是什么？
- **应用场景**: 在哪里使用了？
- **核心原理**: 工作原理是什么？
- **代码示例**:
```javascript
// 核心代码
```
- **最佳实践**: 使用时需要注意什么？
- **扩展阅读**: 相关资料链接

### 技术点2: [技术名称]
...

## 📚 可复用经验库

### 可以直接复用的
- **代码片段**: [可直接复制使用的代码]
- **解决方案模式**: [通用的解决思路]
- **工具/库**: [发现的好用工具]

### 需要改进的
- **现有方案的不足**: [还有什么可以优化的]
- **未来优化方向**: [下次可以怎么做更好]

## 🎓 个人成长收获

### 技术层面
- 学到了什么新技术？
- 加深了哪方面理解？
- 提升了哪种能力？

### 非技术层面
- 沟通协调方面的体会
- 时间管理的改进
- 问题解决思维的提升

## 🔗 相关资源
- **设计文档**: [链接]
- **API文档**: [链接]
- **参考文章**: [链接]
- **类似问题**: [内部Issue链接]

---
**总结**: 用一句话概括这次修改的核心价值和收获
```

### F.2 开发管理工具推荐

| 工具类型 | 推荐工具 | 用途 | 是否必需 |
|---------|---------|------|---------|
| **项目管理** | Jira / Trello / Notion | 任务跟踪、Sprint规划 | ✅ 必需 |
| **文档协作** | Confluence / Notion / 语雀 | 文档集中管理 | ✅ 必需 |
| **代码审查** | GitHub PR / GitLab MR | Code Review流程 | ✅ 必需 |
| **知识库** | Notion / Obsidian | 经验积累和复用 | ✅ 推荐 |
| **即时通讯** | 飞书 / 企业微信 / Slack | 团队沟通 | ✅ 必需 |
| **日志监控** | Sentry / ELK | 错误追踪和分析 | ⚠️ 推荐 |

### F.3 质量保证机制

#### 📊 代码质量指标（每个Sprint统计）

| 指标 | 目标值 | 统计方式 | 奖惩机制 |
|------|--------|---------|---------|
| **代码覆盖率** | >80% | Jest/Istanbul报告 | <70%: 需补充测试 |
| **Code Review通过率** | >95% | PR审批记录 | 连续3次被Reject: 需培训 |
| **Bug率** | <5个/Sprint | Issue统计 | >10个: 需复盘 |
| **平均修复时间** | <24h | 从创建到关闭 | >48h: 升级为P0 |
| **技术债务** | 不新增 | SonarQube扫描 | 新增需制定还款计划 |

#### 🔄 复盘机制

**频率:** 每个Sprint结束后
**参与人员:** 全体团队成员
**输出物:** Sprint复盘报告

**议程：**
1. 回顾目标达成情况（15min）
2. 展示Demo（30min）
3. 数据指标 review（15min）
4. What went well（15min）
5. What can be improved（15min）
6. Action Items确定（15min）

---

## 附录G：APP商城合规要求（强制执行 - 全平台覆盖）

### G.1 合规重要性声明

⚠️ **特别强调：本APP必须上传到各大平台APP商城，因此所有开发和运营活动必须严格遵循各平台的审核规范和政策要求。任何违规行为都可能导致：**

- ❌ 应用被拒绝上架
- ❌ 已上架应用被下架
- ❌ 开发者账号被封禁
- ❌ 法律责任和经济损失
- ❌ 品牌声誉受损

**合规不是可选项，而是生存前提！**

### G.2 各大平台合规矩阵

#### 🍎 Apple App Store

| 类别 | 要求 | 我们的状态 | 负责人 |
|------|------|-----------|--------|
| **《App Store审核指南》** | 必须完全遵守 | 🔄 待逐条对照 | 产品+开发 |
| **隐私政策** | 必须提供清晰的隐私政策页面 | ⏳ 待编写 | 法务+产品 |
| **数据收集声明** | 必须说明收集哪些数据及用途 | ⏳ 待梳理 | 产品+法务 |
| **应用内购买** | 如有虚拟物品需使用IAP | ✅ 本项目无IAP | - |
| **儿童隐私（COPPA）** | 如面向儿童需特殊保护 | ✅ 主要面向成人 | - |
| **签名证书** | 必须使用Apple颁发的证书 | 🔄 待申请 | 技术 |
| **图标规范** | 1024x1024px，无Alpha通道 | ⏳ 待设计 | 设计 |
| **启动画面** | 不能有文字或Logo以外的内容 | ✅ 已符合 | - |
| **崩溃率** | <2% | 🔄 待测试 | 测试 |
| **API使用** | 必须使用公开API | ✅ 符合 | - |

**重点审查领域（Apple严查）：**
1. **4.2 最小功能**: App必须有实际功能和价值，不能是"壳应用"
2. **5.1.1 数据收集**: 必须获得用户同意才能收集数据
3. **3.1.1 应用内购买**: 虚拟物品必须通过IAP，不能使用第三方支付
4. **4.5 Web视图**: 不能只是包装一个网站
5. **2.3.10 iOS特性**: 必须正确使用iOS特性（不能误导用户）

#### 🤖 Google Play Store

| 类别 | 要求 | 我们的状态 | 负责人 |
|------|------|-----------|--------|
| **《开发者政策中心》** | 必须完全遵守 | 🔄 待逐条对照 | 产品+开发 |
| **内容分级问卷** | 必须填写并获取分级 | ⏳ 待填写 | 产品 |
| **目标受众** | 必须声明适合的年龄群体 | ⏳ 待确定 | 产品 |
| **权限申请** | 只申请必要权限，必须说明用途 | 🔄 待审查 | 技术+产品 |
| **64位支持** | 必须提供64位版本 | ✅ Vue3默认支持 | - |
| **目标SDK版本** | 必须使用近2年内的API level | 🔄 待确认 | 技术 |
| **广告标识符** | 如使用广告需遵守政策 | ✅ 本项目无广告 | - |
| **家庭安全** | 如含用户生成内容需审核机制 | ✅ 内容由AI生成 | - |
| **滥用权限** | 不能在后台频繁获取位置等 | ✅ 不涉及敏感权限 | - |

**Google Play下架高频原因（必须避免）：**
1. **骚扰用户**: 频繁推送通知
2. **欺骗行为**: 虚假宣传、诱导点击
3. **恶意软件**: 包含病毒或恶意代码
4. **隐私侵犯**: 过度收集用户数据
5. **知识产权侵权**: 未经授权使用他人内容

#### 📱 华为应用市场（HarmonyOS）

| 类别 | 要求 | 我们的状态 | 负责人 |
|------|------|-----------|--------|
| **华为应用上架规范** | 必须遵循 | 🔄 待学习 | 产品+开发 |
| **鸿蒙兼容性** | 建议适配HarmonyOS | ⏳ 待评估 | 技术 |
| **HMS Core集成** | 建议使用华为服务 | ⏳ 待评估 | 技术 |
| **华为账号登录** | 可选接入 | ⏳ 待决定 | 产品 |
| **应用分类** | 必须正确分类（教育/工具） | ⏳ 待确定 | 产品 |
| **截图要求** | 必须提供真实截图（非渲染图） | ⏳ 待准备 | 设计 |
| **隐私合规** | 符合中国网络安全法 | ⏳ 待审查 | 法务 |
| **备案要求** | 可能需要ICP备案 | ⏳ 咨询法务 | 法务 |

#### 📲 小米应用商店

| 类别 | 要求 | 我们的状态 | 负责人 |
|------|------|-----------|--------|
| **小米开发者规范** | 必须遵循 | 🔄 待学习 | 产品+开发 |
| **MIUI适配** | 建议测试MIUI兼容性 | ⏳ 待测试 | 测试 |
| **小米推送服务** | 可选集成 | ⏳ 待评估 | 技术 |
| **应用体积** | 建议<100MB | ✅ 预计符合 | - |
| **启动速度** | 冷启动<3秒 | 🔄 待优化 | 技术 |
| **省电优化** | 不能过度消耗电量 | 🔄 待测试 | 测试 |
| **内存占用** | 建议<200MB | 🔄 待测试 | 测试 |

#### 📱 OPPO / vivo 应用商店

| 类别 | 要求 | 我们的状态 | 负责人 |
|------|------|-----------|--------|
| **各自开发者规范** | 必须遵循 | 🔄 待学习 | 产品+开发 |
| **ColorOS / OriginOS适配** | 建议测试兼容性 | ⏳ 待测试 | 测试 |
| **推送服务** | 可选集成厂商推送 | ⏳ 待评估 | 技术 |
| **应用权限** | 最小必要原则 | 🔄 待审查 | 技术+产品 |

#### 💬 微信小程序

| 类别 | 要求 | 我们的状态 | 负责人 |
|------|------|-----------|--------|
| **《小程序运营规范》** | 必须完全遵守 | 🔄 待逐条对照 | 产品+开发 |
| **服务类目** | 必须选择正确的类目 | ⏳ 待确定 | 产品 |
| **内容规范** | 不能包含违规内容 | ✅ AI生成可控 | - |
| **用户隐私保护** | 必须获取授权后才能使用 | 🔄 待实现 | 技术 |
| **分包加载** | 主包<2MB，总包<20MB | ✅ 预计符合 | - |
| **接口调用规范** | 必须使用官方API | ✅ 符合 | - |
| **审核周期** | 通常1-3个工作日 | - | - |
| **拒绝常见原因** | 虚假宣传、诱导分享、违规收集数据 | ⏳ 需规避 | 产品 |

### G.3 通用合规要点（所有平台共同要求）

#### ✅ 必须做到的

1. **内容合规**
   - [ ] 无色情、暴力、赌博、政治敏感内容
   - [ ] 无虚假宣传、夸大效果、误导用户
   - [ ] 无侵犯知识产权的内容（图片、音乐、字体等）
   - [ ] AI生成内容需明确标注来源

2. **隐私保护**
   - [ ] 隐私政策清晰易懂（用户能看懂）
   - [ ] 收集数据前必须获得用户明确同意
   - [ ] 只收集必要的数据，不过度索取权限
   - [ ] 数据传输使用加密（HTTPS/TLS）
   - [ ] 提供用户删除账户和数据的途径

3. **技术安全**
   - [ ] 无安全漏洞（SQL注入、XSS、CSRF等）
   - [ ] 无恶意代码或病毒
   - [ ] 无后门程序或隐藏功能
   - [ ] API密钥、密码等敏感信息不硬编码
   - [ ] 通信数据加密传输

4. **用户体验**
   - [ ] 应用稳定，崩溃率<2%
   - [ ] 加载速度合理，无长时间白屏
   - [ ] 操作流畅，无明显卡顿
   - [ ] 无欺骗性按钮或诱导点击
   - [ ] 广告（如有）不影响正常使用

5. **元数据完整**
   - [ ] 应用名称、图标、截图、描述完整准确
   - [ ] 截图为真实界面（不能用PS美化过度）
   - [ ] 描述与应用功能一致
   - [ ] 关键词与应用相关，不做关键词堆砌

#### ❌ 绝对禁止的

1. **违法违规内容**
   - 涉黄涉暴、恐怖主义、极端主义
   - 赌博、彩票、封建迷信
   - 诽谤、侮辱、歧视性内容
   - 侵犯国家安全和社会稳定的内容

2. **欺诈行为**
   - 虚假承诺、诈骗钱财
   - 冒充官方机构或知名品牌
   - 刷量、刷评、作弊行为
   - 诱导用户下载恶意软件

3. **侵犯用户权益**
   - 未经同意收集敏感信息（位置、通讯录等）
   - 强制授权、捆绑安装
   - 恶意扣费、暗地订阅
   - 用户无法卸载或退出

4. **技术违规行为**
   - 越权访问系统资源
   - 破解、逆向工程其他应用
   - 干扰其他应用正常运行
   - 利用漏洞进行攻击

### G.4 合规检查清单（上架前必须逐项确认）

#### 📋 上架前自查表

**第一阶段：内容审查（产品负责）**
- [ ] 应用名称不侵权、不违规
- [ ] 应用图标原创或已获授权
- [ ] 截图真实反映应用界面
- [ ] 应用描述准确无夸大
- [ ] 所有文案经过法律审核
- [ ] AI生成内容已标注声明
- [ ] 无第三方商标或版权内容（除非已授权）

**第二阶段：技术审查（开发负责）**
- [ ] 应用在主流设备上测试通过（iOS/Android各3款以上）
- [ ] 崩溃率<2%（基于TestFlight/内测数据）
- [ ] 启动速度<3秒（冷启动）
- [ ] 内存占用合理（<200MB）
- [ ] 网络请求全部使用HTTPS
- [ ] 敏感数据加密存储
- [ ] 日志中不打印敏感信息
- [ ] 无硬编码的密钥或密码
- [ ] 第三方SDK均为最新版本且合法
- [ ] 申请的权限均有合理说明

**第三阶段：法律审查（法务负责）**
- [ ] 隐私政策符合GDPR/中国网络安全法
- [ ] 用户协议完整有效
- [ ] 数据收集清单明确
- [ ] 儿童保护措施到位（如适用）
- [ ] ICP备案已完成（如需要）
- [ ] 软件著作权已申请（建议）

**第四阶段：运营准备（运营负责）**
- [ ] 应用商店开发者账号已注册
- [ ] 应用素材包准备齐全（图标、截图、视频等）
- [ ] 关键词策略已确定
- [ ] 应用分类已确定
- [ ] 定价策略已确定（如有付费功能）
- [ ] 客服渠道已建立
- [ ] 用户反馈收集机制就绪

### G.5 违规后果与应对策略

#### ⚠️ 常见违规后果

| 违规类型 | Apple | Google | 华为 | 微信 |
|---------|-------|--------|------|------|
| **首次违规** | 警告 + 要求整改 | 下架 + 7天后可申诉 | 下架 + 通报 | 封禁7天 |
| **重复违规** | 下架 + 账号警告 | 永久封禁 | 永久封禁 | 永久封禁 |
| **严重违规** | 永久封禁 + 法律追责 | 永久封禁 | 永久封禁 + 法律追责 | 永久封禁 |

#### 🛡️ 应对策略

1. **预防为主**
   - 上架前严格自查（使用G.4节检查清单）
   - 定期关注平台政策更新
   - 建立合规审查机制（每次大版本更新前）

2. **快速响应**
   - 收到违规通知后24小时内响应
   - 详细说明整改计划和完成时间
   - 保持与平台审核团队的积极沟通

3. **持续监控**
   - 上架后持续监控用户反馈
   - 关注应用评分和评论
   - 定期进行合规审计（每季度一次）

4. **备份方案**
   - 准备多个开发者账号（不同平台）
   - 建立应急发布流程
   - 重要数据定期备份

### G.6 平台特色要求汇总

| 平台 | 特色要求 | 特别注意 |
|------|---------|---------|
| **Apple** | 审核最严格，周期最长（1-7天） | 必须使用最新Xcode编译，不能有Beta版API |
| **Google** | 对后台进程、权限管理严格 | 必须适配Android 11+的分区存储 |
| **华为** | 鼓励集成HMS服务 | 可能需要适配鸿蒙系统特性 |
| **小米** | 注重性能和功耗 | MIUI定制较多，需针对性测试 |
| **微信** | 审核快但规则细 | 小程序包大小限制严格，需分包 |

---

> **文档状态：** PRD v2.2 — **重大功能扩展版本**
>
> **v2.2 更新内容：**
> - ✅ **第10章全面重写**：AI图片自动生成系统完整规格（MiniMax API 50张/日配额）
> - ✅ **提示词工程**：8种技术栈的专业Prompt模板库
> - ✅ **智能匹配算法**：Jaccard相似度 + 权重加权算法
> - ✅ **定时更新机制**：每2小时批量生成 + 5类定时任务
> - ✅ **展示逻辑明确**：首页显示，详情页隐藏（严格遵守）
> - ✅ **验收标准完善**：功能/展示/性能/合规4维度18项检查点
> - ✅ **附录E新增**：Git提交规范（类型/范围/格式/流程/强制执行）
> - ✅ **附录F新增**：全局开发管理机制（日报/周报/经验总结模板）
> - ✅ **附录G新增**：APP商城合规要求（6大平台详细合规矩阵）
>
> **最后更新：** 2026-05-03 16:30:00
>
> **下次审查：** Phase 2（AI功能增强）完成后
>
> **适用范围：** 所有参与本项目开发的团队成员 + 未来所有项目
>
> **⚠️ 重要提醒：**
> 1. 必须首先阅读第0章（前端锁定声明）
> 2. 其次阅读第10章（AI图片生成系统规格）
> 3. 严格遵循附录E（Git提交规范）
> 4. 认真执行附录F（开发管理机制）
> 5. 绝对遵守附录G（APP商城合规要求）
> 6. **合规是生存前提，不是可选项！**
