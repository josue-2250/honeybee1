import { useState } from 'react'
import { Sparkles, Star, Plus, Check, Trash2 } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Modal from '../components/Modal'
import PageBackground from '../components/PageBackground'
import type { Wish, WishFilter } from '../types'
import { formatDate, uid } from '../utils/helpers'

const sparklePositions = [
  { top: '12%', left: '8%', size: 14, opacity: 0.4 },
  { top: '25%', right: '12%', size: 10, opacity: 0.3 },
  { top: '60%', left: '15%', size: 12, opacity: 0.35 },
  { top: '75%', right: '20%', size: 16, opacity: 0.25 },
  { top: '40%', left: '45%', size: 8, opacity: 0.2 },
]

const FILTERS: { key: WishFilter; label: string }[] = [
  { key: 'pending', label: 'Pending Wishes' },
  { key: 'fulfilled', label: 'Fulfilled Dreams' },
  { key: 'all', label: 'All' },
]

export default function WishesPage() {
  const [wishes, setWishes] = useLocalStorage<Wish[]>('honeybee:wishes', [])
  const [filter, setFilter] = useState<WishFilter>('pending')
  const [showAdd, setShowAdd] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const filtered = wishes.filter((w) => {
    if (filter === 'pending') return !w.fulfilled
    if (filter === 'fulfilled') return w.fulfilled
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (a.fulfilled !== b.fulfilled) return a.fulfilled ? 1 : -1
    return b.createdAt - a.createdAt
  })

  const handleAdd = () => {
    const trimmed = title.trim()
    if (!trimmed) return
    setWishes((prev) => [
      {
        id: uid(),
        title: trimmed,
        description: description.trim(),
        fulfilled: false,
        createdAt: Date.now(),
      },
      ...prev,
    ])
    setTitle('')
    setDescription('')
    setShowAdd(false)
  }

  const toggleFulfilled = (id: string) => {
    setWishes((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              fulfilled: !w.fulfilled,
              fulfilledAt: !w.fulfilled ? Date.now() : undefined,
            }
          : w,
      ),
    )
  }

  const deleteWish = (id: string) => {
    setWishes((prev) => prev.filter((w) => w.id !== id))
  }

  return (
    <PageBackground
      image="/backgrounds/wishes.png"
      className="page-enter min-h-[calc(100svh-5rem)] md:min-h-svh"
    >
      {sparklePositions.map((pos, i) => (
        <Star
          key={i}
          size={pos.size}
          className="pointer-events-none absolute fill-indigo-200/60 text-white"
          style={{
            top: pos.top,
            left: 'left' in pos ? pos.left : undefined,
            right: 'right' in pos ? pos.right : undefined,
            opacity: pos.opacity,
          }}
        />
      ))}

      <header className="relative z-10 border-b border-rose-100/20 bg-[#5c284a]/55 px-4 py-4 backdrop-blur-md md:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 shadow-soft">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Our Wishes</h2>
              <p className="text-xs text-white">
                {wishes.filter((w) => !w.fulfilled).length} dreams to chase
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 rounded-2xl border border-stone-200 bg-black/30 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:border-stone-300 hover:shadow-md"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Wish</span>
          </button>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-5 md:px-8">
        <div className="love-banner mb-5">
          <span>✦</span>
          <p>Dream it, write it, make it ours.</p>
          <span>✦</span>
        </div>
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`shrink-0 rounded-2xl px-4 py-2 text-sm font-medium transition ${
                filter === f.key
                  ? 'border border-stone-200 bg-black/30 text-white shadow-sm'
                  : 'border border-transparent bg-black/30 text-white hover:bg-black/20'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Sparkles size={48} className="mb-4 text-white" strokeWidth={1.5} />
            <h3 className="mb-2 text-lg font-medium text-white">
              {filter === 'fulfilled' ? 'No fulfilled dreams yet' : 'No wishes yet'}
            </h3>
            <p className="mb-6 max-w-sm text-sm text-white">
              {filter === 'fulfilled'
                ? 'When a wish comes true, mark it fulfilled here.'
                : 'Add dream dates, travel plans, or relationship goals.'}
            </p>
            {filter !== 'fulfilled' && (
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="rounded-2xl border border-stone-200 bg-black/30 px-6 py-3 text-sm font-medium text-white shadow-sm"
              >
                Add your first wish
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((wish) => (
              <div
                key={wish.id}
                className={`group rounded-2xl border border-stone-200 bg-black/30 p-4 shadow-sm transition hover:border-stone-300 hover:shadow-md ${
                  wish.fulfilled ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleFulfilled(wish.id)}
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
                      wish.fulfilled
                        ? 'border-indigo-400 bg-indigo-400 text-white'
                        : 'border-indigo-200 text-transparent hover:border-indigo-300'
                    }`}
                    aria-label={wish.fulfilled ? 'Mark as pending' : 'Mark as fulfilled'}
                  >
                    <Check size={14} strokeWidth={3} />
                  </button>

                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-medium text-white ${
                        wish.fulfilled ? 'line-through decoration-indigo-300' : ''
                      }`}
                    >
                      {wish.title}
                    </h3>
                    {wish.description && (
                      <p className="mt-1 text-sm text-white">{wish.description}</p>
                    )}
                    <p className="mt-2 text-xs text-white">
                      {wish.fulfilled && wish.fulfilledAt
                        ? `Granted ${formatDate(new Date(wish.fulfilledAt).toISOString().slice(0, 10))}`
                        : `Added ${formatDate(new Date(wish.createdAt).toISOString().slice(0, 10))}`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteWish(wish.id)}
                    className="shrink-0 rounded-xl p-1.5 text-white opacity-0 transition group-hover:opacity-100 hover:bg-indigo-50 hover:text-white"
                    aria-label="Delete wish"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Wish">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/70">Wish</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Trip to Paris, learn to cook together..."
              className="w-full rounded-2xl border border-stone-200 bg-black/20 px-4 py-2.5 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/70">
              Details (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any notes or plans..."
              rows={3}
              className="w-full resize-none rounded-2xl border border-stone-200 bg-black/20 px-4 py-2.5 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!title.trim()}
            className="w-full rounded-2xl bg-indigo-400 py-2.5 text-sm font-medium text-white shadow-soft transition hover:bg-indigo-500 disabled:opacity-40"
          >
            Add Wish
          </button>
        </div>
      </Modal>
    </PageBackground>
  )
}
