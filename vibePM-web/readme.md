# AI学习助手 Web版 (Vibe PM Web)

## 项目简介

基于 Vue 3 + Vite + Tailwind CSS + Element Plus 构建的移动端优先 AI 学习助手 Web 应用。采用专业图标库（Lucide + Element Plus Icons），完全替代 emoji，提供专业级 UI/UX 体验。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.4.21 | 前端框架 |
| Vite | ^5.2.8 | 构建工具 |
| Tailwind CSS | ^3.4.3 | 原子化 CSS |
| Element Plus | ^2.6.3 | UI 组件库 |
| Lucide Vue Next | ^0.363.0 | 专业图标库 |
| Vue Router | ^4.3.0 | 路由管理 |

## 功能特性

- 闪屏页 - 品牌展示，2秒自动跳转
- 引导页 - 3页滑动引导，支持跳过
- 冷启动问卷 - 用户偏好收集
- 首页主屏 - 搜索栏 + 分类标签 + 瀑布流卡片
- 卡片详情 - 完整内容展示，收藏/分享/导出
- 搜索页 - 搜索历史 + 热门搜索 + 实时搜索
- 知识库 - 收藏/路径/笔记三栏切换
- 收藏夹 - 收藏内容管理
- 学习路径 - 路径列表 + 进度追踪
- 路径详情 - 步骤式学习路径
- 导出笔记 - 多格式导出（PDF/Markdown/HTML）
- 个人中心 - 用户信息 + 功能菜单

## 快速开始

### 环境要求

- Node.js 18+
- Bun 包管理器

### 安装步骤

```bash
# 进入项目目录
cd K:\AI\AIxueixi-haha2\vibePM-web

# 安装依赖
bun install

# 启动开发服务器
bun run dev
```

### 访问地址

开发服务器启动后，访问：http://localhost:3003/

## 项目结构

```
vibePM-web/
├── src/
│   ├── assets/          # 静态资源
│   │   └── main.css     # 全局样式
│   ├── layouts/         # 布局组件
│   │   └── MainLayout.vue
│   ├── router/          # 路由配置
│   │   └── index.js
│   ├── views/           # 页面组件
│   │   ├── Splash.vue
│   │   ├── Guide.vue
│   │   ├── Questionnaire.vue
│   │   ├── Home.vue
│   │   ├── CardDetail.vue
│   │   ├── Search.vue
│   │   ├── KnowledgeBase.vue
│   │   ├── Profile.vue
│   │   ├── Favorites.vue
│   │   ├── PathList.vue
│   │   ├── PathDetail.vue
│   │   └── Export.vue
│   ├── App.vue          # 根组件
│   └── main.js          # 入口文件
├── index.html           # HTML 模板
├── vite.config.js       # Vite 配置
├── tailwind.config.js   # Tailwind 配置
├── postcss.config.js    # PostCSS 配置
└── package.json         # 项目配置
```

## 使用技巧

### 1. 页面导航

- 底部 TabBar 可在首页、知识库、个人中心之间切换
- 点击搜索栏进入搜索页
- 点击瀑布流卡片进入详情页

### 2. 搜索功能

- 支持实时搜索过滤
- 显示搜索历史记录
- 提供热门搜索推荐

### 3. 学习路径

- 在个人中心进入学习路径列表
- 点击路径查看详细信息和进度
- 支持继续学习功能

### 4. 导出功能

- 支持选择导出内容类型
- 支持 PDF/Markdown/HTML 三种格式
- 可配置导出选项（图片、标签、日期）

## 常见问题

### Q: 如何修改端口？

编辑 `vite.config.js` 中的 `server.port` 配置项。

### Q: 如何构建生产版本？

```bash
bun run build
```

### Q: 如何预览生产版本？

```bash
bun run preview
```

## 作者备注

作者: Qwen3.6-Plus + Trae IDE + 20260503
