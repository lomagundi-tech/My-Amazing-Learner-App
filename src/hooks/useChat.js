import { useState } from 'react'
import { sendMessage } from '../utils/api'

const OPENING_MESSAGE = {
  role: 'assistant',
  content: "Hi there! 🔮 I'm Sparky, your Amazing Learning helper! Ask me anything — maths, reading, spelling, or just how your child is doing. What would you like to explore today?",
}

export function useChat(childName) {
  const greeting = childName
    ? OPENING_MESSAGE.content.replace("Hi there!", `Hi ${childName}!`)
    : OPENING_MESSAGE.content

  const [messages, setMessages] = useState([{ ...OPENING_MESSAGE, content: greeting }])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

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

      const reply = await sendMessage(apiMessages, mode)
      setMessages([...updated, { role: 'assistant', content: reply }])
    } catch (err) {
      setError("Sparky is having a nap! Try again in a moment. 😴")
    } finally {
      setLoading(false)
    }
  }

  function clearChat() {
    setMessages([{ ...OPENING_MESSAGE, content: greeting }])
    setError(null)
  }

  return { messages, input, setInput, loading, error, sendChat, clearChat }
}
