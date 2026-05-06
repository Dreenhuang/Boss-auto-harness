# VibePM - AI 学习助手

> 智能内容生成与个性化学习路径管理系统

## 项目简介

VibePM 是一个基于 AI 的内容生成与学习管理平台，支持通过 MiniMax 大模型自动生成学习内容，并提供个性化学习路径推荐。

## 技术栈

### 前端
- **框架**: Vue 3 + Composition API
- **构建工具**: Vite 5
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **样式**: Tailwind CSS + Element Plus
- **移动端**: Capacitor (支持 iOS/Android)

### 后端
- **框架**: Express.js
- **数据库**: Supabase (PostgreSQL)
- **AI 服务**: MiniMax API (MiniMax-M2.7)
- **实时通信**: WebSocket
- **定时任务**: node-cron

## 项目结构

```
AIxueixi-haha2/
├── vibePM-web/          # 前端应用
│   ├── src/
│   │   ├── views/      # 页面组件
│   │   ├── components/ # 通用组件
│   │   ├── stores/     # Pinia 状态管理
│   │   ├── services/   # API 和工具服务
│   │   └── router/     # 路由配置
│   ├── dist/           # 构建产物
│   └── android/         # Android 原生项目
│
├── vibePM-server/       # 后端服务
│   ├── controllers/     # 控制器
│   ├── routes/          # 路由定义
│   ├── services/        # 业务服务
│   │   ├── minimaxService.js  # MiniMax API
│   │   ├── cronService.js      # 定时任务
│   │   └── websocket.js        # WebSocket
│   ├── scripts/         # 数据脚本
│   └── tests/           # 测试文件
│
└── vibepm-deploy/      # 部署配置
    ├── backend/         # 生产后端
    └── frontend/        # 生产前端
```

## 快速开始

### 前置要求
- Node.js >= 18
- Bun >= 1.0
- Supabase 账户
- MiniMax API Key

### 安装

```bash
# 克隆项目
cd vibePM-web && bun install
cd ../vibePM-server && bun install
```

### 配置

```bash
# 复制环境变量模板
cp vibePM-server/.env.example vibePM-server/.env
cp vibePM-web/.env.example vibePM-web/.env

# 编辑配置文件，填写你的 API Keys
```

### 运行

```bash
# 启动后端服务 (端口 3001)
cd vibePM-server
bun run dev

# 启动前端开发服务器 (端口 3003)
cd vibePM-web
bun run dev
```

## 环境变量

### 后端 (.env)

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-jwt-secret
MINIMAX_API_KEY=your-minimax-api-key
MINIMAX_TEXT_ENDPOINT=https://api.minimax.chat/v1/text/chatcompletion_v2
MINIMAX_IMAGE_ENDPOINT=https://ark.cn-beijing.volces.com/api/v3/images/generations
PORT=3001
```

### 前端 (.env)

```env
VITE_API_BASE=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001/ws
```

## API 文档

### 内容接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/posts` | 获取内容列表 |
| GET | `/api/posts/:id` | 获取单条内容 |
| POST | `/api/posts` | 创建内容 |
| DELETE | `/api/posts/:id` | 删除内容 |

### AI 接口

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/ai/generate` | 生成深度文章 |
| POST | `/api/ai/generate/image` | 生成配图 |
| POST | `/api/ai/batch/generate` | 批量生成 |

### 参数

```javascript
// GET /api/posts
{
  tab: 'recommend' | 'practice' | 'tech' | 'ai' | 'guide',
  page: number,
  pageSize: number
}

// POST /api/ai/generate
{
  topic: string,
  type: 'deep_article' | 'quick_reference' | 'interview_questions' | 'project_tutorial',
  options?: {
    temperature?: number,
    maxTokens?: number
  }
}
```

## 测试

```bash
# 运行所有测试
cd vibePM-server
bun run test

# 运行测试并生成覆盖率报告
bun run test:coverage
```

## 构建部署

### 前端构建

```bash
cd vibePM-web
bun run build
```

构建产物在 `dist/` 目录。

### 生产部署

1. 上传后端代码到服务器
2. 安装依赖: `bun install`
3. 配置环境变量
4. 启动服务: `bun run start`
5. 配置 Nginx (参考 `vibepm-deploy/vibepm.conf`)

## 功能特性

- [x] AI 自动生成学习内容
- [x] 多分类内容管理 (推荐/实战/技术/AI/指南)
- [x] 实时推送更新
- [x] 无限滚动加载
- [x] 用户收藏功能
- [x] 知识库管理
- [x] 学习路径规划
- [x] 数据导出
- [x] WebSocket 实时通信
- [x] 性能监控

## 更新日志

### v2.0.3 (2026-05-06)
- 修复内容推送异常问题
- 增强数据新鲜度检测
- 添加性能监控模块
- 增强 WebSocket 连接监控

### v2.0.0 (2026-04-30)
- 集成 MiniMax AI
- 重构前端架构
- 添加 WebSocket 实时推送

## 许可证

MIT License

## 作者

VibePM Team

## 联系方式

- GitHub: https://github.com/Dreenhuang/Boss-auto-harness
- Email: wwoshiboss666@gmail.com
