# VibePM Server

> AI 学习助手后端服务

## 技术栈

- **框架**: Express.js 4
- **数据库**: Supabase (PostgreSQL)
- **AI 服务**: MiniMax API (MiniMax-M2.7)
- **实时通信**: WebSocket (ws)
- **定时任务**: node-cron
- **文件上传**: multer
- **认证**: JWT

## 快速开始

### 安装依赖

```bash
bun install
```

### 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，填写以下配置:

```env
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# JWT 密钥
JWT_SECRET=your-secure-jwt-secret

# MiniMax API
MINIMAX_API_KEY=your-minimax-api-key
MINIMAX_TEXT_ENDPOINT=https://api.minimax.chat/v1/text/chatcompletion_v2
MINIMAX_IMAGE_ENDPOINT=https://ark.cn-beijing.volces.com/api/v3/images/generations

# 服务器配置
PORT=3001
NODE_ENV=development
```

### 启动服务

```bash
# 开发模式 (支持热重载)
bun run dev

# 生产模式
bun run start
```

服务将在 http://localhost:3001 启动

## API 文档

### 内容接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/posts` | 获取内容列表 |
| GET | `/api/posts/:id` | 获取内容详情 |
| POST | `/api/posts` | 创建内容 |
| DELETE | `/api/posts/:id` | 删除内容 |

#### 查询参数

```javascript
GET /api/posts?tab=recommend&page=1&pageSize=10

// tab 可选值: recommend, practice, tech, ai, guide
```

### AI 接口

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/ai/generate` | 生成深度文章 |
| POST | `/api/ai/generate/quick` | 生成速查表 |
| POST | `/api/ai/generate/image` | 生成配图 |
| POST | `/api/ai/batch/generate` | 批量生成 |
| GET | `/api/ai/metrics` | 获取生成统计 |

#### 请求示例

```javascript
POST /api/ai/generate
{
  "topic": "React Hooks",
  "type": "deep_article",
  "options": {
    "temperature": 0.7,
    "maxTokens": 2000
  }
}
```

### 用户接口

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/auth/register` | 用户注册 |
| POST | `/api/auth/login` | 用户登录 |
| GET | `/api/users/profile` | 获取用户资料 |
| PUT | `/api/users/profile` | 更新用户资料 |

### 收藏接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/favorites` | 获取收藏列表 |
| POST | `/api/favorites` | 添加收藏 |
| DELETE | `/api/favorites/:id` | 取消收藏 |

## 项目结构

```
vibePM-server/
├── controllers/           # 控制器
│   ├── postController.js      # 内容控制器
│   ├── aiController.js        # AI 控制器
│   ├── userController.js      # 用户控制器
│   └── ...
├── routes/               # 路由定义
│   ├── posts.js
│   ├── ai.js
│   ├── users.js
│   └── ...
├── services/             # 业务服务
│   ├── minimaxService.js     # MiniMax API 封装
│   ├── cronService.js        # 定时任务
│   ├── websocket.js          # WebSocket 服务
│   └── promptEngine.js       # Prompt 工程
├── scripts/              # 数据脚本
│   ├── seed.js              # 数据填充
│   └── test-*.js            # 测试脚本
├── tests/                # 测试文件
│   ├── postController.test.js
│   └── api.integration.test.js
├── server.js            # 主入口
├── package.json
└── vitest.config.js     # 测试配置
```

## MiniMax 服务

### 生成内容类型

1. **deep_article** - 深度技术文章
2. **quick_reference** - 快速参考卡片
3. **interview_questions** - 面试题库
4. **project_tutorial** - 项目教程

### 使用示例

```javascript
import { generateDeepContent } from './services/minimaxService.js'

const article = await generateDeepContent('Docker 容器化', {
  type: 'tech',
  temperature: 0.7,
  maxTokens: 3000
})

console.log(article.title)
console.log(article.content)
```

## WebSocket

连接地址: `ws://localhost:3001/ws`

### 订阅频道

```javascript
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'posts'
}))
```

### 接收消息类型

- `new_post` - 新内容推送
- `ping/pong` - 心跳检测
- `stats_update` - 统计数据更新

## 定时任务

### 默认任务

- **内容自动生成**: 每小时执行
- **数据统计更新**: 每日凌晨执行

## 测试

```bash
# 运行所有测试
bun run test

# 运行测试并生成覆盖率
bun run test:coverage

# 监听模式运行测试
bun run test
```

## 数据库

### 表结构

#### posts (内容表)

| 字段 | 类型 | 描述 |
|------|------|------|
| id | integer | 主键 |
| title | text | 标题 |
| content | text | 内容 |
| author | text | 作者 |
| category | text | 分类 |
| type | text | 类型 |
| tags | jsonb | 标签 |
| image | text | 封面图 |
| likes | integer | 点赞数 |
| created_at | timestamp | 创建时间 |

#### users (用户表)

| 字段 | 类型 | 描述 |
|------|------|------|
| id | uuid | 主键 |
| email | text | 邮箱 |
| username | text | 用户名 |
| password_hash | text | 密码哈希 |
| created_at | timestamp | 创建时间 |

#### favorites (收藏表)

| 字段 | 类型 | 描述 |
|------|------|------|
| id | integer | 主键 |
| user_id | uuid | 用户ID |
| post_id | integer | 内容ID |
| created_at | timestamp | 创建时间 |

## 环境变量

| 变量 | 描述 | 必填 |
|------|------|------|
| `SUPABASE_URL` | Supabase 项目地址 | 是 |
| `SUPABASE_ANON_KEY` | Supabase 匿名密钥 | 是 |
| `SUPABASE_SERVICE_KEY` | Supabase 服务密钥 | 是 |
| `JWT_SECRET` | JWT 签名密钥 | 是 |
| `MINIMAX_API_KEY` | MiniMax API 密钥 | 是 |
| `MINIMAX_TEXT_ENDPOINT` | MiniMax 文本端点 | 否 |
| `MINIMAX_IMAGE_ENDPOINT` | MiniMax 图片端点 | 否 |
| `PORT` | 服务端口 | 否 (默认3001) |
| `NODE_ENV` | 运行环境 | 否 |

## 错误码

| 错误码 | 描述 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

## 许可证

MIT
