import { useState, useRef, useEffect, useCallback } from 'react'
import {
  MessageCircle,
  Smile,
  ImageIcon,
  Send,
  Paperclip,
  Heart,
} from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useUser } from '../context/UserContext'
import UserSwitcher from '../components/UserSwitcher'
import EmojiPicker from '../components/EmojiPicker'
import GifPicker from '../components/GifPicker'
import Modal from '../components/Modal'
import PageBackground from '../components/PageBackground'
import type { ChatMessage } from '../types'
import { formatTime, readFileAsDataURL, uid } from '../utils/helpers'

const LOVE_NOTES = [
  'You make ordinary days feel like my favorite kind of magic.',
  'If I could choose one place to be, it would always be beside you.',
  'You are the soft thought that makes me smile for no reason.',
  'Life is sweeter because I get to share its little moments with you.',
  'My favorite memories are the ones that have you in them.',
]

function MessageBubble({
  message,
  isSent,
  senderName,
}: {
  message: ChatMessage
  isSent: boolean
  senderName: string
}) {
  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[86%] min-[480px]:max-w-[78%] sm:max-w-[70%] ${
          isSent ? 'items-end' : 'items-start'
        } flex flex-col gap-1`}
      >
        {!isSent && (
          <span className="px-1 text-[10px] font-medium text-white/60">
            {senderName}
          </span>
        )}
        <div
          className={`overflow-hidden rounded-2xl shadow-soft ${
            isSent
              ? 'rounded-br-md bg-honey-400 text-white'
              : 'rounded-bl-md bg-black/30 text-white/90'
          }`}
        >
          {message.type === 'text' && (
            <p className="px-3 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words sm:px-3.5 sm:text-[15px]">
              {message.content}
            </p>
          )}
          {message.type === 'gif' && (
            <img
              src={message.content}
              alt="GIF"
              className="max-h-48 w-full object-cover"
            />
          )}
          {message.type === 'image' && (
            <img
              src={message.content}
              alt="Shared photo"
              className="max-h-64 w-full object-cover"
            />
          )}
        </div>
        <span
          className={`px-1 text-[10px] text-white/60 ${
            isSent ? 'text-right' : 'text-left'
          }`}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  )
}

export default function ChatPage() {
  const { activeUser, nameFor } = useUser()
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>(
    'honeybee:messages',
    [],
  )
  const [text, setText] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [showGif, setShowGif] = useState(false)
  const [noteIndex, setNoteIndex] = useState(
    () => new Date().getDate() % LOVE_NOTES.length,
  )

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const onResize = () => scrollToBottom()
    vv.addEventListener('resize', onResize)
    return () => vv.removeEventListener('resize', onResize)
  }, [scrollToBottom])

  const sendMessage = (partial: Omit<ChatMessage, 'id' | 'timestamp' | 'senderId'>) => {
    setMessages((prev) => [
      ...prev,
      {
        id: uid(),
        senderId: activeUser,
        timestamp: Date.now(),
        ...partial,
      },
    ])
  }

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    sendMessage({ type: 'text', content: trimmed })
    setText('')
    setShowEmoji(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleEmoji = (emoji: string) => {
    setText((t) => t + emoji)
    inputRef.current?.focus()
  }

  const handleGif = (url: string) => {
    sendMessage({ type: 'gif', content: url })
    setShowGif(false)
  }

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    const dataUrl = await readFileAsDataURL(file)
    sendMessage({ type: 'image', content: dataUrl })
    e.target.value = ''
  }

  return (
    <PageBackground
      image="/backgrounds/chat.png"
      className="chat-page page-enter flex flex-col md:h-svh"
    >
      <header className="z-10 shrink-0 border-b border-rose-100/20 bg-[#5c284a]/55 px-3 py-2.5 backdrop-blur-md sm:px-4 sm:py-3 md:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 sm:gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-honey-200 shadow-soft sm:h-10 sm:w-10">
              <MessageCircle size={18} className="text-honey-600 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-white sm:text-lg">Honey Chat</h2>
              <p className="truncate text-[11px] text-rose-100/70 sm:text-xs">Sending love as {nameFor(activeUser)}</p>
            </div>
          </div>
          <UserSwitcher compact />
        </div>
      </header>

      <div className="shrink-0 px-3 pt-2.5 sm:px-4 sm:pt-3 md:px-8">
        <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-2xl border border-rose-100/20 bg-rose-100/10 px-2.5 py-2 shadow-soft backdrop-blur-sm sm:gap-3 sm:px-3 sm:py-2.5">
          <button
            type="button"
            onClick={() => setNoteIndex((current) => (current + 1) % LOVE_NOTES.length)}
            className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-300/20 text-rose-200 transition hover:scale-110 hover:bg-rose-300 hover:text-rose-950"
            aria-label="Reveal another love note"
            title="Reveal another love note"
          >
            <Heart size={17} className="fill-current transition group-hover:animate-pulse" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-semibold tracking-[0.12em] text-rose-200/75 uppercase sm:text-[10px] sm:tracking-[0.16em]">A little love note</p>
            <p className="line-clamp-2 font-serif text-xs leading-snug text-white/95 min-[380px]:text-sm sm:whitespace-normal">“{LOVE_NOTES[noteIndex]}”</p>
          </div>
          <button
            type="button"
            onClick={() => sendMessage({ type: 'text', content: `A little note for you: ${LOVE_NOTES[noteIndex]} ♥` })}
            className="shrink-0 rounded-xl border border-rose-100/25 px-2 py-1.5 text-[11px] font-semibold text-rose-100 transition hover:bg-rose-100/15 sm:px-2.5 sm:text-xs"
          >
            Send ♥
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 sm:px-4 sm:py-4 md:px-8"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center sm:py-16">
              <div className="love-note max-w-md rounded-[2rem] px-5 py-6 sm:px-7 sm:py-8">
                <Heart size={34} className="mx-auto mb-4 fill-rose-300 text-rose-300" />
                <p className="font-serif text-xl text-white">For all our little moments</p>
                <p className="mt-2 text-sm leading-relaxed text-rose-100/80">
                  Say something sweet—your next favorite memory can start with one message.
                </p>
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isSent={msg.senderId === activeUser}
              senderName={nameFor(msg.senderId)}
            />
          ))}
        </div>
      </div>

      {showEmoji && (
        <div className="shrink-0 border-t border-stone-200 bg-black/30 px-3 py-2 sm:px-4 sm:py-3 md:px-8">
          <div className="mx-auto max-w-3xl">
            <EmojiPicker onSelect={handleEmoji} />
          </div>
        </div>
      )}

      <div className="chat-composer shrink-0 border-t border-rose-100/20 bg-[#5c284a]/55 px-2 py-2 backdrop-blur-md sm:px-3 md:px-8 md:py-3">
        <div className="mx-auto flex max-w-3xl items-end gap-1.5 sm:gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhoto}
          />

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="shrink-0 rounded-xl p-2 text-white/60 transition hover:bg-honey-50 hover:text-honey-500 sm:p-2.5"
            aria-label="Attach photo"
          >
            <Paperclip size={20} />
          </button>

          <button
            type="button"
            onClick={() => {
              setShowGif(false)
              setShowEmoji((v) => !v)
            }}
            className={`shrink-0 rounded-xl p-2 transition sm:p-2.5 ${
              showEmoji
                ? 'bg-honey-100 text-honey-600'
                : 'text-white/60 hover:bg-honey-50 hover:text-honey-500'
            }`}
            aria-label="Emoji picker"
          >
            <Smile size={20} />
          </button>

          <button
            type="button"
            onClick={() => {
              setShowEmoji(false)
              setShowGif(true)
            }}
            className="chat-gif-button shrink-0 rounded-xl p-2 text-white/60 transition hover:bg-honey-50 hover:text-honey-500 sm:p-2.5"
            aria-label="Send GIF"
          >
            <ImageIcon size={20} />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={scrollToBottom}
            placeholder="Type a message..."
            className="min-w-0 flex-1 rounded-2xl border border-stone-200 bg-black/30 px-3 py-2 text-sm outline-none transition focus:border-honey-400 focus:ring-2 focus:ring-honey-100 sm:px-4 sm:py-2.5 sm:text-[15px]"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!text.trim()}
            className="shrink-0 rounded-2xl bg-honey-400 p-2 text-white shadow-soft transition hover:bg-honey-500 disabled:opacity-40 sm:p-2.5"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      <Modal open={showGif} onClose={() => setShowGif(false)} title="Pick a GIF" wide>
        <GifPicker onSelect={handleGif} />
      </Modal>
    </PageBackground>
  )
}
