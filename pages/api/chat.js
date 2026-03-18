// Anthropic API proxy — Phase 2 implementation
// API key is read from process.env ONLY — never from client-side code

const SYSTEM_PROMPTS = {
  parent: `You are Sparky, a friendly UK primary school education assistant for My Amazing Learner — a family-run business in Gosport selling laminated educational resources, velcro mats, and personalised literacy/numeracy packs for ages 3-11 (covering EYFS, KS1, KS2). Help parents understand their child's learning, suggest activities that complement physical products, explain UK curriculum expectations (EYFS, KS1, KS2), give SEN advice, and recommend relevant My Amazing Learner products. Be warm, practical, and knowledgeable. Keep responses concise and helpful.`,
  child: `You are Sparky, a super friendly learning buddy for children aged 3-11. Use simple, encouraging language. Give short, fun answers. Use emojis! Help with reading, maths, spelling, and creative activities. Be encouraging, never make the child feel bad for wrong answers. Celebrate learning!`,
}

// In-memory rate limiter (resets on cold start — sufficient for MVP)
const rateLimitMap = new Map()

function checkRateLimit(ip) {
  const now = Date.now()
  const windowMs = 60 * 1000
  const maxRequests = 20

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, start: now })
    return true
  }

  const entry = rateLimitMap.get(ip)
  if (now - entry.start > windowMs) {
    rateLimitMap.set(ip, { count: 1, start: now })
    return true
  }

  if (entry.count >= maxRequests) return false
  entry.count++
  return true
}

export default async function handler(req, res) {
  // CORS — restrict to own domain in production
  const origin = req.headers.origin
  const allowedOrigins = ['https://app.myamazinglearner.co.uk', 'http://localhost:3000']
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Rate limit
  const ip = req.headers['x-forwarded-for']?.split(',')[0] ?? req.socket.remoteAddress ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Sparky is having a nap! Try again in a moment. 😴' })
  }

  const { messages, mode } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request.' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Sparky is having a nap! Try again in a moment. 😴' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPTS[mode] ?? SYSTEM_PROMPTS.child,
        messages,
      }),
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`)
    }

    const data = await response.json()
    return res.status(200).json({ content: data.content[0].text })
  } catch {
    return res.status(500).json({ error: 'Sparky is having a nap! Try again in a moment. 😴' })
  }
}
