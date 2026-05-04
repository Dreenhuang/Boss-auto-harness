import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function migrate() {
  console.log('🔧 Running database migration...')

  const { data: checkData } = await supabase
    .from('users')
    .select('password')
    .limit(1)

  if (checkData !== null) {
    console.log('✅ password column already exists')
  } else {
    console.log('⚠️  password column may not exist. Please add it via Supabase Dashboard SQL:')
    console.log('   ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT DEFAULT \'\';')
  }

  const { error: clearPosts } = await supabase.from('posts').delete().neq('id', 0)
  if (clearPosts) console.log('Clear posts:', clearPosts.message)
  else console.log('✅ Cleared old posts')

  const { error: clearSteps } = await supabase.from('learning_steps').delete().neq('id', 0)
  if (clearSteps) console.log('Clear steps:', clearSteps.message)
  else console.log('✅ Cleared old steps')

  const { error: clearPaths } = await supabase.from('learning_paths').delete().neq('id', 0)
  if (clearPaths) console.log('Clear paths:', clearPaths.message)
  else console.log('✅ Cleared old paths')

  const { error: clearHot } = await supabase.from('hot_searches').delete().neq('id', 0)
  if (clearHot) console.log('Clear hot searches:', clearHot.message)
  else console.log('✅ Cleared old hot searches')

  const { error: clearMsg } = await supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (clearMsg) console.log('Clear messages:', clearMsg.message)
  else console.log('✅ Cleared old messages')

  console.log('\n📋 Now run: npm run seed:expanded')
}

migrate().catch(console.error)
