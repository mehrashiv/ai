'use client'

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

export default function ChatPage() {
  const [input, setInput] = useState('')

  // v6: useChat takes a `transport` instead of just `api`
  // DefaultChatTransport handles the fetch + streaming protocol
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const isBusy = status === 'submitted' || status === 'streaming'

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!input.trim() || isBusy) return

    // v6: was `append({ role: 'user', content })`, now `sendMessage({ text })`
    sendMessage({ text: input })
    setInput('')
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">

      <div className="w-full max-w-xl mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chat + Tool Calling</h1>
        <p className="text-sm text-gray-500 mt-1">
          Try: <em>"What's the weather in Tokyo?"</em> or{' '}
          <em>"Compare weather in Paris and NYC"</em>
        </p>
      </div>

      <div className="w-full max-w-xl flex flex-col gap-3 mb-6">
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-10">No messages yet.</p>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-xl px-4 py-2 max-w-sm text-sm whitespace-pre-wrap break-words overflow-hidden ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}
            >
              {/* v6: messages have a `parts` array, not a `content` string.
                  Text lives in parts with type 'text'.
                  Tool calls have type 'tool-{toolName}' e.g. 'tool-getWeather'. */}
              {message.parts.map((part, i) => {
                if (part.type === 'text') {
                  return <span key={i}>{part.text}</span>
                }

                // Tool call parts: type is 'tool-getWeather', 'tool-getLocation', etc.
                if (part.type.startsWith('tool-')) {
                  // Cast to access the fields we care about — ignore provider metadata
                  const p = part as { type: string; input?: unknown; output?: unknown }
                  return (
                    <div
                      key={i}
                      className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-xs font-mono overflow-hidden"
                    >
                      <div className="font-semibold text-yellow-700 mb-1">
                        🔧 {part.type.replace('tool-', '')}
                      </div>
                      {p.input !== undefined && (
                        <div className="text-gray-500 truncate">
                          In: {JSON.stringify(p.input)}
                        </div>
                      )}
                      {p.output !== undefined && (
                        <div className="text-gray-700 mt-1 break-words">
                          Out: {JSON.stringify(p.output)}
                        </div>
                      )}
                    </div>
                  )
                }

                return null
              })}
            </div>
          </div>
        ))}

        {isBusy && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-400">
              Thinking…
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xl flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask something..."
          disabled={isBusy}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={isBusy || !input.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm
                     disabled:opacity-50 hover:bg-blue-700 transition-colors"
        >
          {isBusy ? 'Thinking…' : 'Send'}
        </button>
      </form>
    </main>
  )
}