const LOCAL_POSTS = [
  { id: 1, title: 'API 就像餐厅服务员：三分钟读懂接口原理', author: '技术小白', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=b6e3f4', likes: 1205, image: 'https://picsum.photos/seed/api1/400/300', height: '220px', category: '概念', type: 'recommend', content: '# 什么是API？\n\n想象你去餐厅吃饭。你坐在桌前，看着菜单点菜。服务员把你的订单送到厨房，然后把做好的菜端给你。\n\n在这个比喻中：\n- **你** = 应用程序或用户\n- **菜单** = API文档\n- **服务员** = API\n- **厨房** = 服务器或数据库\n\n> API让复杂的技术变得简单，你不需要知道厨房怎么做菜，只需要告诉服务员你想吃什么。', tags: ['API', '基础概念', '后端'] },
  { id: 2, title: '2026年全栈开发选型：别用 WordPress 做电商了', author: '架构师老王', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bob&backgroundColor=c0aede', likes: 892, image: 'https://picsum.photos/seed/wp2/400/240', height: '180px', category: '避坑', type: 'practice', content: '# 为什么WordPress不适合做电商？\n\n1. **性能瓶颈** - WordPress本质是博客系统\n2. **扩展困难** - 插件冲突是家常便饭\n3. **安全风险** - 插件漏洞频发\n\n## 更好的选择\n- 小型电商：Shopify / 有赞\n- 中型电商：Next.js + Stripe\n- 大型电商：微服务架构', tags: ['WordPress', '电商', '选型'] },
  { id: 3, title: 'React vs Vue：2026年该选哪一个？全面对比', author: '效率达人阿强', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie&backgroundColor=d1d4f9', likes: 3421, image: 'https://picsum.photos/seed/rv3/400/280', height: '200px', category: '对比', type: 'tech', content: '# React vs Vue 全面对比\n\n| 维度 | React | Vue |\n|------|-------|-----|\n| 学习曲线 | 中等 | 较低 |\n| 生态系统 | 最大 | 丰富 |\n\n> 2026年，两个框架都很成熟，选哪个都不会错。', tags: ['React', 'Vue', '前端', '对比'] },
  { id: 4, title: '从零开始：18天掌握 AI 产品经理技能树', author: '职场导师Lily', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Diana&backgroundColor=ffd5dc', likes: 567, image: 'https://picsum.photos/seed/ai4/400/320', height: '240px', category: '路径', type: 'guide', content: '# AI产品经理技能树\n\n## 第一周：基础认知\n- Day 1-2: AI基础概念\n- Day 3-4: 机器学习入门\n- Day 5-7: Prompt工程\n\n> 成为AI产品经理不需要写代码，但需要理解技术边界。', tags: ['AI', '产品经理', '学习路径'] },
  { id: 5, title: '电商网站全栈选型指南（PDF可导出）', author: '技术宅小明', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Edward&backgroundColor=ffdfbf', likes: 231, image: 'https://picsum.photos/seed/ec5/400/260', height: '190px', category: '工具', type: 'practice', content: '# 电商全栈选型\n\n## 前端\n- 框架：Next.js / Nuxt.js\n- UI：Tailwind CSS + shadcn/ui\n\n## 后端\n- Node.js：Express / Fastify\n- Python：Django / FastAPI', tags: ['电商', '全栈', '选型'] },
  { id: 6, title: '如何用自然语言理解复杂技术概念', author: '学习教练', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Fiona&backgroundColor=b6e3f4', likes: 128, image: 'https://picsum.photos/seed/nl6/400/290', height: '210px', category: '思维', type: 'recommend', content: '# 用自然语言理解技术\n\n1. **类比法** - 用生活场景映射技术概念\n2. **拆解法** - 把复杂概念拆成小模块\n3. **场景法** - 从"我想做什么"出发\n\n> 技术不是黑盒，只是用另一种语言描述我们熟悉的事物。', tags: ['思维', '学习方法', '概念'] }
]

const LOCAL_HOT_SEARCHES = ['API概念解释', '前端框架对比', '电商技术栈', 'AI工具推荐', '数据库选型', 'React入门', 'Vue3学习', 'Docker部署', 'Prompt工程', '全栈开发']

const LOCAL_MESSAGES = [
  { id: '1', type: 'private', name: '架构师老王', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bob&backgroundColor=c0aede', bgColor: '#F0F0F0', content: '老弟，上次那个 API 的方案发我一份？', time: '3分钟前', unread: true },
  { id: '2', type: 'private', name: '职场导师Lily', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Diana&backgroundColor=ffd5dc', bgColor: '#E0E0E0', content: '你的学习计划已经制定好了，记得查看。', time: '1小时前', unread: false },
  { id: '3', type: 'system', name: '系统通知', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=System&backgroundColor=d1d4f9', bgColor: '#D0D0D0', content: '欢迎加入 Vibe PM！开启你的 AI 学习之旅。', time: '2小时前', unread: false },
  { id: '4', type: 'interaction', name: '技术小白', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=b6e3f4', bgColor: '#C0C0C0', content: '赞了你的笔记《API 就像餐厅服务员》', time: '5小时前', unread: true },
  { id: '5', type: 'follow', name: '码农小张', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jack&backgroundColor=ffdfbf', bgColor: '#B0B0B0', content: '开始关注了你', time: '1天前', unread: true },
  { id: '6', type: 'comment', name: 'AI探索者', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Iris&backgroundColor=b6e3f4', bgColor: '#A0A0A0', content: '在评论中回复了你：这个比喻太妙了！', time: '2天前', unread: false }
]

const LOCAL_PROGRESS = [
  { id: 1, title: '电商网站全栈选型', progress: 38, status: '进行中', statusType: 'active', action: '继续学习', totalSteps: 8, completedSteps: 3 },
  { id: 2, title: '前端框架入门路径', progress: 100, status: '已完成', statusType: 'completed', action: '查看证书', totalSteps: 10, completedSteps: 10 },
  { id: 3, title: 'AI工具使用指南', progress: 60, status: '快完成了', statusType: 'active', action: '继续学习', totalSteps: 6, completedSteps: 4 }
]

export function getLocalPosts(tab = 'recommend') {
  if (tab === 'recommend') return LOCAL_POSTS
  return LOCAL_POSTS.filter(p => p.type === tab)
}

export function getLocalPostById(id) {
  return LOCAL_POSTS.find(p => p.id === Number(id)) || null
}

export function getLocalHotSearches() {
  return LOCAL_HOT_SEARCHES
}

export function getLocalMessages() {
  return LOCAL_MESSAGES
}

export function getLocalProgress() {
  return LOCAL_PROGRESS
}

export function getLocalKnowledgeStats() {
  return { favorites: 128, paths: 3 }
}
