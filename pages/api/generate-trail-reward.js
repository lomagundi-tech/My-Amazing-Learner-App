import { kv } from '@vercel/kv'

const ALLOWED_TRAIL_IDS = ['hms-alliance-gosport']
const CODE_TTL_SECONDS  = 172800 // 48 hours

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const suffix = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `EXPLORE-${suffix}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { deviceId, trailId } = req.body

  if (!deviceId || typeof deviceId !== 'string' || deviceId.length > 64) {
    return res.status(400).json({ error: 'Invalid deviceId' })
  }
  if (!trailId || !ALLOWED_TRAIL_IDS.includes(trailId)) {
    return res.status(400).json({ error: 'Invalid trailId' })
  }

  const kvKey = `trail:reward:${trailId}:${deviceId}`

  try {
    const existing = await kv.get(kvKey)
    if (existing) {
      const data = typeof existing === 'string' ? JSON.parse(existing) : existing
      if (new Date(data.expiresAt) > new Date()) {
        return res.status(200).json({ code: data.code, issuedAt: data.issuedAt, expiresAt: data.expiresAt })
      }
    }

    const code      = generateCode()
    const issuedAt  = new Date().toISOString()
    const expiresAt = new Date(Date.now() + CODE_TTL_SECONDS * 1000).toISOString()
    const codeData  = { code, issuedAt, expiresAt }

    await kv.set(kvKey, codeData, { ex: CODE_TTL_SECONDS })

    return res.status(200).json(codeData)
  } catch (err) {
    console.error('KV error:', err)
    return res.status(503).json({ error: 'Could not generate code. Please try again.' })
  }
}
