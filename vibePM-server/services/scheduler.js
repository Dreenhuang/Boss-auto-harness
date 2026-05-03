import { supabase } from '../server.js'
import { getPromptForTech } from '../services/promptEngine.js'

const DAILY_QUOTA = 50
const TECH_LIST = ['react', 'vue', 'python', 'docker', 'api', 'database', 'cloud', 'ai']

async function checkQuota() {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('image_quota')
    .select('count')
    .eq('date', today)
    .single()
  return data?.count || 0
}

async function incrementQuota() {
  const today = new Date().toISOString().split('T')[0]
  const current = await checkQuota()
  await supabase
    .from('image_quota')
    .upsert({ date: today, count: current + 1 }, { onConflict: 'date' })
}

async function callMiniMaxAPI(prompt) {
  const response = await fetch(process.env.MINIMAX_IMAGE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`
    },
    body: JSON.stringify({
      model: 'minimax-image-v1',
      prompt,
      size: '2K',
      response_format: 'url',
      n: 1
    }),
    signal: AbortSignal.timeout(60000)
  })

  if (!response.ok) {
    throw new Error(`MiniMax API error: ${response.status}`)
  }

  const result = await response.json()
  return result.data?.[0]?.url || result.images?.[0]?.url || ''
}

export async function runScheduledGeneration() {
  console.log('[Scheduler] Starting scheduled image generation...')

  const currentUsage = await checkQuota()
  if (currentUsage >= DAILY_QUOTA) {
    console.log(`[Scheduler] Daily quota exceeded (${currentUsage}/${DAILY_QUOTA})`)
    return
  }

  const remaining = DAILY_QUOTA - currentUsage
  const techsToGenerate = TECH_LIST.slice(0, Math.min(remaining, 5))

  for (const tech of techsToGenerate) {
    try {
      const promptData = getPromptForTech(tech)
      console.log(`[Scheduler] Generating image for: ${tech}`)

      const imageUrl = await callMiniMaxAPI(promptData.prompt)

      if (imageUrl) {
        await supabase
          .from('generated_images')
          .insert({
            url: imageUrl,
            prompt: promptData.prompt,
            tags: promptData.tags,
            tech_name: tech,
            card_id: null
          })

        await incrementQuota()
        console.log(`[Scheduler] ✅ Generated image for ${tech}`)
      }

      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (error) {
      console.error(`[Scheduler] ❌ Failed for ${tech}:`, error.message)
    }
  }

  console.log('[Scheduler] Scheduled generation completed')
}

export async function matchImagesToCards() {
  console.log('[Scheduler] Matching images to cards...')

  const { data: cards } = await supabase
    .from('posts')
    .select('id, tags, category, type')
    .is('image', null)
    .limit(20)

  const { data: images } = await supabase
    .from('generated_images')
    .select('*')

  if (!cards || !images) return

  for (const card of cards) {
    let bestMatch = null
    let bestScore = 0

    for (const img of images) {
      const cardTags = [...(card.tags || []), card.category, card.type].filter(Boolean)
      const imgTags = img.tags || []
      const intersection = cardTags.filter(t => imgTags.includes(t)).length
      const union = new Set([...cardTags, ...imgTags]).size
      const score = union > 0 ? intersection / union : 0

      if (score > bestScore && score > 0.3) {
        bestScore = score
        bestMatch = img
      }
    }

    if (bestMatch) {
      await supabase
        .from('posts')
        .update({ image: bestMatch.url })
        .eq('id', card.id)
      console.log(`[Scheduler] Matched image to card ${card.id} (score: ${bestScore.toFixed(2)})`)
    }
  }

  console.log('[Scheduler] Image matching completed')
}
