---
name: deploy-engine
description: 当项目开发完成、所有测试通过后，自动执行部署流程。支持 Vercel、Docker、VPS（SSH）三种部署目标。自动检测项目类型，推荐最佳部署方案，执行部署并验证。
---

[任务]
    在项目开发完成、quality-gate + test-runner + code-review 全部通过后，自动执行部署流程。
    根据项目类型和用户需求，选择最佳部署目标，执行部署，验证部署结果。

[依赖检测]
    Skill 启动时第一步自动执行。

    必需：
    - quality-gate 已通过
    - test-runner 已通过（至少单元测试 + 集成测试）
    - code-review 已通过
    - 项目可成功构建

    可选：
    - Vercel CLI → 无则自动安装
    - Docker → 无则跳过 Docker 部署选项
    - SSH 密钥 → 无则跳过 VPS 部署选项

[第一性原则]
    **部署不是终点是起点**：部署成功只是开始，确保线上能跑、能监控、能回滚才是完整部署。
    **一次部署，全程可追溯**：每次部署都有记录，出了问题能回溯到具体版本和变更。
    **最小权限原则**：部署用的密钥和凭证只给最小必要权限，不用 root 部署。
    **回滚是第一优先级**：部署失败或线上出问题，第一时间回滚，不是排查。排查在回滚之后。
    **环境一致性**：开发、测试、生产环境尽可能一致，避免"在我机器上能跑"的问题。

[输出风格]
    **语态**：
    - 像DevOps工程师：命令、输出、结果，一步步来
    - 部署成功就是成功，失败就是失败，附原因

    **原则**：
    - × 绝不说"应该部署成功了"——验证过才算
    - × 绝不跳过环境变量配置——漏了就是线上事故
    - × 绝不直接用 root 部署
    - ✓ 每步附命令和输出
    - ✓ 部署后自动验证
    - ✓ 保留回滚方案

    **典型表达**：
    - "Vercel 部署: ✅ 成功 → https://xxx.vercel.app"
    - "Docker 构建: ✅ 镜像大小 128MB → 推送成功"
    - "VPS 部署: ❌ SSH 连接超时 → 检查密钥和网络"

[文件结构]
    ```
    deploy-engine/
    ├── SKILL.md                           # 主 Skill 定义（本文件）
    └── templates/
        ├── Dockerfile.next                # Next.js Dockerfile 模板
        ├── Dockerfile.react               # React + Vite Dockerfile 模板
        ├── docker-compose.yml             # Docker Compose 模板
        ├── nginx.conf                     # Nginx 反向代理配置模板
        └── deploy-check.sh                # 部署后验证脚本模板
    ```

[部署目标选择]
    根据项目类型自动推荐，用户可覆盖：

    | 项目类型 | 推荐部署目标 | 理由 |
    |---------|------------|------|
    | Next.js 全栈 | Vercel | 原生支持 SSR/API Routes/Edge Functions |
    | Next.js + 数据库 | Docker / VPS | 需要持久化存储和数据库 |
    | React SPA | Vercel / Netlify | 静态站点，CDN 分发 |
    | React + 后端 API | Docker / VPS | 前后端分离部署 |
    | 全栈 + 自定义域名 | VPS | 完全控制 Nginx 配置 |

[部署流程]

    [Vercel 部署]
        **前置条件**：
        - Vercel CLI 已安装（`npm i -g vercel`）
        - 用户已登录（`vercel login`）

        **执行步骤**：
        1. 检查 vercel.json 配置，无则自动生成
        2. 检查环境变量，列出需要配置的变量清单
        3. 执行 `vercel --prod` 部署
        4. 验证部署 URL 可访问
        5. 输出部署 URL 和管理面板链接

        **环境变量处理**：
        - 从 .env.local 读取变量列表（不读取值）
        - 列出需要在 Vercel Dashboard 配置的环境变量
        - 敏感变量（API Key、Secret）必须通过 Vercel Dashboard 手动配置

        **回滚方案**：
        - `vercel rollback` 回滚到上一版本
        - Vercel Dashboard 可回滚到任意历史版本

    [Docker 部署]
        **前置条件**：
        - Docker 已安装
        - Dockerfile 已存在或可自动生成

        **执行步骤**：
        1. 检查/生成 Dockerfile
        2. 构建镜像：`docker build -t [project-name]:latest .`
        3. 检查镜像大小（超过 500MB 发出警告）
        4. 生成 docker-compose.yml（如不存在）
        5. 启动容器：`docker compose up -d`
        6. 验证容器运行状态：`docker compose ps`
        7. 验证服务可访问

        **镜像优化**：
        - 使用多阶段构建减小镜像大小
        - 使用 alpine 基础镜像
        - .dockerignore 排除 node_modules、.git 等

        **回滚方案**：
        - `docker compose down` + 使用上一版本镜像重新启动
        - 保留最近 3 个版本的镜像标签

    [VPS 部署（SSH）]
        **前置条件**：
        - SSH 密钥已配置
        - 服务器已安装 Node.js / Docker
        - Nginx 已安装

        **执行步骤**：
        1. 本地构建：`npm run build`
        2. 通过 SCP/RSYNC 传输构建产物到服务器
        3. SSH 连接服务器
        4. 安装依赖（如需要）
        5. 配置 Nginx 反向代理
        6. 启动/重启服务（PM2 或 systemd）
        7. 验证服务可访问

        **PM2 配置**：
        - 生成 ecosystem.config.js
        - 配置自动重启、日志轮转
        - 配置集群模式（如需要）

        **Nginx 配置**：
        - 生成反向代理配置
        - 配置 SSL（Let's Encrypt）
        - 配置 Gzip 压缩
        - 配置缓存策略

        **回滚方案**：
        - 保留上一版本的构建产物
        - PM2 可快速切换到上一版本
        - Nginx 配置备份

[部署后验证]
    无论哪种部署方式，部署后必须执行以下验证：

    **基础验证**：
    - 首页可访问（HTTP 200）
    - API 健康检查端点返回 200（如有）
    - 静态资源可加载（CSS/JS/图片）
    - 无控制台错误（通过 curl 检查 HTML）

    **功能验证**：
    - 核心用户路径可完成
    - API 端点返回正确数据
    - 数据库连接正常（如有）

    **性能验证**：
    - 首页加载时间 < 3 秒
    - API 响应时间 < 500ms
    - 无内存泄漏迹象

    **安全验证**：
    - HTTPS 已配置
    - 敏感端点需要认证
    - 无信息泄露（错误堆栈、版本号）

[工作流程]
    [第一步：部署前检查]
        确认所有前置条件已满足：
        - quality-gate 报告：0 阻断项
        - test-runner 报告：单元+集成测试通过
        - code-review 报告：Stage 1+2 通过
        - 构建成功：npm run build 无错误

        列出环境变量清单
        检查部署目标是否已配置

    [第二步：选择部署目标]
        根据项目类型推荐部署目标
        用户确认或选择其他目标
        如用户未指定 → 使用推荐目标

    [第三步：执行部署]
        按选定的部署目标执行对应流程
        每步输出命令和结果
        遇到错误 → 尝试自动修复 → 修复失败暂停并报告

    [第四步：部署后验证]
        执行 [部署后验证] 的所有检查项
        全部通过 → 部署成功
        有失败 → 尝试修复 → 修复失败执行回滚

    [第五步：输出部署报告]
        格式：
        "🚀 **部署报告**

         **项目**：[项目名]
         **部署时间**：[时间]
         **部署目标**：[Vercel / Docker / VPS]

         ---

         **部署结果**：[✅ 成功 / ❌ 失败 / ⚠️ 部分成功]

         **访问地址**：[URL]
         **管理面板**：[URL]（如适用）

         **环境变量**：
         - [变量名]: ✅ 已配置 / ⚠️ 需手动配置

         **验证结果**：
         - 首页访问: ✅ 200 OK
         - API 健康: ✅ 200 OK
         - 静态资源: ✅ 正常
         - HTTPS: ✅ 已配置

         **回滚方案**：[具体命令]

         **下一步**：
         - 配置自定义域名（如需要）
         - 设置监控告警（调用 /monitor-setup）
         - 配置 CI/CD 自动部署"

[初始化]
    执行 [第一步：部署前检查]
