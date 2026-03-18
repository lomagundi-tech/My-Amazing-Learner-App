/**
 * Multi-provider AI configuration for Sparky.
 *
 * Priority order: Anthropic → OpenAI → Gemini
 * Each provider is skipped if its env key is not set.
 * On rate-limit / quota / auth errors the next provider is tried automatically.
 *
 * Smart model routing:
 *   child mode  → faster / cheaper model  (lower token budget)
 *   parent mode → smarter / larger model  (higher token budget)
 *
 * Context trimming: only the last MAX_HISTORY messages are forwarded to
 * any provider to keep costs down and avoid context-window overflows.
 */

export const MAX_HISTORY = 20   // messages kept per call
export const MAX_TOKENS  = { child: 350, parent: 900 }

// Status codes that mean "this provider is exhausted — try the next one"
const FALLBACK_CODES = new Set([401, 403, 429, 503])

/* ── Provider definitions ──────────────────────────────────────── */

const PROVIDERS = [
  /* ── 1. Anthropic Claude ────────────────────────────────────── */
  {
    id:   'anthropic',
    name: 'Claude',
    envKey: 'ANTHROPIC_API_KEY',
    models: {
      child:  'claude-haiku-4-5-20251001',   // fast + cheap
      parent: 'claude-sonnet-4-20250514',    // smart + thorough
    },
    async call({ messages, systemPrompt, mode, apiKey, maxTokens }) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type':      'application/json',
          'x-api-key':          apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model:      this.models[mode] ?? this.models.parent,
          max_tokens: maxTokens,
          system:     systemPrompt,
          messages,
        }),
      })
      if (!res.ok) return { ok: false, status: res.status }
      const data = await res.json()
      return { ok: true, text: data.content[0].text, provider: this.name, model: this.models[mode] }
    },
  },

  /* ── 2. OpenAI ──────────────────────────────────────────────── */
  {
    id:   'openai',
    name: 'GPT',
    envKey: 'OPENAI_API_KEY',
    models: {
      child:  'gpt-4o-mini',   // fast + cheap
      parent: 'gpt-4o',        // smart + large context
    },
    async call({ messages, systemPrompt, mode, apiKey, maxTokens }) {
      // OpenAI uses a single messages array with a system role entry
      const oaiMessages = [
        { role: 'system', content: systemPrompt },
        ...messages,
      ]
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model:      this.models[mode] ?? this.models.parent,
          max_tokens: maxTokens,
          messages:   oaiMessages,
        }),
      })
      if (!res.ok) return { ok: false, status: res.status }
      const data = await res.json()
      return { ok: true, text: data.choices[0].message.content, provider: this.name, model: this.models[mode] }
    },
  },

  /* ── 3. Google Gemini ───────────────────────────────────────── */
  {
    id:   'gemini',
    name: 'Gemini',
    envKey: 'GEMINI_API_KEY',
    models: {
      child:  'gemini-1.5-flash',   // fast + cheap
      parent: 'gemini-1.5-pro',     // large context (1M tokens)
    },
    async call({ messages, systemPrompt, mode, apiKey, maxTokens }) {
      const model = this.models[mode] ?? this.models.parent
      const url   = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

      // Convert role format: Anthropic uses 'user'/'assistant', Gemini uses 'user'/'model'
      const contents = messages.map((m) => ({
        role:  m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig:  { maxOutputTokens: maxTokens },
        }),
      })
      if (!res.ok) return { ok: false, status: res.status }
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) return { ok: false, status: 500 }
      return { ok: true, text, provider: this.name, model }
    },
  },
]

/* ── Public helpers ────────────────────────────────────────────── */

/**
 * Returns the ordered list of providers that have an API key set in env.
 * Preserves priority order: Anthropic → OpenAI → Gemini.
 */
export function getAvailableProviders(env) {
  return PROVIDERS.filter((p) => !!env[p.envKey])
}

/**
 * Try each available provider in order.
 * Falls back to next on FALLBACK_CODES or network error.
 * Returns { text, provider, model } on success, or throws if all fail.
 */
export async function callWithFallback({ messages, systemPrompt, mode, env }) {
  const available = getAvailableProviders(env)
  if (available.length === 0) throw new Error('NO_PROVIDERS')

  // Trim history to keep costs low
  const trimmed = messages.slice(-MAX_HISTORY)
  const maxTokens = MAX_TOKENS[mode] ?? MAX_TOKENS.parent

  let lastStatus = null

  for (const provider of available) {
    const apiKey = env[provider.envKey]
    try {
      const result = await provider.call({ messages: trimmed, systemPrompt, mode, apiKey, maxTokens })
      if (result.ok) return result
      lastStatus = result.status
      // Only fall through for exhaustion/auth codes; re-throw server errors
      if (!FALLBACK_CODES.has(result.status)) {
        throw new Error(`Provider ${provider.name} error: ${result.status}`)
      }
      // else: try next provider silently
    } catch (err) {
      // Network error on this provider — try next
      lastStatus = lastStatus ?? 500
    }
  }

  throw new Error(`All providers failed. Last status: ${lastStatus}`)
}
