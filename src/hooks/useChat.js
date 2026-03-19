import { useState } from 'react'
import { sendMessage } from '../utils/api'

export function useChat(childName, mode) {
  const isChild = mode === 'child'

  const greeting = isChild
    ? childName
      ? `Hi ${childName}! 🔮 I'm Sparky, your Amazing Learning helper! Ask me anything — maths, reading, spelling, or anything you're curious about. What would you like to explore today?`
      : `Hi there! 🔮 I'm Sparky, your Amazing Learning helper! Ask me anything — maths, reading, spelling, or anything you're curious about. What would you like to explore today?`
    : childName
      ? `Hi! 🔮 I'm Sparky, your Amazing Learning assistant. I'm here to help support ${childName}'s learning journey. Ask me anything — curriculum questions, SEN advice, activity ideas, or how ${childName} is getting on. What would you like to explore today?`
      : `Hi! 🔮 I'm Sparky, your Amazing Learning assistant. Ask me anything — curriculum questions, SEN advice, activity ideas, or how your child is getting on. What would you like to explore today?`

  const [messages, setMessages] = useState([{ role: 'assistant', content: greeting }])
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

      const reply = await sendMessage(apiMessages, mode, childName)
      setMessages([...updated, { role: 'assistant', content: reply }])
    } catch (err) {
      setError("Sparky is having a nap! Try again in a moment. 😴")
    } finally {
      setLoading(false)
    }
  }

  function clearChat() {
    setMessages([{ role: 'assistant', content: greeting }])
    setError(null)
  }

  return { messages, input, setInput, loading, error, sendChat, clearChat }
}
