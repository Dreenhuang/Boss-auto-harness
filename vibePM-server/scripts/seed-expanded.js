import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

// ============================================================
// 50+ Posts Data
// ============================================================

const posts = [
  // ---- 概念 (concept) - 10 posts ----
  {
    id: 101,
    title: 'API 就像餐厅服务员：三分钟读懂接口原理',
    author: '技术小白',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
    likes: 1205,
    image: 'https://picsum.photos/seed/api101/400/300',
    height: '220px',
    category: '概念',
    type: 'recommend',
    content: `# 什么是API？\n\n想象你去餐厅吃饭。你坐在桌前，看着菜单点菜。服务员把你的订单送到厨房，然后把做好的菜端给你。\n\n在这个比喻中：\n- **你** = 应用程序或用户\n- **菜单** = API文档\n- **服务员** = API\n- **厨房** = 服务器或数据库\n\n## API的核心概念\n\n1. **请求（Request）** - 你告诉服务员你想吃什么\n2. **响应（Response）** - 服务员把菜端给你\n3. **端点（Endpoint）** - 菜单上的每一道菜\n4. **参数（Parameter）** - 你要几分熟、加不加辣\n\n> API让复杂的技术变得简单，你不需要知道厨房怎么做菜，只需要告诉服务员你想吃什么。\n\n## 常见的API类型\n\n- **REST API** - 最常见，像点菜一样简单\n- **GraphQL** - 自助餐模式，想拿什么拿什么\n- **WebSocket** - 实时对话，像和服务员一直聊天`,
    tags: ['API', '基础概念', '后端']
  },
  {
    id: 102,
    title: '数据库是什么？用衣柜来理解数据存储',
    author: '数据达人',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=data',
    likes: 986,
    image: 'https://picsum.photos/seed/db102/400/260',
    height: '200px',
    category: '概念',
    type: 'recommend',
    content: `# 数据库 = 超级智能衣柜\n\n想象你有一个超级智能的衣柜：\n\n- **表（Table）** = 衣柜里的不同抽屉（上衣抽屉、裤子抽屉、袜子抽屉）\n- **行（Row）** = 每一件衣服\n- **列（Column）** = 衣服的属性（颜色、尺码、品牌）\n- **查询（Query）** = 告诉衣柜"我要那件蓝色的M码T恤"\n- **索引（Index）** = 衣柜上的标签，帮你快速找到衣服\n\n## 两种主流数据库\n\n### SQL数据库（关系型）\n像整理得井井有条的衣柜，每件衣服都有固定位置\n- MySQL、PostgreSQL、SQLite\n\n### NoSQL数据库（非关系型）\n像按心情分类的衣柜，更灵活但可能没那么整齐\n- MongoDB、Redis、Firebase\n\n> 选数据库就像选衣柜：衣服多且需要精确管理选SQL，东西杂且经常变化选NoSQL。`,
    tags: ['数据库', 'SQL', 'NoSQL', '基础概念']
  },
  {
    id: 103,
    title: '云计算入门：从租房到买房理解云服务',
    author: '架构师老王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arch',
    likes: 876,
    image: 'https://picsum.photos/seed/cloud103/400/280',
    height: '240px',
    category: '概念',
    type: 'recommend',
    content: `# 云计算 = 住房模式\n\n## 三种云服务模式\n\n### IaaS - 毛坯房\n你租了一间空房，自己装修、买家具\n- 例子：阿里云ECS、AWS EC2\n- 你需要自己装系统、配环境\n\n### PaaS - 精装房\n房子已经装修好，你搬进来住就行\n- 例子：Heroku、Vercel\n- 你只需要关注自己的代码\n\n### SaaS - 酒店式公寓\n拎包入住，什么都不用管\n- 例子：钉钉、飞书、Notion\n- 直接使用，无需操心技术\n\n## 什么时候用云？\n\n1. **项目刚起步** - 用云，别自己买服务器\n2. **流量波动大** - 云可以弹性扩容\n3. **团队小** - 省去运维人力\n4. **需要快速上线** - 云服务开箱即用\n\n> 2026年了，除非你有特殊需求，否则上云是最明智的选择。`,
    tags: ['云计算', 'IaaS', 'PaaS', 'SaaS', '基础概念']
  },
  {
    id: 104,
    title: '前端到底是什么？一篇文章搞懂前端开发',
    author: '前端小芳',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frontend',
    likes: 1543,
    image: 'https://picsum.photos/seed/fe104/400/250',
    height: '190px',
    category: '概念',
    type: 'recommend',
    content: `# 前端 = 用户能看到的一切\n\n想象一家餐厅：\n- **前端** = 餐厅的装修、菜单、服务员的态度\n- **后端** = 厨房、食材仓库、厨师\n\n## 前端三件套\n\n### HTML - 骨架\n像房子的结构，墙壁、门、窗\n\n### CSS - 皮肤\n像房子的装修，颜色、壁纸、灯光\n\n### JavaScript - 神经系统\n让房子"活"起来，开关灯、开门关门\n\n## 2026年前端技术栈\n\n| 技术 | 用途 | 学习难度 |\n|------|------|----------|\n| React | 构建界面 | 中等 |\n| Vue | 构建界面 | 较低 |\n| TypeScript | 类型安全 | 中等 |\n| Tailwind CSS | 样式 | 较低 |\n| Next.js | 全栈框架 | 中等 |\n\n> 前端入门容易，精通难。但只要坚持，人人都能做出漂亮的页面。`,
    tags: ['前端', 'HTML', 'CSS', 'JavaScript', '基础概念']
  },
  {
    id: 105,
    title: '后端开发全景图：看不见的英雄世界',
    author: '后端老张',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=backend',
    likes: 734,
    image: 'https://picsum.photos/seed/be105/400/300',
    height: '220px',
    category: '概念',
    type: 'recommend',
    content: `# 后端 = 餐厅的厨房\n\n用户看到的是精美的菜品（前端），但真正让餐厅运转的是厨房（后端）。\n\n## 后端的核心职责\n\n1. **数据处理** - 接收、验证、存储数据\n2. **业务逻辑** - 处理规则和流程\n3. **API提供** - 给前端提供数据接口\n4. **安全防护** - 验证身份、防止攻击\n5. **性能优化** - 让系统又快又稳\n\n## 后端技术选型\n\n### 语言选择\n- **Node.js** - 前端转后端首选\n- **Python** - AI/数据方向首选\n- **Go** - 高性能服务首选\n- **Java** - 企业级应用首选\n\n### 框架推荐\n- Express / Fastify（Node.js）\n- Django / FastAPI（Python）\n- Gin（Go）\n- Spring Boot（Java）\n\n> 后端不酷炫，但它是整个系统的基石。没有后端，前端只是空壳。`,
    tags: ['后端', 'Node.js', 'Python', '基础概念']
  },
  {
    id: 106,
    title: '什么是微服务？用乐高积木来理解架构演进',
    author: '架构师老王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arch',
    likes: 645,
    image: 'https://picsum.photos/seed/micro106/400/240',
    height: '180px',
    category: '概念',
    type: 'recommend',
    content: `# 微服务 = 乐高积木式架构\n\n## 单体架构 vs 微服务\n\n### 单体架构 - 一整块积木\n所有功能都在一个项目里，改一个地方可能影响全部\n\n**优点**：简单、好部署\n**缺点**：改一处动全身、难以扩展\n\n### 微服务 - 多块积木拼装\n每个功能是独立的积木块，可以单独修改和替换\n\n**优点**：独立部署、灵活扩展\n**缺点**：复杂度高、运维成本大\n\n## 什么时候用微服务？\n\n1. **团队超过10人** - 需要分工协作\n2. **功能模块清晰** - 能拆出独立服务\n3. **有DevOps能力** - 能管理多个服务\n4. **流量需要弹性** - 不同模块流量差异大\n\n> 不要为了微服务而微服务！小项目用单体就够了。`,
    tags: ['微服务', '架构', '基础概念']
  },
  {
    id: 107,
    title: 'CDN加速原理：为什么你的网站打开这么慢？',
    author: '运维小陈',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ops',
    likes: 523,
    image: 'https://picsum.photos/seed/cdn107/400/290',
    height: '210px',
    category: '概念',
    type: 'tech',
    content: `# CDN = 快递前置仓\n\n想象你在北京，要从广州仓库收快递，需要3天。但如果在北京有前置仓，当天就能收到。\n\n## CDN工作原理\n\n1. 你的网站服务器在广州\n2. CDN在全国各地部署了"前置仓"（节点）\n3. 用户访问时，从最近的节点获取内容\n4. 速度从3秒变成0.3秒\n\n## 什么内容需要CDN？\n\n- **静态资源** - 图片、CSS、JS文件\n- **大文件下载** - 安装包、视频\n- **直播流** - 减少延迟\n\n## 推荐CDN服务\n\n| 服务 | 特点 | 价格 |\n|------|------|------|\n| Cloudflare | 全球节点，免费套餐 | 免费起 |\n| 阿里云CDN | 国内速度快 | 按流量计费 |\n| Vercel | 前端项目首选 | 免费额度大 |\n\n> 网站打开超过3秒，50%的用户就会离开。CDN是最简单有效的加速方案。`,
    tags: ['CDN', '性能优化', '基础概念']
  },
  {
    id: 108,
    title: '什么是容器化？Docker用搬家来解释',
    author: 'DevOps达人',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devops',
    likes: 892,
    image: 'https://picsum.photos/seed/docker108/400/270',
    height: '200px',
    category: '概念',
    type: 'tech',
    content: `# Docker = 集装箱式搬家\n\n## 传统部署 = 自己搬家\n每次搬家都要重新布置：买家具、装电器、调网络...换一台服务器就要重来一遍。\n\n## Docker部署 = 集装箱搬家\n把整个房间装进集装箱，搬到新地方直接放下就能用。\n\n## 核心概念\n\n- **镜像（Image）** = 集装箱的设计图纸\n- **容器（Container）** = 按图纸造出来的集装箱\n- **Dockerfile** = 写图纸的说明书\n- **Docker Hub** = 图纸共享市场\n\n## 为什么用Docker？\n\n1. **环境一致** - "在我电脑上能跑"的问题彻底解决\n2. **快速部署** - 几秒钟启动一个新环境\n3. **资源隔离** - 不同项目互不干扰\n4. **易于扩展** - 需要更多？多开几个容器\n\n> 2026年，不会Docker就像2010年不会用Git一样，是开发者的基本技能。`,
    tags: ['Docker', '容器化', '基础概念']
  },
  {
    id: 109,
    title: 'Git版本控制：时光机一样的代码管理',
    author: '效率达人阿强',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eff',
    likes: 1102,
    image: 'https://picsum.photos/seed/git109/400/260',
    height: '200px',
    category: '概念',
    type: 'recommend',
    content: `# Git = 代码的时光机\n\n想象你在写论文，每次修改都保存一个副本：\n- 论文_v1.doc\n- 论文_v2.doc\n- 论文_v2_修改版.doc\n- 论文_v2_最终版.doc\n- 论文_v2_最终版_真的最终.doc\n\n**Git就是解决这个问题的！**\n\n## Git核心概念\n\n1. **仓库（Repository）** - 项目的时光机\n2. **提交（Commit）** - 存档点\n3. **分支（Branch）** - 平行宇宙\n4. **合并（Merge）** - 把平行宇宙合到一起\n5. **推送（Push）** - 把存档上传到云端\n6. **拉取（Pull）** - 从云端下载最新存档\n\n## 日常工作流\n\n\`\`\`\ngit add .          # 暂存修改\ngit commit -m "描述" # 创建存档点\ngit push           # 上传到远程\ngit pull           # 下载最新代码\n\`\`\`\n\n> Git是程序员的第一生产力工具，不会Git寸步难行。`,
    tags: ['Git', '版本控制', '基础概念']
  },
  {
    id: 110,
    title: 'HTTP协议：互联网的通用语言',
    author: '网络工程师小李',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=net',
    likes: 467,
    image: 'https://picsum.photos/seed/http110/400/280',
    height: '240px',
    category: '概念',
    type: 'tech',
    content: `# HTTP = 互联网的普通话\n\n全世界有不同语言，但互联网只用一种语言交流——HTTP。\n\n## HTTP请求方法\n\n| 方法 | 含义 | 例子 |\n|------|------|------|\n| GET | 获取数据 | 查看商品详情 |\n| POST | 创建数据 | 提交订单 |\n| PUT | 更新数据 | 修改个人信息 |\n| DELETE | 删除数据 | 取消订单 |\n\n## HTTP状态码\n\n- **2xx** 成功 - 200 OK，201 Created\n- **3xx** 重定向 - 301 永久搬家，302 临时搬家\n- **4xx** 客户端错误 - 404 找不到，403 没权限\n- **5xx** 服务器错误 - 500 服务器炸了\n\n## HTTPS = 加密的HTTP\n\nHTTP是明信片，谁都能看；HTTPS是密封信封，只有收件人能看。\n\n> 理解HTTP是理解整个Web开发的基础，这是必修课。`,
    tags: ['HTTP', '网络协议', '基础概念']
  },

  // ---- 避坑 (pitfall) - 8 posts ----
  {
    id: 201,
    title: '2026年全栈选型：别再用WordPress做电商了',
    author: '架构师老王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arch',
    likes: 892,
    image: 'https://picsum.photos/seed/wp201/400/240',
    height: '180px',
    category: '避坑',
    type: 'practice',
    content: `# 为什么WordPress不适合做电商？\n\n1. **性能瓶颈** - WordPress本质是博客系统，电商场景下性能捉急\n2. **扩展困难** - 插件冲突是家常便饭，越装越慢\n3. **安全风险** - 插件漏洞频发，每年都有大规模安全事件\n4. **定制成本高** - 想做点特殊功能？改源码吧\n\n## 更好的选择\n\n### 小型电商\n- **Shopify** - 开店最快，月费制\n- **有赞** - 国内生态好\n\n### 中型电商\n- **Next.js + Stripe** - 灵活可控\n- **Nuxt.js + 支付宝** - 国内支付友好\n\n### 大型电商\n- **微服务架构** - 完全定制\n- **阿里云电商解决方案** - 省心但贵\n\n> WordPress是好工具，但不是万能工具。用错工具比没有工具更可怕。`,
    tags: ['WordPress', '电商', '选型', '避坑']
  },
  {
    id: 202,
    title: 'jQuery已死？2026年还在用jQuery的5大风险',
    author: '前端小芳',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frontend',
    likes: 678,
    image: 'https://picsum.photos/seed/jquery202/400/280',
    height: '220px',
    category: '避坑',
    type: 'practice',
    content: `# jQuery的5大风险\n\n## 1. 性能问题\njQuery的DOM操作方式在现代浏览器中效率低下\n\n## 2. 安全漏洞\njQuery老版本存在XSS等已知漏洞，且修复不及时\n\n## 3. 招聘困难\n2026年，会jQuery的新人越来越少，维护成本越来越高\n\n## 4. 生态萎缩\n新库和工具不再提供jQuery插件版本\n\n## 5. 技术债务\n越晚迁移，积累的技术债越多\n\n## 迁移方案\n\n1. **渐进式迁移** - 新功能用Vue/React，旧功能逐步替换\n2. **整体重构** - 如果项目不大，直接重写\n3. **兼容层** - 用原生JS封装jQuery常用方法\n\n> 不是jQuery不好，而是时代变了。就像马车没有不好，只是现在有汽车了。`,
    tags: ['jQuery', '前端', '避坑', '技术债务']
  },
  {
    id: 203,
    title: 'SPA单页应用的SEO灾难：如何拯救你的搜索排名',
    author: 'SEO专家阿明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seo',
    likes: 534,
    image: 'https://picsum.photos/seed/spa203/400/250',
    height: '190px',
    category: '避坑',
    type: 'practice',
    content: `# SPA的SEO问题\n\n## 问题根源\nSPA（单页应用）的内容通过JavaScript动态渲染，搜索引擎爬虫可能看不到内容。\n\n## 解决方案\n\n### 方案一：SSR（服务端渲染）\n- Next.js（React）\n- Nuxt.js（Vue）\n- 服务器先渲染好HTML再发给浏览器\n\n### 方案二：SSG（静态生成）\n- 适合内容不常变化的页面\n- 构建时生成HTML文件\n- 访问速度极快\n\n### 方案三：预渲染\n- 适合少量页面的SPA\n- 用Prerender等工具\n\n## 选择建议\n\n| 场景 | 推荐方案 |\n|------|----------|\n| 博客/官网 | SSG |\n| 电商/社交 | SSR |\n| 后台管理 | SPA（不需要SEO） |\n\n> SEO不是可选的，是必须的。没有流量，再好的产品也没人看到。`,
    tags: ['SPA', 'SEO', 'SSR', '避坑']
  },
  {
    id: 204,
    title: '新手最常犯的10个数据库设计错误',
    author: '数据达人',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=data',
    likes: 1456,
    image: 'https://picsum.photos/seed/db204/400/300',
    height: '260px',
    category: '避坑',
    type: 'practice',
    content: `# 数据库设计10大错误\n\n## 1. 没有主键\n每张表必须有主键，没有例外\n\n## 2. 在一个字段里存多个值\n不要用"1,2,3"这种格式，用关联表\n\n## 3. 忽略索引\n查询慢？先看看有没有加索引\n\n## 4. 过度使用外键\n外键保证数据一致性，但影响性能，大项目慎用\n\n## 5. 表名和字段名不规范\n统一命名规范，团队协作不混乱\n\n## 6. 不考虑数据量增长\n设计时要考虑数据量增长10倍、100倍的情况\n\n## 7. 把所有数据放一张表\n适当分表，遵循范式设计\n\n## 8. 不做数据备份\n数据无价，备份是生命线\n\n## 9. 密码明文存储\n必须加密！SHA256 + 盐值是最低要求\n\n## 10. 忽略字符编码\n统一使用UTF-8，避免乱码\n\n> 数据库设计是地基，地基不牢，大厦将倾。`,
    tags: ['数据库', '设计', '避坑', '新手']
  },
  {
    id: 205,
    title: '过度工程化：当你的项目只需要一个博客时',
    author: '极简主义者',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=minimal',
    likes: 789,
    image: 'https://picsum.photos/seed/over205/400/240',
    height: '180px',
    category: '避坑',
    type: 'practice',
    content: `# 过度工程化的典型表现\n\n## 症状清单\n\n1. **5个人的项目用了微服务架构**\n2. **个人博客用了Kubernetes**\n3. **简单的CRUD用了DDD**\n4. **3个页面的项目用了Monorepo**\n5. **内部工具做了完整的CI/CD流水线**\n\n## 为什么会过度工程化？\n\n- 想学习新技术（动机不纯）\n- 怕未来扩展不了（过度担忧）\n- 照搬大厂方案（不切实际）\n\n## 正确的做法\n\n1. **从最简方案开始** - 能用SQLite别用PostgreSQL\n2. **按需升级** - 遇到瓶颈再优化\n3. **关注业务价值** - 技术服务于业务\n4. **定期审视** - 每月检查技术栈是否合理\n\n> 最好的架构是刚好够用的架构。过度设计比设计不足更危险。`,
    tags: ['过度工程化', '架构', '避坑']
  },
  {
    id: 206,
    title: 'npm包安全事件频发：如何保护你的项目',
    author: '安全专家阿杰',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=security',
    likes: 423,
    image: 'https://picsum.photos/seed/npm206/400/270',
    height: '200px',
    category: '避坑',
    type: 'practice',
    content: `# npm包安全风险\n\n## 常见攻击方式\n\n1. **恶意包** - 名字和流行包很像，安装后窃取信息\n2. **依赖链攻击** - 你依赖的包的依赖被入侵\n3. **包作者作恶** - 原本正常的包被作者加入恶意代码\n\n## 防护措施\n\n### 安装前检查\n- 查看包的下载量、Star数\n- 检查维护者是否活跃\n- 看看Issues里有没有安全相关讨论\n\n### 使用工具\n- **npm audit** - 检查已知漏洞\n- **Snyk** - 持续安全监控\n- **package-lock.json** - 锁定版本\n\n### 最佳实践\n- 尽量减少依赖数量\n- 定期更新依赖\n- 使用lockfile确保一致性\n\n> 你安装的每个npm包都是对你项目的信任投票，请谨慎投票。`,
    tags: ['npm', '安全', '避坑']
  },
  {
    id: 207,
    title: '移动端适配踩坑大全：从320px到4K屏',
    author: '前端小芳',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frontend',
    likes: 967,
    image: 'https://picsum.photos/seed/mobile207/400/260',
    height: '200px',
    category: '避坑',
    type: 'practice',
    content: `# 移动端适配常见问题\n\n## 1. 1px边框问题\n在高清屏上，1px CSS像素 = 2-3个物理像素，看起来很粗\n**解决**：用transform: scaleY(0.5)或SVG\n\n## 2. 300ms点击延迟\n移动端双击缩放导致的延迟\n**解决**：设置viewport meta标签\n\n## 3. 安全区域适配\niPhone刘海屏底部有安全区域\n**解决**：使用env(safe-area-inset-bottom)\n\n## 4. 软键盘遮挡输入框\n输入框被弹出的键盘挡住\n**解决**：监听resize事件，滚动到可见区域\n\n## 5. 滚动穿透\n弹窗打开时，背景页面还能滚动\n**解决**：弹窗打开时给body加overflow:hidden\n\n## 响应式设计建议\n\n- 移动优先（Mobile First）\n- 使用rem/vw替代px\n- 弹性布局（Flexbox/Grid）\n- 图片使用srcset适配不同分辨率\n\n> 移动端适配没有银弹，只有不断踩坑和积累经验。`,
    tags: ['移动端', '适配', 'CSS', '避坑']
  },
  {
    id: 208,
    title: '代码审查中最常见的8个安全隐患',
    author: '安全专家阿杰',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=security',
    likes: 654,
    image: 'https://picsum.photos/seed/sec208/400/280',
    height: '220px',
    category: '避坑',
    type: 'practice',
    content: `# Code Review安全清单\n\n## 1. SQL注入\n永远不要拼接SQL字符串，使用参数化查询\n\n## 2. XSS攻击\n用户输入必须转义，不要用v-html/innerHTML\n\n## 3. CSRF攻击\n敏感操作加CSRF Token验证\n\n## 4. 敏感信息泄露\n密码、密钥不能出现在代码和日志中\n\n## 5. 越权访问\n每个API都要验证用户权限\n\n## 6. 文件上传漏洞\n限制文件类型、大小，不要用用户提供的文件名\n\n## 7. 不安全的依赖\n定期运行npm audit，及时更新有漏洞的包\n\n## 8. 错误处理不当\n不要把堆栈信息暴露给用户\n\n## 检查工具推荐\n\n- **ESLint安全插件** - 静态代码分析\n- **SonarQube** - 持续代码质量检查\n- **OWASP ZAP** - 自动化安全测试\n\n> 安全不是功能，是底线。一次安全事故的代价远超安全投入。`,
    tags: ['安全', '代码审查', '避坑']
  },

  // ---- 对比 (comparison) - 8 posts ----
  {
    id: 301,
    title: 'React vs Vue：2026年该选哪一个？全面对比',
    author: '效率达人阿强',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eff',
    likes: 3421,
    image: 'https://picsum.photos/seed/rv301/400/280',
    height: '200px',
    category: '对比',
    type: 'tech',
    content: `# React vs Vue 全面对比\n\n| 维度 | React | Vue |\n|------|-------|-----|\n| 学习曲线 | 中等 | 较低 |\n| 生态系统 | 最大 | 丰富 |\n| 社区规模 | 最大 | 大 |\n| 就业市场 | 最多 | 多 |\n| 性能 | 优秀 | 优秀 |\n| TypeScript | 原生支持 | 3.x原生支持 |\n| 移动端 | React Native | Uni-app |\n\n## 选React的情况\n- 大公司、大团队\n- 需要React Native做移动端\n- 生态需求复杂\n\n## 选Vue的情况\n- 中小团队、快速开发\n- 国内就业市场友好\n- 学习成本敏感\n\n## 2026年趋势\n\n两个框架都很成熟，选哪个都不会错。关键看团队背景和项目需求。\n\n> 框架只是工具，真正重要的是解决问题的能力。`,
    tags: ['React', 'Vue', '前端', '对比']
  },
  {
    id: 302,
    title: 'SQL vs NoSQL：5个维度帮你选对数据库',
    author: '数据达人',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=data',
    likes: 1234,
    image: 'https://picsum.photos/seed/sql302/400/260',
    height: '200px',
    category: '对比',
    type: 'tech',
    content: `# SQL vs NoSQL 终极对比\n\n## 数据结构\n- **SQL** - 固定的表格结构，像Excel\n- **NoSQL** - 灵活的文档结构，像JSON\n\n## 扩展方式\n- **SQL** - 纵向扩展（加配置）\n- **NoSQL** - 横向扩展（加机器）\n\n## 事务支持\n- **SQL** - ACID事务，数据一致性有保障\n- **NoSQL** - 最终一致性，部分支持事务\n\n## 查询能力\n- **SQL** - 强大的JOIN和聚合查询\n- **NoSQL** - 简单查询，复杂查询需要代码实现\n\n## 适用场景\n\n| 场景 | 推荐 |\n|------|------|\n| 电商订单 | SQL |\n| 社交动态 | NoSQL |\n| 财务系统 | SQL |\n| IoT数据 | NoSQL |\n| 内容管理 | 看需求 |\n\n> 2026年最流行的方案：SQL做核心业务，NoSQL做缓存和日志。两者配合使用。`,
    tags: ['SQL', 'NoSQL', '数据库', '对比']
  },
  {
    id: 303,
    title: 'Next.js vs Nuxt.js：React和Vue的全框架对决',
    author: '全栈小周',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fullstack',
    likes: 876,
    image: 'https://picsum.photos/seed/next303/400/250',
    height: '190px',
    category: '对比',
    type: 'tech',
    content: `# Next.js vs Nuxt.js\n\n## 核心定位\n- **Next.js** - React生态的全栈框架\n- **Nuxt.js** - Vue生态的全栈框架\n\n## 功能对比\n\n| 功能 | Next.js | Nuxt.js |\n|------|---------|--------|\n| SSR | 支持 | 支持 |\n| SSG | 支持 | 支持 |\n| API路由 | 支持 | 支持 |\n| 文件路由 | 支持 | 支持 |\n| 自动导入 | 需配置 | 默认支持 |\n| 部署 | Vercel | Vercel |\n\n## 性能对比\n两者性能相当，差距在5%以内，可以忽略。\n\n## 选择建议\n\n1. **团队用React** → Next.js\n2. **团队用Vue** → Nuxt.js\n3. **从零开始** → 看个人偏好\n4. **需要SEO** → 两个都行\n\n> 不要纠结框架选择，把时间花在业务上。两个都是顶级框架。`,
    tags: ['Next.js', 'Nuxt.js', '全栈', '对比']
  },
  {
    id: 304,
    title: 'Python vs JavaScript：2026年该学哪个？',
    author: '编程教练',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach',
    likes: 2567,
    image: 'https://picsum.photos/seed/pyjs304/400/300',
    height: '240px',
    category: '对比',
    type: 'recommend',
    content: `# Python vs JavaScript\n\n## 语言特点\n\n### Python\n- 语法简洁，像读英语\n- AI/数据科学首选\n- 后端开发成熟\n\n### JavaScript\n- Web开发唯一语言\n- 全栈能力（Node.js）\n- 生态最丰富\n\n## 就业方向\n\n| 方向 | 推荐 |\n|------|------|\n| 前端开发 | JavaScript |\n| AI/ML | Python |\n| 数据分析 | Python |\n| 全栈开发 | JavaScript |\n| 自动化脚本 | Python |\n| 移动开发 | JavaScript |\n\n## 最佳策略\n\n**两个都学！**\n\n1. 先学JavaScript（前端入门）\n2. 再学Python（AI/数据方向）\n3. 两个语言互补，覆盖90%的开发场景\n\n> 2026年，只会一种语言是不够的。Python+JS是最强组合。`,
    tags: ['Python', 'JavaScript', '编程语言', '对比']
  },
  {
    id: 305,
    title: 'Tailwind CSS vs 传统CSS：写样式的两种哲学',
    author: '前端小芳',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frontend',
    likes: 743,
    image: 'https://picsum.photos/seed/tw305/400/240',
    height: '180px',
    category: '对比',
    type: 'tech',
    content: `# Tailwind CSS vs 传统CSS\n\n## 传统CSS\n\`\`\`css\n.card {\n  background: white;\n  border-radius: 8px;\n  padding: 16px;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}\n\`\`\`\n\n## Tailwind CSS\n\`\`\`html\n<div class="bg-white rounded-lg p-4 shadow-md">\n\`\`\`\n\n## 对比\n\n| 维度 | 传统CSS | Tailwind |\n|------|---------|----------|\n| 学习成本 | 低 | 中 |\n| 开发速度 | 慢 | 快 |\n| 代码量 | 少 | 多 |\n| 可维护性 | 看规范 | 高 |\n| 设计一致性 | 难保证 | 内置保证 |\n\n## 推荐\n\n- **新项目** → Tailwind CSS\n- **老项目** → 渐进引入\n- **设计系统** → Tailwind + 自定义主题\n\n> Tailwind不是万能的，但它确实让写CSS变得更高效了。`,
    tags: ['Tailwind', 'CSS', '前端', '对比']
  },
  {
    id: 306,
    title: 'Vercel vs Netlify：前端部署平台终极对比',
    author: '运维小陈',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ops',
    likes: 567,
    image: 'https://picsum.photos/seed/vercel306/400/270',
    height: '200px',
    category: '对比',
    type: 'tech',
    content: `# Vercel vs Netlify\n\n## 核心能力\n\n| 功能 | Vercel | Netlify |\n|------|--------|---------|\n| 静态部署 | 免费 | 免费 |\n| SSR支持 | 原生(Next.js) | 支持 |\n| Serverless | 支持 | 支持 |\n| CDN | 全球 | 全球 |\n| 构建时间 | 快 | 快 |\n| 自定义域名 | 免费 | 免费 |\n\n## Vercel优势\n- Next.js官方平台，体验最佳\n- Edge Functions性能优秀\n- Preview Deployments协作方便\n\n## Netlify优势\n- 表单处理内置\n- 身份认证内置\n- A/B测试内置\n\n## 选择建议\n\n- **用Next.js** → Vercel（不二之选）\n- **用其他框架** → 两个都行\n- **需要表单/认证** → Netlify\n- **追求极致性能** → Vercel\n\n> 两个平台都有免费额度，个人项目完全够用。`,
    tags: ['Vercel', 'Netlify', '部署', '对比']
  },
  {
    id: 307,
    title: 'MongoDB vs PostgreSQL：文档型vs关系型实战对比',
    author: '数据达人',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=data',
    likes: 654,
    image: 'https://picsum.photos/seed/mongo307/400/250',
    height: '190px',
    category: '对比',
    type: 'tech',
    content: `# MongoDB vs PostgreSQL\n\n## 数据模型\n\n### MongoDB（文档型）\n- 数据存储为JSON文档\n- 灵活的Schema\n- 适合快速迭代\n\n### PostgreSQL（关系型）\n- 数据存储为表格\n- 严格的Schema\n- 数据一致性有保障\n\n## 性能对比\n\n| 操作 | MongoDB | PostgreSQL |\n|------|---------|------------|\n| 简单查询 | 快 | 快 |\n| 复杂JOIN | 不支持 | 优秀 |\n| 写入速度 | 快 | 中等 |\n| 事务 | 4.0后支持 | 原生支持 |\n\n## 什么时候选MongoDB？\n- 数据结构经常变化\n- 需要快速原型开发\n- 日志/分析数据\n\n## 什么时候选PostgreSQL？\n- 数据关系复杂\n- 需要强一致性\n- 财务/订单系统\n\n> 2026年，PostgreSQL越来越强，支持JSON字段，一库两用。`,
    tags: ['MongoDB', 'PostgreSQL', '数据库', '对比']
  },
  {
    id: 308,
    title: 'Figma vs Sketch vs XD：2026设计工具王者是谁？',
    author: '设计师小美',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=designer',
    likes: 1876,
    image: 'https://picsum.photos/seed/figma308/400/280',
    height: '220px',
    category: '对比',
    type: 'recommend',
    content: `# 设计工具三巨头对比\n\n| 维度 | Figma | Sketch | XD |\n|------|-------|--------|-----|\n| 平台 | 全平台 | macOS | 全平台 |\n| 协作 | 实时 | 需插件 | 需插件 |\n| 价格 | 免费起 | 付费 | 订阅制 |\n| 插件 | 丰富 | 丰富 | 一般 |\n| 性能 | 云端 | 本地 | 本地 |\n\n## 2026年结论\n\n**Figma是王者**\n\n1. 实时协作是杀手级功能\n2. 免费版够用\n3. 开发者友好（Dev Mode）\n4. 社区资源最丰富\n\n## 其他工具\n- **Framer** - 交互原型最强\n- **Penpot** - 开源Figma替代\n- **Motiff** - AI驱动设计工具\n\n> 设计工具选Figma就对了，省下的决策时间用来提升设计能力。`,
    tags: ['Figma', 'Sketch', '设计工具', '对比']
  },

  // ---- 路径 (path) - 6 posts ----
  {
    id: 401,
    title: '从零开始：18天掌握 AI 产品经理技能树',
    author: '职场导师Lily',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lily',
    likes: 567,
    image: 'https://picsum.photos/seed/ai401/400/320',
    height: '240px',
    category: '路径',
    type: 'guide',
    content: `# AI产品经理技能树\n\n## 第一周：基础认知\n- Day 1-2: AI基础概念（机器学习、深度学习、大模型）\n- Day 3-4: Prompt工程入门\n- Day 5-7: AI产品案例分析\n\n## 第二周：实战技能\n- Day 8-9: AI需求分析方法论\n- Day 10-11: AI产品数据指标设计\n- Day 12-14: AI产品原型设计\n\n## 第三周：进阶提升\n- Day 15-16: AI伦理与合规\n- Day 17-18: AI产品运营策略\n\n> 成为AI产品经理不需要写代码，但需要理解技术边界。`,
    tags: ['AI', '产品经理', '学习路径']
  },
  {
    id: 402,
    title: '前端工程师成长路线：从切图到架构师',
    author: '前端小芳',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frontend',
    likes: 2345,
    image: 'https://picsum.photos/seed/fe402/400/260',
    height: '200px',
    category: '路径',
    type: 'guide',
    content: `# 前端工程师成长路线\n\n## 阶段一：入门（0-6个月）\n- HTML/CSS/JavaScript基础\n- Git版本控制\n- 一个框架入门（Vue或React）\n\n## 阶段二：进阶（6-18个月）\n- TypeScript\n- 状态管理（Pinia/Redux）\n- 构建工具（Vite）\n- CSS工程化（Tailwind）\n\n## 阶段三：高级（18-36个月）\n- 性能优化\n- SSR/SSG\n- 微前端\n- 自动化测试\n\n## 阶段四：架构（36个月+）\n- 前端架构设计\n- 跨端方案\n- 工程化体系\n- 团队技术管理\n\n> 前端技术更新快，但基础永远不过时。先把基础打牢，再追新技术。`,
    tags: ['前端', '成长路线', '学习路径']
  },
  {
    id: 403,
    title: '后端开发学习路线：从接口到架构',
    author: '后端老张',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=backend',
    likes: 1890,
    image: 'https://picsum.photos/seed/be403/400/280',
    height: '220px',
    category: '路径',
    type: 'guide',
    content: `# 后端开发学习路线\n\n## 阶段一：基础（0-3个月）\n- 一门后端语言（Node.js/Python）\n- HTTP协议基础\n- 数据库基础（SQL）\n\n## 阶段二：实战（3-9个月）\n- RESTful API设计\n- 数据库设计与优化\n- 身份认证（JWT/OAuth）\n- 缓存（Redis）\n\n## 阶段三：进阶（9-18个月）\n- 消息队列\n- 微服务架构\n- Docker容器化\n- CI/CD流水线\n\n## 阶段四：架构（18个月+）\n- 分布式系统设计\n- 高可用架构\n- 数据一致性方案\n- 系统性能调优\n\n> 后端的核心不是语言，而是系统设计能力。语言只是工具。`,
    tags: ['后端', '成长路线', '学习路径']
  },
  {
    id: 404,
    title: 'DevOps工程师养成：从部署到自动化',
    author: 'DevOps达人',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devops',
    likes: 678,
    image: 'https://picsum.photos/seed/devops404/400/250',
    height: '190px',
    category: '路径',
    type: 'guide',
    content: `# DevOps工程师养成路线\n\n## 阶段一：Linux基础\n- 命令行操作\n- 文件系统\n- 权限管理\n- Shell脚本\n\n## 阶段二：容器化\n- Docker基础\n- Docker Compose\n- 镜像构建与优化\n\n## 阶段三：编排与部署\n- Kubernetes基础\n- Helm Charts\n- 服务网格（Istio）\n\n## 阶段四：CI/CD\n- GitHub Actions\n- Jenkins\n- 自动化测试集成\n- 蓝绿部署/金丝雀发布\n\n## 阶段五：监控与运维\n- Prometheus + Grafana\n- 日志收集（ELK）\n- 告警体系\n- 故障排查\n\n> DevOps不是一个人，是一种文化。但DevOps工程师是这种文化的推动者。`,
    tags: ['DevOps', 'Docker', 'Kubernetes', '学习路径']
  },
  {
    id: 405,
    title: '全栈开发者路线图：一个人就是一个团队',
    author: '全栈小周',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fullstack',
    likes: 3456,
    image: 'https://picsum.photos/seed/fs405/400/300',
    height: '240px',
    category: '路径',
    type: 'guide',
    content: `# 全栈开发者路线图\n\n## 前端技能\n- HTML/CSS/JavaScript\n- React或Vue\n- TypeScript\n- Tailwind CSS\n- Next.js或Nuxt.js\n\n## 后端技能\n- Node.js或Python\n- RESTful API设计\n- 数据库（PostgreSQL + Redis）\n- 身份认证\n- 文件处理\n\n## DevOps技能\n- Git工作流\n- Docker基础\n- CI/CD（GitHub Actions）\n- 云服务（Vercel/AWS）\n\n## 软技能\n- 产品思维\n- 沟通能力\n- 时间管理\n- 持续学习\n\n## 推荐技术栈\n\n**轻量全栈**：Next.js + Supabase + Vercel\n**标准全栈**：React + Node.js + PostgreSQL + Docker\n**AI全栈**：Next.js + Python + OpenAI API\n\n> 全栈不是样样精通，而是样样能用。关键是知道什么时候该深入，什么时候该求助。`,
    tags: ['全栈', '学习路径', '成长路线']
  },
  {
    id: 406,
    title: 'AI工程师成长路径：从调参到造模型',
    author: 'AI研究员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=airesearch',
    likes: 1234,
    image: 'https://picsum.photos/seed/aipath406/400/270',
    height: '200px',
    category: '路径',
    type: 'ai',
    content: `# AI工程师成长路径\n\n## 阶段一：AI应用开发\n- Prompt Engineering\n- API调用（OpenAI/Claude）\n- RAG应用开发\n- AI Agent开发\n\n## 阶段二：机器学习基础\n- Python数据处理（NumPy/Pandas）\n- 经典ML算法\n- Scikit-learn实战\n- 特征工程\n\n## 阶段三：深度学习\n- 神经网络基础\n- PyTorch框架\n- CNN/RNN/Transformer\n- 模型训练与调优\n\n## 阶段四：大模型\n- 大模型原理\n- 微调技术（LoRA/QLoRA）\n- 模型部署与推理优化\n- 多模态模型\n\n> 2026年，AI应用开发是入门最快的方向，不需要数学博士也能做出有用的AI产品。`,
    tags: ['AI', '机器学习', '深度学习', '学习路径']
  },

  // ---- 工具 (tool) - 10 posts ----
  {
    id: 501,
    title: 'VS Code 2026最强配置：20个必装插件推荐',
    author: '效率达人阿强',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eff',
    likes: 4567,
    image: 'https://picsum.photos/seed/vscode501/400/280',
    height: '220px',
    category: '工具',
    type: 'recommend',
    content: `# VS Code必装插件\n\n## 代码质量\n1. **ESLint** - 代码规范检查\n2. **Prettier** - 代码格式化\n3. **TypeScript Error Translator** - TS错误翻译\n\n## 开发效率\n4. **GitLens** - Git增强\n5. **Thunder Client** - API测试\n6. **Auto Rename Tag** - 标签自动重命名\n7. **Path Intellisense** - 路径自动补全\n\n## AI辅助\n8. **GitHub Copilot** - AI代码补全\n9. **Codeium** - 免费AI补全替代\n10. **Continue** - 开源AI编程助手\n\n## UI/UX\n11. **Material Icon Theme** - 文件图标\n12. **One Dark Pro** - 暗色主题\n13. **Indent Rainbow** - 缩进彩虹\n\n## 框架专用\n14. **Vue - Official** - Vue开发必备\n15. **ES7+ React Snippets** - React代码片段\n\n## 其他\n16. **Docker** - 容器管理\n17. **DotENV** - 环境变量高亮\n18. **Error Lens** - 错误行内显示\n19. **Todo Tree** - TODO标记管理\n20. **Live Share** - 实时协作\n\n> 好的工具配置能让开发效率提升50%，但别装太多，够用就好。`,
    tags: ['VS Code', '插件', '开发工具', '效率']
  },
  {
    id: 502,
    title: 'Git工作流实战：从入门到团队协作',
    author: '效率达人阿强',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eff',
    likes: 1234,
    image: 'https://picsum.photos/seed/git502/400/250',
    height: '190px',
    category: '工具',
    type: 'guide',
    content: `# Git工作流实战\n\n## 基础命令\n\n\`\`\`bash\ngit init           # 初始化仓库\ngit add .          # 暂存所有修改\ngit commit -m "xx"  # 提交\ngit push           # 推送\ngit pull           # 拉取\n\`\`\`\n\n## 分支策略\n\n### Git Flow\n适合发布周期长的项目\n- main：生产分支\n- develop：开发分支\n- feature/*：功能分支\n\n### GitHub Flow\n适合持续部署的项目\n- main：始终可部署\n- feature/*：功能分支\n\n## 常见问题解决\n\n1. **提交错了** → git reset --soft HEAD~1\n2. **合并冲突** → 手动解决 → git add → git commit\n3. **需要暂存** → git stash → git stash pop\n\n> Git是团队协作的基础，不会Git就无法参与团队开发。`,
    tags: ['Git', '版本控制', '团队协作']
  },
  {
    id: 503,
    title: 'Docker入门：5分钟学会容器化部署',
    author: 'DevOps达人',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devops',
    likes: 2345,
    image: 'https://picsum.photos/seed/docker503/400/260',
    height: '200px',
    category: '工具',
    type: 'guide',
    content: `# Docker 5分钟入门\n\n## 安装Docker\n\n下载Docker Desktop，安装后重启电脑即可。\n\n## 第一个容器\n\n\`\`\`bash\n# 拉取Nginx镜像\ndocker pull nginx\n\n# 运行容器\ndocker run -d -p 8080:80 nginx\n\n# 访问 http://localhost:8080\n\`\`\`\n\n## Dockerfile编写\n\n\`\`\`dockerfile\nFROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["npm", "start"]\n\`\`\`\n\n## Docker Compose\n\n\`\`\`yaml\nservices:\n  web:\n    build: .\n    ports:\n      - "3000:3000"\n  db:\n    image: postgres:15\n    environment:\n      POSTGRES_PASSWORD: secret\n\`\`\`\n\n> Docker是现代开发的标配，学会它你的部署效率会翻倍。`,
    tags: ['Docker', '容器化', '部署', '入门']
  },
  {
    id: 504,
    title: 'Figma开发者指南：设计师和开发者的桥梁',
    author: '设计师小美',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=designer',
    likes: 1567,
    image: 'https://picsum.photos/seed/figma504/400/240',
    height: '180px',
    category: '工具',
    type: 'guide',
    content: `# Figma开发者指南\n\n## Dev Mode\n\nFigma的Dev Mode是开发者的最佳伙伴：\n- 查看精确的CSS代码\n- 复制间距、颜色值\n- 导出切图资源\n- 查看组件变体\n\n## 开发者常用操作\n\n1. **查看标注** - 选中元素 → 右侧面板查看尺寸\n2. **导出图片** - 选中元素 → Export面板\n3. **查看代码** - Dev Mode → 复制CSS/Tailwind代码\n4. **检查交互** - Prototype面板查看动画效果\n\n## 设计Token\n\n从Figma导出设计Token：\n- 颜色变量 → CSS变量\n- 字体大小 → Tailwind配置\n- 间距系统 → spacing配置\n\n## 协作技巧\n\n- 在Figma中直接评论\n- 用分支（Branching）做设计迭代\n- 用组件库保持一致性\n\n> Figma不只是设计工具，它是设计师和开发者沟通的桥梁。`,
    tags: ['Figma', '设计', '协作', '开发工具']
  },
  {
    id: 505,
    title: 'Postman替代品：2026年API测试工具推荐',
    author: '后端老张',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=backend',
    likes: 876,
    image: 'https://picsum.photos/seed/api505/400/280',
    height: '220px',
    category: '工具',
    type: 'recommend',
    content: `# API测试工具推荐\n\n## 1. Thunder Client（VS Code插件）\n- 在VS Code内直接测试API\n- 轻量、快速\n- 免费使用\n\n## 2. Bruno\n- 开源免费\n- 本地存储，不强制登录\n- 支持Git管理API集合\n\n## 3. Hoppscotch\n- 开源替代Postman\n- 界面简洁\n- 支持WebSocket/SSE\n\n## 4. Insomnia\n- GraphQL支持好\n- 界面美观\n- 免费版够用\n\n## 5. curl\n- 命令行工具\n- 无需安装\n- 脚本自动化首选\n\n## 对比\n\n| 工具 | 价格 | 特色 |\n|------|------|------|\n| Thunder Client | 免费 | VS Code集成 |\n| Bruno | 免费 | 开源本地 |\n| Hoppscotch | 免费 | 轻量开源 |\n| Insomnia | 免费/付费 | GraphQL |\n| curl | 免费 | 命令行 |\n\n> 2026年，Postman强制登录和云端同步让很多人转向替代品。推荐Bruno或Thunder Client。`,
    tags: ['API', '测试工具', 'Postman', '开发工具']
  },
  {
    id: 506,
    title: 'Vite为什么这么快？构建工具深度对比',
    author: '前端小芳',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frontend',
    likes: 1987,
    image: 'https://picsum.photos/seed/vite506/400/250',
    height: '190px',
    category: '工具',
    type: 'tech',
    content: `# Vite为什么这么快？\n\n## 传统构建（Webpack）\n\n启动时需要打包所有模块 → 项目越大越慢\n\n## Vite的革新\n\n### 开发模式\n1. **不打包** - 利用浏览器原生ESM\n2. **按需编译** - 只编译当前页面用到的代码\n3. **esbuild预构建** - 用Go语言写的，比JS快100倍\n\n### 生产模式\n1. 使用Rollup打包\n2. 代码分割优化\n3. Tree-shaking\n\n## 构建工具对比\n\n| 工具 | 启动速度 | 热更新 | 生态 |\n|------|----------|--------|------|\n| Vite | 极快 | 极快 | 丰富 |\n| Webpack | 慢 | 中等 | 最丰富 |\n| Turbopack | 快 | 快 | 早期 |\n| Rspack | 快 | 快 | 增长中 |\n\n> 2026年，新项目默认选Vite就对了。Webpack只用于老项目维护。`,
    tags: ['Vite', '构建工具', 'Webpack', '前端']
  },
  {
    id: 507,
    title: 'GitHub Copilot vs Cursor：AI编程助手终极对比',
    author: 'AI探索者',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai',
    likes: 3456,
    image: 'https://picsum.photos/seed/copilot507/400/270',
    height: '200px',
    category: '工具',
    type: 'ai',
    content: `# AI编程助手对比\n\n## GitHub Copilot\n- VS Code插件形式\n- 代码补全为主\n- Chat功能\n- $10/月\n\n## Cursor\n- 独立IDE\n- 基于VS Code\n- 内置AI对话\n- 代码生成更强\n- 免费额度 + $20/月\n\n## 功能对比\n\n| 功能 | Copilot | Cursor |\n|------|---------|--------|\n| 代码补全 | 优秀 | 优秀 |\n| AI对话 | 一般 | 优秀 |\n| 代码重构 | 基础 | 强大 |\n| 多文件编辑 | 弱 | 强 |\n| 价格 | $10/月 | 免费/$20 |\n\n## 选择建议\n\n- **轻度使用** → Copilot免费版\n- **重度AI辅助** → Cursor\n- **团队协作** → Copilot Business\n- **预算有限** → Continue(开源)\n\n> AI编程助手不是替代你，而是让你从搬砖变成指挥搬砖。`,
    tags: ['AI', 'Copilot', 'Cursor', '编程工具']
  },
  {
    id: 508,
    title: 'Notion vs Obsidian：知识管理工具选择指南',
    author: '知识管理师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=knowledge',
    likes: 1234,
    image: 'https://picsum.photos/seed/notion508/400/240',
    height: '180px',
    category: '工具',
    type: 'recommend',
    content: `# Notion vs Obsidian\n\n## Notion\n- 云端协作，团队首选\n- 数据库功能强大\n- 模板生态丰富\n- 免费版够用\n\n## Obsidian\n- 本地存储，数据自主\n- 双向链接，知识图谱\n- 插件生态强大\n- Markdown原生\n\n## 对比\n\n| 维度 | Notion | Obsidian |\n|------|--------|----------|\n| 存储 | 云端 | 本地 |\n| 协作 | 优秀 | 需插件 |\n| 离线 | 有限 | 完美 |\n| 速度 | 中等 | 极快 |\n| 隐私 | 一般 | 优秀 |\n| 价格 | 免费/$10 | 免费/$4 |\n\n## 选择建议\n\n- **团队协作** → Notion\n- **个人知识库** → Obsidian\n- **项目管理** → Notion\n- **深度写作** → Obsidian\n- **两者结合** → Notion管项目，Obsidian管知识\n\n> 工具只是载体，重要的是建立自己的知识管理体系。`,
    tags: ['Notion', 'Obsidian', '知识管理', '效率工具']
  },
  {
    id: 509,
    title: 'Chrome DevTools高级技巧：调试效率翻倍',
    author: '效率达人阿强',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eff',
    likes: 1567,
    image: 'https://picsum.photos/seed/chrome509/400/260',
    height: '200px',
    category: '工具',
    type: 'practice',
    content: `# Chrome DevTools高级技巧\n\n## 1. 条件断点\n右键代码行号 → Add conditional breakpoint → 输入条件\n\n## 2. Console高级用法\n\`\`\`javascript\nconsole.table(data)    // 表格显示\nconsole.group('name')  // 分组\nconsole.time('name')   // 计时\nconsole.trace()        // 调用栈\n\`\`\`\n\n## 3. Network面板\n- 按XHR过滤只看API请求\n- 右键请求 → Copy as fetch\n- 禁用缓存（Disable cache）\n\n## 4. Performance面板\n- 录制页面操作\n- 分析渲染瓶颈\n- 查看长任务\n\n## 5. 快捷键\n- Ctrl+Shift+I：打开DevTools\n- Ctrl+P：搜索文件\n- Ctrl+Shift+F：全局搜索\n- Ctrl+G：跳转行\n\n> 熟练使用DevTools，调试时间至少减少50%。`,
    tags: ['Chrome', 'DevTools', '调试', '开发工具']
  },
  {
    id: 510,
    title: 'Supabase入门：开源Firebase替代方案',
    author: '全栈小周',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fullstack',
    likes: 987,
    image: 'https://picsum.photos/seed/supa510/400/280',
    height: '220px',
    category: '工具',
    type: 'guide',
    content: `# Supabase = 开源Firebase\n\n## 核心功能\n\n1. **PostgreSQL数据库** - 全功能关系型数据库\n2. **身份认证** - 邮箱/手机/OAuth登录\n3. **实时订阅** - 数据变化实时推送\n4. **存储** - 文件上传和管理\n5. **Edge Functions** - 服务端函数\n\n## 快速上手\n\n\`\`\`javascript\nimport { createClient } from '@supabase/supabase-js'\n\nconst supabase = createClient(URL, KEY)\n\n// 查询数据\nconst { data } = await supabase.from('posts').select('*')\n\n// 插入数据\nawait supabase.from('posts').insert({ title: 'Hello' })\n\n// 实时订阅\nsupabase.channel('room').on('postgres_changes', ...)\n\`\`\`\n\n## vs Firebase\n\n| 维度 | Supabase | Firebase |\n|------|----------|----------|\n| 数据库 | PostgreSQL | Firestore |\n| 开源 | 是 | 否 |\n| 数据归属 | 自己 | Google |\n| SQL支持 | 完整 | 无 |\n| 价格 | 免费额度大 | 免费额度小 |\n\n> 如果你想要数据自主权+SQL能力，Supabase是最佳选择。`,
    tags: ['Supabase', 'Firebase', 'BaaS', '开发工具']
  },

  // ---- 思维 (thinking) - 8 posts ----
  {
    id: 601,
    title: '如何用自然语言理解复杂技术概念',
    author: '学习教练',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach',
    likes: 128,
    image: 'https://picsum.photos/seed/nl601/400/290',
    height: '210px',
    category: '思维',
    type: 'recommend',
    content: `# 用自然语言理解技术\n\n## 三大方法\n\n### 1. 类比法\n用生活场景映射技术概念\n- API = 餐厅服务员\n- 数据库 = 智能衣柜\n- CDN = 快递前置仓\n\n### 2. 拆解法\n把复杂概念拆成小模块\n- 微服务 = 拆成独立积木块\n- HTTP = 拆成请求+响应\n- Docker = 拆成镜像+容器\n\n### 3. 场景法\n从"我想做什么"出发\n- 我想做网站 → 需要前端+后端\n- 我想存数据 → 需要数据库\n- 我想上线 → 需要部署\n\n## 实践技巧\n\n1. **先理解What，再理解How**\n2. **用费曼学习法** - 教别人来检验自己\n3. **画思维导图** - 可视化知识结构\n4. **写学习笔记** - 输出倒逼输入\n\n> 技术不是黑盒，只是用另一种语言描述我们熟悉的事物。`,
    tags: ['思维', '学习方法', '概念']
  },
  {
    id: 602,
    title: '费曼学习法：最有效的技术学习方式',
    author: '学习教练',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach',
    likes: 2345,
    image: 'https://picsum.photos/seed/feynman602/400/260',
    height: '200px',
    category: '思维',
    type: 'recommend',
    content: `# 费曼学习法\n\n## 四个步骤\n\n### Step 1: 选择一个概念\n选一个你想学的技术概念，比如"闭包"\n\n### Step 2: 教给一个外行\n用最简单的语言解释，假设对方完全不懂技术\n\n### Step 3: 发现知识缺口\n解释不清楚的地方，就是你没理解的地方\n\n### Step 4: 回去学习，简化表达\n重新学习不懂的部分，再用更简单的语言解释\n\n## 实际应用\n\n**学React Hooks时：**\n1. 选择：useState是什么？\n2. 解释：给组件加一个"记忆"，让它记住上次的状态\n3. 卡壳：为什么不能在条件语句里用？\n4. 回去学：理解Hook的调用顺序规则\n\n## 效果\n\n- 学习效率提升3倍\n- 记忆保持时间延长5倍\n- 能真正理解而非死记硬背\n\n> 如果你不能简单地解释，说明你还没有真正理解。 ——费曼`,
    tags: ['费曼学习法', '学习方法', '思维']
  },
  {
    id: 603,
    title: '技术选型的决策框架：别再拍脑袋了',
    author: '架构师老王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arch',
    likes: 1678,
    image: 'https://picsum.photos/seed/decision603/400/250',
    height: '190px',
    category: '思维',
    type: 'practice',
    content: `# 技术选型决策框架\n\n## 评估维度\n\n### 1. 团队匹配度（权重30%）\n- 团队是否熟悉？\n- 学习成本多高？\n- 招聘市场是否充足？\n\n### 2. 项目适配度（权重30%）\n- 是否满足业务需求？\n- 性能是否达标？\n- 扩展性如何？\n\n### 3. 生态成熟度（权重20%）\n- 社区活跃度？\n- 第三方库丰富度？\n- 文档质量？\n\n### 4. 长期维护性（权重20%）\n- 版本更新频率？\n- 向后兼容性？\n- 商业支持？\n\n## 决策流程\n\n1. 列出候选方案（3-5个）\n2. 按维度打分（1-5分）\n3. 加权计算总分\n4. 团队讨论确认\n5. 小范围验证（POC）\n\n> 技术选型没有完美方案，只有最适合当前阶段的方案。`,
    tags: ['技术选型', '决策', '思维']
  },
  {
    id: 604,
    title: '程序员的时间管理：深度工作的艺术',
    author: '效率达人阿强',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eff',
    likes: 1890,
    image: 'https://picsum.photos/seed/time604/400/280',
    height: '220px',
    category: '思维',
    type: 'recommend',
    content: `# 程序员时间管理\n\n## 深度工作\n\n编程是需要高度专注的工作，每次被打断需要23分钟才能恢复状态。\n\n### 如何进入深度工作？\n\n1. **固定时间段** - 每天上午9-12点为深度工作时间\n2. **关闭通知** - 手机静音，关闭Slack/微信\n3. **番茄工作法** - 25分钟专注 + 5分钟休息\n4. **环境暗示** - 戴上耳机 = 勿扰模式\n\n## 时间分配建议\n\n| 类型 | 占比 | 说明 |\n|------|------|------|\n| 深度工作 | 50% | 写代码、设计架构 |\n| 协作沟通 | 20% | 会议、Code Review |\n| 学习成长 | 15% | 读文档、学新技术 |\n| 杂项处理 | 15% | 回消息、修小bug |\n\n## 常见陷阱\n\n1. **多任务并行** - 效率降低40%\n2. **完美主义** - 先完成再完美\n3. **过度会议** - 能异步就不开会\n\n> 管理好时间，比学会任何新技术都重要。`,
    tags: ['时间管理', '深度工作', '效率']
  },
  {
    id: 605,
    title: '问题拆解思维：把大象装进冰箱分几步？',
    author: '学习教练',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach',
    likes: 987,
    image: 'https://picsum.photos/seed/decompose605/400/240',
    height: '180px',
    category: '思维',
    type: 'recommend',
    content: `# 问题拆解思维\n\n## 核心原则\n\n任何复杂问题都可以拆成简单的小问题。\n\n## 拆解步骤\n\n### 1. 定义问题\n"做一个电商网站" → 太模糊\n"做一个支持商品展示、购物车、在线支付的手机端电商网站" → 清晰\n\n### 2. 拆分模块\n- 用户模块（注册/登录/个人中心）\n- 商品模块（列表/详情/搜索）\n- 购物车模块（添加/修改/结算）\n- 支付模块（支付宝/微信）\n- 订单模块（创建/查询/退款）\n\n### 3. 排优先级\nP0：商品展示 + 购物车（MVP）\nP1：支付 + 订单\nP2：搜索 + 个人中心\nP3：推荐 + 评价\n\n### 4. 逐个击破\n每个模块再拆成具体的开发任务\n\n> 解决大问题的秘诀：不解决大问题，只解决小问题。`,
    tags: ['问题拆解', '思维', '方法论']
  },
  {
    id: 606,
    title: '从模仿到创新：技术学习的三个阶段',
    author: '编程教练',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach',
    likes: 756,
    image: 'https://picsum.photos/seed/learn606/400/270',
    height: '200px',
    category: '思维',
    type: 'recommend',
    content: `# 技术学习三阶段\n\n## 阶段一：模仿（0-6个月）\n\n跟着教程做，1:1复现\n\n- 看视频教程\n- 跟着写代码\n- 遇到问题搜答案\n\n**关键**：不要跳步，完整做完\n\n## 阶段二：理解（6-18个月）\n\n知道为什么这样做\n\n- 读官方文档\n- 理解设计原理\n- 能独立解决问题\n\n**关键**：多问"为什么"\n\n## 阶段三：创新（18个月+）\n\n能创造新的解决方案\n\n- 组合不同技术\n- 优化现有方案\n- 设计新架构\n\n**关键**：多实践，多思考\n\n## 加速成长的方法\n\n1. **做项目** - 比看100篇教程有用\n2. **教别人** - 费曼学习法\n3. **写博客** - 输出倒逼输入\n4. **参与开源** - 学习顶级代码\n\n> 模仿是起点，理解是过程，创新是目标。不要跳过模仿阶段。`,
    tags: ['学习方法', '成长', '思维']
  },
  {
    id: 607,
    title: '技术债务管理：别让代码变成定时炸弹',
    author: '架构师老王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arch',
    likes: 1234,
    image: 'https://picsum.photos/seed/debt607/400/260',
    height: '200px',
    category: '思维',
    type: 'practice',
    content: `# 技术债务管理\n\n## 什么是技术债务？\n\n为了快速交付而做的代码妥协，就像借钱一样，迟早要还，而且要付利息。\n\n## 技术债务分类\n\n### 刻意债务\n知道不完美但为了赶进度有意为之\n→ 记录下来，安排时间还\n\n### 无意债务\n因为经验不足写了不好的代码\n→ Code Review来发现\n\n### 过时债务\n技术发展导致原有方案不再适用\n→ 定期评估和升级\n\n## 管理策略\n\n1. **可视化** - 用Issue/文档记录所有技术债\n2. **量化** - 评估每笔债务的"利息"（维护成本）\n3. **计划还债** - 每个迭代留20%时间还债\n4. **预防新债** - Code Review + 技术规范\n\n## 还债优先级\n\n- 影响用户的技术债 → 立即还\n- 影响开发效率的 → 尽快还\n- 不影响的 → 计划还\n\n> 技术债务不可怕，可怕的是假装它不存在。`,
    tags: ['技术债务', '代码质量', '思维']
  },
  {
    id: 608,
    title: '失败复盘法：每次Bug都是成长的机会',
    author: '学习教练',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach',
    likes: 876,
    image: 'https://picsum.photos/seed/review608/400/280',
    height: '220px',
    category: '思维',
    type: 'recommend',
    content: `# 失败复盘法\n\n## 复盘四步法\n\n### Step 1: 回顾目标\n这次要实现什么？预期结果是什么？\n\n### Step 2: 评估结果\n实际发生了什么？和预期差在哪里？\n\n### Step 3: 分析原因\n- **直接原因** - 为什么出Bug？\n- **根本原因** - 为什么会犯这个错误？\n- **系统原因** - 流程/工具哪里可以改进？\n\n### Step 4: 制定改进\n- **立即行动** - 修复Bug\n- **预防措施** - 加测试、加校验\n- **流程优化** - Code Review、自动化检查\n\n## 常见Bug根因\n\n1. **边界条件未考虑** → 加边界测试\n2. **异步操作未处理** → 统一异步规范\n3. **类型错误** → 使用TypeScript\n4. **状态管理混乱** → 规范状态管理\n\n## 复盘模板\n\n\`\`\`\nBug描述：\n影响范围：\n根因分析：\n修复方案：\n预防措施：\n\`\`\`\n\n> 不犯同样的错误，就是最快的成长方式。`,
    tags: ['复盘', 'Bug', '成长', '思维']
  }
]

// ============================================================
// 5+ Learning Paths
// ============================================================

const learningPaths = [
  {
    id: 101,
    title: '零基础前端开发入门',
    description: '从HTML到Vue/React，零基础8步掌握前端开发核心技能',
    cover_image: 'https://picsum.photos/seed/path-fe/400/200',
    difficulty: 'beginner',
    total_steps: 8,
    estimated_hours: 40,
    tags: ['前端', '入门', 'HTML', 'CSS', 'JavaScript']
  },
  {
    id: 102,
    title: '后端API开发实战',
    description: '从HTTP基础到微服务架构，10步成为后端API开发高手',
    cover_image: 'https://picsum.photos/seed/path-be/400/200',
    difficulty: 'intermediate',
    total_steps: 10,
    estimated_hours: 60,
    tags: ['后端', 'API', 'Node.js', '数据库']
  },
  {
    id: 103,
    title: 'AI产品经理成长路径',
    description: '从AI概念到产品落地，8步掌握AI产品经理核心能力',
    cover_image: 'https://picsum.photos/seed/path-ai/400/200',
    difficulty: 'beginner',
    total_steps: 8,
    estimated_hours: 32,
    tags: ['AI', '产品经理', 'Prompt', '大模型']
  },
  {
    id: 104,
    title: 'DevOps工程师养成计划',
    description: '从Linux基础到K8s编排，10步成为DevOps工程师',
    cover_image: 'https://picsum.photos/seed/path-devops/400/200',
    difficulty: 'advanced',
    total_steps: 10,
    estimated_hours: 80,
    tags: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD']
  },
  {
    id: 105,
    title: '全栈开发者进阶之路',
    description: '前端+后端+DevOps，12步成为独当一面的全栈开发者',
    cover_image: 'https://picsum.photos/seed/path-full/400/200',
    difficulty: 'intermediate',
    total_steps: 12,
    estimated_hours: 100,
    tags: ['全栈', '前端', '后端', 'DevOps']
  }
]

// ============================================================
// Learning Steps for each path
// ============================================================

const learningSteps = [
  // Path 101: 零基础前端开发入门 (8 steps)
  { path_id: 101, step_order: 1, title: 'HTML基础：网页的骨架', step_type: 'card', duration: 30, is_completed: true, locked: false },
  { path_id: 101, step_order: 2, title: 'CSS基础：给网页穿衣服', step_type: 'card', duration: 45, is_completed: true, locked: false },
  { path_id: 101, step_order: 3, title: 'JavaScript入门：让网页动起来', step_type: 'card', duration: 60, is_completed: true, locked: false },
  { path_id: 101, step_order: 4, title: 'DOM操作：与页面交互', step_type: 'practice', duration: 45, is_completed: false, locked: false },
  { path_id: 101, step_order: 5, title: 'Git版本控制：代码时光机', step_type: 'card', duration: 30, is_completed: false, locked: false },
  { path_id: 101, step_order: 6, title: 'Vue/React框架入门', step_type: 'card', duration: 60, is_completed: false, locked: true },
  { path_id: 101, step_order: 7, title: '实战项目：个人博客', step_type: 'practice', duration: 90, is_completed: false, locked: true },
  { path_id: 101, step_order: 8, title: '部署上线：让全世界看到', step_type: 'card', duration: 30, is_completed: false, locked: true },

  // Path 102: 后端API开发实战 (10 steps)
  { path_id: 102, step_order: 1, title: 'HTTP协议：互联网的通用语言', step_type: 'card', duration: 30, is_completed: true, locked: false },
  { path_id: 102, step_order: 2, title: 'Node.js基础：服务端JavaScript', step_type: 'card', duration: 45, is_completed: true, locked: false },
  { path_id: 102, step_order: 3, title: 'Express框架：快速搭建API', step_type: 'card', duration: 45, is_completed: true, locked: false },
  { path_id: 102, step_order: 4, title: 'RESTful API设计规范', step_type: 'card', duration: 30, is_completed: true, locked: false },
  { path_id: 102, step_order: 5, title: '数据库设计与SQL基础', step_type: 'card', duration: 60, is_completed: false, locked: false },
  { path_id: 102, step_order: 6, title: '身份认证：JWT与OAuth', step_type: 'card', duration: 45, is_completed: false, locked: false },
  { path_id: 102, step_order: 7, title: '缓存策略：Redis实战', step_type: 'card', duration: 45, is_completed: false, locked: true },
  { path_id: 102, step_order: 8, title: 'Docker容器化部署', step_type: 'practice', duration: 60, is_completed: false, locked: true },
  { path_id: 102, step_order: 9, title: 'API文档与测试', step_type: 'practice', duration: 30, is_completed: false, locked: true },
  { path_id: 102, step_order: 10, title: '实战项目：电商API', step_type: 'practice', duration: 90, is_completed: false, locked: true },

  // Path 103: AI产品经理成长路径 (8 steps)
  { path_id: 103, step_order: 1, title: 'AI基础概念：机器学习与大模型', step_type: 'card', duration: 30, is_completed: true, locked: false },
  { path_id: 103, step_order: 2, title: 'Prompt工程：与AI高效对话', step_type: 'card', duration: 45, is_completed: true, locked: false },
  { path_id: 103, step_order: 3, title: 'AI产品需求分析方法论', step_type: 'card', duration: 45, is_completed: true, locked: false },
  { path_id: 103, step_order: 4, title: 'AI产品数据指标设计', step_type: 'card', duration: 30, is_completed: false, locked: false },
  { path_id: 103, step_order: 5, title: 'RAG应用：让AI拥有知识库', step_type: 'card', duration: 45, is_completed: false, locked: false },
  { path_id: 103, step_order: 6, title: 'AI Agent设计模式', step_type: 'card', duration: 45, is_completed: false, locked: true },
  { path_id: 103, step_order: 7, title: 'AI伦理与合规', step_type: 'card', duration: 30, is_completed: false, locked: true },
  { path_id: 103, step_order: 8, title: '实战：设计一个AI产品方案', step_type: 'practice', duration: 60, is_completed: false, locked: true },

  // Path 104: DevOps工程师养成计划 (10 steps)
  { path_id: 104, step_order: 1, title: 'Linux基础：命令行生存指南', step_type: 'card', duration: 45, is_completed: true, locked: false },
  { path_id: 104, step_order: 2, title: 'Shell脚本：自动化从脚本开始', step_type: 'card', duration: 45, is_completed: true, locked: false },
  { path_id: 104, step_order: 3, title: '网络基础：DNS/CDN/负载均衡', step_type: 'card', duration: 45, is_completed: false, locked: false },
  { path_id: 104, step_order: 4, title: 'Docker基础：容器化入门', step_type: 'card', duration: 60, is_completed: false, locked: false },
  { path_id: 104, step_order: 5, title: 'Docker Compose：多容器编排', step_type: 'practice', duration: 45, is_completed: false, locked: false },
  { path_id: 104, step_order: 6, title: 'Kubernetes入门：容器编排之王', step_type: 'card', duration: 60, is_completed: false, locked: true },
  { path_id: 104, step_order: 7, title: 'CI/CD：GitHub Actions实战', step_type: 'practice', duration: 45, is_completed: false, locked: true },
  { path_id: 104, step_order: 8, title: '监控告警：Prometheus+Grafana', step_type: 'card', duration: 45, is_completed: false, locked: true },
  { path_id: 104, step_order: 9, title: '日志管理：ELK Stack', step_type: 'card', duration: 30, is_completed: false, locked: true },
  { path_id: 104, step_order: 10, title: '实战：完整CI/CD流水线搭建', step_type: 'practice', duration: 90, is_completed: false, locked: true },

  // Path 105: 全栈开发者进阶之路 (12 steps)
  { path_id: 105, step_order: 1, title: '前端框架深入：React/Vue核心原理', step_type: 'card', duration: 60, is_completed: true, locked: false },
  { path_id: 105, step_order: 2, title: 'TypeScript：类型安全编程', step_type: 'card', duration: 45, is_completed: true, locked: false },
  { path_id: 105, step_order: 3, title: '状态管理：Redux/Pinia实战', step_type: 'card', duration: 30, is_completed: true, locked: false },
  { path_id: 105, step_order: 4, title: '后端框架：Node.js + Express', step_type: 'card', duration: 60, is_completed: true, locked: false },
  { path_id: 105, step_order: 5, title: '数据库设计：PostgreSQL实战', step_type: 'card', duration: 45, is_completed: false, locked: false },
  { path_id: 105, step_order: 6, title: 'API设计：RESTful最佳实践', step_type: 'card', duration: 45, is_completed: false, locked: false },
  { path_id: 105, step_order: 7, title: '身份认证：JWT + OAuth2.0', step_type: 'card', duration: 30, is_completed: false, locked: false },
  { path_id: 105, step_order: 8, title: 'Docker + Docker Compose', step_type: 'practice', duration: 45, is_completed: false, locked: true },
  { path_id: 105, step_order: 9, title: 'CI/CD：自动化部署', step_type: 'practice', duration: 45, is_completed: false, locked: true },
  { path_id: 105, step_order: 10, title: '性能优化：前后端全链路', step_type: 'card', duration: 45, is_completed: false, locked: true },
  { path_id: 105, step_order: 11, title: '测试策略：单元测试到E2E', step_type: 'practice', duration: 45, is_completed: false, locked: true },
  { path_id: 105, step_order: 12, title: '实战：全栈项目从0到1', step_type: 'practice', duration: 120, is_completed: false, locked: true }
]

// ============================================================
// Hot Searches (10+ more)
// ============================================================

const hotSearches = [
  { keyword: 'TypeScript入门', count: 189 },
  { keyword: 'Docker部署教程', count: 167 },
  { keyword: 'Next.js全栈开发', count: 156 },
  { keyword: 'AI Agent开发', count: 145 },
  { keyword: 'Tailwind CSS实战', count: 134 },
  { keyword: 'PostgreSQL优化', count: 121 },
  { keyword: '微服务架构设计', count: 112 },
  { keyword: 'Redis缓存策略', count: 98 },
  { keyword: 'Figma转代码', count: 87 },
  { keyword: 'GitHub Actions CI/CD', count: 76 },
  { keyword: 'Prompt工程技巧', count: 198 },
  { keyword: 'Vite构建优化', count: 65 }
]

// ============================================================
// Messages (5+ more)
// ============================================================

const messages = [
  { user_id: 'guest', type: 'system', sender_name: '系统通知', sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sys2', sender_bg_color: '#E8F5E9', content: '新增5条学习路径，快来选择适合你的成长路线！', unread: true },
  { user_id: 'guest', type: 'interaction', sender_name: '前端小芳', sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frontend', sender_bg_color: '#E3F2FD', content: '赞了你的笔记《VS Code 2026最强配置》', unread: true },
  { user_id: 'guest', type: 'private', sender_name: '全栈小周', sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fullstack', sender_bg_color: '#FFF3E0', content: '那个全栈项目的代码能分享下吗？', unread: false },
  { user_id: 'guest', type: 'follow', sender_name: 'AI研究员', sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=airesearch', sender_bg_color: '#F3E5F5', content: '开始关注了你', unread: true },
  { user_id: 'guest', type: 'comment', sender_name: '运维小陈', sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ops', sender_bg_color: '#E0F7FA', content: '在评论中回复了你：CDN那篇写得太好了，收藏了！', unread: false },
  { user_id: 'guest', type: 'system', sender_name: '学习助手', sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot', sender_bg_color: '#FCE4EC', content: '你已连续学习3天，继续保持！', unread: true }
]

// ============================================================
// Seed execution
// ============================================================

async function runSeed() {
  console.log('Starting expanded seed data...')

  // Seed posts
  console.log(`\nSeeding ${posts.length} posts...`)
  const { error: postsError } = await supabase.from('posts').upsert(posts, { onConflict: 'id' })
  if (postsError) console.error('Posts error:', postsError.message)
  else console.log(`  OK: ${posts.length} posts seeded`)

  // Seed learning paths
  console.log(`\nSeeding ${learningPaths.length} learning paths...`)
  const { error: pathsError } = await supabase.from('learning_paths').upsert(learningPaths, { onConflict: 'id' })
  if (pathsError) console.error('Paths error:', pathsError.message)
  else console.log(`  OK: ${learningPaths.length} paths seeded`)

  // Seed learning steps
  console.log(`\nSeeding ${learningSteps.length} learning steps...`)
  const { error: stepsError } = await supabase.from('learning_steps').upsert(learningSteps, { onConflict: 'id' })
  if (stepsError) {
    // Try without onConflict since steps table may not have id as unique
    const { error: stepsError2 } = await supabase.from('learning_steps').insert(learningSteps)
    if (stepsError2) console.error('Steps error:', stepsError2.message)
    else console.log(`  OK: ${learningSteps.length} steps seeded`)
  } else {
    console.log(`  OK: ${learningSteps.length} steps seeded`)
  }

  // Seed hot searches
  console.log(`\nSeeding ${hotSearches.length} hot searches...`)
  const { error: hotError } = await supabase.from('hot_searches').upsert(hotSearches, { onConflict: 'keyword' })
  if (hotError) console.error('Hot searches error:', hotError.message)
  else console.log(`  OK: ${hotSearches.length} hot searches seeded`)

  // Seed messages
  console.log(`\nSeeding ${messages.length} messages...`)
  const { error: msgError } = await supabase.from('messages').insert(messages)
  if (msgError) console.error('Messages error:', msgError.message)
  else console.log(`  OK: ${messages.length} messages seeded`)

  console.log('\nExpanded seed completed!')
  console.log(`  Posts: ${posts.length}`)
  console.log(`  Paths: ${learningPaths.length}`)
  console.log(`  Steps: ${learningSteps.length}`)
  console.log(`  Hot Searches: ${hotSearches.length}`)
  console.log(`  Messages: ${messages.length}`)
}

runSeed().catch(console.error)
