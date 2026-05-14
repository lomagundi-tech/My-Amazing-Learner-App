import { useEffect, useState } from 'react'

export function useChat(childName, mode, lang = 'en', openingMessage, errorMessage) {
  const openingContent = openingMessage?.content || ''
  const [messages, setMessages] = useState([{ role: 'assistant', content: openingContent }])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  useEffect(() => {
    setMessages([{ role: 'assistant', content: openingContent }])
    setError(null)
  }, [openingContent])

  async function sendChat(text, mode) {
    if (!text.trim()) return
    setError(null)

    const userMsg = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)

    try {
      // Exclude the pre-populated opening message from the API call
      const apiMessages = updated
        .slice(1) // skip opening assistant message
        .map(({ role, content }) => ({ role, content }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, mode, childName, lang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      const reply = data.content
      setMessages([...updated, { role: 'assistant', content: reply }])
    } catch (err) {
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  function clearChat() {
    setMessages([{ role: 'assistant', content: openingContent }])
    setError(null)
  }

  return { messages, input, setInput, loading, error, sendChat, clearChat }
}
