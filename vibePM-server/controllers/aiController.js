import { supabase } from '../server.js'
import { getPromptForTech, calculateSimilarity } from '../services/promptEngine.js'

const DAILY_QUOTA = 50

export async function generateImage(req, res) {
  try {
    const { prompt, techName, cardId } = req.body

    const today = new Date().toISOString().split('T')[0]
    const { data: usage } = await supabase
      .from('image_quota')
      .select('count')
      .eq('date', today)
      .single()

    const currentUsage = usage?.count || 0

    if (currentUsage >= DAILY_QUOTA) {
      return res.status(429).json({
        code: 429,
        message: `Daily quota exceeded (${currentUsage}/${DAILY_QUOTA})`,
        data: null
      })
    }

    const promptData = techName ? getPromptForTech(techName) : null
    const finalPrompt = prompt || promptData?.prompt || 'Technology concept illustration, modern design'

    const response = await fetch(process.env.MINIMAX_IMAGE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`
      },
      body: JSON.stringify({
        model: 'minimax-image-v1',
        prompt: finalPrompt,
        size: '2K',
        response_format: 'url',
        n: 1
      }),
      signal: AbortSignal.timeout(60000)
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`MiniMax API error: ${response.status} - ${errText}`)
    }

    const result = await response.json()

    const imageUrl = result.data?.[0]?.url || result.images?.[0]?.url || ''

    if (!imageUrl) {
      throw new Error('No image URL in response')
    }

    if (cardId) {
      await supabase
        .from('posts')
        .update({ image: imageUrl })
        .eq('id', cardId)
    }

    await supabase
      .from('generated_images')
      .insert({
        url: imageUrl,
        prompt: finalPrompt,
        tags: promptData?.tags || [],
        tech_name: techName || '',
        card_id: cardId || null
      })

    await supabase
      .from('image_quota')
      .upsert({
        date: today,
        count: currentUsage + 1
      }, { onConflict: 'date' })

    res.json({
      code: 200,
      message: 'success',
      data: {
        imageUrl,
        prompt: finalPrompt,
        tags: promptData?.tags || [],
        remainingQuota: DAILY_QUOTA - currentUsage - 1
      }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

export async function getQuotaStatus(req, res) {
  try {
    const today = new Date().toISOString().split('T')[0]
    const { data: usage } = await supabase
      .from('image_quota')
      .select('count')
      .eq('date', today)
      .single()

    const currentUsage = usage?.count || 0

    res.json({
      code: 200,
      message: 'success',
      data: {
        dailyQuota: DAILY_QUOTA,
        currentUsage,
        remaining: DAILY_QUOTA - currentUsage,
        date: today
      }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

export async function matchImageToCard(req, res) {
  try {
    const { cardId, cardTags } = req.body

    const { data: images } = await supabase
      .from('generated_images')
      .select('*')
      .order('created_at', { ascending: false })

    let bestMatch = null
    let bestScore = 0

    for (const img of (images || [])) {
      const score = calculateSimilarity(cardTags || [], img.tags || [])
      if (score > bestScore && score > 0.3) {
        bestScore = score
        bestMatch = img
      }
    }

    if (bestMatch) {
      res.json({
        code: 200,
        message: 'success',
        data: {
          imageUrl: bestMatch.url,
          score: bestScore,
          matched: true
        }
      })
    } else {
      res.json({
        code: 200,
        message: 'success',
        data: { imageUrl: '', score: 0, matched: false }
      })
    }
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}
