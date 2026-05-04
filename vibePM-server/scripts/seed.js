import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTables() {
  console.log('🔍 Checking if tables exist...')
  const tables = ['users', 'posts', 'favorites', 'learning_paths', 'learning_steps', 'user_paths', 'messages', 'verification_codes', 'recent_views', 'generated_images', 'image_quota', 'hot_searches', 'search_history']
  
  let allExist = true
  for (const table of tables) {
    const { error } = await supabase.from(table).select('*').limit(0)
    if (error?.message?.includes('relation')) {
      console.log(`  ❌ ${table}: Not found`)
      allExist = false
    } else {
      console.log(`  ✅ ${table}: OK`)
    }
  }
  
  return allExist
}

async function runSeed() {
  console.log('\n🌱 Running seed data...')
  
  const { error: postsError } = await supabase.from('posts').upsert([
    { id: 1, title: 'API 就像餐厅服务员：三分钟读懂接口原理', author: '技术小白', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech', likes: 1205, image: 'https://picsum.photos/seed/api1/400/300', height: '220px', category: '概念', type: 'recommend', content: '# 什么是API？\n\n想象你去餐厅吃饭。你坐在桌前，看着菜单点菜。服务员把你的订单送到厨房，然后把做好的菜端给你。\n\n在这个比喻中：\n- **你** = 应用程序或用户\n- **菜单** = API文档\n- **服务员** = API\n- **厨房** = 服务器或数据库\n\n> API让复杂的技术变得简单，你不需要知道厨房怎么做菜，只需要告诉服务员你想吃什么。', tags: ['API', '基础概念', '后端'] },
    { id: 2, title: '2026年全栈开发选型：别用 WordPress 做电商了', author: '架构师老王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arch', likes: 892, image: 'https://picsum.photos/seed/wp2/400/240', height: '180px', category: '避坑', type: 'practice', content: '# 为什么WordPress不适合做电商？\n\n1. **性能瓶颈** - WordPress本质是博客系统\n2. **扩展困难** - 插件冲突是家常便饭\n3. **安全风险** - 插件漏洞频发\n\n## 更好的选择\n- 小型电商：Shopify / 有赞\n- 中型电商：Next.js + Stripe\n- 大型电商：微服务架构', tags: ['WordPress', '电商', '选型'] },
    { id: 3, title: 'React vs Vue：2026年该选哪一个？全面对比', author: '效率达人阿强', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eff', likes: 3421, image: 'https://picsum.photos/seed/rv3/400/280', height: '200px', category: '对比', type: 'tech', content: '# React vs Vue 全面对比\n\n| 维度 | React | Vue |\n|------|-------|-----|\n| 学习曲线 | 中等 | 较低 |\n| 生态系统 | 最大 | 丰富 |\n\n> 2026年，两个框架都很成熟，选哪个都不会错。', tags: ['React', 'Vue', '前端', '对比'] },
    { id: 4, title: '从零开始：18天掌握 AI 产品经理技能树', author: '职场导师Lily', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lily', likes: 567, image: 'https://picsum.photos/seed/ai4/400/320', height: '240px', category: '路径', type: 'guide', content: '# AI产品经理技能树\n\n## 第一周：基础认知\n- Day 1-2: AI基础概念\n- Day 3-4: 机器学习入门\n- Day 5-7: Prompt工程\n\n> 成为AI产品经理不需要写代码，但需要理解技术边界。', tags: ['AI', '产品经理', '学习路径'] },
    { id: 5, title: '电商网站全栈选型指南（PDF可导出）', author: '技术宅小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xm', likes: 231, image: 'https://picsum.photos/seed/ec5/400/260', height: '190px', category: '工具', type: 'practice', content: '# 电商全栈选型\n\n## 前端\n- 框架：Next.js / Nuxt.js\n- UI：Tailwind CSS + shadcn/ui\n\n## 后端\n- Node.js：Express / Fastify\n- Python：Django / FastAPI', tags: ['电商', '全栈', '选型'] },
    { id: 6, title: '如何用自然语言理解复杂技术概念', author: '学习教练', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach', likes: 128, image: 'https://picsum.photos/seed/nl6/400/290', height: '210px', category: '思维', type: 'recommend', content: '# 用自然语言理解技术\n\n1. **类比法** - 用生活场景映射技术概念\n2. **拆解法** - 把复杂概念拆成小模块\n3. **场景法** - 从"我想做什么"出发\n\n> 技术不是黑盒，只是用另一种语言描述我们熟悉的事物。', tags: ['思维', '学习方法', '概念'] }
  ], { onConflict: 'id' })

  if (postsError) console.error('Posts error:', postsError.message)
  else console.log('✅ Posts seeded')

  const { error: pathsError } = await supabase.from('learning_paths').upsert([
    { id: 1, title: '电商网站全栈选型', description: '从前端到后端到数据库，完整的电商技术选型路径', difficulty: 'intermediate', total_steps: 8, estimated_hours: 24, tags: ['电商', '全栈', '选型'] },
    { id: 2, title: '前端框架入门路径', description: 'React、Vue、Angular基础对比学习', difficulty: 'beginner', total_steps: 10, estimated_hours: 30, tags: ['前端', 'React', 'Vue'] },
    { id: 3, title: 'AI工具使用指南', description: 'ChatGPT、Claude、文心一言全面对比', difficulty: 'beginner', total_steps: 6, estimated_hours: 12, tags: ['AI', 'ChatGPT', '工具'] }
  ], { onConflict: 'id' })

  if (pathsError) console.error('Paths error:', pathsError.message)
  else console.log('✅ Paths seeded')

  const { error: stepsError } = await supabase.from('learning_steps').upsert([
    { path_id: 1, step_order: 1, title: '需求分析', step_type: 'card', duration: 30, is_completed: true, locked: false },
    { path_id: 1, step_order: 2, title: '前端技术选型', step_type: 'card', duration: 45, is_completed: true, locked: false },
    { path_id: 1, step_order: 3, title: '后端技术选型', step_type: 'card', duration: 45, is_completed: true, locked: false },
    { path_id: 1, step_order: 4, title: '数据库选型', step_type: 'card', duration: 30, is_completed: false, locked: false },
    { path_id: 1, step_order: 5, title: '支付集成', step_type: 'practice', duration: 60, is_completed: false, locked: true },
    { path_id: 1, step_order: 6, title: '部署上线', step_type: 'card', duration: 40, is_completed: false, locked: true },
    { path_id: 1, step_order: 7, title: '性能优化', step_type: 'card', duration: 35, is_completed: false, locked: true },
    { path_id: 1, step_order: 8, title: '数据分析', step_type: 'card', duration: 30, is_completed: false, locked: true }
  ])

  if (stepsError) console.error('Steps error:', stepsError.message)
  else console.log('✅ Steps seeded')

  const { error: hotError } = await supabase.from('hot_searches').upsert([
    { keyword: 'API概念解释', count: 156 },
    { keyword: '前端框架对比', count: 132 },
    { keyword: '电商技术栈', count: 98 },
    { keyword: 'AI工具推荐', count: 87 },
    { keyword: '数据库选型', count: 76 },
    { keyword: 'React入门', count: 65 },
    { keyword: 'Vue3学习', count: 54 },
    { keyword: 'Docker部署', count: 43 },
    { keyword: 'Prompt工程', count: 38 },
    { keyword: '全栈开发', count: 32 }
  ], { onConflict: 'keyword' })

  if (hotError) console.error('Hot searches error:', hotError.message)
  else console.log('✅ Hot searches seeded')

  const { error: msgError } = await supabase.from('messages').upsert([
    { user_id: 'guest', type: 'private', sender_name: '架构师老王', sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arch', sender_bg_color: '#F0F0F0', content: '老弟，上次那个 API 的方案发我一份？', unread: true },
    { user_id: 'guest', type: 'private', sender_name: '职场导师Lily', sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lily', sender_bg_color: '#E0E0E0', content: '你的学习计划已经制定好了，记得查看。', unread: false },
    { user_id: 'guest', type: 'system', sender_name: '系统通知', sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sys', sender_bg_color: '#D0D0D0', content: '欢迎加入 Vibe PM！开启你的 AI 学习之旅。', unread: false },
    { user_id: 'guest', type: 'interaction', sender_name: '技术小白', sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech', sender_bg_color: '#C0C0C0', content: '赞了你的笔记《API 就像餐厅服务员》', unread: true },
    { user_id: 'guest', type: 'follow', sender_name: '码农小张', sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev', sender_bg_color: '#B0B0B0', content: '开始关注了你', unread: true },
    { user_id: 'guest', type: 'comment', sender_name: 'AI探索者', sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai', sender_bg_color: '#A0A0A0', content: '在评论中回复了你：这个比喻太妙了！', unread: false }
  ])

  if (msgError) console.error('Messages error:', msgError.message)
  else console.log('✅ Messages seeded')
}

async function main() {
  const tablesExist = await checkTables()
  
  if (!tablesExist) {
    console.log('\n❌ Tables not found. Please run the SQL migration first.')
    console.log('\n📋 Quick setup:')
    console.log('1. Open: https://supabase.com/dashboard/project/jaduaifzmgvaotyqnjfe/sql')
    console.log('2. Click "New query"')
    console.log('3. Copy content from: database/migration.sql')
    console.log('4. Click "Run"')
    console.log('5. Then run: npm run seed')
    return
  }
  
  console.log('\n✅ All tables exist!')
  await runSeed()
  console.log('\n🎉 Seed completed! Run "npm run dev" to start the server.')
}

main().catch(console.error)
