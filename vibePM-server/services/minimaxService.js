// MiniMax API 服务 - 文本生成 + 图片生成

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY
const MINIMAX_TEXT_ENDPOINT = 'https://api.minimax.chat/v1/text/chatcompletion_v2'
const MINIMAX_IMAGE_ENDPOINT = process.env.MINIMAX_IMAGE_ENDPOINT || 'https://api.minimaxi.com/v1/image_generation'

// 文本生成 - 使用MiniMax M2.7
export async function generateText(prompt, options = {}) {
  const { maxTokens = 2000, temperature = 0.7 } = options

  console.log('[MiniMax] 开始文本生成...')
  console.log('[MiniMax] API Key:', MINIMAX_API_KEY ? '已配置' : '未配置')

  try {
    const response = await fetch(MINIMAX_TEXT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.7',
        messages: [
          { role: 'system', content: '你是一个专业的技术内容创作助手，擅长为小白用户撰写通俗易懂的技术文章。' },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens,
        temperature: temperature
      })
    })

    console.log('[MiniMax] 响应状态:', response.status)

    if (!response.ok) {
      const errText = await response.text()
      console.error('[MiniMax] API错误:', response.status, errText)
      throw new Error(`MiniMax text API error: ${response.status} - ${errText}`)
    }

    const result = await response.json()
    console.log('[MiniMax] 响应结果:', JSON.stringify(result).substring(0, 200))

    const content = result.choices?.[0]?.message?.content || result.text || ''
    console.log('[MiniMax] 生成内容长度:', content.length)
    return content
  } catch (error) {
    console.error('[MiniMax] 文本生成异常:', error.message)
    throw error
  }
}

// 图片生成 - 使用MiniMax T2I
export async function generateImage(prompt, options = {}) {
  const { aspect_ratio = '1:1', n = 1 } = options

  console.log('[MiniMax] 开始图片生成...')

  try {
    const response = await fetch(MINIMAX_IMAGE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`
      },
      body: JSON.stringify({
        model: 'image-01',
        prompt: prompt,
        aspect_ratio: aspect_ratio,
        response_format: 'url',
        n: n,
        prompt_optimizer: true
      })
    })

    console.log('[MiniMax] 图片响应状态:', response.status)

    if (!response.ok) {
      const errText = await response.text()
      console.error('[MiniMax] 图片API错误:', response.status, errText)
      throw new Error(`MiniMax image API error: ${response.status} - ${errText}`)
    }

    const result = await response.json()
    console.log('[MiniMax] 图片响应:', JSON.stringify(result).substring(0, 300))

    const imageUrl = result.data?.image_urls?.[0] || result.data?.[0]?.url || result.images?.[0]?.url || ''

    if (!imageUrl) {
      throw new Error('No image URL in response')
    }

    return imageUrl
  } catch (error) {
    console.error('[MiniMax] 图片生成异常:', error.message)
    throw error
  }
}

// 批量生成内容
export async function batchGenerateContent(promptTemplate, count = 1, variables = {}) {
  const results = []

  for (let i = 0; i < count; i++) {
    // 替换变量
    let prompt = promptTemplate
    for (const [key, value] of Object.entries(variables)) {
      prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value)
    }

    try {
      const content = await generateText(prompt)
      results.push({
        success: true,
        content,
        index: i
      })
    } catch (error) {
      results.push({
        success: false,
        error: error.message,
        index: i
      })
    }

    // 避免请求过快
    if (i < count - 1) {
      await sleep(2000)
    }
  }

  return results
}

// 批量生成图片
export async function batchGenerateImages(prompts, options = {}) {
  const results = []

  for (let i = 0; i < prompts.length; i++) {
    try {
      const imageUrl = await generateImage(prompts[i], options)
      results.push({
        success: true,
        url: imageUrl,
        prompt: prompts[i],
        index: i
      })
    } catch (error) {
      results.push({
        success: false,
        error: error.message,
        prompt: prompts[i],
        index: i
      })
    }

    // 避免请求过快
    if (i < prompts.length - 1) {
      await sleep(3000)
    }
  }

  return results
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default {
  generateText,
  generateImage,
  batchGenerateContent,
  batchGenerateImages
}
