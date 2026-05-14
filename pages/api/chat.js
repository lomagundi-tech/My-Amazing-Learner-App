/**
 * /api/chat — Sparky AI proxy
 *
 * Multi-provider with automatic fallback: Anthropic → OpenAI → Gemini
 * Smart model routing: child mode uses lighter models, parent uses smarter ones.
 * Context trimming and token budgets are handled in aiProviders.js.
 *
 * API keys are read from process.env ONLY — never from client requests.
 */

import { callWithFallback } from '../../src/utils/aiProviders'

const SYSTEM_PROMPTS = {
  parent: `You are Sparky, a friendly UK primary school education assistant for My Amazing Learner — a family-run business in Gosport selling laminated educational resources, velcro mats, and personalised literacy/numeracy packs for ages 3-11 (covering EYFS, KS1, KS2). Help parents understand their child's learning, suggest activities that complement physical products, explain UK curriculum expectations (EYFS, KS1, KS2), give SEN advice, and recommend relevant My Amazing Learner products. Be warm, practical, and knowledgeable. Keep responses concise and helpful.`,
  child: `You are Sparky, a super friendly learning buddy for children aged 3-11. Use simple, encouraging language. Give short, fun answers. Use emojis! Help with reading, maths, spelling, and creative activities. Be encouraging, never make the child feel bad for wrong answers. Celebrate learning!`,
}

const LANG_NAMES = {
  en: 'English',
  cy: 'Welsh',
  pl: 'Polish',
  ur: 'Urdu',
  bn: 'Bengali',
  pa: 'Punjabi',
  gu: 'Gujarati',
  hi: 'Hindi',
  ar: 'Arabic',
  fr: 'French',
  es: 'Spanish',
  pt: 'Portuguese',
  ro: 'Romanian',
  zh: 'Mandarin Chinese',
  tr: 'Turkish',
  so: 'Somali',
}

// In-memory rate limiter (resets on cold start — fine for MVP)
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
  const allowedOrigins = [
    'https://app.myamazinglearner.co.uk',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
  ]
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

  const { messages, mode, childName, lang } = req.body
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request.' })
  }

  // Append child name to system prompt so Sparky always addresses them personally
  let systemPrompt = SYSTEM_PROMPTS[mode] ?? SYSTEM_PROMPTS.child
  if (childName && typeof childName === 'string' && childName.trim().length <= 20) {
    systemPrompt += ` The child's name is ${childName.trim()}. Always address them by name.`
  }
  const langName = LANG_NAMES[lang] || 'English'
  if (lang && lang !== 'en') {
    systemPrompt += ` IMPORTANT: The user's selected language is ${langName}. Always respond in ${langName}, regardless of what language the user writes in. Keep your entire response in ${langName}.`
  }

  try {
    const result = await callWithFallback({
      messages,
      systemPrompt,
      mode: mode ?? 'child',
      env: process.env,
    })
    return res.status(200).json({ content: result.text })
  } catch (err) {
    if (err.message === 'NO_PROVIDERS') {
      return res.status(500).json({ error: 'Sparky is having a nap! Try again in a moment. 😴' })
    }
    return res.status(500).json({ error: 'Sparky is having a nap! Try again in a moment. 😴' })
  }
}
