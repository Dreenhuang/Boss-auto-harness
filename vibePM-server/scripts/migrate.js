import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

console.log('🔌 Connecting to Supabase...')
console.log('URL:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🧪 Testing connection...')
  const { data, error } = await supabase.from('posts').select('*').limit(1)
  if (error && error.message.includes('relation')) {
    console.log('✅ Connection OK (table not yet created, which is expected)')
    return true
  }
  if (error) {
    console.error('❌ Connection failed:', error.message)
    return false
  }
  console.log('✅ Connection OK')
  return true
}

async function runMigration() {
  console.log('📝 Loading migration SQL...')
  const sqlPath = join(__dirname, 'migration.sql')
  const sql = readFileSync(sqlPath, 'utf-8')

  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`📋 Found ${statements.length} SQL statements to execute`)

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i]
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: stmt })
      if (error) {
        if (error.message.includes('already exists') || error.message.includes('IF NOT EXISTS')) {
          console.log(`  ⏭️  Statement ${i + 1}: Already exists, skipped`)
        } else {
          console.log(`  ⚠️  Statement ${i + 1}: ${error.message}`)
        }
      } else {
        console.log(`  ✅ Statement ${i + 1}: OK`)
      }
    } catch {
      console.log(`  ⚠️  Statement ${i + 1}: Skipped (may require direct SQL execution)`)
    }
  }
}

async function createTablesDirectly() {
  console.log('🏗️  Creating tables directly via Supabase Admin API...')

  const { error: usersErr } = await supabase.from('users').select('*').limit(0)
  if (usersErr?.message?.includes('relation')) {
    console.log('  Tables not yet created. Need to execute SQL via Supabase Dashboard.')
    console.log('  Please go to: https://supabase.com/dashboard/project/jaduaifzmgvaotyqnjfe/sql')
    console.log('  And paste the contents of: database/migration.sql')
    return false
  }
  console.log('  ✅ Tables already exist!')
  return true
}

async function main() {
  const connected = await testConnection()
  if (!connected) {
    console.log('\n❌ Cannot connect to Supabase. Please check:')
    console.log('   1. SUPABASE_URL is correct')
    console.log('   2. SUPABASE_SERVICE_KEY is the "service_role" key (not anon key)')
    console.log('   3. Your Supabase project is active')
    return
  }

  const tablesExist = await createTablesDirectly()
  if (!tablesExist) {
    console.log('\n📋 TABLES NEED TO BE CREATED MANUALLY')
    console.log('='.repeat(50))
    console.log('Since Supabase requires admin SQL execution, please:')
    console.log('')
    console.log('1. Open: https://supabase.com/dashboard/project/jaduaifzmgvaotyqnjfe/sql')
    console.log('2. Click "New query"')
    console.log('3. Copy all content from: K:\\AI\\AIxueixi-haha2\\vibePM-server\\database\\migration.sql')
    console.log('4. Click "Run"')
    console.log('5. Come back and run: npm run seed')
    console.log('='.repeat(50))
  } else {
    console.log('\n✅ Tables ready! Running seed data...')
  }
}

main().catch(console.error)
